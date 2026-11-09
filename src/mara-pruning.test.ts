import {it,expect} from 'vitest';
import {MaraPruning} from './mara-pruning';
import {worldBlocked} from './village-layout';
it('trims both shrubs, walks between them outside the truck, and leaves the result visible',()=>{const p=new MaraPruning(),ys=new Set<number>();for(let i=0;i<500;i++){const q=p.update(.05);expect(worldBlocked(q.x,q.y)).toBe(false);ys.add(Math.round(q.y));}expect(p.progress).toEqual([1,1]);expect(p.phase).toBe('done');expect(ys.has(905)&&ys.has(859)).toBe(true);const before=p.position;expect(p.update(10)).toEqual(before);});
it('pauses maintenance without losing progress and restores an already tended garden',()=>{const p=new MaraPruning();p.update(2);const before=[...p.progress];p.update(0);expect(p.progress).toEqual(before);p.reset(true);expect(p.progress).toEqual([1,1]);expect(p.phase).toBe('done');p.reset();expect(p.progress).toEqual([0,0]);});
