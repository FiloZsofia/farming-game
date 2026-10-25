import {farmLayout,farmBounds} from './layout';
import {blocked} from './movement';
const TILE=16;type Tile={x:number;y:number};
export const legacyBeds=[{x:349,y:278,w:57,h:37},{x:421,y:253,w:57,h:37},{x:423,y:307,w:57,h:37}];
export function legacyTargetTile(x:number,y:number):Tile{
 for(const b of legacyBeds){
  if(x>=b.x+4&&x<b.x+52&&y>=b.y+2&&y<b.y+34)
   return {x:b.x+4+Math.floor((x-b.x-4)/TILE)*TILE,y:b.y+2+Math.floor((y-b.y-2)/TILE)*TILE};
 }
 return {x:Math.floor(x/TILE)*TILE,y:Math.floor(y/TILE)*TILE};
}
function segmentDistance(x:number,y:number,a:readonly number[],b:readonly number[]){
 const dx=b[0]-a[0],dy=b[1]-a[1];const t=Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/(dx*dx+dy*dy)));
 return Math.hypot(x-a[0]-t*dx,y-a[1]-t*dy);
}
export function legacyCultivable(tile:Tile):boolean{
 const {x,y}=tile;
 const bed=legacyBeds.find(b=>x>=b.x+4&&x+TILE<=b.x+52&&y>=b.y+2&&y+TILE<=b.y+34);
 if(bed)return true;
 // The prototype opens clear meadow patches first; trees, paths and fixtures remain protected.
 const expansion=(x<0||x>=800||y<0)&&x>=farmBounds.left+40&&x+TILE<=farmBounds.right-40&&y>=farmBounds.top+48&&y+TILE<=568;
 const meadow=expansion||(x>=64&&x+TILE<=160&&y>=288&&y+TILE<=464)||(x>=272&&x+TILE<=416&&y>=400&&y+TILE<=480);
 if(!meadow)return false;
 for(let px=x;px<=x+TILE;px+=4)for(let py=y;py<=y+TILE;py+=4){
  if(blocked(px,py))return false;
  for(const path of farmLayout.paths)for(let i=1;i<path.points.length;i++)
   if(segmentDistance(px,py,path.points[i-1],path.points[i])<path.width/2+3)return false;
 }
 return true;
}
