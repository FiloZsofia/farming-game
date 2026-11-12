import {normalizeGardenProgress} from './garden-progression';
import {overlapsMarket} from './market-site';
import {gardenDecorationFits} from './living-bed-placement';
import type {Snapshot} from './storage';
import {createHomestead} from './homestead-state';
import {isRipe,type Crop} from './gardening';
import {crops} from './economy';
import {extras} from './estate';
export function enableHomestead(source:Snapshot,fresh=false):Snapshot{
 if(source.travel.homestead){
  const next=structuredClone(source),g=next.travel.homestead!.garden;
  // Preserve earned levels, discard work banked beyond the old content cap.
  normalizeGardenProgress(g);
  return next;
 }
 const next=structuredClone(source),h=createHomestead(next.clock.day);next.travel.homestead=h;next.version=19;
 const add=(account:'seed'|'crop'|'extra',kind:string,amount:number)=>{if(!amount)return;const counts=(account==='seed'?next.seeds:account==='crop'?next.produce:next.travel.estate.produce) as Record<string,number>,limit=account==='seed'?999999-next.orders.pending[kind as Crop]-next.orders.mailbox[kind as Crop]:999999,take=Math.min(amount,limit-counts[kind]);counts[kind]+=take;if(amount>take)h.refunds.push({account,kind,count:amount-take});};
 for(const [,p]of next.plots){if(p.crop){add('seed',p.crop,1);if(isRipe(p))add('crop',p.crop,1);}}
 next.plots=[];
 for(const k of crops){add('crop',k,next.economy.shipping[k]);next.economy.shipping[k]=0;}
 for(const k of extras){add('extra',k,next.travel.estate.shipping[k]);next.travel.estate.shipping[k]=0;}
 const r=next.travel.research;if(r.gifted){h.garden.extraSeeds.wildflower=r.seeds+r.flowers.length;if(!r.observation){r.seeds=6;r.flowers=[];r.beeDay=null;}}
 r.inBeds=true;
 h.garden.chestBlueprint=!!next.skill.chestBlueprint;
 // Existing sprinklers are packed rather than silently left watering removed plots.
 if(next.travel.crafting){const machines=next.travel.crafting.machines.filter(m=>m.kind==='irrigation');if(machines.length){const total=next.travel.crafting.items.irrigation+machines.length;if(total>999999)throw Error('Az öntözők nem férnek el veszteség nélkül. A régi mentés megmaradt.');next.travel.crafting.items.irrigation=total;next.travel.crafting.machines=next.travel.crafting.machines.filter(m=>m.kind!=='irrigation');}}
 const occupied=()=>[...next.travel.estate.trees,...next.travel.crafting?.machines??[],...next.skill.chests?.placed??[],...(next.story.birdhouse?[next.story.birdhouse]:[])];
 const relocate=(p:{x:number;y:number})=>{if(!overlapsMarket(p,20,25))return;for(let distance=32;distance<900;distance+=32)for(let i=0;i<24;i++){const q={x:Math.round(p.x+Math.cos(i*Math.PI/12)*distance),y:Math.round(p.y+Math.sin(i*Math.PI/12)*distance)};if(gardenDecorationFits(q,20,24)&&!occupied().some(o=>o!==p&&Math.hypot(o.x-q.x,o.y-q.y)<45)){p.x=q.x;p.y=q.y;return;}}throw Error('Az átadó helyét nem sikerült veszteség nélkül felszabadítani. A régi mentés megmaradt.');};
 for(const p of occupied())relocate(p);
 if(overlapsMarket(next.player,8,8))next.player={x:70,y:450};
 if(fresh){for(const k of crops)next.seeds[k]=0;for(const k of ['radish','pea','lettuce','carrot'] as Crop[])next.seeds[k]=3;h.updateSeen=true;}
 return next;
}
