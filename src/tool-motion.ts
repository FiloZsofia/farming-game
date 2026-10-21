export const WORK_SECONDS=.52;
// Tool is drawn pointing down; convert a world-space target to that local axis.
export function workAngle(dx:number,dy:number,remaining:number,mirrored=false){
 const aim=Math.atan2(dy,mirrored?-dx:dx)-Math.PI/2;
 const progress=1-Math.max(0,Math.min(1,remaining/WORK_SECONDS));
 return aim+Math.sin(progress*Math.PI*2)*.48*(1-progress);
}
