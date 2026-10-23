import {cultivable,reachable,tileKey,targetTile,type Garden,type Tile} from './gardening';
export const FLOWER_DAYS=4;
export const WORKSHOP_ORIGIN=3000;
export const inWorkshop=(y:number)=>y>=WORKSHOP_ORIGIN&&y<WORKSHOP_ORIGIN+600;
export const researchMaterials=['scrap','copper','glass','linen'] as const;
export type ResearchMaterial=typeof researchMaterials[number];
export const researchNames:Record<ResearchMaterial,string>={scrap:'Ócskavas',copper:'Rézcső',glass:'Üvegedény',linen:'Lenszövet'};
export const repairNeeds={wood:35,stone:30,scrap:18,copper:1,glass:1,linen:1} as const;
export const salvageSites=[{id:'scrap-west',kind:'scrap',x:-170,y:270},{id:'scrap-north',kind:'scrap',x:420,y:-135},{id:'scrap-east',kind:'scrap',x:905,y:270},{id:'scrap-meadow',kind:'scrap',x:-230,y:450},{id:'scrap-nw',kind:'scrap',x:-245,y:-125},{id:'scrap-ne',kind:'scrap',x:940,y:-150},{id:'scrap-n',kind:'scrap',x:620,y:-210},{id:'scrap-w',kind:'scrap',x:-270,y:90},{id:'scrap-e',kind:'scrap',x:1000,y:90},{id:'old-pump',kind:'copper',x:950,y:440}] as const;
export type Flower={x:number;y:number;growth:number};
export type Research={gifted:boolean;seeds:number;flowers:Flower[];beeDay:number|null;observation:{day:number;seasonDay:number;plant:string}|null;key:boolean;shutter:boolean;examined:string[];discovered:boolean;repaired:boolean;materials:Record<ResearchMaterial,number>;picked:string[]};
export const createResearch=():Research=>({gifted:false,seeds:0,flowers:[],beeDay:null,observation:null,key:false,shutter:false,examined:[],discovered:false,repaired:false,materials:{scrap:0,copper:0,glass:0,linen:0},picked:[]});
export function validResearch(v:unknown,day:number):v is Research{
 if(!v||typeof v!=='object')return false;const r=v as Research,count=(n:number)=>Number.isSafeInteger(n)&&n>=0&&n<=999999;
 return ['gifted','key','shutter','discovered','repaired'].every(k=>typeof r[k as keyof Research]==='boolean')&&Number.isSafeInteger(r.seeds)&&r.seeds>=0&&r.seeds<=6&&Array.isArray(r.flowers)&&r.flowers.length<=6&&r.seeds+r.flowers.length===(r.gifted?6:0)&&new Set(r.flowers.map(f=>f&&typeof f==='object'?tileKey(f):'invalid')).size===r.flowers.length&&r.flowers.every(f=>!!f&&typeof f==='object'&&tileKey(targetTile(f.x+1,f.y+1))===tileKey(f)&&Number.isSafeInteger(f.x)&&Number.isSafeInteger(f.y)&&cultivable(f)&&Number.isSafeInteger(f.growth)&&f.growth>=0&&f.growth<=FLOWER_DAYS)&&(r.beeDay===null||r.gifted&&r.flowers.length===6&&r.flowers.every(f=>f.growth===FLOWER_DAYS)&&Number.isSafeInteger(r.beeDay)&&r.beeDay>=1&&r.beeDay<=day+1)&&(r.observation===null||r.beeDay!==null&&!!r.observation&&Number.isSafeInteger(r.observation.day)&&r.observation.day>=r.beeDay&&r.observation.day<=day&&Number.isSafeInteger(r.observation.seasonDay)&&r.observation.seasonDay>=1&&r.observation.seasonDay<=15&&r.observation.plant==='Tavaszi vadvirágkeverék')&&(!r.key||r.observation!==null)&&(!r.shutter||r.key)&&Array.isArray(r.examined)&&new Set(r.examined).size===r.examined.length&&r.examined.every(id=>workshopObjects.some(o=>o.id===id&&id!=='shutter'))&&(!r.examined.length||r.shutter)&&(!r.discovered||r.key&&r.shutter)&&(!r.repaired||r.discovered)&&!!r.materials&&researchMaterials.every(k=>count(r.materials[k]))&&Array.isArray(r.picked)&&new Set(r.picked).size===r.picked.length&&r.picked.every(id=>salvageSites.some(s=>s.id===id));
}
export const flowerAt=(r:Research,t:Tile)=>r.flowers.find(f=>tileKey(f)===tileKey(t));
export function startResearch(r:Research,day:number){if(r.gifted||day<4)return null;return {...structuredClone(r),gifted:true,seeds:6};}
export function plantFlower(r:Research,garden:Garden,tile:Tile,player:{x:number;y:number}){
 const plot=garden.plots.get(tileKey(tile));if(!r.gifted||r.seeds<1||flowerAt(r,tile)||!plot||plot.crop||!cultivable(tile)||!reachable(tile,player))return null;
 const next=structuredClone(r);next.seeds--;next.flowers.push({...tile,growth:0});return next;
}
export function advanceResearch(r:Research,garden:Garden,day:number){
 const next=structuredClone(r);for(const f of next.flowers)if(garden.plots.get(tileKey(f))?.watered)f.growth=Math.min(FLOWER_DAYS,f.growth+1);
 if(next.beeDay===null&&next.flowers.length===6&&next.flowers.every(f=>f.growth===FLOWER_DAYS))next.beeDay=day+1;
 return next;
}
export function beeAvailable(r:Research,day:number,elapsed:number){return r.beeDay!==null&&day>=r.beeDay&&elapsed<360&&!r.observation;}
export const beeAnchor=(r:Research)=>r.flowers[0]?{x:r.flowers[0].x+8,y:r.flowers[0].y+8}:null;
export function observeBee(r:Research,day:number,elapsed:number,player:{x:number;y:number},displayDay:number){const p=beeAnchor(r);if(!p||!beeAvailable(r,day,elapsed)||Math.hypot(p.x-player.x,p.y-player.y)>55)return null;const next=structuredClone(r);next.observation={day,seasonDay:displayDay,plant:'Tavaszi vadvirágkeverék'};return next;}
export function grantKey(r:Research){if(!r.observation||r.key)return null;return {...structuredClone(r),key:true};}
export function collectSalvage(r:Research,id:string,player:{x:number;y:number}){const site=salvageSites.find(s=>s.id===id);if(!site||r.picked.includes(id)||Math.hypot(site.x-player.x,site.y-player.y)>52)return null;const next=structuredClone(r);next.picked.push(id);next.materials[site.kind]+=site.kind==='scrap'?2:1;return next;}
export function supplyMaterial(r:Research,who:'annie'|'leo'){if(!r.discovered||r.repaired)return null;const key=who==='annie'?'glass':'linen';if(r.materials[key]>0)return null;const next=structuredClone(r);next.materials[key]++;return next;}
export function repairMachine(r:Research,materials:{wood:number;stone:number}){if(!r.discovered||!r.shutter||!['vat','pipes','filter','coil'].every(id=>r.examined.includes(id))||r.repaired||Object.entries(repairNeeds).some(([k,n])=>(k==='wood'||k==='stone'?materials[k]:r.materials[k as ResearchMaterial])<n))return null;const next=structuredClone(r);for(const k of researchMaterials)next.materials[k]-=repairNeeds[k];next.repaired=true;return {research:next,wood:materials.wood-repairNeeds.wood,stone:materials.stone-repairNeeds.stone};}
export function researchGoal(r:Research){if(!r.gifted)return null;if(r.repaired)return {title:'A régi berendezés',text:'✓ Kerti kivonatfőző helyreállítva.',progress:[]};if(r.discovered)return {title:'Hozd rendbe a berendezést',text:'Gyűjtsd össze a javítás kellékeit.',progress:[]};if(r.key)return {title:'A melléképület titka',text:'Nyisd ki a melléképületet, és vizsgáld meg a gépet.',progress:[]};if(r.observation)return {title:'A faliméhek nyomában',text:'Meséld el Leónak, mit figyeltél meg.',progress:[]};if(r.flowers.length<6)return {title:'A faliméhek nyomában',text:`Ültess vadvirágokat: ${r.flowers.length} / 6`,progress:[]};if(r.flowers.some(f=>f.growth<FLOWER_DAYS))return {title:'A faliméhek nyomában',text:`Gondozd a virágokat: ${Math.min(...r.flowers.map(f=>f.growth))} / 4 megöntözött nap`,progress:[]};return {title:'A faliméhek nyomában',text:'Figyeld meg közelről a virágokhoz látogató szarvas faliméhet.',progress:[]};}

