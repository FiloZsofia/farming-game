import {describe,it,expect} from 'vitest';
import {createGarden} from './gardening';
import {createEconomy,salePrices,shippingValue,transferProduce,settleSales,validEconomy} from './economy';
describe('shipping and gold',()=>{
 it('uses agreed unit prices',()=>expect(salePrices).toEqual({radish:15,potato:30,pea:12,strawberry:25,honeyberry:24,blueberry:21,carrot:22,lettuce:12,onion:32}));
 it('moves produce into the crate without paying before morning',()=>{
  const garden=createGarden(),economy=createEconomy();garden.produce.radish=4;
  expect(transferProduce(garden,economy,'radish',3,'deposit')).toBe(true);expect(garden.produce.radish).toBe(1);expect(economy.shipping.radish).toBe(3);expect(economy.gold).toBe(0);expect(shippingValue(economy.shipping)).toBe(45);
 });
 it('lets the player withdraw the exact goods before closing the day',()=>{
  const g=createGarden(),e=createEconomy();g.produce.pea=7;transferProduce(g,e,'pea',7,'deposit');
  expect(transferProduce(g,e,'pea',2,'withdraw')).toBe(true);expect(g.produce.pea).toBe(2);expect(e.shipping.pea).toBe(5);expect(e.gold).toBe(0);
 });
 it('rejects overdrafts, invalid quantities and overflowing stacks without changing either side',()=>{
  const g=createGarden(),e=createEconomy();g.produce.potato=1;
  for(const n of [-1,0,1.5,NaN,2])expect(transferProduce(g,e,'potato',n,'deposit')).toBe(false);
  expect(transferProduce(g,e,'pea',1,'withdraw')).toBe(false);expect(g.produce.potato).toBe(1);expect(e.shipping.potato).toBe(0);
  e.shipping.potato=999999;expect(transferProduce(g,e,'potato',1,'deposit')).toBe(false);
 });
 it('settles all crops together and records an itemized receipt without mutating the old state',()=>{
  const e=createEconomy();e.gold=10;e.shipping={radish:2,potato:1,pea:4,strawberry:0,honeyberry:0,blueberry:0,carrot:0,lettuce:0,onion:0};const next=settleSales(e,5);
  expect(next.gold).toBe(118);expect(next.shipping).toEqual({radish:0,potato:0,pea:0,strawberry:0,honeyberry:0,blueberry:0,carrot:0,lettuce:0,onion:0});expect(next.lastSale).toEqual({day:5,items:{radish:2,potato:1,pea:4,strawberry:0,honeyberry:0,blueberry:0,carrot:0,lettuce:0,onion:0},total:108});
  expect(e.gold).toBe(10);expect(e.shipping.pea).toBe(4);expect(settleSales(next,6).gold).toBe(118);
 });
 it('refuses unsafe gold values instead of silently rounding money',()=>{const e=createEconomy();e.gold=Number.MAX_SAFE_INTEGER;e.shipping.radish=1;expect(()=>settleSales(e,1)).toThrow();});
 it('validates balances, shipping and receipt totals',()=>{const e=createEconomy();expect(validEconomy(e)).toBe(true);e.gold=-1;expect(validEconomy(e)).toBe(false);const next=settleSales(createEconomy(),1);next.lastSale!.total=1;expect(validEconomy(next)).toBe(false);});
});
describe('spring fruit sales',()=>{
 it('sells the three similar-value berries with vegetables in one morning',()=>{const garden=createGarden(),economy=createEconomy();for(const crop of ['strawberry','honeyberry','blueberry'] as const){garden.produce[crop]=1;expect(transferProduce(garden,economy,crop,1,'deposit')).toBe(true);}expect(settleSales(economy,1).gold).toBe(70);});
});

it('keeps legacy berry receipts valid while settling new sales at the new prices',()=>{
 const e=createEconomy();e.shipping.strawberry=1;e.shipping.honeyberry=1;e.shipping.blueberry=1;const n=settleSales(e,1);expect(n.lastSale?.total).toBe(70);expect(validEconomy(n)).toBe(true);
 const old=structuredClone(n);old.lastSale!.total=60;delete old.lastSale!.unitPrices;expect(validEconomy(old)).toBe(true);expect(old.gold).toBe(n.gold);old.lastSale!.total=61;expect(validEconomy(old)).toBe(false);
});
