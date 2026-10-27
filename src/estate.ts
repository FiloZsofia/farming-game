import {setsFruit,RIPE_FRUIT_DAYS,type PollinationContext} from './pollination';
import {calendarDay} from './clock';
import {farmLayout,farmBounds} from './layout';
import {pondRadius} from './pond-shape';
export const seasons=['Tavasz','Nyár','Ősz','Tél'] as const;
export const seasonIndex=(day:number)=>Math.floor((day-1)/15)%4;
export const seasonDay=(day:number)=>(day-1)%15+1;
export const treeKinds=['cherry','plum','apple','pear'] as const;
export type TreeKind=typeof treeKinds[number];
export const trees:Record<TreeKind,{name:string;price:number;yield:number;repeat:number;sale:number;season:number}>={cherry:{name:'Cseresznye',price:300,yield:3,repeat:3,sale:18,season:1},plum:{name:'Szilva',price:270,yield:4,repeat:4,sale:16,season:1},apple:{name:'Alma',price:250,yield:3,repeat:2,sale:16,season:2},pear:{name:'Körte',price:250,yield:3,repeat:3,sale:16,season:2}};
export const goods=['cherry','plum','apple','pear','lily','reed','duckNest','goldfish','carp'] as const;
export type Good=typeof goods[number];
export const extras=['cherry','plum','apple','pear','roe6','roe8','roe10','duckEgg','thyme','plantain','nettle','basket'] as const;
export type Extra=typeof extras[number];
export type ExtraCounts=Record<Extra,number>;
export const extraNames:Record<Extra,string>={cherry:'Cseresznye',plum:'Szilva',apple:'Alma',pear:'Körte',roe6:'Ikraadag',roe8:'Ikraadag',roe10:'Ikraadag',duckEgg:'Vadkacsatojás',thyme:'Vadkakukkfű',plantain:'Lándzsás útifű',nettle:'Csalán',basket:'Nádkosár'};
export const extraPrices:Record<Extra,number>={cherry:18,plum:16,apple:16,pear:16,roe6:6,roe8:8,roe10:10,duckEgg:13,thyme:4,plantain:4,nettle:4,basket:40};
export const goodNames:Record<Good,string>={cherry:'Cseresznyecsemete',plum:'Szilvacsemete',apple:'Almacsemete',pear:'Körtecsemete',lily:'Tavirózsa',reed:'Nád',duckNest:'Vadkacsafészek',goldfish:'Aranyhal',carp:'Ponty'};
export const goodPrices:Record<Good,number>={cherry:300,plum:270,apple:250,pear:250,lily:20,reed:8,duckNest:80,goldfish:40,carp:30};
export const emptyExtras=():ExtraCounts=>({cherry:0,plum:0,apple:0,pear:0,roe6:0,roe8:0,roe10:0,duckEgg:0,thyme:0,plantain:0,nettle:0,basket:0});
export const extraValue=(items:ExtraCounts)=>extras.reduce((sum,k)=>sum+items[k]*extraPrices[k],0);
export const validExtras=(v:unknown):v is ExtraCounts=>!!v&&typeof v==='object'&&extras.every(k=>Number.isSafeInteger((v as ExtraCounts)[k])&&(v as ExtraCounts)[k]>=0&&(v as ExtraCounts)[k]<=999999);
export type OrchardTree={bloomCycle?:number;fruitDay?:number;bloomState?:'empty'|'fallen';kind:TreeKind;x:number;y:number;planted:number;last:number;fruit:number};
export type PondPlace={kind:'lily'|'reed'|'duckNest';x:number;y:number;day:number;lastHarvest?:number};
export type Estate={duckPurchaseDay:number|null;duckArrivalDay:number|null;duckArrivalPending:boolean;goods:Record<Good,number>;produce:ExtraCounts;shipping:ExtraCounts;trees:OrchardTree[];pond:PondPlace[];fish:{goldfish:number;carp:number};roe:ExtraCounts;eggs:number;roeDay:number;eggDay:number};
export const createEstate=():Estate=>({duckPurchaseDay:null,duckArrivalDay:null,duckArrivalPending:false,goods:Object.fromEntries(goods.map(k=>[k,0])) as Record<Good,number>,produce:emptyExtras(),shipping:emptyExtras(),trees:[],pond:[],fish:{goldfish:0,carp:0},roe:emptyExtras(),eggs:0,roeDay:0,eggDay:0});
const count=(n:number)=>Number.isSafeInteger(n)&&n>=0&&n<=999999;
function validTreeCycle(t:OrchardTree,day:number){return (t.bloomCycle===undefined||Number.isSafeInteger(t.bloomCycle)&&t.bloomCycle>=0&&t.bloomCycle<=999999)&&(t.fruitDay===undefined||Number.isSafeInteger(t.fruitDay)&&t.fruitDay>=1&&t.fruitDay<=day&&t.fruit>0)&&(t.bloomState===undefined||['empty','fallen'].includes(t.bloomState)&&t.fruit===0);}
export function validEstate(v:unknown,day:number):v is Estate{
 if(!v||typeof v!=='object')return false;const e=v as Estate;
 const date=(n:number)=>Number.isSafeInteger(n)&&n>=0&&n<=day;
 return (e.duckPurchaseDay===null||date(e.duckPurchaseDay)&&e.duckPurchaseDay>=1)&&(e.duckArrivalDay===null||date(e.duckArrivalDay)&&e.duckArrivalDay>=1)&&typeof e.duckArrivalPending==='boolean'&&(!e.duckArrivalPending||e.duckArrivalDay!==null)&&!!e.goods&&goods.every(k=>count(e.goods[k]))&&validExtras(e.produce)&&validExtras(e.shipping)&&validExtras(e.roe)&&!!e.fish&&count(e.fish.goldfish)&&count(e.fish.carp)&&count(e.eggs)&&date(e.roeDay)&&date(e.eggDay)&&Array.isArray(e.trees)&&e.trees.length<=200&&e.trees.every(t=>t&&validTreeCycle(t,day)&&treeKinds.includes(t.kind)&&Number.isFinite(t.x)&&t.x>=farmBounds.left+24&&t.x<=farmBounds.right-24&&Number.isFinite(t.y)&&t.y>=farmBounds.top+32&&t.y<=576&&date(t.planted)&&t.planted>=1&&date(t.last)&&count(t.fruit))&&Array.isArray(e.pond)&&e.pond.length<=200&&e.pond.every(p=>['lily','reed','duckNest'].includes(p.kind)&&Number.isFinite(p.x)&&Number.isFinite(p.y)&&date(p.day)&&p.day>=1&&(p.lastHarvest===undefined||p.kind==='reed'&&date(p.lastHarvest)&&p.lastHarvest>=p.day))&&e.pond.filter(p=>p.kind==='duckNest').length<=1&&(e.duckArrivalDay===null||e.pond.some(p=>p.kind==='duckNest'&&e.duckArrivalDay!>=p.day+3));
}
export function buyGood(estate:Estate,gold:number,good:Good,amount=1,day=1){
 if(!goods.includes(good)||!Number.isSafeInteger(amount)||amount<1||amount>999||estate.goods[good]+amount>999999||gold<goodPrices[good]*amount)return null;
 const next=structuredClone(estate);if(good==='duckNest'&&next.goods.duckNest===0&&!next.pond.some(p=>p.kind==='duckNest'))next.duckPurchaseDay=day;next.goods[good]+=amount;return {estate:next,gold:gold-goodPrices[good]*amount};
}
export function waterAt(x:number,y:number){const p=farmLayout.pond,dx=(x-p.x)/p.rx,dy=(y-p.y)/p.ry;return Math.hypot(dx,dy)<pondRadius(Math.atan2(dy,dx))*.92;}
export function shoreAt(x:number,y:number){const p=farmLayout.pond;return Math.abs(Math.hypot((x-p.x)/p.rx,(y-p.y)/p.ry)-pondRadius(Math.atan2((y-p.y)/p.ry,(x-p.x)/p.rx)))<.23;}
export function placeGood(estate:Estate,good:Good,x:number,y:number,day:number,freeLand:boolean,farmName?:string|null){
 if(estate.goods[good]<1)return null;const next=structuredClone(estate);
 if(treeKinds.includes(good as TreeKind)){if(seasonIndex(calendarDay(day,farmName))!==0||!freeLand||next.trees.length>=200||next.trees.some(t=>Math.hypot(x-t.x,y-t.y)<64))return null;next.trees.push({kind:good as TreeKind,x,y,planted:day,last:0,fruit:0});}
 else if(good==='goldfish'||good==='carp'){if(!waterAt(x,y)||next.fish[good]>=999999)return null;if(next.fish.goldfish+next.fish.carp===0)next.roeDay=day;next.fish[good]++;}
 else{if(next.pond.length>=200||next.pond.some(p=>Math.hypot(p.x-x,p.y-y)<22))return null;if(good==='duckNest'){if(next.pond.some(p=>p.kind==='duckNest')||!shoreAt(x,y)||!freeLand)return null;next.eggDay=day;if(next.duckPurchaseDay===null)next.duckPurchaseDay=day;}else if(!waterAt(x,y))return null;next.pond.push({kind:good as PondPlace['kind'],x,y,day});}
 next.goods[good]--;return next;
}
export function advanceEstate(estate:Estate,day:number,random=Math.random,farmName?:string|null,ecology?:PollinationContext){
 const next=structuredClone(estate);
 for(const t of next.trees){const spec=trees[t.kind];
  if(ecology&&t.bloomState==='fallen'&&day-t.last>1)delete t.bloomState;
  if(ecology&&t.fruit>0){t.fruitDay??=day;if(day-t.fruitDay>=RIPE_FRUIT_DAYS){t.fruit=0;t.last=day;t.bloomState='fallen';delete t.fruitDay;continue;}}
  if(day-t.planted>=15&&seasonIndex(calendarDay(day,farmName))===spec.season&&t.fruit===0&&(t.last===0||day-t.last>=spec.repeat)){
   const success=!ecology||setsFruit(ecology.seed,`tree:${t.kind}:${t.x},${t.y}`,t.bloomCycle??0);
   if(ecology)t.bloomCycle=(t.bloomCycle??0)+1;
   if(success){t.fruit=spec.yield;if(ecology)t.fruitDay=day;delete t.bloomState;}
   else{t.last=day;t.bloomState='empty';}
  }
 }
 const fish=next.fish.goldfish+next.fish.carp;
 if(fish>0&&day-next.roeDay>=3){const type:Extra=fish<=4?'roe6':fish<=10?'roe8':'roe10';next.roe[type]=Math.min(999999,next.roe[type]+1);next.roeDay=day;}
 if(next.pond.some(p=>p.kind==='duckNest'&&day-p.day>=3)&&next.duckArrivalDay===null){next.duckArrivalDay=day;next.duckArrivalPending=true;next.eggDay=day;}
 if(next.duckArrivalDay!==null&&day-next.eggDay>=4){next.eggs=Math.min(999999,next.eggs+2+Math.min(2,Math.floor(random()*3)));next.eggDay=day;}
 return next;
}
export function collectEstate(estate:Estate,x:number,y:number,day:number){
 const next=structuredClone(estate),tree=next.trees.find(t=>t.fruit>0&&Math.hypot(t.x-x,t.y-y)<50);
 if(tree){if(next.produce[tree.kind]+tree.fruit>999999)return null;next.produce[tree.kind]+=tree.fruit;tree.fruit=0;tree.last=day;delete tree.fruitDay;delete tree.bloomState;return next;}
 if(!shoreAt(x,y))return null;let found=false;
 for(const k of extras){if(next.roe[k]&&next.produce[k]+next.roe[k]<=999999){next.produce[k]+=next.roe[k];next.roe[k]=0;found=true;}}
 if(next.eggs&&next.produce.duckEgg+next.eggs<=999999){next.produce.duckEgg+=next.eggs;next.eggs=0;found=true;}
 return found?next:null;
}

export const reedReady=(reed:PondPlace,day:number)=>reed.kind==='reed'&&day-(reed.lastHarvest??reed.day)>=3;
export function cutReed(estate:Estate,index:number,day:number){const reed=estate.pond[index];if(!reed||!reedReady(reed,day))return null;const next=structuredClone(estate);next.pond[index].lastHarvest=day;return next;}
