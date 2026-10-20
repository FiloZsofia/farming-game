import type {Crop,Garden} from './gardening';
export const salePrices:Record<Crop,number>={radish:15,potato:30,pea:12};
export const crops:Crop[]=['radish','potato','pea'];
export type Quantities=Record<Crop,number>;
export type Receipt={day:number;items:Quantities;total:number};
export type Economy={gold:number;shipping:Quantities;lastSale:Receipt|null};
export const emptyQuantities=():Quantities=>({radish:0,potato:0,pea:0});
export const createEconomy=():Economy=>({gold:0,shipping:emptyQuantities(),lastSale:null});
export const shippingValue=(items:Quantities)=>crops.reduce((sum,crop)=>sum+items[crop]*salePrices[crop],0);
export function transferProduce(garden:Garden,economy:Economy,crop:Crop,amount:number,direction:'deposit'|'withdraw'){
 if(!Number.isSafeInteger(amount)||amount<=0)return false;
 const source=direction==='deposit'?garden.produce:economy.shipping;
 const destination=direction==='deposit'?economy.shipping:garden.produce;
 if(source[crop]<amount||destination[crop]+amount>999999)return false;
 source[crop]-=amount;destination[crop]+=amount;return true;
}
export function settleSales(economy:Economy,day:number):Economy{
 const total=shippingValue(economy.shipping);
 if(!Number.isSafeInteger(economy.gold+total))throw new Error('A gold mennyisége nem tárolható biztonságosan.');
 return {gold:economy.gold+total,shipping:emptyQuantities(),lastSale:{day,items:{...economy.shipping},total}};
}
export function validEconomy(value:unknown):value is Economy{
 if(!value||typeof value!=='object')return false;
 const e=value as Economy;
 const counts=(q:Quantities)=>q&&typeof q==='object'&&crops.every(c=>Number.isSafeInteger(q[c])&&q[c]>=0&&q[c]<=999999);
 if(!Number.isSafeInteger(e.gold)||e.gold<0||!counts(e.shipping))return false;
 if(e.lastSale===null)return true;
 const r=e.lastSale;
 return !!r&&Number.isSafeInteger(r.day)&&r.day>=1&&counts(r.items)&&Number.isSafeInteger(r.total)&&r.total>=0&&r.total===shippingValue(r.items);
}
