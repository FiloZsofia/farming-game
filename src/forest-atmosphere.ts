import type Phaser from 'phaser';
import {forestNest,inForest} from './forest';
export function nestInfluence(x:number,y:number){return Math.max(0,1-Math.hypot(x-forestNest.x,y-forestNest.y)/180);}
export class ForestAtmosphere{
 private g:Phaser.GameObjects.Graphics;private time=0;
 constructor(private scene:Phaser.Scene){this.g=scene.add.graphics().setDepth(4);}
 update(dt:number,actor:{x:number;y:number},outdoors:boolean,sunny:boolean,darkness:number){
  const g=this.g;g.clear();if(!outdoors||!inForest(actor.x,actor.y)||Math.hypot(actor.x-forestNest.x,actor.y-forestNest.y)>300)return;
  this.time+=dt;const light=1-darkness/.55,n=forestNest;
  if(sunny&&light>.2){g.fillStyle(0xe3d8ac,.06*light).fillPoints([{x:n.x-100,y:n.y-170},{x:n.x-76,y:n.y-170},{x:n.x+67,y:n.y+24},{x:n.x+13,y:n.y+18}],true);}
  for(let i=0;i<19;i++){
   const t=this.time*(.015+i%3*.004)+i*.173,turn=t-Math.floor(t),x=n.x-82+(i*37%160)+Math.sin(this.time*.4+i)*8,y=n.y+9-turn*85;
   const fade=Math.sin(Math.PI*turn)*(.11+(sunny?.18:.08))*Math.max(.2,light);
   if(this.scene.cameras.main.worldView.contains(x,y))g.fillStyle(i%3?0xc7cbb9:0xe2dcc4,fade).fillEllipse(x,y,i%3?1:1.7,i%3?1.2:1.5);
  }
  // Normal activity survives in the sunlit clearing beside the disturbed hollow.
  for(let i=0;i<2;i++){const t=this.time*.7+i*3,x=n.x+180+Math.sin(t)*20,y=n.y+12+i*23+Math.cos(t*.8)*10,spread=1+Math.abs(Math.sin(this.time*15+i))*2;
   g.fillStyle(i?0xbca6c4:0xdac37b,.8*light).fillEllipse(x-spread/2,y,spread,3).fillEllipse(x+spread/2,y,spread,3);g.lineStyle(.6,0x4e5940,.8*light).lineBetween(x,y-1,x,y+2);
  }
 }
}
