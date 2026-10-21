import {describe,it,expect} from 'vitest';
import {createGarden} from './gardening';
import {createClearing,clearDebris,debris,regrowDebris,activeDebris,validClearing} from './cleanup';
describe('farm clearing',()=>{
 it('requires the correct tool and close range, without mutating the old state',()=>{
  const state=createClearing(),rock=debris[0];
  expect(clearDebris(state,rock,'axe',rock,1)).toBeNull();expect(clearDebris(state,rock,'pickaxe',{x:250,y:242},1)).toBeNull();
  const next=clearDebris(state,rock,'pickaxe',rock,1)!;expect(next.stone).toBe(1);expect(state).toEqual(createClearing());expect(clearDebris(next,rock,'pickaxe',rock,1)).toBeNull();
 });
 it('collects wood from branches and removes weeds by hand',()=>{
  const branch=debris.find(d=>d.kind==='branch')!,weed=debris.find(d=>d.kind==='weed')!;
  const state=clearDebris(createClearing(),branch,'axe',branch,1)!;expect(state.wood).toBe(1);
  const clean=clearDebris(state,weed,'hand',weed,1)!;expect(clean.weed).toBe(1);expect(clean.wood).toBe(1);expect(clean.stone).toBe(0);expect(activeDebris(clean,createGarden())).not.toContain(weed);
 });
 it('restores every decorative kind after exactly two days without losing materials',()=>{
  let state=createClearing();for(const item of debris)state=clearDebris(state,item,item.kind==='rock'?'pickaxe':item.kind==='branch'?'axe':'hand',item,1)!;
  expect(Object.keys(regrowDebris(state,2,createGarden()).removed)).toHaveLength(debris.length);
  const regrown=regrowDebris(state,3,createGarden());expect(regrown.removed).toEqual({});expect(regrown.wood).toBe(state.wood);expect(regrown.stone).toBe(state.stone);
 });
 it('keeps worked soil clear and allows regrowth only after the plot is gone',()=>{
  const garden=createGarden(),weed=debris.find(d=>d.id==='weed-c')!,state=clearDebris(createClearing(),weed,'hand',weed,1)!;
  garden.plots.set('288,448',{crop:'pea',growth:0,watered:false,regrowing:false});
  expect(regrowDebris(state,3,garden).removed[weed.id]).toBe(1);expect(activeDebris(createClearing(),garden)).not.toContain(weed);
  garden.plots.clear();expect(regrowDebris(state,4,garden).removed[weed.id]).toBeUndefined();
 });
 it('rejects corrupt material counts and removal records',()=>{
  expect(validClearing({removed:[],wood:0,stone:0})).toBe(false);expect(validClearing({removed:{'rock-a':0},wood:0,stone:0})).toBe(false);expect(validClearing({removed:{},wood:-1,stone:0})).toBe(false);
 });
});
describe('decorative regrowth around placed objects',()=>{
 it('keeps the birdhouse clear of returning debris',()=>{const item=debris[0],state=clearDebris(createClearing(),item,'pickaxe',item,1)!;expect(regrowDebris(state,3,createGarden(),item).removed[item.id]).toBe(1);});
});
