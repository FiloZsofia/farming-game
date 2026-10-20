export type Box = { x: number; y: number; w: number; h: number };
export const START = { x: 250, y: 242 };
export const obstacles: Box[] = [
  {x:132,y:110,w:215,h:113}, {x:601,y:112,w:118,h:89},
  {x:572,y:390,w:188,h:139}, {x:551,y:415,w:225,h:92},
  {x:0,y:0,w:800,h:65}, {x:0,y:0,w:30,h:600}, {x:775,y:0,w:25,h:600},
  {x:74,y:353,w:24,h:18}, {x:478,y:280,w:27,h:18}
];
export function blocked(x:number,y:number):boolean {
  return x<12||x>788||y<12||y>588||obstacles.some(b=>x+7>b.x&&x-7<b.x+b.w&&y+3>b.y&&y-4<b.y+b.h);
}
export function move(x:number,y:number,dx:number,dy:number,seconds:number){
  const length=Math.hypot(dx,dy); if(!length)return {x,y};
  const distance=95*Math.min(Math.max(seconds,0),0.05), steps=Math.max(1,Math.ceil(distance/2));
  for(let i=0;i<steps;i++){
    const nx=x+dx/length*distance/steps;
    if(!blocked(nx,y))x=nx;
    const ny=y+dy/length*distance/steps;
    if(!blocked(x,ny))y=ny;
  }
  return {x,y};
}
