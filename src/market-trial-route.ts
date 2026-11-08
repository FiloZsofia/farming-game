import {FOREST_LEFT} from './forest';
import type {PaintedPath} from './path-art';
const roadY=740,laneOffset=20;
export const marketOffscreenX=FOREST_LEFT-160;
export const marketParking={x:-20,y:roadY-laneOffset};
export const marketDoor={x:38,y:marketParking.y+19};
export const marketRoads:PaintedPath[]=[
 {width:90,points:[[marketOffscreenX,roadY],[146,roadY]]},
 {width:138,points:[[-90,roadY],[105,roadY]]}
];
export function marketArrival(t:number){return{x:marketOffscreenX+(marketParking.x-marketOffscreenX)*Math.max(0,Math.min(1,t)),y:marketParking.y};}
// Tighter lane spacing narrows the road; the local bay still fits the turning pickup.
export function marketTurn(t:number){const a=-Math.PI/2+Math.PI*Math.max(0,Math.min(1,t));return{x:marketParking.x+70*Math.cos(a),y:roadY+laneOffset*Math.sin(a),heading:Math.atan2(laneOffset*Math.cos(a)/.48,-70*Math.sin(a))};}
export function marketDeparture(t:number){return{x:marketParking.x+(marketOffscreenX-marketParking.x)*Math.max(0,Math.min(1,t)),y:roadY+laneOffset,heading:Math.PI};}
export const marketLoadingRoute=[{x:-50,y:marketDoor.y},{x:129,y:marketDoor.y},{x:46,y:638},{x:46,y:527},{x:26,y:494}];
export function marketRoadContains(x:number,y:number,padding=0){return marketRoads.some(path=>path.points.slice(1).some((b,i)=>{const a=path.points[i],dx=b[0]-a[0],dy=b[1]-a[1],length=dx*dx+dy*dy,t=length?Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/length)):0;return Math.hypot(x-a[0]-t*dx,y-a[1]-t*dy)<=path.width/2+padding;}));}

export const MARA_WALK_SPEED=55;
export function marketWalkDuration(points:readonly {x:number;y:number}[]){return points.slice(1).reduce((n,p,i)=>n+Math.hypot(p.x-points[i].x,p.y-points[i].y),0)/MARA_WALK_SPEED;}
