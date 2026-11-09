import {maraPruningPoint,ornamentalShrubs} from './nursery-grounds';
import {MARA_WALK_SPEED} from './market-trial-route';
export class MaraPruning{
 readonly progress=[0,0];private index=0;private elapsed=0;phase:'trim'|'walk'|'done'='trim';
 get position(){return {x:maraPruningPoint.x,y:ornamentalShrubs[1-this.index].y+19};}
 reset(completed=false){this.progress.fill(completed?1:0);this.index=completed?1:0;this.elapsed=0;this.phase=completed?'done':'trim';}
 update(dt:number){const before=this.position;if(this.phase==='done')return before;this.elapsed+=Math.max(0,dt);
  if(this.phase==='trim'){this.progress[1-this.index]=Math.min(1,this.elapsed/7);if(this.elapsed>=7){this.elapsed=0;this.phase=this.index===0?'walk':'done';}return before;}
  const end=ornamentalShrubs[0].y+19,duration=Math.abs(end-(ornamentalShrubs[1].y+19))/MARA_WALK_SPEED,k=Math.min(1,this.elapsed/duration),y=ornamentalShrubs[1].y+19+(end-(ornamentalShrubs[1].y+19))*k;if(k===1){this.index=1;this.phase='trim';this.elapsed=0;}return{x:before.x,y};
 }
}
