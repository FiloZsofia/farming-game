import {describe,it,expect} from 'vitest';
import {workAngle,workPose,WORK_CONTACT,WORK_SECONDS} from './tool-motion';
describe('overhead work direction',()=>{
 it('aims toward all four targets at the contact frame',()=>{
  for(const [dx,dy]of [[1,0],[-1,0],[0,-1],[0,1]]){const angle=workAngle(dx,dy,WORK_SECONDS*(1-WORK_CONTACT));expect(-Math.sin(angle)).toBeCloseTo(dx);expect(Math.cos(angle)).toBeCloseTo(dy);}
 });
 it('compensates for the mirrored character without reversing the world target',()=>{
  for(const dx of [-1,1]){const angle=workAngle(dx,0,WORK_SECONDS*(1-WORK_CONTACT),true);expect(Math.sin(angle)).toBeCloseTo(dx);}
 });
 it('raises the head above the shoulder before a fast strike and returns to rest',()=>{for(const [x,y]of [[35,35],[-35,35],[0,60],[0,-15]]){const raised=workPose(x,y,WORK_SECONDS*.62);expect(Math.cos(raised.angle)).toBeLessThan(-.9);expect(raised.phase).toBe('lift');const end=workPose(x,y,0);expect(end.angle).toBeCloseTo(0);expect(end.weight).toBe(0);expect(end.reach).toBe(1);}});
 it('keeps poses continuous and finite at each phase boundary',()=>{for(const boundary of [.34,.43,WORK_CONTACT]){const a=workPose(27,42,WORK_SECONDS*(1-boundary+1e-6)),b=workPose(27,42,WORK_SECONDS*(1-boundary-1e-6));expect(Math.abs(a.angle-b.angle)).toBeLessThan(.001);expect(Math.abs(a.reach-b.reach)).toBeLessThan(.001);}for(let i=0;i<=52;i++){const p=workPose(27,42,i/100);expect(Number.isFinite(p.angle)).toBe(true);}});
});
