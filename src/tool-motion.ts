export const WORK_SECONDS=.52;
export const WORK_CONTACT=.60;
export const heavyTool=(tool:string)=>['hoe','axe','pickaxe','crowbar','stick'].includes(tool);
const clamp=(x:number)=>Math.max(0,Math.min(1,x));
const ease=(t:number)=>t*t*(3-2*t);
export const workProgress=(remaining:number)=>1-clamp(remaining/WORK_SECONDS);
// A readable lift and brief anticipation, a fast downstroke, then a soft recovery.
export function workPose(dx:number,dy:number,remaining:number,mirrored=false){
 const t=workProgress(remaining),x=mirrored?-dx:dx,aim=Math.atan2(dy,x)-Math.PI/2,raised=-2.88;
 const contactReach=Math.max(.3,Math.min(1.85,(Math.hypot(x,dy)-12)/28));
 let angle:number,reach:number,extension:number,weight:number;
 if(t<.34){const a=ease(t/.34);angle=raised*a;reach=1+.05*a;extension=a;weight=-.55*a;}
 else if(t<.43){angle=raised;reach=1.05;extension=1;weight=-.55;}
 else if(t<WORK_CONTACT){const a=((t-.43)/(WORK_CONTACT-.43))**2;angle=raised+(aim-raised)*a;reach=1.05+(contactReach-1.05)*a;extension=1;weight=-.55+1.55*a;}
 else{const a=ease((t-WORK_CONTACT)/(1-WORK_CONTACT));angle=aim*(1-a)+Math.sin(a*Math.PI)*.13;reach=contactReach+(1-contactReach)*a;extension=1-a;weight=(1-a)*(1-a);}
 return {angle,reach,extension,weight,progress:t,phase:t<.43?'lift':t<WORK_CONTACT?'strike':'recover'};
}
export function workAngle(dx:number,dy:number,remaining:number,mirrored=false){return workPose(dx,dy,remaining,mirrored).angle;}
export function gentleWorkAngle(dx:number,dy:number,remaining:number,mirrored=false){
 const t=workProgress(remaining),aim=Math.atan2(dy,mirrored?-dx:dx)-Math.PI/2;
 return aim*Math.sin(Math.PI*t)*.65;
}
