import {distanceToSouthPath} from './south-forest-layout';
export const sporeShelters=[{x:-700,y:1760},{x:-620,y:1860}];
export function sporeFieldPhase(age:number){const t=age%12;return t<7.5?'quiet':t<9?'warning':'release';}
export const inSporeField=(x:number,y:number)=>x<0&&y>1770&&y<1905&&distanceToSouthPath(x,y)<120;
export const sporeSheltered=(x:number,y:number)=>sporeShelters.some(p=>Math.hypot(x-p.x,y-p.y)<32);
export function sporeFieldHurts(age:number,p:{x:number;y:number},jumping:boolean){return sporeFieldPhase(age)==='release'&&inSporeField(p.x,p.y)&&!sporeSheltered(p.x,p.y)&&!jumping;}
