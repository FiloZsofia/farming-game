import type Phaser from 'phaser';
type Mushroom={x:number;y:number;s:number};
// Follow the mushroom silhouette above the night shade, as with house lamps.
export class MushroomLight{
 private lights:{point:Mushroom;node:HTMLDivElement}[]=[];
 private active=false;private night=0;private age=0;
 constructor(private scene:Phaser.Scene,points:readonly Mushroom[]){
  for(const point of points){const node=document.createElement('div');node.className='mushroom-emission';node.setAttribute('aria-hidden','true');for(const part of ['ground','stem','cap','gills']){const layer=document.createElement('i');layer.className=part;node.append(layer);}document.querySelector('#game')!.append(node);this.lights.push({point,node});}
  // Camera follow and shake are resolved during rendering, after Scene.update.
  scene.game.events.on('postrender',this.sync);
 }
 hide(){this.active=false;for(const {node}of this.lights)node.hidden=true;}
 update(night:number,age:number){
  this.night=night;this.age=age;this.active=night>0;if(!this.active)this.hide();
 }
 private sync=()=>{
  if(!this.active)return;
  const c=this.scene.cameras.main,m=(c as Phaser.Cameras.Scene2D.Camera&{matrix:Phaser.GameObjects.Components.TransformMatrix}).matrix,light=Math.min(1,this.night/.55);
  for(const {point:p,node}of this.lights){const v=c.worldView;node.hidden=p.x+80*p.s<v.left||p.x-80*p.s>v.right||p.y+35*p.s<v.top||p.y-65*p.s>v.bottom;if(node.hidden)continue;
   const q=m.transformPoint(p.x-c.scrollX,p.y-c.scrollY);node.style.opacity=String(light*(.68+Math.sin(this.age*1.1+p.x)*.09));
   node.style.transform='matrix('+[m.a*p.s,m.b*p.s,m.c*p.s,m.d*p.s,q.x,q.y].join(',')+')';
  }
 };
 destroy(){this.scene.game.events.off('postrender',this.sync);for(const {node}of this.lights)node.remove();}
}
