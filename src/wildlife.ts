import {forestNest} from './forest';
import {nestInfluence} from './forest-atmosphere';
import Phaser from 'phaser';
type Flier={g:Phaser.GameObjects.Graphics;x:number;y:number;t:number;speed:number;bird:boolean;color:number;firefly?:boolean};
export class Wildlife{
 private fliers:Flier[]=[];private birdWait=3;private butterflyWait=2;private fireflyWait=1;
 private visitorWait=4;private visitor:{g:Phaser.GameObjects.Graphics;x:number;y:number;startX:number;startY:number;t:number}|null=null;
 constructor(private scene:Phaser.Scene){}
 update(dt:number,birds:boolean,daylight:boolean,birdhouse:{x:number;y:number}|null=null,outdoors=true,activity=1){
  if(outdoors&&daylight){this.butterflyWait-=dt*activity;if(this.butterflyWait<=0){this.spawn(false);this.butterflyWait=12+Math.random()*15;}if(birds){this.birdWait-=dt;if(this.birdWait<=0){this.spawn(true);this.birdWait=18+Math.random()*20;}}}
  if(outdoors&&!daylight){this.fireflyWait-=dt;if(this.fireflyWait<=0){this.spawn(false,true);this.fireflyWait=3+Math.random()*5;}}
  for(const f of [...this.fliers]){f.t+=dt;f.x+=f.speed*dt;const yy=f.y+Math.sin(f.t*(f.bird?3:5))*(f.bird?5:10),g=f.g;g.setVisible(outdoors);g.clear();g.setPosition(f.x,yy).setScale(f.speed<0?-1:1,1);g.setAlpha(f.firefly?(daylight?0:1):daylight?1:.25);
   if(f.firefly){const pulse=.55+.45*Math.sin(f.t*4);g.fillStyle(0xd5ed80,.05*pulse);g.fillCircle(0,0,11);g.fillStyle(0xe5fa93,.14*pulse);g.fillCircle(0,0,6);g.fillStyle(0xf4ffc0,.5+.5*pulse);g.fillCircle(0,0,1.8);g.fillStyle(0xffffff,.7);g.fillCircle(-.3,-.3,.65);}
   else if(f.bird){g.fillStyle(0x344e58);g.fillEllipse(0,0,8,4);g.fillStyle(0xd2d2ae);g.fillEllipse(2,1,4,2);g.lineStyle(2,0x42636b);const wing=Math.sin(f.t*17)*6;g.lineBetween(-1,0,-5,wing);g.lineBetween(0,0,4,wing-1);g.fillStyle(0xcba36c);g.fillTriangle(4,-1,7,0,4,1);}
   else{const spread=1+Math.abs(Math.sin(f.t*17))*4;g.fillStyle(0x3c5140);g.fillEllipse(0,0,2,6);g.fillStyle(f.color);g.fillEllipse(-spread/2,-1,spread,6);g.fillEllipse(spread/2,-1,spread,6);g.fillStyle(0xeadc99);g.fillCircle(-spread/2,-2,1);}
   if(f.t>22){g.destroy();this.fliers.splice(this.fliers.indexOf(f),1);}
  }
  this.visit(dt,outdoors&&birds&&daylight?birdhouse:null);
  const surface=document.querySelector<HTMLElement>('#game')!;surface.dataset.fireflies=String(this.fliers.filter(f=>f.firefly).length);surface.dataset.birds=String(this.fliers.filter(f=>f.bird).length);surface.dataset.butterflies=String(this.fliers.filter(f=>!f.bird&&!f.firefly).length);
 }
 private visit(dt:number,house:{x:number;y:number}|null){
  const surface=document.querySelector<HTMLElement>('#game')!;
  if(!house||this.visitor&&(this.visitor.x!==house.x||this.visitor.y!==house.y)){this.visitor?.g.destroy();this.visitor=null;this.visitorWait=4;}
  if(house&&!this.visitor){this.visitorWait-=dt;if(this.visitorWait<=0){const view=this.scene.cameras.main.worldView;this.visitor={g:this.scene.add.graphics().setDepth(151),x:house.x,y:house.y,startX:view.left-12,startY:Math.max(view.top+30,house.y-95),t:0};}}
  if(this.visitor){const v=this.visitor;v.t+=dt;const g=v.g;g.clear();
   if(v.t<3.2||v.t>5.8){const u=Math.min(1,v.t/3.2),ease=u*u*(3-2*u);const x=v.t<3.2?v.startX+(v.x-v.startX)*ease:v.x+(v.t-5.8)*64;const y=v.t<3.2?v.startY+(v.y-27-v.startY)*ease-Math.sin(u*Math.PI)*13:v.y-27-(v.t-5.8)*15;
    g.setPosition(x,y);g.fillStyle(0x415d63);g.fillEllipse(0,0,7,4);g.fillStyle(0xd2d2ae);g.fillEllipse(1,1,4,2);g.lineStyle(2,0x5b7c84);const wing=Math.sin(v.t*18)*5;g.lineBetween(-1,0,-4,wing);g.lineBetween(1,0,4,wing);g.fillStyle(0xd2b37b);g.fillTriangle(3,-1,6,0,3,1);
   }
   if(v.t>=3.2&&v.t<5){g.setPosition(v.x+1,v.y-24);g.fillStyle(0x415d63);g.fillEllipse(0,0,7,4);g.fillStyle(0x93a9a6);g.fillEllipse(-1,0,4,2);g.fillStyle(0xe4cf97);g.fillTriangle(3,-1,5,0,3,1);g.lineStyle(1,0x756149);g.lineBetween(-1,2,-1,3);g.lineBetween(1,2,1,3);}
   if(v.t>10){g.destroy();this.visitor=null;this.visitorWait=24+Math.random()*20;}
  }
  surface.dataset.birdVisitPhase=this.visitor?(this.visitor.t<3.2?'entering':this.visitor.t<5?'perched':this.visitor.t<5.8?'inside':'leaving'):'none';
 }
 private spawn(bird:boolean,firefly=false){const view=this.scene.cameras.main.worldView;const fromLeft=Math.random()>.5;const y=view.top+60+Math.random()*Math.max(30,view.height-150);if(!bird&&nestInfluence(Math.max(view.left,Math.min(view.right,forestNest.x)),y)>.25&&Math.random()<.75)return;this.fliers.push({g:this.scene.add.graphics().setDepth(150).setBlendMode(firefly?Phaser.BlendModes.ADD:Phaser.BlendModes.NORMAL),x:fromLeft?view.left-15:view.right+15,y,t:0,speed:(fromLeft?1:-1)*(bird?75:firefly?18:27),bird,firefly,color:[0xe8b35c,0xc392bc,0xb1cfe5][Math.floor(Math.random()*3)]});}
}
