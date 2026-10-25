import {drawRipeMarker} from './crop-art';
import Phaser from 'phaser';
import {reedReady,type Estate} from './estate';
export function drawEstate(scene:Phaser.Scene,estate:Estate,day:number){
 const g=scene.add.graphics().setDepth(2);
 for(const t of estate.trees){const grown=day-t.planted>=15,s=grown?1:.45+Math.min(15,day-t.planted)/30,x=t.x,y=t.y;
  g.fillStyle(0x345737,.25).fillEllipse(x+7,y+5,61*s,22*s);g.lineStyle(7*s,0x785738).lineBetween(x,y,x,y-49*s);g.lineStyle(3*s,0x96714b).lineBetween(x-1,y,x-1,y-48*s);
  for(const [dx,dy]of [[-13,-43],[12,-49],[0,-64]]){g.fillStyle(0x3d693f).fillEllipse(x+dx*s,y+dy*s,46*s,37*s);g.fillStyle(0x74964d).fillEllipse(x+(dx-4)*s,y+(dy-5)*s,35*s,26*s);}
  if(t.fruit)for(let i=0;i<t.fruit;i++){const xx=x+Math.cos(i*2.4)*19,yy=y-48+Math.sin(i*2.4)*14;g.fillStyle(t.kind==='cherry'?0xb94f49:t.kind==='plum'?0x776187:t.kind==='apple'?0xcf9450:0xc1b566).fillEllipse(xx,yy,6,t.kind==='pear'?9:6);g.lineStyle(1,0x65583a).lineBetween(xx,yy-3,xx+1,yy-6);}
  if(t.fruit)drawRipeMarker(g,x+25*s,y-65*s);
 }
 for(const p of estate.pond){if(p.kind==='lily'){
   for(const [dx,dy,r]of [[-8,3,14],[10,6,12]]){g.fillStyle(0x3c7651).fillEllipse(p.x+dx,p.y+dy,r*2,r);g.fillStyle(0x88aa5b).fillEllipse(p.x+dx-2,p.y+dy-2,r*1.7,r*.7);g.lineStyle(.8,0xb2c580).lineBetween(p.x+dx,p.y+dy,p.x+dx+r*.6,p.y+dy-2);g.fillStyle(0x397f87).fillTriangle(p.x+dx,p.y+dy,p.x+dx+r,p.y+dy-4,p.x+dx+r,p.y+dy+2);}
   for(let i=0;i<8;i++){const a=i*Math.PI/4;g.fillStyle(i%2?0xe5aeb8:0xf5d7d4).fillEllipse(p.x+Math.cos(a)*7,p.y-5+Math.sin(a)*3.5,10,5);}
   g.fillStyle(0xffeee0).fillEllipse(p.x,p.y-8,9,9);g.fillStyle(0xe5bd55).fillEllipse(p.x,p.y-5,6,4);
  }
  else if(p.kind==='reed'){
   const growth=Math.min(1,Math.max(0,(day-(p.lastHarvest??p.day))/3)),shoots=7+Math.min(5,Math.floor((day-p.day)/3));
   g.fillStyle(0x416f53,.4).fillEllipse(p.x,p.y+2,25,8);for(let i=0;i<shoots;i++){const offset=i<7?(i-3)*3:(i%2?-1:1)*(12+(i-7)*2),x=p.x+offset,s=i<7?.32+growth*.68:.3+growth*.36,h=(21+i%3*7)*s,lean=offset*.55;g.lineStyle(i<7?2:1.4,i<7?0x6e8d43:0x91ac60).lineBetween(x,p.y,x+lean,p.y-h);g.lineStyle(1,0xa4b877).lineBetween(x,p.y-3,x+lean-4,p.y-h*.7);if(i<7&&growth>=.8)g.lineStyle(3,0x816440).lineBetween(x+lean,p.y-h,x+lean,p.y-h-8);}
   if(reedReady(p,day))drawRipeMarker(g,p.x+16,p.y-40);
  }
  else{g.fillStyle(0x8e734a).fillEllipse(p.x,p.y,33,20);g.fillStyle(0xc6a474).fillEllipse(p.x,p.y-3,30,17);g.fillStyle(0x6e6446).fillEllipse(p.x,p.y-4,20,10);}
 }
 // Spawn clings to submerged vegetation in the shallows, rather than a marker on land.
 if(Object.values(estate.roe).some(n=>n>0)){
  const x=526,y=443;
  g.fillStyle(0x245d58,.25).fillEllipse(x+1,y+4,25,10);
  g.lineStyle(2,0x718e54,.9).beginPath().moveTo(x-12,y+5).lineTo(x-3,y+1).lineTo(x+11,y-3).strokePath();
  for(const [dx,dy]of [[-8,-2],[-3,-5],[3,-5],[8,-2],[-7,3],[-2,0],[4,0],[9,3],[-2,5],[4,5]]){
   g.fillStyle(0xd1b878,.72).fillCircle(x+dx,y+dy,2.8);g.lineStyle(.7,0xf2e4b9,.9).strokeCircle(x+dx,y+dy,2.8);g.fillStyle(0x897044,.9).fillCircle(x+dx+.3,y+dy+.5,1);g.fillStyle(0xfff5d4,.95).fillCircle(x+dx-.9,y+dy-1,.7);
  }
  g.lineStyle(.7,0xafd4c5,.65).lineBetween(x-15,y+8,x-7,y+8).lineBetween(x+10,y+6,x+17,y+6);
 }
 const nest=estate.pond.find(p=>p.kind==='duckNest');
 if(estate.eggs&&nest)for(let i=0;i<Math.min(4,estate.eggs);i++){const x=nest.x-6+(i%2)*9,y=nest.y-5+Math.floor(i/2)*4;g.fillStyle(0x665c40,.35).fillEllipse(x+1,y+2,7,4);g.fillStyle(0xe6dfb9).fillEllipse(x,y,6,8);g.fillStyle(0xfff0d1).fillEllipse(x-1,y-1.5,2,3);}

 return g;
}

export function drawDuck(g:Phaser.GameObjects.Graphics,x:number,y:number,male:boolean,wing=0){
 g.fillStyle(0x334f43,.18).fillEllipse(x+2,y+4,24,7);g.fillStyle(male?0xb6b29b:0x9b8059).fillEllipse(x,y-2,23,13);g.fillStyle(male?0x647f77:0xc0a074).fillEllipse(x-2,y-4,15,8);g.fillStyle(male?0x426b51:0x92724d).fillCircle(x+9,y-10,5);g.fillStyle(0xe4c176).fillTriangle(x+13,y-11,x+20,y-9,x+13,y-7);g.fillStyle(0x273e32).fillCircle(x+10,y-11,1);if(male)g.lineStyle(1,0xe4dac0).lineBetween(x+6,y-6,x+12,y-6);g.fillStyle(0xf4e3b7).fillCircle(x+10.3,y-11.4,.35);g.lineStyle(.8,male?0x466b75:0x70563b).lineBetween(x-7,y-4,x+2,y-1);if(!male)for(let i=0;i<4;i++)g.lineStyle(.7,0x70563f).lineBetween(x-7+i*3,y-4,x-5+i*3,y-2);g.fillStyle(0x444e42).fillTriangle(x-10,y-4,x-17,y-6,x-12,y);if(wing)g.lineStyle(3,0x8d9b85).lineBetween(x,y-5,x-10,y-5-wing);
}
