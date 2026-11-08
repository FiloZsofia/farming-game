import {FOREST_LEFT} from './forest';
import {farmBounds} from './layout';
import type {PaintedPath} from './path-art';
export type MarketPose={x:number;y:number;heading:number};
export const marketRoadY=740;
export const marketOffscreenX=FOREST_LEFT-160,marketExitX=farmBounds.right+160;
export const marketParking={x:-130,y:665};
export const marketDoor={x:marketParking.x+58,y:marketParking.y+19};
export const marketRoads:PaintedPath[]=[{width:64,points:[[marketOffscreenX,marketRoadY],[marketExitX,marketRoadY]]}];
const pullStart=-510,mergeEnd=250,clamp=(t:number)=>Math.max(0,Math.min(1,t));
const bend=(x0:number,y0:number,x1:number,y1:number,t:number):MarketPose=>{const u=clamp(t);return{x:x0+(x1-x0)*u,y:y0+(y1-y0)*u*u*(3-2*u),heading:u===0||u===1?0:Math.atan2((y1-y0)*6*u*(1-u)/.48,x1-x0)};};
export function marketArrival(t:number):MarketPose{const split=(pullStart-marketOffscreenX)/(marketParking.x-marketOffscreenX),u=clamp(t);return u<split?{x:marketOffscreenX+(pullStart-marketOffscreenX)*u/split,y:marketRoadY,heading:0}:bend(pullStart,marketRoadY,marketParking.x,marketParking.y,(u-split)/(1-split));}
export const marketMerge=(t:number)=>bend(marketParking.x,marketParking.y,mergeEnd,marketRoadY,t);
export const marketDeparture=(t:number):MarketPose=>({x:mergeEnd+(marketExitX-mergeEnd)*clamp(t),y:marketRoadY,heading:0});
export const marketDriveDurations={arriving:(marketParking.x-marketOffscreenX)/180,merge:4,depart:(marketExitX-mergeEnd)/180};
export const marketLoadingRoute=[marketDoor,{x:8,y:marketDoor.y},{x:8,y:622},{x:46,y:622},{x:46,y:527},{x:26,y:494}];
export function marketRoadContains(x:number,y:number,padding=0){return x>=marketOffscreenX&&x<=marketExitX&&Math.abs(y-marketRoadY)<=32+padding;}
function truckLocal(p:MarketPose,q:{x:number;y:number}){const dx=q.x-p.x,dy=(q.y-p.y)/.48,c=Math.cos(p.heading),s=Math.sin(p.heading);return{x:dx*c+dy*s,y:-dx*s+dy*c};}
export function marketTruckContains(p:MarketPose,q:{x:number;y:number},margin=7){const local=truckLocal(p,q);return local.x> -126-margin&&local.x<120+margin&&Math.abs(local.y)<42+margin/.48;}
// Slow before a pedestrian, then wait with a gap in front of the bumper.
export function marketTrafficSpeed(p:MarketPose,q:{x:number;y:number}){const local=truckLocal(p,q);if(Math.abs(local.y)>62||local.x< -140||local.x>235)return 1;const speed=clamp((local.x-150)/85);return speed<.025?0:speed;}
export function marketTruckMoveBlocked(a:MarketPose,b:MarketPose,q:{x:number;y:number}){if(marketTruckContains(a,q))return false;const steps=Math.max(1,Math.ceil((Math.hypot(b.x-a.x,b.y-a.y)+Math.abs(b.heading-a.heading)*130)/4));for(let i=1;i<=steps;i++)if(marketTruckContains({x:a.x+(b.x-a.x)*i/steps,y:a.y+(b.y-a.y)*i/steps,heading:a.heading+(b.heading-a.heading)*i/steps},q))return true;return false;}
const maneuvers=Array.from({length:41},(_,i)=>[marketArrival(.6+i*.4/40),marketMerge(i/40)]).flat();
export function marketTreeManeuverClear(x:number,y:number,scale=1){return x< -680||x>430||y<610||y>790||maneuvers.every(p=>!marketTruckContains(p,{x,y},12*scale));}
export const MARA_WALK_SPEED=55;
export function marketWalkDuration(points:readonly {x:number;y:number}[]){return points.slice(1).reduce((n,p,i)=>n+Math.hypot(p.x-points[i].x,p.y-points[i].y),0)/MARA_WALK_SPEED;}
