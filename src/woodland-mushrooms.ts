import Phaser from 'phaser';
import {drawMushroomArt,type MushroomPoint} from './mushroom-art';
import {MushroomLight} from './mushroom-light';
import {villagePaths,forestTrees,villageTrees} from './village-layout';
import {forestNest,forestPlants,walkingStick,forestBench} from './forest';
function segmentDistance(x:number,y:number,a:readonly number[],b:readonly number[]){const dx=b[0]-a[0],dy=b[1]-a[1],t=Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/(dx*dx+dy*dy)));return Math.hypot(x-a[0]-dx*t,y-a[1]-dy*t);}
export function mushroomClearOfPaths(p:MushroomPoint){return villagePaths.every(path=>path.points.slice(1).every((b,i)=>segmentDistance(p.x,p.y-34*p.s,path.points[i],b)>path.width/2+26*p.s&&segmentDistance(p.x,p.y,path.points[i],b)>path.width/2+9*p.s));}
const anchors=[{x:176,y:788,s:.5},{x:-125,y:1008,s:.7},{x:-345,y:1060,s:.75},{x:-505,y:1060,s:.8},{x:-768,y:1122,s:.7},{x:-1005,y:1090,s:.65}];
export const woodlandMushrooms:MushroomPoint[]=[];
for(const anchor of anchors){
 const offsets=[[0,0],...Array.from({length:8},(_,i)=>{const d=8*(i+1);return [[-d,0],[d,0],[0,-d],[0,d],[-d,-d],[d,d],[-d,d],[d,-d]];}).flat()];
 for(const [dx,dy]of offsets){const p={...anchor,x:anchor.x+dx,y:anchor.y+dy};if(!mushroomClearOfPaths(p)||[forestNest,walkingStick,forestBench,...forestPlants].some(o=>Math.hypot(p.x-o.x,p.y-o.y)<50)||[...forestTrees,...villageTrees].some(t=>Math.hypot(t.x-p.x,t.y-p.y)<24||t.y>p.y&&t.y-p.y<83&&Math.abs(t.x-p.x)<30+p.s*23)||woodlandMushrooms.some(o=>Math.hypot(p.x-o.x,p.y-o.y)<65))continue;woodlandMushrooms.push(p);break;}
}
// Pure decoration: no attack, collision, damage or interaction handler.
export class WoodlandMushrooms{
 private art:Phaser.GameObjects.Graphics;private glow:Phaser.GameObjects.Graphics;private light:MushroomLight;private age=0;
 constructor(private scene:Phaser.Scene){this.art=scene.add.graphics().setDepth(92);this.glow=scene.add.graphics().setDepth(94).setBlendMode(Phaser.BlendModes.ADD);this.light=new MushroomLight(scene,woodlandMushrooms);}
 hide(){this.art.setVisible(false);this.glow.setVisible(false);this.light.hide();}
 update(dt:number,actor:{x:number;y:number},outdoors:boolean,night:number){
  if(!outdoors||actor.y<600||actor.y>=1400||actor.x>350){this.hide();return;}
  this.age+=dt;this.art.setVisible(true);this.glow.setVisible(true);drawMushroomArt(this.art,this.glow,woodlandMushrooms,this.age,night);this.light.update(night,this.age);
 }
 destroy(){this.art.destroy();this.glow.destroy();this.light.destroy();}
}
