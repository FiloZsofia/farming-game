import {it,expect} from 'vitest';
import {pathTextureMarks} from './path-texture';
it('keeps grit inside the path and uses the same marks across joined segments',()=>{
 const whole=[{width:24,points:[[0,0],[200,0]]}],split=[{width:24,points:[[0,0],[100,0]]},{width:24,points:[[100,0],[200,0]]}];
 const marks=pathTextureMarks(whole);expect(marks.length).toBeGreaterThan(20);expect(pathTextureMarks(split)).toEqual(marks);expect(new Set(marks.map(p=>p.kind)).size).toBe(3);
 for(const m of marks)expect(Math.abs(m.y)).toBeLessThanOrEqual(9);
 expect(pathTextureMarks([{width:24,points:[[20,20],[20,20]]}]).length).toBeGreaterThan(0);
});
it('orients wear along the path and distinguishes the centre from the edges',()=>{
 const vertical=pathTextureMarks([{width:32,points:[[0,0],[0,200]]}]);
 expect(vertical.every(m=>Math.abs(m.angle-Math.PI/2)<1e-9)).toBe(true);
 expect(vertical.some(m=>m.edge===0)).toBe(true);expect(vertical.some(m=>m.edge>.7)).toBe(true);
});
