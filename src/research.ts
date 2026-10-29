import {inHome} from './home';
import {legacyTargetTile,legacyCultivable} from './legacy-garden-grid';
import {TILE,cultivable,reachable,tileKey,targetTile,type Garden,type Tile} from './gardening';
export const FLOWER_DAYS=4;
export const WORKSHOP_ORIGIN=3000;
export const inWorkshop=(y:number)=>y>=WORKSHOP_ORIGIN&&y<WORKSHOP_ORIGIN+600;
export const researchMaterials=['scrap','copper','glass','linen'] as const;
export type ResearchMaterial=typeof researchMaterials[number];
export const researchNames:Record<ResearchMaterial,string>={scrap:'Ócskavas',copper:'Rézcső',glass:'Üvegedény',linen:'Lenszövet'};
export const repairNeeds={wood:35,stone:30,scrap:18,copper:1,glass:1,linen:1} as const;
export const salvageSites=[{id:'scrap-west',kind:'scrap',x:-170,y:270},{id:'scrap-north',kind:'scrap',x:420,y:-135},{id:'scrap-east',kind:'scrap',x:905,y:270},{id:'scrap-meadow',kind:'scrap',x:-230,y:450},{id:'scrap-nw',kind:'scrap',x:-245,y:-125},{id:'scrap-ne',kind:'scrap',x:940,y:-150},{id:'scrap-n',kind:'scrap',x:620,y:-210},{id:'scrap-w',kind:'scrap',x:-270,y:90},{id:'scrap-e',kind:'scrap',x:1000,y:90},{id:'old-pump',kind:'copper',x:950,y:440}] as const;
export type Flower={x:number;y:number;growth:number};
export type Research={workshopEntered?:boolean;microscopeDelivered?:boolean;supplied?:('annie'|'leo')[];gifted:boolean;seeds:number;flowers:Flower[];beeDay:number|null;observation:{day:number;seasonDay:number;plant:string}|null;key:boolean;shutter:boolean;entranceShutter?:boolean;clearedWebs?:string[];examined:string[];discovered:boolean;repaired:boolean;materials:Record<ResearchMaterial,number>;picked:string[];salvageDays?:Record<string,number>};
export const createResearch=():Research=>({supplied:[],gifted:false,seeds:0,flowers:[],beeDay:null,observation:null,key:false,shutter:false,entranceShutter:false,clearedWebs:[],examined:[],discovered:false,repaired:false,materials:{scrap:0,copper:0,glass:0,linen:0},picked:[]});
export function validResearch(v:unknown,day:number,legacy=false):v is Research{
 if(!v||typeof v!=='object')return false;const r=v as Research,gridTarget=legacy?legacyTargetTile:targetTile,gridCultivable=legacy?legacyCultivable:cultivable,count=(n:number)=>Number.isSafeInteger(n)&&n>=0&&n<=999999;
 return (r.workshopEntered===undefined||typeof r.workshopEntered==='boolean'&&(!r.workshopEntered||r.key))&&(r.microscopeDelivered===undefined||typeof r.microscopeDelivered==='boolean'&&r.repaired)&&(r.supplied===undefined||Array.isArray(r.supplied)&&new Set(r.supplied).size===r.supplied.length&&r.supplied.every(who=>who==='annie'||who==='leo'))&&(r.entranceShutter===undefined||typeof r.entranceShutter==='boolean'&&(!r.entranceShutter||r.key))&&(r.clearedWebs===undefined||Array.isArray(r.clearedWebs)&&new Set(r.clearedWebs).size===r.clearedWebs.length&&r.clearedWebs.every(id=>cobwebSites.some(w=>w.id===id)))&&['gifted','key','shutter','discovered','repaired'].every(k=>typeof r[k as keyof Research]==='boolean')&&Number.isSafeInteger(r.seeds)&&r.seeds>=0&&r.seeds<=6&&Array.isArray(r.flowers)&&r.flowers.length<=6&&r.seeds+r.flowers.length===(r.gifted?6:0)&&new Set(r.flowers.map(f=>f&&typeof f==='object'?tileKey(f):'invalid')).size===r.flowers.length&&r.flowers.every(f=>!!f&&typeof f==='object'&&tileKey(gridTarget(f.x+1,f.y+1))===tileKey(f)&&Number.isSafeInteger(f.x)&&Number.isSafeInteger(f.y)&&gridCultivable(f)&&Number.isSafeInteger(f.growth)&&f.growth>=0&&f.growth<=FLOWER_DAYS)&&(r.beeDay===null||r.gifted&&r.flowers.length===6&&r.flowers.every(f=>f.growth===FLOWER_DAYS)&&Number.isSafeInteger(r.beeDay)&&r.beeDay>=1&&r.beeDay<=day+1)&&(r.observation===null||r.beeDay!==null&&!!r.observation&&Number.isSafeInteger(r.observation.day)&&r.observation.day>=r.beeDay&&r.observation.day<=day&&Number.isSafeInteger(r.observation.seasonDay)&&r.observation.seasonDay>=1&&r.observation.seasonDay<=15&&r.observation.plant==='Tavaszi vadvirágkeverék')&&(!r.key||r.observation!==null)&&(!r.shutter||r.key)&&Array.isArray(r.examined)&&new Set(r.examined).size===r.examined.length&&r.examined.every(id=>workshopObjects.some(o=>o.id===id&&id!=='shutter'&&id!=='entrance-shutter'))&&(!r.examined.length||workshopLit(r))&&(!r.discovered||r.key&&workshopLit(r))&&(!r.repaired||r.discovered)&&!!r.materials&&researchMaterials.every(k=>count(r.materials[k]))&&(r.salvageDays===undefined||!!r.salvageDays&&typeof r.salvageDays==='object'&&!Array.isArray(r.salvageDays)&&Object.entries(r.salvageDays).every(([id,d])=>Array.isArray(r.picked)&&r.picked.includes(id)&&Number.isSafeInteger(d)&&d>=1&&d<=day))&&Array.isArray(r.picked)&&new Set(r.picked).size===r.picked.length&&r.picked.every(id=>salvageSites.some(s=>s.id===id));
}
export const flowerAt=(r:Research,t:Tile)=>r.flowers.find(f=>tileKey(f)===tileKey(t));
export function startResearch(r:Research,day:number){if(r.gifted||day<1)return null;return {...structuredClone(r),gifted:true,seeds:6};}
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
export const beeAnchor=(r:Research)=>r.flowers[0]?{x:r.flowers[0].x+TILE/2,y:r.flowers[0].y+TILE/2}:null;
export function observeBee(r:Research,day:number,elapsed:number,player:{x:number;y:number},displayDay:number){const p=beeAnchor(r);if(!p||!beeAvailable(r,day,elapsed)||Math.hypot(p.x-player.x,p.y-player.y)>55)return null;const next=structuredClone(r);next.observation={day,seasonDay:displayDay,plant:'Tavaszi vadvirágkeverék'};return next;}
export function grantKey(r:Research){if(!r.observation||r.key)return null;return {...structuredClone(r),key:true};}
export function collectSalvage(r:Research,id:string,player:{x:number;y:number},day=1){const site=salvageSites.find(s=>s.id===id);if(!site||r.picked.includes(id)||Math.hypot(site.x-player.x,site.y-player.y)>52)return null;const next=structuredClone(r);next.picked.push(id);next.salvageDays={...next.salvageDays,[id]:day};next.materials[site.kind]+=site.kind==='scrap'?2:1;return next;}
export function supplyMaterial(r:Research,who:'annie'|'leo'){if(!r.discovered||r.repaired||r.supplied?.includes(who))return null;const key=who==='annie'?'glass':'linen';if(r.materials[key]>0)return null;const next=structuredClone(r);next.supplied=[...r.supplied??[],who];next.materials[key]++;return next;}
export function repairMachine(r:Research,materials:{wood:number;stone:number}){if(!r.discovered||!workshopLit(r)||!['vat','pipes','filter','coil'].every(id=>r.examined.includes(id))||r.repaired||Object.entries(repairNeeds).some(([k,n])=>(k==='wood'||k==='stone'?materials[k]:r.materials[k as ResearchMaterial])<n))return null;const next=structuredClone(r);for(const k of researchMaterials)next.materials[k]-=repairNeeds[k];next.repaired=true;next.microscopeDelivered=false;return {research:next,wood:materials.wood-repairNeeds.wood,stone:materials.stone-repairNeeds.stone};}


