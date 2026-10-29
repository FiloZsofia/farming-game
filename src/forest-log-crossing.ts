// A narrow fallen trunk crosses a dry hollow; its missing middle requires a jump.
export const forestLog={start:{x:-365,y:1552},end:{x:-590,y:1630},halfWidth:22,gapStart:.43,gapEnd:.60};
export function logPoint(t:number,across=0){const {start:a,end:b}=forestLog,dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy);return{x:a.x+dx*t-dy/d*across,y:a.y+dy*t+dx/d*across};}
export function logCoordinates(p:{x:number;y:number}){const {start:a,end:b}=forestLog,dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy);return{t:((p.x-a.x)*dx+(p.y-a.y)*dy)/(d*d),across:((p.x-a.x)*-dy+(p.y-a.y)*dx)/d};}
export function logCrossingStep(p:{x:number;y:number},jumping:boolean,safe:{x:number;y:number}){const {t,across}=logCoordinates(p),ravine=t>.08&&t<.92&&Math.abs(across)<125,onLog=Math.abs(across)<=forestLog.halfWidth&&(t<=forestLog.gapStart||t>=forestLog.gapEnd);return{fall:!jumping&&ravine&&!onLog,safe:!jumping&&!ravine?{x:p.x,y:p.y}:safe};}
