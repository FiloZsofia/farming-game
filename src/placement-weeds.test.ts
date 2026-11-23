import {it,expect} from 'vitest';
import {snapshot,validSnapshot} from './storage';
import {createClock} from './clock';
import {createGarden} from './gardening';
import {enableHomestead} from './homestead-migration';
import {debris,activeDebris,placementDebris} from './cleanup';
import {buyAnimalItem} from './livestock';
import {placeCoop,placePaddock} from './livestock-geometry';
import {clearWeedsUnderPlacedObjects} from './placement-weeds';
import {canPlaceChestAt} from './chest-placement';
function fresh(){let s=enableHomestead(snapshot({x:-200,y:-80},createClock(10,()=>.5),createGarden()),true);s.economy.gold=10000;for(const p of debris)s.clearing.removed[p.id]=1;return s;}
function weed(s:ReturnType<typeof fresh>,id:string,x:number,y:number){delete s.clearing.removed[id];s.clearing.positions[id]={x,y};}
it('never treats a weed under a future building as a placement obstacle',()=>{let s=buyAnimalItem(fresh(),'coop')!;weed(s,'weed-a',-200,-190);expect(placementDebris(s.clearing,{seeds:s.seeds,produce:s.produce,plots:new Map(s.plots)})).toEqual([]);const n=placeCoop(s,{x:-200,y:-190})!;expect(n).not.toBeNull();expect(clearWeedsUnderPlacedObjects(n)).toBe(true);expect(n.clearing.removed['weed-a']).toBe(10);expect(n.clearing.weed).toBe(0);expect(validSnapshot(n)).toBe(true);});
it('allows an attached fence beside weeds and removes only weeds actually under its edge',()=>{let s=buyAnimalItem(buyAnimalItem(fresh(),'coop')!,'paddock')!;s=placeCoop(s,{x:-200,y:-190})!;weed(s,'weed-a',-320,-80);weed(s,'weed-b',-332,-80);weed(s,'weed-c',-100,-80);const n=placePaddock(s,1,[{x:-236,y:-186},{x:-320,y:-186},{x:-320,y:-171},{x:-320,y:14},{x:-20,y:14},{x:-20,y:-186},{x:-164,y:-186}],3)!;expect(n).not.toBeNull();clearWeedsUnderPlacedObjects(n);expect(n.clearing.removed['weed-a']).toBe(10);expect(n.clearing.removed['weed-b']).toBeUndefined();expect(n.clearing.removed['weed-c']).toBe(10);expect(n.clearing.weed).toBe(0);expect(validSnapshot(n)).toBe(true);});
it('allows a chest on weeds and applies the same free disappearance rule',()=>{const s=fresh();s.skill.chests={packed:1,placed:[]};weed(s,'weed-a',-200,-120);const p={x:-200,y:-120};expect(canPlaceChestAt(p,{player:s.player,garden:{seeds:s.seeds,produce:s.produce,plots:new Map(s.plots)},clearing:s.clearing,skill:s.skill,story:s.story,travel:s.travel})).toBe(true);s.skill.chests.packed=0;s.skill.chests.placed.push({...p,items:{}});expect(clearWeedsUnderPlacedObjects(s)).toBe(true);expect(activeDebris(s.clearing,{seeds:s.seeds,produce:s.produce,plots:new Map(s.plots)})).toHaveLength(0);expect(s.clearing.weed).toBe(0);});
