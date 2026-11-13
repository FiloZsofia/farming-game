import {it,expect} from 'vitest';
import {gardenProgress,normalizeGardenProgress,MAX_GARDEN_LEVEL,gardenLevelTarget,gardenLevelCost} from './garden-progression';
it('keeps the first two levels at fifty and later association unlocks at thirty points',()=>{
 expect([1,2,3,4,5].map(gardenLevelTarget)).toEqual([50,100,130,160,190]);
 for(let level=0;level<MAX_GARDEN_LEVEL;level++){const required=gardenLevelCost(level+1);expect(gardenProgress(gardenLevelTarget(level+1)-1)).toEqual({level,current:required-1,required});const next=level+1;expect(gardenProgress(gardenLevelTarget(next))).toEqual({level:next,current:next===MAX_GARDEN_LEVEL?30:0,required:gardenLevelCost(next+1)});}
});
it('drops original capped overflow and shows a thirty-point target for the first new association',()=>{const s=normalizeGardenProgress({progressionVersion:1 as const,points:5000,levelFloor:2,rewardedLevel:2,credited:[]});expect(s.points).toBe(100);expect(gardenProgress(s.points,s.levelFloor)).toEqual({level:2,current:0,required:30});});
it('preserves all levels and relative progress earned under the temporary thirty-point ladder',()=>{
 for(let level=0;level<=5;level++){const s=normalizeGardenProgress({progressionVersion:2 as 1|2|3,contentLevel:5,points:level*30+(level===5?500:15),levelFloor:0,rewardedLevel:level,credited:[]});expect(gardenProgress(s.points,s.levelFloor)).toEqual({level,current:level===5?30:level<2?25:15,required:gardenLevelCost(level+1)});expect(s.rewardedLevel).toBe(level);expect(s.progressionVersion).toBe(3);expect(normalizeGardenProgress({...s})).toEqual(s);}
});
