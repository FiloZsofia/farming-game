import {describe,it,expect} from 'vitest';
import {JUMP_DURATION,JUMP_SPEED,JUMP_HEIGHT,RUN_SPEED,movementSpeed,jumpHeight} from './jump';
import {move,blocked} from './movement';
describe('jump movement',()=>{
 it('briefly travels farther without changing ordinary walking speed',()=>{
  const a=move(400,450,1,0,.04),b=move(400,450,1,0,.04,JUMP_SPEED);
  expect(b.x-400).toBeCloseTo((a.x-400)*JUMP_SPEED);
 });
 it('retains collision checks during boosted movement',()=>{let p={x:450,y:460};for(let i=0;i<100;i++)p=move(p.x,p.y,1,0,.04,JUMP_SPEED);expect(blocked(p.x,p.y)).toBe(false);expect(p.x).toBeLessThan(480);});
 it('runs faster than walking and does not stack run and jump boosts',()=>{expect(movementSpeed(false,true)).toBe(RUN_SPEED);expect(movementSpeed(true,true)).toBe(JUMP_SPEED);expect(movementSpeed(true,false)).toBe(JUMP_SPEED);expect(movementSpeed(false,false)).toBe(1);});
 it('can jump in place and returns to ground height',()=>{expect(jumpHeight(JUMP_DURATION)).toBeCloseTo(0);expect(jumpHeight(JUMP_DURATION/2)).toBe(JUMP_HEIGHT);expect(jumpHeight(0)).toBe(0);expect(move(400,450,0,0,.04,JUMP_SPEED)).toEqual({x:400,y:450});});
});
