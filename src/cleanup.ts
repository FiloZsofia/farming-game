import {blocked} from './movement';
import {farmLayout,farmBounds} from './layout';
import type {Garden} from './gardening';
export type ClearingTool='hand'|'axe'|'pickaxe';
export type Clearing={removed:Record<string,number>;positions:Record<string,{x:number;y:number}>;wood:number;stone:number;weed:number};
export const createClearing=():Clearing=>({removed:{},positions:{},wood:0,stone:0,weed:0});
const originalDebris=[
 {id:'rock-a',kind:'rock',x:86,y:365,scale:1},{id:'rock-b',kind:'rock',x:529,y:291,scale:1},{id:'rock-c',kind:'rock',x:451,y:501,scale:1.1},{id:'rock-d',kind:'rock',x:102,y:330,scale:.5},{id:'rock-e',kind:'rock',x:551,y:265,scale:.55},
 {id:'branch-a',kind:'branch',x:312,y:435,scale:1},{id:'branch-b',kind:'branch',x:390,y:466,scale:1},{id:'branch-c',kind:'branch',x:105,y:406,scale:1},
 {id:'weed-a',kind:'weed',x:112,y:300,scale:1},{id:'weed-b',kind:'weed',x:137,y:445,scale:1},{id:'weed-c',kind:'weed',x:290,y:450,scale:1},{id:'weed-d',kind:'weed',x:360,y:420,scale:1},
] as const;
// Stable IDs and coordinates add reclaimable land to existing saves without resetting it.
function expansionDebris(){
 let seed=3891;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 const result:{id:string;kind:'weed'|'branch'|'rock';x:number;y:number;scale:number}[]=[];
 for(let i=0;i<72;i++)for(let attempt=0;attempt<160;attempt++){
  const zone=i%3,x=Math.round(zone===0?-345+random()*280:zone===1?855+random()*280:35+random()*730),y=Math.round(zone===2?-282+random()*210:-245+random()*780);
  if(result.some(p=>Math.hypot(p.x-x,p.y-y)<47))continue;
  result.push({id:`expansion-${i}`,kind:(['weed','branch','rock'] as const)[Math.floor(i/3)%3],x,y,scale:.65+random()*.36});break;
 }
 return result;
}
const expandedDebris=expansionDebris();
export const debris=[...originalDebris,...expandedDebris];

export type Debris={id:typeof debris[number]['id'];kind:'rock'|'branch'|'weed';x:number;y:number;scale:number};
export const neededTool={rock:'pickaxe',branch:'axe',weed:'hand'} as const;
export const debrisNames={rock:'Kő',branch:'Faág',weed:'Gaz'};
export function hasPlantAt(item:Debris,garden:Garden){return [...garden.plots.keys()].some(key=>{const [x,y]=key.split(',').map(Number);return Math.abs(x+8-item.x)<(item.kind==='rock'?24:20)&&Math.abs(y+8-item.y)<20;});}
export const activeDebris=(state:Clearing,garden:Garden)=>debris.map(item=>({...item,...state.positions[item.id]})).filter(item=>state.removed[item.id]===undefined&&!hasPlantAt(item,garden));
export function debrisAt(state:Clearing,garden:Garden,x:number,y:number){return activeDebris(state,garden).find(item=>Math.hypot(item.x-x,item.y-y)<(item.kind==='weed'?15:24));}
export function clearDebris(state:Clearing,item:Debris,tool:string,player:{x:number;y:number},day:number):Clearing|null{
 if(state.removed[item.id]!==undefined||tool!==neededTool[item.kind]||Math.hypot(player.x-item.x,player.y-item.y)>44)return null;
 return {positions:structuredClone(state.positions),removed:{...state.removed,[item.id]:day},wood:state.wood+(item.kind==='branch'?1:0),stone:state.stone+(item.kind==='rock'?1:0),weed:state.weed+(item.kind==='weed'?1:0)};
}
export function validClearing(value:unknown):value is Clearing{
 if(!value||typeof value!=='object')return false;const s=value as Clearing;
 if(!s.positions||typeof s.positions!=='object'||Array.isArray(s.positions)||!Object.entries(s.positions).every(([id,p])=>debris.some(item=>item.id===id)&&p&&Number.isFinite(p.x)&&Number.isFinite(p.y)&&p.x>=farmBounds.left+40&&p.x<=farmBounds.right-40&&p.y>=farmBounds.top+48&&p.y<=560&&!blocked(p.x,p.y)))return false;
 return Number.isSafeInteger(s.weed)&&s.weed>=0&&s.weed<=999999&&Number.isSafeInteger(s.wood)&&s.wood>=0&&s.wood<=999999&&Number.isSafeInteger(s.stone)&&s.stone>=0&&s.stone<=999999&&!!s.removed&&typeof s.removed==='object'&&!Array.isArray(s.removed)&&Object.entries(s.removed).every(([id,day])=>debris.some(d=>d.id===id)&&Number.isSafeInteger(day)&&day>=1);
}
// Three-day renewal chooses a new, persisted place; occupied areas remain protected.
function pathDistance(x:number,y:number,a:readonly number[],b:readonly number[]){const dx=b[0]-a[0],dy=b[1]-a[1],t=Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/(dx*dx+dy*dy)));return Math.hypot(x-a[0]-t*dx,y-a[1]-t*dy);}
export function regrowDebris(state:Clearing,day:number,garden:Garden,fixture:{x:number;y:number}|null=null,random=Math.random,protectedPlaces:readonly {x:number;y:number}[]=[]):Clearing{
 const next=structuredClone(state);
 const boxes=[...farmLayout.beds,farmLayout.mailbox,farmLayout.shipping,farmLayout.catalog,farmLayout.journal,farmLayout.dock,{x:487,y:245,w:17,h:102},{x:28,y:495,w:104,h:34},{x:211,y:511,w:230,h:34},{x:433,y:172,w:105,h:34},{x:691,y:217,w:80,h:34}];
 for(const item of debris){
  const removed=next.removed[item.id];if(removed===undefined||day-removed<3)continue;
  const old=next.positions[item.id]??item;
  for(let attempt=0;attempt<160;attempt++){
   const point={x:Math.round(farmBounds.left+48+random()*(farmBounds.right-farmBounds.left-96)),y:Math.round(farmBounds.top+56+random()*(560-farmBounds.top-56))};
   if(protectedPlaces.some(p=>Math.hypot(p.x-point.x,p.y-point.y)<48))continue;
   if(Math.hypot(point.x-old.x,point.y-old.y)<52||fixture&&Math.hypot(point.x-fixture.x,point.y-fixture.y)<38)continue;
   if([[0,0],[-20,-14],[20,14],[-20,14],[20,-14]].some(([dx,dy])=>blocked(point.x+dx,point.y+dy)))continue;
   if(boxes.some(b=>point.x>b.x-24&&point.x<b.x+b.w+24&&point.y>b.y-21&&point.y<b.y+b.h+21))continue;
   if(farmLayout.paths.some(path=>path.points.slice(1).some((b,i)=>pathDistance(point.x,point.y,path.points[i],b)<path.width/2+23)))continue;
   if(hasPlantAt({...item,...point},garden)||activeDebris(next,garden).some(other=>Math.hypot(point.x-other.x,point.y-other.y)<38))continue;
   next.positions[item.id]=point;delete next.removed[item.id];break;
  }
 }
 return next;
}
