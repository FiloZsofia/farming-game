import type Phaser from 'phaser';
import {growthTarget,isRipe,type Plot} from './gardening';

export function drawCrop(g:Phaser.GameObjects.Graphics,x:number,y:number,plot:Plot){
 if(!plot.crop)return;
 const stage=Math.min(1,plot.growth/growthTarget(plot)),cx=x+8,cy=y+10;
 const leaf=(px:number,py:number,w:number,h:number,color:number)=>{g.fillStyle(color);g.fillEllipse(px,py,w,h);};
 g.fillStyle(0x2f3d28,.35);g.fillEllipse(cx+1,cy+3,11,4);
 if(stage<.3){g.lineStyle(1,0x497043);g.lineBetween(cx,cy+2,cx,cy-4);leaf(cx-2,cy-4,5,3,0x7eab5b);leaf(cx+2,cy-5,4,3,0xa5bc72);return;}
 if(['strawberry','honeyberry','blueberry'].includes(plot.crop)){
  const bush=plot.crop!=='strawberry',size=bush?12:9;leaf(cx,cy-4,size,8,0x4d8446);leaf(cx-4,cy-6,6,5,0x82a857);leaf(cx+3,cy-8,6,5,0x649b4e);if(isRipe(plot)){for(const [dx,dy]of [[-3,-2],[3,-5],[0,1]]){const xx=cx+dx,yy=cy+dy;
   if(plot.crop==='strawberry'){g.fillStyle(0xe37968).fillTriangle(xx-2.5,yy-1,xx+2.5,yy-1,xx,yy+3);leaf(xx,yy-1,5,3,0xe78a78);g.fillStyle(0xf8d58b).fillRect(xx,yy,1,1);}
   else if(plot.crop==='honeyberry'){leaf(xx,yy,3,6,0x5266a5);leaf(xx-.5,yy-1,1,3,0x9ca4cd);}
   else{leaf(xx,yy,4,4,0x617db3);g.lineStyle(.6,0xb7cce4).lineBetween(xx-1,yy-1,xx+1,yy+1).lineBetween(xx+1,yy-1,xx-1,yy+1);}
  }}
 }else if(plot.crop==='lettuce'){
  leaf(cx,cy-2,stage<.65?8:13,stage<.65?6:10,0x4e873f);leaf(cx-3,cy-4,7,6,0x86b456);leaf(cx+3,cy-3,7,6,0x9ac36d);leaf(cx,cy-2,6,6,0xc1d98b);
 }else if(plot.crop==='carrot'){
  g.lineStyle(1,0x508642);for(const dx of [-4,-1,3]){g.lineBetween(cx,cy+1,cx+dx,cy-10);for(let i=0;i<3;i++){const yy=cy-3-i*3,xx=cx+dx*(i+1)/3;g.lineBetween(xx-2,yy-2,xx,yy).lineBetween(xx,yy,xx+2,yy-2);}}if(isRipe(plot)){g.fillStyle(0xe59948);g.fillTriangle(cx-3,cy,cx+3,cy,cx,cy+6);}
 }else if(plot.crop==='onion'){
  for(const dx of [-4,0,3]){g.lineStyle(1.5,dx?0x5a914c:0x96b76b);g.lineBetween(cx,cy+2,cx+dx,cy-11);}if(isRipe(plot)){leaf(cx,cy+2,8,7,0xc89d62);leaf(cx-1,cy+1,4,5,0xe8c58a);}
 }else if(plot.crop==='pea'){
  g.lineStyle(1,0x806c4d);for(const dx of [-4,4])g.lineBetween(cx+dx,cy+4,cx+dx,cy-15);g.lineBetween(cx-4,cy-12,cx+4,cy-12);
  g.lineStyle(1,0x4c793f);g.lineBetween(cx,cy+3,cx-2,cy-12);
  for(let i=0;i<4;i++){leaf(cx+(i%2?3:-3),cy-i*3,6,3,i%2?0x91ac62:0x5e914d);}
  if(isRipe(plot)){leaf(cx+3,cy-7,4,8,0xb1c76d);leaf(cx-3,cy-1,3,7,0x8fb45a);g.fillStyle(0xd3df93);g.fillRect(cx+3,cy-9,1,4);}
 }else{
  const size=stage<.65?5:7;
  for(const [dx,dy,w,h,c]of [[-3,-2,size,4,0x477c43],[3,-4,size,4,0x78a654],[-1,-6,4,size,0x91b965],[4,0,5,3,0x5f9148]])leaf(cx+dx,cy+dy,w,h,c);
  g.lineStyle(1,0xb6c87c);g.lineBetween(cx,cy+1,cx-1,cy-6);
  if(isRipe(plot)&&plot.crop==='radish'){leaf(cx,cy+2,7,6,0xdd7d8c);leaf(cx-1,cy+1,3,2,0xf1b1a6);g.lineStyle(1,0xe9d7b7);g.lineBetween(cx,cy+4,cx+1,cy+6);}
  if(plot.crop==='potato'&&stage>.6){leaf(cx-4,cy-7,3.5,3,0xe2d9c4);leaf(cx+2,cy-9,3.5,3,0xe2d9c4);g.fillStyle(0xd7b65e).fillCircle(cx-4,cy-7,.7).fillCircle(cx+2,cy-9,.7);}
  if(isRipe(plot)&&plot.crop==='potato'){leaf(cx-3,cy+3,5,4,0xc3a06c);leaf(cx+3,cy+4,5,4,0x9e7b4f);g.fillStyle(0xe6c68e);g.fillRect(cx-4,cy+2,2,1);}
 }
}

export function drawRipeMarker(g:Phaser.GameObjects.Graphics,x:number,y:number){
 g.fillStyle(0xf5d77c,.23).fillCircle(x,y,6);g.fillStyle(0x344f35).fillCircle(x,y,4.3);g.fillStyle(0xffe49b).fillCircle(x,y,3.2);g.fillStyle(0xfff7d6).fillCircle(x-.7,y-.8,1.1);
 g.lineStyle(1.2,0x527147).beginPath().moveTo(x-1.5,y).lineTo(x-.3,y+1.2).lineTo(x+1.8,y-1.3).strokePath();
}
