import {afterEach,describe,it,expect} from 'vitest';
import {livingBedFits,gardenDecorationFits} from './living-bed-placement';
import {pondOutline,pondOverlapsArea,bindPondExpansion} from './pond-shape';
import {junkAreaOccupied,junkArtworkBounds,junkPlacementRadius,junkPoint} from './junk-sites';
import {createClearing} from './cleanup';
afterEach(()=>bindPondExpansion(()=>[]));
describe('usable ground beside the shore, fence and ruins',()=>{
 it('permits a bed on the reported empty grass below the trailer without touching the ruin',()=>{const c=createClearing(),area={x:820,y:300,w:160,h:88},p=junkPoint(c,'trailer');expect(Math.hypot(Math.max(area.x-p.x,0,p.x-area.x-area.w),Math.max(area.y-p.y,0,p.y-area.y-area.h))).toBeLessThan(junkPlacementRadius('trailer'));expect(junkAreaOccupied(c,area)).toBe(false);expect(livingBedFits(area,{x:1000,y:350})).toBe(true);const b=junkArtworkBounds(c,'trailer');expect(junkAreaOccupied(c,{x:b.x+10,y:b.y+10,w:160,h:88})).toBe(true);});
 it('uses narrow fence margins on all four sides instead of reserving broad empty strips',()=>{for(const area of [{x:-374,y:0,w:160,h:88},{x:1010,y:300,w:160,h:88},{x:-150,y:-334,w:160,h:88},{x:800,y:480,w:160,h:88}])expect(livingBedFits(area),JSON.stringify(area)).toBe(true);expect(livingBedFits({x:-410,y:0,w:160,h:88})).toBe(false);expect(livingBedFits({x:1010,y:530,w:160,h:88})).toBe(false);expect(gardenDecorationFits({x:1135,y:420},18,15)).toBe(true);});
 it('follows the painted bank for both original and expanded ponds, without a radial exclusion zone',()=>{for(const expansion of [[],Array(64).fill(30)]){const left=Math.min(...pondOutline(expansion,8).map(p=>p.x)),area={x:left-164,y:420,w:160,h:88};expect(pondOverlapsArea(area,expansion)).toBe(false);expect(pondOverlapsArea({...area,x:left-156},expansion)).toBe(true);expect(pondOverlapsArea({x:600,y:440,w:160,h:88},expansion)).toBe(true);}});
});
