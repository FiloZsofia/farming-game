import {it,expect} from 'vitest';
import {snapshot,decodeSnapshot} from './storage';
import {createGarden} from './gardening';
import {createClock} from './clock';
import {createCrafting} from './crafting';
import {placedItemAt,pickPlacedItem} from './placed-items';
const fresh=()=>{const s=snapshot({x:300,y:386},createClock(5),createGarden());s.farmName='Áthelyezés';s.travel.crafting=createCrafting();return s;};
for(const kind of ['composter','basketMaker','irrigation','beeHabitat','basket'] as const)it(`packs ${kind} once into the correct inventory and survives save/reload`,()=>{
 const s=fresh();s.travel.crafting!.machines=[{kind,x:324,y:420,started:null,ready:0}];const original=structuredClone(s),target=placedItemAt(s,{x:324,y:420})!;const result=pickPlacedItem(s,target);expect('state'in result).toBe(true);if(!('state'in result))return;const next=result.state;expect(next.travel.crafting!.machines).toEqual([]);expect(kind==='basket'?next.travel.estate.produce.basket:next.travel.crafting!.items[kind]).toBe(1);expect(decodeSnapshot(next)).toEqual(next);expect('error'in pickPlacedItem(next,target)).toBe(true);expect(s).toEqual(original);
});
it('packs the birdhouse and an empty chest without changing their ownership',()=>{
 const s=fresh();s.story.giftReceived=true;s.story.birdhouse={x:324,y:420};const bird=pickPlacedItem(s,placedItemAt(s,s.story.birdhouse)!);expect('state'in bird).toBe(true);if(!('state'in bird))return;expect(bird.state.story.birdhouse).toBeNull();expect(bird.state.story.giftReceived).toBe(true);expect(decodeSnapshot(bird.state)).toEqual(bird.state);
 const c=fresh();c.skill.chests={packed:0,placed:[{x:324,y:420,items:{}}]};const chest=pickPlacedItem(c,placedItemAt(c,{x:324,y:420})!);expect('state'in chest).toBe(true);if('state'in chest){expect(chest.state.skill.chests).toEqual({packed:1,placed:[]});expect(decodeSnapshot(chest.state)).toEqual(chest.state);}
});
it('protects working machines, unclaimed output and chest contents without mutation',()=>{
 for(const stage of [{started:5,ready:0},{started:null,ready:4}]){const s=fresh();s.travel.crafting!.machines=[{kind:'composter',x:324,y:420,...stage}];const before=structuredClone(s);expect('error'in pickPlacedItem(s,placedItemAt(s,{x:324,y:420})!)).toBe(true);expect(s).toEqual(before);}
 const s=fresh();s.skill.chests={packed:0,placed:[{x:324,y:420,items:{'material:wood':7}}]};expect(pickPlacedItem(s,placedItemAt(s,{x:324,y:420})!)).toEqual({error:'Előbb ürítsd ki a tárolóládát.'});expect(s.skill.chests.placed[0].items['material:wood']).toBe(7);
});
it('preserves placed items when the backpack is full or the player is too far away',()=>{
 const s=fresh();s.clearing.wood=1287;s.travel.crafting!.machines=[{kind:'irrigation',x:324,y:420,started:null,ready:0}];const target=placedItemAt(s,{x:324,y:420})!;expect(pickPlacedItem(s,target)).toEqual({error:'Nincs elég hely a Készletben.'});expect(s.travel.crafting!.machines).toHaveLength(1);s.clearing.wood=0;s.player={x:500,y:500};expect(pickPlacedItem(s,target)).toEqual({error:'Sétálj közelebb.'});expect(s.travel.crafting!.machines).toHaveLength(1);
});
