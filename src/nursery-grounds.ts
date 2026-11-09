import {marketExitX,marketRoadY,marketTruckContains,type MarketPose} from './market-trial-route';
export const greenhouse={x:684,y:839,w:74,h:68};
export const maraVillageParking:MarketPose={x:845,y:850,heading:Math.PI/2};
export const maraVillageDoor={x:785,y:878};
export const maraPruningPoint={x:954,y:905};
export const ornamentalShrubs=[{x:931,y:840},{x:931,y:886}] as const;
export const maraVillageWalk=[maraVillageDoor,{x:787,y:896},{x:787,y:927},{x:954,y:927},maraPruningPoint];
export const maraVillageReturnSeconds=8;
export function maraVillageReturn(t:number):MarketPose{
 const u=Math.max(0,Math.min(1,t)),split=.48;
 if(u<split)return{x:marketExitX+(1040-marketExitX)*u/split,y:marketRoadY,heading:Math.PI};
 const k=(u-split)/(1-split),v=1-k;
 return{x:v*v*v*1040+3*v*v*k*900+3*v*k*k*845+k*k*k*845,y:v*v*v*marketRoadY+3*v*v*k*marketRoadY+3*v*k*k*770+k*k*k*850,heading:Math.atan2((3*v*v*(marketRoadY-marketRoadY)+6*v*k*(770-marketRoadY)+3*k*k*(850-770))/.48,3*v*v*(900-1040)+6*v*k*(845-900))};
}
const returnPoses=Array.from({length:101},(_,i)=>maraVillageReturn(i/100));
export function nurseryTreeClear(x:number,y:number,scale=1){
 // Reserve the complete canopy around the glasshouse, bay, pedestrian exit and shrubs.
 const intersects=(l:number,r:number,t:number,b:number)=>x+42*scale>l&&x-42*scale<r&&y+7*scale>t&&y-105*scale<b;
 if(intersects(677,767,800,919)||intersects(770,980,775,944))return false;
 return returnPoses.every(p=>!marketTruckContains(p,{x,y},12*scale));
}
export function nurserySolid(x:number,y:number){return x>greenhouse.x-7&&x<greenhouse.x+greenhouse.w+7&&y>greenhouse.y-3&&y<greenhouse.y+greenhouse.h+4||ornamentalShrubs.some(p=>Math.hypot((x-p.x)/16,(y-p.y)/10)<1);}

export const nurseryDoor={x:591,y:954};
export function maraNightWalk(from:{x:number;y:number}){return[{x:from.x,y:from.y},{x:954,y:927},{x:918,y:927},{x:918,y:1130},{x:600,y:1130},{x:560,y:1020},{x:nurseryDoor.x,y:978},nurseryDoor];}
