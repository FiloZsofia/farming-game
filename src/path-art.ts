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
 // Soft nested bands suggest a compacted centre, following the same path curve.
 for(const [factor,alpha]of [[.62,.035],[.42,.045],[.22,.055]])for(const path of paths){
  g.lineStyle(path.width*factor,mapColor(0xe0cda5),alpha).beginPath();
  path.points.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.strokePath();
 }
 for(const mark of pathTextureMarks(paths)){
  const hash=(Math.imul(Math.round(mark.x)+311,374761393)^Math.imul(Math.round(mark.y)+701,668265263))>>>0;
  const cos=Math.cos(mark.angle),sin=Math.sin(mark.angle);
  const point=(x:number,y:number)=>({x:mark.x+x*cos-y*sin,y:mark.y+x*sin+y*cos});
  if(mark.kind===0){
   // Fine earth grains remain subdued; the compacted middle is less stony.
   g.fillStyle(mapColor(0x9b8966),.3+mark.edge*.15).fillRect(mark.x,mark.y,1+(hash%3)*.35,.7);
  }else if(mark.kind===1){
   if(mark.edge<.35&&hash%3!==0)continue;
   const size=.7+(hash%4)*.23;
   g.fillStyle(mapColor(0x9e9478),.42).fillPoints([point(-size,0),point(-size*.6,-.6),point(size*.65,-.5),point(size,.1),point(size*.3,.65),point(-size*.7,.55)],true);
   g.fillStyle(mapColor(hash%2?0xd5c8aa:0xc9bda0),.65).fillPoints([point(-size*.8,-.2),point(-size*.4,-.65),point(size*.65,-.5),point(size*.5,.1),point(-size*.4,.1)],true);
  }else{
   const length=1.6+(hash%3)*.5;
   g.fillStyle(mapColor(0xa59270),.23).fillPoints([point(-length,-.25),point(length,-.25),point(length*.7,.3),point(-length,.3)],true);
  }
 }
}
