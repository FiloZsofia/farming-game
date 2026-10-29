import {it,expect} from 'vitest';
import {sporeFieldPhase,sporeFieldHurts,sporeShelters} from './spore-field';
it('warns before releasing spores and protects shelter, jump and surrounding forest',()=>{expect(sporeFieldPhase(7)).toBe('quiet');expect(sporeFieldPhase(8)).toBe('warning');expect(sporeFieldPhase(10)).toBe('release');expect(sporeFieldHurts(10,{x:-690,y:1820},false)).toBe(true);for(const p of sporeShelters)expect(sporeFieldHurts(10,p,false)).toBe(false);expect(sporeFieldHurts(10,{x:-690,y:1820},true)).toBe(false);expect(sporeFieldHurts(10,{x:-444,y:2000},false)).toBe(false);});
