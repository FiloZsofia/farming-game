import {describe,it,expect} from 'vitest';
import {workAngle,WORK_SECONDS} from './tool-motion';
describe('work direction',()=>{
 it('aims the downward-drawn tool toward all four targets at contact',()=>{
  for(const [dx,dy]of [[1,0],[-1,0],[0,-1],[0,1]]){const angle=workAngle(dx,dy,WORK_SECONDS/2);expect(-Math.sin(angle)).toBeCloseTo(dx);expect(Math.cos(angle)).toBeCloseTo(dy);}
 });
 it('compensates for the mirrored character without reversing the world target',()=>{
  for(const dx of [-1,1]){const angle=workAngle(dx,0,WORK_SECONDS/2,true);expect(Math.sin(angle)).toBeCloseTo(dx);}
 });
});
