import {crops,emptyQuantities,type Economy,type Quantities} from './economy';
import type {Garden} from './gardening';
export const seedPrices:Quantities={radish:5,potato:10,pea:15};
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
 const cost=orderCost(cart);
 if(!Number.isSafeInteger(cost)||cost<=0||cost>economy.gold)return null;
 if(crops.some(c=>seeds[c]+orders.mailbox[c]+orders.pending[c]+cart[c]>999999))return null;
 const next=structuredClone(orders);for(const c of crops)next.pending[c]+=cart[c];
 return {economy:{...structuredClone(economy),gold:economy.gold-cost},orders:next};
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
