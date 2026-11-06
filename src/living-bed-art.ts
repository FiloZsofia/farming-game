import Phaser from 'phaser';
import {bedKinds,bedPlantStage,livingFlowers,type LivingBed} from './living-bed';
import {livingBedArea,livingPlantPoint} from './living-bed-layout';
export {livingBedArea,livingPlantPoint} from './living-bed-layout';
export function paintLivingBed(g:Phaser.GameObjects.Graphics,s:LivingBed,selected:number){
 const {x,y,w,h}=livingBedArea;g.clear();g.fillStyle(0x304734,.18).fillEllipse(x+w/2,y+h/2+7,w+22,h+14);
 if(!s.prepared){g.lineStyle(1,0xc4b480,.85);for(const [a,b]of [[x,y+4],[x+w-5,y],[x+w,y+h],[x+4,y+h-2]]){g.fillStyle(0x755839).fillRect(a-2,b-8,4,13);g.fillStyle(0xc5a777).fillRect(a-2,b-8,4,3);}g.lineStyle(1,0xc7b989,.8).strokePoints([{x,y:y+4},{x:x+w-5,y},{x:x+w,y:y+h},{x:x+4,y:y+h-2}],true);return;}
 g.fillStyle(0x60472f).fillRoundedRect(x-4,y-3,w+8,h+9,17);g.fillStyle(s.moisture>1?0x634b36:s.moisture===1?0x7e6042:0x9b7a50).fillRoundedRect(x,y,w,h,14);
 for(let i=0;i<42;i++){const xx=x+9+(i*43%(w-18)),yy=y+7+(i*29%(h-14));g.fillStyle(s.moisture?0x3d3426:0x6d5337,.28).fillEllipse(xx,yy,3+i%3,1.5);}
 if(s.mulched)for(let i=0;i<80;i++){const xx=x+7+i*47%(w-14),yy=y+6+i*31%(h-12);g.lineStyle(1,i%3?0xb79a61:0xd0b87d,.8).lineBetween(xx,yy,xx+4+i%4,yy+(i%3-1)*2);}
 for(let i=0;i<s.plants.length;i++){
  const p=s.plants[i],point=livingPlantPoint(i),xx=point.x,yy=point.y,stage=bedPlantStage(p);if(p.removed){g.lineStyle(1,0x695133,.65).strokeEllipse(xx,yy,10,5);continue;}
  const size=Math.min(1,.36+p.growth/bedKinds[p.kind].days*.64),droop=s.moisture===0?5:0;
  g.fillStyle(0x2b3929,.22).fillEllipse(xx+2,yy+3,25*size,9*size);
  if(i===selected)g.lineStyle(1,0xf0d68f,.9).strokeEllipse(xx,yy+2,30,14);
  if(p.kind==='radish'&&stage==='ready')g.fillStyle(0xbf6878).fillEllipse(xx,yy-2,9,8);
  const leaves=p.kind==='lettuce'?9:p.kind==='thyme'?8:5;
  for(let j=0;j<leaves;j++){const angle=j/leaves*Math.PI*2,dx=Math.cos(angle)*(p.kind==='lettuce'?8:10)*size,dy=Math.sin(angle)*4*size-droop*.4,tipY=yy-8*size-Math.abs(Math.cos(angle))*8*size+droop;
   g.lineStyle(1,p.kind==='thyme'?0x6e825d:0x658b48).lineBetween(xx,yy-1,xx+dx,tipY);
   g.fillStyle(p.kind==='thyme'?(j%2?0x9ca67b:0x748b65):p.kind==='lettuce'?(j%2?0xa6b664:0x7e9d50):(j%2?0x8daa5e:0x638344)).fillEllipse(xx+dx,tipY+dy,p.kind==='thyme'?5*size:10*size,p.kind==='lettuce'?9*size:5*size);
  }
  if(p.kind==='pea'){g.lineStyle(1,0x9b8253).lineBetween(xx-7,yy+1,xx-4,yy-29);g.lineStyle(2,0x6b8b49).lineBetween(xx,yy,xx-3,yy-24*size);if(stage==='ready')g.fillStyle(0xa7b85e).fillEllipse(xx+3,yy-16,5,12);}
  if(p.flowering){for(let j=0;j<3;j++){const fx=xx+(j-1)*7,fy=yy-20-j%2*7;g.lineStyle(1,0x718b51).lineBetween(xx,yy-4,fx,fy);if(stage==='seed'){g.fillStyle(p.seedTaken?0x8e845c:0xbaa26b).fillCircle(fx,fy,2.5);}else{const color=p.kind==='thyme'?0xb59bc2:p.kind==='wildflower'?(i%2?0xa69bc2:0xe3d7b2):0xe6d7aa;g.fillStyle(color);for(let k=0;k<5;k++)g.fillCircle(fx+Math.cos(k*1.256)*3,fy+Math.sin(k*1.256)*3,2);g.fillStyle(0xd2ad62).fillCircle(fx,fy,1.5);}}}
 }
}
export function paintBedVisitors(g:Phaser.GameObjects.Graphics,s:LivingBed,time:number){g.clear();const flowers=livingFlowers(s);if(!flowers||s.weather==='rain')return;for(let i=0;i<Math.min(3,flowers);i++){const point=livingPlantPoint((i*3+2)%9),t=time*.001+i*2.4,x=point.x+Math.cos(t)*14,y=point.y-22+Math.sin(t*1.6)*8;g.fillStyle(0xe9e2be,.8).fillEllipse(x-1,y-3,5,3).fillEllipse(x+3,y-3,5,3);g.fillStyle(0xc7a45e).fillEllipse(x,y,6,3);g.lineStyle(1,0x4e5037).lineBetween(x,y-1,x,y+1);}}
