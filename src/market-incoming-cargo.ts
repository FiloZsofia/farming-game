import type {Livestock} from './livestock';
export type IncomingMarketCargo={kind:'feed'|'hens';id:string;count:number};
/** Only parcels actually due on this trip; goods already in Mara's hands are off the bed. */
export function incomingMarketCargo(state:Livestock|undefined,day:number,unloaded:readonly number[]=[]):IncomingMarketCargo[]{
 if(!state)return [];const excluded=new Set(unloaded),cargo:IncomingMarketCargo[]=[];
 for(const order of state.feedOrders??[])if(order.dueDay<=day&&order.deliveredDay===undefined&&!excluded.has(order.id))cargo.push({kind:'feed',id:`feed:${order.id}`,count:order.count});
 const pens=new Map<number,number>();for(const order of state.orders)if(order.dueDay<=day&&!excluded.has(order.id))pens.set(order.penId,(pens.get(order.penId)??0)+1);
 for(const [id,count]of pens)cargo.push({kind:'hens',id:`hens:${id}`,count});return cargo;
}
