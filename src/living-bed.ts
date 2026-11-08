import {setsFruit,RIPE_FRUIT_DAYS,type PollinationContext} from './pollination';
// Shared bed rules used by the farm and the isolated gardening trial.
export type BedKind='radish'|'lettuce'|'pea'|'thyme'|'wildflower'|'oregano'|'sage'|'tomato'|'pepper'|'cucumber'|'strawberry'|'carrot'|'calendula'|'borage'|'chamomile'|'lemonBalm';
export type BedMix='kitchen'|'pollinator'|'herbs'|'strawberry'|'tea';
export type BedPlant={questFlower?:boolean;kind:BedKind;growth:number;flowering:boolean;flowerDays:number;removed:boolean;seedTaken:boolean;cycle?:number;fruitSet?:boolean;ripeDays?:number;aftermath?:'empty'|'overripe'};
export type LivingBed={day:number;prepared:boolean;mix:BedMix|null;moisture:number;mulched:boolean;evaporation:number;weather:'sunny'|'rain';plants:BedPlant[];basket:Partial<Record<BedKind,number>>;seeds:number;seedStock:Record<BedKind,number>;unwateredDays?:number;layout?:BedKind[]};
export const bedKinds:Record<BedKind,{name:string;days:number;perennial:boolean}>={
 radish:{name:'Retek',days:3,perennial:false},lettuce:{name:'Saláta',days:2,perennial:false},pea:{name:'Borsó',days:4,perennial:true},thyme:{name:'Kakukkfű',days:3,perennial:true},wildflower:{name:'Vadvirág',days:3,perennial:true},
 oregano:{name:'Szurokfű',days:3,perennial:true},sage:{name:'Zsálya',days:3,perennial:true},tomato:{name:'Paradicsom',days:4,perennial:true},pepper:{name:'Paprika',days:4,perennial:true},cucumber:{name:'Uborka',days:4,perennial:true},strawberry:{name:'Eper',days:4,perennial:true},carrot:{name:'Sárgarépa',days:4,perennial:false},calendula:{name:'Körömvirág',days:3,perennial:true},borage:{name:'Borágó',days:3,perennial:true},chamomile:{name:'Kamilla',days:3,perennial:true},lemonBalm:{name:'Citromfű',days:3,perennial:true}
};
// Growth is two to four tended days, as agreed for the first public bed release.
export const bedMixes:Record<BedMix,{name:string;detail:string;level:number;members:BedKind[];plants:BedKind[]}>={
 kitchen:{name:'Korai veteményes',detail:'A magas borsó mögött alacsony levelek és gyökérzöldségek.',level:0,members:['pea','lettuce','carrot'],plants:['carrot','lettuce','pea','carrot','lettuce','pea','carrot','lettuce','pea']},
 pollinator:{name:'Virágos retekágyás',detail:'Virágzó szegély, korán felszabaduló retekhelyek.',level:0,members:['wildflower','radish'],plants:['wildflower','wildflower','wildflower','radish','radish','radish','wildflower','wildflower','wildflower']},
 herbs:{name:'Száraz fűszerszegély',detail:'Napos, jó vízelvezetésű helyre.',level:0,members:['thyme','oregano','sage'],plants:['thyme','oregano','sage','thyme','oregano','sage','thyme','oregano','sage']},
 strawberry:{name:'Epres méhlegelő',detail:'Virágzó szegély a gyümölcsök mellett; a borágó tágasabb sarokban kap helyet.',level:1,members:['strawberry','calendula','borage'],plants:['calendula','calendula','borage','strawberry','strawberry','strawberry','strawberry','strawberry','strawberry']},
 tea:{name:'Esti teakert',detail:'Könnyű kamillavirágok és illatos levelek egy mérsékelten nyirkos ágyásban.',level:2,members:['chamomile','lemonBalm'],plants:['lemonBalm','lemonBalm','lemonBalm','chamomile','chamomile','chamomile','chamomile','chamomile','chamomile']}
};
export const emptyBedSeeds=():Record<BedKind,number>=>Object.fromEntries(Object.keys(bedKinds).map(k=>[k,0])) as Record<BedKind,number>;
export const bedSeedMethod=(kind:BedKind):'heads'|'pods'|'none'=>kind==='pea'?'pods':['carrot','strawberry','tomato','pepper','cucumber'].includes(kind)?'none':'heads';
export const BED_WATER_CAPACITY=3;
export const createLivingBed=(day=1):LivingBed=>({day,prepared:false,mix:null,moisture:1,mulched:false,evaporation:0,unwateredDays:0,weather:'sunny',plants:[],basket:{},seeds:0,seedStock:{...emptyBedSeeds(),radish:9,lettuce:9,pea:9,thyme:9,wildflower:9,oregano:9,sage:9,carrot:9}});
export function prepareLivingBed(s:LivingBed){if(s.prepared)return null;return {...structuredClone(s),prepared:true};}
export function plantLivingBed(s:LivingBed,mix:BedMix,plants:BedKind[]=bedMixes[mix].plants):LivingBed|null{if(!s.prepared||s.mix||plants.length!==9||plants.some(kind=>!bedMixes[mix].plants.includes(kind)))return null;const counts:Partial<Record<BedKind,number>>={};for(const kind of plants)counts[kind]=(counts[kind]??0)+1;if(Object.entries(counts).some(([kind,n])=>s.seedStock[kind as BedKind]<n))return null;const next=structuredClone(s);for(const [kind,n]of Object.entries(counts))next.seedStock[kind as BedKind]-=n;next.mix=mix;next.layout=[...plants];next.plants=plants.map(kind=>({kind,growth:0,flowering:false,flowerDays:0,removed:false,seedTaken:false}));return next;}
export function waterLivingBed(s:LivingBed){if(!s.prepared||s.moisture>=BED_WATER_CAPACITY)return null;return {...structuredClone(s),moisture:BED_WATER_CAPACITY,evaporation:0,unwateredDays:0};}
export function mulchLivingBed(s:LivingBed){if(!s.prepared||s.mulched)return null;return {...structuredClone(s),mulched:true};}
export function bedPlantStage(p:BedPlant){if(p.aftermath==='empty')return 'empty';if(p.aftermath==='overripe')return 'overripe';if(p.removed)return 'picked';if(p.flowering)return p.flowerDays>=2?'seed':'flowering';return p.growth>=bedKinds[p.kind].days?(p.kind==='wildflower'?'flowering':'ready'):'growing';}
export function advanceLivingBed(s:LivingBed,weather:'sunny'|'rain',ecology?:PollinationContext,identity='bed'):LivingBed{
 const next=structuredClone(s);next.day++;next.weather=weather;
 if(!next.prepared)return next;
 if(weather==='rain'){next.moisture=BED_WATER_CAPACITY;next.evaporation=0;next.unwateredDays=0;}else next.unwateredDays=(next.unwateredDays??0)+1;
 const moist=next.moisture>0;
 for(const [i,p]of next.plants.entries()){
  if(p.removed)continue;
  const berry=p.kind==='strawberry'&&!!ecology;
  if(berry&&p.growth>=bedKinds.strawberry.days&&!p.flowering){p.ripeDays=(p.ripeDays??0)+1;if(p.ripeDays>=RIPE_FRUIT_DAYS){p.growth=0;p.cycle=(p.cycle??0)+1;p.aftermath='overripe';delete p.fruitSet;delete p.ripeDays;}continue;}
  // A failed blossom or overripe fruit remains visible for one day, then regrows.
  if(p.aftermath==='empty')delete p.fruitSet;
  delete p.aftermath;
  if(!moist)continue;
  if(p.flowering){p.flowerDays++;continue;}
  p.growth++;
  if(p.kind==='wildflower'&&p.growth>=bedKinds.wildflower.days){p.flowering=true;p.flowerDays=0;}
  if(berry&&p.growth>=bedKinds.strawberry.days&&p.fruitSet===undefined){p.fruitSet=setsFruit(ecology!.seed,`${identity}:${i}:strawberry`,p.cycle??0);if(!p.fruitSet){p.growth=0;p.cycle=(p.cycle??0)+1;p.aftermath='empty';}}
 }
 if(weather!=='rain'){next.evaporation++;if(next.evaporation>=(next.mulched?2:1)){next.moisture=Math.max(0,next.moisture-1);next.evaporation=0;}}
 return next;
}
export function flowerLivingPlant(s:LivingBed,index:number){const p=s.plants[index];if(!p||bedSeedMethod(p.kind)==='none'||bedPlantStage(p)!=='ready')return null;const next=structuredClone(s);next.plants[index].flowering=true;return next;}
export function harvestLivingPlant(s:LivingBed,index:number){const p=s.plants[index];if(!p||bedPlantStage(p)!=='ready')return null;const next=structuredClone(s),plant=next.plants[index];next.basket[p.kind]=(next.basket[p.kind]??0)+1;if(bedKinds[p.kind].perennial){plant.growth=0;plant.cycle=(plant.cycle??0)+1;delete plant.fruitSet;delete plant.ripeDays;delete plant.aftermath;}else plant.removed=true;return next;}
export function collectLivingSeeds(s:LivingBed,index:number){const p=s.plants[index];if(!p||bedSeedMethod(p.kind)==='none'||bedPlantStage(p)!=='seed'||p.seedTaken)return null;const next=structuredClone(s);next.seeds++;next.seedStock[p.kind]++;const plant=next.plants[index];plant.seedTaken=true;if(bedKinds[p.kind].perennial){plant.growth=0;plant.flowering=false;plant.flowerDays=0;plant.cycle=(plant.cycle??0)+1;delete plant.fruitSet;delete plant.ripeDays;delete plant.aftermath;}else plant.removed=true;return next;}
export const livingFlowers=(s:LivingBed)=>s.plants.filter(p=>!p.removed&&(p.kind!=='pea'&&p.flowering&&p.flowerDays<2||['calendula','borage','chamomile'].includes(p.kind)&&bedPlantStage(p)==='ready')).length;

