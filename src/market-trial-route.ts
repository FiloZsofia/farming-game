import type {PaintedPath} from './path-art';
export const marketParking={x:-20,y:695};
export const marketRoads:PaintedPath[]=[
 {width:140,points:[[-600,740],[-25,740]]},
 {width:190,points:[[25,740],[25,740]]},
 {width:32,points:[[170,596],[170,625],[130,660],[50,690]]}
];
// A half-circle in the turning bay joins the incoming and outgoing lanes.
// The heading compensates for the truck's elevated (0.48) ground projection.
export function marketTurn(t:number){const a=-Math.PI/2+Math.PI*Math.max(0,Math.min(1,t));return{x:marketParking.x+70*Math.cos(a),y:740+45*Math.sin(a),heading:Math.atan2(45*Math.cos(a)/.48,-70*Math.sin(a))};}
export function marketDeparture(t:number){return{x:marketParking.x-680*Math.max(0,Math.min(1,t)),y:785,heading:Math.PI};}
export const marketLoadingRoute=[{x:-50,y:714},{x:129,y:714},{x:129,y:638},{x:118,y:527},{x:91,y:494}];
