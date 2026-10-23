import {describe,it,expect} from 'vitest';
import {farmLayout,porchInteraction} from './layout';
import {move,blocked,START} from './movement';
describe('farm movement',()=>{
 it('starts outside collision geometry at the veranda',()=>expect(blocked(START.x,START.y)).toBe(false));
 it('keeps diagonal and straight movement equally fast',()=>{const a=move(400,450,1,0,.04),b=move(400,450,1,1,.04);expect(Math.hypot(a.x-400,a.y-450)).toBeCloseTo(Math.hypot(b.x-400,b.y-450));});
 it('does not enter the house when walking north from the door',()=>{let p={...START};for(let i=0;i<80;i++)p=move(p.x,p.y,0,-1,.04);expect(p.y).toBeGreaterThanOrEqual(farmLayout.houseBounds.y+farmLayout.houseBounds.h+4);expect(blocked(p.x,p.y)).toBe(false);});
 it('blocks the pond',()=>{let p={x:450,y:460};for(let i=0;i<80;i++)p=move(p.x,p.y,1,0,.04);expect(p.x).toBeLessThan(520);expect(blocked(p.x,p.y)).toBe(false);expect(blocked(p.x+8,p.y)).toBe(true);});
 it('preserves travel distance on a 100 ms frame without skipping collision checks',()=>{const terrain=()=>false,a=move(400,450,1,0,.1,1,terrain,terrain);let b={x:400,y:450};for(let i=0;i<5;i++)b=move(b.x,b.y,1,0,.02,1,terrain,terrain);expect(a.x).toBeCloseTo(b.x);});
 it('keeps a character inside the farm after a long frame',()=>{const p=move(400,585,0,1,20);expect(p.y).toBeLessThanOrEqual(588);});
 it('allows the path from veranda into the yard',()=>{let p={...START};for(let i=0;i<20;i++)p=move(p.x,p.y,0,1,.04);expect(p.y).toBeGreaterThan(START.y+60);});
});

it('keeps the door and journal independently usable after moving the porch',()=>{expect(porchInteraction(START.x,START.y)).toBe('house');expect(porchInteraction(farmLayout.journal.x+9,farmLayout.journal.y+7)).toBe('journal');expect(porchInteraction(289,179)).toBe('journal');expect(porchInteraction(400,300)).toBe('');});
