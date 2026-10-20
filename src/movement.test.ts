import {describe,it,expect} from 'vitest';
import {move,blocked,START} from './movement';
describe('farm movement',()=>{
 it('starts outside collision geometry at the veranda',()=>expect(blocked(START.x,START.y)).toBe(false));
 it('keeps diagonal and straight movement equally fast',()=>{const a=move(400,450,1,0,.04),b=move(400,450,1,1,.04);expect(Math.hypot(a.x-400,a.y-450)).toBeCloseTo(Math.hypot(b.x-400,b.y-450));});
 it('does not enter the house when walking north from the door',()=>{let p={...START};for(let i=0;i<80;i++)p=move(p.x,p.y,0,-1,.04);expect(p.y).toBeGreaterThanOrEqual(227);expect(blocked(p.x,p.y)).toBe(false);});
 it('blocks the pond',()=>{let p={x:525,y:460};for(let i=0;i<80;i++)p=move(p.x,p.y,1,0,.04);expect(p.x).toBeLessThan(545);expect(blocked(p.x,p.y)).toBe(false);});
 it('keeps a character inside the farm after a long frame',()=>{const p=move(400,585,0,1,20);expect(p.y).toBeLessThanOrEqual(588);});
 it('allows the path from veranda into the yard',()=>{let p={...START};for(let i=0;i<20;i++)p=move(p.x,p.y,0,1,.04);expect(p.y).toBeGreaterThan(300);});
});
