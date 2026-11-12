import type {PaintedPath} from './path-art';
export type PathMark={x:number;y:number;kind:number;angle:number;edge:number};
/** World-aligned grit makes joined paths share one texture, regardless of segments. */
export function pathTextureMarks(paths:readonly PaintedPath[]):PathMark[]{
 const marks=new Map<string,PathMark>();
 for(const path of paths)for(let i=1;i<path.points.length;i++){
  const [ax,ay]=path.points[i-1],[bx,by]=path.points[i],radius=Math.max(0,path.width/2-4),dx=bx-ax,dy=by-ay,length2=dx*dx+dy*dy;
  for(let x=Math.ceil((Math.min(ax,bx)-radius)/5)*5;x<=Math.max(ax,bx)+radius;x+=5)for(let y=Math.ceil((Math.min(ay,by)-radius)/5)*5;y<=Math.max(ay,by)+radius;y+=5){
   const t=length2?Math.max(0,Math.min(1,((x-ax)*dx+(y-ay)*dy)/length2)):0;
   const distance=Math.hypot(x-ax-t*dx,y-ay-t*dy);if(distance>radius)continue;
   const hash=(Math.imul(x+473,374761393)^Math.imul(y+877,668265263))>>>0;
   if(hash%10>5)continue;
   const xx=x+(hash%3)-1,yy=y+((hash>>>8)%3)-1;
   const key=`${x},${y}`,edge=Math.round(distance/Math.max(1,radius)*1e6)/1e6,previous=marks.get(key);
   if(!previous||edge<previous.edge)marks.set(key,{x:xx,y:yy,kind:(hash>>>16)%3,angle:Math.atan2(dy,dx),edge});
  }
 }
 return [...marks.values()].sort((a,b)=>a.y-b.y||a.x-b.x);
}
