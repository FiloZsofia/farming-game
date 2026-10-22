import {villageLayout} from './village-layout';
export type Travel={picked:Record<string,number>;morning:string|null};
export const createTravel=():Travel=>({picked:{},morning:null});
export function validTravel(value:unknown,day:number):value is Travel{
 if(!value||typeof value!=='object')return false;const picked=(value as Travel).picked;
 return ((value as Travel).morning===null||typeof (value as Travel).morning==='string'&&(value as Travel).morning!.length<=1000)&&!!picked&&typeof picked==='object'&&!Array.isArray(picked)&&Object.entries(picked).every(([id,d])=>villageLayout.bushes.some(b=>b.id===id)&&Number.isSafeInteger(d)&&d>=1&&d<=day);
}
export const forageReady=(travel:Travel,id:string,day:number)=>travel.picked[id]===undefined||day-travel.picked[id]>=2;
