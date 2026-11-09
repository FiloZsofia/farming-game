import {it,expect} from 'vitest';
import {marketLoadingRouteForCrate,marketPersonDepth} from './market-loading';
import {marketParking} from './market-trial-route';
it('stops beside the actual occupied crate row, for any of the nine slots',()=>{for(let i=0;i<9;i++){const p=marketLoadingRouteForCrate(i).at(-1)!;expect(p.x).toBe(58);expect(p.y).toBe(504+Math.floor(i/3)*36);}});
it('puts Mara and her cargo behind the truck on its far side, and in front on the near side',()=>{const truck={...marketParking,heading:0};expect(marketPersonDepth(truck,{x:-130,y:622},true)).toBeLessThan(70);expect(marketPersonDepth(truck,{x:-130,y:700},true)).toBeGreaterThan(70);expect(marketPersonDepth(truck,{x:58,y:540},true)).toBeGreaterThan(70);expect(marketPersonDepth(truck,{x:-130,y:622},false)).toBe(130);});
