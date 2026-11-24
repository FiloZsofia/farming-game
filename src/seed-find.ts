import {crops} from './economy';
import {levelThreeSeeds,type GardenSkill} from './gardening-skill';
import type {Crop} from './gardening';
export function unlockedSeeds(skill:GardenSkill):Crop[]{return crops.filter(c=>['radish','potato','pea'].includes(c)||(Object.prototype.hasOwnProperty.call(levelThreeSeeds,c)?skill.levelThreeRewarded:skill.rewarded));}
import {bedKinds,bedMixes,type BedKind} from './living-bed';
export const findableSeeds=[...new Set(Object.values(bedMixes).flatMap(mix=>mix.members))].filter(kind=>!bedKinds[kind].perennial);
type SeedCounts=Partial<Record<BedKind,number>>;
// Called only after a successful weed removal; award and removal are saved together.
export function findSeeds(seeds:SeedCounts,orders:{pending:SeedCounts;mailbox:SeedCounts},random:()=>number=Math.random,level=0):{crop:BedKind;amount:number}|null{
 if(random()>=.25)return null;
 const held=(c:BedKind)=>(seeds[c]??0)+(orders.pending[c]??0)+(orders.mailbox[c]??0);
 const available=new Set(Object.values(bedMixes).filter(m=>m.level<=level).flatMap(m=>m.members));
 const pool=findableSeeds.filter(c=>available.has(c)&&c in seeds&&held(c)<999999);
 if(!pool.length)return null;
 const crop=pool[Math.min(pool.length-1,Math.floor(random()*pool.length))];
 return {crop,amount:Math.min(1+Math.floor(random()*3),999999-held(crop))};
}
