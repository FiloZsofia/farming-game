import type Phaser from 'phaser';
import {drawPathNetwork} from './path-art';
import type {GardenPathPiece} from './garden-path';
const noise=(id:number,salt:number)=>{const v=Math.sin(id*91.37+salt*17.83)*43758.5453;return v-Math.floor(v);};
export function paintGardenPaths(g:Phaser.GameObjects.Graphics,pieces:readonly GardenPathPiece[],preview?:number,existing:readonly GardenPathPiece[]=[]){
 const dirt=pieces.filter(p=>p.material==='dirt'),byId=new Map([...existing,...pieces].map(p=>[p.id,p]));
 const roads=dirt.map(p=>{const before=byId.get(p.previous??-1);return {width:24,points:before&&before.material==='dirt'?[[before.x,before.y],[p.x,p.y]]:[[p.x,p.y],[p.x,p.y]]};});
 if(preview!==undefined){for(const road of roads){g.lineStyle(25,preview,.65).beginPath();road.points.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.strokePath();for(const [x,y]of road.points)g.fillStyle(preview,.65).fillCircle(x,y,12.5);}}
 else{drawPathNetwork(g,roads);for(const p of dirt)for(let j=0;j<3;j++)g.fillStyle(j%2?0xd6c29a:0x9f916e,.65).fillRect(p.x+(noise(p.id,j)-.5)*16,p.y+(noise(p.id,j+4)-.5)*16,2,1);}
 for(const p of pieces){if(p.material==='dirt')continue;
  if(p.material==='stone'){
   const angle=noise(p.id,2)*.8-.4,rx=7+noise(p.id,3)*3,ry=5+noise(p.id,4)*2,dx=(noise(p.id,5)-.5)*3,dy=(noise(p.id,6)-.5)*2;
   const vertices=Array.from({length:7},(_,i)=>{const a=angle+i*Math.PI*2/7,r=.82+noise(p.id,i+10)*.18;return {x:p.x+dx+Math.cos(a)*rx*r,y:p.y+dy+Math.sin(a)*ry*r};});
   if(preview===undefined)g.fillStyle(0x465846,.3).fillPoints(vertices.map(v=>({x:v.x+1,y:v.y+2})),true);
   g.fillStyle(preview??[0x9fa68e,0xb2b49b,0xa6ae9d][p.id%3],preview===undefined?1:.7).fillPoints(vertices,true);
   if(preview===undefined){g.lineStyle(1,0xd5d1b4,.65).lineBetween(vertices[3].x,vertices[3].y,vertices[4].x,vertices[4].y);g.lineStyle(1,0x66715c,.65).lineBetween(vertices[0].x,vertices[0].y,vertices[1].x,vertices[1].y);}
  }else{
   const angle=p.angle+Math.PI/2+(noise(p.id,1)-.5)*.1,ux=Math.cos(angle),uy=Math.sin(angle),vx=-uy,vy=ux,width=12+noise(p.id,3)*2,thickness=4.3;
   const corners=[[-width,-thickness],[width,-thickness],[width,thickness],[-width,thickness]].map(([x,y])=>({x:p.x+ux*x+vx*y,y:p.y+uy*x+vy*y}));
   if(preview===undefined)g.fillStyle(0x4b4d32,.35).fillPoints(corners.map(v=>({x:v.x+1,y:v.y+2})),true);
   g.fillStyle(preview??(p.id%2?0x9a794e:0xab8c5e),preview===undefined?1:.7).fillPoints(corners,true);
   if(preview===undefined){g.lineStyle(1,0xd0b27c,.7).lineBetween(corners[0].x,corners[0].y,corners[1].x,corners[1].y);g.lineStyle(1,0x72593c,.65).lineBetween(p.x-ux*9,p.y-uy*9,p.x+ux*8,p.y+uy*8);}
  }
 }
}
