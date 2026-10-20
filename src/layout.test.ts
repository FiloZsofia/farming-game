import {describe,it,expect} from 'vitest';
import {farmLayout} from './layout';
import {blocked} from './movement';
function segmentDistance(px:number,py:number,a:readonly number[],b:readonly number[]){
 const dx=b[0]-a[0],dy=b[1]-a[1],length=dx*dx+dy*dy;
 const t=length?Math.max(0,Math.min(1,((px-a[0])*dx+(py-a[1])*dy)/length)):0;
 return Math.hypot(px-a[0]-t*dx,py-a[1]-t*dy);
}
describe('farm layout clearance',()=>{
 it('keeps the full surface of each bed away from every path',()=>{
  for(const bed of farmLayout.beds)for(const path of farmLayout.paths)for(let i=1;i<path.points.length;i++){
   // Sample the entire bed, including its border, against the round-capped path.
   for(let x=bed.x;x<=bed.x+bed.w;x++)for(let y=bed.y;y<=bed.y+bed.h;y++)
    expect(segmentDistance(x,y,path.points[i-1],path.points[i])).toBeGreaterThan(path.width/2+3);
  }
 });
 it('allows entry along the dock but stops at the water past its end',()=>{
  const {dock}=farmLayout;expect(blocked(dock.x+20,dock.y+15)).toBe(false);
  expect(blocked(dock.x+dock.w+14,dock.y+15)).toBe(true);
 });
 it('keeps the main walking route between gate and veranda unobstructed',()=>{
  const path=farmLayout.paths[0];for(let i=1;i<path.points.length;i++){
   const a=path.points[i-1],b=path.points[i];for(let t=0;t<=1;t+=.025){const y=a[1]+(b[1]-a[1])*t;if(y>588)continue;expect(blocked(a[0]+(b[0]-a[0])*t,y)).toBe(false);}
  }
 });
});
