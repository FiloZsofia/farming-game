import {describe,it,expect} from 'vitest';
import {morningSale,saleRows,validMorningSale,displayedBalance} from './morning-report';
import {emptyQuantities,settleSales,createEconomy} from './economy';
import {snapshot,decodeSnapshot,SaveStore} from './storage';
import {createGarden} from './gardening';
import {createClock} from './clock';
import {IDBFactory} from 'fake-indexeddb';
const sale=morningSale({day:2,total:90,items:{...emptyQuantities(),radish:2,potato:2}},90);
describe('Visual morning settlement',()=>{
 it('shows only sold crops, with their quantities and correctly calculated revenue',()=>{
  expect(saleRows(sale)).toEqual([{crop:'radish',quantity:2,value:30},{crop:'potato',quantity:2,value:60}]);expect(validMorningSale(sale,3)).toBe(true);
 });
 it('rejects an inconsistent total or balance and a report from the wrong day',()=>{
  expect(validMorningSale({...sale,total:80},3)).toBe(false);expect(validMorningSale({...sale,afterGold:200},3)).toBe(false);expect(validMorningSale(sale,4)).toBe(false);
 });
 it('animates from the pre-sale balance to the settled amount without changing game state',()=>{
  expect(displayedBalance(sale,0)).toBe(90);expect(displayedBalance(sale,650)).toBe(90);expect(displayedBalance(sale,1100)).toBeGreaterThan(90);expect(displayedBalance(sale,1100)).toBeLessThan(180);expect(displayedBalance(sale,2200)).toBe(180);expect(displayedBalance(sale,1100,true)).toBe(180);expect(sale.afterGold).toBe(180);
 });
 it('can present an empty crate without inventing sales or changing gold',()=>{
  const empty=morningSale({day:2,total:0,items:emptyQuantities()},100);expect(saleRows(empty)).toEqual([]);expect(displayedBalance(empty,2000)).toBe(100);expect(validMorningSale(empty,3)).toBe(true);
 });
 it('persists separate robbery and income notices without crediting gold again on reload',async()=>{
  const factory=new IDBFactory(),store=new SaveStore(factory);await store.load();
  const economy=settleSales({...createEconomy(),gold:90,shipping:sale.items},2),data=snapshot({x:250,y:242},createClock(3),createGarden(),economy);data.travel.morning='Az éjjel kiraboltak. Elveszítettem: 10 gold.';data.travel.sale=sale;
  await store.save(data);store.close();const reader=new SaveStore(factory),loaded=(await reader.load()).data!;
  expect(loaded.economy.gold).toBe(180);expect(loaded.travel.morning).toContain('10 gold');expect(loaded.travel.sale).toEqual(sale);loaded.travel.morning=null;await reader.save(loaded);expect((await reader.load()).data!.economy.gold).toBe(180);loaded.travel.sale=null;await reader.save(loaded);reader.close();
  const final=new SaveStore(factory);expect((await final.load()).data).toMatchObject({economy:{gold:180},travel:{morning:null,sale:null}});final.close();
 });
 it('preserves a v13 robbery notice without re-presenting an old sale as new revenue',()=>{
  const data=snapshot({x:250,y:242},createClock(3),createGarden());const legacy={...data,version:13,travel:{picked:{},morning:'Az éjjel kiraboltak. Elveszítettem: 1 db áfonya.'}};const decoded=decodeSnapshot(legacy)!;expect(decoded.travel.morning).toBe(legacy.travel.morning);expect(decoded.travel.sale).toBeNull();expect(decoded.economy.gold).toBe(data.economy.gold);
 });
});
