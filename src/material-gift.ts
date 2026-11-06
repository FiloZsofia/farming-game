import type Phaser from 'phaser';
import {itemIcon} from './item-icons';
export function showMaterialGift(scene:Phaser.Scene,actor:{x:number;y:number},material:'glass'|'linen'){
 const gift=document.createElement('div');gift.className='material-gift';gift.dataset.materialGift=material;gift.setAttribute('role','status');
 const flight=document.createElement('div');flight.className='material-gift-flight';const label=document.createElement('span');label.textContent=material==='glass'?'+1 Üvegedény':'+1 Lenszövet';flight.append(itemIcon(material==='glass'?'glassJar':'linenCloth'),label);gift.append(flight);document.querySelector('#app')!.append(gift);
 const start=performance.now();let frame=0;
 const cleanup=()=>{cancelAnimationFrame(frame);gift.remove();scene.events.off('shutdown',cleanup);};scene.events.once('shutdown',cleanup);
 const update=()=>{if(performance.now()-start>=2000){cleanup();return;}const camera=scene.cameras.main,rect=scene.game.canvas.getBoundingClientRect(),sx=rect.width/scene.scale.width,sy=rect.height/scene.scale.height;gift.style.left=`${rect.left+(camera.x+(actor.x-camera.worldView.x)*camera.zoom)*sx}px`;gift.style.top=`${rect.top+(camera.y+(actor.y-58-camera.worldView.y)*camera.zoom)*sy}px`;frame=requestAnimationFrame(update);};update();
}
