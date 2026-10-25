import type {Snapshot} from './storage';
import {crops} from './economy';
import {goods,extras} from './estate';
import {researchMaterials} from './research';
export type Chest={x:number;y:number;items:Record<string,number>};
export type ChestStorage={packed:number;placed:Chest[]};
export const emptyChests=():ChestStorage=>({packed:0,placed:[]});
export const chestKeys=[...crops.map(k=>`seed:${k}`),...crops.map(k=>`crop:${k}`),...goods.map(k=>`good:${k}`),...extras.map(k=>`extra:${k}`),...researchMaterials.map(k=>`research:${k}`),'material:wood','material:stone','material:weed','special:birdhouse'];
export const occupiedSlots=(items:Record<string,number>)=>Object.values(items).reduce((sum,n)=>sum+Math.ceil(n/99),0);
export function validChests(v:unknown):v is ChestStorage{
 if(!v||typeof v!=='object')return false;const s=v as ChestStorage;
 return Number.isSafeInteger(s.packed)&&s.packed>=0&&s.packed<=999&&Array.isArray(s.placed)&&s.placed.length<=200&&s.placed.every(c=>c&&Number.isFinite(c.x)&&Number.isFinite(c.y)&&c.x>=-376&&c.x<=1176&&(c.y>=-300&&c.y<=560||c.y>=3930&&c.y<=4210)&&!!c.items&&typeof c.items==='object'&&!Array.isArray(c.items)&&Object.entries(c.items).every(([k,n])=>chestKeys.includes(k)&&Number.isSafeInteger(n)&&n>0&&n<=2376&&(k!=='special:birdhouse'||n===1))&&occupiedSlots(c.items)<=24);
}
export function inventoryCounts(s:Snapshot):Record<string,number>{return Object.fromEntries(chestKeys.map(k=>[k,itemAccount(s,k).value]));}
function itemAccount(s:Snapshot,key:string){
 const [group,id]=key.split(':');if(group==='special')return {value:s.story.giftReceived&&!s.story.birdhouse&&!s.skill.birdhouseStored?1:0,set:(n:number)=>{s.skill.birdhouseStored=n===0;}};const account:Record<string,number>=group==='seed'?s.seeds:group==='crop'?s.produce:group==='good'?s.travel.estate.goods:group==='extra'?s.travel.estate.produce:group==='research'?s.travel.research.materials:group==='material'?s.clearing as unknown as Record<string,number>:s.travel.research as unknown as Record<string,number>;
 return {value:account[id],set:(n:number)=>{account[id]=n;}};
}
export function craftChest(s:Snapshot):Snapshot|null{
 if(!s.skill.chestBlueprint||s.clearing.wood<20||s.travel.research.materials.scrap<5)return null;
 const next=structuredClone(s);next.skill.chests??=emptyChests();if(next.skill.chests.packed>=999)return null;
 next.clearing.wood-=20;next.travel.research.materials.scrap-=5;next.skill.chests.packed++;return next;
}
export function transferChest(s:Snapshot,index:number,key:string,deposit:boolean,one=false):Snapshot|null{
 if(!chestKeys.includes(key))return null;const next=structuredClone(s),chest=next.skill.chests?.placed[index];if(!chest)return null;
 const account=itemAccount(next,key),available=deposit?account.value:chest.items[key]??0;
 if(!available)return null;let amount=one?1:available;
 if(deposit){const other=occupiedSlots(chest.items)-Math.ceil((chest.items[key]??0)/99);amount=Math.min(amount,(24-other)*99-(chest.items[key]??0));}else amount=Math.min(amount,999999-account.value);
 if(amount<=0)return null;
 account.set(account.value+(deposit?-amount:amount));const n=(chest.items[key]??0)+(deposit?amount:-amount);if(n)chest.items[key]=n;else delete chest.items[key];return next;
}

export const backpackSlots=(s:Snapshot)=>occupiedSlots(inventoryCounts(s))+Math.ceil((s.skill.chests?.packed??0)/99);
export const canCarryChange=(before:Snapshot,after:Snapshot)=>backpackSlots(after)<=Math.max(16,backpackSlots(before));
