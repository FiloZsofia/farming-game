import {pondRadius} from './pond-shape';
import { farmLayout } from './layout';
export type Box = { x: number; y: number; w: number; h: number };
export const START = { x: 250, y: 242 };
export const obstacles: Box[] = [
  farmLayout.shipping,
  {x:132,y:110,w:215,h:113}, {x:601+farmLayout.shedOffset.x,y:112+farmLayout.shedOffset.y,w:118,h:89},
  {x:0,y:0,w:800,h:65}, {x:0,y:0,w:30,h:600}, {x:775,y:0,w:25,h:600},
];
export function blocked(x:number,y:number):boolean {
  const {pond,dock}=farmLayout;
  const onDock=x>=dock.x+7&&x<=dock.x+dock.w-7&&y>=dock.y&&y<=dock.y+dock.h-4;
  const nx=(x-pond.x)/(pond.rx+7),ny=(y-pond.y)/(pond.ry+4);
  const inWater=Math.hypot(nx,ny)<pondRadius(Math.atan2(ny,nx));
  return (inWater&&!onDock)||x<12||x>788||y<12||y>588||obstacles.some(b=>x+7>b.x&&x-7<b.x+b.w&&y+3>b.y&&y-4<b.y+b.h);
}
export function move(x:number,y:number,dx:number,dy:number,seconds:number,speedMultiplier=1,extraBlocked:(x:number,y:number)=>boolean=()=>false){
  const length=Math.hypot(dx,dy); if(!length)return {x,y};
  const distance=95*speedMultiplier*Math.min(Math.max(seconds,0),0.05), steps=Math.max(1,Math.ceil(distance/2));
  for(let i=0;i<steps;i++){
    const nx=x+dx/length*distance/steps;
    if(!blocked(nx,y)&&!extraBlocked(nx,y))x=nx;
    const ny=y+dy/length*distance/steps;
    if(!blocked(x,ny)&&!extraBlocked(x,ny))y=ny;
  }
  return {x,y};
}
