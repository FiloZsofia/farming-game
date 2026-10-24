import {it,expect} from 'vitest';
import {HOME_ORIGIN,homeBlocked} from './home';
import {worldBlocked,outsideFarm} from './village-layout';
import {createGarden} from './gardening';
import {createClock} from './clock';
import {snapshot,decodeSnapshot} from './storage';
it('keeps home safe and furniture solid while leaving access to the bookcase',()=>{expect(outsideFarm(HOME_ORIGIN+470)).toBe(false);expect(worldBlocked(400,HOME_ORIGIN+470)).toBe(false);expect(homeBlocked(190,HOME_ORIGIN+290)).toBe(true);expect(homeBlocked(603,HOME_ORIGIN+260)).toBe(false);});
it('saves an interior position and first visit without losing inventory or changing old saves',()=>{const data=snapshot({x:400,y:HOME_ORIGIN+470},createClock(5),createGarden());data.travel.homeVisited=true;expect(decodeSnapshot(data)).toEqual(data);delete data.travel.homeVisited;expect(decodeSnapshot(data)).toEqual(data);data.travel.homeVisited='bad' as unknown as boolean;expect(decodeSnapshot(data)).toBeNull();});

it('moves a saved player beside the new cabinet without changing the rest of the save',()=>{const data=snapshot({x:279,y:HOME_ORIGIN+295},createClock(5),createGarden());data.economy.gold=163;const original=structuredClone(data),next=decodeSnapshot(data)!;expect(next.player).toEqual({x:320,y:HOME_ORIGIN+295});expect(next.economy).toEqual(data.economy);expect(next.seeds).toEqual(data.seeds);expect(next.travel).toEqual(data.travel);expect(data).toEqual(original);expect(decodeSnapshot(next)).toEqual(next);const upper={...data,player:{x:279,y:HOME_ORIGIN+230}};expect(decodeSnapshot(upper)?.player).toEqual({x:320,y:HOME_ORIGIN+230});});
