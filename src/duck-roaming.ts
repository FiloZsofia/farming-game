import {farmLayout} from './layout';
import {pondRadius} from './pond-shape';
import {worldBlocked} from './village-layout';
type Point={x:number;y:number};
const smooth=(value:number)=>{const t=Math.max(0,Math.min(1,value));return t*t*(3-2*t);};
export function duckPose(nest:Point,elapsed:number,index:number,blocked:(p:Point)=>boolean=()=>false){
 const pond=farmLayout.pond,dx=nest.x-pond.x,dy=nest.y-pond.y,length=Math.hypot(dx,dy)||1,n={x:dx/length,y:dy/length},side=index?-1:1;
 const inWater=(p:Point)=>{const x=(p.x-pond.x)/pond.rx,y=(p.y-pond.y)/pond.ry;return Math.hypot(x,y)<pondRadius(Math.atan2(y,x));};
 const safe=(p:Point)=>!inWater(p)&&!worldBlocked(p.x,p.y)&&!blocked(p)&&Math.hypot(p.x-nest.x,p.y-nest.y)<=72;
 const base=(out:number,tangent:number)=>({x:nest.x+n.x*out-n.y*tangent,y:nest.y+n.y*out+n.x*tangent});
 let anchor={...nest},found=false;
 for(const out of [26,14,38,0,50]){for(const tangent of [side*13,side*25,-side*13,side*40]){const candidate=base(out,tangent);if(safe(candidate)){anchor=candidate;found=true;break;}}if(found)break;}
 const phase=elapsed<60?'foraging':elapsed<165?'swimming':elapsed<230?'preening':elapsed<360?'swimming':'resting';
 const water=elapsed<60?0:elapsed<90?smooth((elapsed-60)/30):elapsed<145?1:elapsed<175?1-smooth((elapsed-145)/30):elapsed<230?0:elapsed<260?smooth((elapsed-230)/30):elapsed<330?1:1-smooth((elapsed-330)/30);
 const wander=phase==='foraging'?smooth((60-elapsed)/8):phase==='preening'?.35*smooth((elapsed-165)/8)*smooth((230-elapsed)/8):0;
 const offsets=[[0,0],[15,3],[-7,8],[-15,2]],points=offsets.map(([along,out])=>({x:anchor.x-n.y*along+n.x*out,y:anchor.y+n.x*along+n.y*out}));
 let routeSafe=points.every(safe);
 for(let i=0;routeSafe&&i<points.length;i++){const a=points[i],b=points[(i+1)%points.length];for(let j=0;j<=8;j++)if(!safe({x:a.x+(b.x-a.x)*j/8,y:a.y+(b.y-a.y)*j/8})){routeSafe=false;break;}}
 const position=(time:number)=>{const clock=Math.max(0,time)+index*4,segment=Math.floor(clock/12)%points.length,t=smooth((clock%12)/5),a=points[segment],b=points[(segment+1)%points.length],land=routeSafe?{x:anchor.x+((a.x+(b.x-a.x)*t)-anchor.x)*wander,y:anchor.y+((a.y+(b.y-a.y)*t)-anchor.y)*wander}:anchor,angle=time*.025+index*1.4,swim={x:615+Math.sin(angle)*27+(index?12:0),y:477+Math.cos(angle)*15+(index?6:0)};return {x:land.x+(swim.x-land.x)*water,y:land.y+(swim.y-land.y)*water};};
 const p=position(elapsed),next=position(elapsed+.08),ground=!inWater(p),moving=Math.hypot(next.x-p.x,next.y-p.y)>.012;
 return {...p,phase,ground,walking:ground&&moving&&phase!=='resting',facing:(next.x-p.x<-.001?-1:1) as 1|-1,stride:ground&&moving?elapsed*7+index*2:0};
}
