import {describe,it,expect} from 'vitest';
import {findSeeds,findableSeeds,unlockedSeeds} from './seed-find';
import {bedKinds,bedMixes,emptyBedSeeds,createLivingBed,harvestLivingPlant} from './living-bed';
import {createGardenSkill} from './gardening-skill';
import {emptyQuantities} from './economy';
import {createOrders} from './orders';
const roll=(...values:number[])=>()=>values.shift()!;
describe('seeds found while weeding',()=>{
 it('keeps the 25 percent chance and awards 1–3 seeds',()=>{
  const seeds=emptyBedSeeds(),orders={pending:emptyBedSeeds(),mailbox:emptyBedSeeds()};
  expect(findSeeds(seeds,orders,roll(.25))).toBeNull();expect(findSeeds(seeds,orders,roll(.999))).toBeNull();
  expect(findSeeds(seeds,orders,roll(.24999,0,0))).toEqual({crop:findableSeeds[0],amount:1});
  expect(findSeeds(seeds,orders,roll(0,.5,.5))?.amount).toBe(2);
  expect(findSeeds(seeds,orders,roll(0,.999,.999))?.amount).toBe(3);
 });
 it('includes every used annual and excludes unused species and plants retained after harvest',()=>{
  expect([...findableSeeds].sort()).toEqual(['radish','lettuce','carrot','calendula','borage','chamomile','onion','potato','marigold'].sort());
  for(const kind of new Set(Object.values(bedMixes).flatMap(m=>m.members)))expect(findableSeeds.includes(kind)).toBe(!bedKinds[kind].perennial);
  for(let index=0;index<findableSeeds.length;index++){
   const kind=findableSeeds[index],seeds=emptyBedSeeds(),orders={pending:emptyBedSeeds(),mailbox:emptyBedSeeds()};
   expect(findSeeds(seeds,orders,roll(0,(index+.1)/findableSeeds.length,0))).toEqual({crop:kind,amount:1});
   const bed=createLivingBed();bed.plants=[{kind,growth:9,removed:false,flowering:false,flowerDays:0,seedTaken:false}];expect(harvestLivingPlant(bed,0)!.plants[0].removed).toBe(true);
   expect(Object.values(seeds).every(n=>n===0)).toBe(true);
  }
 });
 it('respects capacity including pending and mailbox seeds, for additional flower species too',()=>{
  const seeds=emptyBedSeeds(),orders={pending:emptyBedSeeds(),mailbox:emptyBedSeeds()};for(const kind of findableSeeds)seeds[kind]=999999;seeds.calendula=999997;orders.pending.calendula=1;
  expect(findSeeds(seeds,orders,roll(0,0,.999))).toEqual({crop:'calendula',amount:1});orders.mailbox.calendula=1;expect(findSeeds(seeds,orders,roll(0))).toBeNull();
 });
 it('supports old storage without granting unstoreable species or changing the old catalog unlocks',()=>{
  const seeds=emptyQuantities(),orders=createOrders();const find=findSeeds(seeds,orders,roll(0,.999,0));expect(find&&find.crop in seeds).toBe(true);
  expect(unlockedSeeds(createGardenSkill())).toEqual(['radish','potato','pea']);expect(unlockedSeeds({...createGardenSkill(),rewarded:true})).toHaveLength(6);
 });
});
