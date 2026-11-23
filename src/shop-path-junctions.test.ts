import {it,expect} from 'vitest';
import {villagePaths,SHOP_PATH_WIDTH,villageLayout} from './village-layout';
import {villageShopDecorBounds} from './village-shop-decor';
import {boundsOffPaths} from './path-clearance';
import {marketRoads} from './market-trial-route';
it('joins all three shop doors at one walking-path width',()=>{const shopPaths=[villagePaths[3],villagePaths[4],...villagePaths.slice(7)];for(const p of shopPaths)expect(p.width).toBe(SHOP_PATH_WIDTH);const fish=villagePaths[3];expect(fish.points).toHaveLength(2);expect(fish.points[0][0]).toBe(fish.points[1][0]);expect(fish.points[1]).toEqual([villageLayout.fishShop.door.x,villageLayout.fishShop.door.y]);});
it('keeps the barrel, basket and both pots completely beside the new paths',()=>{for(const b of villageShopDecorBounds)expect(boundsOffPaths(b,[...villagePaths,...marketRoads])).toBe(true);});
