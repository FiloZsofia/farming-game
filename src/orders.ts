import {crops,emptyQuantities,type Economy,type Quantities} from './economy';
import type {Garden} from './gardening';
export const seedPrices:Quantities={radish:5,potato:10,pea:15,strawberry:20,honeyberry:25,blueberry:45,carrot:10,lettuce:5,onion:15};
export type Orders={pending:Quantities;mailbox:Quantities};
export const createOrders=():Orders=>({pending:emptyQuantities(),mailbox:emptyQuantities()});
export const quantityTotal=(items:Quantities)=>crops.reduce((sum,c)=>sum+items[c],0);
export const validQuantities=(items:Quantities)=>!!items&&typeof items==='object'&&crops.every(c=>Number.isSafeInteger(items[c])&&items[c]>=0&&items[c]<=999999);
export const orderCost=(items:Quantities)=>validQuantities(items)?crops.reduce((sum,c)=>sum+items[c]*seedPrices[c],0):NaN;
export function validOrders(value:unknown):value is Orders{
 if(!value||typeof value!=='object')return false;
 const orders=value as Orders;return validQuantities(orders.pending)&&validQuantities(orders.mailbox);
}
export function purchaseSeeds(economy:Economy,orders:Orders,seeds:Quantities,cart:Quantities):{economy:Economy;orders:Orders}|null{
 if(!validQuantities(cart))return null;
 const paid=purchaseSeedOrder(economy.gold,seeds,orders.pending,orders.mailbox,cart,seedPrices);
 if(!paid)return null;
 return {economy:{...structuredClone(economy),gold:paid.gold},orders:{pending:paid.pending,mailbox:{...orders.mailbox}}};
}
export function deliverOrders(orders:Orders):Orders{
 const mailbox=emptyQuantities();for(const c of crops){mailbox[c]=orders.mailbox[c]+orders.pending[c];if(mailbox[c]>999999)throw new Error('A postaláda megtelt.');}
 return {pending:emptyQuantities(),mailbox};
}
export function collectPackage(garden:Garden,orders:Orders):{garden:Garden;orders:Orders}|null{
 if(quantityTotal(orders.mailbox)===0||crops.some(c=>garden.seeds[c]+orders.mailbox[c]>999999))return null;
 const seeds={...garden.seeds};for(const c of crops)seeds[c]+=orders.mailbox[c];
 return {garden:{seeds,produce:{...garden.produce},plots:new Map([...garden.plots].map(([k,p])=>[k,{...p}]))},orders:{pending:{...orders.pending},mailbox:emptyQuantities()}};
}

// The experimental garden uses extra seed species without changing the save schema.
// Both catalogues share the same validation and paid, next-day order operation.
export function purchaseSeedOrder<K extends string>(gold:number,held:Record<K,number>,pending:Record<K,number>,mailbox:Record<K,number>,cart:Record<K,number>,prices:Record<K,number>){
 const keys=Object.keys(prices) as K[];
 if(Object.keys(cart).some(k=>!keys.includes(k as K)))return null;
 if(keys.some(k=>![held[k],pending[k],mailbox[k],cart[k],prices[k]].every(n=>Number.isSafeInteger(n)&&n>=0)))return null;
 const cost=keys.reduce((n,k)=>n+cart[k]*prices[k],0);
 if(!Number.isSafeInteger(cost)||cost<=0||cost>gold||keys.some(k=>held[k]+pending[k]+mailbox[k]+cart[k]>999999))return null;
 return {gold:gold-cost,pending:Object.fromEntries(keys.map(k=>[k,pending[k]+cart[k]])) as Record<K,number>};
}