export const workshopObjects=[
 {id:'shutter',x:205,y:3240,name:'Redőny',text:'A redőny megakad, aztán lassan felgördül. Meleg fény csorog be az ablakon. A levegőben apró porszemek táncolnak.'},
 {id:'entrance-shutter',x:495,y:3470,name:'Ajtó melletti redőny',text:'A redőny felgördül. Az ajtó melletti ablakon át újabb fénysáv érkezik a műhelybe.'},
 {id:'bench',x:175,y:3390,name:'Régi munkapad',text:'Gondosan elrendezett szerszámnyomok a fában. Valaki sok időt töltött itt. A fiók üres, de a munkapad még használható.'},
 {id:'notes',x:625,y:3375,name:'Megkopott jegyzet',text:'Préselt levelek és kézzel rajzolt virágok. „Előbb figyeld meg, mire van szüksége a kertnek.” A többi lap egyelőre olvashatatlan.'},
 {id:'vat',x:337,y:3377,name:'Üstszerű tartály',text:'Nagy, kettős falú tartály. A tartóbak korhadt, a tömítések elengedtek. Meg kell erősítenem az alapját.'},
 {id:'pipes',x:287,y:3330,name:'Csőhálózat',text:'A csövek egy része megrepedt. Az egyenes csőszakasz hiányzik; egy régi öntözőszivattyúból talán pótolhatom.'},
 {id:'filter',x:447,y:3377,name:'Szűrőház',text:'A finom szűrő helye üres. Lenszövet és egy ép üvegedény kellene hozzá.'},
 {id:'coil',x:524,y:3330,name:'Hűtőspirál',text:'A spirál még egyben van, de rozsdás rögzítők tartják. Ócskavasból új bilincseket készíthetek. Vajon mit hűtöttek vele?'}
] as const;
export function inspectWorkshop(r:Research,id:string){
 const object=workshopObjects.find(o=>o.id===id);if(!object||!r.key||!['shutter','entrance-shutter'].includes(id)&&!workshopLit(r))return null;
 const next=structuredClone(r);if(id==='shutter')next.shutter=true;else if(id==='entrance-shutter')next.entranceShutter=true;else if(!next.examined.includes(id))next.examined.push(id);
 if(['vat','pipes','filter','coil'].includes(id))next.discovered=true;
 return next;
}

