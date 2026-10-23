import {describe,it,expect} from 'vitest';
import {createGarden} from './gardening';
import {createClearing,clearDebris,debris,regrowDebris,activeDebris,validClearing,hasPlantAt} from './cleanup';
describe('farm clearing',()=>{
 it('requires the correct tool and close range, without mutating the old state',()=>{
  const state=createClearing(),rock=debris[0];
  expect(clearDebris(state,rock,'axe',rock,1)).toBeNull();expect(clearDebris(state,rock,'pickaxe',{x:250,y:242},1)).toBeNull();
  const next=clearDebris(state,rock,'pickaxe',rock,1)!;expect(next.stone).toBe(1);expect(state).toEqual(createClearing());expect(clearDebris(next,rock,'pickaxe',rock,1)).toBeNull();
 });
 it('collects wood from branches and removes weeds by hand',()=>{
  const branch=debris.find(d=>d.kind==='branch')!,weed=debris.find(d=>d.kind==='weed')!;
  const state=clearDebris(createClearing(),branch,'axe',branch,1)!;expect(state.wood).toBe(1);
  const clean=clearDebris(state,weed,'hand',weed,1)!;expect(clean.weed).toBe(1);expect(clean.wood).toBe(1);expect(clean.stone).toBe(0);expect(activeDebris(clean,createGarden())).not.toContainEqual(weed);
 });
 it('restores every decorative kind after exactly three days without losing materials',()=>{
  let state=createClearing();for(const item of debris)state=clearDebris(state,item,item.kind==='rock'?'pickaxe':item.kind==='branch'?'axe':'hand',item,1)!;
  expect(Object.keys(regrowDebris(state,3,createGarden()).removed)).toHaveLength(debris.length);
  let seed=71;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};const regrown=regrowDebris(state,4,createGarden(),null,random);expect(Object.keys(regrown.positions)).toHaveLength(debris.length);expect(validClearing(regrown)).toBe(true);expect(regrown.removed).toEqual({});expect(regrown.wood).toBe(state.wood);expect(regrown.stone).toBe(state.stone);
 });
 it('relocates regrowth away from worked soil',()=>{
  const garden=createGarden(),weed=debris.find(d=>d.id==='weed-c')!,state=clearDebris(createClearing(),weed,'hand',weed,1)!;
  garden.plots.set('288,448',{crop:'pea',growth:0,watered:false,regrowing:false});
  const regrown=regrowDebris(state,4,garden);expect(regrown.removed[weed.id]).toBeUndefined();const moved=activeDebris(regrown,garden).find(d=>d.id===weed.id)!;expect(hasPlantAt(moved,garden)).toBe(false);expect(Math.hypot(moved.x-weed.x,moved.y-weed.y)).toBeGreaterThanOrEqual(52);
 });
 it('rejects corrupt material counts and removal records',()=>{
  expect(validClearing({removed:[],wood:0,stone:0})).toBe(false);expect(validClearing({removed:{'rock-a':0},wood:0,stone:0})).toBe(false);expect(validClearing({removed:{},wood:-1,stone:0})).toBe(false);
 });
});
describe('decorative regrowth around placed objects',()=>{
 it('keeps the birdhouse clear of returning debris',()=>{const item=debris[0],state=clearDebris(createClearing(),item,'pickaxe',item,1)!;const regrown=regrowDebris(state,4,createGarden(),item);expect(regrown.removed[item.id]).toBeUndefined();const p=regrown.positions[item.id];expect(Math.hypot(p.x-item.x,p.y-item.y)).toBeGreaterThanOrEqual(38);});
});
