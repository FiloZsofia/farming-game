import type Phaser from 'phaser';
import {HOME_ORIGIN} from './home';
export class HomeLight {
 private light:HTMLDivElement;
 private daylight:Phaser.GameObjects.Graphics;
 constructor(private scene:Phaser.Scene){this.daylight=scene.add.graphics().setDepth(.1);this.daylight.fillStyle(0xf5dfa2,.13).fillPoints([{x:317,y:HOME_ORIGIN+210},{x:413,y:HOME_ORIGIN+210},{x:495,y:HOME_ORIGIN+437},{x:315,y:HOME_ORIGIN+445}],true);this.light=document.createElement('div');this.light.className='workshop-lamp-light home-bedside-light';this.light.setAttribute('aria-hidden','true');for(const name of ['halo','pool','core']){const part=document.createElement('i');part.className=name;this.light.append(part);}document.querySelector('#game')!.append(this.light);}
 update(darkness:number){this.daylight.setAlpha(1-Math.min(1,Math.max(0,darkness/.55)));const c=this.scene.cameras.main,z=c.zoom,x=279,y=HOME_ORIGIN+246;this.light.hidden=!c.worldView.contains(x,y);this.light.style.opacity=String(Math.min(1,Math.max(0,darkness/.55)));this.light.style.transform=`translate(${(x-c.worldView.x)*z}px,${(y-c.worldView.y)*z}px) scale(${z*1.4})`;}
 destroy(){this.daylight.destroy();this.light.remove();}
}
