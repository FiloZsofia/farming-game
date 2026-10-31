import {pollinationDependent,setsFruit,RIPE_FRUIT_DAYS,type PollinationContext} from './pollination';
import { farmLayout,farmBounds } from './layout';
import { blocked } from './movement';
export const TILE=24;
export const cropNames={radish:'Retek',potato:'Burgonya',pea:'Borsó',strawberry:'Eper',honeyberry:'Mézbogyó',blueberry:'Áfonya',carrot:'Sárgarépa',lettuce:'Saláta',onion:'Hagyma'} as const;
export type Crop=keyof typeof cropNames;
export type Tool='hoe'|'water'|'harvest'|Crop;
// Agreed initial playtest values; revisit after playing.
export const growthRules={radish:3,potato:5,pea:6,peaRegrowth:3,strawberry:4,honeyberry:5,blueberry:6,fruitRegrowth:2,carrot:4,lettuce:2,onion:5};
export type Tile={x:number;y:number};
export type Plot={emptyDays?:number;bloomCycle?:number;fruitSet?:boolean;ripeDays?:number;fruitAftermath?:'empty'|'fallen';watered:boolean;crop:Crop|null;growth:number;regrowing:boolean;mulched?:boolean;moisture?:number};
export type Garden={plots:Map<string,Plot>;seeds:Record<Crop,number>;produce:Record<Crop,number>};
export const createGarden=():Garden=>({plots:new Map(),seeds:{radish:4,potato:4,pea:4,strawberry:0,honeyberry:0,blueberry:0,carrot:0,lettuce:0,onion:0},produce:{radish:0,potato:0,pea:0,strawberry:0,honeyberry:0,blueberry:0,carrot:0,lettuce:0,onion:0}});
export const tileKey=(tile:Tile)=>`${tile.x},${tile.y}`;
export function targetTile(x:number,y:number,plots?:ReadonlyMap<string,Plot>):Tile{
 // Preserve targeting of older meadow plots when extending a neighbouring grid.
 for(const key of plots?.keys()??[]){const [px,py]=key.split(',').map(Number);if(x>=px&&x<px+TILE&&y>=py&&y<py+TILE)return{x:px,y:py};}
 for(const b of farmLayout.beds){
  if(x>=b.x+4&&x<b.x+4+3*TILE&&y>=b.y+2&&y<b.y+2+2*TILE)
   return {x:b.x+4+Math.floor((x-b.x-4)/TILE)*TILE,y:b.y+2+Math.floor((y-b.y-2)/TILE)*TILE};
 }
 // The eastern meadow continues both right-hand beds, without reverting to
 // the global grid after the sprinkler's third cell. A small upper margin
 // keeps pointing beside the crop artwork on the same ground row.
 const eastern=farmLayout.beds.filter(b=>x>=b.x+b.w&&b.x===Math.max(...farmLayout.beds.map(b=>b.x)))
  .flatMap(b=>[b.y+2,b.y+2+TILE].map(py=>({x:b.x+4,y:py})))
  .filter(row=>Math.abs(y-row.y-TILE/2)<=TILE)
  .sort((a,b)=>Math.abs(y-a.y-TILE/2)-Math.abs(y-b.y-TILE/2))[0];
 if(eastern)return {x:eastern.x+Math.floor((x-eastern.x)/TILE)*TILE,y:eastern.y};
 // Continue the nearest raised-bed row across the surrounding meadow. Four
 // cells leave room for a sprinkler and its three crops on the outer side.
 const row=farmLayout.beds.filter(b=>y>=b.y+2&&y<b.y+2+2*TILE&&x>=b.x+4-4*TILE&&x<b.x+4+7*TILE)
  .sort((a,b)=>Math.max(a.x+4-x,0,x-a.x-4-3*TILE)-Math.max(b.x+4-x,0,x-b.x-4-3*TILE))[0];
 if(row)return {x:row.x+4+Math.floor((x-row.x-4)/TILE)*TILE,y:row.y+2+Math.floor((y-row.y-2)/TILE)*TILE};
 return {x:Math.floor(x/TILE)*TILE,y:Math.floor(y/TILE)*TILE};
}
function segmentDistance(x:number,y:number,a:readonly number[],b:readonly number[]){
 const dx=b[0]-a[0],dy=b[1]-a[1];const t=Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/(dx*dx+dy*dy)));
 return Math.hypot(x-a[0]-t*dx,y-a[1]-t*dy);
}
// Save validation must accept veranda plots created before the tilling restriction.
export function cultivable(tile:Tile,allowHistoricalPorch=false):boolean{
 const {x,y}=tile;
 if(!allowHistoricalPorch&&[farmLayout.porchBounds,farmLayout.porchSteps].some(b=>x<b.x+b.w&&x+TILE>b.x&&y<b.y+b.h&&y+TILE>b.y))return false;
 const bed=farmLayout.beds.find(b=>x>=b.x+4&&x+TILE<=b.x+4+3*TILE&&y>=b.y+2&&y+TILE<=b.y+2+2*TILE);
 if(bed)return true;
 // Free meadow can be cultivated throughout the farm, including beside beds.
 if(x<farmBounds.left+40||x+TILE>farmBounds.right-40||y<farmBounds.top+48||y+TILE>568)return false;
 // Keep the wooden frames clear even when a neighbouring row uses another grid.
 if(farmLayout.beds.some(b=>x<b.x+b.w&&x+TILE>b.x&&y<b.y+b.h&&y+TILE>b.y))return false;
 for(let px=x;px<=x+TILE;px+=4)for(let py=y;py<=y+TILE;py+=4){
  if(blocked(px,py))return false;
  for(const path of farmLayout.paths)for(let i=1;i<path.points.length;i++)
   if(segmentDistance(px,py,path.points[i-1],path.points[i])<path.width/2+3)return false;
 }
 return true;
}
export function waterPlot(plot:Plot){plot.watered=true;if(plot.mulched)plot.moisture=3;}
export const reachable=(tile:Tile,player:{x:number;y:number})=>Math.hypot(tile.x+TILE/2-player.x,tile.y+TILE/2-player.y)<=44;
export function work(garden:Garden,tool:Tool,tile:Tile,player:{x:number;y:number}):{ok:boolean;message:string}{
 if(!reachable(tile,player))return {ok:false,message:'Sétálj közelebb a kijelölt földkockához.'};
 if(!cultivable(tile))return {ok:false,message:'Itt nem művelhető a talaj. Próbáld az ágyásokat vagy a szabad rétet.'};
 const key=tileKey(tile),plot=garden.plots.get(key);
 if(!plot&&[...garden.plots.keys()].some(k=>{const[px,py]=k.split(',').map(Number);return tile.x<px+TILE&&tile.x+TILE>px&&tile.y<py+TILE&&tile.y+TILE>py;}))return {ok:false,message:'Itt már van megművelt föld.'};
 if(tool==='harvest'){
  if(!plot?.crop)return {ok:false,message:'Itt még nincs betakarítható növény.'};
  if(!isRipe(plot))return {ok:false,message:'Ez a növény még fejlődik.'};
  const crop=plot.crop;
  if(garden.produce[crop]>=999999)return {ok:false,message:'A terménytároló megtelt.'};
  garden.produce[crop]++;plot.growth=0;if(pollinationDependent(crop)){plot.bloomCycle=(plot.bloomCycle??0)+1;delete plot.fruitSet;delete plot.ripeDays;delete plot.fruitAftermath;}
  if(['pea','strawberry','honeyberry','blueberry'].includes(crop))plot.regrowing=true;
  else {plot.crop=null;plot.regrowing=false;}
  return {ok:true,message:`Betakarítva: ${cropNames[crop]}.`};
 }
 if(tool==='hoe'){
  if(plot?.crop)return {ok:false,message:'Itt növény fejlődik; azt nem kapálom ki.'};
  if(plot){garden.plots.delete(key);return {ok:true,message:'A földet visszaegyengettem.'};}
  garden.plots.set(key,{watered:false,crop:null,growth:0,regrowing:false});return {ok:true,message:'A föld készen áll a vetésre.'};
 }
 if(!plot)return {ok:false,message:'Előbb ásd fel a földet a kapával.'};
 if(tool==='water'){
  if(plot.watered)return {ok:false,message:'Ez a föld már meg van öntözve.'};
  waterPlot(plot);return {ok:true,message:'Megöntözted a földet.'};
 }
 if(plot.crop)return {ok:false,message:'Ide már ültettél. Válassz egy üres földkockát.'};
 if(garden.seeds[tool]<=0)return {ok:false,message:'Ebből elfogyott az ültetőanyag.'};
 delete plot.emptyDays;plot.crop=tool;plot.growth=0;plot.regrowing=false;garden.seeds[tool]--;return {ok:true,message:`Elültetve: ${cropNames[tool]}.`};
}

