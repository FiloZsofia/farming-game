import {describe,it,expect,vi} from 'vitest';
import {IDBFactory} from 'fake-indexeddb';
import {SaveStore,snapshot,validSnapshot,decodeSnapshot,DB_NAME} from './storage';
import {createGarden,targetTile,work} from './gardening';
import {createClock} from './clock';
import {START} from './movement';
const fresh=()=>snapshot(START,createClock(1,()=>.5),createGarden());
async function put(factory:IDBFactory,key:string,value:unknown){
 const db=await new Promise<IDBDatabase>((resolve,reject)=>{const r=factory.open(DB_NAME,1);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});
 await new Promise<void>((resolve,reject)=>{const tx=db.transaction('saves','readwrite');tx.objectStore('saves').put(value,key);tx.oncomplete=()=>resolve();tx.onabort=()=>reject(tx.error);});db.close();
}
describe('persistent farm state',()=>{
 it('restores player, exact time and exhaustion target, seeds and watered plants',async()=>{
  const factory=new IDBFactory();const store=new SaveStore(factory);await store.load();
  const garden=createGarden(),tile=targetTile(360,286),player={x:337,y:282};work(garden,'hoe',tile,player);work(garden,'pea',tile,player);work(garden,'water',tile,player);
  const clock=createClock(7,()=>.2);clock.elapsed=522;const data=snapshot(player,clock,garden);await store.save(data);store.close();
  const restored=new SaveStore(factory);expect((await restored.load()).data).toEqual(data);restored.close();
 });
 it('keeps an independent snapshot when live state changes during save',async()=>{
  const store=new SaveStore(new IDBFactory());await store.load();const data=fresh();const op=store.save(data);data.seeds.radish=0;await op;
  const loaded=await store.load();expect(loaded.data?.seeds.radish).toBe(4);store.close();
 });
 it('serializes overlapping saves so an older transaction cannot win',async()=>{
  const factory=new IDBFactory(),store=new SaveStore(factory);await store.load();const a=fresh(),b=fresh();b.clock.elapsed=22;await Promise.all([store.save(a),store.save(b)]);store.close();
  const reader=new SaveStore(factory);expect((await reader.load()).data?.clock.elapsed).toBe(22);reader.close();
 });
 it('recovers a corrupted primary from the previous valid save',async()=>{
  const factory=new IDBFactory(),store=new SaveStore(factory);await store.load();const a=fresh(),b=fresh();b.clock.elapsed=42;await store.save(a);await store.save(b);store.close();await put(factory,'active',{broken:true});
  const reader=new SaveStore(factory);const result=await reader.load();expect(result.recovered).toBe(true);expect(result.data).toEqual(a);reader.close();
 });
 it('refuses to overwrite an unknown version even when a backup exists',async()=>{
  const factory=new IDBFactory(),store=new SaveStore(factory);await store.load();await store.save(fresh());await store.save(fresh());store.close();await put(factory,'active',{...fresh(),version:99});
  const reader=new SaveStore(factory);await expect(reader.load()).rejects.toThrow('másik játékverzió');await expect(reader.save(fresh())).rejects.toThrow('nem írható');reader.close();
 });
 it('does not replace unrecoverable data with an empty farm',async()=>{
  const factory=new IDBFactory(),store=new SaveStore(factory);await store.load();store.close();await put(factory,'active',{broken:true});const reader=new SaveStore(factory);await expect(reader.load()).rejects.toThrow('nem olvasható');await expect(reader.save(fresh())).rejects.toThrow();reader.close();
 });
 it('rejects invalid seeds, water positions, clocks and duplicate plots',()=>{
  const a=fresh();a.seeds.pea=-1;expect(validSnapshot(a)).toBe(false);
  const b=fresh();b.player={x:638,y:464};expect(validSnapshot(b)).toBe(false);
  const c=fresh();c.clock.elapsed=601;expect(validSnapshot(c)).toBe(false);
  const d=fresh();d.plots=[['353,280',{crop:null,watered:false,growth:0,regrowing:false}],['353,280',{crop:null,watered:false,growth:0,regrowing:false}]];expect(validSnapshot(d)).toBe(false);
 });
 it('refuses writes after its connection is closed',async()=>{
  const factory=new IDBFactory(),store=new SaveStore(factory);await store.load();store.close();await expect(store.save(fresh())).rejects.toThrow();
 });
 it('keeps the previous active save if a write transaction aborts',async()=>{
  const factory=new IDBFactory(),store=new SaveStore(factory);await store.load();const good=fresh();await store.save(good);
  const db=(store as unknown as {db:IDBDatabase}).db;
  const transaction=db.transaction.bind(db);
  const spy=vi.spyOn(db,'transaction').mockImplementation((...args:Parameters<IDBDatabase['transaction']>)=>{
   const tx=transaction(...args);queueMicrotask(()=>tx.abort());return tx;
  });
  const changed=fresh();changed.clock.day=9;await expect(store.save(changed)).rejects.toThrow();spy.mockRestore();store.close();
  const reader=new SaveStore(factory);expect((await reader.load()).data).toEqual(good);reader.close();
 });

 it('upgrades v1 without losing position, day, seeds, plants or water',async()=>{
  const factory=new IDBFactory(),writer=new SaveStore(factory);await writer.load();writer.close();
  const data=fresh();data.player={x:337,y:282};data.clock.day=12;data.seeds.radish=3;
  const legacy={...data,version:1,plots:[['353,280',{crop:'radish',watered:true}]]};
  await put(factory,'active',legacy);const reader=new SaveStore(factory);const loaded=await reader.load();
  expect(loaded.data).toMatchObject({version:2,clock:{day:12},player:{x:337,y:282},seeds:{radish:3},produce:{radish:0,potato:0,pea:0}});
  expect(loaded.data?.plots).toEqual([['353,280',{crop:'radish',watered:true,growth:0,regrowing:false}]]);
  await reader.save(loaded.data!);reader.close();const reread=new SaveStore(factory);expect((await reread.load()).data).toEqual(loaded.data);reread.close();
 });
 it('rejects broken legacy plots and invalid growth or harvested totals',()=>{
  expect(decodeSnapshot({...fresh(),version:1,plots:[['353,280',{crop:'unknown',watered:true}]]})).toBeNull();
  const data=fresh();data.produce.radish=-1;expect(validSnapshot(data)).toBe(false);
  const bad=fresh();bad.plots=[['353,280',{crop:'radish',watered:true,growth:-1,regrowing:false}]];expect(validSnapshot(bad)).toBe(false);
 });
 it('preserves maturity, pea regrowth and harvested produce across reload',async()=>{
  const factory=new IDBFactory(),writer=new SaveStore(factory);await writer.load();const data=fresh();
  data.produce.pea=2;data.plots=[['353,280',{crop:'pea',watered:true,growth:2,regrowing:true}],['369,280',{crop:'radish',watered:false,growth:3,regrowing:false}]];
  await writer.save(data);writer.close();const reader=new SaveStore(factory);expect((await reader.load()).data).toEqual(data);reader.close();
 });

});
