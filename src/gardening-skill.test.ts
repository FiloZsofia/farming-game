import {describe,it,expect} from 'vitest';
import {createGardenSkill,gainGardening,validGardenSkill} from './gardening-skill';
describe('gardening skill',()=>{
 it('does not award the same meaningful action twice',()=>{const first=gainGardening(createGardenSkill(),'hoe:353,280')!;expect(first.xp).toBe(1);expect(gainGardening(first,'hoe:353,280')).toBeNull();expect(gainGardening(first,'water:1:353,280')!.xp).toBe(2);});
 it('gives all three fruit stacks once at exactly 36 actions',()=>{let state=createGardenSkill();for(let i=0;i<35;i++)state=gainGardening(state,`hoe:${i}`)!;expect(state.rewarded).toBe(false);expect(state.fruits).toEqual({});const level2=gainGardening(state,'water:2:353,280')!;expect(level2.xp).toBe(36);expect(level2.rewarded).toBe(true);expect(level2.fruits).toEqual({strawberry:4,honeyberry:4,blueberry:4});expect(gainGardening(level2,'weed:3:weed-a')).toBeNull();expect(state.xp).toBe(35);});
 it('validates progress, duplicate credits and fruit stacks',()=>{expect(validGardenSkill(createGardenSkill())).toBe(true);expect(validGardenSkill({xp:1,credited:['hoe:a','hoe:a'],rewarded:false,fruits:{}})).toBe(false);expect(validGardenSkill({xp:0,credited:[],rewarded:true,fruits:{}})).toBe(false);expect(validGardenSkill({...createGardenSkill(),fruits:{unknown:4}})).toBe(false);});
});
