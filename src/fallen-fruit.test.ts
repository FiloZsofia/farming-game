import {expect,it} from 'vitest';
import {collectFruitFalls,pickFallenFruit} from './fallen-fruit';
import {createGarden,nextDayGarden} from './gardening';
import {createClock} from './clock';
import {snapshot,decodeSnapshot,validSnapshot} from './storage';
import {createCrafting,compostAction,advanceCrafting} from './crafting';
import {transferChest,backpackSlots} from './chests';
it('collects expired farm fruit once and preserves ground piles across save/reload',()=>{
 const g=createGarden();g.plots.set('288,432',{crop:'blueberry',growth:6,watered:false,regrowing:false,fruitSet:true,ripeDays:2});
 const s=snapshot({x:300,y:420},createClock(10),g),next=structuredClone(s.travel),after=nextDayGarden(g,undefined,{seed:1});collectFruitFalls(g,after,s.travel,next);s.travel=next;s.plots=[...after.plots];
 expect(s.travel.fallenFruit).toEqual([{x:300,y:444,count:1}]);expect(decodeSnapshot(s)).toEqual(s);
 const picked=pickFallenFruit(s,0)!;expect(picked.travel.fallenFruit).toEqual([]);expect(picked.travel.crafting?.items.fallenFruit).toBe(1);expect(pickFallenFruit(picked,0)).toBeNull();expect(validSnapshot(picked)).toBe(true);
 const tomorrow=nextDayGarden(after,undefined,{seed:1});collectFruitFalls(after,tomorrow,picked.travel,picked.travel);expect(picked.travel.fallenFruit).toEqual([]);
});
it('turns ten fallen fruit into four mulch without consuming weeds, and supports storage',()=>{
 let s=snapshot({x:300,y:420},createClock(10),createGarden());s.travel.crafting=createCrafting();s.travel.crafting.items.fallenFruit=10;s.travel.crafting.machines=[{kind:'composter',x:320,y:420,started:null,ready:0}];s.clearing.weed=20;
 s.skill.chests={packed:0,placed:[{x:300,y:420,items:{}}]};const slots=backpackSlots(s);const deposited=transferChest(s,0,'craft:fallenFruit',true)!;expect(backpackSlots(deposited)).toBe(slots-1);expect(transferChest(deposited,0,'craft:fallenFruit',false)).toEqual(s);
 s=compostAction(s,0,'fallenFruit')!;expect(s.clearing.weed).toBe(20);expect(s.travel.crafting?.items.fallenFruit).toBe(0);expect(compostAction(s,0,'fallenFruit')).toBeNull();s.clock.day++;s.travel.crafting=advanceCrafting(s.travel.crafting,s.clock.day);s=compostAction(s,0)!;expect(s.travel.crafting?.items.mulch).toBe(4);expect(validSnapshot(s)).toBe(true);
});
it('accepts old crafting saves without fallen fruit and rejects corrupt new piles',()=>{
 const s=snapshot({x:300,y:420},createClock(10),createGarden());s.travel.crafting=createCrafting();delete s.travel.crafting.items.fallenFruit;expect(decodeSnapshot(s)).toEqual(s);
 s.travel.fallenFruit=[{x:300,y:444,count:-1}];expect(validSnapshot(s)).toBe(false);
});
it('preserves the full expired tree yield and merges repeated falls at the same spot',()=>{
 const g=createGarden(),s=snapshot({x:300,y:420},createClock(20),g);s.travel.estate.trees=[{kind:'apple',x:450,y:300,planted:1,last:17,fruit:3,fruitDay:17}];const n=structuredClone(s.travel);n.estate.trees[0].fruit=0;n.estate.trees[0].bloomState='fallen';delete n.estate.trees[0].fruitDay;
 collectFruitFalls(g,g,s.travel,n);expect(n.fallenFruit).toEqual([{x:450,y:308,count:3}]);collectFruitFalls(g,g,s.travel,n);expect(n.fallenFruit).toEqual([{x:450,y:308,count:6}]);
});
