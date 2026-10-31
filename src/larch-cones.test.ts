import {it,expect} from 'vitest';
import {scatterLarchCones,availableLarchCones,gatherLarchCone,type ConeState} from './larch-cones';
import {snapshot,validSnapshot,decodeSnapshot} from './storage';
import {createGarden} from './gardening';
import {createClock} from './clock';
import {START} from './movement';
import {backpackSlots} from './chests';
import {inLarchGlade} from './larch-glade';
it('scatters 2–3 separate cones within the clearing',()=>{
 for(let seed=1;seed<30;seed++){let n=seed;const rng=()=>{n=(Math.imul(n,1664525)+1013904223)>>>0;return n/4294967296;};const p=scatterLarchCones(rng);expect([2,3]).toContain(p.cones.length);for(const c of p.cones){expect(inLarchGlade(c.x,c.y)).toBe(true);for(const other of p.cones)if(c!==other)expect(Math.hypot(c.x-other.x,c.y-other.y)).toBeGreaterThanOrEqual(48);}}
});
it('collects exactly one cone, leaves others, then regrows three days after the last pickup',()=>{
 const original=snapshot(START,createClock(1),createGarden()),state:ConeState={};let data=original;const initial=availableLarchCones(state,1).length;expect([2,3]).toContain(initial);
 const first=state.conePatch!.cones[0],a=gatherLarchCone(data,state.conePatch!,first.id,1)!;expect(a.snapshot.travel.crafting?.items.larchCone).toBe(1);expect(backpackSlots(a.snapshot)).toBe(backpackSlots(original)+1);expect(validSnapshot(a.snapshot)).toBe(true);expect(decodeSnapshot(a.snapshot)).toEqual(a.snapshot);expect(gatherLarchCone(a.snapshot,a.patch,first.id,1)).toBeNull();expect(original.travel.crafting?.items.larchCone).toBeUndefined();
 state.conePatch=a.patch;data=a.snapshot;expect(availableLarchCones(state,1)).toHaveLength(initial-1);
 for(const c of availableLarchCones(state,1)){const result:NonNullable<ReturnType<typeof gatherLarchCone>>=gatherLarchCone(data,state.conePatch!,c.id,1)!;data=result.snapshot;state.conePatch=result.patch;}
 expect(availableLarchCones(state,3)).toHaveLength(0);expect([2,3]).toContain(availableLarchCones(state,4).length);expect(data.travel.crafting?.items.larchCone).toBe(initial);
});
