import {marketDoor,type MarketPose} from './market-trial-route';
import {marketCratePoint} from './market-site';
export function marketLoadingRouteForCrate(index:number){return[marketDoor,{x:8,y:marketDoor.y},{x:8,y:622},{x:58,y:622},{x:58,y:marketCratePoint(index).y+18}];}
export function marketPersonDepth(truck:MarketPose,person:{x:number;y:number},visible:boolean,front=130){const extent=Math.abs(Math.cos(truck.heading))*126+Math.abs(Math.sin(truck.heading))*42;return visible&&person.y<truck.y&&Math.abs(person.x-truck.x)<extent+14?69:front;}
