import { cultivable, targetTile, tileKey, type Garden, type Plot } from './gardening';
import { blocked } from './movement';
import type { Clock } from './clock';
import { createEconomy, validEconomy, crops, type Economy } from './economy';
import { createOrders, validOrders, type Orders } from './orders';
import {normalizeFarmName} from './farm-name';
import {createStory,validStory,type FarmStory} from './story-events';
import {createClearing,validClearing,type Clearing} from './cleanup';
import {createGardenSkill,validGardenSkill,gardeningLevel,rewardFruits,type GardenSkill} from './gardening-skill';
import { farmLayout } from './layout';
export const DB_NAME='erdoszeli-birtok';
export type Snapshot={version:12;skill:GardenSkill;story:FarmStory;clearing:Clearing;farmName:string|null;farmerName:string|null;orders:Orders;economy:Economy;produce:Garden['produce'];player:{x:number;y:number};clock:Clock;seeds:Garden['seeds'];plots:[string,Plot][]};
export function snapshot(player:{x:number;y:number},clock:Clock,garden:Garden,economy:Economy=createEconomy(),orders:Orders=createOrders(),farmName:string|null=null,clearing:Clearing=createClearing(),story:FarmStory=createStory(),skill:GardenSkill=createGardenSkill(),farmerName:string|null=null):Snapshot{
 return structuredClone({version:12,skill,story,clearing,farmName,farmerName,orders,economy,produce:garden.produce,player:{x:player.x,y:player.y},clock,seeds:garden.seeds,plots:[...garden.plots]});
}
const finite=(n:unknown):n is number=>typeof n==='number'&&Number.isFinite(n);
export function validSnapshot(value:unknown):value is Snapshot{
 if(!value||typeof value!=='object')return false;
 const v=value as Snapshot;
 if(v.version!==12||!validGardenSkill(v.skill)||!validStory(v.story)||!validClearing(v.clearing)||!v.player||!finite(v.player.x)||!finite(v.player.y)||blocked(v.player.x,v.player.y))return false;
 if(!validEconomy(v.economy)||v.economy.lastSale&&v.economy.lastSale.day>=v.clock?.day)return false;
 if(!validOrders(v.orders)||crops.some(k=>{const c=k as keyof Garden['seeds'];return !v.seeds||!Number.isSafeInteger(v.seeds[c])||v.seeds[c]+v.orders.pending[c]+v.orders.mailbox[c]>999999;}))return false;
 if(v.farmName!==null&&(typeof v.farmName!=='string'||normalizeFarmName(v.farmName)!==v.farmName))return false;
 if(v.farmerName!==null&&(typeof v.farmerName!=='string'||normalizeFarmName(v.farmerName)!==v.farmerName))return false;
 const c=v.clock;
 if(Object.values(v.clearing.removed).some(day=>day>c?.day))return false;
 if(!c||!Number.isSafeInteger(c.day)||c.day<1||!finite(c.elapsed)||!finite(c.collapseAt)||c.elapsed<0||c.elapsed>c.collapseAt||c.collapseAt<570||c.collapseAt>=600)return false;
 if(!v.seeds||!crops.every(k=>{const n=v.seeds[k as keyof Garden['seeds']];return Number.isSafeInteger(n)&&n>=0&&n<=999999;}))return false;
 if(!v.produce||!crops.every(k=>{const n=v.produce[k as keyof Garden['produce']];return Number.isSafeInteger(n)&&n>=0&&n<=999999;}))return false;
 if(!Array.isArray(v.plots)||v.plots.length>2000)return false;
 const keys=new Set<string>();
 for(const row of v.plots){
  if(!Array.isArray(row)||row.length!==2)return false;
  const [key,plot]=row;if(typeof key!=='string'||keys.has(key))return false;
  keys.add(key);const parts=key.split(',');if(parts.length!==2)return false;
  const [x,y]=parts.map(Number);
  if(!finite(x)||!finite(y)||tileKey({x,y})!==key||tileKey(targetTile(x+1,y+1))!==key||!cultivable({x,y}))return false;
  if(!plot||typeof plot!=='object'||typeof plot.watered!=='boolean'||!(plot.crop===null||crops.includes(plot.crop)))return false;
  if(!Number.isSafeInteger(plot.growth)||plot.growth<0||plot.growth>1000||typeof plot.regrowing!=='boolean'||(plot.regrowing&&!['pea','strawberry','honeyberry','blueberry'].includes(plot.crop??''))||(!plot.crop&&plot.growth!==0))return false;
 }
 return true;
}
// Migrate known formats without discarding the original backup until a v12 write succeeds.
export function decodeSnapshot(value:unknown):Snapshot|null{
 if(validSnapshot(value))return structuredClone(value);
 if(!value||typeof value!=='object'||!('version' in value)||(value.version!==1&&value.version!==2&&value.version!==3&&value.version!==4&&value.version!==5&&value.version!==6&&value.version!==7&&value.version!==8&&value.version!==9&&value.version!==10&&value.version!==11))return null;
 const legacy=value as {clearing?:Clearing;version:number;plots?:unknown;player?:{x:number;y:number}};
 if(!Array.isArray(legacy.plots)||legacy.plots.some(row=>!Array.isArray(row)||row.length!==2||!row[1]||typeof row[1]!=='object'))return null;
 let player=legacy.player;
 const box=farmLayout.shipping;
 // Only relocate an old player if the newly introduced crate occupies their saved spot.
 if(player&&Number.isFinite(player.x)&&Number.isFinite(player.y)&&player.x+7>box.x&&player.x-7<box.x+box.w&&player.y+3>box.y&&player.y-4<box.y+box.h)player={x:player.x,y:box.y+box.h+8};
 const old=value as unknown as Snapshot;
 const extend=(counts:object|undefined)=>counts&&typeof counts==='object'?{strawberry:0,honeyberry:0,blueberry:0,carrot:0,lettuce:0,onion:0,...counts}:counts;
 const additions={seeds:extend(old.seeds),...(legacy.version!==1?{produce:extend(old.produce)}:{}),...(legacy.version>=3?{economy:{...old.economy,shipping:extend(old.economy?.shipping),lastSale:old.economy?.lastSale?{...old.economy.lastSale,items:extend(old.economy.lastSale.items)}:old.economy?.lastSale}}:{}),...(legacy.version>=4?{orders:{pending:extend(old.orders?.pending),mailbox:extend(old.orders?.mailbox)}}:{})};
 const migrated={...value,...additions,version:12,farmerName:null,skill:legacy.version<8?createGardenSkill():legacy.version===11?old.skill:{...old.skill,levelThreeRewarded:false},clearing:legacy.version>=9?legacy.clearing:legacy.version>=6?{...legacy.clearing,positions:{},...(legacy.version===6?{weed:0}:{})}:createClearing(),...(legacy.version<7?{story:createStory()}:{}),...(legacy.version<5?{farmName:null}:{}),...(legacy.version<4?{orders:createOrders()}:{}),...(legacy.version<3?{economy:createEconomy()}:{}),player,
  ...(legacy.version===1?{produce:{radish:0,potato:0,pea:0,strawberry:0,honeyberry:0,blueberry:0,carrot:0,lettuce:0,onion:0},plots:legacy.plots.map(([key,p])=>[key,{...p,growth:0,regrowing:false}])}:{})};
 if(!validSnapshot(migrated))return null;
 // Earlier rewards were produce, so supply the missing planting materials once.
 // Keep existing crops, produce, orders and decorations untouched.
 if(legacy.version<10&&migrated.skill.rewarded)for(const fruit of Object.keys(rewardFruits) as (keyof typeof rewardFruits)[])migrated.seeds[fruit]=Math.min(999999-migrated.orders.pending[fruit]-migrated.orders.mailbox[fruit],migrated.seeds[fruit]+4);
 return structuredClone(migrated);
}
export type FarmSummary={id:string;name:string;farmerName?:string|null;day:number;gold:number;level:number;updatedAt:number};
type FarmCatalogue={version:1;selected:string|null;farms:FarmSummary[]};
type FarmRecord={active:unknown;backup:unknown};
const CATALOGUE_KEY='farm-catalogue';
const farmKey=(id:string)=>`farm:${id}`;
function validCatalogue(value:unknown):value is FarmCatalogue{
 if(!value||typeof value!=='object')return false;const c=value as FarmCatalogue;
 if(c.version!==1||!Array.isArray(c.farms))return false;
 const ids=new Set<string>();
 for(const f of c.farms){if(!f||typeof f.id!=='string'||! /^(legacy|farm-[a-zA-Z0-9-]{1,80})$/.test(f.id)||ids.has(f.id)||typeof f.name!=='string'||!normalizeFarmName(f.name)||(f.farmerName!==undefined&&f.farmerName!==null&&(typeof f.farmerName!=='string'||normalizeFarmName(f.farmerName)!==f.farmerName))||!Number.isSafeInteger(f.day)||f.day<1||!Number.isSafeInteger(f.gold)||f.gold<0||![1,2,3].includes(f.level)||!Number.isSafeInteger(f.updatedAt)||f.updatedAt<0)return false;ids.add(f.id);}
 return c.selected===null?c.farms.length===0:ids.has(c.selected);
}
function summary(id:string,data:Snapshot):FarmSummary{return {id,name:data.farmName??'Névtelen farm',farmerName:data.farmerName,day:data.clock.day,gold:data.economy.gold,level:gardeningLevel(data.skill),updatedAt:Date.now()};}
function decodePair(active:unknown,backup:unknown){
 const decoded=decodeSnapshot(active);if(decoded)return {data:decoded,recovered:false,raw:active};
 if(active&&typeof active==='object'&&'version' in active&&(!Number.isInteger(active.version)||Number(active.version)<1||Number(active.version)>12))throw new Error('Ez a mentés másik játékverzióhoz tartozik. Megőriztem, nem írtam felül.');
 const previous=decodeSnapshot(backup);if(previous)return {data:previous,recovered:true,raw:backup};
 throw new Error('A mentés nem olvasható. Megőriztem az eredetit; nem indítok rá új játékot.');
}
export class SaveStore{
 private db!:IDBDatabase;
 private last:unknown=null;
 private backup:unknown=null;
 private catalogue:FarmCatalogue|null=null;
 private writable=false;
 private queue=Promise.resolve();
 constructor(private factory:IDBFactory=indexedDB){}
 get selectedFarmId(){return this.catalogue?.selected??null;}
 private enqueue<T>(work:()=>Promise<T>):Promise<T>{const operation=this.queue.then(work);this.queue=operation.then(()=>{},()=>{});return operation;}
 private read(key:string){return new Promise<unknown>((resolve,reject)=>{const tx=this.db.transaction('saves');const request=tx.objectStore('saves').get(key);request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);});}
 private write(update:(store:IDBObjectStore)=>void){return new Promise<void>((resolve,reject)=>{
  if(!this.writable){reject(new Error('A mentési tároló nem írható.'));return;}
  const tx=this.db.transaction('saves','readwrite');try{update(tx.objectStore('saves'));}catch(error){tx.abort();reject(error);return;}
  tx.oncomplete=()=>resolve();tx.onabort=()=>reject(tx.error??new Error('A mentés megszakadt.'));tx.onerror=()=>reject(tx.error);
 });}
 async load():Promise<{data:Snapshot|null;recovered:boolean}>{
  this.writable=false;
  this.db=await new Promise((resolve,reject)=>{
   const request=this.factory.open(DB_NAME,1);
   request.onupgradeneeded=()=>request.result.createObjectStore('saves');
   request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);
   request.onblocked=()=>reject(new Error('A mentés adatbázisát egy másik ablak foglalja.'));
  });
  this.db.onversionchange=()=>{this.writable=false;this.db.close();};
  let [active,backup,catalogue]=await Promise.all(['active','backup',CATALOGUE_KEY].map(key=>this.read(key)));
  if(catalogue!==undefined){if(!validCatalogue(catalogue))throw new Error('A farmok listája nem olvasható vagy másik verzióból származik. A mentéseket megőriztem.');this.catalogue=catalogue;}
  if(this.catalogue?.selected){const record=await this.read(farmKey(this.catalogue.selected)) as FarmRecord|undefined;if(record){active=record.active;backup=record.backup;}else throw new Error('A kiválasztott farm mentése nem található. A többi farmot megőriztem.');}
  if(active===undefined&&backup===undefined){this.writable=true;return {data:null,recovered:false};}
  const decoded=decodePair(active,backup);this.last=decoded.raw;this.backup=backup??null;this.writable=true;
  return {data:decoded.data,recovered:decoded.recovered};
 }
 async listFarms():Promise<FarmSummary[]>{
  return this.enqueue(async()=>{
   if(!this.writable)throw new Error('A mentési tároló nem írható.');
   if(!this.catalogue){
    const data=decodeSnapshot(this.last),next:FarmCatalogue={version:1,selected:data?'legacy':null,farms:data?[summary('legacy',data)]:[]};
    // Add a library around the original save; never delete or overwrite its keys.
    await this.write(store=>{if(data)store.put({active:this.last,backup:this.backup},farmKey('legacy'));store.put(next,CATALOGUE_KEY);});this.catalogue=next;
   }
   return structuredClone(this.catalogue.farms).sort((a,b)=>b.updatedAt-a.updatedAt);
  });
 }
 save(data:Snapshot):Promise<void>{
  const copy=structuredClone(data),selected=this.selectedFarmId;
  return this.enqueue(async()=>{
   if(!this.writable||!validSnapshot(copy))throw new Error('A mentési állapot nem érvényes vagy a tároló nem írható.');
   if(this.catalogue&&!selected)throw new Error('Előbb válassz vagy hozz létre egy farmot.');
   if(selected!==this.selectedFarmId)throw new Error('Időközben másik farmot választottál. A régi állapotot nem írtam rá.');
   const next=this.catalogue?structuredClone(this.catalogue):null;
   if(next&&selected){const index=next.farms.findIndex(f=>f.id===selected);next.farms[index]=summary(selected,copy);}
   await this.write(store=>{
    if(this.last)store.put(this.last,'backup');store.put(copy,'active');
    if(next&&selected){store.put({active:copy,backup:this.last},farmKey(selected));store.put(next,CATALOGUE_KEY);}
   });this.backup=this.last;this.last=copy;if(next)this.catalogue=next;
  });
 }
 async createFarm(data:Snapshot):Promise<string>{
  const copy=structuredClone(data);if(!validSnapshot(copy)||!copy.farmName||!copy.farmerName)throw new Error('Az új farmnak és farmernek érvényes név és kezdőállapot szükséges.');
  await this.listFarms();
  return this.enqueue(async()=>{
   const id=`farm-${crypto.randomUUID()}`;if(this.catalogue!.farms.some(f=>f.id===id))throw new Error('Nem sikerült új mentésazonosítót létrehozni. Próbáld újra.');const next:FarmCatalogue={...structuredClone(this.catalogue!),selected:id};next.farms.push(summary(id,copy));
   await this.write(store=>{store.put({active:copy,backup:copy},farmKey(id));store.put(copy,'active');store.put(copy,'backup');store.put(next,CATALOGUE_KEY);});
   this.last=copy;this.backup=copy;this.catalogue=next;return id;
  });
 }
 async selectFarm(id:string):Promise<{data:Snapshot;recovered:boolean}>{
  await this.listFarms();
  return this.enqueue(async()=>{
   if(!this.catalogue!.farms.some(f=>f.id===id))throw new Error('Ez a farm nem található a mentések között.');
   const record=await this.read(farmKey(id)) as FarmRecord|undefined;if(!record)throw new Error('A farm mentése nem található. A jelenlegi farmot megőriztem.');
   const decoded=decodePair(record.active,record.backup),next={...structuredClone(this.catalogue!),selected:id};
   await this.write(store=>{store.put(decoded.raw,'active');store.put(record.backup??decoded.raw,'backup');store.put(next,CATALOGUE_KEY);});
   this.last=decoded.raw;this.backup=record.backup??decoded.raw;this.catalogue=next;return {data:decoded.data,recovered:decoded.recovered};
  });
 }
 close(){this.writable=false;this.db?.close();}
}
