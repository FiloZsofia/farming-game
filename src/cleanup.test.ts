import {describe,it,expect} from 'vitest';
import {createGarden} from './gardening';
import {createClearing,clearDebris,debris,regrowDebris,activeDebris,validClearing,hasPlantAt,debrisAt} from './cleanup';
const complete=(state:ReturnType<typeof createClearing>,item:typeof debris[number],day=1)=>{for(let i=0;i<(item.kind==='weed'?1:3);i++)state=clearDebris(state,item,'hand',item,day)!;return state;};
describe('permanent farm restoration',()=>{
 it('retires loose farm wood and rocks without invalidating legacy resource records',()=>{const state=createClearing();for(const item of debris.filter(d=>d.kind!=='weed')){expect(clearDebris(state,item,'hand',item,1)).toBeNull();state.removed[item.id]=1;}expect(validClearing(state)).toBe(true);expect(activeDebris(state,createGarden()).every(d=>d.kind==='weed')).toBe(true);});
 it('renews collected weeds after three days and preserves existing resources',()=>{let state=createClearing();const weeds=debris.filter(d=>d.kind==='weed');for(const item of weeds)state=complete(state,item);expect(activeDebris(state,createGarden())).toHaveLength(0);expect(Object.keys(regrowDebris(state,3,createGarden()).removed)).toHaveLength(weeds.length);const regrown=regrowDebris(state,4,createGarden());expect(activeDebris(regrown,createGarden()).every(d=>d.kind==='weed')).toBe(true);expect(regrown.weed).toBe(weeds.length);expect(validClearing(regrown)).toBe(true);});
 it('keeps the birdhouse and cultivated ground free of returning weeds',()=>{const garden=createGarden(),weed=debris.find(d=>d.kind==='weed')!,state=complete(createClearing(),weed);garden.plots.set('288,432',{crop:'pea',growth:0,watered:false,regrowing:false});const regrown=regrowDebris(state,4,garden,weed);const moved=activeDebris(regrown,garden).find(d=>d.id===weed.id)!;expect(hasPlantAt(moved,garden)).toBe(false);expect(Math.hypot(moved.x-weed.x,moved.y-weed.y)).toBeGreaterThanOrEqual(38);});
 it('rejects invalid work phases and material totals',()=>{for(const progress of [{'rock-a':3},{'weed-a':1},{unknown:1}])expect(validClearing({...createClearing(),progress})).toBe(false);expect(validClearing({...createClearing(),wood:-1})).toBe(false);});
});

it('targets the closest weed even near the corner of a snapped tile',()=>{
 const state=createClearing(),garden=createGarden();state.positions['weed-a']={x:300,y:400};state.positions['weed-b']={x:317,y:400};
 expect(debrisAt(state,garden,312,412)?.id).toBe('weed-b');
 const item=debrisAt(state,garden,288,388)!;expect(item.id).toBe('weed-a');
 const next=clearDebris(state,item,'hand',{x:300,y:430},1)!;expect(next.weed).toBe(1);expect(next.removed['weed-a']).toBe(1);expect(state.removed['weed-a']).toBeUndefined();
});
