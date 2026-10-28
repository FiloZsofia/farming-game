import type {Snapshot} from './storage';
import {packMachine,blueprintNames} from './crafting';
import {packEmptyChest,canCarryChange} from './chests';
export type PlacedItem={kind:'machine'|'chest'|'birdhouse';index:number;x:number;y:number;name:string};
// All movable furniture uses this registry, independently of how it is inspected.
export function placedItemAt(s:Snapshot,p:{x:number;y:number}):PlacedItem|undefined{
 const items:PlacedItem[]=[...(s.travel.crafting?.machines??[]).map((m,index)=>({kind:'machine' as const,index,x:m.x,y:m.y,name:m.kind==='basket'?'Nádkosár':blueprintNames[m.kind]})),...(s.skill.chests?.placed??[]).map((c,index)=>({kind:'chest' as const,index,x:c.x,y:c.y,name:'Tárolóláda'}))];
 if(s.story.birdhouse)items.push({kind:'birdhouse',index:0,...s.story.birdhouse,name:'Madárodú'});
 return items.filter(t=>Math.hypot(t.x-p.x,t.y-p.y)<28).sort((a,b)=>Math.hypot(a.x-p.x,a.y-p.y)-Math.hypot(b.x-p.x,b.y-p.y))[0];
}
export function pickPlacedItem(s:Snapshot,t:PlacedItem):{state:Snapshot}|{error:string}{
 const current=placedItemAt(s,t);if(!current||current.kind!==t.kind||current.index!==t.index)return {error:'Ez a tárgy már nincs itt.'};
 if(Math.hypot(s.player.x-t.x,s.player.y-t.y)>48)return {error:'Sétálj közelebb.'};
 let next:Snapshot|null;
 if(t.kind==='machine'){
  const m=s.travel.crafting!.machines[t.index];if(m.started!==null)return {error:'A gép még dolgozik.'};if(m.ready)return {error:'Előbb vedd át az elkészült terméket.'};next=packMachine(s,t.index);
 }else if(t.kind==='chest'){
  if(Object.values(s.skill.chests!.placed[t.index].items).some(n=>n>0))return {error:'Előbb ürítsd ki a tárolóládát.'};next=packEmptyChest(s,t.index);
 }else{next=structuredClone(s);next.story.birdhouse=null;}
 if(!next||!canCarryChange(s,next))return {error:'Nincs elég hely a Készletben.'};
 return {state:next};
}
