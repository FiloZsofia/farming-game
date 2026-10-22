import Phaser from 'phaser';
import {trees,type Estate} from './estate';
export function drawEstate(scene:Phaser.Scene,estate:Estate,day:number){
 const g=scene.add.graphics().setDepth(2);
 for(const t of estate.trees){const grown=day-t.planted>=15,s=grown?1:.45+Math.min(15,day-t.planted)/30,x=t.x,y=t.y;
  g.fillStyle(0x345737,.25).fillEllipse(x+7,y+5,61*s,22*s);g.lineStyle(7*s,0x785738).lineBetween(x,y,x,y-49*s);g.lineStyle(3*s,0x96714b).lineBetween(x-1,y,x-1,y-48*s);
  for(const [dx,dy]of [[-13,-43],[12,-49],[0,-64]]){g.fillStyle(0x3d693f).fillEllipse(x+dx*s,y+dy*s,46*s,37*s);g.fillStyle(0x74964d).fillEllipse(x+(dx-4)*s,y+(dy-5)*s,35*s,26*s);}
  if(t.fruit)for(let i=0;i<t.fruit;i++){const xx=x+Math.cos(i*2.4)*19,yy=y-48+Math.sin(i*2.4)*14;g.fillStyle(t.kind==='cherry'?0xb94f49:t.kind==='plum'?0x776187:t.kind==='apple'?0xcf9450:0xc1b566).fillEllipse(xx,yy,6,t.kind==='pear'?9:6);g.lineStyle(1,0x65583a).lineBetween(xx,yy-3,xx+1,yy-6);}
 }
 for(const p of estate.pond){if(p.kind==='lily'){g.fillStyle(0x668f4a).fillEllipse(p.x,p.y,26,13);for(let i=0;i<6;i++)g.fillStyle(0xf0c6c0).fillEllipse(p.x+Math.cos(i)*4,p.y-3+Math.sin(i)*2,7,4);g.fillStyle(0xe7cb76).fillCircle(p.x,p.y-3,2);}
  else if(p.kind==='reed'){for(let i=0;i<7;i++){const x=p.x+(i-3)*3;g.lineStyle(2,0x6e8d43).lineBetween(x,p.y,x+(i-3)*2,p.y-21-i%3*7);g.lineStyle(3,0x816440).lineBetween(x+(i-3)*2,p.y-21-i%3*7,x+(i-3)*2,p.y-29-i%3*7);}}
  else{g.fillStyle(0x8e734a).fillEllipse(p.x,p.y,33,20);g.fillStyle(0xc6a474).fillEllipse(p.x,p.y-3,30,17);g.fillStyle(0x6e6446).fillEllipse(p.x,p.y-4,20,10);g.fillStyle(0xb9ad81).fillEllipse(p.x+18,p.y-8,21,12);g.fillStyle(0x53725c).fillCircle(p.x+26,p.y-16,5);g.fillStyle(0xd8bd76).fillTriangle(p.x+30,p.y-17,p.x+36,p.y-15,p.x+30,p.y-13);}
 }
 const count=Math.min(12,estate.fish.goldfish+estate.fish.carp);
 for(let i=0;i<count;i++){const x=576+(i%4)*32,y=437+Math.floor(i/4)*24;g.fillStyle(i<estate.fish.goldfish?0xd6a25a:0xa5b4a0,.8).fillEllipse(x,y,13,5).fillTriangle(x+5,y,x+10,y-4,x+10,y+4);}
 if(estate.eggs||Object.values(estate.roe).some(n=>n>0)){g.fillStyle(0xf0d9a0).fillCircle(500,425,6);g.lineStyle(1,0x7c754a).strokeCircle(500,425,7);}
 return g;
}
