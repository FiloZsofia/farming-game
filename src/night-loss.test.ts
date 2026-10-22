import {describe,it,expect} from 'vitest';
import {nightLoss,nightLossText} from './night-loss';
const items=[{id:'radish',name:'Retek',quantity:12},{id:'potato',name:'Burgonya',quantity:0},{id:'pea',name:'Borsó',quantity:3}];
const sequence=(...values:number[])=>()=>values.shift()!;
describe('Night robbery',()=>{
 it('loses exactly one owned item, choosing only available candidates without modifying them',()=>{
  const before=structuredClone(items);expect(nightLoss(100,items,sequence(.49,.99))).toEqual({kind:'item',id:'pea',name:'Borsó',amount:1});expect(items).toEqual(before);
 });
 it('splits item and gold branches at 50 percent',()=>{
  expect(nightLoss(100,items,sequence(.499,0)).kind).toBe('item');expect(nightLoss(100,items,sequence(.5))).toEqual({kind:'gold',amount:10});
 });
 it('caps the gold loss at the carried balance',()=>{
  expect(nightLoss(6,items,()=>.8)).toEqual({kind:'gold',amount:6});expect(nightLoss(0,items,()=>.8)).toEqual({kind:'nothing'});
 });
 it('does not substitute gold when the item branch is empty, or items when gold is empty',()=>{
  expect(nightLoss(100,[],()=>.1)).toEqual({kind:'nothing'});expect(nightLoss(0,items,()=>.9)).toEqual({kind:'nothing'});
 });
 it('reports the precise loss or an unsuccessful attempt in the morning',()=>{
  expect(nightLossText({kind:'nothing'})).toContain('nem találtak nálam semmit');expect(nightLossText({kind:'gold',amount:6})).toContain('6 gold');expect(nightLossText({kind:'item',id:'radish',name:'Retek',amount:1})).toContain('1 db retek');
 });
});

import {robInventory} from './night-loss';
import {createGarden} from './gardening';
import {createClearing} from './cleanup';
describe('Carried inventory protection',()=>{
 it('can lose planting materials even with no harvested crops',()=>{
  const garden=createGarden();garden.seeds={radish:0,potato:0,pea:0,strawberry:0,honeyberry:0,blueberry:0,carrot:0,lettuce:0,onion:0};garden.seeds.strawberry=4;
  const result=robInventory(garden,createClearing(),100,sequence(.1,0));expect(result.garden.seeds.strawberry).toBe(3);expect(garden.seeds.strawberry).toBe(4);expect(result.gold).toBe(100);
 });
 it('can lose one gathered material while leaving the other materials unchanged',()=>{
  const garden=createGarden();for(const crop of Object.keys(garden.seeds) as (keyof typeof garden.seeds)[])garden.seeds[crop]=0;
  const clearing={...createClearing(),wood:7,stone:3,weed:5};const result=robInventory(garden,clearing,100,sequence(.1,.99));expect(result.clearing).toMatchObject({wood:7,stone:3,weed:4});expect(clearing.weed).toBe(5);
 });
 it('never considers starter tools or the birdhouse as loss candidates',()=>{
  const garden=createGarden();for(const crop of Object.keys(garden.seeds) as (keyof typeof garden.seeds)[])garden.seeds[crop]=0;
  expect(robInventory(garden,createClearing(),100,()=>.1).loss).toEqual({kind:'nothing'});
 });
});
