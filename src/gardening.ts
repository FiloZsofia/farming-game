import { farmLayout } from './layout';
import { blocked } from './movement';
export const TILE=16;
export const cropNames={radish:'Retek',potato:'Burgonya',pea:'Borsó'} as const;
export type Crop=keyof typeof cropNames;
export type Tool='hoe'|'water'|Crop;
export type Tile={x:number;y:number};
export type Plot={watered:boolean;crop:Crop|null};
export type Garden={plots:Map<string,Plot>;seeds:Record<Crop,number>};
export const createGarden=():Garden=>({plots:new Map(),seeds:{radish:4,potato:4,pea:4}});
export const tileKey=(tile:Tile)=>`${tile.x},${tile.y}`;
export function targetTile(x:number,y:number):Tile{
 for(const b of farmLayout.beds){
  if(x>=b.x+4&&x<b.x+52&&y>=b.y+2&&y<b.y+34)
   return {x:b.x+4+Math.floor((x-b.x-4)/TILE)*TILE,y:b.y+2+Math.floor((y-b.y-2)/TILE)*TILE};
 }
 return {x:Math.floor(x/TILE)*TILE,y:Math.floor(y/TILE)*TILE};
}
function segmentDistance(x:number,y:number,a:readonly number[],b:readonly number[]){
 const dx=b[0]-a[0],dy=b[1]-a[1];const t=Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/(dx*dx+dy*dy)));
 return Math.hypot(x-a[0]-t*dx,y-a[1]-t*dy);
}
export function cultivable(tile:Tile):boolean{
 const {x,y}=tile;
 const bed=farmLayout.beds.find(b=>x>=b.x+4&&x+TILE<=b.x+52&&y>=b.y+2&&y+TILE<=b.y+34);
 if(bed)return true;
 // The prototype opens clear meadow patches first; trees, paths and fixtures remain protected.
 const meadow=(x>=64&&x+TILE<=160&&y>=288&&y+TILE<=464)||(x>=272&&x+TILE<=416&&y>=400&&y+TILE<=480);
 if(!meadow)return false;
 for(let px=x;px<=x+TILE;px+=4)for(let py=y;py<=y+TILE;py+=4){
  if(blocked(px,py))return false;
  for(const path of farmLayout.paths)for(let i=1;i<path.points.length;i++)
   if(segmentDistance(px,py,path.points[i-1],path.points[i])<path.width/2+3)return false;
 }
 return true;
}
export const reachable=(tile:Tile,player:{x:number;y:number})=>Math.hypot(tile.x+TILE/2-player.x,tile.y+TILE/2-player.y)<=44;
export function work(garden:Garden,tool:Tool,tile:Tile,player:{x:number;y:number}):{ok:boolean;message:string}{
 if(!reachable(tile,player))return {ok:false,message:'Sétálj közelebb a kijelölt földkockához.'};
 if(!cultivable(tile))return {ok:false,message:'Itt nem művelhető a talaj. Próbáld az ágyásokat vagy a szabad rétet.'};
 const key=tileKey(tile),plot=garden.plots.get(key);
 if(tool==='hoe'){
  if(plot)return {ok:false,message:'Ez a föld már fel van ásva.'};
  garden.plots.set(key,{watered:false,crop:null});return {ok:true,message:'A föld készen áll a vetésre.'};
 }
 if(!plot)return {ok:false,message:'Előbb ásd fel a földet a kapával.'};
 if(tool==='water'){
  if(plot.watered)return {ok:false,message:'Ez a föld már meg van öntözve.'};
  plot.watered=true;return {ok:true,message:'Megöntözted a földet.'};
 }
 if(plot.crop)return {ok:false,message:'Ide már ültettél. Válassz egy üres földkockát.'};
 if(garden.seeds[tool]<=0)return {ok:false,message:'Ebből elfogyott az ültetőanyag.'};
 plot.crop=tool;garden.seeds[tool]--;return {ok:true,message:`Elültetve: ${cropNames[tool]}.`};
}
