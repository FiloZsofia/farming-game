import {researchMaterials,researchNames,type Research} from './research';
import {craftItems,craftNames,type Crafting} from './crafting';
import {goods,goodNames,extras,extraNames,type Estate,type Good,type Extra} from './estate';
export type LossCandidate={id:string;name:string;quantity:number};
export type NightLoss={kind:'item';id:string;name:string;amount:1}|{kind:'gold';amount:number}|{kind:'nothing'};
// Choose the branch once. An empty branch never falls back to the other one.
export function nightLoss(gold:number,items:LossCandidate[],random=Math.random):NightLoss{
 if(random()<.5){const available=items.filter(item=>Number.isSafeInteger(item.quantity)&&item.quantity>0);if(!available.length)return {kind:'nothing'};const item=available[Math.min(available.length-1,Math.max(0,Math.floor(random()*available.length)))];return {kind:'item',id:item.id,name:item.name,amount:1};}
 const amount=Math.min(10,Math.max(0,gold));return amount>0?{kind:'gold',amount}:{kind:'nothing'};
}
export function nightLossText(loss:NightLoss){
 if(loss.kind==='nothing')return 'Az éjjel megpróbáltak kirabolni, de nem találtak nálam semmit. Most már biztonságban vagyok itthon.';
 return `Az éjjel kiraboltak. Elveszítettem: ${loss.kind==='gold'?`${loss.amount} gold`:`1 db ${loss.name.toLocaleLowerCase('hu')}`}. Most már biztonságban vagyok itthon.`;
}

import {crops} from './economy';
import {cropNames,type Garden} from './gardening';
import type {Clearing} from './cleanup';
export function robInventory(garden:Garden,clearing:Clearing,gold:number,random=Math.random,estate?:Estate,crafting?:Crafting,research?:Research){
 const candidates:LossCandidate[]=[];
 for(const crop of crops){candidates.push({id:`produce:${crop}`,name:cropNames[crop],quantity:garden.produce[crop]});candidates.push({id:`seed:${crop}`,name:`${cropNames[crop]} ${crop==='potato'?'vetőgumó':crop==='strawberry'?'palánta':['honeyberry','blueberry'].includes(crop)?'csemete':'mag'}`,quantity:garden.seeds[crop]});}
 for(const [id,name]of [['wood','Fa'],['stone','Kő'],['weed','Gaz']] as const)candidates.push({id:`material:${id}`,name,quantity:clearing[id]});
 if(estate){for(const k of goods)candidates.push({id:`good:${k}`,name:goodNames[k],quantity:estate.goods[k]});for(const k of extras)candidates.push({id:`extra:${k}`,name:extraNames[k],quantity:estate.produce[k]});}
 if(research)for(const id of researchMaterials)candidates.push({id:`research:${id}`,name:researchNames[id],quantity:research.materials[id]});
 if(crafting)for(const id of craftItems)candidates.push({id:`craft:${id}`,name:craftNames[id],quantity:crafting.items[id]});
 const nextResearch=research?structuredClone(research):undefined;
 const nextCrafting=crafting?structuredClone(crafting):undefined;
 const nextEstate=estate?structuredClone(estate):undefined;
 const loss=nightLoss(gold,candidates,random),nextGarden=structuredClone(garden),nextClearing=structuredClone(clearing);
 if(loss.kind==='item'){const [type,id]=loss.id.split(':');if(type==='research'&&nextResearch)nextResearch.materials[id as typeof researchMaterials[number]]--;else if(type==='craft'&&nextCrafting)nextCrafting.items[id as typeof craftItems[number]]--;else if(type==='good'&&nextEstate)nextEstate.goods[id as Good]--;else if(type==='extra'&&nextEstate)nextEstate.produce[id as Extra]--;else if(type==='material')nextClearing[id as 'wood'|'stone'|'weed']--;else nextGarden[type==='seed'?'seeds':'produce'][id as typeof crops[number]]--;}
 return {research:nextResearch,crafting:nextCrafting,estate:nextEstate,loss,garden:nextGarden,clearing:nextClearing,gold:gold-(loss.kind==='gold'?loss.amount:0)};
}
