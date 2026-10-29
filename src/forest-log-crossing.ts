// A continuous floating trunk crosses the marsh; no jump is required.
export const forestLog={start:{x:-365,y:1552},end:{x:-590,y:1630},halfWidth:22};
export function logPoint(t:number,across=0){const {start:a,end:b}=forestLog,dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy);return{x:a.x+dx*t-dy/d*across,y:a.y+dy*t+dx/d*across};}
export function logCoordinates(p:{x:number;y:number}){const {start:a,end:b}=forestLog,dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy);return{t:((p.x-a.x)*dx+(p.y-a.y)*dy)/(d*d),across:((p.x-a.x)*-dy+(p.y-a.y)*dx)/d};}
export function onFloatingLog(p:{x:number;y:number}){const c=logCoordinates(p);return c.t>=.04&&c.t<=.96&&Math.abs(c.across)<=forestLog.halfWidth+7;}
export function logCrossingStep(p:{x:number;y:number},jumping:boolean,safe:{x:number;y:number}){const {t,across}=logCoordinates(p),ravine=t>.08&&t<.92&&Math.abs(across)<125,onLog=onFloatingLog(p);return{fall:!jumping&&ravine&&!onLog,safe:!jumping&&!ravine?{x:p.x,y:p.y}:safe};}

export function floatingLogPose(age:number,load:number){return{sway:Math.sin(age*2.3)*7*load,sink:load*(9+Math.sin(age*1.7)*2)};}
export function logGasHurts(age:number,p:{x:number;y:number}){const {t,across}=logCoordinates(p);return age%12>=9&&t>.08&&t<.92&&Math.abs(across)<60;}
