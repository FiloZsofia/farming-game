import {maraPruningPoint,ornamentalShrubs} from './nursery-grounds';
import {MARA_WALK_SPEED} from './market-trial-route';
export class MaraPruning{
 readonly progress=[0,0];private index=0;private elapsed=0;phase:'trim'|'walk'|'rest'='trim';
 get position(){return {x:maraPruningPoint.x,y:ornamentalShrubs[1-this.index].y+19};}
 reset(completed=false){this.progress.fill(completed?1:0);this.index=completed?1:0;this.elapsed=0;this.phase='trim';}
 update(dt:number){const before=this.position;this.elapsed+=Math.max(0,dt);
  if(this.phase==='trim'){this.progress[1-this.index]=Math.max(this.progress[1-this.index],Math.min(1,this.elapsed/7));if(this.elapsed>=7){this.elapsed=0;this.phase='rest';}return before;}
  if(this.phase==='rest'){if(this.elapsed>=4){this.elapsed=0;this.phase='walk';}return before;}
  const end=ornamentalShrubs[this.index].y+19,duration=Math.abs(end-before.y)/MARA_WALK_SPEED,k=Math.min(1,this.elapsed/duration),y=before.y+(end-before.y)*k;if(k===1){this.index=1-this.index;this.phase='trim';this.elapsed=0;}return{x:before.x,y};
 }
}
