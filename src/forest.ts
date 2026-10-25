export const FOREST_LEFT=-1120;
export type Herb='thyme'|'plantain'|'nettle';
export const herbNames:Record<Herb,string>={thyme:'Vadkakukkfű',plantain:'Lándzsás útifű',nettle:'Csalán'};
export const forestPlants:{id:string;kind:Herb;x:number;y:number}[]=[{id:'thyme-stone',kind:'thyme',x:-315,y:810},{id:'thyme-bank',kind:'thyme',x:-475,y:870},{id:'plantain-path',kind:'plantain',x:-200,y:1000},{id:'plantain-rest',kind:'plantain',x:-470,y:1080},{id:'nettle-brook',kind:'nettle',x:-340,y:1170},{id:'nettle-log',kind:'nettle',x:-550,y:1140}];
export const forestNest={x:-946,y:974};
export const walkingStick={x:-430,y:996};
export const microscope={x:180,y:3340};
export const forestEnemies=[{id:'vine',kind:'vine',x:-665,y:977,hp:3},{id:'spore-a',kind:'spore',x:-795,y:948,hp:2},{id:'spore-b',kind:'spore',x:-864,y:1030,hp:2}] as const;
export type Forest={stick:boolean;defeated:string[];picked:Record<string,number>;sample:boolean;examined:boolean;sent:boolean;focus:number};
export const createForest=():Forest=>({stick:false,defeated:[],picked:{},sample:false,examined:false,sent:false,focus:0});
export const inForest=(x:number,y:number)=>x<0&&y>=650&&y<1400;
export function forestBlocked(x:number,y:number){
 if(x<FOREST_LEFT+24||y<695||y>1340)return true;
 // Two grassy escarpments leave a single readable passage into the hollow.
 if(x< -625&&x> -705&&(y<934||y>1020))return true;
 if(x< -1045)return true;
 return false;
}
export function validForest(v:unknown,day:number):v is Forest{
 if(!v||typeof v!=='object')return false;const f=v as Forest;
 return ['stick','sample','examined','sent'].every(k=>typeof f[k as keyof Forest]==='boolean')&&(!f.examined||f.sample)&&(!f.sent||f.examined)&&(!f.sample||Array.isArray(f.defeated)&&forestEnemies.every(e=>f.defeated.includes(e.id)))&&Number.isFinite(f.focus)&&f.focus>=0&&f.focus<=100&&Array.isArray(f.defeated)&&new Set(f.defeated).size===f.defeated.length&&f.defeated.every(id=>forestEnemies.some(e=>e.id===id))&&!!f.picked&&typeof f.picked==='object'&&!Array.isArray(f.picked)&&Object.entries(f.picked).every(([id,d])=>forestPlants.some(p=>p.id===id)&&Number.isSafeInteger(d)&&d>=1&&d<=day);
}
export function forestQuest(f:Forest){return !f.sample?'Nézz körül az erdő mélyén':!f.examined?'Vizsgáld meg a fészeknél talált mintát':'Küldd el a mintát a korábbi laboros kollégádnak';}
