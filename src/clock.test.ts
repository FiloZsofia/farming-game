import {describe,it,expect} from 'vitest';
import {createClock,advanceClock,clockLabel,nightOpacity} from './clock';
describe('active game clock',()=>{
 it('starts night after exactly six active minutes',()=>{const c=createClock(1,()=>.5);advanceClock(c,359);expect(clockLabel(c)).toBe('Nappal · 5:59');advanceClock(c,1);expect(clockLabel(c)).toBe('Éjszaka · 0:00');});
 it('warns once at 2 and 3 night minutes, even when a frame crosses both',()=>{const c=createClock(1,()=>.5);expect(advanceClock(c,479).warnings).toEqual([]);expect(advanceClock(c,61).warnings).toEqual([480,540]);expect(advanceClock(c,1).warnings).toEqual([]);});
 it('collapses within 3:30–4:00 of night and does not advance to tomorrow implicitly',()=>{for(const random of [0,.1,.5,.999999]){const c=createClock(8,()=>random);expect(c.collapseAt).toBeGreaterThanOrEqual(570);expect(c.collapseAt).toBeLessThan(600);expect(advanceClock(c,c.collapseAt-.01).collapse).toBe(false);expect(advanceClock(c,1).collapse).toBe(true);expect(c.day).toBe(8);expect(c.elapsed).toBe(c.collapseAt);}});
 it('does not reroll exhaustion on a restored clock',()=>{const c=createClock(4,()=>.1);advanceClock(c,500);const restored=structuredClone(c);expect(advanceClock(restored,73).collapse).toBe(true);});
 it('applies a gradual readable night shade',()=>{const c=createClock();expect(nightOpacity(c)).toBe(0);c.elapsed=360;expect(nightOpacity(c)).toBeGreaterThan(0);c.elapsed=500;expect(nightOpacity(c)).toBe(.55);});
});
