import type {Snapshot} from './storage';
import {farmProductAccount,farmProductPrice,validFarmProduct,type FarmProduct} from './farm-products';
import type {StandReceipt} from './homestead-state';
export const MARA_ARRIVAL_SECONDS=120;
export function transferStand(source:Snapshot,product:FarmProduct,amount:number,deposit:boolean,index?:number):Snapshot|null{
 const stand=source.travel.homestead?.stand;if(!stand||stand.pendingDay!==null||!validFarmProduct(product)||!Number.isSafeInteger(amount)||amount<=0)return null;
 const next=structuredClone(source),s=next.travel.homestead!.stand,a=farmProductAccount(next,product),slot=deposit?s.crates.findIndex(c=>c?.product===product):index??s.crates.findIndex(c=>c?.product===product),i=deposit&&slot<0?s.crates.indexOf(null):slot;
 if(i<0||i>=9)return null;const crate=s.crates[i];if(deposit){if(a.counts[a.key]<amount||crate&&crate.product!==product||(crate?.count??0)+amount>999999)return null;a.counts[a.key]-=amount;s.crates[i]={product,count:(crate?.count??0)+amount};}else{if(!crate||crate.product!==product||crate.count<amount||a.counts[a.key]+amount>999999)return null;a.counts[a.key]+=amount;crate.count-=amount;if(!crate.count)s.crates[i]=null;}return next;
}
export function beginStandCollection(source:Snapshot):Snapshot|null{const s=source.travel.homestead?.stand;if(!s||s.pendingDay!==null||s.lastPickupDay===source.clock.day)return null;const next=structuredClone(source);next.travel.homestead!.stand.pendingDay=source.clock.day;return next;}
export function settleStandCollection(source:Snapshot):{state:Snapshot;receipt:StandReceipt}|null{
 const s=source.travel.homestead?.stand,day=s?.pendingDay??source.clock.day;if(!s||s.lastPickupDay===day)return null;const items=s.crates.flatMap(c=>c?[{...c,unitPrice:farmProductPrice(c.product)}]:[]),total=items.reduce((n,c)=>n+c.unitPrice*c.count,0);if(!Number.isSafeInteger(source.economy.gold+total))return null;
 const next=structuredClone(source),stand=next.travel.homestead!.stand,receipt={day,items,total};stand.crates=Array(9).fill(null);stand.pendingDay=null;stand.lastPickupDay=day;stand.lastReceipt=receipt;next.economy.gold+=total;return{state:next,receipt};
}
