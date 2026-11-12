import {farmLayout,farmBounds} from './layout';
export const POND_SECTORS=64,MAX_POND_GROWTH=100;
let activeExpansion:()=>readonly number[]=()=>[];
/** The single live scene supplies its current farm; validation passes explicit data. */
export function bindPondExpansion(read:()=>readonly number[]){activeExpansion=read;}
export const currentPondExpansion=()=>activeExpansion();
export const basePondRadius=(angle:number)=>Math.min(.99,.91+.065*Math.sin(angle*3+.6)+.028*Math.cos(angle*5-1));
export function pondRadius(angle:number,expansion:readonly number[]=activeExpansion()){
 const turn=((angle/(Math.PI*2))%1+1)%1*POND_SECTORS,i=Math.floor(turn),t=turn-i;
 const extra=(expansion[i]??0)*(1-t)+(expansion[(i+1)%POND_SECTORS]??0)*t,p=farmLayout.pond;
 return basePondRadius(angle)+extra/Math.hypot(p.rx*Math.cos(angle),p.ry*Math.sin(angle));
}
export function pondOutline(expansion:readonly number[]=activeExpansion(),inset=0){const p=farmLayout.pond;return Array.from({length:POND_SECTORS},(_,i)=>{const a=i/POND_SECTORS*Math.PI*2,r=pondRadius(a,expansion);return{x:p.x+Math.cos(a)*(p.rx+inset)*r,y:p.y+Math.sin(a)*(p.ry+inset)*r};});}
export function pondArea(expansion:readonly number[]=[]){const points=pondOutline(expansion);return Math.abs(points.reduce((area,p,i)=>{const q=points[(i+1)%points.length];return area+p.x*q.y-q.x*p.y;},0))/2;}
export const ORIGINAL_POND_AREA=pondArea([]);
export function pondWaterAt(x:number,y:number,expansion:readonly number[]=activeExpansion(),insetFactor=.92){const p=farmLayout.pond,dx=(x-p.x)/p.rx,dy=(y-p.y)/p.ry;return Math.hypot(dx,dy)<pondRadius(Math.atan2(dy,dx),expansion)*insetFactor;}
export function pondShoreAt(x:number,y:number,expansion:readonly number[]=activeExpansion()){const p=farmLayout.pond,dx=(x-p.x)/p.rx,dy=(y-p.y)/p.ry;return Math.abs(Math.hypot(dx,dy)-pondRadius(Math.atan2(dy,dx),expansion))<.23;}
export function validPondExpansion(value:unknown,foundation:readonly number[]=[]):value is number[]{
 if(!Array.isArray(value)||value.length!==POND_SECTORS||!Array.from(value).every(n=>typeof n==='number'&&Number.isFinite(n)&&n>=0&&n<=MAX_POND_GROWTH+Math.max(0,...foundation)))return false;
 return value.every((n,i)=>n>=(foundation[i]??0)-1e-7&&n<=(foundation[i]??0)+MAX_POND_GROWTH)&&pondArea(value)<=pondArea(foundation)*2+.01&&pondOutline(value,8).every(p=>p.x>=farmBounds.left+24&&p.x<=farmBounds.right-24&&p.y>=farmBounds.top+32&&p.y<=farmBounds.bottom-24);
}
/** Paint a connected circle into the radial shoreline; no disconnected water or holes. */
export function brushPond(expansion:readonly number[],point:{x:number;y:number},brush:number){
 if(!Number.isFinite(point.x)||!Number.isFinite(point.y)||!Number.isFinite(brush)||brush<=0||brush>40)return null;
 const p=farmLayout.pond,dx=point.x-p.x,dy=point.y-p.y,a=Math.atan2(dy/p.ry,dx/p.rx),shore=pondRadius(a,expansion)*Math.hypot(p.rx*Math.cos(a),p.ry*Math.sin(a));
 if(Math.hypot(dx,dy)>shore+brush)return null;
 const result=Array.from({length:POND_SECTORS},(_,i)=>expansion[i]??0);
 for(let i=0;i<POND_SECTORS;i++){
  const angle=i/POND_SECTORS*Math.PI*2,vx=p.rx*Math.cos(angle),vy=p.ry*Math.sin(angle),aa=vx*vx+vy*vy,bb=-2*(vx*dx+vy*dy),cc=dx*dx+dy*dy-brush*brush,disc=bb*bb-4*aa*cc;
  if(disc<0)continue;const radius=(-bb+Math.sqrt(disc))/(2*aa);if(radius<=0)continue;
  const extra=Math.max(0,(radius-basePondRadius(angle))*Math.sqrt(aa));result[i]=Math.max(result[i],Math.round(extra*100)/100);
 }
 return result;
}

/** Diffuse sharp changes along the shore, then restore the paid area exactly.
 * A floor keeps already-built water intact while previewing a new extension. */
export function smoothPondExpansion(value:readonly number[],floor:readonly number[]=[],foundation:readonly number[]=[]){
 if(!value.length)return [];
 const target=pondArea(value);let shape=Array.from({length:POND_SECTORS},(_,i)=>value[i]??0);
 for(let pass=0;pass<10;pass++)shape=shape.map((n,i)=>(shape[(i+63)%64]+2*n+shape[(i+1)%64])/4);
 const scaled=(scale:number)=>shape.map((n,i)=>Math.max(floor[i]??0,Math.min((foundation[i]??0)+MAX_POND_GROWTH,n*scale)));
 let lo=0,hi=4;for(let i=0;i<60;i++){const mid=(lo+hi)/2;if(pondArea(scaled(mid))<target)lo=mid;else hi=mid;}
 return scaled((lo+hi)/2);
}