export function replantLivingSpot(s:LivingBed,index:number,kind:BedKind){if(!s.mix||!s.plants[index]?.removed||!bedMixes[s.mix].plants.includes(kind)||s.seedStock[kind]<1)return null;const next=structuredClone(s);next.seedStock[kind]--;next.plants[index]={kind,growth:0,flowering:false,flowerDays:0,removed:false,seedTaken:false};return next;}

export function refillLivingBed(s:LivingBed){
 if(!s.mix)return null;
 const missing=s.plants.map((p,i)=>p.removed?i:-1).filter(i=>i>=0);
 if(!missing.length)return null;
 const counts=emptyBedSeeds();for(const i of missing)counts[(s.layout??bedMixes[s.mix].plants)[i]]++;
 if((Object.keys(counts) as BedKind[]).some(k=>counts[k]>s.seedStock[k]))return null;
 const next=structuredClone(s);
 for(const i of missing){const kind=(s.layout??bedMixes[s.mix].plants)[i];next.seedStock[kind]--;next.plants[i]={kind,growth:0,flowering:false,flowerDays:0,removed:false,seedTaken:false};}
 return next;
}

export function recommendedBedCounts(mix:BedMix){const counts=emptyBedSeeds();for(const kind of bedMixes[mix].plants)counts[kind]++;return counts;}
export function recommendedComposition(mix:BedMix){const counts=recommendedBedCounts(mix);return bedMixes[mix].members.map(k=>`${counts[k]} ${bedKinds[k].name.toLocaleLowerCase('hu-HU')}`).join(' · ');}
export function composeLivingBed(mix:BedMix,counts:Record<BedKind,number>):BedKind[]|null{
 const members=[...new Set(bedMixes[mix].plants)];
 if((Object.keys(counts) as BedKind[]).some(k=>!Number.isSafeInteger(counts[k])||counts[k]<0||counts[k]>9||counts[k]>0&&!members.includes(k))||Object.values(counts).reduce((a,b)=>a+b,0)!==9)return null;
 const remaining={...counts};return bedMixes[mix].plants.map(original=>{const kind=remaining[original]>0?original:members.find(k=>remaining[k]>0)!;remaining[kind]--;return kind;});
}
