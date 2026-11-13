import type Phaser from 'phaser';
import type {LivingBedArea} from './living-bed-layout';
type Point={x:number;y:number};
/** Layered water arcs, travelling highlights and small splashes inside the bed. */
export function drawBedSpray(g:Phaser.GameObjects.Graphics,source:Point,area:LivingBedArea,elapsed:number){
 const age=elapsed-600;if(age<0||elapsed>=2500)return;
 const pressure=Math.min(1,age/220,(2500-elapsed)/180),phase=age/1000;
 const start={x:source.x,y:source.y-16};
 g.fillStyle(0xd2e9d8,pressure*.6).fillEllipse(start.x,start.y,6,2.5);
 for(let i=0;i<5;i++){
  const end={x:area.x+14+(area.w-28)*(i+.5)/5,y:area.y+13+(area.h-26)*(.5+.38*Math.sin(phase*2+i*.8))};
  const height=19+Math.min(26,Math.hypot(end.x-start.x,end.y-start.y)*.16);
  const at=(t:number)=>({x:start.x+(end.x-start.x)*t,y:start.y+(end.y-start.y)*t-4*height*t*(1-t)});
  const points=Array.from({length:25},(_,j)=>at(j/24));
  g.lineStyle(3,0x88c4ca,.12*pressure).strokePoints(points,false);
  g.lineStyle(1.1,0xb8e2dc,.62*pressure).strokePoints(points,false);
  for(let j=0;j<10;j++){
   const t=(phase*1.4+j/10+i*.137)%1,p=at(t),tail=at(Math.max(0,t-.025));
   g.lineStyle(1.05,0xd6eee0,pressure*(.55+.3*t)).lineBetween(tail.x,tail.y,p.x,p.y);
   g.fillStyle(j%3?0xa6d5d5:0xe4f2df,pressure*.8).fillEllipse(p.x,p.y,1.5,2);
  }
  const ring=(phase*2+i*.3)%1;
  g.lineStyle(.7,0xc4e4d9,(1-ring)*pressure*.55).strokeEllipse(end.x,end.y,3+ring*10,1.5+ring*4);
  for(let j=0;j<3;j++){const bounce=(phase*3+j/3+i*.21)%1;g.fillStyle(0xc7e7de,pressure*(1-bounce)*.65).fillCircle(end.x+(j-1)*3*bounce,end.y-Math.sin(bounce*Math.PI)*(3+j),.7);}
 }
}
