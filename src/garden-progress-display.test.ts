import {it,expect} from 'vitest';
import {gardenProgress,normalizeGardenProgress,MAX_GARDEN_LEVEL} from './garden-progression';
it('uses thirty points consistently before, during and after all association unlocks',()=>{for(let level=0;level<MAX_GARDEN_LEVEL;level++){expect(gardenProgress(level*30+29)).toEqual({level,current:29,required:30});expect(gardenProgress((level+1)*30)).toEqual({level:level+1,current:level+1===MAX_GARDEN_LEVEL?30:0,required:30});}});
it('shows a fresh thirty-point target for imported old capped progress',()=>{const s=normalizeGardenProgress({progressionVersion:1 as const,points:5000,levelFloor:2,rewardedLevel:2,credited:[]});expect(gardenProgress(s.points,s.levelFloor)).toEqual({level:2,current:0,required:30});});
