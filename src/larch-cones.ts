import {createCrafting} from './crafting';
import {inLarchGlade,larchGroundDrop,gladePool,resinTree} from './larch-glade';
import type {Snapshot} from './storage';
export type FallenCone={id:number;x:number;y:number;angle:number;picked:boolean};
export type ConePatch={cones:FallenCone[];readyDay:number|null};
export type ConeState={conePatch?:ConePatch;conePickedDay?:number};
export function scatterLarchCones(random=Math.random):ConePatch{
 const count=random()<.5?2:3,cones:FallenCone[]=[];
 for(let id=0;id<count;id++){
  let point={x:-940+id*76,y:2842-id*24};
  for(let attempt=0;attempt<160;attempt++){
   const p={x:-820+(random()*2-1)*146,y:2801+(random()*2-1)*81};
   if(!inLarchGlade(p.x,p.y)||larchGroundDrop(p.x,p.y)<8||Math.abs(p.x-resinTree.x)<36&&p.y<resinTree.y+22||Math.hypot(p.x-resinTree.x,p.y-resinTree.y)<68||((p.x-gladePool.x)/62)**2+((p.y-gladePool.y)/32)**2<1||p.y>2866&&p.x> -887&&p.x< -746||Math.hypot(p.x+976,p.y-2850)<45||cones.some(c=>Math.hypot(p.x-c.x,p.y-c.y)<48))continue;
   point=p;break;
  }
  cones.push({id,...point,angle:(random()*2-1)*1.25,picked:false});
 }
 return {cones,readyDay:null};
}
export function availableLarchCones(state:ConeState,day:number,random=Math.random){
 if(!state.conePatch){state.conePatch=state.conePickedDay===undefined?scatterLarchCones(random):{cones:[],readyDay:state.conePickedDay+3};}
 if(state.conePatch.readyDay!==null&&day>=state.conePatch.readyDay)state.conePatch=scatterLarchCones(random);
 return state.conePatch.cones.filter(c=>!c.picked);
}
export const coneVisualPoint=(c:FallenCone)=>({x:c.x,y:c.y+larchGroundDrop(c.x,c.y)});
export function gatherLarchCone(s:Snapshot,patch:ConePatch,id:number,day:number){
 const cone=patch.cones.find(c=>c.id===id&&!c.picked);if(!cone)return null;
 const next=structuredClone(s);next.travel.crafting??=createCrafting();const held=next.travel.crafting.items.larchCone??0;if(held>=999999)return null;
 next.travel.crafting.items.larchCone=held+1;const updated=structuredClone(patch);updated.cones.find(c=>c.id===id)!.picked=true;if(updated.cones.every(c=>c.picked))updated.readyDay=day+3;
 return {snapshot:next,patch:updated};
}
