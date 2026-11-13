import {it,expect,vi} from 'vitest';
import {IDBFactory} from 'fake-indexeddb';
import {snapshot,SaveStore} from './storage';
import {createGarden} from './gardening';
import {createClock} from './clock';
import {parseFarmImport,readFarmImport,MAX_SAVE_IMPORT_BYTES} from './save-import';
import {enableHomestead} from './homestead-migration';
const fresh=(name:string)=>{const n=enableHomestead(snapshot({x:250,y:194},createClock(113,()=>.5),createGarden()),true);n.farmName=name;return n;};
it('reads the exported farm with its exact day, money and progress',()=>{const s=fresh('Erdőszéli birtok');s.economy.gold=3604;s.travel.homestead!.garden.points=89;s.seeds.radish=31;expect(parseFarmImport(JSON.stringify(s))).toEqual(s);});
it('adds a separate farm and preserves existing same-name farms and their recovery data',async()=>{
 const factory=new IDBFactory(),store=new SaveStore(factory);await store.load();const old=fresh('Erdőszéli birtok');old.economy.gold=100;const oldId=await store.createFarm(old);const imported=fresh('Erdőszéli birtok');imported.economy.gold=3604;const id=await store.createFarm(parseFarmImport(JSON.stringify(imported)));expect(id).not.toBe(oldId);expect(await store.listFarms()).toHaveLength(2);store.close();
 const reader=new SaveStore(factory);expect((await reader.load()).data).toEqual(imported);expect((await reader.selectFarm(oldId)).data).toEqual(old);expect((await reader.selectFarm(id)).data).toEqual(imported);reader.close();
});
it('rejects invalid JSON, forged values and future formats',()=>{for(const text of ['oops','null','{}',JSON.stringify({...fresh('Farm'),version:999}),JSON.stringify({...fresh('Farm'),economy:{gold:-3}})])expect(()=>parseFarmImport(text)).toThrow();});
it('rejects oversized files before reading and supports selecting the same file again',async()=>{const text=vi.fn(async()=>JSON.stringify(fresh('Farm')));await expect(readFarmImport({size:MAX_SAVE_IMPORT_BYTES+1,text})).rejects.toThrow('túl nagy');expect(text).not.toHaveBeenCalled();const file={size:100,text};expect(await readFarmImport(file)).toEqual(await readFarmImport(file));});
it('keeps the test-mode guard and does not create a farm record while testing',async()=>{const store=new SaveStore(new IDBFactory());await store.load();await store.createFarm(fresh('Meglévő'));await store.beginTest();await expect(store.createFarm(parseFarmImport(JSON.stringify(fresh('Új'))))).rejects.toThrow('Tesztmódban');expect(await store.listFarms()).toHaveLength(1);store.close();});
