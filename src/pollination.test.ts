import {initializeFruitTimers} from './fruit-timers';
import {describe,it,expect} from 'vitest';
import {setsFruit} from './pollination';
import {createGarden,nextDayGarden,work,waterPlot,isRipe,growthTarget,type Crop,type Garden} from './gardening';
import {createEstate,advanceEstate,collectEstate,trees,treeKinds,validEstate} from './estate';
import {snapshot,decodeSnapshot,validSnapshot} from './storage';
import {createClock} from './clock';
import {nearEmptyBlossoms} from './pollination-observation';
import {nestInfluence} from './forest-atmosphere';
function garden(crop:Crop='strawberry',growth=0){const g=createGarden();g.plots.set('341,272',{crop,growth,watered:true,regrowing:false});return g;}
function step(g:Garden,seed=0){const watered=structuredClone(g);for(const p of watered.plots.values())waterPlot(p);return nextDayGarden(watered,undefined,{seed});}
describe('pollinator decline',()=>{
 it('gives every plant one productive cycle in three, stable across reloads',()=>{for(let seed=0;seed<50;seed++)for(const key of ['341,272:strawberry','435,312:blueberry','tree:cherry:320,410'])expect([0,1,2].filter(c=>setsFruit(seed,key,c))).toHaveLength(1);});
 it.each(['strawberry','honeyberry','blueberry'] as Crop[])('produces only twice in six %s cycles, keeping the bush alive',crop=>{
  let g=garden(crop);for(let day=0;day<100&&(g.plots.get('341,272')!.bloomCycle??0)<6;day++){g=step(g,1);if(isRipe(g.plots.get('341,272')!))expect(work(g,'harvest',{x:341,y:272},{x:353,y:284}).ok).toBe(true);}
  expect(g.produce[crop]).toBe(2);expect(g.plots.get('341,272')).toMatchObject({crop,regrowing:true,bloomCycle:6});
 });
 it('allows three full days of harvesting, then drops unpicked berries even without watering',()=>{
  let g=garden('strawberry',3);g=step(g,0);expect(g.plots.get('341,272')!.ripeDays).toBe(0);
  for(const age of [1,2]){g=nextDayGarden(g,undefined,{seed:0});expect(isRipe(g.plots.get('341,272')!)).toBe(true);expect(g.plots.get('341,272')!.ripeDays).toBe(age);}
  const pick=structuredClone(g);expect(work(pick,'harvest',{x:341,y:272},{x:353,y:284}).ok).toBe(true);
  g=nextDayGarden(g,undefined,{seed:0});expect(isRipe(g.plots.get('341,272')!)).toBe(false);expect(g.plots.get('341,272')).toMatchObject({crop:'strawberry',growth:0,regrowing:true,fruitAftermath:'fallen'});expect(g.produce.strawberry).toBe(0);
 });
 it('shows empty blossoms on failed fruit set, saves the decision and restarts without replanting',()=>{
  let g=garden('strawberry',2);g=step(g,1);expect(g.plots.get('341,272')!.fruitSet).toBe(false);
  const s=snapshot({x:350,y:350},createClock(10),g),loaded=decodeSnapshot(s)!;expect(loaded).not.toBeNull();expect(loaded.plots).toEqual(s.plots);
  g=step(g,1);expect(isRipe(g.plots.get('341,272')!)).toBe(false);expect(g.plots.get('341,272')!.growth).toBe(growthTarget(g.plots.get('341,272')!));g=step(g,1);expect(g.plots.get('341,272')).toMatchObject({crop:'strawberry',growth:0,regrowing:true,bloomCycle:1,fruitAftermath:'empty'});
 });
 it('preserves vegetable harvests and never ages carried produce',()=>{for(const crop of ['radish','potato','pea','carrot','lettuce','onion'] as Crop[]){let g=garden(crop);g.produce.blueberry=25;for(let day=0;day<12;day++)g=step(g,1);expect(isRipe(g.plots.get('341,272')!)).toBe(true);expect(g.produce.blueberry).toBe(25);expect(g.plots.get('341,272')!.fruitSet).toBeUndefined();}});
 it('grants already-ripe legacy crops a full new harvesting window',()=>{let g=garden('strawberry',4);g=nextDayGarden(g,undefined,{seed:1});expect(isRipe(g.plots.get('341,272')!)).toBe(true);expect(g.plots.get('341,272')!.ripeDays).toBe(0);});
 it('applies the same one-in-three rule to seasonal trees, with the agreed successful yields',()=>{
  for(const kind of treeKinds){let e=createEstate();e.trees=[{kind,x:320,y:410,planted:1,last:0,fruit:0}];const first=trees[kind].season===1?16:31;
   for(let day=first;day<first+15&&(e.trees[0].bloomCycle??0)<3;day++){e=advanceEstate(e,day,()=>0,undefined,{seed:2});if(e.trees[0].fruit)e=collectEstate(e,320,410,day)!;expect(validEstate(e,day)).toBe(true);}
   expect(e.trees[0].bloomCycle).toBe(3);expect(e.produce[kind]).toBe(trees[kind].yield);
  }
 });
 it('drops tree fruit after three days and does not retry fruit set every morning after failure',()=>{
  let e=createEstate();e.trees=[{kind:'cherry',x:320,y:410,planted:1,last:0,fruit:0}];e=advanceEstate(e,16,()=>0,undefined,{seed:2});expect(e.trees[0].fruit).toBe(3);
  e=advanceEstate(e,18,()=>0,undefined,{seed:2});expect(e.trees[0].fruit).toBe(3);e=advanceEstate(e,19,()=>0,undefined,{seed:2});expect(e.trees[0]).toMatchObject({fruit:0,last:19,bloomState:'fallen'});expect(e.produce.cherry).toBe(0);
  let failed=createEstate();failed.trees=[{kind:'cherry',x:320,y:410,planted:1,last:0,fruit:0}];failed=advanceEstate(failed,16,()=>0,undefined,{seed:0});expect(failed.trees[0]).toMatchObject({fruit:0,last:16,bloomState:'empty',bloomCycle:1});failed=advanceEstate(failed,17,()=>0,undefined,{seed:0});expect(failed.trees[0].bloomCycle).toBe(1);
 });
 it('records only actual empty fruit set observations, not normal ripening or neglected fallen fruit',()=>{
  const g=garden(),e=createEstate(),actor={x:353,y:300};expect(nearEmptyBlossoms(g,e,actor)).toBe(false);g.plots.get('341,272')!.fruitSet=false;expect(nearEmptyBlossoms(g,e,actor)).toBe(true);expect(nearEmptyBlossoms(g,e,{x:800,y:500})).toBe(false);delete g.plots.get('341,272')!.fruitSet;g.plots.get('341,272')!.fruitAftermath='fallen';expect(nearEmptyBlossoms(g,e,actor)).toBe(false);
 });
 it('validates the new save fields and preserves the dated journal entry',()=>{
  const g=garden('strawberry',4);g.plots.get('341,272')!.fruitSet=true;g.plots.get('341,272')!.ripeDays=2;const s=snapshot({x:350,y:350},createClock(10),g);s.travel.pollinationObservation={day:9};expect(decodeSnapshot(s)).toEqual(s);s.plots[0][1].ripeDays=3;expect(validSnapshot(s)).toBe(false);s.plots[0][1].ripeDays=2;s.travel.pollinationObservation.day=11;expect(validSnapshot(s)).toBe(false);
 });
 it('keeps the visual disturbance local to the nesting hollow',()=>{expect(nestInfluence(-946,974)).toBe(1);expect(nestInfluence(-720,974)).toBe(0);expect(nestInfluence(350,300)).toBe(0);});
});

it('starts old ripe fruit timers once on load and expires them three mornings later',()=>{
 let g=garden('strawberry',4),e=createEstate();e.trees=[{kind:'cherry',x:320,y:410,planted:1,last:0,fruit:3}];
 expect(initializeFruitTimers(g,e,16)).toBe(true);expect(initializeFruitTimers(g,e,16)).toBe(false);
 expect(g.plots.get('341,272')!.ripeDays).toBe(0);expect(e.trees[0].fruitDay).toBe(16);
 for(const day of [17,18]){g=nextDayGarden(g,undefined,{seed:1});e=advanceEstate(e,day,()=>0,undefined,{seed:2});expect(isRipe(g.plots.get('341,272')!)).toBe(true);expect(e.trees[0].fruit).toBe(3);}
 g=nextDayGarden(g,undefined,{seed:1});e=advanceEstate(e,19,()=>0,undefined,{seed:2});expect(isRipe(g.plots.get('341,272')!)).toBe(false);expect(e.trees[0].fruit).toBe(0);
});
