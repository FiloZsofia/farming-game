import Phaser from 'phaser';
import {drawDuck} from './estate-art';
import type {Estate} from './estate';
export class DuckLife{
 private g:Phaser.GameObjects.Graphics;
 constructor(scene:Phaser.Scene){this.g=scene.add.graphics().setDepth(4);}
 update(estate:Estate,elapsed:number){
  const g=this.g;g.clear();const nest=estate.pond.find(p=>p.kind==='duckNest');if(!nest||estate.duckArrivalDay===null||estate.duckArrivalPending)return;
  const phase=elapsed<60?'foraging':elapsed<165?'swimming':elapsed<230?'preening':elapsed<360?'swimming':'resting';
  document.querySelector<HTMLElement>('#game')!.dataset.duckActivity=phase;
  const smooth=(a:number)=>{const t=Math.max(0,Math.min(1,a));return t*t*(3-2*t);};
  let water=elapsed<60?0:elapsed<90?smooth((elapsed-60)/30):elapsed<145?1:elapsed<175?1-smooth((elapsed-145)/30):elapsed<230?0:elapsed<260?smooth((elapsed-230)/30):elapsed<330?1:1-smooth((elapsed-330)/30);
  for(let i=0;i<2;i++){const angle=elapsed*.025+i*1.4,shore={x:nest.x+(i? -20:23),y:nest.y+(i?13:8)},swim={x:615+Math.sin(angle)*27+(i?12:0),y:477+Math.cos(angle)*15+(i?6:0)};
   const x=shore.x+(swim.x-shore.x)*water+(1-water)*(phase==='foraging'?Math.sin(elapsed*.13+i)*9:0),y=shore.y+(swim.y-shore.y)*water;
   if(water>.2){g.lineStyle(.8,0xc1dfca,.45).strokeEllipse(x-3,y+3,31,8);}
   const bob=phase==='foraging'?Math.max(0,Math.sin(elapsed*2+i))*3:phase==='resting'?2:Math.sin(elapsed*3+i)*.5;
   drawDuck(g,x,y+bob,i===0);
   if(phase==='resting'){g.fillStyle(i?0x9b8059:0xb6b29b).fillEllipse(x+9,y-10+bob,8,7);g.lineStyle(.8,0x484a35).lineBetween(x+8,y-11+bob,x+11,y-11+bob);}
   if(phase==='preening'&&Math.sin(elapsed*1.4+i)>.2){g.lineStyle(2,i?0xb09265:0x8f9d8a).lineBetween(x-1,y-6,x+7,y-10);}
  }
 }
}
