import {pondRadius} from './pond-shape';
import { farmLayout,farmBounds } from './layout';
export type Box = { x: number; y: number; w: number; h: number };
export const START = { x: 250, y: 242 };
export const obstacles: Box[] = [
  farmLayout.shipping,
  farmLayout.houseBounds, farmLayout.shedBounds,

];
export function blocked(x:number,y:number):boolean {
  const {pond,dock}=farmLayout;
  const onDock=x>=dock.x+7&&x<=dock.x+dock.w-7&&y>=dock.y&&y<=dock.y+dock.h-4;
  const nx=(x-pond.x)/(pond.rx+7),ny=(y-pond.y)/(pond.ry+4);
  const inWater=Math.hypot(nx,ny)<pondRadius(Math.atan2(ny,nx));
  return (inWater&&!onDock)||x<farmBounds.left+24||x>farmBounds.right-24||y<farmBounds.top+32||y>588||obstacles.some(b=>x+7>b.x&&x-7<b.x+b.w&&y+3>b.y&&y-4<b.y+b.h);
}
export function move(x:number,y:number,dx:number,dy:number,seconds:number,speedMultiplier=1,extraBlocked:(x:number,y:number)=>boolean=()=>false,terrainBlocked=blocked){
  const length=Math.hypot(dx,dy); if(!length)return {x,y};
  // Keep speed consistent on slower frames; two-pixel substeps still prevent tunnelling.
  const distance=95*speedMultiplier*Math.min(Math.max(seconds,0),0.1), steps=Math.max(1,Math.ceil(distance/2));
  for(let i=0;i<steps;i++){
    const nx=x+dx/length*distance/steps;
    if(!terrainBlocked(nx,y)&&!extraBlocked(nx,y))x=nx;
    const ny=y+dy/length*distance/steps;
    if(!terrainBlocked(x,ny)&&!extraBlocked(x,ny))y=ny;
  }
  return {x,y};
}
