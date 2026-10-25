import {describe,it,expect} from 'vitest';
import {createGardenSkill,gainGardening,validGardenSkill,gardeningLevel,gardeningTarget,gardeningProgress,gardeningCredit,migrateGardenSkill} from './gardening-skill';
describe('gardening skill',()=>{
 it('does not award the same meaningful action twice',()=>{const first=gainGardening(createGardenSkill(),'hoe:353,280')!;expect(first.xp).toBe(1);expect(gainGardening(first,'hoe:353,280')).toBeNull();expect(gainGardening(first,'water:1:353,280')!.xp).toBe(2);});
 it('gives all three fruit stacks once at exactly 36 actions',()=>{let state=createGardenSkill();for(let i=0;i<35;i++)state=gainGardening(state,`hoe:${i}`)!;expect(state.rewarded).toBe(false);expect(state.fruits).toEqual({});const level2=gainGardening(state,'water:2:353,280')!;expect(level2.xp).toBe(36);expect(level2.rewarded).toBe(true);expect(level2.fruits).toEqual({strawberry:4,honeyberry:4,blueberry:4});expect(gainGardening(level2,'weed:3:weed-a')!.xp).toBe(37);expect(state.xp).toBe(35);});
 it('starts at zero, unlocks rewards at 36/80/132 and stops accumulating at the cap',()=>{let skill=createGardenSkill();expect(gardeningLevel(skill)).toBe(0);for(let i=0;i<132;i++){skill=gainGardening(skill,`hoe:${i}`)!;expect(validGardenSkill(skill)).toBe(true);if(i===35)expect(gardeningLevel(skill)).toBe(1);if(i===79){expect(gardeningLevel(skill)).toBe(2);expect(gardeningProgress(skill)).toEqual({current:0,required:52});}}expect(skill.chestBlueprint).toBe(true);expect(gardeningLevel(skill)).toBe(3);expect(gainGardening(skill,'extra')).toBeNull();});
 it('migrates the old cap to zero progress toward the blueprint without repeating rewards',()=>{const old={xp:72,credited:Array.from({length:72},(_,i)=>`old:${i}`),rewarded:true,levelThreeRewarded:true,fruits:{strawberry:0,honeyberry:0,blueberry:0}};const next=migrateGardenSkill(old);expect(next.xp).toBe(80);expect(gardeningProgress(next)).toEqual({current:0,required:52});expect(validGardenSkill(next)).toBe(true);expect(migrateGardenSkill(next)).toEqual(next);expect(old.xp).toBe(72);});
 it('validates progress, duplicate credits and fruit stacks',()=>{expect(validGardenSkill(createGardenSkill())).toBe(true);expect(validGardenSkill({xp:1,credited:['hoe:a','hoe:a'],rewarded:false,fruits:{}})).toBe(false);expect(validGardenSkill({xp:0,credited:[],rewarded:true,fruits:{}})).toBe(false);expect(validGardenSkill({...createGardenSkill(),fruits:{unknown:4}})).toBe(false);});
});

describe('gardening progress within the current level',()=>{
 for(const [xp,current,required]of [[0,0,36],[35,35,36],[36,0,44],[37,1,44],[79,43,44],[80,0,52],[131,51,52],[132,52,52]])it(`shows ${xp} total XP as ${current}/36`,()=>{let skill=createGardenSkill();for(let i=0;i<xp;i++)skill=gainGardening(skill,`hoe:${i}`)!;expect(gardeningProgress(skill)).toEqual({current,required});});
 it('credits sowing and watering empty soil independently without repeat-action farming',()=>{
  const empty={crop:null,watered:false,growth:0,regrowing:false},tile='353,280';let skill=createGardenSkill();
  const water=gardeningCredit('water',tile,1,empty)!;skill=gainGardening(skill,water)!;
  expect(skill.xp).toBe(1);expect(gainGardening(skill,water)).toBeNull();
  const plant=gardeningCredit('radish',tile,1,{...empty,watered:true})!;skill=gainGardening(skill,plant)!;expect(skill.xp).toBe(2);expect(gainGardening(skill,plant)).toBeNull();
  expect(gainGardening(skill,gardeningCredit('water',tile,2,empty)!)!.xp).toBe(3);expect(gardeningCredit('hoe',tile,1,empty)).toBeNull();
 });
});
