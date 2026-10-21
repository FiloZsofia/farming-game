export const LEVEL_TWO_XP=36;
export const LEVEL_THREE_XP=72;
export const levelThreeSeeds={carrot:'Sárgarépa',lettuce:'Saláta',onion:'Hagyma'} as const;
export type LevelThreeSeed=keyof typeof levelThreeSeeds;
export const rewardFruits={strawberry:'Eper',honeyberry:'Mézbogyó',blueberry:'Áfonya'} as const;
export type RewardFruit=keyof typeof rewardFruits;
export type GardenSkill={xp:number;credited:string[];rewarded:boolean;levelThreeRewarded:boolean;fruits:Record<string,number>};
export const createGardenSkill=():GardenSkill=>({xp:0,credited:[],rewarded:false,levelThreeRewarded:false,fruits:{}});
export function gainGardening(skill:GardenSkill,key:string){
 if(skill.credited.includes(key)||skill.xp>=LEVEL_THREE_XP)return null;
 const next={...structuredClone(skill),xp:skill.xp+1,credited:[...skill.credited,key]};
 if(next.xp===LEVEL_TWO_XP&&!next.rewarded){next.rewarded=true;next.fruits={strawberry:4,honeyberry:4,blueberry:4};}
 if(next.xp===LEVEL_THREE_XP)next.levelThreeRewarded=true;
 return next;
}
export function validGardenSkill(value:unknown):value is GardenSkill{
 if(!value||typeof value!=='object')return false;const s=value as GardenSkill;
 return Number.isSafeInteger(s.xp)&&s.xp>=0&&s.xp<=LEVEL_THREE_XP&&Array.isArray(s.credited)&&s.credited.length<=LEVEL_THREE_XP&&s.credited.length===s.xp&&new Set(s.credited).size===s.credited.length&&s.credited.every(k=>typeof k==='string'&&k.length<=80)&&typeof s.rewarded==='boolean'&&s.rewarded===(s.xp>=LEVEL_TWO_XP)&&typeof s.levelThreeRewarded==='boolean'&&s.levelThreeRewarded===(s.xp===LEVEL_THREE_XP)&&!!s.fruits&&typeof s.fruits==='object'&&!Array.isArray(s.fruits)&&(!s.rewarded||Object.keys(rewardFruits).every(k=>Object.prototype.hasOwnProperty.call(s.fruits,k)))&&(!s.rewarded?Object.values(s.fruits).every(n=>n===0):true)&&Object.entries(s.fruits).every(([k,n])=>Object.prototype.hasOwnProperty.call(rewardFruits,k)&&Number.isSafeInteger(n)&&n>=0&&n<=999999);
}

export const gardeningLevel=(skill:GardenSkill)=>skill.levelThreeRewarded?3:skill.rewarded?2:1;
export const gardeningTarget=(skill:GardenSkill)=>skill.rewarded?LEVEL_THREE_XP:LEVEL_TWO_XP;
