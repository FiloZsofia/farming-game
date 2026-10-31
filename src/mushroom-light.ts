import type Phaser from 'phaser';
type Mushroom={x:number;y:number;s:number};
// Follow the mushroom silhouette above the night shade, as with house lamps.
export class MushroomLight{
 private lights:{point:Mushroom;node:HTMLDivElement}[]=[];
 constructor(private scene:Phaser.Scene,points:readonly Mushroom[]){
  for(const point of points){const node=document.createElement('div');node.className='mushroom-emission';node.setAttribute('aria-hidden','true');for(const part of ['ground','stem','cap','gills']){const layer=document.createElement('i');layer.className=part;node.append(layer);}document.querySelector('#game')!.append(node);this.lights.push({point,node});}
 }
 hide(){for(const {node}of this.lights)node.hidden=true;}
 update(night:number,age:number){
  const c=this.scene.cameras.main,z=c.zoom,light=Math.min(1,night/.55);
  for(const {point:p,node}of this.lights){const v=c.worldView;node.hidden=light<=0||p.x+80*p.s<v.left||p.x-80*p.s>v.right||p.y+35*p.s<v.top||p.y-65*p.s>v.bottom;if(node.hidden)continue;node.style.opacity=String(light*(.68+Math.sin(age*1.1+p.x)*.09));node.style.transform='translate('+((p.x-v.x)*z)+'px,'+((p.y-v.y)*z)+'px) scale('+(z*p.s)+')';}
 }
 destroy(){for(const {node}of this.lights)node.remove();}
}
