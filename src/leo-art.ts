import Phaser from 'phaser';
import {drawModernVillager,VILLAGER_SCALE} from './modern-npc-art';
import {characterPortrait} from './character-portrait';
export class LeoArt{
 readonly root:Phaser.GameObjects.Container;
 constructor(scene:Phaser.Scene){
  this.root=scene.add.container(0,0).setScale(VILLAGER_SCALE);
  const parts=drawModernVillager(scene,this.root,'leo');
  const update=(time:number)=>{parts.leftArm.rotation=Math.sin(time/850)*.035;parts.rightArm.rotation=-Math.sin(time/1000)*.025;parts.head.y=-40+Math.sin(time/1600)*.12;};
  scene.events.on('update',update);this.root.once('destroy',()=>scene.events.off('update',update));
 }
}
export function leoPortrait(scene:Phaser.Scene){return characterPortrait(scene,'leo');}
