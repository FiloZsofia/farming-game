import {crops,type Quantities} from './economy';
import {levelThreeSeeds,type GardenSkill} from './gardening-skill';
import type {Orders} from './orders';
import type {Crop} from './gardening';
export function unlockedSeeds(skill:GardenSkill):Crop[]{return crops.filter(c=>['radish','potato','pea'].includes(c)||(Object.prototype.hasOwnProperty.call(levelThreeSeeds,c)?skill.levelThreeRewarded:skill.rewarded));}
// Called only after a successful weed removal; award and removal are saved together.
export function findSeeds(skill:GardenSkill,seeds:Quantities,orders:Orders,random:()=>number=Math.random):{crop:Crop;amount:number}|null{
 if(random()>=.25)return null;
 const pool=unlockedSeeds(skill).filter(c=>seeds[c]+orders.pending[c]+orders.mailbox[c]<999999);
 if(!pool.length)return null;
 const crop=pool[Math.min(pool.length-1,Math.floor(random()*pool.length))];
 const amount=Math.min(1+Math.floor(random()*3),999999-seeds[crop]-orders.pending[crop]-orders.mailbox[crop]);
 return {crop,amount};
}
