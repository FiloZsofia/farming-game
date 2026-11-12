import {it,expect} from 'vitest';
import {thinTreeLeaves} from './tree-leaf-selection';
it('reduces every nontrivial tree by its own quota, deterministically and without rearranging leaves',()=>{
 for(const size of [2,9,83,117]){const leaves=Array.from({length:size},(_,i)=>({rank:(i*37)%131,id:i})),result=thinTreeLeaves(leaves);expect(result).toHaveLength(size-Math.ceil(size*.08));expect(result.map(p=>p.id)).toEqual([...result.map(p=>p.id)].sort((a,b)=>a-b));expect(thinTreeLeaves(leaves)).toEqual(result);expect(leaves).toHaveLength(size);}
 expect(thinTreeLeaves([])).toEqual([]);expect(thinTreeLeaves([{rank:1}])).toEqual([{rank:1}]);
});
