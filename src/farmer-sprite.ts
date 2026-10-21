import Phaser from 'phaser';
import farmerSheet from './assets/farmer-b.png?url';

export const FARMER_TEXTURE='farmer-b';
export function preloadFarmer(scene:Phaser.Scene){scene.load.image(FARMER_TEXTURE,farmerSheet);}
// Actual painted frame bounds in the original 1536 × 1024 sheet. Each frame
// shares a grounded origin and height, despite different transparent margins.
const frames=[
 [139,48,182,482],[500,48,195,482],[849,48,188,482],[1210,48,191,482],
 [135,543,187,445],[508,540,185,448],[841,540,185,448],[1215,538,242,447]
];
export function createFarmerSprite(scene:Phaser.Scene){
 const texture=scene.textures.get(FARMER_TEXTURE);
 for(const [index,[x,y,w,h]]of frames.entries())if(!texture.has(String(index)))texture.add(String(index),0,x,y,w,h);
 texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
 return scene.add.image(0,0,FARMER_TEXTURE,'0').setOrigin(.5,1).setDisplaySize(frames[0][2]/frames[0][3]*53,53);
}
export function poseFarmer(sprite:Phaser.GameObjects.Image,walking:boolean,phase:number,dir:{x:number;y:number},working:boolean){
 const step=Math.floor(phase/Math.PI*2);
 const sideways=Math.abs(dir.x)>Math.abs(dir.y),back=!sideways&&dir.y<0;
 const frame=sideways?(walking&&step%2?7:3):back?(walking?[4,5,4,6][step%4]:4):(walking?[0,1,0,2][step%4]:0);
 sprite.setFrame(String(frame));const bounds=frames[frame];sprite.setDisplaySize(bounds[2]/bounds[3]*53,53);
 sprite.y=walking?-Math.abs(Math.sin(phase))*.7:0;sprite.angle=working?-2:0;
}
