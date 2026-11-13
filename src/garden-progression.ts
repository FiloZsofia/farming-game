import {bedMixes} from './living-bed';
export const GARDEN_LEVEL_POINTS=30;
export const MAX_GARDEN_LEVEL=Math.max(...Object.values(bedMixes).map(m=>m.level));
type Progress={progressionVersion?:1|2;contentLevel?:number;points:number;levelFloor:number;rewardedLevel:number;credited:string[]};
/** A content release never turns work done beyond the old cap into new rewards. */
export function normalizeGardenProgress<T extends Progress>(g:T):T{
 if(g.progressionVersion!==2){
  const level=Math.min(2,Math.max(g.levelFloor,Math.floor(g.points/50)));
  const partial=level>=2?0:Math.min(29,Math.floor(Math.max(0,g.points-level*50)*30/50));
  g.points=level*30+partial;g.levelFloor=level;g.rewardedLevel=Math.min(g.rewardedLevel,level);g.progressionVersion=2;g.contentLevel=MAX_GARDEN_LEVEL;
 }else if((g.contentLevel??MAX_GARDEN_LEVEL)<MAX_GARDEN_LEVEL){
  g.points=Math.min(g.points,(g.contentLevel??MAX_GARDEN_LEVEL)*30);g.contentLevel=MAX_GARDEN_LEVEL;
 }
 g.points=Math.min(g.points,MAX_GARDEN_LEVEL*30);return g;
}

/** Shared values for the saved skill, its sidebar and the animated HUD. */
export function gardenProgress(points:number,levelFloor=0){
 const level=Math.min(MAX_GARDEN_LEVEL,Math.max(levelFloor,Math.floor(points/GARDEN_LEVEL_POINTS)));
 return {level,current:level>=MAX_GARDEN_LEVEL?GARDEN_LEVEL_POINTS:Math.max(0,points-level*GARDEN_LEVEL_POINTS),required:GARDEN_LEVEL_POINTS};
}
