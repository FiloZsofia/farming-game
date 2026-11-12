import {foundationOffsets} from './pond-foundation';
import type {Snapshot} from './storage';
import {farmLayout,farmBounds} from './layout';
import {ORIGINAL_POND_AREA,pondArea,pondOutline,pondWaterAt,pondShoreAt,validPondExpansion,smoothPondExpansion} from './pond-shape';
import {activeDebris} from './cleanup';
import {createGarden} from './gardening';
import {junkSites,junkPoint,junkPlacementRadius} from './junk-sites';
export const pondExpansionPrice={gold:950,stone:160};
export function pondExpansionCost(before:readonly number[],after:readonly number[],foundation:readonly number[]=[]){const area=Math.max(0,pondArea(after)-pondArea(before)),ratio=area/pondArea(foundation);return{area,gold:Math.ceil(ratio*pondExpansionPrice.gold-1e-8),stone:Math.ceil(ratio*pondExpansionPrice.stone-1e-8),percent:ratio*100};}
export function pondExpansionError(s:Snapshot,after:readonly number[],reshaping=false):string|null{
 const before=s.travel.estate.pondExpansion??[];
 if(!validPondExpansion(after,foundationOffsets(s.travel.estate)))return 'A tó legfeljebb kétszeresére és az eredeti parttól legfeljebb 100 távolságegységnyire bővíthető, a telekhatáron belül.';
 if(!reshaping&&after.some((n,i)=>n<(before[i]??0)-1e-7))return 'A meglévő tó nem tölthető vissza.';
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
 const before=s.travel.estate.pondExpansion??[],cost=pondExpansionCost(before,after,foundationOffsets(s.travel.estate));
 if(cost.area<1||pondExpansionError(s,after)||s.economy.gold<cost.gold||s.clearing.stone<cost.stone)return null;
 const paid=pondRefund(s),next=structuredClone(s);next.travel.estate.pondPaid={gold:paid.gold+cost.gold,stone:paid.stone+cost.stone};next.economy.gold-=cost.gold;next.clearing.stone-=cost.stone;next.travel.estate.pondExpansion=[...after];next.travel.estate.pondSmoothed=true;return next;
}

/** Upgrade a legacy shoreline without a purchase or moving any placed object. */
export function settlePondShore(s:Snapshot){
 const estate=s.travel.estate,before=estate.pondExpansion;
 if(!before||estate.pondSmoothed)return s;
 const smooth=smoothPondExpansion(before),target=pondArea(before);
 // Search progressively gentler blends where existing shores are crowded.
 for(const blend of [1,.75,.5,.25,.125,.0625]){
  const shape=before.map((n,i)=>n+(smooth[i]-n)*blend);
  // Blending radii changes area slightly; compensate within the same outline.
  let lo=0,hi=2;for(let k=0;k<50;k++){const scale=(lo+hi)/2;if(pondArea(shape.map(n=>Math.min(100,n*scale)))<target)lo=scale;else hi=scale;}
  const candidate=shape.map(n=>Math.min(100,n*(lo+hi)/2));
  if(pondExpansionError(s,candidate,true))continue;
  if(estate.pond.some(p=>p.kind==='duckNest'?!pondShoreAt(p.x,p.y,candidate):pondWaterAt(p.x,p.y,before)&&!pondWaterAt(p.x,p.y,candidate)))continue;
  const next=structuredClone(s);next.travel.estate.pondExpansion=candidate;next.travel.estate.pondSmoothed=true;return next;
 }
 // Keep a valid crowded save intact; retry when its surroundings change.
 return s;
}

/** Old saves predate the payment ledger; use the agreed area price for those. */
export function pondRefund(s:Snapshot){const paid=s.travel.estate.pondPaid;if(paid)return {...paid};const area=Math.max(0,pondArea(s.travel.estate.pondExpansion??[])-pondArea(foundationOffsets(s.travel.estate))),ratio=area/ORIGINAL_POND_AREA;return {gold:Math.ceil(ratio*1800-1e-8),stone:Math.ceil(ratio*250-1e-8)};}
export function pondRemovalError(s:Snapshot){
 if(pondArea(s.travel.estate.pondExpansion??[])-pondArea(foundationOffsets(s.travel.estate))<1)return 'Nincs visszabontható tóbővítés.';
 if(s.travel.estate.pond.some(p=>p.kind==='duckNest'?!pondShoreAt(p.x,p.y,foundationOffsets(s.travel.estate)):!pondWaterAt(p.x,p.y,foundationOffsets(s.travel.estate))))return 'Előbb vedd vissza Bontóvassal a bővített részen lévő vízinövényeket és fészket.';
 const refund=pondRefund(s);if(s.economy.gold+refund.gold>999999||s.clearing.stone+refund.stone>999999)return 'Előbb szabadíts fel helyet a visszajáró goldnak vagy kőnek.';
 return null;
}
export function removePondExpansion(s:Snapshot){
 if(pondRemovalError(s))return null;const next=structuredClone(s),refund=pondRefund(s);
 next.economy.gold+=refund.gold;next.clearing.stone+=refund.stone;
 if(next.travel.estate.pondFoundation){next.travel.estate.pondExpansion=[...foundationOffsets(next.travel.estate)];next.travel.estate.pondPaid={gold:0,stone:0};next.travel.estate.pondSmoothed=true;}else{delete next.travel.estate.pondExpansion;delete next.travel.estate.pondPaid;delete next.travel.estate.pondSmoothed;}return next;
}
