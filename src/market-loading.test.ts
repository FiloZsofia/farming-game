import {it,expect} from 'vitest';
import {marketLoadingRouteForCrate,marketPersonDepth} from './market-loading';
import {marketStand,marketStandOffset,marketCratePoint} from './market-site';
import {marketParking} from './market-trial-route';
it('loads each crate column from outside the fence without entering the stand',()=>{for(let i=0;i<9;i++){const route=marketLoadingRouteForCrate(i),p=route.at(-1)!;expect(p.x).toBe(marketCratePoint(i).x+marketStandOffset);expect(p.y).toBe(622);for(const point of route)expect(point.y).toBeGreaterThan(marketStand.bottom+18);}});
it('puts Mara and her cargo behind the truck on its far side, and in front on the near side',()=>{const truck={...marketParking,heading:0};expect(marketPersonDepth(truck,{x:-130,y:622},true)).toBeLessThan(70);expect(marketPersonDepth(truck,{x:-130,y:700},true)).toBeGreaterThan(70);expect(marketPersonDepth(truck,{x:58,y:540},true)).toBeGreaterThan(70);expect(marketPersonDepth(truck,{x:-130,y:622},false)).toBe(130);});
