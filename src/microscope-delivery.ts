import {HOME_ORIGIN} from './home';
import {drawSuitcase,drawClothing,suitcaseSpot,tossedClothes} from './workshop-luggage-art';
import type Phaser from 'phaser';
import type {FarmerArt} from './character';
import {drawMicroscope} from './bench-microscope-art';
export async function playMicroscopeDelivery(scene:Phaser.Scene,actor:Phaser.GameObjects.Container,avatar:FarmerArt,relocate:(p:{x:number;y:number})=>void,phase:(name:string)=>void=()=>{}){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const scope=scene.add.graphics().setDepth(103).setVisible(false);drawMicroscope(scope,0,-18,.68);
 const wait=(ms:number)=>new Promise<void>(resolve=>{scene.time.delayedCall(ms,resolve);});
 const fade=async(out:boolean)=>{const duration=reduced?100:220;if(out)scene.cameras.main.fadeOut(duration);else scene.cameras.main.fadeIn(duration);await wait(duration+30);};
 const luggage=scene.add.graphics().setDepth(2);drawSuitcase(luggage,suitcaseSpot.x,suitcaseSpot.y);
 const clothing:Phaser.GameObjects.Graphics[]=[];
 const rummage=(duration:number)=>new Promise<void>(resolve=>{const motion={t:0};scene.tweens.add({targets:motion,t:1,duration,onUpdate:()=>avatar.rummagePose(motion.t),onComplete:()=>resolve()});});
 try{
  phase('home-transition');avatar.cancelWork();avatar.equip('none');
  await fade(true);relocate({x:293,y:HOME_ORIGIN+480});avatar.update(false,false,{x:0,y:-1},0);await fade(false);
  phase('rummaging');
  for(let i=0;i<3;i++){
   await rummage(reduced?100:420);
   const piece=scene.add.graphics().setDepth(104).setPosition(suitcaseSpot.x,suitcaseSpot.y-17);drawClothing(piece,i);clothing.push(piece);
   const landing=tossedClothes[i],flight={t:0};
   await new Promise<void>(resolve=>{scene.tweens.add({targets:flight,t:1,duration:reduced?100:430,onUpdate:()=>{const t=flight.t;piece.setPosition(suitcaseSpot.x+(landing.x-suitcaseSpot.x)*t,suitcaseSpot.y-17+(landing.y-suitcaseSpot.y+17)*t-(reduced?0:100*t*(1-t))).setAngle(landing.angle*t+(reduced?0:180*Math.sin(Math.PI*t)));avatar.rummagePose(t);},onComplete:()=>{piece.setDepth(2);resolve();}});});
  }
  await rummage(reduced?100:500);avatar.setCarrying(true);avatar.update(false,false,{x:0,y:-1},0);
  phase('lifting');scope.setPosition(suitcaseSpot.x,suitcaseSpot.y).setVisible(true);
  await new Promise<void>(resolve=>{scene.tweens.add({targets:scope,x:actor.x,y:actor.y,duration:reduced?100:500,ease:'Sine.easeInOut',onComplete:()=>resolve()});});
  await wait(reduced?120:350);
  phase('workshop-transition');await fade(true);relocate({x:185,y:3385});scope.setPosition(actor.x,actor.y);await fade(false);
  avatar.update(false,false,{x:0,y:-1},0);
  phase('placing');await new Promise<void>(resolve=>{scene.tweens.add({targets:scope,x:182,y:3346+18/.68,scaleX:1/.68,scaleY:1/.68,duration:reduced?150:550,ease:'Sine.easeInOut',onComplete:()=>resolve()});});
  await wait(120);
 }finally{scene.cameras.main.resetFX();scope.destroy();luggage.destroy();for(const piece of clothing)piece.destroy();actor.setAlpha(1);avatar.setCarrying(false);avatar.update(false,false,{x:0,y:-1},0);}
}
