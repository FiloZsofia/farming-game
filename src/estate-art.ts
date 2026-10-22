import Phaser from 'phaser';
import {type Estate} from './estate';
export function drawEstate(scene:Phaser.Scene,estate:Estate,day:number){
 const g=scene.add.graphics().setDepth(2);
 for(const t of estate.trees){const grown=day-t.planted>=15,s=grown?1:.45+Math.min(15,day-t.planted)/30,x=t.x,y=t.y;
  g.fillStyle(0x345737,.25).fillEllipse(x+7,y+5,61*s,22*s);g.lineStyle(7*s,0x785738).lineBetween(x,y,x,y-49*s);g.lineStyle(3*s,0x96714b).lineBetween(x-1,y,x-1,y-48*s);
  for(const [dx,dy]of [[-13,-43],[12,-49],[0,-64]]){g.fillStyle(0x3d693f).fillEllipse(x+dx*s,y+dy*s,46*s,37*s);g.fillStyle(0x74964d).fillEllipse(x+(dx-4)*s,y+(dy-5)*s,35*s,26*s);}
  if(t.fruit)for(let i=0;i<t.fruit;i++){const xx=x+Math.cos(i*2.4)*19,yy=y-48+Math.sin(i*2.4)*14;g.fillStyle(t.kind==='cherry'?0xb94f49:t.kind==='plum'?0x776187:t.kind==='apple'?0xcf9450:0xc1b566).fillEllipse(xx,yy,6,t.kind==='pear'?9:6);g.lineStyle(1,0x65583a).lineBetween(xx,yy-3,xx+1,yy-6);}
 }
 for(const p of estate.pond){if(p.kind==='lily'){
   for(const [dx,dy,r]of [[-8,3,14],[10,6,12]]){g.fillStyle(0x3c7651).fillEllipse(p.x+dx,p.y+dy,r*2,r);g.fillStyle(0x88aa5b).fillEllipse(p.x+dx-2,p.y+dy-2,r*1.7,r*.7);g.lineStyle(.8,0xb2c580).lineBetween(p.x+dx,p.y+dy,p.x+dx+r*.6,p.y+dy-2);g.fillStyle(0x397f87).fillTriangle(p.x+dx,p.y+dy,p.x+dx+r,p.y+dy-4,p.x+dx+r,p.y+dy+2);}
   for(let i=0;i<8;i++){const a=i*Math.PI/4;g.fillStyle(i%2?0xe5aeb8:0xf5d7d4).fillEllipse(p.x+Math.cos(a)*7,p.y-5+Math.sin(a)*3.5,10,5);}
   g.fillStyle(0xffeee0).fillEllipse(p.x,p.y-8,9,9);g.fillStyle(0xe5bd55).fillEllipse(p.x,p.y-5,6,4);
  }
  else if(p.kind==='reed'){for(let i=0;i<7;i++){const x=p.x+(i-3)*3;g.lineStyle(2,0x6e8d43).lineBetween(x,p.y,x+(i-3)*2,p.y-21-i%3*7);g.lineStyle(3,0x816440).lineBetween(x+(i-3)*2,p.y-21-i%3*7,x+(i-3)*2,p.y-29-i%3*7);}}
  else{g.fillStyle(0x8e734a).fillEllipse(p.x,p.y,33,20);g.fillStyle(0xc6a474).fillEllipse(p.x,p.y-3,30,17);g.fillStyle(0x6e6446).fillEllipse(p.x,p.y-4,20,10);if(estate.duckArrivalDay!==null&&!estate.duckArrivalPending){drawDuck(g,p.x+23,p.y+8,true);drawDuck(g,p.x-20,p.y+13,false);}}
 }
 if(estate.eggs||Object.values(estate.roe).some(n=>n>0)){g.fillStyle(0xf0d9a0).fillCircle(500,425,6);g.lineStyle(1,0x7c754a).strokeCircle(500,425,7);}
 return g;
}

export function drawDuck(g:Phaser.GameObjects.Graphics,x:number,y:number,male:boolean,wing=0){
 g.fillStyle(0x334f43,.18).fillEllipse(x+2,y+4,24,7);g.fillStyle(male?0xb6b29b:0x9b8059).fillEllipse(x,y-2,23,13);g.fillStyle(male?0x647f77:0xc0a074).fillEllipse(x-2,y-4,15,8);g.fillStyle(male?0x426b51:0x92724d).fillCircle(x+9,y-10,5);g.fillStyle(0xe4c176).fillTriangle(x+13,y-11,x+20,y-9,x+13,y-7);g.fillStyle(0x273e32).fillCircle(x+10,y-11,1);if(male)g.lineStyle(1,0xe4dac0).lineBetween(x+6,y-6,x+12,y-6);if(wing)g.lineStyle(3,0x8d9b85).lineBetween(x,y-5,x-10,y-5-wing);
}