export function growthTarget(plot:Plot,rules=growthRules){return plot.crop?(plot.regrowing?(plot.crop==='pea'?rules.peaRegrowth:rules.fruitRegrowth):rules[plot.crop]):0;}
export function isRipe(plot:Plot,rules=growthRules){return Boolean(plot.crop&&plot.fruitSet!==false&&plot.growth>=growthTarget(plot,rules));}
function restartFruitCycle(plot:Plot,aftermath:'empty'|'fallen'){
 plot.growth=0;plot.regrowing=true;plot.bloomCycle=(plot.bloomCycle??0)+1;plot.fruitAftermath=aftermath;delete plot.fruitSet;delete plot.ripeDays;
}
export function nextDayGarden(garden:Garden,rules=growthRules,ecology?:PollinationContext,occupied:ReadonlySet<string>=new Set()):Garden{
 return {seeds:{...garden.seeds},produce:{...garden.produce},plots:new Map([...garden.plots].flatMap(([key,p]):[string,Plot][]=>{
  const plot={...p};if(!plot.crop&&!occupied.has(key)){plot.emptyDays=(plot.emptyDays??0)+1;if(plot.emptyDays>=3)return [];}else delete plot.emptyDays;
  const berry=!!ecology&&pollinationDependent(plot.crop);let resting=false;if(berry)delete plot.fruitAftermath;
  if(berry&&isRipe(plot,rules)){
   plot.fruitSet=true;plot.ripeDays=(plot.ripeDays??-1)+1;
   if(plot.ripeDays>=RIPE_FRUIT_DAYS){restartFruitCycle(plot,'fallen');resting=true;}
  }else if(berry&&plot.fruitSet===false&&plot.growth>=growthTarget(plot,rules)){
   restartFruitCycle(plot,'empty');resting=true;
  }
  if(!resting&&plot.crop&&plot.watered&&!isRipe(plot,rules)){
   plot.growth=Math.min(growthTarget(plot,rules),plot.growth+1);
   if(berry&&plot.fruitSet===undefined&&plot.growth>=Math.ceil(growthTarget(plot,rules)*.65)){
    plot.fruitSet=setsFruit(ecology!.seed,`${key}:${plot.crop}`,plot.bloomCycle??0);delete plot.fruitAftermath;
   }
   if(berry&&isRipe(plot,rules))plot.ripeDays=0;
  }
  if(plot.mulched){plot.moisture=Math.max(0,(plot.moisture??(plot.watered?3:0))-1);plot.watered=plot.moisture>0;}else plot.watered=false;return [[key,plot]];
 }))};
}
