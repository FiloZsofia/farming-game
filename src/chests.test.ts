import {describe,it,expect} from 'vitest';
import {craftChest,transferChest,validChests,occupiedSlots} from './chests';
import {snapshot,decodeSnapshot,validSnapshot} from './storage';
import {createGardenSkill,gainGardening} from './gardening-skill';
import {createClock} from './clock';
import {createGarden} from './gardening';
const fresh=()=>snapshot({x:330,y:260},createClock(),createGarden());
function unlocked(){const s=fresh();s.skill=createGardenSkill();for(let i=0;i<132;i++)s.skill=gainGardening(s.skill,`action:${i}`)!;s.clearing.wood=40;s.travel.research.materials.scrap=10;return s;}
describe('crafted chest storage',()=>{
 it('requires the blueprint and consumes the exact materials without changing the source',()=>{expect(craftChest(fresh())).toBeNull();const s=unlocked(),n=craftChest(s)!;expect(n.clearing.wood).toBe(20);expect(n.travel.research.materials.scrap).toBe(5);expect(n.skill.chests?.packed).toBe(1);expect(s.clearing.wood).toBe(40);n.clearing.wood=19;expect(craftChest(n)).toBeNull();expect(validSnapshot(n)).toBe(true);});
 it('moves seeds, crops and materials both ways and persists without duplicating',()=>{const s=unlocked();s.skill.chests={packed:0,placed:[{x:330,y:260,items:{}}]};for(const key of ['seed:radish','material:wood','research:scrap']){const n=transferChest(s,0,key,true)!;expect(validSnapshot(n)).toBe(true);expect(decodeSnapshot(n)).toEqual(n);const restored=transferChest(n,0,key,false)!;expect(restored).toEqual(s);}expect(transferChest(s,0,'unknown',true)).toBeNull();expect(transferChest(s,0,'crop:radish',true)).toBeNull();});
 it('counts stacks of 99 and never overflows 24 slots or loses a partial deposit',()=>{const s=unlocked();s.clearing.wood=2500;s.skill.chests={packed:0,placed:[{x:330,y:260,items:{}}]};const n=transferChest(s,0,'material:wood',true)!;expect(n.skill.chests!.placed[0].items['material:wood']).toBe(2376);expect(n.clearing.wood).toBe(124);expect(occupiedSlots(n.skill.chests!.placed[0].items)).toBe(24);expect(transferChest(n,0,'material:wood',true)).toBeNull();const one=transferChest(n,0,'material:wood',false,true)!;expect(one.clearing.wood).toBe(125);expect(validChests(one.skill.chests)).toBe(true);});
 it('stores and retrieves the birdhouse exactly once',()=>{const s=unlocked();s.story.giftReceived=true;s.skill.chests={packed:0,placed:[{x:330,y:260,items:{}}]};const n=transferChest(s,0,'special:birdhouse',true)!;expect(validSnapshot(n)).toBe(true);expect(n.skill.birdhouseStored).toBe(true);expect(transferChest(n,0,'special:birdhouse',true)).toBeNull();const back=transferChest(n,0,'special:birdhouse',false)!;expect(back.skill.birdhouseStored).toBe(false);expect(validSnapshot(back)).toBe(true);});
 it('rejects unknown items and malformed contents',()=>{for(const items of [{'bogus':1},{'material:wood':-1},{'material:wood':2377}])expect(validChests({packed:0,placed:[{x:330,y:260,items}]})).toBe(false);});
});
