import {it,expect} from 'vitest';
import {gatherLarchCones,larchConesReady} from './larch-cones';
import {snapshot,validSnapshot,decodeSnapshot} from './storage';
import {createGarden} from './gardening';
import {createClock} from './clock';
import {START} from './movement';
import {backpackSlots} from './chests';
it('collects two or three cones without changing the original, then waits three days',()=>{
 const s=snapshot(START,createClock(1),createGarden()),original=structuredClone(s);
 const a=gatherLarchCones(s,undefined,1,()=>0)!;expect(a.count).toBe(2);expect(backpackSlots(a.snapshot)).toBe(backpackSlots(s)+1);expect(a.snapshot.travel.crafting?.items.larchCone).toBe(2);expect(validSnapshot(a.snapshot)).toBe(true);expect(decodeSnapshot(a.snapshot)).toEqual(a.snapshot);expect(s).toEqual(original);
 expect(gatherLarchCones(a.snapshot,1,3)).toBeNull();const b=gatherLarchCones(a.snapshot,1,4,()=>.99)!;expect(b.count).toBe(3);expect(b.snapshot.travel.crafting?.items.larchCone).toBe(5);expect(larchConesReady(1,4)).toBe(true);expect(validSnapshot(s)).toBe(true);
});
