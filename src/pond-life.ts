import Phaser from 'phaser';
import type {Estate} from './estate';
import {pondWaterAt,pondOutline} from './pond-shape';
export const fishArc=(t:number,rise:number)=>Math.sin(Math.PI*Math.max(0,Math.min(1,t)))*rise;
export class PondLife{
 private wait=7;private age=0;private active=false;private x=0;private y=0;private gold=false;
 private fish:Phaser.GameObjects.Graphics;private ripple:Phaser.GameObjects.Graphics;private water:Phaser.GameObjects.Graphics;private waterTime=0;
 constructor(private scene:Phaser.Scene){this.water=scene.add.graphics().setDepth(0);this.fish=scene.add.graphics().setDepth(105);this.ripple=scene.add.graphics().setDepth(104);}
 private drawFish(g:Phaser.GameObjects.Graphics,gold:boolean){
  g.clear();
  const body=gold?0xb88b52:0x768d7e,back=gold?0x8a673e:0x4e6c62,light=gold?0xd0b079:0xa7b6a0;
  g.fillStyle(back).fillPoints([{x:-5,y:0},{x:-11,y:-4},{x:-10,y:0},{x:-11,y:4}],true);
  g.fillStyle(body).fillPoints([{x:-7,y:0},{x:-4,y:-2.8},{x:2,y:-3},{x:6,y:-1.5},{x:8,y:0},{x:5,y:2.2},{x:0,y:3},{x:-4,y:2}],true);
  g.fillStyle(back).fillTriangle(-2,-2,0,-5,3,-2);
  g.lineStyle(.7,light).lineBetween(-3,1,4,1.7);
  g.lineStyle(.65,back).lineBetween(3,-1.7,2,1.7);
  g.fillStyle(light).fillTriangle(-1,1,-3,4,2,2);
  for(let i=0;i<3;i++)g.lineStyle(.45,light,.6).lineBetween(-4+i*2,-1,-3+i*2,0);
  g.fillStyle(0x293f37).fillCircle(5,-.5,.8);
  g.fillStyle(0xe1d9ba).fillCircle(5.2,-.8,.25);
 }
 update(dt:number,estate:Estate,daylight:boolean,outdoors:boolean){
  this.waterTime+=dt;this.water.clear();
  if(outdoors){const outline=pondOutline(),left=Math.min(...outline.map(p=>p.x)),right=Math.max(...outline.map(p=>p.x)),top=Math.min(...outline.map(p=>p.y)),bottom=Math.max(...outline.map(p=>p.y));
   for(let i=0;i<34;i++){
    const phase=this.waterTime*.85+i*2.4,drift=this.waterTime*2.5,spread=Math.sin(i*78.233+4.1)*43758.5453,
     x=left+(right-left)*((i*.6180339)%1)+Math.sin(phase*.45)*5,
     y=top+((bottom-top)*(spread-Math.floor(spread))+drift)%(bottom-top),w=5+i%5*1.8;
    const points=Array.from({length:7},(_,j)=>{const t=j/6;return{x:x+(t-.5)*w*2,y:y+Math.sin(t*Math.PI)*1.7};});
    if(points.every(p=>pondWaterAt(p.x,p.y,undefined,.87))){
     const alpha=(daylight?.25:.12)+.12*Math.sin(phase);
     this.water.lineStyle(.9,0xc5d2c5,alpha).strokePoints(points,false);
     if(i%3===0)this.water.lineStyle(.6,0x8baaa2,alpha*.8).lineBetween(x-w*.5,y+3,x+w*.5,y+3);
    }
   }
  }
  const count=estate.fish.goldfish+estate.fish.carp,view=this.scene.cameras.main.worldView;
  const visible=outdoors&&daylight&&count>0&&view.contains(630,465);this.fish.setVisible(visible);this.ripple.setVisible(visible);
  if(!visible){document.querySelector<HTMLElement>('#game')!.dataset.fishJumping='false';this.active=false;this.age=0;this.fish.clear();this.ripple.clear();return;}
  if(!this.active){this.wait-=dt;if(this.wait<=0){this.active=true;this.age=0;this.x=582+Math.random()*100;this.y=443+Math.random()*57;this.gold=Math.random()*count<estate.fish.goldfish;}}
  if(this.active){this.age+=dt;const t=this.age/1.1;
   if(t<1){this.drawFish(this.fish,this.gold);this.fish.setPosition(this.x+t*29,this.y-fishArc(t,33)).setRotation(-.8+t*1.6);}
   else{this.fish.clear();const fade=Math.min(1,(this.age-1.1)/.8);this.ripple.clear().lineStyle(1,0xc8dfcc,1-fade).strokeEllipse(this.x+29,this.y,10+fade*25,4+fade*11);if(fade>=1){this.active=false;this.ripple.clear();this.wait=13+Math.random()*19;}}
  }
  document.querySelector<HTMLElement>('#game')!.dataset.fishJumping=String(this.active&&this.age<1.1);
 }
 throwFish(from:{x:number;y:number},to:{x:number;y:number},gold:boolean){
  const fish=this.scene.add.graphics().setDepth(151),splash=this.scene.add.graphics().setDepth(150),motion={t:0};this.drawFish(fish,gold);
  document.querySelector<HTMLElement>('#game')!.dataset.fishThrowing='true';
  return new Promise<void>(resolve=>this.scene.tweens.add({targets:motion,t:1,duration:1050,ease:'Linear',onUpdate:()=>{const t=motion.t;fish.setPosition(from.x+(to.x-from.x)*t,from.y-24+(to.y-from.y+24)*t-fishArc(t,68)).setRotation(-1+t*1.7);},onComplete:()=>{fish.destroy();const ring={t:0};this.scene.tweens.add({targets:ring,t:1,duration:550,onUpdate:()=>{splash.clear().lineStyle(1.4,0xcce6dc,1-ring.t).strokeEllipse(to.x,to.y,8+ring.t*29,4+ring.t*12);for(let i=0;i<4;i++)splash.fillStyle(0xc4e0d6,1-ring.t).fillCircle(to.x+(i-1.5)*ring.t*10,to.y-fishArc(ring.t,12+i%2*6),1.3);},onComplete:()=>{splash.destroy();document.querySelector<HTMLElement>('#game')!.dataset.fishThrowing='false';resolve();}});}}));
 }
}
