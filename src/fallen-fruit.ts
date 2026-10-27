import {createCrafting} from './crafting';
import type {Garden} from './gardening';
import type {Snapshot} from './storage';
import type {Travel} from './travel';
export function addFruitFall(travel:Travel,x:number,y:number,count:number){
 travel.fallenFruit??=[];const pile=travel.fallenFruit.find(p=>p.x===x&&p.y===y);
 if(pile)pile.count=Math.min(999999,pile.count+count);else travel.fallenFruit.push({x,y,count});
}
export function collectFruitFalls(before:Garden,after:Garden,oldTravel:Travel,next:Travel){
 for(const [key,p]of after.plots)if(p.fruitAftermath==='fallen'&&before.plots.get(key)?.fruitAftermath!=='fallen'){
  const [x,y]=key.split(',').map(Number);addFruitFall(next,x+12,y+12,1);
 }
 oldTravel.estate.trees.forEach((t,i)=>{if(t.fruit>0&&next.estate.trees[i]?.bloomState==='fallen')addFruitFall(next,t.x,t.y+8,t.fruit);});
}
export function pickFallenFruit(s:Snapshot,index:number){
 const pile=s.travel.fallenFruit?.[index];if(!pile||(s.travel.crafting?.items.fallenFruit??0)+pile.count>999999)return null;
 const n=structuredClone(s);n.travel.crafting??=createCrafting();n.travel.crafting.items.fallenFruit=(n.travel.crafting.items.fallenFruit??0)+pile.count;n.travel.fallenFruit!.splice(index,1);return n;
}
