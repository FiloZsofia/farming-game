import {describe,it,expect,vi} from 'vitest';
import {IDBFactory} from 'fake-indexeddb';
import {SaveStore,snapshot,DB_NAME,decodeSnapshot,type Snapshot} from './storage';
import {createGarden} from './gardening';
import {createClock} from './clock';
import {createEconomy} from './economy';
import {createOrders} from './orders';
import {START} from './movement';
const fresh=(name='Tesztfarm')=>snapshot(START,createClock(),createGarden(),{...createEconomy(),gold:100},createOrders(),name);
async function access(factory:IDBFactory,key:string,value?:unknown){
 const db=await new Promise<IDBDatabase>((resolve,reject)=>{const r=factory.open(DB_NAME,1);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});
 const result=await new Promise<unknown>((resolve,reject)=>{const tx=db.transaction('saves',value===undefined?'readonly':'readwrite'),request=value===undefined?tx.objectStore('saves').get(key):tx.objectStore('saves').put(value,key);tx.oncomplete=()=>resolve(request.result);tx.onabort=()=>reject(tx.error);});db.close();return result;
}
function abortWrites(store:SaveStore){
 const db=(store as unknown as {db:IDBDatabase}).db,original=db.transaction.bind(db);
 return vi.spyOn(db,'transaction').mockImplementation((...args:Parameters<IDBDatabase['transaction']>)=>{const tx=original(...args);if(args[1]==='readwrite')queueMicrotask(()=>tx.abort());return tx;});
}
describe('separate farm saves',()=>{
 it('archives the legacy save without modifying its original active or backup keys',async()=>{
  const factory=new IDBFactory(),writer=new SaveStore(factory);await writer.load();const first=fresh('Régi farm'),current=fresh('Régi farm');current.clock.day=8;current.economy.gold=237;current.clearing.weed=9;current.orders.mailbox.pea=3;
  await writer.save(first);await writer.save(current);writer.close();const store=new SaveStore(factory);expect((await store.load()).data).toEqual(current);
  expect(await store.listFarms()).toMatchObject([{id:'legacy',name:'Régi farm',day:8,gold:237}]);expect(await access(factory,'active')).toEqual(current);expect(await access(factory,'backup')).toEqual(first);expect(await access(factory,'farm:legacy')).toEqual({active:current,backup:first});store.close();
 });
 it('creates separate named farms and restores every part of the original state',async()=>{
  const factory=new IDBFactory(),store=new SaveStore(factory);await store.load();expect(await store.listFarms()).toEqual([]);await expect(store.save(fresh())).rejects.toThrow('válassz');
  const a=fresh('Kedvenc farm');a.clock.day=12;a.economy.gold=271;a.seeds.blueberry=2;a.produce.onion=3;a.clearing.wood=8;a.orders.pending.pea=5;a.story.giftReceived=true;
  const idA=await store.createFarm(a),b=fresh('Tesztfarm'),idB=await store.createFarm(b);expect(idA).not.toBe(idB);expect(store.selectedFarmId).toBe(idB);expect((await store.listFarms()).length).toBe(2);
  expect((await store.selectFarm(idA)).data).toEqual(a);a.economy.gold=300;await store.save(a);expect((await store.selectFarm(idB)).data).toEqual(b);expect((await store.selectFarm(idA)).data.economy.gold).toBe(300);store.close();
  const reader=new SaveStore(factory);expect((await reader.load()).data).toEqual(a);expect(reader.selectedFarmId).toBe(idA);expect(await reader.listFarms()).toHaveLength(2);reader.close();
 });
 it('allows the same display name without overwriting another farm',async()=>{
  const store=new SaveStore(new IDBFactory());await store.load();const a=await store.createFarm(fresh()),b=await store.createFarm(fresh());expect(a).not.toBe(b);expect(await store.listFarms()).toHaveLength(2);store.close();
 });
 it('keeps independent backups and recovers only the damaged farm',async()=>{
  const factory=new IDBFactory(),store=new SaveStore(factory);await store.load();const a=fresh('A'),idA=await store.createFarm(a);const changed=structuredClone(a);changed.economy.gold=55;await store.save(changed);const b=fresh('B'),idB=await store.createFarm(b);
  await access(factory,`farm:${idA}`,{active:{broken:true},backup:a});expect(await store.selectFarm(idA)).toEqual({data:a,recovered:true});expect((await store.selectFarm(idB)).data).toEqual(b);store.close();
 });
 it('leaves the old farm and list intact when new-farm creation aborts',async()=>{
  const factory=new IDBFactory(),store=new SaveStore(factory);await store.load();const a=fresh('A'),id=await store.createFarm(a),before=await store.listFarms(),spy=abortWrites(store);
  await expect(store.createFarm(fresh('B'))).rejects.toThrow();spy.mockRestore();expect(store.selectedFarmId).toBe(id);expect(await store.listFarms()).toEqual(before);expect(await access(factory,'active')).toEqual(a);store.close();const reader=new SaveStore(factory);expect((await reader.load()).data).toEqual(a);expect(await reader.listFarms()).toEqual(before);reader.close();
 });
 it('does not switch farms when the selection transaction aborts',async()=>{
  const factory=new IDBFactory(),store=new SaveStore(factory);await store.load();const a=await store.createFarm(fresh('A')),bData=fresh('B'),b=await store.createFarm(bData),spy=abortWrites(store);
  await expect(store.selectFarm(a)).rejects.toThrow();spy.mockRestore();expect(store.selectedFarmId).toBe(b);expect(await access(factory,'active')).toEqual(bData);expect((await store.selectFarm(a)).data.farmName).toBe('A');store.close();
 });
 it('protects future-version and unreadable farms while leaving another playable farm intact',async()=>{
  const factory=new IDBFactory(),store=new SaveStore(factory);await store.load();const a=await store.createFarm(fresh('A')),b=await store.createFarm(fresh('B'));
  await access(factory,`farm:${a}`,{active:{...fresh('A'),version:99},backup:fresh('A')});await expect(store.selectFarm(a)).rejects.toThrow('másik játékverzió');expect(store.selectedFarmId).toBe(b);
  await access(factory,`farm:${a}`,{active:{broken:true},backup:{broken:true}});await expect(store.selectFarm(a)).rejects.toThrow('nem olvasható');expect(store.selectedFarmId).toBe(b);await expect(store.selectFarm('missing')).rejects.toThrow('nem található');store.close();
 });
 it('refuses writes for an unknown farm-list format instead of replacing it',async()=>{
  const factory=new IDBFactory(),writer=new SaveStore(factory);await writer.load();await writer.createFarm(fresh());writer.close();await access(factory,'farm-catalogue',{version:99});const reader=new SaveStore(factory);await expect(reader.load()).rejects.toThrow('farmok listája');await expect(reader.save(fresh())).rejects.toThrow();reader.close();
 });
 it('keeps a queued save with its original farm before selecting another',async()=>{
  const store=new SaveStore(new IDBFactory());await store.load();const a=await store.createFarm(fresh('A')),b=fresh('B'),idB=await store.createFarm(b);b.economy.gold=17;await Promise.all([store.save(b),store.selectFarm(a)]);expect(store.selectedFarmId).toBe(a);expect((await store.selectFarm(idB)).data.economy.gold).toBe(17);store.close();
 });
 it('migrates a v10 farm into the list without resetting its money, skill or seeds',async()=>{
  const factory=new IDBFactory(),writer=new SaveStore(factory);await writer.load();writer.close();const old={...fresh('Korábbi farm'),version:10};old.economy.gold=23;old.seeds.strawberry=2;
  await access(factory,'active',old);const store=new SaveStore(factory),loaded=await store.load();expect(loaded.data).toEqual(decodeSnapshot(old));expect(await store.listFarms()).toMatchObject([{name:'Korábbi farm',gold:23}]);const id=store.selectedFarmId!;await store.createFarm(fresh('Új farm'));expect((await store.selectFarm(id)).data).toEqual(loaded.data);store.close();
 });
 it('returns independent summaries and uses the per-farm record if the active alias is lost',async()=>{
  const factory=new IDBFactory(),store=new SaveStore(factory);await store.load();const data=fresh('Megmarad'),id=await store.createFarm(data);const rows=await store.listFarms();rows[0].name='Átírva';expect((await store.listFarms())[0].name).toBe('Megmarad');store.close();
  await access(factory,'active',{broken:true});const reader=new SaveStore(factory);expect((await reader.load()).data).toEqual(data);expect(reader.selectedFarmId).toBe(id);reader.close();
 });
});
