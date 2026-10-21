import {describe,it,expect} from 'vitest';
import {findSeeds,unlockedSeeds} from './seed-find';
import {createGardenSkill} from './gardening-skill';
import {emptyQuantities} from './economy';
import {createOrders} from './orders';
const roll=(...values:number[])=>()=>values.shift()!;
describe('seeds found while weeding',()=>{
 it('uses a strict 25 percent boundary and awards 1–3 of one unlocked type',()=>{
  const skill=createGardenSkill(),seeds=emptyQuantities(),orders=createOrders();
  expect(findSeeds(skill,seeds,orders,roll(.25))).toBeNull();expect(findSeeds(skill,seeds,orders,roll(.999))).toBeNull();
  expect(findSeeds(skill,seeds,orders,roll(.24999,0,0))).toEqual({crop:'radish',amount:1});
  expect(findSeeds(skill,seeds,orders,roll(0,.5,.5))).toEqual({crop:'potato',amount:2});
  expect(findSeeds(skill,seeds,orders,roll(0,.999,.999))).toEqual({crop:'pea',amount:3});
 });
 it('includes all six types only after fruit unlock and never mutates saved input',()=>{
  const skill={...createGardenSkill(),rewarded:true},seeds=emptyQuantities(),orders=createOrders();
  expect(unlockedSeeds(createGardenSkill())).toHaveLength(3);expect(unlockedSeeds(skill)).toHaveLength(6);
  expect(findSeeds(skill,seeds,orders,roll(0,.999,.999))).toEqual({crop:'blueberry',amount:3});expect(seeds).toEqual(emptyQuantities());expect(orders).toEqual(createOrders());
 });
 it('includes the three new vegetables only at level three',()=>{const skill={...createGardenSkill(),rewarded:true,levelThreeRewarded:true};expect(unlockedSeeds(skill)).toEqual(['radish','potato','pea','strawberry','honeyberry','blueberry','carrot','lettuce','onion']);for(let index=0;index<9;index++)expect(findSeeds(skill,emptyQuantities(),createOrders(),roll(0,(index+.1)/9,0))!.crop).toBe(unlockedSeeds(skill)[index]);expect(findSeeds(skill,emptyQuantities(),createOrders(),roll(0,.999,.999))).toEqual({crop:'onion',amount:3});});
 it('respects storage limits including paid orders and mailbox contents',()=>{
  const seeds={...emptyQuantities(),radish:999998,potato:999999,pea:999999},orders=createOrders();
  expect(findSeeds(createGardenSkill(),seeds,orders,roll(0,0,.999))).toEqual({crop:'radish',amount:1});
  orders.pending.radish=1;expect(findSeeds(createGardenSkill(),seeds,orders,roll(0))).toBeNull();
 });
});
