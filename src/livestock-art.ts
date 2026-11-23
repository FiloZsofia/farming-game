import Phaser from 'phaser';
import {animalItemNames,type AnimalItem,type AnimalPen,type HenVariety} from './livestock';
import {gatePoint} from './livestock-geometry';
export function drawAnimalItem(g:Phaser.GameObjects.Graphics,item:Exclude<AnimalItem,'paddock'>,x=0,y=0,day=1,pen?:AnimalPen,rotation=0,fillProgress=1,waterSource?:{x:number;y:number}){
 const rect=(xx:number,yy:number,w:number,h:number,c:number)=>g.fillStyle(c).fillRoundedRect(x+xx,y+yy,w,h,.8);
 const line=(xx:number,yy:number,xxx:number,yyy:number,c:number,w=1)=>g.lineStyle(w,c).lineBetween(x+xx,y+yy,x+xxx,y+yyy);
 const oval=(xx:number,yy:number,w:number,h:number,c:number,a=1)=>g.fillStyle(c,a).fillEllipse(x+xx,y+yy,w,h);
 if(item==='coop'){
  const dirty=!!pen&&day-pen.cleanedDay>=3;
  if(dirty){oval(-5,17,98,34,0x817451,.45);oval(30,21,43,21,0xb29a6d,.5);oval(-37,15,32,19,0xa58d60,.6);for(let i=0;i<36;i++){const xx=-48+(i*17)%96,yy=6+(i*11)%28;oval(xx,yy,2+i%3,1,0x665d40,.65);if(i%4===0){line(xx-2,yy,xx+2,yy-2,0xc4ae77,.8);line(xx,yy,xx+3,yy+1,0x7a8447,.9);}}for(const [xx,yy]of [[-40,25],[39,17],[-8,31]]){oval(xx,yy,7,3,0x675c3d);for(let j=0;j<4;j++)line(xx-3+j*2,yy,xx-5+j*3,yy-3-j%2*2,0x889450,.8);}}
  oval(3,5,98,24,0x374d33,.2);rect(-35,-43,70,46,0xb89d70);rect(-35,-8,70,10,0x81735a);
  for(let yy=-38;yy<-9;yy+=7){line(-33,yy,33,yy,0x806b4e,.8);line(-33,yy+1,33,yy+1,0xd0b78a,.6);for(let xx=-29;xx<30;xx+=19){line(xx,yy+3,xx+10,yy+3,0xa78b61,.4);oval(xx+3,yy+4,2.5,.8,0x90744f);}}
  for(const xx of [-34,31]){rect(xx,-40,3,42,0x75654c);line(xx+1,-39,xx+1,-2,0xd6bb8b,.8);}

  g.fillStyle(0x4b5c50).fillPoints([{x:x-44,y:y-41},{x:x-24,y:y-65},{x:x+23,y:y-65},{x:x+44,y:y-41}],true);g.fillStyle(0x788777).fillPoints([{x:x-42,y:y-43},{x:x-23,y:y-63},{x:x+22,y:y-63},{x:x+41,y:y-43}],true);
  for(let yy=-59;yy<-43;yy+=5)line(-25-(yy+60)*.8,yy,25+(yy+60)*.8,yy,0x9ba18a,.6);line(-42,-41,43,-41,0x394c42,2);for(let row=0;row<4;row++)for(let col=0;col<6;col++){const xx=-22-row*4+col*(8+row),yy=-60+row*5;line(xx,yy,xx-2,yy+4,0x4e6256,.7);}line(-23,-64,23,-64,0xb0b29a,1.5);rect(-42,-41,85,3,0x556452);line(-40,-38,40,-38,0xc0b38a,.8);
  rect(-30,-35,20,17,0x68573e);rect(-28,-33,16,12,0xbcc8ad);line(-20,-33,-20,-20,0xeee0b5,1.5);line(-28,-27,-12,-27,0xeee0b5,1.5);
  rect(1,-30,27,33,0xc6ad7e);line(2,-29,27,-29,0xe0c899,1);rect(3,-28,23,31,0x544835);rect(6,-26,17,29,0x374333);rect(7,-24,14,27,0x273a2c);line(4,-27,25,-27,0xd7bf92,1.5);
  rect(-32,-12,22,14,0x8c704b);oval(-21,-11,21,6,0xd3ba7f);for(let i=0;i<7;i++)line(-30+i*3,-11,-27+i*3,-7,0xa48e5a,.6);
  for(let i=0;i<Math.min(5,pen?.eggs??0);i++){oval(-27+i*3,-10+(i%2)*2,3.5,5,0xe9d7ad);}
  g.fillStyle(0x9c8459).fillPoints([{x:x+5,y:y+1},{x:x+23,y:y+1},{x:x+31,y:y+9},{x:x+10,y:y+9}],true);for(let i=0;i<4;i++){line(7+i*2,2+i*2,24+i*2,2+i*2,0x6e5a3d,1.4);line(7+i*2,1+i*2,24+i*2,1+i*2,0xdbc08f,.7);}line(8,2,12,8,0xbda16e,.8);
  if(pen&&day-pen.cleanedDay>=3){for(let i=0;i<13;i++){const xx=-31+(i*19)%61,yy=-5+(i*7)%15;oval(xx,yy,3+i%3,1.8,0x665c40,.75);if(i%3===0)line(xx-2,yy-1,xx+2,yy+1,0xb3a074,.8);}rect(-33,-7,18,3,0x776345);}
 }else if(item==='feeder'){
  const filled=!!pen&&pen.feed>0,level=filled?fillProgress:0;
  oval(1,8,37,12,0x354a34,.24);for(const xx of [-11,11]){rect(xx-2,2,4,7,0x68563c);line(xx-1,3,xx-1,8,0xb59a66,.8);}
  rect(-14,-5,28,11,0x927450);oval(0,-4,32,12,0xb49b6c);oval(0,-5,27,8,0x5e5038);
  for(let xx=-11;xx<=11;xx+=5){line(xx,-1,xx,4,0x715b3f,.8);line(xx+1,0,xx+1,4,0xc6a573,.7);}line(-13,4,13,4,0xc7a872,1);
  const kernels=[[-10,-6],[-6,-7],[-2,-6],[2,-7],[6,-6],[10,-5],[-8,-4],[-4,-4],[0,-4],[4,-4],[8,-3],[-6,-2],[-2,-2],[2,-2],[6,-2]];
  for(let i=0;i<Math.floor(kernels.length*level);i++){const [xx,yy]=kernels[i];g.fillStyle(0x96713b).fillRoundedRect(x+xx-1.6,y+yy-1,3.2,2.5,.8);g.fillStyle(i%3?0xdcb550:0xe8c76a).fillRoundedRect(x+xx-1.3,y+yy-1.2,2.6,2,.6);oval(xx-.4,yy-.6,1,.6,0xf8dfa0);line(xx+.5,yy-.3,xx+.5,yy+.5,0xbe933d,.35);}
  g.lineStyle(1.1,0xe0c18c).strokeEllipse(x,y-5,31,11);for(const xx of [-14,14]){rect(xx-1,-3,2,7,0x68776b);oval(xx,-1,1,1,0xd3d1b2);}
  if(filled&&fillProgress<1)for(let i=0;i<8;i++){const t=(fillProgress*3+i/8)%1;oval(-9+i*2.5,-24+t*18,2,2.7,0xe7c362);}
 }else if(item==='drinker'){
  const wet=pen?.wateredDay===day,level=wet?fillProgress:0;
  oval(0,7,29,11,0x5d776b);oval(0,5,25,8,0x687c68);if(level>0){oval(0,5,24*level,7*level,0x81b7b4);g.lineStyle(.8,0xd5e4cc,.8).strokeEllipse(x-1,y+4,17*level,4*level);}
  rect(-7,-17,14,21,0xa7b5a2);oval(0,-17,14,5,0xd3d8bd);line(-4,-14,-4,-3,0xe0e3ca,1.5);line(6,-14,6,1,0x6f8a7a,.6);
  if(wet&&fillProgress<1&&waterSource){const sx=waterSource.x,sy=waterSource.y;for(let i=0;i<10;i++){const t=i/10,u=(i+1)/10;line(sx*(1-t),sy*(1-t)+5*t-6*Math.sin(t*Math.PI),sx*(1-u),sy*(1-u)+5*u-6*Math.sin(u*Math.PI),i%2?0xc9e7df:0x81bdbd,1.3);}for(let i=0;i<4;i++)oval(-9+i*5,3-Math.sin(fillProgress*15+i)*2,1.4,1,0xe0ebd5);}
 }else if(item==='dustBath'){
  const w=rotation?30:48,h=rotation?46:23;oval(1,7,w+3,h+2,0x3d4e35,.2);oval(0,5,w,h,0x77664c);oval(0,3,w-2,h-2,0xab9267);oval(-1,2,w-7,h-6,0x746447);oval(-1,1,w-10,h-9,0xc6ad7c);oval(-3,0,w-16,h-12,0xdbc499);oval(4,3,w-23,h-15,0xb29a6d,.7);
  for(let i=0;i<25;i++){const xx=Math.sin(i*7)*(w/2-8),yy=Math.cos(i*11)*(h/2-6);oval(xx,yy,1.4,.8,i%3?0x9d875e:0xeee0b8,.8);}
  for(let i=0;i<4;i++){const xx=-w/4+i*w/8,yy=rotation?-7+i*5:0;line(xx-2,yy,xx+2,yy+2,0x9b8257,.7);line(xx-2,yy+2,xx+2,yy+4,0xe0c797,.7);}g.lineStyle(1,0xceba90).strokeEllipse(x,y+3,w-1,h-2);
 }else if(item==='perch'){
  const beam=(ax:number,ay:number,bx:number,by:number,width:number)=>{line(ax,ay,bx,by,0x5e503b,width+1);line(ax-.35,ay-.5,bx-.35,by-.5,0xa38960,width);line(ax-.8,ay-1,bx-.8,by-1,0xd0b88b,.8);line(ax+.8,ay+.5,bx+.8,by+.5,0x806744,.6);};
  const ends=rotation?[{x:-9,y:-40},{x:10,y:-10}]:[{x:-23,y:-25},{x:23,y:-25}];
  oval(1,6,rotation?27:50,rotation?42:13,0x344a33,.22);
  for(const p of ends){const foot={x:p.x*.92,y:p.y+30};beam(foot.x,foot.y,p.x,p.y,3.6);beam(foot.x+6,foot.y,p.x,p.y+7,2.8);beam(foot.x-4,foot.y,foot.x+8,foot.y,2.4);oval(p.x,p.y+5,2,2,0x59665b);oval(p.x-.3,p.y+4.6,.7,.7,0xd4cbb0);}
  beam(ends[0].x,ends[0].y+13,ends[1].x,ends[1].y+13,2.5);beam(ends[0].x,ends[0].y,ends[1].x,ends[1].y,4.6);
  for(let i=0;i<5;i++){const t=(i+.4)/5,xx=ends[0].x+(ends[1].x-ends[0].x)*t,yy=ends[0].y+(ends[1].y-ends[0].y)*t;line(xx-1,yy+.5,xx+1.2,yy+.8,0x806847,.5);}
  for(const p of ends){oval(p.x,p.y,3.4,4.4,0xc9ad7d);g.lineStyle(.5,0x92734d).strokeEllipse(x+p.x,y+p.y,1.8,2.8);}
 }else{
  oval(2,8,67,28,0x304a36,.3);oval(-2,4,51,19,0x3a5138,.16);for(const xx of [-28,28]){rect(xx-2,-36,4,43,0x69543c);line(xx-1,-35,xx-1,6,0xc4a578,1);line(xx,7,xx+4,8,0x516044,2);line(xx,-20,xx+(xx<0?10:-10),-34,0x94794f,2);}
  g.fillStyle(0x3b5549).fillPoints([{x:x-35,y:y-35},{x:x-24,y:y-47},{x:x+24,y:y-47},{x:x+35,y:y-35}],true);g.fillStyle(0x78917b).fillPoints([{x:x-32,y:y-36},{x:x-23,y:y-45},{x:x+23,y:y-45},{x:x+32,y:y-36}],true);
  for(let xx=-24;xx<30;xx+=8){line(xx,-44,xx+7,-36,0xa9b89a,.8);line(xx+1,-44,xx+8,-36,0x536e5c,.7);}line(-23,-46,23,-46,0xc0c7a7,1);rect(-35,-35,70,4,0x596e59);line(-34,-35,34,-35,0xb5bea0,1);line(-27,-30,27,-30,0x9e865d,2);for(const xx of [-27,27])oval(xx,-31,1.5,1.5,0xd1c39a);

 }
}
export function drawHen(g:Phaser.GameObjects.Graphics,variety:HenVariety,time:number,activity='stand',look=1){
 g.clear();const white=variety==='cream',speckled=variety==='speckled',base=white?0xe5dcc0:speckled?0x939f90:0xb67e50,shade=white?0xb4ae91:speckled?0x596b61:0x805538,light=white?0xf4edcf:speckled?0xc0c7b0:0xd8a66c;
 const walking=activity==='walk',peck=activity==='peck'?Math.max(0,Math.sin(time*5))*5:0,step=walking?Math.sin(time*13)*2:0;
 const bob=walking?Math.abs(Math.sin(time*6.5))*.6:Math.sin(time*1.8)*.15;
 g.fillStyle(0x354a31,.18).fillEllipse(0,0,17,5);g.lineStyle(1.1,0xb29959).lineBetween(-3,-3,-3+step,1).lineBetween(3,-3,3-step,1);g.lineStyle(.75,0x9c844d).lineBetween(-5+step,1,-1+step,1).lineBetween(1-step,1,5-step,1);
 // A soft, rounded silhouette with three short tail feathers and a tucked wing.
 for(let i=0;i<3;i++){g.fillStyle(i===1?light:shade).fillEllipse((-7-i*.7)*look,-11-i*1.8+bob,4,7-i);}
 g.fillStyle(shade).fillEllipse(0,-8+bob,19,14);g.fillStyle(base).fillEllipse(-.5,-9+bob,18,13);g.fillStyle(light,.7).fillEllipse(-1,-10+bob,12,9);
 g.fillStyle(base).fillEllipse(-2*look,-7.5+bob,11,8);g.lineStyle(.6,shade,.65).beginPath().arc(-2*look,-8+bob,4.3,.15,Math.PI*.85).strokePath();for(let i=0;i<3;i++)g.lineStyle(.45,shade,.45).lineBetween((-4+i*2)*look,-7+bob,(-3+i*2)*look,-5.5+bob);
 if(speckled)for(let i=0;i<7;i++){g.fillStyle(i%2?light:shade,.8).fillEllipse(-6+(i*3)%12,-12+(i*5)%8+bob,1.4,1);}
 const hx=5.7*look,hy=-16+peck+bob;g.fillStyle(shade).fillEllipse(hx,hy+1,10,11);g.fillStyle(base).fillEllipse(hx-.3*look,hy,10.5,11);g.fillStyle(light,.8).fillEllipse(hx-.6*look,hy+.3,8,8);
 g.fillStyle(0xb9604f).fillCircle(hx-2*look,hy-5,1.5).fillCircle(hx,hy-6,1.9).fillCircle(hx+2*look,hy-5,1.5).fillEllipse(hx+look,hy+4,2,2.5);g.fillStyle(0xd6866c,.6).fillCircle(hx-.5*look,hy-6.4,.8);
 g.fillStyle(0xa87c3d).fillTriangle(hx+3.7*look,hy+.3,hx+7*look,hy+1.3,hx+3.7*look,hy+2.5);g.fillStyle(0xe2bb65).fillTriangle(hx+3.6*look,hy,hx+6.6*look,hy+1,hx+3.6*look,hy+1.4);
 const eyeX=hx+1.5*look,eyeY=hy-.6,blink=activity==='rest'||Math.sin(time*.8)>.996;
 if(blink)g.lineStyle(.8,0x3d4333).lineBetween(eyeX-1,eyeY,eyeX+1,eyeY);else{g.fillStyle(0x765840,.4).fillEllipse(eyeX,eyeY,3.1,3.2);g.fillStyle(0x293d30).fillEllipse(eyeX,eyeY,2.3,2.7);g.fillStyle(0xfff4d7).fillCircle(eyeX-.35,eyeY-.6,.65);}
 g.fillStyle(0xd79070,.35).fillEllipse(hx-.5*look,hy+2,2.5,1.5);
 if(activity==='dust'){g.fillStyle(0xc8b58d,.5);for(let i=0;i<4;i++)g.fillCircle(Math.sin(time*3+i)*13,-3-Math.abs(Math.cos(time*2+i))*8,1.2);}
 if(activity==='rest')g.fillStyle(base).fillEllipse(0,-5,17,9);
}
export function drawAnimalFence(g:Phaser.GameObjects.Graphics,pen:Pick<AnimalPen,'boundary'|'gate'|'coopWall'>,gateOpen:boolean|number=false,edge?:number,preview?:{color:number;closed?:boolean}){
 g.clear();const points=pen.boundary,dark=preview?.color??0x70573c,light=preview?.color??0xc3a170,brace=preview?.color??0xa88b5c,post=preview?.color??0xb28d5b,cap=preview?.color??0xd3b078;if(!points.length)return;
 const wood=(ax:number,ay:number,bx:number,by:number,w=3.5)=>{g.lineStyle(w,dark).lineBetween(ax,ay,bx,by);g.lineStyle(w-1,post).lineBetween(ax,ay-.3,bx,by-.3);g.lineStyle(.7,light).lineBetween(ax,ay-1.1,bx,by-1.1);if(!preview){g.lineStyle(.45,brace).lineBetween(ax,ay+.7,bx,by+.7);const span=Math.hypot(bx-ax,by-ay);for(let d=13;d<span-5;d+=27){const t=d/span,xx=ax+(bx-ax)*t,yy=ay+(by-ay)*t;g.lineStyle(.45,0x846b4c).strokeEllipse(xx,yy,2.8,1);}}};
 const upright=(xx:number,yy:number)=>{if(!preview){g.fillStyle(0x344b34,.16).fillEllipse(xx+3,yy+2,11,4);}g.fillStyle(dark).fillRect(xx-2.5,yy-26,5,28);g.fillStyle(post).fillRect(xx-1.8,yy-25,3,26);g.lineStyle(.65,light).lineBetween(xx-1.5,yy-24,xx-1.5,yy);g.fillStyle(cap).fillPoints([{x:xx-3,y:yy-25},{x:xx-2,y:yy-28},{x:xx+2,y:yy-28},{x:xx+3,y:yy-25}],true);if(!preview){g.lineStyle(.5,0x876c49).lineBetween(xx+.5,yy-22,xx+.9,yy-12);for(const h of [9,20]){g.fillStyle(0x576056).fillCircle(xx+.2,yy-h,.7);g.fillStyle(0xd4c7a5).fillCircle(xx,yy-h-.2,.25);}}};
 for(let i=0;i<points.length-(preview?.closed===false?1:0);i++){if(i===pen.coopWall||edge!==undefined&&i!==edge)continue;const a=points[i],b=points[(i+1)%points.length],length=Math.hypot(b.x-a.x,b.y-a.y),dx=(b.x-a.x)/length,dy=(b.y-a.y)/length,n=Math.max(1,Math.ceil(length/34));if(length<.001)continue;
  const rail=(from:number,to:number)=>{if(to<=from)return;for(const h of [9,20])wood(a.x+dx*from,a.y+dy*from-h,a.x+dx*to,a.y+dy*to-h);};
  if(i===pen.gate){rail(0,Math.max(0,length/2-18));rail(Math.min(length,length/2+18),length);const t=typeof gateOpen==='number'?gateOpen:gateOpen?1:0,hinge={x:a.x+dx*(length/2-18),y:a.y+dy*(length/2-18)},angle=t*Math.PI*.46,ux=dx*Math.cos(angle)-dy*Math.sin(angle),uy=dy*Math.cos(angle)+dx*Math.sin(angle);
   for(const h of [9,20])wood(hinge.x,hinge.y-h,hinge.x+ux*36,hinge.y+uy*36-h);wood(hinge.x,hinge.y-8,hinge.x+ux*36,hinge.y+uy*36-22,2.3);
   for(const d of [0,36])wood(hinge.x+ux*d,hinge.y+uy*d-24,hinge.x+ux*d,hinge.y+uy*d-5,3);for(const d of [length/2-19,length/2+19])upright(a.x+dx*d,a.y+dy*d);
   if(!preview){for(const h of [9,20]){g.lineStyle(1.4,0x52635b).lineBetween(hinge.x-ux*2,hinge.y-h,hinge.x+ux*3,hinge.y+uy*3-h);}g.lineStyle(1.2,0x52635b).lineBetween(hinge.x+ux*31,hinge.y+uy*31-18,hinge.x+ux*35,hinge.y+uy*35-18);}}


  else rail(0,length);
  for(let j=0;j<=n;j++){const d=length*j/n;if(i===pen.gate&&Math.abs(d-length/2)<23)continue;upright(a.x+dx*d,a.y+dy*d);}

 }
}
