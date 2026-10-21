import { cultivable, targetTile, tileKey, type Garden, type Plot } from './gardening';
import { blocked } from './movement';
import type { Clock } from './clock';
import { createEconomy, validEconomy, type Economy } from './economy';
import { createOrders, validOrders, type Orders } from './orders';
import {normalizeFarmName} from './farm-name';
import {createClearing,validClearing,type Clearing} from './cleanup';
import { farmLayout } from './layout';
export const DB_NAME='erdoszeli-birtok';
export type Snapshot={version:6;clearing:Clearing;farmName:string|null;orders:Orders;economy:Economy;produce:Garden['produce'];player:{x:number;y:number};clock:Clock;seeds:Garden['seeds'];plots:[string,Plot][]};
export function snapshot(player:{x:number;y:number},clock:Clock,garden:Garden,economy:Economy=createEconomy(),orders:Orders=createOrders(),farmName:string|null=null,clearing:Clearing=createClearing()):Snapshot{
 return structuredClone({version:6,clearing,farmName,orders,economy,produce:garden.produce,player:{x:player.x,y:player.y},clock,seeds:garden.seeds,plots:[...garden.plots]});
}
const finite=(n:unknown):n is number=>typeof n==='number'&&Number.isFinite(n);
export function validSnapshot(value:unknown):value is Snapshot{
 if(!value||typeof value!=='object')return false;
 const v=value as Snapshot;
 if(v.version!==6||!validClearing(v.clearing)||!v.player||!finite(v.player.x)||!finite(v.player.y)||blocked(v.player.x,v.player.y))return false;
 if(!validEconomy(v.economy)||v.economy.lastSale&&v.economy.lastSale.day>=v.clock?.day)return false;
 if(!validOrders(v.orders)||['radish','potato','pea'].some(k=>{const c=k as keyof Garden['seeds'];return !v.seeds||!Number.isSafeInteger(v.seeds[c])||v.seeds[c]+v.orders.pending[c]+v.orders.mailbox[c]>999999;}))return false;
 if(v.farmName!==null&&(typeof v.farmName!=='string'||normalizeFarmName(v.farmName)!==v.farmName))return false;
 const c=v.clock;
 if(Object.values(v.clearing.removed).some(day=>day>c?.day))return false;
 if(!c||!Number.isSafeInteger(c.day)||c.day<1||!finite(c.elapsed)||!finite(c.collapseAt)||c.elapsed<0||c.elapsed>c.collapseAt||c.collapseAt<570||c.collapseAt>=600)return false;
 if(!v.seeds||!['radish','potato','pea'].every(k=>{const n=v.seeds[k as keyof Garden['seeds']];return Number.isSafeInteger(n)&&n>=0&&n<=999999;}))return false;
 if(!v.produce||!['radish','potato','pea'].every(k=>{const n=v.produce[k as keyof Garden['produce']];return Number.isSafeInteger(n)&&n>=0&&n<=999999;}))return false;
 if(!Array.isArray(v.plots)||v.plots.length>2000)return false;
 const keys=new Set<string>();
 for(const row of v.plots){
  if(!Array.isArray(row)||row.length!==2)return false;
  const [key,plot]=row;if(typeof key!=='string'||keys.has(key))return false;
  keys.add(key);const parts=key.split(',');if(parts.length!==2)return false;
  const [x,y]=parts.map(Number);
  if(!finite(x)||!finite(y)||tileKey({x,y})!==key||tileKey(targetTile(x+1,y+1))!==key||!cultivable({x,y}))return false;
  if(!plot||typeof plot!=='object'||typeof plot.watered!=='boolean'||!(plot.crop===null||['radish','potato','pea'].includes(plot.crop)))return false;
  if(!Number.isSafeInteger(plot.growth)||plot.growth<0||plot.growth>1000||typeof plot.regrowing!=='boolean'||(plot.regrowing&&plot.crop!=='pea')||(!plot.crop&&plot.growth!==0))return false;
 }
 return true;
}
// Migrate known formats without discarding the original backup until a v6 write succeeds.
export function decodeSnapshot(value:unknown):Snapshot|null{
 if(validSnapshot(value))return structuredClone(value);
 if(!value||typeof value!=='object'||!('version' in value)||(value.version!==1&&value.version!==2&&value.version!==3&&value.version!==4&&value.version!==5))return null;
 const legacy=value as {version:number;plots?:unknown;player?:{x:number;y:number}};
 if(!Array.isArray(legacy.plots)||legacy.plots.some(row=>!Array.isArray(row)||row.length!==2||!row[1]||typeof row[1]!=='object'))return null;
 let player=legacy.player;
 const box=farmLayout.shipping;
 // Only relocate an old player if the newly introduced crate occupies their saved spot.
 if(player&&Number.isFinite(player.x)&&Number.isFinite(player.y)&&player.x+7>box.x&&player.x-7<box.x+box.w&&player.y+3>box.y&&player.y-4<box.y+box.h)player={x:player.x,y:box.y+box.h+8};
 const migrated={...value,version:6,clearing:createClearing(),...(legacy.version<5?{farmName:null}:{}),...(legacy.version<4?{orders:createOrders()}:{}),...(legacy.version<3?{economy:createEconomy()}:{}),player,
  ...(legacy.version===1?{produce:{radish:0,potato:0,pea:0},plots:legacy.plots.map(([key,p])=>[key,{...p,growth:0,regrowing:false}])}:{})};
 return validSnapshot(migrated)?structuredClone(migrated):null;
}
export class SaveStore{
 private db!:IDBDatabase;
 private last:unknown=null;
 private writable=false;
 private queue=Promise.resolve();
 constructor(private factory:IDBFactory=indexedDB){}
 async load():Promise<{data:Snapshot|null;recovered:boolean}>{
  this.db=await new Promise((resolve,reject)=>{
   const request=this.factory.open(DB_NAME,1);
   request.onupgradeneeded=()=>request.result.createObjectStore('saves');
   request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);
   request.onblocked=()=>reject(new Error('A mentés adatbázisát egy másik ablak foglalja.'));
  });
  this.db.onversionchange=()=>{this.writable=false;this.db.close();};
  const [active,backup]=await Promise.all(['active','backup'].map(key=>new Promise<unknown>((resolve,reject)=>{
   const tx=this.db.transaction('saves');const req=tx.objectStore('saves').get(key);req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);
  })));
  if(active===undefined&&backup===undefined){this.writable=true;return {data:null,recovered:false};}
  const decoded=decodeSnapshot(active);
  if(decoded){this.last=active;this.writable=true;return {data:decoded,recovered:false};}
  // An unknown version might belong to a newer game; never overwrite it with a backup.
  if(active&&typeof active==='object'&&'version' in active&&active.version!==1&&active.version!==2&&active.version!==3&&active.version!==4&&active.version!==5&&active.version!==6)throw new Error('Ez a mentés másik játékverzióhoz tartozik. Megőriztem, nem írtam felül.');
  const previous=decodeSnapshot(backup);
  if(previous){this.last=backup;this.writable=true;return {data:previous,recovered:true};}
  throw new Error('A mentés nem olvasható. Megőriztem az eredetit; nem indítok rá új játékot.');
 }
 save(data:Snapshot):Promise<void>{
  const copy=structuredClone(data);
  const operation=this.queue.then(async()=>{
   if(!this.writable||!validSnapshot(copy))throw new Error('A mentési állapot nem érvényes vagy a tároló nem írható.');
   await new Promise<void>((resolve,reject)=>{
    const tx=this.db.transaction('saves','readwrite');const store=tx.objectStore('saves');
    if(this.last)store.put(this.last,'backup');store.put(copy,'active');
    tx.oncomplete=()=>resolve();tx.onabort=()=>reject(tx.error??new Error('A mentés megszakadt.'));tx.onerror=()=>reject(tx.error);
   });this.last=copy;
  });
  this.queue=operation.catch(()=>{});return operation;
 }
 close(){this.writable=false;this.db?.close();}
}
