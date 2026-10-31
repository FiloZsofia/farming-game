import {inForest,forestBench} from './forest';
// Start by the resting bench, not at the entrance to the forest trail.
export function forestMusicZone(player:{x:number;y:number},southUnlocked:boolean):'north'|'south'|null{
 if(southUnlocked&&player.x<0&&player.y>=1300&&player.y<2920)return 'south';
 return inForest(player.x,player.y)&&player.x<=forestBench.x+40?'north':null;
}
