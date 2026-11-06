import {farmBuildingArtwork} from './birdhouse-placement';
import {farmLayout,farmBounds} from './layout';
import {livingBedArea,type LivingBedArea} from './living-bed-layout';
export function bedAreaAt(point:{x:number;y:number}):LivingBedArea{return {x:Math.round(point.x-livingBedArea.w/2),y:Math.round(point.y-livingBedArea.h/2),w:livingBedArea.w,h:livingBedArea.h};}
export function livingBedFits(b:LivingBedArea,actor?:{x:number;y:number}){
 if(!Number.isFinite(b.x)||!Number.isFinite(b.y)||b.w!==livingBedArea.w||b.h!==livingBedArea.h||b.x<farmBounds.left+100||b.y<farmBounds.top+110||b.x+b.w>farmBounds.right-100||b.y+b.h>540)return false;
 const boxes=[...farmBuildingArtwork,farmLayout.houseBounds,farmLayout.shedBounds,farmLayout.porchBounds,farmLayout.porchSteps,farmLayout.shipping,farmLayout.dock,farmLayout.catalog,farmLayout.journal,farmLayout.mailbox];
 if(boxes.some(o=>b.x-8<o.x+o.w&&b.x+b.w+8>o.x&&b.y-8<o.y+o.h&&b.y+b.h+8>o.y))return false;
 const p=farmLayout.pond,dx=p.x-Math.max(b.x,Math.min(b.x+b.w,p.x)),dy=p.y-Math.max(b.y,Math.min(b.y+b.h,p.y));if((dx/(p.rx*1.07+8))**2+(dy/(p.ry*1.07+8))**2<1)return false;
 if(actor&&actor.x>b.x-8&&actor.x<b.x+b.w+8&&actor.y>b.y-6&&actor.y<b.y+b.h+8)return false;
 for(const path of farmLayout.paths)for(let i=1;i<path.points.length;i++){const a=path.points[i-1],z=path.points[i],steps=Math.ceil(Math.hypot(z[0]-a[0],z[1]-a[1])/2);for(let n=0;n<=steps;n++){const x=a[0]+(z[0]-a[0])*n/steps,y=a[1]+(z[1]-a[1])*n/steps;for(const [r,pad]of [[b,6],[{x:b.x+2,y:b.y+b.h,w:66,h:18},3],[{x:b.x+31,y:b.y+b.h+4,w:4,h:24},3]] as const)if(Math.hypot(x-Math.max(r.x,Math.min(r.x+r.w,x)),y-Math.max(r.y,Math.min(r.y+r.h,y)))<=path.width/2+pad)return false;}}
 return true;
}
