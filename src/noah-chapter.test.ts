import {expect,it} from 'vitest';
import {IDBFactory} from 'fake-indexeddb';
import {SaveStore,snapshot,decodeSnapshot,validSnapshot} from './storage';
import {createClock} from './clock';
import {createGarden} from './gardening';
import {prepareNoahTest} from './noah-test-story';
import {createNoahChapter,noahTestConfig,upgradeNoahStick,mixNoahExtract} from './noah-story';
import {createExtraction} from './extraction';
import {availableLarchCones,gatherLarchCone} from './larch-cones';
const fresh=()=>snapshot({x:337,y:282},createClock(32),createGarden());
it('opens old farms without a chapter without changing their possessions',()=>{const old=fresh();old.economy.gold=763;old.clearing.wood=71;expect(decodeSnapshot(old)).toEqual(old);const next=structuredClone(old);next.travel.noah=createNoahChapter(32);expect(old.travel.noah).toBeUndefined();expect(next.economy).toEqual(old.economy);expect(next.plots).toEqual(old.plots);});
it('round-trips every released checkpoint including southern positions through normal storage',async()=>{
 const factory=new IDBFactory();let store=new SaveStore(factory);await store.load();
 for(const stage of ['waiting','letter','simon','forest','marsh','root','resin','mix','log','spores'] as const){const next=prepareNoahTest(fresh(),noahTestConfig,stage).snapshot;expect(validSnapshot(next),stage).toBe(true);await store.save(next);store.close();store=new SaveStore(factory);expect((await store.load()).data,stage).toEqual(next);}
 store.close();
});
it('preserves paid upgrades, in-flight extraction, result and collection cooldowns after reopening',async()=>{
 const t=prepareNoahTest(fresh(),noahTestConfig,'mix');t.state.upgraded=false;const upgraded=upgradeNoahStick(t.snapshot,t.state,noahTestConfig)!;
 upgraded.snapshot.travel.noah=upgraded.state;expect(upgradeNoahStick(upgraded.snapshot,upgraded.state,noahTestConfig)).toBeNull();
 const mixed=mixNoahExtract(upgraded.snapshot,upgraded.state,noahTestConfig)!;mixed.snapshot.travel.noah={...mixed.state,extraction:{...createExtraction(),phase:'cool',carrierReady:true,resin:true,aid:true,loaded:['thyme','plantain','carrier'],temperature:.5,coolant:1},carrying:null};
 const s=mixed.snapshot;const chapter=s.travel.noah!;const cones=availableLarchCones(chapter,s.clock.day,()=>.4);const gathered=gatherLarchCone(s,chapter.conePatch!,cones[0].id,s.clock.day)!;gathered.snapshot.travel.noah!.conePatch=gathered.patch;
 // Use the registry's actual herb id, so new placements remain compatible.
 const {southHerbs}=await import('./south-forest-layout');gathered.snapshot.travel.noah!.herbsPicked={[southHerbs[0].id]:s.clock.day};
 const factory=new IDBFactory(),writer=new SaveStore(factory);await writer.load();await writer.save(gathered.snapshot);writer.close();const reader=new SaveStore(factory);const restored=(await reader.load()).data!;expect(restored).toEqual(gathered.snapshot);expect(restored.travel.noah!.extraction?.phase).toBe('cool');expect(restored.travel.noah!.concentrate).toBe(3);expect(restored.travel.estate.produce.thyme).toBe(0);reader.close();
});
it('rejects malformed chapter state safely and keeps the last valid farm',async()=>{
 const s=prepareNoahTest(fresh(),noahTestConfig,'mix').snapshot,factory=new IDBFactory(),store=new SaveStore(factory);await store.load();await store.save(s);
 for(const bad of [{...s.travel.noah,sentDay:99},{...s.travel.noah,extraction:{phase:'bad'}},{...s.travel.noah,conePatch:{cones:[null],readyDay:null}}]){const corrupt={...s,travel:{...s.travel,noah:bad}};expect(validSnapshot(corrupt)).toBe(false);await expect(store.save(corrupt as typeof s)).rejects.toThrow();}
 expect((await store.load()).data).toEqual(s);store.close();
});
it('keeps developer progression in memory after normal chapter adoption',async()=>{const factory=new IDBFactory(),store=new SaveStore(factory);await store.load();const normal=fresh();await store.save(normal);await store.beginTest();await store.save(prepareNoahTest(normal,noahTestConfig,'mix').snapshot);store.close();const reader=new SaveStore(factory);expect((await reader.load()).data).toEqual(normal);reader.close();});
