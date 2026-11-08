import {crops,salePrices} from './economy';
import {cropNames,type Crop} from './gardening';
import {treeKinds,trees,type TreeKind} from './estate';
export type MarketProduct=Crop|TreeKind;
export const marketProducts:MarketProduct[]=[...crops,...treeKinds];
export const marketName=(p:MarketProduct)=>p in cropNames?cropNames[p as Crop]:trees[p as TreeKind].name;
export const marketPrice=(p:MarketProduct)=>p in salePrices?salePrices[p as Crop]:trees[p as TreeKind].sale;
export type MarketCrate={product:MarketProduct;count:number};
export type MarketReceipt={day:number;items:MarketCrate[];total:number};
// Disposable trial state. No fields are serialized into the farm save.
export class MarketTrial{
 day=1;gold=0;metMara=false;stock=Object.fromEntries(marketProducts.map((p,i)=>[p,12+i%4*4])) as Record<MarketProduct,number>;
 crates:(MarketCrate|null)[]=Array.from({length:9},()=>null);manifest:{index:number;crate:MarketCrate}[]|null=null;loaded=0;receipts:MarketReceipt[]=[];
 get busy(){return this.manifest!==null;}
 get sentToday(){return this.receipts.some(r=>r.day===this.day);}
 get total(){return this.crates.reduce((n,c)=>n+(c?marketPrice(c.product)*c.count:0),0);}
 canDeposit(product:MarketProduct){return !this.busy&&this.stock[product]>0&&this.crates.some(c=>!c||c.product===product);}
 deposit(product:MarketProduct,count=this.stock[product]){
  if(!this.canDeposit(product)||!Number.isSafeInteger(count)||count<=0||count>this.stock[product])return false;
  const matching=this.crates.findIndex(c=>c?.product===product),index=matching<0?this.crates.indexOf(null):matching,old=this.crates[index];if((old?.count??0)+count>999999)return false;
  this.crates[index]={product,count:(old?.count??0)+count};this.stock[product]-=count;return true;
 }
 withdraw(index:number,count=this.crates[index]?.count??0){const crate=this.crates[index];if(this.busy||!crate||!Number.isSafeInteger(count)||count<=0||count>crate.count||this.stock[crate.product]+count>999999)return false;this.stock[crate.product]+=count;crate.count-=count;if(!crate.count)this.crates[index]=null;return true;}
 dispatch(){if(this.busy||this.sentToday)return false;this.manifest=this.crates.flatMap((c,index)=>c?[{index,crate:{...c}}]:[]);this.loaded=0;return true;}
 loadNext(){const entry=this.manifest?.[this.loaded];if(!entry)return null;this.crates[entry.index]=null;this.loaded++;return {...entry.crate};}
 finishPickup(){if(!this.manifest||this.loaded!==this.manifest.length||this.sentToday)return null;const items=this.manifest.map(e=>({...e.crate})),total=items.reduce((n,c)=>n+c.count*marketPrice(c.product),0),receipt={day:this.day,items,total};this.gold+=total;this.receipts.push(receipt);this.manifest=null;return receipt;}
 nextDay(){if(this.busy)return false;this.day++;return true;}
}
