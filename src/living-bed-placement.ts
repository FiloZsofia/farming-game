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
 for(const path of farmLayout.paths)for(let i=1;i<path.points.length;i++){const a=path.points[i-1],z=path.points[i],steps=Math.ceil(Math.hypot(z[0]-a[0],z[1]-a[1])/2);for(let n=0;n<=steps;n++){const x=a[0]+(z[0]-a[0])*n/steps,y=a[1]+(z[1]-a[1])*n/steps;for(const [r,pad]of [[b,6]] as const)if(Math.hypot(x-Math.max(r.x,Math.min(r.x+r.w,x)),y-Math.max(r.y,Math.min(r.y+r.h,y)))<=path.width/2+pad)return false;}}
 return true;
}

// Full marker artwork and stone footprints must stay clear of roads and buildings.
export function gardenDecorationFits(p:{x:number;y:number},rx:number,ry:number,allowPaths=false){
 if(!Number.isFinite(p.x)||!Number.isFinite(p.y)||p.x-rx<farmBounds.left+100||p.x+rx>farmBounds.right-100||p.y-ry<farmBounds.top+110||p.y+ry>550)return false;
 const boxes=[...farmBuildingArtwork,farmLayout.houseBounds,farmLayout.shedBounds,farmLayout.porchBounds,farmLayout.porchSteps,farmLayout.shipping,farmLayout.dock,farmLayout.catalog,farmLayout.journal,farmLayout.mailbox];
 if(boxes.some(b=>p.x+rx+4>b.x&&p.x-rx-4<b.x+b.w&&p.y+ry+4>b.y&&p.y-ry-4<b.y+b.h))return false;
 const pond=farmLayout.pond;if(((p.x-pond.x)/(pond.rx*1.07+rx+4))**2+((p.y-pond.y)/(pond.ry*1.07+ry+4))**2<1)return false;
 if(!allowPaths)for(const path of farmLayout.paths)for(let i=1;i<path.points.length;i++){const a=path.points[i-1],b=path.points[i],n=Math.max(1,Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/2));for(let j=0;j<=n;j++){const x=a[0]+(b[0]-a[0])*j/n,y=a[1]+(b[1]-a[1])*j/n;if(Math.hypot(Math.max(0,Math.abs(x-p.x)-rx),Math.max(0,Math.abs(y-p.y)-ry))<path.width/2+3)return false;}}
 return true;
}
export function nearBedSide(p:{x:number;y:number},b:LivingBedArea,reach=28){
 const dx=Math.max(b.x-p.x,0,p.x-b.x-b.w),dy=Math.max(b.y-p.y,0,p.y-b.y-b.h);
 return (dx>0||dy>0)&&Math.hypot(dx,dy)<=reach;
}

export function bedMarkerFits(p:{x:number;y:number},b:LivingBedArea){
 const overlaps=(r:{x:number;y:number;w:number;h:number})=>r.x<b.x+b.w&&r.x+r.w>b.x&&r.y<b.y+b.h&&r.y+r.h>b.y;
 return nearBedSide(p,b,44)&&gardenDecorationFits(p,34,18)&&!overlaps({x:p.x-34,y:p.y-17,w:68,h:18})&&!overlaps({x:p.x-2,y:p.y-14,w:4,h:24});
}
