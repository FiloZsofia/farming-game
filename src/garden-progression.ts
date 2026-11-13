import {bedMixes} from './living-bed';
export const GARDEN_LEVEL_POINTS=30;
export const ORIGINAL_GARDEN_LEVEL_POINTS=50;
export const MAX_GARDEN_LEVEL=Math.max(...Object.values(bedMixes).map(m=>m.level));
export const gardenLevelTarget=(level:number)=>Math.min(level,2)*ORIGINAL_GARDEN_LEVEL_POINTS+Math.max(0,level-2)*GARDEN_LEVEL_POINTS;
export const gardenLevelCost=(level:number)=>level<=2?ORIGINAL_GARDEN_LEVEL_POINTS:GARDEN_LEVEL_POINTS;
type Progress={progressionVersion?:1|2|3;contentLevel?:number;points:number;levelFloor:number;rewardedLevel:number;credited:string[]};
/** Preserve earned levels and fractional progress, never old overflow above a content cap. */
export function normalizeGardenProgress<T extends Progress>(g:T):T{
 if(g.progressionVersion!==3){
  const temporary=g.progressionVersion===2,oldCost=temporary?30:50,oldCap=temporary?(g.contentLevel??5):2;
  const level=Math.min(oldCap,Math.max(g.levelFloor,Math.floor(g.points/oldCost)));
  const partial=level>=oldCap?0:Math.min(oldCost-1,Math.max(0,g.points-level*oldCost));
  g.points=gardenLevelTarget(level)+Math.floor(partial*gardenLevelCost(level+1)/oldCost);
  g.levelFloor=level;g.rewardedLevel=Math.min(g.rewardedLevel,level);g.progressionVersion=3;g.contentLevel=MAX_GARDEN_LEVEL;
 }else if((g.contentLevel??MAX_GARDEN_LEVEL)<MAX_GARDEN_LEVEL){
  g.points=Math.min(g.points,gardenLevelTarget(g.contentLevel??MAX_GARDEN_LEVEL));g.contentLevel=MAX_GARDEN_LEVEL;
 }
 g.points=Math.min(g.points,gardenLevelTarget(MAX_GARDEN_LEVEL));return g;
}
/** Shared values for the saved skill, its sidebar and the animated HUD. */
export function gardenProgress(points:number,levelFloor=0){
 let level=Math.min(MAX_GARDEN_LEVEL,levelFloor);
 while(level<MAX_GARDEN_LEVEL&&points>=gardenLevelTarget(level+1))level++;
 const required=gardenLevelCost(level+1);
 return {level,current:level>=MAX_GARDEN_LEVEL?required:Math.max(0,Math.min(required,points-gardenLevelTarget(level))),required};
}
