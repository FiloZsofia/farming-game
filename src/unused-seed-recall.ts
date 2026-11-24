import type {Snapshot} from './storage';
import {crops} from './economy';
import {seedPrices} from './orders';
import {bedKinds,bedMixes,type BedKind} from './living-bed';
import {trialSeedPrices} from './living-garden';
import type {Crop} from './gardening';
const usable=new Set<string>(Object.values(bedMixes).flatMap(m=>m.members));
export const unusedSeedKinds=[...new Set<string>([...crops,...Object.keys(bedKinds)])].filter(k=>!usable.has(k));
/** Pure, atomic conversion; the pending receipt survives reloads without paying twice. */
export function recallUnusedSeeds(source:Snapshot):Snapshot|null{
 const home=source.travel.homestead;if(!home||home.seedRecall)return null;
 const next=structuredClone(source),h=next.travel.homestead!,counts=new Map<string,number>();
 const take=(account:Record<string,number|undefined>,kind:string,remove=false)=>{const n=account[kind]??0;if(!n)return;counts.set(kind,(counts.get(kind)??0)+n);if(remove)delete account[kind];else account[kind]=0;};
 for(const kind of unusedSeedKinds){
  if(kind in next.seeds){take(next.seeds,kind);take(next.orders.pending,kind);take(next.orders.mailbox,kind);}
  take(h.garden.extraSeeds,kind);take(h.garden.pending,kind);take(h.garden.mailbox,kind);
  if(next.skill.pendingSeeds)take(next.skill.pendingSeeds,kind,true);
  for(const chest of next.skill.chests?.placed??[]){take(chest.items,`seed:${kind}`,true);take(chest.items,`bedSeed:${kind}`,true);}
 }
 // Chest keys carry their account prefix; combine them into the same species row.
 for(const [key,n]of [...counts])if(key.includes(':')){const kind=key.split(':')[1];counts.delete(key);counts.set(kind,(counts.get(kind)??0)+n);}
 h.refunds=h.refunds.filter(r=>{if(r.account==='seed'&&unusedSeedKinds.includes(r.kind)){counts.set(r.kind,(counts.get(r.kind)??0)+r.count);return false;}return true;});
 if(!counts.size)return null;
 const items=[...counts].map(([kind,count])=>({kind,count,gold:count*(seedPrices[kind as Crop]??trialSeedPrices[kind as BedKind])})),total=items.reduce((n,r)=>n+r.gold,0);
 if(!Number.isSafeInteger(total)||!Number.isSafeInteger(next.economy.gold+total))return null;
 next.economy.gold+=total;h.seedRecall={items,total,seen:false};return next;
}
