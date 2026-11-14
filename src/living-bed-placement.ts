import {pondOutline,pondWaterAt} from './pond-shape';
import {marketStand} from './market-site';
import {farmBuildingArtwork} from './birdhouse-placement';
import {farmLayout,farmBounds} from './layout';
import {livingBedArea,type LivingBedArea} from './living-bed-layout';
export function bedAreaAt(point:{x:number;y:number}):LivingBedArea{return {x:Math.round(point.x-livingBedArea.w/2),y:Math.round(point.y-livingBedArea.h/2),w:livingBedArea.w,h:livingBedArea.h};}
export function livingBedFits(b:LivingBedArea,actor?:{x:number;y:number}){
 if(!Number.isFinite(b.x)||!Number.isFinite(b.y)||b.w!==livingBedArea.w||b.h!==livingBedArea.h||b.x<farmBounds.left+100||b.y<farmBounds.top+110||b.x+b.w>farmBounds.right-100||b.y+b.h>540)return false;
 const boxes=[{x:marketStand.left,y:marketStand.top,w:marketStand.right-marketStand.left,h:marketStand.bottom-marketStand.top},...farmBuildingArtwork,farmLayout.houseBounds,farmLayout.shedBounds,farmLayout.porchBounds,farmLayout.porchSteps,farmLayout.dock,farmLayout.catalog,farmLayout.journal,farmLayout.mailbox];
 if(boxes.some(o=>b.x-5<o.x+o.w&&b.x+b.w+5>o.x&&b.y-5<o.y+o.h&&b.y+b.h+5>o.y))return false;
 for(const dx of [0,b.w/2,b.w])for(const dy of [0,b.h/2,b.h])if(pondWaterAt(b.x+dx,b.y+dy,undefined,1.08))return false;
 if(pondOutline(undefined,10).some(p=>p.x>=b.x-8&&p.x<=b.x+b.w+8&&p.y>=b.y-8&&p.y<=b.y+b.h+8))return false;

 if(actor&&actor.x>b.x-4&&actor.x<b.x+b.w+4&&actor.y>b.y-4&&actor.y<b.y+b.h+4)return false;
 for(const path of farmLayout.paths)for(let i=1;i<path.points.length;i++){const a=path.points[i-1],z=path.points[i],steps=Math.ceil(Math.hypot(z[0]-a[0],z[1]-a[1])/2);for(let n=0;n<=steps;n++){const x=a[0]+(z[0]-a[0])*n/steps,y=a[1]+(z[1]-a[1])*n/steps;for(const [r,pad]of [[b,6]] as const)if(Math.hypot(x-Math.max(r.x,Math.min(r.x+r.w,x)),y-Math.max(r.y,Math.min(r.y+r.h,y)))<=path.width/2+pad)return false;}}
 return true;
}

// Full marker artwork and stone footprints must stay clear of roads and buildings.
export function gardenDecorationFits(p:{x:number;y:number},rx:number,ry:number,allowPaths=false){
 if(!Number.isFinite(p.x)||!Number.isFinite(p.y)||p.x-rx<farmBounds.left+100||p.x+rx>farmBounds.right-100||p.y-ry<farmBounds.top+110||p.y+ry>550)return false;
 const boxes=[{x:marketStand.left,y:marketStand.top,w:marketStand.right-marketStand.left,h:marketStand.bottom-marketStand.top},...farmBuildingArtwork,farmLayout.houseBounds,farmLayout.shedBounds,farmLayout.porchBounds,farmLayout.porchSteps,farmLayout.dock,farmLayout.catalog,farmLayout.journal,farmLayout.mailbox];
 if(boxes.some(b=>p.x+rx+4>b.x&&p.x-rx-4<b.x+b.w&&p.y+ry+4>b.y&&p.y-ry-4<b.y+b.h))return false;
 for(const dx of [-rx,0,rx])for(const dy of [-ry,0,ry])if(pondWaterAt(p.x+dx,p.y+dy,undefined,1.08))return false;
 if(pondOutline(undefined,8).some(q=>q.x>p.x-rx-4&&q.x<p.x+rx+4&&q.y>p.y-ry-4&&q.y<p.y+ry+4))return false;

 if(!allowPaths)for(const path of farmLayout.paths)for(let i=1;i<path.points.length;i++){const a=path.points[i-1],b=path.points[i],n=Math.max(1,Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/2));for(let j=0;j<=n;j++){const x=a[0]+(b[0]-a[0])*j/n,y=a[1]+(b[1]-a[1])*j/n;if(Math.hypot(Math.max(0,Math.abs(x-p.x)-rx),Math.max(0,Math.abs(y-p.y)-ry))<path.width/2+3)return false;}}
 return true;
}
export function nearBedSide(p:{x:number;y:number},b:LivingBedArea,reach=28){
 const dx=Math.max(b.x-p.x,0,p.x-b.x-b.w),dy=Math.max(b.y-p.y,0,p.y-b.y-b.h);
 return (dx>0||dy>0)&&Math.hypot(dx,dy)<=reach;
}

export function bedMarkerFits(p:{x:number;y:number},b:LivingBedArea){
 const overlaps=(r:{x:number;y:number;w:number;h:number})=>r.x<b.x+b.w&&r.x+r.w>b.x&&r.y<b.y+b.h&&r.y+r.h>b.y;
 return nearBedSide(p,b,60)&&gardenDecorationFits({x:p.x,y:p.y-10},34,22)&&!overlaps({x:p.x-34,y:p.y-31,w:68,h:36})&&!overlaps({x:p.x-2,y:p.y-14,w:4,h:24});
}

// The marker is wide but shallow: use its artwork instead of a large circular exclusion.
export function bedMarkerBounds(p:{x:number;y:number}){return {x:p.x-34,y:p.y-31,w:68,h:41};}
export function markerOverlapsBed(p:{x:number;y:number},bed:LivingBedArea){
 const a=bedMarkerBounds(p),pad=4;
 return a.x<bed.x+bed.w+pad&&a.x+a.w>bed.x-pad&&a.y<bed.y+bed.h+pad&&a.y+a.h>bed.y-pad;
}
export const BED_SPACING=10;

export function orchardTreeBlocksBed(tree:{x:number;y:number},bed:LivingBedArea){
 const dx=Math.max(bed.x-tree.x,0,tree.x-bed.x-bed.w),dy=Math.max(bed.y-tree.y,0,tree.y-bed.y-bed.h);
 return Math.hypot(dx,dy)<8;
}