// Old saves with the original shutter already raised keep their existing light/progress.
export const entranceShutterOpen=(r:Research)=>r.entranceShutter??r.shutter;
export const workshopLit=(r:Research)=>r.shutter&&entranceShutterOpen(r);
export const cobwebSites=[{id:'west-corner',x:125,y:3235},{id:'workbench-web',x:145,y:3390},{id:'coil-web',x:590,y:3330}] as const;
export const remainingWebs=(r:Research)=>r.repaired?[]:cobwebSites.filter(w=>!r.clearedWebs?.includes(w.id));
export function clearCobweb(r:Research,id:string,player:{x:number;y:number},tool:string){const web=remainingWebs(r).find(w=>w.id===id);if(!r.key||tool!=='hand'||!web||Math.hypot(web.x-player.x,web.y-player.y)>52)return null;const next=structuredClone(r);next.clearedWebs=[...r.clearedWebs??[],id];return next;}

// Undefined belongs to older saves, where the microscope was already on the bench.
export const microscopeReady=(r:Research)=>r.repaired&&r.microscopeDelivered!==false;

export const workshopEntered=(r:Research)=>r.workshopEntered===true||r.shutter||entranceShutterOpen(r)||r.discovered||r.repaired||!!r.clearedWebs?.length;
export const shouldDeliverMicroscope=(r:Research,hasSample:boolean,y:number)=>r.repaired&&r.microscopeDelivered===false&&hasSample&&(y<600||inHome(y)||inWorkshop(y));
export function workshopText(text:string,known:boolean){return known?text.replace(/A RÉGI MŰHELY/g,'MŰHELY').replace(/a régi műhely/g,'a Műhely').replace(/Régi műhely/g,'Műhely').replace(/a lezárt melléképület/g,'a Műhely').replace(/Melléképület/g,'Műhely').replace(/melléképület/g,'Műhely'):text;}
