import {validGathered} from './nature-resources';
import {validMicroscopy,type Microscopy} from './microscopy';
export const FOREST_LEFT=-1120;
export type Herb='thyme'|'plantain'|'nettle';
export const herbNames:Record<Herb,string>={thyme:'Vadkakukkfű',plantain:'Lándzsás útifű',nettle:'Csalán'};
export const forestPlants:{id:string;kind:Herb;x:number;y:number}[]=[{id:'thyme-stone',kind:'thyme',x:-315,y:810},{id:'thyme-bank',kind:'thyme',x:-475,y:870},{id:'plantain-path',kind:'plantain',x:-200,y:1000},{id:'plantain-rest',kind:'plantain',x:-470,y:1080},{id:'nettle-brook',kind:'nettle',x:-340,y:1170},{id:'nettle-log',kind:'nettle',x:-550,y:1140}];
export const forestNest={x:-946,y:974};
export const forestBench={x:-461,y:970};
export const walkingStick={x:-430,y:996};
export const microscope={x:180,y:3340};
export const forestEnemies=[{id:'vine',kind:'vine',x:-665,y:977,hp:3},{id:'spore-a',kind:'spore',x:-795,y:948,hp:2},{id:'spore-b',kind:'spore',x:-835,y:1030,hp:2},{id:'vine-inner',kind:'vine',x:-885,y:997,hp:3}] as const;
export type Forest={gathered?:Record<string,number>;health?:number;microscopy?:Microscopy;revision?:2;enemyIntroSeen?:boolean;visitDefeated?:string[];stick:boolean;defeated:string[];picked:Record<string,number>;sample:boolean;examined:boolean;sent:boolean;focus:number};
export const createForest=():Forest=>({revision:2,enemyIntroSeen:false,stick:false,defeated:[],picked:{},sample:false,examined:false,sent:false,focus:0});
export const inForest=(x:number,y:number)=>x<0&&y>=650&&y<1400;
export function forestBlocked(x:number,y:number){
 if(x<FOREST_LEFT+24||y<695||y>1340)return true;
 // Two grassy escarpments leave a single readable passage into the hollow.
 if(x< -625&&x> -705&&(y<934||y>1020))return true;
 if(x> -910&&x< -860&&(y<954||y>1040))return true;
 if(x< -1045)return true;
 return false;
}
export function validForest(v:unknown,day:number):v is Forest{
 if(!v||typeof v!=='object')return false;const f=v as Forest;
 return validGathered(f.gathered,day)&&(f.health===undefined||Number.isSafeInteger(f.health)&&f.health>=1&&f.health<=5)&&(f.microscopy===undefined||validMicroscopy(f.microscopy,day)&&(!f.microscopy.slides.includes('nest')||f.sample))&&(f.visitDefeated===undefined||Array.isArray(f.visitDefeated)&&Array.isArray(f.defeated)&&new Set(f.visitDefeated).size===f.visitDefeated.length&&f.visitDefeated.every(id=>f.defeated.includes(id)))&&(f.enemyIntroSeen===undefined||typeof f.enemyIntroSeen==='boolean')&&(f.revision===undefined||f.revision===2)&&['stick','sample','examined','sent'].every(k=>typeof f[k as keyof Forest]==='boolean')&&(!f.examined||f.sample)&&(!f.sent||f.examined)&&(!f.sample||Array.isArray(f.defeated)&&forestEnemies.filter(e=>f.revision===2||e.id!=='vine-inner').every(e=>f.defeated.includes(e.id)))&&Number.isFinite(f.focus)&&f.focus>=0&&f.focus<=100&&Array.isArray(f.defeated)&&new Set(f.defeated).size===f.defeated.length&&f.defeated.every(id=>forestEnemies.some(e=>e.id===id))&&!!f.picked&&typeof f.picked==='object'&&!Array.isArray(f.picked)&&Object.entries(f.picked).every(([id,d])=>forestPlants.some(p=>p.id===id)&&Number.isSafeInteger(d)&&d>=1&&d<=day);
}
export function forestQuest(f:Forest){return !f.sample?'Nézz körül az erdő mélyén':!f.examined?'Vizsgáld meg a fészeknél talált mintát':'Küldd el a mintát a korábbi laboros kollégádnak';}

export function migrateForest(f:Forest):Forest{const next=structuredClone(f);if(next.revision!==2){if(next.sample&&!next.defeated.includes('vine-inner'))next.defeated.push('vine-inner');next.revision=2;}return next;}
export function forestGateBlocked(x:number,y:number,state:Forest){
 const defeated=encounterDefeated(state);
 const first=!defeated.includes('vine')&&x> -687&&x< -643&&y>=934&&y<=1020;
 const inner=!forestEnemies.every(e=>defeated.includes(e.id))&&x> -907&&x< -863&&y>=954&&y<=1040;
 return first||inner;
}

export const encounterDefeated=(state:Forest)=>state.visitDefeated??state.defeated;
export function beginForestVisit(state:Forest):Forest{return {...structuredClone(state),visitDefeated:[]};}

export const earlyNestObservation='Apró, sárral lezárt járatok… Faliméhek fészkelhetnek itt. Néhány járat már felnyílt. Az épeket inkább békén hagyom.';
export function collectForestSample(state:Forest,machineRepaired:boolean):Forest|null{
 if(!machineRepaired||state.sample||!forestEnemies.every(e=>encounterDefeated(state).includes(e.id)))return null;
 return {...structuredClone(state),sample:true};
}
