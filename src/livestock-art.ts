import Phaser from 'phaser';
import {animalItemNames,type AnimalItem,type AnimalPen,type HenVariety} from './livestock';
import {gatePoint} from './livestock-geometry';
export function drawAnimalItem(g:Phaser.GameObjects.Graphics,item:Exclude<AnimalItem,'paddock'>,x=0,y=0,day=1,pen?:AnimalPen,rotation=0){
 const rect=(xx:number,yy:number,w:number,h:number,c:number)=>g.fillStyle(c).fillRoundedRect(x+xx,y+yy,w,h,.8);
 const line=(xx:number,yy:number,xxx:number,yyy:number,c:number,w=1)=>g.lineStyle(w,c).lineBetween(x+xx,y+yy,x+xxx,y+yyy);
 const oval=(xx:number,yy:number,w:number,h:number,c:number,a=1)=>g.fillStyle(c,a).fillEllipse(x+xx,y+yy,w,h);
 if(item==='coop'){
  oval(3,5,98,24,0x374d33,.2);rect(-35,-43,70,46,0xb89d70);rect(-35,-8,70,10,0x81735a);
  for(let yy=-38;yy<-9;yy+=7)line(-33,yy,33,yy,0x947a55,.6);
  g.fillStyle(0x4b5c50).fillPoints([{x:x-44,y:y-41},{x:x-24,y:y-65},{x:x+23,y:y-65},{x:x+44,y:y-41}],true);g.fillStyle(0x788777).fillPoints([{x:x-42,y:y-43},{x:x-23,y:y-63},{x:x+22,y:y-63},{x:x+41,y:y-43}],true);
  for(let yy=-59;yy<-43;yy+=5)line(-25-(yy+60)*.8,yy,25+(yy+60)*.8,yy,0x9ba18a,.6);line(-42,-41,43,-41,0x394c42,2);
  rect(-30,-35,20,17,0x68573e);rect(-28,-33,16,12,0xbcc8ad);line(-20,-33,-20,-20,0xeee0b5,1.5);line(-28,-27,-12,-27,0xeee0b5,1.5);
  rect(3,-28,23,31,0x544835);rect(6,-26,17,29,0x374333);rect(7,-24,14,27,0x273a2c);line(4,-27,25,-27,0xd7bf92,1.5);
  rect(-32,-12,22,14,0x8c704b);oval(-21,-11,21,6,0xd3ba7f);for(let i=0;i<7;i++)line(-30+i*3,-11,-27+i*3,-7,0xa48e5a,.6);
  for(let i=0;i<Math.min(5,pen?.eggs??0);i++){oval(-27+i*3,-10+(i%2)*2,3.5,5,0xe9d7ad);}
  g.fillStyle(0x9c8459).fillPoints([{x:x+5,y:y+1},{x:x+23,y:y+1},{x:x+31,y:y+9},{x:x+10,y:y+9}],true);for(let i=0;i<3;i++)line(8+i*3,3+i*2,25+i*2,3+i*2,0xd9bc83,.8);
  if(pen&&day-pen.cleanedDay>=3){for(let i=0;i<13;i++){const xx=-31+(i*19)%61,yy=-5+(i*7)%15;oval(xx,yy,3+i%3,1.8,0x665c40,.75);if(i%3===0)line(xx-2,yy-1,xx+2,yy+1,0xb3a074,.8);}rect(-33,-7,18,3,0x776345);}
 }else if(item==='feeder'){
  oval(0,7,37,13,0x45543b,.22);rect(-15,-7,30,15,0x92754a);oval(0,-6,32,10,0xbd9f66);oval(0,-7,27,7,0xd9c184);for(let i=0;i<12;i++)oval(-11+(i*7)%23,-8+(i%3),1.6,1,pen&&pen.feed>0?0xa58a4b:0xb69b6b);line(-14,2,14,2,0xceb486,.8);
 }else if(item==='drinker'){
  oval(0,7,29,11,0x5d776b);oval(0,5,25,8,pen?.wateredDay===day?0x9bc2b9:0x8c9b82);rect(-7,-17,14,21,0xa7b5a2);oval(0,-17,14,5,0xd3d8bd);line(-4,-14,-4,-3,0xe0e3ca,1.5);line(6,-14,6,1,0x6f8a7a,.6);
 }else if(item==='dustBath'){
  if(rotation){oval(0,5,30,46,0x8a7e5c);oval(-1,3,25,40,0xc6b68d);oval(-1,2,20,34,0xd6c59d);for(let i=0;i<16;i++)oval(-8+(i*7)%17,-12+(i*11)%33,1.4,1,0xa8986e,.7);return;}
  oval(0,6,48,23,0x8a7e5c);oval(-1,3,42,19,0xc6b68d);oval(-2,2,34,12,0xd6c59d);for(let i=0;i<18;i++)oval(-17+(i*13)%34,-3+(i*7)%12,1.4,1,0xa8986e,.7);
 }else if(item==='perch'){
  if(rotation){for(const [xx,yy]of [[-7,-15],[8,15]]){line(xx-3,yy,xx,yy-25,0x66503a,4);line(xx-3,yy,xx,yy-25,0xbb9966,2);line(xx+5,yy,xx,yy-19,0x8e734b,2);}line(-9,-40,10,-10,0x66503a,5);line(-9,-41,10,-11,0xc2a16b,2);return;}
  for(const xx of [-20,20]){line(xx,5,xx*.85,-25,0x5c513b,4);line(xx,5,xx*.85,-25,0xa98a59,2);line(xx+4,5,xx*.85,-18,0x92754c,2);}
  line(-23,-25,23,-25,0x66503a,5);line(-23,-26,23,-26,0xc2a16b,2);line(-19,-13,19,-13,0x9b8054,3);
 }else{
  oval(1,5,69,31,0x3a533c,.27);for(const xx of [-28,28]){line(xx,7,xx,-38,0x66533a,3);line(xx-1,6,xx-1,-37,0xbb9966,1);}
  g.fillStyle(0x4a6958).fillPoints([{x:x-34,y:y-35},{x:x-24,y:y-45},{x:x+25,y:y-45},{x:x+34,y:y-35}],true);rect(-34,-35,68,5,0x91a28a);for(let xx=-25;xx<30;xx+=9)line(xx,-44,xx+6,-36,0xb8c3a2,.7);
 }
}
export function drawHen(g:Phaser.GameObjects.Graphics,variety:HenVariety,time:number,activity='stand',look=1){
 g.clear();const white=variety==='cream',speckled=variety==='speckled',base=white?0xe5dcc0:speckled?0x939f90:0xb67e50,shade=white?0xb4ae91:speckled?0x596b61:0x805538,light=white?0xf4edcf:speckled?0xc0c7b0:0xd8a66c;
 const walking=activity==='walk',peck=activity==='peck'?Math.max(0,Math.sin(time*5))*5:0,step=walking?Math.sin(time*13)*2:0;
 g.fillStyle(0x354a31,.2).fillEllipse(0,0,17,5);g.lineStyle(1.2,0xb29959).lineBetween(-3,-3,-3+step,1).lineBetween(3,-3,3-step,1);g.lineStyle(.8,0x9c844d).lineBetween(-5+step,1,-1+step,1).lineBetween(1-step,1,5-step,1);
 g.fillStyle(shade).fillTriangle(-5*look,-6,-12*look,-17,-10*look,-7);g.fillStyle(base).fillEllipse(0,-8,18,13);g.fillStyle(light).fillEllipse(-1,-9,11,8);g.lineStyle(.5,shade).strokeEllipse(-1,-8,9,6);
 if(speckled)for(let i=0;i<7;i++)g.lineStyle(.6,0x53675c).lineBetween(-6+(i*3)%12,-11+(i*5)%7,-4+(i*3)%12,-10+(i*5)%7);
 const hx=7*look,hy=-16+peck;g.fillStyle(base).fillEllipse(hx,hy,9,10);g.fillStyle(light).fillEllipse(hx-look,hy-1,5,6);g.fillStyle(0xb15a49).fillCircle(hx-2*look,hy-5,1.5).fillCircle(hx,hy-6,1.7).fillCircle(hx+2*look,hy-5,1.4).fillEllipse(hx+look,hy+4,2,3);g.fillStyle(0xc6aa61).fillTriangle(hx+4*look,hy,hx+8*look,hy+1,hx+4*look,hy+2);g.fillStyle(0x293d30).fillCircle(hx+look*1.7,hy-1.2,1);g.fillStyle(0xffffe1).fillCircle(hx+look*1.5,hy-1.5,.3);
 if(activity==='dust'){g.fillStyle(0xc8b58d,.5);for(let i=0;i<4;i++)g.fillCircle(Math.sin(time*3+i)*13,-3-Math.abs(Math.cos(time*2+i))*8,1.2);}
 if(activity==='rest')g.fillStyle(base).fillEllipse(0,-5,17,9);
}
export function drawAnimalFence(g:Phaser.GameObjects.Graphics,pen:Pick<AnimalPen,'boundary'|'gate'>,gateOpen=false,edge?:number){
 g.clear();const points=pen.boundary;if(!points.length)return;
 for(let i=0;i<points.length;i++){if(edge!==undefined&&i!==edge)continue;const a=points[i],b=points[(i+1)%points.length],length=Math.hypot(b.x-a.x,b.y-a.y),dx=(b.x-a.x)/length,dy=(b.y-a.y)/length,n=Math.max(1,Math.ceil(length/34));
  const rail=(from:number,to:number)=>{for(const h of [9,20]){g.lineStyle(3.5,0x70573c).lineBetween(a.x+dx*from,a.y+dy*from-h,b.x-dx*(length-to),b.y-dy*(length-to)-h);g.lineStyle(1,0xc3a170).lineBetween(a.x+dx*from,a.y+dy*from-h-1,b.x-dx*(length-to),b.y-dy*(length-to)-h-1);}};
  if(i===pen.gate){rail(0,Math.max(0,length/2-18));rail(Math.min(length,length/2+18),length);if(!gateOpen){rail(length/2-18,length/2+18);g.lineStyle(1.5,0xa88b5c).lineBetween(a.x+dx*(length/2-17),a.y+dy*(length/2-17)-8,a.x+dx*(length/2+17),a.y+dy*(length/2+17)-22);}}
  else rail(0,length);
  for(let j=0;j<=n;j++){const d=length*j/n;if(i===pen.gate&&Math.abs(d-length/2)<16)continue;const x=a.x+dx*d,y=a.y+dy*d;g.fillStyle(0x70573c).fillRect(x-2.5,y-26,5,28);g.fillStyle(0xb28d5b).fillRect(x-2,y-25,2,24);g.fillStyle(0xd3b078).fillRect(x-3,y-27,6,2);}
 }
}
