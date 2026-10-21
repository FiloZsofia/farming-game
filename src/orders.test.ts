import {describe,it,expect} from 'vitest';
import {createGarden} from './gardening';
import {createEconomy,emptyQuantities} from './economy';
import {createOrders,seedPrices,orderCost,purchaseSeeds,deliverOrders,collectPackage,validOrders} from './orders';
describe('seed catalogue and delivery',()=>{
 it('uses the agreed seed prices',()=>expect(seedPrices).toEqual({radish:5,potato:10,pea:15,strawberry:20,honeyberry:25,blueberry:45}));
 it('charges once now, queues seeds and does not change carried seeds',()=>{
  const g=createGarden(),e=createEconomy(),o=createOrders();e.gold=100;
  const next=purchaseSeeds(e,o,g.seeds,{radish:2,potato:1,pea:1,strawberry:0,honeyberry:0,blueberry:0})!;
  expect(next.economy.gold).toBe(65);expect(next.orders.pending).toEqual({radish:2,potato:1,pea:1,strawberry:0,honeyberry:0,blueberry:0});expect(g.seeds.radish).toBe(4);expect(e.gold).toBe(100);expect(o.pending).toEqual(emptyQuantities());
 });
 it('rejects empty, negative, fractional, unaffordable and excessive orders',()=>{
  const g=createGarden(),e=createEconomy(),o=createOrders();e.gold=10;
  for(const cart of [{radish:0,potato:0,pea:0,strawberry:0,honeyberry:0,blueberry:0},{radish:-1,potato:0,pea:0,strawberry:0,honeyberry:0,blueberry:0},{radish:.5,potato:0,pea:0,strawberry:0,honeyberry:0,blueberry:0},{radish:0,potato:0,pea:1,strawberry:0,honeyberry:0,blueberry:0},{radish:NaN,potato:0,pea:0,strawberry:0,honeyberry:0,blueberry:0}])expect(purchaseSeeds(e,o,g.seeds,cart)).toBeNull();
  expect(e.gold).toBe(10);e.gold=99999999;expect(purchaseSeeds(e,o,g.seeds,{radish:999999,potato:0,pea:0,strawberry:0,honeyberry:0,blueberry:0})).toBeNull();
 });
 it('allows spending the exact balance and combines same-day orders',()=>{
  const g=createGarden(),e=createEconomy();e.gold=20;const first=purchaseSeeds(e,createOrders(),g.seeds,{radish:1,potato:0,pea:0,strawberry:0,honeyberry:0,blueberry:0})!;
  const second=purchaseSeeds(first.economy,first.orders,g.seeds,{radish:0,potato:0,pea:1,strawberry:0,honeyberry:0,blueberry:0})!;
  expect(second.economy.gold).toBe(0);expect(second.orders.pending).toEqual({radish:1,potato:0,pea:1,strawberry:0,honeyberry:0,blueberry:0});
 });
 it('delivers next morning, clears pending and does not redeliver on a second morning',()=>{
  const o=createOrders();o.pending.pea=3;const delivered=deliverOrders(o);expect(delivered.pending.pea).toBe(0);expect(delivered.mailbox.pea).toBe(3);expect(deliverOrders(delivered).mailbox.pea).toBe(3);expect(o.pending.pea).toBe(3);
 });
 it('keeps unclaimed mail and combines a later delivery',()=>{
  const o=createOrders();o.mailbox.radish=5;o.pending.radish=2;const delivered=deliverOrders(o);expect(delivered.mailbox.radish).toBe(7);
 });
 it('collects once, leaves pending orders alone and does not mutate live data before save',()=>{
  const g=createGarden(),o=createOrders();o.mailbox.radish=3;o.mailbox.potato=1;o.pending.pea=2;
  const taken=collectPackage(g,o)!;expect(taken.garden.seeds).toEqual({radish:7,potato:5,pea:4,strawberry:0,honeyberry:0,blueberry:0});expect(taken.orders.mailbox).toEqual(emptyQuantities());expect(taken.orders.pending.pea).toBe(2);
  expect(g.seeds.radish).toBe(4);expect(o.mailbox.radish).toBe(3);expect(collectPackage(taken.garden,taken.orders)).toBeNull();
 });
 it('rejects invalid persisted order counts',()=>{expect(validOrders(createOrders())).toBe(true);expect(validOrders({pending:{radish:-1,potato:0,pea:0,strawberry:0,honeyberry:0,blueberry:0},mailbox:emptyQuantities()})).toBe(false);expect(Number.isNaN(orderCost({radish:1.5,potato:0,pea:0,strawberry:0,honeyberry:0,blueberry:0}))).toBe(true);});
});
describe('spring fruit planting material',()=>{
 it('buys, delivers and collects every unlocked fruit planting material',()=>{
  const garden=createGarden(),economy=createEconomy();economy.gold=90;
  const cart={...emptyQuantities(),strawberry:1,honeyberry:1,blueberry:1};const bought=purchaseSeeds(economy,createOrders(),garden.seeds,cart)!;expect(bought.economy.gold).toBe(0);
  const taken=collectPackage(garden,deliverOrders(bought.orders))!;expect(taken.garden.seeds.strawberry).toBe(1);expect(taken.garden.seeds.honeyberry).toBe(1);expect(taken.garden.seeds.blueberry).toBe(1);
 });
});
