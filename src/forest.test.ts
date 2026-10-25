import {describe,it,expect} from 'vitest';
import {createForest,forestBlocked,forestPlants,validForest,forestEnemies} from './forest';
import {createTravel} from './travel';
import {createGarden} from './gardening';
import {createClock} from './clock';
import {snapshot,decodeSnapshot,validSnapshot} from './storage';
import {backpackSlots,canCarryChange} from './chests';
import {createGardenSkill} from './gardening-skill';
import {emptyExtras,extraValue} from './estate';
describe('forest investigation and backpack',()=>{
 it('connects the village with the hollow through a single saddle',()=>{expect(forestBlocked(0,930)).toBe(false);expect(forestBlocked(-660,978)).toBe(false);expect(forestBlocked(-660,850)).toBe(true);expect(forestBlocked(-660,1100)).toBe(true);expect(forestBlocked(-1130,950)).toBe(true);});
 it('requires cleared enemies before the sample and examination before dispatch',()=>{const f=createForest();expect(validForest(f,10)).toBe(true);f.sample=true;expect(validForest(f,10)).toBe(false);f.defeated=forestEnemies.map(e=>e.id);expect(validForest(f,10)).toBe(true);f.sent=true;expect(validForest(f,10)).toBe(false);f.examined=true;expect(validForest(f,10)).toBe(true);expect(validForest({...f,defeated:undefined},10)).toBe(false);});
 it('saves plants independently and rejects future collection dates',()=>{const f=createForest();f.picked[forestPlants[0].id]=3;expect(validForest(f,3)).toBe(true);expect(validForest(f,2)).toBe(false);expect(extraValue({...emptyExtras(),thyme:1,plantain:1,nettle:1})).toBe(12);});
 it('roundtrips the investigation and herb counts in a forest save',()=>{const s=snapshot({x:-430,y:995},createClock(10),createGarden());s.travel.forest={...createForest(),stick:true,defeated:forestEnemies.map(e=>e.id),sample:true,examined:true,sent:true};s.travel.estate.produce.thyme=3;expect(validSnapshot(s)).toBe(true);expect(decodeSnapshot(s)).toEqual(s);});
 it('limits new pickups to 16 stacks, counting each 99 items as a slot',()=>{const s=snapshot({x:330,y:260},createClock(),createGarden());s.clearing.wood=99*13;expect(backpackSlots(s)).toBe(16);const n=structuredClone(s);n.clearing.stone=1;expect(canCarryChange(s,n)).toBe(false);n.clearing.stone=0;n.seeds.radish++;expect(canCarryChange(s,n)).toBe(true);n.clearing.wood++;expect(canCarryChange(s,n)).toBe(false);});
 it('preserves old over-capacity inventories, permitting unloading without losing items',()=>{const s=snapshot({x:330,y:260},createClock(),createGarden());s.clearing.wood=99*20;const n=decodeSnapshot(s)!;expect(n.clearing.wood).toBe(s.clearing.wood);expect(canCarryChange(s,n)).toBe(true);n.clearing.stone++;expect(canCarryChange(s,n)).toBe(false);n.clearing.wood-=99;expect(canCarryChange(s,n)).toBe(true);});
 it('migrates missing forage fields without concealing corrupted old counts',()=>{const s=snapshot({x:330,y:260},createClock(),createGarden());for(const k of ['produce','shipping','roe'] as const)for(const h of ['thyme','plantain','nettle'])delete (s.travel.estate[k] as Record<string,number>)[h];expect(decodeSnapshot(s)?.travel.estate.produce.thyme).toBe(0);delete (s.travel.estate.produce as Record<string,number>).cherry;expect(decodeSnapshot(s)).toBeNull();});
});
