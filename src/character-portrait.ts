import type Phaser from 'phaser';
import {drawSamStudy} from './sam-study-art';
import {drawModernVillager,type Villager} from './modern-npc-art';

// Portraits use the very same drawing as the full figure, with one shared crop.
export function characterPortrait(scene:Phaser.Scene,person:Villager|'sam'){
 const image=document.createElement('img');image.className='item-icon character-portrait';
 image.alt=`${({sam:'Sam',annie:'Annie',leo:'Leo',simon:'Simon',mara:'Mara',noah:'Noah'} as const)[person]} arcképe`;
 const root=scene.add.container(128,448).setScale(8);
 if(person==='sam')drawSamStudy(scene,root);else drawModernVillager(scene,root,person);
 const portrait=scene.add.renderTexture(0,0,256,256).setVisible(false);
 portrait.draw(root);root.destroy();
 portrait.snapshot(result=>{if(result instanceof HTMLImageElement)image.src=result.src;portrait.destroy();});
 return image;
}
