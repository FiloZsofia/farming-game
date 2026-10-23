import {createResearch,validResearch,type Research} from './research';
import {createEstate,validEstate,type Estate} from './estate';
import {validMorningSale,type MorningSale} from './morning-report';
import {villageLayout} from './village-layout';
export type Travel={research:Research;estate:Estate;picked:Record<string,number>;morning:string|null;metAnnie:boolean;metLeo:boolean;sale:MorningSale|null};
export const createTravel=():Travel=>({research:createResearch(),estate:createEstate(),picked:{},morning:null,metAnnie:false,metLeo:false,sale:null});
export function validTravel(value:unknown,day:number):value is Travel{
 if(!value||typeof value!=='object')return false;const picked=(value as Travel).picked;
 return validResearch((value as Travel).research,day)&&validEstate((value as Travel).estate,day)&&((value as Travel).sale===null||validMorningSale((value as Travel).sale,day))&&typeof (value as Travel).metLeo==='boolean'&&typeof (value as Travel).metAnnie==='boolean'&&((value as Travel).morning===null||typeof (value as Travel).morning==='string'&&(value as Travel).morning!.length<=1000)&&!!picked&&typeof picked==='object'&&!Array.isArray(picked)&&Object.entries(picked).every(([id,d])=>villageLayout.bushes.some(b=>b.id===id)&&Number.isSafeInteger(d)&&d>=1&&d<=day);
}
export const forageReady=(travel:Travel,id:string,day:number)=>travel.picked[id]===undefined||day-travel.picked[id]>=2;
