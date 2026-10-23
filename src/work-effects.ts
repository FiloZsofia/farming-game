import Phaser from 'phaser';
import {heavyTool} from './tool-motion';
export type WorkFrame={tool:string;progress:number;phase:string;tip:{x:number;y:number}};
export type ImpactKind='wood'|'stone'|'soil'|'weed'|'water'|'harvest';
type Particle={x:number;y:number;vx:number;vy:number;age:number;life:number;color:number;size:number};
export class WorkEffects{
 private g:Phaser.GameObjects.Graphics;private trail:{x:number;y:number;age:number}[]=[];private particles:Particle[]=[];private dust:{x:number;y:number;age:number;kind:ImpactKind}[]=[];
 constructor(scene:Phaser.Scene){this.g=scene.add.graphics().setDepth(106);}
 impact(x:number,y:number,kind:ImpactKind){
  const colors=kind==='wood'?[0xd7b178,0xa77b4f,0xf1ce91]:kind==='stone'?[0xb4b7a5,0x818e83,0xe6d9a6]:kind==='water'?[0x9cd9df,0xd0ebe0]:kind==='weed'?[0x8dab59,0x4f7c43]:kind==='harvest'?[0xd8c181,0x91a85f]:[0xa38253,0x70513a,0xc4a573];
  const count=kind==='wood'||kind==='stone'?10:6;
  for(let i=0;i<count;i++){const a=(i/count)*Math.PI*2;this.particles.push({x,y:y-2,vx:Math.cos(a)*(17+i%3*9),vy:-21-Math.abs(Math.sin(a))*31,age:0,life:.3+i%4*.06,color:colors[i%colors.length],size:kind==='wood'?2.5:1.5+i%2});}
  this.dust.push({x,y,age:0,kind});
 }
 update(dt:number,frame:WorkFrame|null){
  const g=this.g;g.clear();for(const p of this.trail)p.age+=dt;this.trail=this.trail.filter(p=>p.age<.12);
  if(frame&&heavyTool(frame.tool)&&frame.progress>=.43&&frame.progress<=.66)this.trail.push({...frame.tip,age:0});
  for(let i=1;i<this.trail.length;i++){const a=this.trail[i-1],b=this.trail[i];g.lineStyle(2.5,0xffe6b4,(1-b.age/.12)*.3).lineBetween(a.x,a.y,b.x,b.y);}
  for(const d of this.dust){d.age+=dt;const t=d.age/.32;if(t<1){g.lineStyle(.8,d.kind==='water'?0xa8dbd3:0xe5c58f,(1-t)*.45).strokeEllipse(d.x,d.y,6+t*21,3+t*8);if(d.kind!=='water'){g.fillStyle(d.kind==='stone'?0xb0af94:0xb79a6a,(1-t)*.12).fillEllipse(d.x,d.y-2-t*3,9+t*23,5+t*7);}}}this.dust=this.dust.filter(d=>d.age<.32);
  for(const p of this.particles){p.age+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=155*dt;g.lineStyle(p.size,p.color,Math.max(0,1-p.age/p.life)).lineBetween(p.x,p.y,p.x-p.vx*.035,p.y-p.vy*.025);}
  this.particles=this.particles.filter(p=>p.age<p.life);
 }
 clear(){this.trail=[];this.particles=[];this.dust=[];this.g.clear();}
}
