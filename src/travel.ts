import {validCrafting,type Crafting} from './crafting';
import {validForest,type Forest} from './forest';
import {validWeatherSeed} from './weather';
import {createResearch,validResearch,type Research} from './research';
import {createEstate,validEstate,type Estate} from './estate';
import {validMorningSale,type MorningSale} from './morning-report';
import {villageLayout} from './village-layout';
export type Travel={pollinationObservation?:{day:number};metSimon?:boolean;crafting?:Crafting;storyEndSeen?:boolean;forest?:Forest;homeVisited?:boolean;weatherSeed?:number;research:Research;estate:Estate;picked:Record<string,number>;morning:string|null;metAnnie:boolean;metLeo:boolean;sale:MorningSale|null};
export const createTravel=():Travel=>({research:createResearch(),estate:createEstate(),picked:{},morning:null,metAnnie:false,metLeo:false,sale:null});
export function validTravel(value:unknown,day:number,legacy=false):value is Travel{
 if(!value||typeof value!=='object')return false;const picked=(value as Travel).picked;
 const note=(value as Travel).pollinationObservation;if(note!==undefined&&(!note||!Number.isSafeInteger(note.day)||note.day<1||note.day>day))return false;
 return ((value as Travel).metSimon===undefined||typeof (value as Travel).metSimon==='boolean')&&((value as Travel).crafting===undefined||validCrafting((value as Travel).crafting,day))&&((value as Travel).storyEndSeen===undefined||typeof (value as Travel).storyEndSeen==='boolean')&&((value as Travel).forest===undefined||validForest((value as Travel).forest,day))&&((value as Travel).homeVisited===undefined||typeof (value as Travel).homeVisited==='boolean')&&((value as Travel).weatherSeed===undefined||validWeatherSeed((value as Travel).weatherSeed))&&validResearch((value as Travel).research,day,legacy)&&validEstate((value as Travel).estate,day)&&((value as Travel).sale===null||validMorningSale((value as Travel).sale,day))&&typeof (value as Travel).metLeo==='boolean'&&typeof (value as Travel).metAnnie==='boolean'&&((value as Travel).morning===null||typeof (value as Travel).morning==='string'&&(value as Travel).morning!.length<=1000)&&!!picked&&typeof picked==='object'&&!Array.isArray(picked)&&Object.entries(picked).every(([id,d])=>villageLayout.bushes.some(b=>b.id===id)&&Number.isSafeInteger(d)&&d>=1&&d<=day);
}
export const forageReady=(travel:Travel,id:string,day:number)=>travel.picked[id]===undefined||day-travel.picked[id]>=2;

// Narrative completion is independent of calendar duration and microscope reuse.
export const storyEndPending=(travel:Travel)=>travel.forest?.sent===true&&!travel.storyEndSeen;
