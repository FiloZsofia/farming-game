import {validChests,type ChestStorage} from './chests';
import type {Plot,Tool} from './gardening';
export const FIRST_REWARD_XP=36;
export const SECOND_REWARD_XP=80;
export const CHEST_XP=132;
export const NEXT_LEVEL_COST=60;
export const levelThreeSeeds={carrot:'Sárgarépa',lettuce:'Saláta',onion:'Hagyma'} as const;
export type LevelThreeSeed=keyof typeof levelThreeSeeds;
export const rewardFruits={strawberry:'Eper',honeyberry:'Mézbogyó',blueberry:'Áfonya'} as const;
export type RewardFruit=keyof typeof rewardFruits;
export type GardenSkill={birdhouseStored?:boolean;pendingSeeds?:Record<string,number>;chests?:ChestStorage;revision?:2;chestBlueprint?:boolean;xp:number;credited:string[];rewarded:boolean;levelThreeRewarded:boolean;fruits:Record<string,number>};
export const createGardenSkill=():GardenSkill=>({revision:2,chestBlueprint:false,xp:0,credited:[],rewarded:false,levelThreeRewarded:false,fruits:{}});
export function gainGardening(skill:GardenSkill,key:string){
 if(skill.credited.includes(key)||skill.xp>=CHEST_XP)return null;
 const next={...structuredClone(skill),xp:skill.xp+1,credited:[...skill.credited,key]};
 if(next.xp===FIRST_REWARD_XP&&!next.rewarded){next.rewarded=true;next.fruits={strawberry:4,honeyberry:4,blueberry:4};}
 if(next.xp===SECOND_REWARD_XP)next.levelThreeRewarded=true;
 if(next.xp===CHEST_XP)next.chestBlueprint=true;
 return next;
}
export function validGardenSkill(value:unknown):value is GardenSkill{
 if(!value||typeof value!=='object')return false;const s=value as GardenSkill;
 return (s.birdhouseStored===undefined||typeof s.birdhouseStored==='boolean')&&(s.pendingSeeds===undefined||!!s.pendingSeeds&&typeof s.pendingSeeds==='object'&&!Array.isArray(s.pendingSeeds)&&Object.entries(s.pendingSeeds).every(([k,n])=>[...Object.keys(rewardFruits),...Object.keys(levelThreeSeeds)].includes(k)&&Number.isSafeInteger(n)&&n>=0&&n<=4))&&(s.chests===undefined||validChests(s.chests))&&Number.isSafeInteger(s.xp)&&s.xp>=0&&s.xp<=(s.revision===2?CHEST_XP:72)&&Array.isArray(s.credited)&&s.credited.length<=CHEST_XP&&s.credited.length===s.xp&&new Set(s.credited).size===s.credited.length&&s.credited.every(k=>typeof k==='string'&&k.length<=80)&&typeof s.rewarded==='boolean'&&s.rewarded===(s.xp>=FIRST_REWARD_XP)&&typeof s.levelThreeRewarded==='boolean'&&s.levelThreeRewarded===(s.xp>=(s.revision===2?SECOND_REWARD_XP:72))&&(s.revision===undefined||s.revision===2)&&(s.revision!==2||typeof s.chestBlueprint==='boolean'&&s.chestBlueprint===(s.xp===CHEST_XP))&&!!s.fruits&&typeof s.fruits==='object'&&!Array.isArray(s.fruits)&&(!s.rewarded||Object.keys(rewardFruits).every(k=>Object.prototype.hasOwnProperty.call(s.fruits,k)))&&(!s.rewarded?Object.values(s.fruits).every(n=>n===0):true)&&Object.entries(s.fruits).every(([k,n])=>Object.prototype.hasOwnProperty.call(rewardFruits,k)&&Number.isSafeInteger(n)&&n>=0&&n<=999999);
}

// Historical reward flags retain their meaning; displayed levels now start at zero.
export function migrateGardenSkill(skill:GardenSkill):GardenSkill{
 if(skill.revision===2)return structuredClone(skill);
 const next=structuredClone(skill);next.revision=2;next.chestBlueprint=false;
 // Preserve earned rewards and progress, but never invent XP earned beyond the old cap.
 if(next.levelThreeRewarded)next.xp=80;
 while(next.credited.length<next.xp){let key=`migration:${next.credited.length}`;while(next.credited.includes(key))key+=':';next.credited.push(key);}
 return next;
}
export const gardeningLevel=(skill:GardenSkill)=>skill.chestBlueprint?3:skill.levelThreeRewarded?2:skill.rewarded?1:0;
export const gardeningTarget=(skill:GardenSkill)=>skill.levelThreeRewarded?CHEST_XP:skill.rewarded?SECOND_REWARD_XP:FIRST_REWARD_XP;
export function gardeningProgress(skill:GardenSkill){
 const start=skill.levelThreeRewarded?80:skill.rewarded?36:0;
 const required=skill.levelThreeRewarded?52:skill.rewarded?44:36;
 return {current:skill.chestBlueprint?required:Math.max(0,skill.xp-start),required};
}
export function gardeningCredit(tool:Tool,tile:string,day:number,before:Plot|undefined){
 if(tool==='hoe')return before?null:`hoe:${tile}`;
 if(tool==='water')return `water:${day}:${tile}`;
 if(tool==='harvest')return `harvest:${day}:${tile}`;
 return `plant:${day}:${tile}`;
}