export const workshopObjects=[
 {id:'shutter',x:205,y:3240,name:'Redőny',text:'A redőny megakad, aztán lassan felgördül. Meleg fény csorog be az ablakon. A levegőben apró porszemek táncolnak.'},
 {id:'bench',x:175,y:3390,name:'Régi munkapad',text:'Gondosan elrendezett szerszámnyomok a fában. Valaki sok időt töltött itt. A fiók üres, de a munkapad még használható.'},
 {id:'notes',x:625,y:3375,name:'Megkopott jegyzet',text:'Préselt levelek és kézzel rajzolt virágok. „Előbb figyeld meg, mire van szüksége a kertnek.” A többi lap egyelőre olvashatatlan.'},
 {id:'vat',x:337,y:3377,name:'Üstszerű tartály',text:'Nagy, kettős falú tartály. A tartóbak korhadt, a tömítések elengedtek. Meg kell erősítenem az alapját.'},
 {id:'pipes',x:287,y:3330,name:'Csőhálózat',text:'A csövek egy része megrepedt. Az egyenes csőszakasz hiányzik; egy régi öntözőszivattyúból talán pótolhatom.'},
 {id:'filter',x:447,y:3377,name:'Szűrőház',text:'A finom szűrő helye üres. Lenszövet és egy ép üvegedény kellene hozzá. Leo és Annie talán tudnak segíteni.'},
 {id:'coil',x:524,y:3330,name:'Hűtőspirál',text:'A spirál még egyben van, de rozsdás rögzítők tartják. Ócskavasból új bilincseket készíthetek. Vajon mit hűtöttek vele?'}
] as const;
export function inspectWorkshop(r:Research,id:string){
 const object=workshopObjects.find(o=>o.id===id);if(!object||!r.key||id!=='shutter'&&!r.shutter)return null;
 const next=structuredClone(r);if(id==='shutter')next.shutter=true;else if(!next.examined.includes(id))next.examined.push(id);
 if(['vat','pipes','filter','coil'].includes(id))next.discovered=true;
 return next;
}
