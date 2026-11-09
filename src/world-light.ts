import type Phaser from 'phaser';
// Resolve light anchors after camera follow, zoom and shake, in the same frame as the canvas.
export function bindWorldLight(scene:Phaser.Scene,node:HTMLElement,anchor:()=>{x:number;y:number;scale?:number}){
 const dispose=()=>{scene.game.events.off('postrender',sync);scene.events.off('shutdown',dispose);};
 const sync=()=>{if(!node.isConnected){dispose();return;}const p=anchor(),c=scene.cameras.main,m=(c as Phaser.Cameras.Scene2D.Camera&{matrix:Phaser.GameObjects.Components.TransformMatrix}).matrix,q=m.transformPoint(p.x-c.scrollX,p.y-c.scrollY),rect=scene.game.canvas.getBoundingClientRect(),parent=node.offsetParent?.getBoundingClientRect()??rect,sx=rect.width/scene.scale.width,sy=rect.height/scene.scale.height,k=p.scale??1;node.style.transform=`matrix(${m.a*k*sx},${m.b*k*sy},${m.c*k*sx},${m.d*k*sy},${q.x*sx+rect.left-parent.left},${q.y*sy+rect.top-parent.top})`;};
 scene.game.events.on('postrender',sync);scene.events.once('shutdown',dispose);
}
