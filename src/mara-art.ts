import Phaser from 'phaser';
import {characterPortrait} from './character-portrait';
import {drawModernVillager,VILLAGER_SCALE} from './modern-npc-art';
export class MaraArt{
 readonly root:Phaser.GameObjects.Container;deliveryLowering=0;private figure:Phaser.GameObjects.Container;
 private parts:ReturnType<typeof drawModernVillager>;private shears:Phaser.GameObjects.Graphics;
 constructor(scene:Phaser.Scene){this.root=scene.add.container(0,0).setScale(VILLAGER_SCALE);this.figure=scene.add.container(0,0);this.root.add(this.figure);this.parts=drawModernVillager(scene,this.figure,'mara');this.shears=scene.add.graphics();this.parts.leftArm.add(this.shears);this.paint(0,false,false);}
 paint(time:number,walking:boolean,carrying:boolean,pruning=false){
  const p=this.parts,stride=walking?Math.sin(time*11)*2.3:0;
  this.figure.y=this.deliveryLowering*9;p.leftLeg.y=-16+stride-this.deliveryLowering*9;p.rightLeg.y=-16-stride-this.deliveryLowering*9;p.leftLeg.angle=-this.deliveryLowering*25;p.rightLeg.angle=this.deliveryLowering*25;
  p.leftArm.setAngle(carrying?-55:pruning?65:walking?Math.sin(time*11)*12:3);
  p.rightArm.setAngle(carrying?55:pruning?75:walking?-Math.sin(time*11)*12:-3);
  p.head.y=-40+(walking?Math.abs(Math.sin(time*11))*.4:Math.sin(time*1.5)*.12);
  const g=this.shears;g.clear();if(pruning){const snip=Math.max(0,Math.sin(time*4));g.lineStyle(.8,0x394b40).strokeCircle(-.8,13.7,1.1).strokeCircle(1.2,14.5,1.1);g.lineStyle(.7,0xd3d4bc).lineBetween(.1,15,1-snip*1.5,21).lineBetween(.1,15,3+snip*1.5,20);g.fillStyle(0xd4b87c).fillCircle(.1,15,.6);}
 }
}
export function maraPortrait(scene:Phaser.Scene){return characterPortrait(scene,'mara');}
