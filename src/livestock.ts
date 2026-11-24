import type {Snapshot} from './storage';
export type AnimalPoint={x:number;y:number};
export const animalItems=['coop','paddock','feeder','drinker','dustBath','perch','shade'] as const;
export type AnimalItem=typeof animalItems[number];
export type AnimalFixture=Exclude<AnimalItem,'coop'|'paddock'>;
export const fixtureKinds:AnimalFixture[]=['feeder','drinker','dustBath','perch','shade'];
export const animalItemNames:Record<AnimalItem,string>={coop:'Tyúkól',paddock:'Kifutó kapuval',feeder:'Etető',drinker:'Itató',dustBath:'Porfürdő',perch:'Ülőrúd',shade:'Árnyékoló'};
export const animalItemPrices:Record<AnimalItem,number>={coop:320,paddock:180,feeder:45,drinker:40,dustBath:35,perch:35,shade:90};
export const henVarieties=['chestnut','cream','speckled'] as const;
export type HenVariety=typeof henVarieties[number];
export const henVarietyNames:Record<HenVariety,string>={chestnut:'Vörös tyúk',cream:'Krémfehér tyúk',speckled:'Kendermagos tyúk'};
export const HEN_PRICE=95,FEED_PRICE=20,FEED_BAG=10,HEN_EGG_PRICE=12,HEN_CAPACITY=4;
export type AnimalPen={id:number;name:string;coop:AnimalPoint;boundary:AnimalPoint[];gate:number;coopWall?:number;fixtures:Partial<Record<AnimalFixture,AnimalPoint>>;rotations?:Partial<Record<AnimalFixture,0|1>>;feed:number;emptyFeedDay?:number|null;dryDays?:number;wateredDay:number|null;cleanedDay:number;eggs:number};
export const coopFenceAnchors=(p:AnimalPoint):AnimalPoint[]=>[{x:p.x-36,y:p.y+4},{x:p.x+36,y:p.y+4}];
export function coopWallForBoundary(coop:AnimalPoint,poly:readonly AnimalPoint[]){const [left,right]=coopFenceAnchors(coop),near=(a:AnimalPoint,b:AnimalPoint)=>Math.hypot(a.x-b.x,a.y-b.y)<.1;const index=poly.findIndex((a,i)=>{const b=poly[(i+1)%poly.length];return near(a,left)&&near(b,right)||near(a,right)&&near(b,left)});return index<0?null:index;}
export type Hen={id:number;penId:number;variety:HenVariety;name:string;arrivedDay:number;lastLayDay:number;careDays:number;personality:'bold'|'shy'|'curious'};
export type FeedOrder={id:number;count:number;dueDay:number;deliveredDay?:number;drop?:AnimalPoint};
export type AnimalOrder={id:number;penId:number;variety:HenVariety;dueDay:number};
export type Livestock={version:1;nextId:number;lastDay:number;packed:Record<AnimalItem,number>;feed:number;eggs:number;pens:AnimalPen[];hens:Hen[];orders:AnimalOrder[];feedHelpSeen?:boolean;feedOrders?:FeedOrder[]};
export const createLivestock=(day=1):Livestock=>({version:1,nextId:1,lastDay:day,packed:{coop:0,paddock:0,feeder:0,drinker:0,dustBath:0,perch:0,shade:0},feed:0,eggs:0,pens:[],hens:[],orders:[]});
export function penMissing(pen:AnimalPen):string[]{return [...(!pen.boundary.length?['Kifutó és kapu']:[]),...fixtureKinds.filter(k=>!pen.fixtures[k]).map(k=>animalItemNames[k])];}
export const penResidents=(s:Livestock,id:number)=>s.hens.filter(h=>h.penId===id);
export const penReservations=(s:Livestock,id:number)=>s.orders.filter(h=>h.penId===id);
export function canOrderHen(s:Livestock,penId:number){const pen=s.pens.find(p=>p.id===penId);return !!pen&&!penMissing(pen).length&&penResidents(s,penId).length+penReservations(s,penId).length<HEN_CAPACITY;}
export function buyAnimalItem(source:Snapshot,item:AnimalItem|'feed'):Snapshot|null{
 const price=item==='feed'?FEED_PRICE:animalItemPrices[item];if(source.economy.gold<price)return null;
 const next=structuredClone(source),s=next.travel.livestock??=createLivestock(next.clock.day);
 if(item==='feed'){if(s.feed+FEED_BAG>999999)return null;s.feed+=FEED_BAG;}else{if(s.packed[item]>=999)return null;s.packed[item]++;}next.economy.gold-=price;return next;
}
export function orderHen(source:Snapshot,penId:number,variety:HenVariety):Snapshot|null{
 const s=source.travel.livestock;if(!s||!henVarieties.includes(variety)||source.economy.gold<HEN_PRICE||!canOrderHen(s,penId))return null;
 const next=structuredClone(source),state=next.travel.livestock!;state.orders.push({id:state.nextId++,penId,variety,dueDay:next.clock.day+1});next.economy.gold-=HEN_PRICE;return next;
}
export function deliverHen(source:Snapshot,orderId:number):Snapshot|null{
 const s=source.travel.livestock,order=s?.orders.find(o=>o.id===orderId),pen=s?.pens.find(p=>p.id===order?.penId);
 if(!s||!order||!pen||order.dueDay>source.clock.day||penMissing(pen).length||penResidents(s,pen.id).length>=HEN_CAPACITY)return null;
 const next=structuredClone(source),state=next.travel.livestock!,i=state.orders.findIndex(o=>o.id===orderId);state.orders.splice(i,1);const home=state.pens.find(p=>p.id===order.penId)!;if(home.feed===0)home.emptyFeedDay??=source.clock.day;
 state.hens.push({id:order.id,penId:order.penId,variety:order.variety,name:henVarietyNames[order.variety],arrivedDay:source.clock.day,lastLayDay:source.clock.day,careDays:0,personality:(['bold','shy','curious'] as const)[order.id%3]});return next;
}
export function advanceLivestock(source:Livestock,day:number):Livestock{
 const s=structuredClone(source);if(day<=s.lastDay)return s;
 for(let d=s.lastDay+1;d<=day;d++)for(const pen of s.pens){const residents=penResidents(s,pen.id).filter(h=>h.arrivedDay<d),watered=pen.wateredDay===d-1,clean=d-1-pen.cleanedDay<3,ready=!penMissing(pen).length;
  pen.dryDays=watered||!residents.length?0:Math.min(3,(pen.dryDays??0)+1);
  if(residents.length&&pen.feed===0)pen.emptyFeedDay??=d;
  for(const hen of residents){const fed=pen.feed>0;if(fed){pen.feed--;if(pen.feed===0)pen.emptyFeedDay=d;}const foodReady=fed||d<=(pen.emptyFeedDay??-1);if(foodReady&&pen.dryDays<3&&clean&&ready){hen.careDays++;if(hen.careDays>=2){pen.eggs++;hen.lastLayDay=d;hen.careDays=0;}}}
 }

 s.lastDay=day;return s;
}
export function tendPen(source:Snapshot,id:number,action:'feed'|'water'|'clean'|'eggs'):Snapshot|null{
 if(!source.travel.livestock)return null;const next=structuredClone(source),s=next.travel.livestock!,pen=s.pens.find(p=>p.id===id);if(!pen)return null;
 if(action==='feed'){if(!pen.fixtures.feeder||s.feed<=0||pen.feed>=HEN_CAPACITY*3)return null;const n=Math.min(s.feed,HEN_CAPACITY*3-pen.feed);s.feed-=n;pen.feed+=n;delete pen.emptyFeedDay;}
 if(action==='water'){if(!pen.fixtures.drinker||pen.wateredDay===source.clock.day)return null;pen.wateredDay=source.clock.day;pen.dryDays=0;}
 if(action==='clean'){if(pen.cleanedDay===source.clock.day)return null;pen.cleanedDay=source.clock.day;}
 if(action==='eggs'){if(!pen.eggs||s.eggs+pen.eggs>999999)return null;s.eggs+=pen.eggs;pen.eggs=0;}
 return next;
}
export function renameHen(source:Snapshot,id:number,name:string):Snapshot|null{const clean=name.trim().replace(/\s+/g,' ');if(!clean||[...clean].length>24||/[\u0000-\u001f\u007f]/.test(clean))return null;const next=structuredClone(source),hen=next.travel.livestock?.hens.find(h=>h.id===id);if(!hen)return null;hen.name=clean;return next;}
export function packAnimalItem(source:Snapshot,penId:number,item:AnimalItem):Snapshot|null{
 const next=structuredClone(source),s=next.travel.livestock,pen=s?.pens.find(p=>p.id===penId);if(!s||!pen||item==='paddock'||penResidents(s,pen.id).length||penReservations(s,pen.id).length)return null;
 if(item==='coop'){if(pen.eggs||pen.feed||Object.keys(pen.fixtures).length||pen.boundary.length)return null;s.pens=s.pens.filter(p=>p.id!==penId);}else{if(!pen.fixtures[item]||item==='feeder'&&pen.feed)return null;delete pen.fixtures[item];if(pen.rotations)delete pen.rotations[item];}
 s.packed[item]++;return next;
}
export function packEmptyPaddock(source:Snapshot,penId:number):Snapshot|null{const next=structuredClone(source),s=next.travel.livestock,pen=s?.pens.find(p=>p.id===penId);if(!s||!pen||!pen.boundary.length||Object.keys(pen.fixtures).length||penResidents(s,pen.id).length||penReservations(s,pen.id).length)return null;pen.boundary=[];pen.gate=0;delete pen.coopWall;s.packed.paddock++;return next;}
const count=(n:unknown,max=999999):n is number=>Number.isSafeInteger(n)&&(n as number)>=0&&(n as number)<=max;
const point=(p:unknown):p is AnimalPoint=>!!p&&typeof p==='object'&&Number.isFinite((p as AnimalPoint).x)&&Number.isFinite((p as AnimalPoint).y)&&(p as AnimalPoint).x>=-380&&(p as AnimalPoint).x<=1180&&(p as AnimalPoint).y>=-340&&(p as AnimalPoint).y<=550;
export function validLivestock(v:unknown,day:number):v is Livestock{
 if(!v||typeof v!=='object')return false;const s=v as Livestock;
 if(s.feedHelpSeen!==undefined&&typeof s.feedHelpSeen!=='boolean'||s.feedOrders!==undefined&&(!Array.isArray(s.feedOrders)||s.feedOrders.length>100))return false;
 if(s.version!==1||!count(s.nextId)||s.nextId<1||!count(s.lastDay,day)||s.lastDay<1||!s.packed||!animalItems.every(k=>count(s.packed[k],999))||!count(s.feed)||!count(s.eggs)||!Array.isArray(s.pens)||s.pens.length>20||!Array.isArray(s.hens)||s.hens.length>80||!Array.isArray(s.orders)||s.orders.length>80)return false;
 const ids=new Set<number>();for(const pen of s.pens){if(!pen||!count(pen.id)||pen.id<1||pen.id>=s.nextId||ids.has(pen.id)||typeof pen.name!=='string'||pen.name.length>80||!point(pen.coop)||!Array.isArray(pen.boundary)||pen.boundary.length>16||pen.boundary.length>0&&pen.boundary.length<3||!pen.boundary.every(point)||!count(pen.gate,Math.max(0,pen.boundary.length-1))||!pen.fixtures||pen.rotations!==undefined&&(!pen.rotations||Object.entries(pen.rotations).some(([k,r])=>!['dustBath','perch'].includes(k)||r!==0&&r!==1))||Object.keys(pen.fixtures).some(k=>!fixtureKinds.includes(k as AnimalFixture))||!Object.values(pen.fixtures).every(point)||!count(pen.feed,HEN_CAPACITY*3)||!count(pen.eggs)||!count(pen.cleanedDay,day)||pen.wateredDay!==null&&!count(pen.wateredDay,day))return false;if(pen.emptyFeedDay!==undefined&&pen.emptyFeedDay!==null&&(!count(pen.emptyFeedDay,day)||pen.emptyFeedDay<1)||pen.dryDays!==undefined&&!count(pen.dryDays,3))return false;if(pen.coopWall!==undefined&&(!count(pen.coopWall,Math.max(0,pen.boundary.length-1))||coopWallForBoundary(pen.coop,pen.boundary)!==pen.coopWall||pen.gate===pen.coopWall))return false;ids.add(pen.id);}
 const animals=new Set<number>();for(const hen of s.hens){if(!hen||!count(hen.id)||hen.id<1||hen.id>=s.nextId||ids.has(hen.id)||animals.has(hen.id)||!ids.has(hen.penId)||!henVarieties.includes(hen.variety)||typeof hen.name!=='string'||!hen.name.trim()||[...hen.name].length>24||!count(hen.arrivedDay,day)||hen.arrivedDay<1||!count(hen.lastLayDay,day)||hen.lastLayDay<hen.arrivedDay||!count(hen.careDays,1)||!['bold','shy','curious'].includes(hen.personality))return false;animals.add(hen.id);}
 for(const order of s.orders){if(!order||!count(order.id)||order.id<1||order.id>=s.nextId||ids.has(order.id)||animals.has(order.id)||!ids.has(order.penId)||!henVarieties.includes(order.variety)||!count(order.dueDay,day+1)||order.dueDay<1)return false;animals.add(order.id);}
 for(const order of s.feedOrders??[]){if(!order||!count(order.id)||order.id<1||order.id>=s.nextId||ids.has(order.id)||animals.has(order.id)||!count(order.count)||order.count<1||order.count%FEED_BAG!==0||!count(order.dueDay,day+1)||order.dueDay<1||order.deliveredDay!==undefined&&(!count(order.deliveredDay,day)||order.deliveredDay<order.dueDay)||order.drop!==undefined&&!point(order.drop)||order.deliveredDay!==undefined&&!order.drop)return false;animals.add(order.id);}
 return s.pens.every(p=>penResidents(s,p.id).length+penReservations(s,p.id).length<=HEN_CAPACITY&&(!(penResidents(s,p.id).length+penReservations(s,p.id).length)||!penMissing(p).length));
}

