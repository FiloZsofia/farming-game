import {describe,it,expect} from 'vitest';
import {createGardenSkill,gainGardening,validGardenSkill,gardeningLevel,gardeningTarget,gardeningProgress,gardeningCredit} from './gardening-skill';
describe('gardening skill',()=>{
 it('does not award the same meaningful action twice',()=>{const first=gainGardening(createGardenSkill(),'hoe:353,280')!;expect(first.xp).toBe(1);expect(gainGardening(first,'hoe:353,280')).toBeNull();expect(gainGardening(first,'water:1:353,280')!.xp).toBe(2);});
 it('gives all three fruit stacks once at exactly 36 actions',()=>{let state=createGardenSkill();for(let i=0;i<35;i++)state=gainGardening(state,`hoe:${i}`)!;expect(state.rewarded).toBe(false);expect(state.fruits).toEqual({});const level2=gainGardening(state,'water:2:353,280')!;expect(level2.xp).toBe(36);expect(level2.rewarded).toBe(true);expect(level2.fruits).toEqual({strawberry:4,honeyberry:4,blueberry:4});expect(gainGardening(level2,'weed:3:weed-a')!.xp).toBe(37);expect(state.xp).toBe(35);});
 it('reaches level three after 36 more actions and never rewards it twice',()=>{let skill=createGardenSkill();for(let i=0;i<71;i++)skill=gainGardening(skill,`hoe:${i}`)!;expect(gardeningLevel(skill)).toBe(2);expect(gardeningTarget(skill)).toBe(72);expect(skill.levelThreeRewarded).toBe(false);skill=gainGardening(skill,'hoe:last')!;expect(gardeningLevel(skill)).toBe(3);expect(skill.levelThreeRewarded).toBe(true);expect(validGardenSkill(skill)).toBe(true);expect(gainGardening(skill,'hoe:extra')).toBeNull();});
 it('validates progress, duplicate credits and fruit stacks',()=>{expect(validGardenSkill(createGardenSkill())).toBe(true);expect(validGardenSkill({xp:1,credited:['hoe:a','hoe:a'],rewarded:false,fruits:{}})).toBe(false);expect(validGardenSkill({xp:0,credited:[],rewarded:true,fruits:{}})).toBe(false);expect(validGardenSkill({...createGardenSkill(),fruits:{unknown:4}})).toBe(false);});
});

describe('gardening progress within the current level',()=>{
 for(const [xp,current]of [[0,0],[35,35],[36,0],[37,1],[71,35],[72,36]])it(`shows ${xp} total XP as ${current}/36`,()=>{let skill=createGardenSkill();for(let i=0;i<xp;i++)skill=gainGardening(skill,`hoe:${i}`)!;expect(gardeningProgress(skill)).toEqual({current,required:36});});
 it('credits sowing and watering empty soil independently without repeat-action farming',()=>{
  const empty={crop:null,watered:false,growth:0,regrowing:false},tile='353,280';let skill=createGardenSkill();
  const water=gardeningCredit('water',tile,1,empty)!;skill=gainGardening(skill,water)!;
  expect(skill.xp).toBe(1);expect(gainGardening(skill,water)).toBeNull();
  const plant=gardeningCredit('radish',tile,1,{...empty,watered:true})!;skill=gainGardening(skill,plant)!;expect(skill.xp).toBe(2);expect(gainGardening(skill,plant)).toBeNull();
  expect(gainGardening(skill,gardeningCredit('water',tile,2,empty)!)!.xp).toBe(3);expect(gardeningCredit('hoe',tile,1,empty)).toBeNull();
 });
});
