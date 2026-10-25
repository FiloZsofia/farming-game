import {it,expect} from 'vitest';
import {consumeBerry,berryFoods} from './food';
import {snapshot,decodeSnapshot} from './storage';
import {createGarden} from './gardening';
import {createClock} from './clock';
import {createForest} from './forest';
it('consumes exactly one berry and restores one saved heart without changing the source',()=>{for(const crop of berryFoods){const s=snapshot({x:330,y:260},createClock(),createGarden());s.travel.forest={...createForest(),health:3};s.produce[crop]=2;const n=consumeBerry(s,crop)!;expect(n.produce[crop]).toBe(1);expect(n.travel.forest?.health).toBe(4);expect(s.produce[crop]).toBe(2);expect(s.travel.forest.health).toBe(3);expect(decodeSnapshot(n)).toEqual(n);}});
it('never consumes food at full health or from an empty stack, and preserves legacy saves',()=>{const s=snapshot({x:330,y:260},createClock(),createGarden());s.produce.blueberry=2;expect(consumeBerry(s,'blueberry')).toBeNull();s.travel.forest={...createForest(),health:4};s.produce.blueberry=0;expect(consumeBerry(s,'blueberry')).toBeNull();s.produce.blueberry=1;const n=consumeBerry(s,'blueberry')!;expect(n.travel.forest?.health).toBe(5);expect(consumeBerry(n,'blueberry')).toBeNull();expect(decodeSnapshot(s)).toEqual(s);});