export const FEED_CARE_HELP='Elfogyott az eleség az etetőből. Ha egy napon belül nem pótolod, a tojásrakás szünetel. Az etetőt már a teljes kiürülés előtt is feltöltheted.\n\nTakarmányt a Gazdaudvarban vásárolhatsz, vagy rendelhetsz Marától: ő másnap, a fuvarral hozza el.\n\nAz itatót naponta töltsd fel friss vízzel. Három kimaradt nap után a tojásrakás szintén szünetel. Gondozás után újra folytatódik; a tyúkok nem pusztulnak el.';
export const feedCareHelpPending=(s:Livestock|undefined)=>!!s&&!s.feedHelpSeen&&s.pens.some(p=>p.feed===0&&penResidents(s,p.id).length>0);
export function orderFeed(source:Snapshot):Snapshot|null{if(source.economy.gold<FEED_PRICE||(source.travel.livestock?.feedOrders?.length??0)>=100)return null;const next=structuredClone(source),s=next.travel.livestock??=createLivestock(source.clock.day);(s.feedOrders??=[]).push({id:s.nextId++,count:FEED_BAG,dueDay:source.clock.day+1});next.economy.gold-=FEED_PRICE;return next;}
export function deliverFeed(source:Snapshot,ids:number[],drop:AnimalPoint):Snapshot|null{const next=structuredClone(source),orders=next.travel.livestock?.feedOrders;const due=orders?.filter(o=>ids.includes(o.id)&&o.dueDay<=source.clock.day&&o.deliveredDay===undefined);if(!due?.length)return null;for(const o of due){o.deliveredDay=source.clock.day;o.drop={...drop};}return next;}
export function collectFeed(source:Snapshot,drop?:AnimalPoint,orderId?:number):Snapshot|null{const orders=source.travel.livestock?.feedOrders??[],delivered=orders.filter(o=>o.deliveredDay!==undefined&&(orderId===undefined||o.id===orderId)&&(!drop||o.drop?.x===drop.x&&o.drop?.y===drop.y));if(!delivered.length)return null;const total=delivered.reduce((n,o)=>n+o.count,0);if((source.travel.livestock?.feed??0)+total>999999)return null;const next=structuredClone(source),s=next.travel.livestock!;s.feed+=total;s.feedOrders=s.feedOrders!.filter(o=>!delivered.some(d=>d.id===o.id)).map(o=>o.deliveredDay===undefined?o:{...o,drop:feedSackPosition(o,orders)});return next;}

export function feedSackPosition(order:FeedOrder,orders:readonly FeedOrder[]):AnimalPoint|undefined{if(!order.drop)return undefined;const index=orders.filter(o=>o.deliveredDay!==undefined&&o.drop?.x===order.drop!.x&&o.drop?.y===order.drop!.y).findIndex(o=>o.id===order.id);return {x:order.drop.x-Math.max(0,index)*28,y:order.drop.y};}
