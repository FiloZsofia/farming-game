import type {Crop} from './gardening';
import type {BedKind} from './living-bed';
import type {Snapshot} from './storage';
import {backpackSlots} from './chests';
export function claimHomesteadRefunds(source:Snapshot):Snapshot|null{
 const h=source.travel.homestead;if(!h?.refunds.length)return null;const next=structuredClone(source),limit=Math.max(16,backpackSlots(source));let taken=0;
 for(const r of next.travel.homestead!.refunds){const counts=(r.account==='seed'?next.seeds:r.account==='crop'?next.produce:r.account==='extra'?next.travel.estate.produce:next.travel.homestead!.garden.extraSeeds) as Record<string,number>,existing=counts[r.kind]??0,free=Math.max(0,limit-backpackSlots(next)),capacity=(Math.ceil(existing/99)+free)*99-existing,maximum=r.account==='seed'?999999-next.orders.pending[r.kind as Crop]-next.orders.mailbox[r.kind as Crop]:r.account==='wildflower'?999999-(next.travel.homestead!.garden.pending[r.kind as BedKind]??0)-(next.travel.homestead!.garden.mailbox[r.kind as BedKind]??0):999999,amount=Math.min(r.count,maximum-existing,capacity);if(amount<=0)continue;counts[r.kind]=existing+amount;r.count-=amount;taken+=amount;}
 next.travel.homestead!.refunds=next.travel.homestead!.refunds.filter(r=>r.count>0);return taken?next:null;
}
