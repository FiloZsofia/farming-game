import Phaser from 'phaser';
type Flier={g:Phaser.GameObjects.Graphics;x:number;y:number;t:number;speed:number;bird:boolean;color:number};
export class Wildlife{
 private fliers:Flier[]=[];private birdWait=3;private butterflyWait=2;
 constructor(private scene:Phaser.Scene){}
 update(dt:number,birds:boolean,daylight:boolean){
  if(daylight){this.butterflyWait-=dt;if(this.butterflyWait<=0){this.spawn(false);this.butterflyWait=12+Math.random()*15;}if(birds){this.birdWait-=dt;if(this.birdWait<=0){this.spawn(true);this.birdWait=18+Math.random()*20;}}}
  for(const f of [...this.fliers]){f.t+=dt;f.x+=f.speed*dt;const yy=f.y+Math.sin(f.t*(f.bird?3:5))*(f.bird?5:10),g=f.g;g.clear();g.setPosition(f.x,yy).setScale(f.speed<0?-1:1,1);g.setAlpha(daylight?1:.25);
   if(f.bird){g.fillStyle(0x344e58);g.fillEllipse(0,0,8,4);g.fillStyle(0xd2d2ae);g.fillEllipse(2,1,4,2);g.lineStyle(2,0x42636b);const wing=Math.sin(f.t*17)*6;g.lineBetween(-1,0,-5,wing);g.lineBetween(0,0,4,wing-1);g.fillStyle(0xcba36c);g.fillTriangle(4,-1,7,0,4,1);}
   else{const spread=1+Math.abs(Math.sin(f.t*17))*4;g.fillStyle(0x3c5140);g.fillEllipse(0,0,2,6);g.fillStyle(f.color);g.fillEllipse(-spread/2,-1,spread,6);g.fillEllipse(spread/2,-1,spread,6);g.fillStyle(0xeadc99);g.fillCircle(-spread/2,-2,1);}
   if(f.x>850||f.x< -50||f.t>22){g.destroy();this.fliers.splice(this.fliers.indexOf(f),1);}
  }
  const surface=document.querySelector<HTMLElement>('#game')!;surface.dataset.birds=String(this.fliers.filter(f=>f.bird).length);surface.dataset.butterflies=String(this.fliers.filter(f=>!f.bird).length);
 }
 private spawn(bird:boolean){const view=this.scene.cameras.main.worldView;const fromLeft=Math.random()>.5;this.fliers.push({g:this.scene.add.graphics().setDepth(150),x:fromLeft?view.left-15:view.right+15,y:view.top+60+Math.random()*Math.max(30,view.height-150),t:0,speed:(fromLeft?1:-1)*(bird?75:27),bird,color:[0xe8b35c,0xc392bc,0xb1cfe5][Math.floor(Math.random()*3)]});}
}
