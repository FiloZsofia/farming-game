import type {Garden} from './gardening';
export type ClearingTool='hand'|'axe'|'pickaxe';
export type Clearing={removed:Record<string,number>;wood:number;stone:number;weed:number};
export const createClearing=():Clearing=>({removed:{},wood:0,stone:0,weed:0});
export const debris=[
 {id:'rock-a',kind:'rock',x:86,y:365,scale:1},{id:'rock-b',kind:'rock',x:529,y:291,scale:1},{id:'rock-c',kind:'rock',x:451,y:501,scale:1.1},{id:'rock-d',kind:'rock',x:102,y:330,scale:.5},{id:'rock-e',kind:'rock',x:551,y:265,scale:.55},
 {id:'branch-a',kind:'branch',x:312,y:435,scale:1},{id:'branch-b',kind:'branch',x:390,y:466,scale:1},{id:'branch-c',kind:'branch',x:105,y:406,scale:1},
 {id:'weed-a',kind:'weed',x:112,y:300,scale:1},{id:'weed-b',kind:'weed',x:137,y:445,scale:1},{id:'weed-c',kind:'weed',x:290,y:450,scale:1},{id:'weed-d',kind:'weed',x:360,y:420,scale:1},
] as const;
export type Debris=typeof debris[number];
export const neededTool={rock:'pickaxe',branch:'axe',weed:'hand'} as const;
export const debrisNames={rock:'Kő',branch:'Faág',weed:'Gaz'};
export function hasPlantAt(item:Debris,garden:Garden){return [...garden.plots.keys()].some(key=>{const [x,y]=key.split(',').map(Number);return Math.abs(x+8-item.x)<(item.kind==='rock'?24:20)&&Math.abs(y+8-item.y)<20;});}
export const activeDebris=(state:Clearing,garden:Garden)=>debris.filter(item=>state.removed[item.id]===undefined&&!hasPlantAt(item,garden));
export function debrisAt(state:Clearing,garden:Garden,x:number,y:number){return activeDebris(state,garden).find(item=>Math.hypot(item.x-x,item.y-y)<(item.kind==='weed'?15:24));}
export function clearDebris(state:Clearing,item:Debris,tool:string,player:{x:number;y:number},day:number):Clearing|null{
 if(state.removed[item.id]!==undefined||tool!==neededTool[item.kind]||Math.hypot(player.x-item.x,player.y-item.y)>44)return null;
 return {removed:{...state.removed,[item.id]:day},wood:state.wood+(item.kind==='branch'?1:0),stone:state.stone+(item.kind==='rock'?1:0),weed:state.weed+(item.kind==='weed'?1:0)};
}
export function validClearing(value:unknown):value is Clearing{
 if(!value||typeof value!=='object')return false;const s=value as Clearing;
 return Number.isSafeInteger(s.weed)&&s.weed>=0&&s.weed<=999999&&Number.isSafeInteger(s.wood)&&s.wood>=0&&s.wood<=999999&&Number.isSafeInteger(s.stone)&&s.stone>=0&&s.stone<=999999&&!!s.removed&&typeof s.removed==='object'&&!Array.isArray(s.removed)&&Object.entries(s.removed).every(([id,day])=>debris.some(d=>d.id===id)&&Number.isSafeInteger(day)&&day>=1);
}
// Agreed decorative renewal: two mornings later, only on unworked ground.
export function regrowDebris(state:Clearing,day:number,garden:Garden,fixture:{x:number;y:number}|null=null):Clearing{
 const next=structuredClone(state);
 for(const item of debris){const removed=next.removed[item.id];if(removed!==undefined&&day-removed>=2&&!hasPlantAt(item,garden)&&(!fixture||Math.hypot(item.x-fixture.x,item.y-fixture.y)>32))delete next.removed[item.id];}
 return next;
}
