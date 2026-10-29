import {it,expect} from 'vitest';
import {consumeFood,isFood} from './food';
import {crops} from './economy';
import {treeKinds} from './estate';
import {snapshot,decodeSnapshot} from './storage';
import {createGarden} from './gardening';
import {createClock} from './clock';
import {createForest} from './forest';
const fresh=()=>{const s=snapshot({x:330,y:260},createClock(),createGarden());s.travel.forest={...createForest(),health:3};return s;};
it('makes every registered crop and orchard fruit edible from the start with exactly one heart per item',()=>{
 for(const crop of crops){const s=fresh();s.produce[crop]=2;const n=consumeFood(s,crop)!;expect(isFood(crop)).toBe(true);expect(n.produce[crop]).toBe(1);expect(n.travel.forest?.health).toBe(4);expect(s.produce[crop]).toBe(2);expect(decodeSnapshot(n)).toEqual(n);}
 for(const fruit of treeKinds){const s=fresh();s.travel.estate.produce[fruit]=2;const n=consumeFood(s,fruit)!;expect(n.travel.estate.produce[fruit]).toBe(1);expect(n.travel.forest?.health).toBe(4);expect(s.travel.estate.produce[fruit]).toBe(2);expect(decodeSnapshot(n)).toEqual(n);}
});
it('rejects fallen fruit, planting materials and non-food, and never consumes at full health or from empty stacks',()=>{const s=fresh();s.produce.blueberry=2;s.travel.fallenFruit=[{x:250,y:300,count:4}];for(const id of ['fallenFruit','thyme','reed','duckEgg','scrap'])expect(consumeFood(s,id)).toBeNull();s.travel.forest!.health=5;expect(consumeFood(s,'blueberry')).toBeNull();s.travel.forest!.health=4;s.produce.blueberry=0;expect(consumeFood(s,'blueberry')).toBeNull();s.produce.blueberry=1;expect(consumeFood(s,'blueberry')!.travel.forest?.health).toBe(5);});
