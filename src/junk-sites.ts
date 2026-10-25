import type {Snapshot} from './storage';
import type {Clearing} from './cleanup';
import {farmBounds,farmLayout} from './layout';
import {blocked} from './movement';
import {TILE} from './gardening';
export const junkSites=[{id:'vehicle',name:'Régi kerti járgány',x:-190,y:350},{id:'trailer',name:'Felborult utánfutó',x:980,y:210},{id:'workbench',name:'Összeroskadt munkapad',x:460,y:-150}] as const;
export type JunkId=typeof junkSites[number]['id'];
export type JunkProgress={part:number;hits:number;completedDay?:number;cycle?:number;revision?:2};
export type JunkStorage={junk?:Partial<Record<JunkId,JunkProgress>>;junkPositions?:Partial<Record<JunkId,{x:number;y:number}>>};
export const junkRenewDays=3;
export const junkScale=1.18;
export const junkParts=[{x:-34,y:6,stone:false},{x:0,y:8,stone:false},{x:32,y:8,stone:true},{x:-30,y:-12,stone:false}] as const;
export function junkProgress(c:Clearing,id:JunkId,day:number):JunkProgress{
 const old=c.junk?.[id];const p:JunkProgress=old?{...old,part:old.revision===2?old.part:Math.floor(old.part*4/6),revision:2}:{part:0,hits:0,revision:2};
 return p.part===4&&day-(p.completedDay??day)>=junkRenewDays?{part:0,hits:0,cycle:(p.cycle??0)+1,revision:2}:p;
}
export const junkPoint=(c:Clearing,id:JunkId)=>c.junkPositions?.[id]??junkSites.find(s=>s.id===id)!;
export const junkWorkPoint=(c:Clearing,id:JunkId,day:number)=>{const p=junkPoint(c,id),part=junkProgress(c,id,day).part,offset=junkParts[Math.min(3,part)];return{x:p.x+offset.x*junkScale,y:p.y+offset.y*junkScale};};
export const junkTool=(_part:number)=>'crowbar' as const;
export function strikeJunk(state:Snapshot,id:JunkId):{state:Snapshot;kind:'wood'|'stone';reward:boolean;complete:boolean}|null{
 if(!junkSites.some(s=>s.id===id))return null;const p=junkProgress(state.clearing,id,state.clock.day),target=junkWorkPoint(state.clearing,id,state.clock.day);if(p.part===4||Math.hypot(state.player.x-target.x,state.player.y-target.y)>78)return null;
 const next=structuredClone(state),stone=junkParts[p.part].stone;p.hits++;const reward=p.hits===3;if(reward){p.hits=0;p.part++;if(stone)next.clearing.stone+=6;else{next.clearing.wood+=4;next.travel.research.materials.scrap+=2;}if(p.part===4)p.completedDay=state.clock.day;}
 next.clearing.junk??={};next.clearing.junk[id]=p;return{state:next,kind:stone?'stone':'wood',reward,complete:p.part===4};
}
export function validJunk(c:JunkStorage){return(c.junk===undefined||!!c.junk&&typeof c.junk==='object'&&!Array.isArray(c.junk)&&Object.entries(c.junk).every(([id,p])=>junkSites.some(s=>s.id===id)&&p&&(p.revision===undefined||p.revision===2)&&Number.isSafeInteger(p.part)&&p.part>=0&&p.part<=(p.revision===2?4:6)&&Number.isSafeInteger(p.hits)&&p.hits>=0&&p.hits<=2&&(p.part!==(p.revision===2?4:6)||p.hits===0&&Number.isSafeInteger(p.completedDay)&&Number(p.completedDay)>=1)&&(p.completedDay===undefined||Number.isSafeInteger(p.completedDay)&&p.completedDay>=1)&&(p.cycle===undefined||Number.isSafeInteger(p.cycle)&&p.cycle>=0)))&&(c.junkPositions===undefined||!!c.junkPositions&&typeof c.junkPositions==='object'&&!Array.isArray(c.junkPositions)&&Object.entries(c.junkPositions).every(([id,p])=>junkSites.some(s=>s.id===id)&&p&&Number.isFinite(p.x)&&Number.isFinite(p.y)&&p.x>=farmBounds.left+80&&p.x<=farmBounds.right-80&&p.y>=farmBounds.top+70&&p.y<=510));}
export function prepareJunkSites(s:Snapshot):Clearing{
 const next=structuredClone(s.clearing);next.junkPositions??={};const chosen:{x:number;y:number}[]=[];
 for(const site of junkSites){const old=next.junkPositions[site.id];if(old){chosen.push(old);continue;}
  const free=(p:{x:number;y:number})=>Math.hypot(p.x-s.player.x,p.y-s.player.y)>100&&p.x>=farmBounds.left+80&&p.x<=farmBounds.right-80&&p.y>=farmBounds.top+70&&p.y<=510&&[[0,0],[-72,-38],[72,32],[-72,32],[72,-38]].every(([dx,dy])=>!blocked(p.x+dx,p.y+dy))&&s.plots.every(([key])=>{const[x,y]=key.split(',').map(Number);return Math.abs(x+TILE/2-p.x)>90||Math.abs(y+TILE/2-p.y)>65;})&&chosen.every(q=>Math.hypot(p.x-q.x,p.y-q.y)>180)&&(!s.story.birdhouse||Math.hypot(p.x-s.story.birdhouse.x,p.y-s.story.birdhouse.y)>110)&&(s.skill.chests?.placed??[]).every(q=>Math.hypot(p.x-q.x,p.y-q.y)>110)&&s.travel.estate.trees.every(q=>Math.hypot(p.x-q.x,p.y-q.y)>110)&&!farmLayout.paths.some(path=>path.points.some(([x,y])=>Math.hypot(x-p.x,y-p.y)<110));
  let point:{x:number;y:number}={x:site.x,y:site.y};for(let r=0;!free(point)&&r<40;r++){let found=false;for(let dx=-r;dx<=r&&!found;dx++)for(let dy=-r;dy<=r;dy++){if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;const candidate={x:site.x+dx*32,y:site.y+dy*32};if(free(candidate)){point=candidate;found=true;break;}}if(found)break;}
  if(free(point)){next.junkPositions[site.id]=point;chosen.push(point);}
 }
 return next;
}
export const junkAt=(c:Clearing,x:number,y:number)=>junkSites.find(s=>{const p=junkPoint(c,s.id);return Math.abs(p.x-x)<92&&Math.abs(p.y-y)<65;});
export const junkBlocks=(c:Clearing,x:number,y:number)=>junkSites.some(s=>{const p=junkPoint(c,s.id);return Math.abs(p.x-x)<67&&y>p.y-13&&y<p.y+28;});
