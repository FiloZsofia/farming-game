import {blocked} from './movement';
export type FarmStory={guideHoed?:string[];guideWatered?:string[];flowerHoeDone?:boolean;flowerWaterDone?:boolean;plantingHelpSeen?:boolean;journalHelpConfirmed?:boolean;journalHelpSeen?:boolean;giftReceived:boolean;morningSeen:boolean;birdhouse:{x:number;y:number}|null};
export const createStory=():FarmStory=>({giftReceived:false,morningSeen:false,birdhouse:null});
export function validStory(value:unknown):value is FarmStory{
 if(!value||typeof value!=='object')return false;const s=value as FarmStory;
 return [s.guideHoed,s.guideWatered].every(v=>v===undefined||Array.isArray(v)&&v.length<=6&&new Set(v).size===v.length&&v.every(k=>typeof k==='string'&&/^-?\d+,-?\d+$/.test(k)))&&[s.flowerHoeDone,s.flowerWaterDone].every(v=>v===undefined||typeof v==='boolean')&&(s.plantingHelpSeen===undefined||typeof s.plantingHelpSeen==='boolean')&&(s.journalHelpConfirmed===undefined||typeof s.journalHelpConfirmed==='boolean')&&(s.journalHelpSeen===undefined||typeof s.journalHelpSeen==='boolean')&&typeof s.giftReceived==='boolean'&&typeof s.morningSeen==='boolean'&&(!s.morningSeen||s.giftReceived)&&(s.birdhouse===null||s.giftReceived&&!!s.birdhouse&&Number.isFinite(s.birdhouse.x)&&Number.isFinite(s.birdhouse.y)&&!blocked(s.birdhouse.x,s.birdhouse.y));
}

export const journalHelpPending=(story:FarmStory,day:number)=>day===1&&!story.journalHelpConfirmed;
