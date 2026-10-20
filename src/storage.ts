import { cultivable, targetTile, tileKey, type Garden, type Plot } from './gardening';
import { blocked } from './movement';
import type { Clock } from './clock';
export const DB_NAME='erdoszeli-birtok';
export type Snapshot={version:2;produce:Garden['produce'];player:{x:number;y:number};clock:Clock;seeds:Garden['seeds'];plots:[string,Plot][]};
export function snapshot(player:{x:number;y:number},clock:Clock,garden:Garden):Snapshot{
 return structuredClone({version:2,produce:garden.produce,player:{x:player.x,y:player.y},clock,seeds:garden.seeds,plots:[...garden.plots]});
}
const finite=(n:unknown):n is number=>typeof n==='number'&&Number.isFinite(n);
export function validSnapshot(value:unknown):value is Snapshot{
 if(!value||typeof value!=='object')return false;
 const v=value as Snapshot;
 if(v.version!==2||!v.player||!finite(v.player.x)||!finite(v.player.y)||blocked(v.player.x,v.player.y))return false;
 const c=v.clock;
 if(!c||!Number.isSafeInteger(c.day)||c.day<1||!finite(c.elapsed)||!finite(c.collapseAt)||c.elapsed<0||c.elapsed>c.collapseAt||c.collapseAt<570||c.collapseAt>=600)return false;
 if(!v.seeds||!['radish','potato','pea'].every(k=>{const n=v.seeds[k as keyof Garden['seeds']];return Number.isSafeInteger(n)&&n>=0&&n<=4;}))return false;
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
// Keep the original v1 object as backup until the upgraded v2 transaction commits.
export function decodeSnapshot(value:unknown):Snapshot|null{
 if(validSnapshot(value))return structuredClone(value);
 if(!value||typeof value!=='object'||!('version' in value)||value.version!==1)return null;
 const legacy=value as {plots?:unknown};
 if(!Array.isArray(legacy.plots)||legacy.plots.some(row=>!Array.isArray(row)||row.length!==2||!row[1]||typeof row[1]!=='object'))return null;
 const migrated={...value,version:2,produce:{radish:0,potato:0,pea:0},plots:legacy.plots.map(([key,p])=>[key,{...p,growth:0,regrowing:false}])};
 return validSnapshot(migrated)?migrated:null;
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
  if(active&&typeof active==='object'&&'version' in active&&active.version!==1&&active.version!==2)throw new Error('Ez a mentés másik játékverzióhoz tartozik. Megőriztem, nem írtam felül.');
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
