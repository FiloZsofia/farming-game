import {describe,it,expect,vi} from 'vitest';
import {IDBFactory} from 'fake-indexeddb';
import {SaveStore,snapshot,validSnapshot,decodeSnapshot,DB_NAME} from './storage';
import {createGarden,targetTile,work} from './gardening';
import {createClock} from './clock';
import {createEconomy,settleSales} from './economy';
import {createOrders,deliverOrders,collectPackage} from './orders';
import {createClearing} from './cleanup';
import {createGardenSkill,gainGardening} from './gardening-skill';
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
  const factory=new IDBFactory(),store=new SaveStore(factory);await store.load();await store.save(fresh());await store.save(fresh());store.close();await put(factory,'active',{...fresh(),version:119});
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
  expect(loaded.data).toMatchObject({version:14,clock:{day:12},player:{x:337,y:282},seeds:{radish:3},produce:{radish:0,potato:0,pea:0,strawberry:0,honeyberry:0,blueberry:0,carrot:0,lettuce:0,onion:0}});
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

 it('upgrades v2 while retaining crops, produce and growth and initializing an empty wallet',async()=>{
  const factory=new IDBFactory(),writer=new SaveStore(factory);await writer.load();writer.close();
  const old={...fresh(),version:2,produce:{radish:5,potato:2,pea:7,strawberry:0,honeyberry:0,blueberry:0,carrot:0,lettuce:0,onion:0},plots:[['353,280',{crop:'pea',watered:true,growth:2,regrowing:true}]]};
  await put(factory,'active',old);const reader=new SaveStore(factory);const data=(await reader.load()).data!;
  expect(data.version).toBe(14);expect(data.produce).toEqual(old.produce);expect(data.plots).toEqual(old.plots);expect(data.economy).toEqual(createEconomy());reader.close();
 });
 it('moves old players out of the newly introduced crate without losing their farm',()=>{
  const old={...fresh(),version:2,player:{x:174,y:256}};const upgraded=decodeSnapshot(old)!;expect(upgraded.player).toEqual({x:174,y:276});expect(upgraded.seeds).toEqual(old.seeds);
 });
 it('restores a pending crate and a paid morning without crediting sales twice',async()=>{
  const factory=new IDBFactory(),writer=new SaveStore(factory);await writer.load();const garden=createGarden(),e=createEconomy();e.gold=25;e.shipping.pea=3;
  await writer.save(snapshot(START,createClock(1),garden,e));writer.close();const reader=new SaveStore(factory);const pending=(await reader.load()).data!;expect(pending.economy.shipping.pea).toBe(3);expect(pending.economy.gold).toBe(25);
  const morning=snapshot(START,createClock(2),garden,settleSales(pending.economy,1));await reader.save(morning);reader.close();
  const final=new SaveStore(factory);const loaded=(await final.load()).data!;expect(loaded.economy.gold).toBe(61);expect(loaded.economy.shipping.pea).toBe(0);expect(loaded.economy.lastSale?.total).toBe(36);final.close();
 });

 it('upgrades v3 while preserving money, shipping and receipts without sharing mutable backup data',()=>{
  const economy=createEconomy();economy.gold=123;economy.shipping.pea=2;
  const old={...fresh(),version:3,economy,produce:{radish:2,potato:0,pea:1,strawberry:0,honeyberry:0,blueberry:0,carrot:0,lettuce:0,onion:0}};const decoded=decodeSnapshot(old)!;
  expect(decoded.version).toBe(14);expect(decoded.economy).toEqual(economy);expect(decoded.orders).toEqual(createOrders());expect(decoded.produce).toEqual(old.produce);
  decoded.economy.gold=0;decoded.produce.radish=0;expect(old.economy.gold).toBe(123);expect(old.produce.radish).toBe(2);
 });
 it('restores pending orders, delivered parcels and collected seed counts separately',async()=>{
  const factory=new IDBFactory(),writer=new SaveStore(factory);await writer.load();const garden=createGarden(),e=createEconomy(),o=createOrders();e.gold=65;o.pending.radish=3;
  await writer.save(snapshot(START,createClock(1),garden,e,o));writer.close();const reader=new SaveStore(factory);const pending=(await reader.load()).data!;expect(pending.orders.pending.radish).toBe(3);
  const arrived=deliverOrders(pending.orders);const morning=snapshot(START,createClock(2),garden,e,arrived);await reader.save(morning);reader.close();const mailbox=new SaveStore(factory);const delivered=(await mailbox.load()).data!;expect(delivered.orders.mailbox.radish).toBe(3);expect(delivered.orders.pending.radish).toBe(0);
  const taken=collectPackage(garden,delivered.orders)!;await mailbox.save(snapshot(START,delivered.clock,taken.garden,e,taken.orders));mailbox.close();const final=new SaveStore(factory);const state=(await final.load()).data!;expect(state.seeds.radish).toBe(7);expect(state.orders.mailbox.radish).toBe(0);expect(state.economy.gold).toBe(65);final.close();
 });
 it('rejects corrupt mail or totals exceeding a safe seed stack',()=>{
  const data=fresh();data.orders.pending.pea=-1;expect(validSnapshot(data)).toBe(false);
  const full=fresh();full.seeds.pea=999999;full.orders.mailbox.pea=1;expect(validSnapshot(full)).toBe(false);
 });

 it('migrates v4 without losing orders, money, produce or the original backup',()=>{
  const old={...fresh(),version:4};old.orders.pending.pea=3;old.orders.mailbox.radish=2;old.economy.gold=77;old.produce.potato=6;
  const decoded=decodeSnapshot(old)!;expect(decoded).toEqual({...old,version:14,farmName:null});decoded.orders.pending.pea=0;expect(old.orders.pending.pea).toBe(3);
 });
 it('persists a personalized name and rejects malformed names',async()=>{
  const factory=new IDBFactory(),store=new SaveStore(factory);await store.load();const data={...fresh(),farmName:'Vadvirág Farm'};await store.save(data);store.close();
  const reader=new SaveStore(factory);expect((await reader.load()).data).toEqual(data);reader.close();
  for(const farmName of ['', '  Farm ', 'x'.repeat(41), 'Farm\u0000'])expect(validSnapshot({...data,farmName})).toBe(false);
 });

 it('migrates v5 while preserving the named farm, produce, wallet and orders',()=>{
  const current={...fresh(),version:5,farmName:'Napsugár Farm'};current.orders.pending.pea=3;current.produce.radish=9;current.economy.gold=60;
  const upgraded=decodeSnapshot(current)!;expect(upgraded).toEqual({...current,version:14,clearing:createClearing()});
 });
 it('restores gathered materials and removed objects without duplicating rewards',async()=>{
  const factory=new IDBFactory(),writer=new SaveStore(factory);await writer.load();const data={...fresh(),farmName:'Farm',clearing:{removed:{'rock-a':1,'branch-a':1},wood:1,stone:1,weed:0,positions:{}}};
  await writer.save(data);writer.close();const reader=new SaveStore(factory);expect((await reader.load()).data).toEqual(data);reader.close();
  expect(validSnapshot({...data,clearing:{...data.clearing,removed:{'rock-a':2}}})).toBe(false);
  expect(validSnapshot({...data,clearing:{...data.clearing,removed:{unknown:1}}})).toBe(false);
 });

 it('migrates v6 with cleared sites, materials and the named farm intact',()=>{
  const old={...fresh(),version:6,farmName:'Réti Farm',clearing:{removed:{'weed-a':1},wood:2,stone:3}};
  const upgraded=decodeSnapshot(old)!;expect(upgraded.version).toBe(14);expect(upgraded.farmName).toBe(old.farmName);expect(upgraded.clearing).toEqual({...old.clearing,weed:0,positions:{}});expect(upgraded.story).toEqual({giftReceived:false,morningSeen:false,birdhouse:null});
 });
 it('persists the gift, placed birdhouse, morning thought and collected weeds',async()=>{
  const factory=new IDBFactory(),writer=new SaveStore(factory);await writer.load();const data=fresh();data.clearing.weed=2;data.story={giftReceived:true,morningSeen:true,birdhouse:{x:280,y:400}};
  await writer.save(data);writer.close();const reader=new SaveStore(factory);expect((await reader.load()).data).toEqual(data);reader.close();
  expect(validSnapshot({...data,story:{giftReceived:false,morningSeen:true,birdhouse:null}})).toBe(false);
 });

 it('migrates v7 while retaining Annie, the placed birdhouse and all resources',()=>{
  const old={...fresh(),version:7,farmName:'Annie szomszédja'};old.story={giftReceived:true,morningSeen:true,birdhouse:{x:280,y:400}};old.clearing.weed=7;
  const upgraded=decodeSnapshot(old)!;expect(upgraded).toEqual({...old,version:14,skill:createGardenSkill()});
 });
 it('persists the exact level-two reward without granting it again on reload',async()=>{
  const factory=new IDBFactory(),writer=new SaveStore(factory);await writer.load();const data=fresh();for(let i=0;i<36;i++)data.skill=gainGardening(data.skill,`hoe:${i}`)!;
  await writer.save(data);writer.close();const reader=new SaveStore(factory);const loaded=(await reader.load()).data!;expect(loaded.skill).toEqual(data.skill);expect(gainGardening(loaded.skill,'weed:3:weed-a')!.xp).toBe(37);expect(loaded.skill.fruits).toEqual({strawberry:4,honeyberry:4,blueberry:4});reader.close();
 });

 it('adds new crop fields to an actual three-crop v7 save without losing queued orders or receipts',()=>{
  const old={...fresh(),version:7,seeds:{radish:2,potato:3,pea:4},produce:{radish:5,potato:0,pea:1},orders:{pending:{radish:1,potato:0,pea:0},mailbox:{radish:0,potato:0,pea:2}},economy:{gold:75,shipping:{radish:0,potato:1,pea:0},lastSale:null}};
  const data=decodeSnapshot(old)!;expect(data.seeds).toEqual({...old.seeds,strawberry:0,honeyberry:0,blueberry:0,carrot:0,lettuce:0,onion:0});expect(data.orders.pending.radish).toBe(1);expect(data.orders.mailbox.pea).toBe(2);expect(data.economy.shipping.potato).toBe(1);expect(data.economy.gold).toBe(75);expect(data.skill).toEqual(createGardenSkill());
 });

 it('migrates v8 without resetting earned skill, rewards or planting materials',()=>{
  const old={...fresh(),version:8};old.skill=gainGardening(old.skill,'hoe:353,280')!;old.seeds.blueberry=2;
  const upgraded=decodeSnapshot(old)!;expect(upgraded.skill.xp).toBe(1);expect(upgraded.seeds.blueberry).toBe(2);expect(upgraded.clearing.positions).toEqual({});
 });
 it('persists relocated debris positions exactly across reload',async()=>{
  const factory=new IDBFactory(),writer=new SaveStore(factory);await writer.load();const data=fresh();data.clearing.positions['weed-a']={x:90,y:430};await writer.save(data);writer.close();const reader=new SaveStore(factory);expect((await reader.load()).data?.clearing.positions).toEqual(data.clearing.positions);reader.close();
 });

 it('repairs v9 level-two rewards once without losing produce, orders or scattered decorations',async()=>{
  const old={...fresh(),version:9};for(let i=0;i<36;i++)old.skill=gainGardening(old.skill,`hoe:${i}`)!;
  old.produce.strawberry=3;old.seeds.blueberry=2;old.orders.pending.honeyberry=1;old.clearing.positions={'weed-a':{x:520,y:410}};
  const upgraded=decodeSnapshot(old)!;expect(upgraded.version).toBe(14);expect(upgraded.seeds).toMatchObject({strawberry:4,honeyberry:4,blueberry:6});expect(upgraded.produce).toEqual(old.produce);expect(upgraded.orders).toEqual(old.orders);expect(upgraded.clearing).toEqual(old.clearing);expect(old.seeds.strawberry).toBe(0);
  expect(decodeSnapshot(upgraded)).toEqual(upgraded);
  const factory=new IDBFactory();const setup=new SaveStore(factory);await setup.load();setup.close();await put(factory,'active',old);const store=new SaveStore(factory);expect((await store.load()).data).toEqual(upgraded);await store.save(upgraded);store.close();const reader=new SaveStore(factory);expect((await reader.load()).data).toEqual(upgraded);reader.close();
 });

 it('upgrades a real v10 six-crop save without repeating rewards or changing gold',()=>{
  const current=fresh();current.economy.gold=37;for(let i=0;i<36;i++)current.skill=gainGardening(current.skill,`hoe:${i}`)!;current.seeds.strawberry=2;current.orders.pending.blueberry=3;
  const old=JSON.parse(JSON.stringify({...current,version:10}));delete old.skill.levelThreeRewarded;
  for(const counts of [old.seeds,old.produce,old.economy.shipping,old.orders.pending,old.orders.mailbox])for(const key of ['carrot','lettuce','onion'])delete counts[key];
  const upgraded=decodeSnapshot(old)!;expect(upgraded.version).toBe(14);expect(upgraded.economy.gold).toBe(37);expect(upgraded.seeds.strawberry).toBe(2);expect(upgraded.seeds.carrot).toBe(0);expect(upgraded.orders.pending.blueberry).toBe(3);expect(upgraded.skill.xp).toBe(36);expect(upgraded.skill.levelThreeRewarded).toBe(false);expect(decodeSnapshot(upgraded)).toEqual(upgraded);
 });
 it('persists level three and its seed stacks without rewarding again',async()=>{
  const data=fresh();for(let i=0;i<72;i++)data.skill=gainGardening(data.skill,`hoe:${i}`)!;data.seeds.carrot=4;data.seeds.lettuce=3;data.seeds.onion=4;data.produce.onion=2;
  const factory=new IDBFactory(),store=new SaveStore(factory);await store.load();await store.save(data);store.close();const reader=new SaveStore(factory),loaded=(await reader.load()).data!;expect(loaded.skill.levelThreeRewarded).toBe(true);expect(loaded.seeds).toEqual(data.seeds);expect(loaded.produce.onion).toBe(2);expect(gainGardening(loaded.skill,'hoe:extra')).toBeNull();reader.close();
 });

 it('stores farmer names and rejects empty, unnormalized or invalid identities',async()=>{
  const data=fresh();data.farmerName='Léna';expect(validSnapshot(data)).toBe(true);for(const farmerName of ['', ' Léna ', 'x'.repeat(41), 'Léna\u0000', 42])expect(validSnapshot({...data,farmerName})).toBe(false);
  const factory=new IDBFactory(),store=new SaveStore(factory);await store.load();await store.save(data);store.close();const reader=new SaveStore(factory);expect((await reader.load()).data!.farmerName).toBe('Léna');reader.close();
 });
 it('migrates v11 without inventing a farmer name or resetting level-three progress',()=>{
  const data=fresh();data.farmName='Meglévő farm';data.economy.gold=47;for(let i=0;i<72;i++)data.skill=gainGardening(data.skill,`hoe:${i}`)!;data.seeds.carrot=3;
  const old=JSON.parse(JSON.stringify({...data,version:11}));delete old.farmerName;const upgraded=decodeSnapshot(old)!;expect(upgraded.version).toBe(14);expect(upgraded.farmerName).toBeNull();expect(upgraded.skill).toEqual(data.skill);expect(upgraded.seeds).toEqual(data.seeds);expect(upgraded.economy.gold).toBe(47);expect(decodeSnapshot(upgraded)).toEqual(upgraded);
 });

});
