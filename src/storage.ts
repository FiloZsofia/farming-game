import {migrateForest} from './forest';
import {atHomeBedside} from './home';
import {createResearch} from './research';
import {createEstate} from './estate';
import {createTravel,validTravel,type Travel} from './travel';
import {worldBlocked,relocateVillagePlayer} from './village-layout';
import { cultivable, targetTile, tileKey, type Garden, type Plot } from './gardening';
import type { Clock } from './clock';
import { createEconomy, validEconomy, crops, type Economy } from './economy';
import { createOrders, validOrders, type Orders } from './orders';
import {normalizeFarmName} from './farm-name';
import {createStory,validStory,type FarmStory} from './story-events';
import {createClearing,validClearing,type Clearing} from './cleanup';
import {createGardenSkill,migrateGardenSkill,validGardenSkill,gardeningLevel,rewardFruits,type GardenSkill} from './gardening-skill';
import {blocked} from './movement';
import { farmLayout,farmBounds } from './layout';
export const DB_NAME='erdoszeli-birtok';
export type Snapshot={version:17;travel:Travel;skill:GardenSkill;story:FarmStory;clearing:Clearing;farmName:string|null;farmerName:string|null;orders:Orders;economy:Economy;produce:Garden['produce'];player:{x:number;y:number};clock:Clock;seeds:Garden['seeds'];plots:[string,Plot][]};
export function snapshot(player:{x:number;y:number},clock:Clock,garden:Garden,economy:Economy=createEconomy(),orders:Orders=createOrders(),farmName:string|null=null,clearing:Clearing=createClearing(),story:FarmStory=createStory(),skill:GardenSkill=createGardenSkill(),farmerName:string|null=null,travel:Travel=createTravel()):Snapshot{
 return structuredClone({version:17,travel,skill,story,clearing,farmName,farmerName,orders,economy,produce:garden.produce,player:{x:player.x,y:player.y},clock,seeds:garden.seeds,plots:[...garden.plots]});
}
const finite=(n:unknown):n is number=>typeof n==='number'&&Number.isFinite(n);
export function validSnapshot(value:unknown):value is Snapshot{
 if(!value||typeof value!=='object')return false;
 const v=value as Snapshot;
 if(v.version!==17||!validTravel(v.travel,v.clock?.day)||!validGardenSkill(v.skill)||!validStory(v.story)||!validClearing(v.clearing)||!v.player||!finite(v.player.x)||!finite(v.player.y)||worldBlocked(v.player.x,v.player.y))return false;
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
 const storedBirdhouses=(v.skill.chests?.placed??[]).reduce((sum,c)=>sum+(c.items['special:birdhouse']??0),0);if(storedBirdhouses!==(v.skill.birdhouseStored?1:0)||v.skill.birdhouseStored&&(!v.story.giftReceived||v.story.birdhouse!==null))return false;
 if(v.travel.research.flowers.some(f=>!v.plots.some(([key,p])=>key===tileKey(f)&&p.crop===null)))return false;
 return true;
}
// Migrate known formats without discarding the original backup until a v17 write succeeds.
export function decodeSnapshot(value:unknown):Snapshot|null{
 if(value&&typeof value==='object'&&'version' in value&&value.version===17){const old=value as Snapshot;if(old.player?.x> -910&&old.player.x< -860&&old.player.y>=695&&old.player.y<=1340&&worldBlocked(old.player.x,old.player.y)){const next=structuredClone(old);next.player.x=-840;return decodeSnapshot(next);}}
 // New pathside trunks may cover an old village position; preserve every possession.
 if(value&&typeof value==='object'&&'version' in value&&value.version===17){const old=value as Snapshot;if(old.player&&Number.isFinite(old.player.x)&&Number.isFinite(old.player.y)&&old.player.y>=600&&old.player.y<1400){const player=relocateVillagePlayer(old.player);if(player!==old.player){const next=structuredClone(old);next.player=player;if(validSnapshot(next))return decodeSnapshot(next);}}}
 // Extend existing pond/fruit counts with new forage types without touching possessions.
 if(value&&typeof value==='object'){
  const old=value as Snapshot,estate=old.travel?.estate;
  if(estate&&['produce','shipping','roe'].every(k=>!!estate[k as keyof typeof estate]&&typeof estate[k as keyof typeof estate]==='object'&&!Array.isArray(estate[k as keyof typeof estate]))&&['produce','shipping','roe'].some(k=>['thyme','plantain','nettle'].some(h=>!(h in (estate[k as keyof typeof estate] as object))))){
   const next=structuredClone(old);for(const k of ['produce','shipping','roe'] as const)next.travel.estate[k]=Object.assign({thyme:0,plantain:0,nettle:0},estate[k]);
   for(const receipt of [next.economy?.lastSale,next.travel?.sale])if(receipt&&'extras' in receipt&&receipt.extras)receipt.extras=Object.assign({thyme:0,plantain:0,nettle:0},receipt.extras);
   return decodeSnapshot(next);
  }
 }

 if(validSnapshot(value)){const result=structuredClone(value);result.skill=migrateGardenSkill(result.skill);if(result.travel.forest)result.travel.forest=migrateForest(result.travel.forest);if(result.travel.research.supplied===undefined&&(result.travel.research.materials.glass>0||result.travel.research.materials.linen>0))result.travel.research.supplied=[...(result.travel.research.materials.glass>0?['annie' as const]:[]),...(result.travel.research.materials.linen>0?['leo' as const]:[])];return result;}
 // Layout changes can cover saved debris and a placed birdhouse as well as the player.
 // Move only objects in the newly occupied strips; never reset the farm or its resources.
 if(value&&typeof value==='object'&&'version' in value&&value.version===17){
  const old=value as Snapshot,boxes=[farmLayout.shedBounds,farmLayout.houseBounds,farmLayout.shipping],previous=[{x:576,y:92,w:118,h:89},{x:132,y:110,w:215,h:113},{x:158,y:244,w:32,h:24}];
  const newlyCovered=(p:{x:number;y:number})=>{if(!p||!finite(p.x)||!finite(p.y))return false;const overlaps=(b:{x:number;y:number;w:number;h:number})=>p.x+7>b.x&&p.x-7<b.x+b.w&&p.y+3>b.y&&p.y-4<b.y+b.h;return boxes.some(overlaps)&&!previous.some(overlaps)&&blocked(p.x,p.y);};
  const migrated=structuredClone(old);let changed=false;
  if(old.player&&finite(old.player.x)&&finite(old.player.y)&&atHomeBedside(old.player.x,old.player.y)){migrated.player={x:320,y:old.player.y};changed=true;}
  const freePlace=(p:{x:number;y:number},id:string)=>{
   const allowed=(q:{x:number;y:number})=>!blocked(q.x,q.y)&&!blocked(q.x-16,q.y)&&!blocked(q.x+16,q.y)&&!blocked(q.x,q.y-16)&&!blocked(q.x,q.y+16)&&q.x>=farmBounds.left+40&&q.x<=farmBounds.right-40&&q.y>=farmBounds.top+48&&q.y<=560&&(!Array.isArray(old.plots)||old.plots.every(row=>{if(!Array.isArray(row)||typeof row[0]!=='string')return true;const [x,y]=row[0].split(',').map(Number);return Math.abs(q.x-x-8)>=28||Math.abs(q.y-y-8)>=28;}))&&(!migrated.story?.birdhouse||id==='birdhouse'||Math.hypot(q.x-migrated.story.birdhouse.x,q.y-migrated.story.birdhouse.y)>28)&&Object.entries(migrated.clearing?.positions??{}).every(([key,v])=>key===id||!v||!finite(v.x)||!finite(v.y)||Math.hypot(q.x-v.x,q.y-v.y)>=28)&&(Array.isArray(migrated.travel?.estate?.trees)?migrated.travel.estate.trees:[]).every(t=>Math.hypot(q.x-t.x,q.y-t.y)>28);
   for(let d=8;d<=512;d+=8)for(let i=0;i<32;i++){const q={x:Math.round(p.x+Math.cos(i*Math.PI/16)*d),y:Math.round(p.y+Math.sin(i*Math.PI/16)*d)};if(allowed(q))return q;}return null;
  };
  if(newlyCovered(old.player)){const p={x:old.player.x,y:old.player.y+3>farmLayout.shipping.y&&old.player.y-4<farmLayout.shipping.y+farmLayout.shipping.h&&old.player.x+7>farmLayout.shipping.x&&old.player.x-7<farmLayout.shipping.x+farmLayout.shipping.w?farmLayout.shipping.y+farmLayout.shipping.h+8:old.player.x<400?280:224};if(!blocked(p.x,p.y)){migrated.player=p;changed=true;}}
  if(old.story?.birdhouse&&newlyCovered(old.story.birdhouse)){const p=freePlace(old.story.birdhouse,'birdhouse');if(p){migrated.story.birdhouse=p;changed=true;}}
  if(old.clearing?.positions&&typeof old.clearing.positions==='object'&&!Array.isArray(old.clearing.positions))for(const [id,p]of Object.entries(old.clearing.positions)){if(newlyCovered(p)){const q=freePlace(p,id);if(q){migrated.clearing.positions[id]=q;changed=true;}}}
  if(changed&&validSnapshot(migrated)){migrated.skill=migrateGardenSkill(migrated.skill);if(migrated.travel.forest)migrated.travel.forest=migrateForest(migrated.travel.forest);return migrated;}
 }
 if(!value||typeof value!=='object'||!('version' in value)||(value.version!==1&&value.version!==2&&value.version!==3&&value.version!==4&&value.version!==5&&value.version!==6&&value.version!==7&&value.version!==8&&value.version!==9&&value.version!==10&&value.version!==11&&value.version!==12&&value.version!==13&&value.version!==14&&value.version!==15&&value.version!==16))return null;
 const legacy=value as {clearing?:Clearing;version:number;plots?:unknown;player?:{x:number;y:number}};
 if(!Array.isArray(legacy.plots)||legacy.plots.some(row=>!Array.isArray(row)||row.length!==2||!row[1]||typeof row[1]!=='object'))return null;
 let player=legacy.player;
 const box=farmLayout.shipping;
 // Only relocate an old player if the newly introduced crate occupies their saved spot.
 if(player&&Number.isFinite(player.x)&&Number.isFinite(player.y)&&player.x+7>box.x&&player.x-7<box.x+box.w&&player.y+3>box.y&&player.y-4<box.y+box.h)player={x:player.x,y:box.y+box.h+8};
 if(player&&legacy.version>=13&&Number.isFinite(player.x)&&Number.isFinite(player.y))player=relocateVillagePlayer(player);
 const old=value as unknown as Snapshot;
 const extend=(counts:object|undefined)=>counts&&typeof counts==='object'?{strawberry:0,honeyberry:0,blueberry:0,carrot:0,lettuce:0,onion:0,...counts}:counts;
 const additions={seeds:extend(old.seeds),...(legacy.version!==1?{produce:extend(old.produce)}:{}),...(legacy.version>=3?{economy:{...old.economy,shipping:extend(old.economy?.shipping),lastSale:old.economy?.lastSale?{...old.economy.lastSale,items:extend(old.economy.lastSale.items)}:old.economy?.lastSale}}:{}),...(legacy.version>=4?{orders:{pending:extend(old.orders?.pending),mailbox:extend(old.orders?.mailbox)}}:{})};
 const migrated={...value,...additions,version:17,travel:legacy.version===16?{...old.travel,research:createResearch()}:legacy.version===15?{...old.travel,research:createResearch(),estate:{...old.travel?.estate,duckPurchaseDay:old.travel?.estate?.pond?.find(p=>p.kind==='duckNest')?.day??(old.travel?.estate?.goods?.duckNest?(old.clock?.day??1):null),duckArrivalDay:null,duckArrivalPending:false}}:legacy.version>=14?{...old.travel,research:createResearch(),estate:createEstate()}:legacy.version>=13?{...old.travel,research:createResearch(),estate:createEstate(),metAnnie:false,metLeo:false,sale:null}:createTravel(),farmerName:legacy.version>=12?old.farmerName:null,skill:legacy.version<8?createGardenSkill():legacy.version>=11?old.skill:{...old.skill,levelThreeRewarded:false},clearing:legacy.version>=9?legacy.clearing:legacy.version>=6?{...legacy.clearing,positions:{},...(legacy.version===6?{weed:0}:{})}:createClearing(),...(legacy.version<7?{story:createStory()}:{}),...(legacy.version<5?{farmName:null}:{}),...(legacy.version<4?{orders:createOrders()}:{}),...(legacy.version<3?{economy:createEconomy()}:{}),player,
  ...(legacy.version===1?{produce:{radish:0,potato:0,pea:0,strawberry:0,honeyberry:0,blueberry:0,carrot:0,lettuce:0,onion:0},plots:legacy.plots.map(([key,p])=>[key,{...p,growth:0,regrowing:false}])}:{})};
 const normalized=validSnapshot(migrated)?migrated:decodeSnapshot(migrated);if(!normalized)return null;
 // Earlier rewards were produce, so supply the missing planting materials once.
 // Keep existing crops, produce, orders and decorations untouched.
 if(legacy.version<10&&normalized.skill.rewarded)for(const fruit of Object.keys(rewardFruits) as (keyof typeof rewardFruits)[])normalized.seeds[fruit]=Math.min(999999-normalized.orders.pending[fruit]-normalized.orders.mailbox[fruit],normalized.seeds[fruit]+4);
 normalized.skill=migrateGardenSkill(normalized.skill);return structuredClone(normalized);
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
 for(const f of c.farms){if(!f||typeof f.id!=='string'||! /^(legacy|farm-[a-zA-Z0-9-]{1,80})$/.test(f.id)||ids.has(f.id)||typeof f.name!=='string'||!normalizeFarmName(f.name)||(f.farmerName!==undefined&&f.farmerName!==null&&(typeof f.farmerName!=='string'||normalizeFarmName(f.farmerName)!==f.farmerName))||!Number.isSafeInteger(f.day)||f.day<1||!Number.isSafeInteger(f.gold)||f.gold<0||![0,1,2,3].includes(f.level)||!Number.isSafeInteger(f.updatedAt)||f.updatedAt<0)return false;ids.add(f.id);}
 return c.selected===null||ids.has(c.selected);
}
function summary(id:string,data:Snapshot):FarmSummary{return {id,name:data.farmName??'Névtelen farm',farmerName:data.farmerName,day:data.clock.day,gold:data.economy.gold,level:gardeningLevel(data.skill),updatedAt:Date.now()};}
function decodePair(active:unknown,backup:unknown){
 const decoded=decodeSnapshot(active);if(decoded)return {data:decoded,recovered:false,raw:active};
 if(active&&typeof active==='object'&&'version' in active&&(!Number.isInteger(active.version)||Number(active.version)<1||Number(active.version)>17))throw new Error('Ez a mentés másik játékverzióhoz tartozik. Megőriztem, nem írtam felül.');
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
 async exportOriginal():Promise<string>{if(!this.db)throw new Error('A tárhely nem érhető el.');const catalogue=await this.read(CATALOGUE_KEY) as FarmCatalogue|undefined;const record=catalogue?.selected?await this.read(farmKey(catalogue.selected)):undefined;return JSON.stringify({format:'farming-game-recovery',active:await this.read('active'),backup:await this.read('backup'),catalogue,selectedRecord:record},null,2);}
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
  const copy=structuredClone(data);if(!validSnapshot(copy)||!copy.farmName)throw new Error('Az új farmnak érvényes név és kezdőállapot szükséges.');
  await this.listFarms();
  return this.enqueue(async()=>{
   const id=`farm-${crypto.randomUUID()}`;if(this.catalogue!.farms.some(f=>f.id===id))throw new Error('Nem sikerült új mentésazonosítót létrehozni. Próbáld újra.');const next:FarmCatalogue={...structuredClone(this.catalogue!),selected:id};next.farms.push(summary(id,copy));
   await this.write(store=>{store.put({active:copy,backup:copy},farmKey(id));store.put(copy,'active');store.put(copy,'backup');store.put(next,CATALOGUE_KEY);});
   this.last=copy;this.backup=copy;this.catalogue=next;return id;
  });
 }
 async deleteFarm(id:string):Promise<void>{
  await this.listFarms();
  return this.enqueue(async()=>{
   if(!this.catalogue!.farms.some(f=>f.id===id))throw new Error('Ez a farm nem található a mentések között.');
   const selected=this.catalogue!.selected===id,next=structuredClone(this.catalogue!);next.farms=next.farms.filter(f=>f.id!==id);if(selected)next.selected=null;
   // Delete the farm and both recovery aliases atomically, so it cannot reappear.
   await this.write(store=>{store.delete(farmKey(id));if(selected){store.delete('active');store.delete('backup');}store.put(next,CATALOGUE_KEY);});
   this.catalogue=next;if(selected){this.last=null;this.backup=null;}
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
