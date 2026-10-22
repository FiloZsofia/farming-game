import Phaser from 'phaser';
export class VillageAmbience{
 private g:Phaser.GameObjects.Graphics;private time=0;
 constructor(scene:Phaser.Scene){this.g=scene.add.graphics().setDepth(8);}
 update(seconds:number,night:number,visible:boolean){
  const g=this.g;g.clear();if(!visible)return;this.time+=seconds;
  for(let i=0;i<3;i++){const t=(this.time*.35+i/3)%1;g.lineStyle(.7,0xd6e1c2,(1-t)*.65).strokeEllipse(476,1076,5+t*34,3+t*15);}
  // Slow chimney smoke, leaves and a warm lantern keep the square alive.
  for(let i=0;i<4;i++){const t=(this.time*.15+i*.25)%1;g.fillStyle(0xe0dcc4,(1-t)*.18).fillEllipse(685+Math.sin(t*6)*7,1110-t*39,7+t*13,6+t*10);}
  for(let i=0;i<9;i++){const t=this.time*(4+i%3);const x=310+(i*53+t*.4)%340,y=964+(i*37+t)%260;g.fillStyle(i%2?0xdfc996:0xc5b77c,.55).fillEllipse(x+Math.sin(this.time+i)*6,y,2.4,1.1);}
  if(night>.05){const a=night/.55;for(const [x,y]of [[418,933],[540,888],[657,888],[600,1178],[705,1178]]){g.fillStyle(0xf3c97e,.025*a).fillCircle(x,y,38);g.fillStyle(0xffdc8e,.06*a).fillCircle(x,y,20);g.fillStyle(0xffe6a3,.48*a).fillEllipse(x,y,7,10);}}
 }
}
