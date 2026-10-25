import type {Snapshot} from './storage';
import {farmLayout} from './layout';
import {legacyBeds} from './legacy-garden-grid';
import {TILE,cultivable,tileKey,targetTile} from './gardening';
// Preserve each plot and flower; larger cells may need the closest free patch of land.
export function enlargeGarden(old:Snapshot):Snapshot|null{
 const next=structuredClone(old);next.version=18;const placed=new Set<string>(),mapping=new Map<string,string>();
 const protectedPoint=(x:number,y:number)=>{const cx=x+TILE/2,cy=y+TILE/2;return !!next.story.birdhouse&&Math.hypot(cx-next.story.birdhouse.x,cy-next.story.birdhouse.y)<28||(next.skill.chests?.placed??[]).some(c=>Math.abs(cx-c.x)<36&&Math.abs(cy-c.y)<27)||next.travel.estate.trees.some(t=>Math.hypot(cx-t.x,cy-t.y)<35);};
 next.plots=[];
 for(const [key,plot]of old.plots){const [x,y]=key.split(',').map(Number),index=legacyBeds.findIndex(b=>x>=b.x+4&&x< b.x+52&&y>=b.y+2&&y<b.y+34);let origin={x:Math.floor(x/TILE)*TILE,y:Math.floor(y/TILE)*TILE};
  if(index>=0){const b=legacyBeds[index],n=farmLayout.beds[index];origin={x:n.x+4+Math.floor((x-b.x-4)/16)*TILE,y:n.y+2+Math.floor((y-b.y-2)/16)*TILE};}
  let point:{x:number;y:number}|null=null;
  const valid=(p:{x:number;y:number})=>!placed.has(tileKey(p))&&tileKey(targetTile(p.x+1,p.y+1))===tileKey(p)&&cultivable(p)&&!protectedPoint(p.x,p.y);
  if(valid(origin))point=origin;
  for(let radius=0;!point&&radius<=100;radius++){const base={x:Math.floor(origin.x/TILE)*TILE,y:Math.floor(origin.y/TILE)*TILE};for(let dx=-radius;dx<=radius&&!point;dx++)for(let dy=-radius;dy<=radius;dy++){if(Math.max(Math.abs(dx),Math.abs(dy))!==radius)continue;const candidate={x:base.x+dx*TILE,y:base.y+dy*TILE};if(valid(candidate)){point=candidate;break;}}}
  if(!point)return null;const newKey=tileKey(point);placed.add(newKey);mapping.set(key,newKey);next.plots.push([newKey,structuredClone(plot)]);
 }
 for(const flower of next.travel.research.flowers){const key=mapping.get(tileKey(flower));if(!key)return null;const [x,y]=key.split(',').map(Number);flower.x=x;flower.y=y;}
 next.skill.credited=next.skill.credited.map(credit=>{for(const [a,b]of mapping)if(credit.endsWith(`:${a}`))return credit.slice(0,-a.length)+b;return credit;});
 return next;
}
