import {pathTextureMarks} from './path-texture';
import type Phaser from 'phaser';
export type PaintedPath={width:number;capEnd?:boolean;points:readonly (readonly number[])[]};
// Paint each material across the WHOLE network before moving to the next one.
// Painting complete outlined paths one by one leaves border seams at junctions.
export function drawPathNetwork(g:Phaser.GameObjects.Graphics,paths:readonly PaintedPath[],mapColor:(color:number)=>number=color=>color){
 for(const [extra,color]of [[5,0x738354],[1,0xa5936c],[-3,0xc1ae85]])for(const [index,path]of paths.entries()){
  const width=path.width+extra;g.lineStyle(width,mapColor(color)).beginPath();path.points.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.strokePath();
  for(const [x,y]of path.points.filter((p,i)=>{
   if(index===0&&i===0||path.capEnd===false&&i===path.points.length-1)return false;
   if(i===0||i===path.points.length-1){
    const adjacent=path.points[i===0?1:i-1],ux=adjacent[0]-p[0],uy=adjacent[1]-p[1];
    // Two collinear stretches are one straight edge, not two rounded end caps.
    const continuation=paths.some(other=>other!==path&&other.width===path.width&&[0,other.points.length-1].some(j=>{
     const q=other.points[j];if(q[0]!==p[0]||q[1]!==p[1])return false;
     const next=other.points[j===0?1:j-1],vx=next[0]-q[0],vy=next[1]-q[1],length=Math.hypot(ux,uy)*Math.hypot(vx,vy);
     return length>0&&(ux*vx+uy*vy)/length<-.999;
    }));
    return !continuation;
   }
   const a=path.points[i-1],b=path.points[i+1],ux=p[0]-a[0],uy=p[1]-a[1],vx=b[0]-p[0],vy=b[1]-p[1],d=Math.hypot(ux,uy)*Math.hypot(vx,vy);
   return !d||(ux*vx+uy*vy)/d<.95;
  }))g.fillStyle(mapColor(color)).fillEllipse(x,y,width,width);
 }
 for(const mark of pathTextureMarks(paths)){
  g.fillStyle(mapColor([0x9d8b68,0xd8c6a1,0xb3a17c][mark.kind]),mark.kind===1?.5:.42).fillRect(mark.x,mark.y,mark.kind===2?3:2,mark.kind===0?1.2:1);
 }
}
