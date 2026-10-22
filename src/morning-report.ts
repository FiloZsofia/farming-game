import {extras,extraValue,extraPrices,validExtras,type ExtraCounts} from './estate';
import {crops,salePrices,shippingValue,type Quantities,type Receipt} from './economy';
export type MorningSale={day:number;items:Quantities;extras?:ExtraCounts;total:number;beforeGold:number;afterGold:number};
export function morningSale(receipt:Receipt,beforeGold:number):MorningSale{return structuredClone({...receipt,beforeGold,afterGold:beforeGold+receipt.total});}
export function validMorningSale(value:unknown,day:number):value is MorningSale{
 if(!value||typeof value!=='object')return false;const s=value as MorningSale;
 return Number.isSafeInteger(s.day)&&s.day===day-1&&!!s.items&&crops.every(c=>Number.isSafeInteger(s.items[c])&&s.items[c]>=0&&s.items[c]<=999999)&&(s.extras===undefined||validExtras(s.extras))&&s.total===shippingValue(s.items)+(s.extras?extraValue(s.extras):0)&&Number.isSafeInteger(s.total)&&Number.isSafeInteger(s.beforeGold)&&s.beforeGold>=0&&Number.isSafeInteger(s.afterGold)&&s.afterGold===s.beforeGold+s.total;
}
export function saleRows(sale:MorningSale){return [...crops.filter(c=>sale.items[c]>0).map(crop=>({crop,quantity:sale.items[crop],value:sale.items[crop]*salePrices[crop]})),...extras.filter(k=>(sale.extras?.[k]??0)>0).map(crop=>({crop,quantity:sale.extras![crop],value:sale.extras![crop]*extraPrices[crop]}))];}
export const incomeProgress=(elapsed:number,reduced=false)=>reduced?(elapsed>=650?1:0):Math.min(1,Math.max(0,(elapsed-650)/1150));
export const displayedBalance=(sale:MorningSale,elapsed:number,reduced=false)=>sale.beforeGold+Math.round(sale.total*(1-(1-incomeProgress(elapsed,reduced))**3));
