import {it,expect} from 'vitest';
import {roundedPath} from './path-curves';
it('rounds a sharp turn without moving endpoints or overshooting its corridor',()=>{
 const points=[[0,0],[100,0],[100,100]],curve=roundedPath(points,20);
 expect(curve[0]).toEqual(points[0]);expect(curve.at(-1)).toEqual(points[2]);expect(curve).not.toContainEqual(points[1]);
 for(const [x,y]of curve){expect(x).toBeGreaterThanOrEqual(0);expect(x).toBeLessThanOrEqual(100);expect(y).toBeGreaterThanOrEqual(0);expect(y).toBeLessThanOrEqual(100);}
 expect(roundedPath([[0,0],[10,0]])).toEqual([[0,0],[10,0]]);
});
