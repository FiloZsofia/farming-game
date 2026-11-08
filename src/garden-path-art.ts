import type Phaser from 'phaser';
import {drawPathNetwork,type PaintedPath} from './path-art';
import type {PathMaterial} from './garden-path';
import type {GardenPathPiece} from './garden-path';
const noise=(id:number,salt:number)=>{const v=Math.sin(id*91.37+salt*17.83)*43758.5453;return v-Math.floor(v);};
export function paintGardenPaths(g:Phaser.GameObjects.Graphics,pieces:readonly GardenPathPiece[],preview?:number,existing:readonly GardenPathPiece[]=[],basePaths:readonly PaintedPath[]=[]){
 const dirt=pieces.filter(p=>p.material==='dirt'),byId=new Map([...existing,...pieces].map(p=>[p.id,p]));
 const roads=dirt.flatMap(p=>{const before=byId.get(p.previous??-1),road={width:24,points:before&&before.material==='dirt'?[[before.x,before.y],[p.x,p.y]]:[[p.x,p.y],[p.x,p.y]]};return p.baseJoin?[road,{width:24,points:[[p.baseJoin.x,p.baseJoin.y],[p.x,p.y]]}]:[road];});

 if(preview!==undefined){for(const road of roads){g.lineStyle(25,preview,.65).beginPath();road.points.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.strokePath();for(const [x,y]of road.points)g.fillStyle(preview,.65).fillCircle(x,y,12.5);}}
 else{const base=dirt.some(p=>p.baseJoin)?basePaths:[];drawPathNetwork(g,[...base,...roads]);for(const [index,path]of base.entries())for(let i=1;i<path.points.length;i++){const a=path.points[i-1],b=path.points[i],length=Math.hypot(b[0]-a[0],b[1]-a[1]);for(let d=0;d<length;d+=3){const t=d/length,offset=(noise(index*10000+i*500+d,2)-.5)*(path.width-7);g.fillStyle(d%2?0x9f916e:0xd6c29a,.7).fillRect(Math.round(a[0]+(b[0]-a[0])*t-(b[1]-a[1])/length*offset),Math.round(a[1]+(b[1]-a[1])*t+(b[0]-a[0])/length*offset),2,1);}}
for(const p of dirt)for(let j=0;j<3;j++)g.fillStyle(j%2?0xd6c29a:0x9f916e,.65).fillRect(p.x+(noise(p.id,j)-.5)*16,p.y+(noise(p.id,j+4)-.5)*16,2,1);}
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

export function gardenPathIcon(material:PathMaterial){
 const icon=document.createElementNS('http://www.w3.org/2000/svg','svg');icon.setAttribute('viewBox','0 0 36 36');icon.setAttribute('aria-hidden','true');icon.classList.add('item-icon');icon.dataset.pathMaterial=material;
 icon.innerHTML=material==='stone'?'<path d="m5 28 7-5 8 3-1 7-10 2zm9-14 8-3 7 3-2 7-9 1zM20 2l8-1 5 4-2 5-10-1z" fill="#adb29c" stroke="#737e65"/><path d="m7 28 5-3 6 2m-2-12 6-2 5 2m-5-12 5-1 4 2" stroke="#d7d5bb" fill="none"/>':material==='wood'?'<path d="m3 27 25-5 2 8-25 5zm3-11 25-5 2 8-25 5zm3-11 24-5 2 8-24 5z" fill="#a18456" stroke="#68553b"/><path d="m6 29 19-4m-16-7 19-4M12 7l18-4" stroke="#d3b882"/>':'<path d="M3 36Q2 20 16 16 26 12 23 0h12q5 22-13 28-7 2-6 8" fill="#738354"/><path d="M5 36Q4 21 17 18 28 13 25 0h8q4 21-12 26-8 3-7 10" fill="#a5936c"/><path d="M8 36Q7 24 18 21 31 15 28 0h3q4 19-11 23-10 4-9 13" fill="#c1ae85"/><path d="m11 29 2 0m6-8 3-1m6-12 2-1" stroke="#dcc79b"/>';
 return icon;
}
