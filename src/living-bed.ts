// Experimental rules only. No production crop rules or save schema are changed.
export type BedKind='radish'|'lettuce'|'pea'|'thyme'|'wildflower';
export type BedMix='kitchen'|'pollinator'|'herbs';
export type BedPlant={kind:BedKind;growth:number;flowering:boolean;flowerDays:number;removed:boolean;seedTaken:boolean};
export type LivingBed={day:number;prepared:boolean;mix:BedMix|null;moisture:number;mulched:boolean;evaporation:number;weather:'sunny'|'rain';plants:BedPlant[];basket:Partial<Record<BedKind,number>>;seeds:number;seedStock:Record<BedKind,number>};
export const bedKinds:Record<BedKind,{name:string;days:number;perennial:boolean}>={radish:{name:'Retek',days:3,perennial:false},lettuce:{name:'Saláta',days:2,perennial:false},pea:{name:'Borsó',days:6,perennial:true},thyme:{name:'Kakukkfű',days:3,perennial:true},wildflower:{name:'Vadvirág',days:3,perennial:true}};
export const bedMixes:Record<BedMix,{name:string;detail:string;plants:BedKind[]}>={
 kitchen:{name:'Konyhakerti társítás',detail:'Retek · saláta · kakukkfű · vadvirág',plants:['radish','lettuce','wildflower','thyme','radish','lettuce','thyme','wildflower','radish']},
 pollinator:{name:'Virágos zöldséges',detail:'Borsó · retek · kakukkfű · vadvirág',plants:['pea','radish','wildflower','thyme','pea','radish','thyme','wildflower','pea']},
 herbs:{name:'Illatos szegély',detail:'Kakukkfű · saláta · vadvirág',plants:['thyme','lettuce','wildflower','thyme','wildflower','lettuce','thyme','wildflower','thyme']}
};
export const BED_WATER_CAPACITY=3;
export const createLivingBed=(day=1):LivingBed=>({day,prepared:false,mix:null,moisture:1,mulched:false,evaporation:0,weather:'sunny',plants:[],basket:{},seeds:0,seedStock:{radish:9,lettuce:9,pea:9,thyme:9,wildflower:9}});
export function prepareLivingBed(s:LivingBed){if(s.prepared)return null;return {...structuredClone(s),prepared:true};}
export function plantLivingBed(s:LivingBed,mix:BedMix):LivingBed|null{if(!s.prepared||s.mix)return null;const counts:Partial<Record<BedKind,number>>={};for(const kind of bedMixes[mix].plants)counts[kind]=(counts[kind]??0)+1;if(Object.entries(counts).some(([kind,n])=>s.seedStock[kind as BedKind]<n))return null;const next=structuredClone(s);for(const [kind,n]of Object.entries(counts))next.seedStock[kind as BedKind]-=n;next.mix=mix;next.plants=bedMixes[mix].plants.map(kind=>({kind,growth:0,flowering:false,flowerDays:0,removed:false,seedTaken:false}));return next;}
export function waterLivingBed(s:LivingBed){if(!s.prepared||s.moisture>=BED_WATER_CAPACITY)return null;return {...structuredClone(s),moisture:BED_WATER_CAPACITY,evaporation:0};}
export function mulchLivingBed(s:LivingBed){if(!s.prepared||s.mulched)return null;return {...structuredClone(s),mulched:true};}
export function bedPlantStage(p:BedPlant){if(p.removed)return 'picked';if(p.flowering)return p.flowerDays>=2?'seed':'flowering';return p.growth>=bedKinds[p.kind].days?(p.kind==='wildflower'?'flowering':'ready'):'growing';}
export function advanceLivingBed(s:LivingBed,weather:'sunny'|'rain'):LivingBed{
 const next=structuredClone(s);next.day++;next.weather=weather;
 if(!next.prepared)return next;
 if(weather==='rain'){next.moisture=BED_WATER_CAPACITY;next.evaporation=0;}
 const moist=next.moisture>0;
 for(const p of next.plants){if(p.removed||!moist)continue;if(p.flowering){p.flowerDays++;continue;}p.growth++;if(p.kind==='wildflower'&&p.growth>=bedKinds.wildflower.days){p.flowering=true;p.flowerDays=0;}}
 if(weather!=='rain'){next.evaporation++;if(next.evaporation>=(next.mulched?2:1)){next.moisture=Math.max(0,next.moisture-1);next.evaporation=0;}}
 return next;
}
export function flowerLivingPlant(s:LivingBed,index:number){const p=s.plants[index];if(!p||bedPlantStage(p)!=='ready')return null;const next=structuredClone(s);next.plants[index].flowering=true;return next;}
export function harvestLivingPlant(s:LivingBed,index:number){const p=s.plants[index];if(!p||bedPlantStage(p)!=='ready')return null;const next=structuredClone(s),plant=next.plants[index];next.basket[p.kind]=(next.basket[p.kind]??0)+1;if(bedKinds[p.kind].perennial)plant.growth=0;else plant.removed=true;return next;}
export function collectLivingSeeds(s:LivingBed,index:number){const p=s.plants[index];if(!p||bedPlantStage(p)!=='seed'||p.seedTaken)return null;const next=structuredClone(s);next.seeds++;next.seedStock[p.kind]++;next.plants[index].seedTaken=true;return next;}
export const livingFlowers=(s:LivingBed)=>s.plants.filter(p=>!p.removed&&p.flowering&&p.flowerDays<2).length;

export function replantLivingSpot(s:LivingBed,index:number,kind:BedKind){if(!s.mix||!s.plants[index]?.removed||!bedMixes[s.mix].plants.includes(kind)||s.seedStock[kind]<1)return null;const next=structuredClone(s);next.seedStock[kind]--;next.plants[index]={kind,growth:0,flowering:false,flowerDays:0,removed:false,seedTaken:false};return next;}
