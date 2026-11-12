import type {Snapshot} from './storage';
import {farmLayout,farmBounds} from './layout';
import {ORIGINAL_POND_AREA,pondArea,pondOutline,pondWaterAt,validPondExpansion} from './pond-shape';
import {activeDebris} from './cleanup';
import {createGarden} from './gardening';
import {junkSites,junkPoint,junkPlacementRadius} from './junk-sites';
export const pondExpansionPrice={gold:1800,stone:250};
export function pondExpansionCost(before:readonly number[],after:readonly number[]){const area=Math.max(0,pondArea(after)-pondArea(before)),ratio=area/ORIGINAL_POND_AREA;return{area,gold:Math.ceil(ratio*pondExpansionPrice.gold-1e-8),stone:Math.ceil(ratio*pondExpansionPrice.stone-1e-8),percent:ratio*100};}
export function pondExpansionError(s:Snapshot,after:readonly number[]):string|null{
 const before=s.travel.estate.pondExpansion??[];
 if(!validPondExpansion(after))return 'A tó legfeljebb kétszeresére és az eredeti parttól legfeljebb 100 távolságegységnyire bővíthető, a telekhatáron belül.';
 if(after.some((n,i)=>n<(before[i]??0)))return 'A meglévő tó nem tölthető vissza.';
 const boxes:{x:number;y:number;w:number;h:number}[]=[farmLayout.houseBounds,farmLayout.shedBounds,farmLayout.porchBounds,farmLayout.porchSteps,farmLayout.dock,{...farmLayout.mailbox},farmLayout.catalog,farmLayout.journal];
 const circles:{x:number;y:number;r:number}[]=[];
 for(const bed of s.travel.homestead?.garden.beds??[]){boxes.push({x:bed.area.x-10,y:bed.area.y-10,w:bed.area.w+20,h:bed.area.h+20});if(bed.marker)boxes.push({x:bed.marker.x-36,y:bed.marker.y-34,w:72,h:46});if(bed.irrigation)circles.push({...bed.irrigation,r:20});}
 for(const p of s.travel.homestead?.garden.paths??[])circles.push({...p,r:18});
 for(const t of s.travel.estate.trees)boxes.push({x:t.x-30,y:t.y-85,w:60,h:96});
 for(const p of s.travel.estate.pond)if(p.kind==='duckNest')circles.push({...p,r:23});
 for(const m of s.travel.crafting?.machines??[])circles.push({...m,r:25});
 for(const c of s.skill.chests?.placed??[])boxes.push({x:c.x-25,y:c.y-22,w:50,h:44});
 if(s.story.birdhouse)circles.push({...s.story.birdhouse,r:25});
 circles.push({...s.player,r:14});
 const garden={...createGarden(),plots:new Map(s.plots)};
 for(const d of activeDebris(s.clearing,garden))circles.push({x:d.x,y:d.y,r:d.kind==='weed'?16:26});
 for(const j of junkSites)circles.push({...junkPoint(s.clearing,j.id),r:junkPlacementRadius(j.id)});
 const protectedPoint=(x:number,y:number)=>boxes.some(b=>x>=b.x-7&&x<=b.x+b.w+7&&y>=b.y-7&&y<=b.y+b.h+7)||circles.some(p=>Math.hypot(x-p.x,y-p.y)<p.r)||farmLayout.paths.some(path=>path.points.slice(1).some((b,i)=>{const a=path.points[i],dx=b[0]-a[0],dy=b[1]-a[1],t=Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/(dx*dx+dy*dy||1)));return Math.hypot(x-a[0]-t*dx,y-a[1]-t*dy)<path.width/2+10;}));
 const outline=pondOutline(after,8),minX=Math.min(...outline.map(p=>p.x)),maxX=Math.max(...outline.map(p=>p.x)),minY=Math.min(...outline.map(p=>p.y)),maxY=Math.max(...outline.map(p=>p.y));
 for(let y=minY;y<=maxY;y+=5)for(let x=minX;x<=maxX;x+=5)if(pondWaterAt(x,y,after,1.06)&&!pondWaterAt(x,y,before,1.06)&&protectedPoint(x,y))return 'A kijelölt part épületet, ösvényt, növényt vagy lerakott tárgyat érint. Húzd vissza a rajzot.';
 return null;
}
export function expandPond(s:Snapshot,after:readonly number[]){
 const before=s.travel.estate.pondExpansion??[],cost=pondExpansionCost(before,after);
 if(cost.area<1||pondExpansionError(s,after)||s.economy.gold<cost.gold||s.clearing.stone<cost.stone)return null;
 const next=structuredClone(s);next.economy.gold-=cost.gold;next.clearing.stone-=cost.stone;next.travel.estate.pondExpansion=[...after];return next;
}
