import {animalApproach,gatePoint,inAnimalPolygon,penWalkRoute} from './livestock-geometry';
import type {AnimalPen,AnimalPoint as P,Hen} from './livestock';
export type HenMotion={p:P;route:P[];activity:string;choice:number;look:number;dwell:number};
/** Finish the journey, then spend time using the fixture before selecting another task. */
export function updateHenBehavior(pen:AnimalPen,hen:Hen,m:HenMotion,dt:number,night:boolean,actor:P,day:number,trees:readonly P[]=[]){
 const choice=night?-2:m.choice<0?hen.id%5:m.route.length||m.dwell>0?m.choice:(m.choice+1)%5;
 if(choice!==m.choice){m.choice=choice;let target=animalApproach('coop',pen.coop);m.activity='peck';m.dwell=8;
  if(night){target=pen.fixtures.perch?animalApproach('perch',pen.fixtures.perch,pen.rotations?.perch):target;m.activity='rest';m.dwell=Infinity;}
  else if(choice===0&&pen.fixtures.feeder){target={x:pen.fixtures.feeder.x-7,y:pen.fixtures.feeder.y+16};m.activity=pen.feed>0?'eat':'stand';}
  else if(choice===1&&pen.fixtures.drinker){target={x:pen.fixtures.drinker.x-7,y:pen.fixtures.drinker.y+17};m.activity=pen.wateredDay===day?'drink':'stand';}
  else if(choice===2&&pen.fixtures.dustBath){target={x:pen.fixtures.dustBath.x+Math.sin(hen.id)*8,y:pen.fixtures.dustBath.y+5};m.activity='dust';}
  else if(choice===3&&pen.fixtures.shade){target={x:pen.fixtures.shade.x+Math.sin(hen.id)*12,y:pen.fixtures.shade.y+2};m.activity='rest';m.dwell=12;}
  else{const gate=gatePoint(pen);if(hen.personality==='curious'&&gate)target=gate;else if(hen.personality==='bold'&&inAnimalPolygon(actor,pen.boundary))target={...actor};else for(let i=0;i<12;i++){const p={x:pen.coop.x+Math.sin(hen.id*7+choice+i)*70,y:pen.coop.y+40+Math.cos(hen.id+choice+i)*45};if(inAnimalPolygon(p,pen.boundary)&&(hen.personality!=='shy'||Math.hypot(p.x-actor.x,p.y-actor.y)>45)){target=p;break;}}}
  const route=penWalkRoute(pen,m.p,target,trees);m.route=route?.slice(1)??[];if(!route){m.activity='stand';m.dwell=1;}
 }
 let remaining=Math.max(0,Math.min(dt,.1)),walking=false;
 while(m.route.length&&remaining>0){const p=m.route[0],distance=Math.hypot(p.x-m.p.x,p.y-m.p.y);if(distance<.001){m.p={...p};m.route.shift();continue;}m.look=p.x<m.p.x?-1:p.x>m.p.x?1:m.look;const seconds=distance/17;if(seconds<=remaining){m.p={...p};m.route.shift();remaining-=seconds;}else{m.p.x+=(p.x-m.p.x)/distance*remaining*17;m.p.y+=(p.y-m.p.y)/distance*remaining*17;remaining=0;}walking=true;}
 if(!m.route.length){m.dwell=Math.max(0,m.dwell-remaining);if(['eat','drink'].includes(m.activity))m.look=1;}
 return walking;
}
