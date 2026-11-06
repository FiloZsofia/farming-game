import Phaser from 'phaser';
import {drawDuck} from './estate-art';
import {duckPose} from './duck-roaming';
import type {Estate} from './estate';
export class DuckLife{
 private g:Phaser.GameObjects.Graphics;
 constructor(scene:Phaser.Scene){this.g=scene.add.graphics().setDepth(4);}
 update(estate:Estate,elapsed:number,blocked?:(point:{x:number;y:number})=>boolean){
  const g=this.g;g.clear();const surface=document.querySelector<HTMLElement>('#game')!,nest=estate.pond.find(p=>p.kind==='duckNest');
  surface.dataset.duckWalking='0';surface.dataset.duckLegs='0';
  if(!nest||estate.duckArrivalDay===null||estate.duckArrivalPending){surface.dataset.duckActivity='absent';return;}
  let walkers=0,landBirds=0;
  for(let i=0;i<2;i++){
   const pose=duckPose(nest,elapsed,i,blocked),{x,y,phase}=pose;surface.dataset.duckActivity=phase;
   if(pose.ground)landBirds++;else g.lineStyle(.8,0xc1dfca,.45).strokeEllipse(x-3,y+3,31,8);
   if(pose.walking)walkers++;
   const bob=pose.walking?Math.sin(pose.stride*2)*.55:phase==='resting'?1:Math.sin(elapsed*3+i)*.35;
   drawDuck(g,x,y+bob,i===0,0,{ground:pose.ground,stride:pose.stride,facing:pose.facing});
   g.save().translateCanvas(x,y).scaleCanvas(pose.facing,1);
   if(phase==='resting'){g.fillStyle(i?0x9b8059:0xb6b29b).fillEllipse(9,-10+bob,8,7);g.lineStyle(.8,0x484a35).lineBetween(8,-11+bob,11,-11+bob);}
   if(phase==='preening'&&Math.sin(elapsed*1.4+i)>.2)g.lineStyle(2,i?0xb09265:0x8f9d8a).lineBetween(-1,-6,7,-10);
   g.restore();
  }
  surface.dataset.duckWalking=String(walkers);surface.dataset.duckLegs=String(landBirds);
 }
}
