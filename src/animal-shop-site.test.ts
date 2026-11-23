import {describe,it,expect} from 'vitest';
import {animalShopSite,animalShopDisplays,animalShopDisplayBounds} from './animal-shop-site';
import {villageLayout,villagePaths,villageBlocked,shopBlocked,shopOrigins} from './village-layout';
import {boundsOffPaths} from './path-clearance';
import {marketRoads} from './market-trial-route';
describe('animal shop and its displayed wares',()=>{
 it('keeps the taller shop and its roof below the pond shop',()=>{expect(animalShopSite.y-43).toBeGreaterThan(villageLayout.fishShop.y+villageLayout.fishShop.h+12);expect(animalShopSite.w*animalShopSite.h).toBeGreaterThan(180*70*1.7);});
 it('keeps every displayed item off the paths and the entrance accessible',()=>{for(const b of animalShopDisplayBounds)expect(boundsOffPaths(b,[...villagePaths,...marketRoads])).toBe(true);expect(villageBlocked(animalShopSite.door.x,animalShopSite.door.y+12)).toBe(false);for(const p of animalShopDisplays)expect(villageBlocked(p.x,p.y)).toBe(true);});
 it('reserves the interior display areas while keeping the central aisle open',()=>{const y=shopOrigins.animalShop;expect(shopBlocked(145,y+460)).toBe(true);expect(shopBlocked(650,y+460)).toBe(true);for(const yy of [310,350,400,450,495])expect(shopBlocked(400,y+yy)).toBe(false);});
});
