import {emptyExtras,extraValue,validExtras,type ExtraCounts} from './estate';
import type {Crop,Garden} from './gardening';
export const salePrices:Record<Crop,number>={radish:15,potato:30,pea:12,strawberry:25,honeyberry:24,blueberry:21,carrot:22,lettuce:12,onion:32};
export const crops:Crop[]=['radish','potato','pea','strawberry','honeyberry','blueberry','carrot','lettuce','onion'];
export type Quantities=Record<Crop,number>;
export type Receipt={unitPrices?:Quantities;day:number;items:Quantities;extras?:ExtraCounts;total:number};
export type Economy={gold:number;shipping:Quantities;lastSale:Receipt|null};
export const emptyQuantities=():Quantities=>({radish:0,potato:0,pea:0,strawberry:0,honeyberry:0,blueberry:0,carrot:0,lettuce:0,onion:0});
export const createEconomy=():Economy=>({gold:0,shipping:emptyQuantities(),lastSale:null});
export const shippingValue=(items:Quantities)=>crops.reduce((sum,crop)=>sum+items[crop]*salePrices[crop],0);
export function transferProduce(garden:Garden,economy:Economy,crop:Crop,amount:number,direction:'deposit'|'withdraw'){
 if(!Number.isSafeInteger(amount)||amount<=0)return false;
 const source=direction==='deposit'?garden.produce:economy.shipping;
 const destination=direction==='deposit'?economy.shipping:garden.produce;
 if(source[crop]<amount||destination[crop]+amount>999999)return false;
 source[crop]-=amount;destination[crop]+=amount;return true;
}
export function settleSales(economy:Economy,day:number,extras:ExtraCounts=emptyExtras()):Economy{
 const total=shippingValue(economy.shipping)+extraValue(extras);
 if(!Number.isSafeInteger(economy.gold+total))throw new Error('A gold mennyisége nem tárolható biztonságosan.');
 return {gold:economy.gold+total,shipping:emptyQuantities(),lastSale:{day,items:{...economy.shipping},...(extraValue(extras)>0?{extras:{...extras}}:{}),...(['strawberry','honeyberry','blueberry'].some(c=>economy.shipping[c as Crop]>0)?{unitPrices:{...salePrices}}:{}),total}};
}
export function validEconomy(value:unknown):value is Economy{
 if(!value||typeof value!=='object')return false;
 const e=value as Economy;
 const counts=(q:Quantities)=>q&&typeof q==='object'&&crops.every(c=>Number.isSafeInteger(q[c])&&q[c]>=0&&q[c]<=999999);
 if(!Number.isSafeInteger(e.gold)||e.gold<0||!counts(e.shipping))return false;
 if(e.lastSale===null)return true;
 const r=e.lastSale;
 return !!r&&Number.isSafeInteger(r.day)&&r.day>=1&&counts(r.items)&&Number.isSafeInteger(r.total)&&r.total>=0&&(r.extras===undefined||validExtras(r.extras))&&validReceiptTotal(r);
}

// Historical receipts retain their original prices and never change the wallet.
const previousSalePrices:Quantities={...salePrices,strawberry:14,honeyberry:16,blueberry:30};
export function receiptPrices(r:Receipt):Quantities{
 if(r.unitPrices)return r.unitPrices;
 const oldTotal=crops.reduce((sum,c)=>sum+r.items[c]*previousSalePrices[c],0)+(r.extras?extraValue(r.extras):0);
 return r.total===oldTotal?previousSalePrices:salePrices;
}
export function validReceiptTotal(r:Receipt){
 if(r.unitPrices&&![salePrices,previousSalePrices].some(p=>crops.every(c=>r.unitPrices![c]===p[c])))return false;
 return r.total===crops.reduce((sum,c)=>sum+r.items[c]*receiptPrices(r)[c],0)+(r.extras?extraValue(r.extras):0);
}
