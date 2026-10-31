import {createCrafting} from './crafting';
import type {Snapshot} from './storage';
export const larchCones={x:-775,y:2860};
export const larchConesReady=(picked:number|undefined,day:number)=>picked===undefined||day-picked>=3;
export function gatherLarchCones(s:Snapshot,picked:number|undefined,day:number,random= Math.random){
 if(!larchConesReady(picked,day))return null;
 const count=random()<.5?2:3,next=structuredClone(s);next.travel.crafting??=createCrafting();
 const held=next.travel.crafting.items.larchCone??0;if(held+count>999999)return null;
 next.travel.crafting.items.larchCone=held+count;return {snapshot:next,count,pickedDay:day};
}
