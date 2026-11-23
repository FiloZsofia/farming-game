import type Phaser from 'phaser';
import {worldText} from './world-text';
import {animalShopSite as a,animalShopDisplays,animalShopYard} from './animal-shop-site';
import {drawAnimalFence} from './livestock-art';
export function drawAnimalShopFront(scene:Phaser.Scene,g:Phaser.GameObjects.Graphics){
 const r=(x:number,y:number,w:number,h:number,c:number)=>g.fillStyle(c).fillRect(x,y,w,h),line=(x:number,y:number,xx:number,yy:number,c:number,w=1)=>g.lineStyle(w,c).lineBetween(x,y,xx,yy),poly=(p:number[],c:number)=>g.fillStyle(c).fillPoints(Array.from({length:p.length/2},(_,i)=>({x:p[i*2],y:p[i*2+1]})),true);
 const {w,h}=a,x=790,y=1175;g.save().translateCanvas(a.x-x,a.y-y);g.fillStyle(0x35513c,.24).fillEllipse(x+w/2+12,y+h+8,w+38,36);r(x,y,w,h,0xd5c39e);r(x+3,y+5,w-6,h-12,0xe0cfaa);
 for(let yy=y+9;yy<y+h-12;yy+=8){line(x+4,yy,x+w-4,yy,0xb4a17e,.65);line(x+6,yy+1,x+w-6,yy+1,0xebdcba,.5);}r(x,y+h-12,w,12,0x8e9279);for(let xx=x+3;xx<x+w;xx+=18)r(xx,y+h-10,15,6,0xb9b399);
 for(const xx of [x+1,x+w-7]){r(xx,y+15,6,h-29,0x6b7763);r(xx+1,y+16,2,h-31,0xa2ad8c);}
 poly([x-7,y+15,x+18,y-43,x+w-19,y-43,x+w+7,y+15],0x4e5e52);poly([x-4,y+10,x+21,y-39,x+w-22,y-39,x+w+3,y+10],0x718473);
 for(let yy=y-35;yy<y+10;yy+=7){const d=(yy-y+39)*.46;line(x+21-d,yy,x+w-22+d,yy,0xa0ad8a,.8);for(let xx=x+25-d;xx<x+w-24+d;xx+=17)line(xx,yy,xx-3,yy+6,0x516859,.7);}r(x-6,y+12,w+12,4,0x58634e);line(x-5,y+12,x+w+5,y+12,0xb8b58b);
 for(const xx of [804,930]){r(xx-4,y+30,36,43,0x8e7653);r(xx-2,y+32,32,39,0xf0dfb9);r(xx+1,y+35,26,33,0x71968a);poly([xx+3,y+37,xx+24,y+37,xx+3,y+61],0xb6cbb7);line(xx+14,y+35,xx+14,y+69,0xf0dfbb,2);line(xx+1,y+51,xx+27,y+51,0xf0dfbb,2);r(xx-5,y+73,38,5,0x7b7051);}
 // A deep doorway, joinery and striped shop awning give the entrance its own silhouette.
 r(864,y+78,36,62,0x5b634e);r(868,y+81,28,58,0x8e7958);r(871,y+84,22,29,0x93b4a4);line(873,y+86,880,y+97,0xd8dfbd,1.5);r(871,y+117,22,18,0xa58b62);r(889,y+113,2,5,0xe8cb80);r(857,y+139,51,6,0xb8ad91);r(853,y+145,59,5,0xd4c8a7);
 poly([851,y+73,910,y+73,917,y+87,844,y+87],0x748d72);for(let i=0;i<6;i++){const xx=847+i*12;r(xx,y+84,10,7,i%2?0x758c71:0xd7cfaa);}line(845,y+91,916,y+91,0x546d54);
 // Hanging emblem: a hen rather than another generic rectangular board.
 r(960,y+79,2,16,0x765f42);line(947,y+79,976,y+79,0x765f42,2);g.fillStyle(0xd9c79d).fillEllipse(962,y+104,29,23);g.lineStyle(1,0x8c7754).strokeEllipse(962,y+104,29,23);g.fillStyle(0x8a6244).fillEllipse(960,y+105,14,10).fillCircle(967,y+99,4);g.fillStyle(0xb7654e).fillCircle(966,y+95,1.5);g.fillStyle(0x443e30).fillCircle(968,y+98,1);
 // A worn grassy surface stays entirely within the little yard.
 g.fillStyle(0x9ba16a,.45).fillRoundedRect(904,1346,68,107,9);g.fillStyle(0xb7a67b,.32).fillEllipse(938,1404,52,77);for(let i=0;i<19;i++){const xx=910+(i*17)%56,yy=1353+(i*23)%92;line(xx,yy,xx+2,yy,0xc3b38a,.8);}
 g.restore();const t=worldText(scene,a.x+w/2,a.y+30,'GAZDAUDVAR',{fontFamily:'Georgia,serif',fontSize:'11px',color:'#f9ebc6',backgroundColor:'#4a5e4b',padding:{x:8,y:5}}).setOrigin(.5).setDepth(5);scene.events.once('shutdown',()=>t.destroy());
}
export class AnimalShopDisplayArt{
 private arts:{g:Phaser.GameObjects.Graphics;y:number}[]=[];
 private fences:Phaser.GameObjects.Graphics[]=[];
 constructor(scene:Phaser.Scene){
  for(const p of animalShopDisplays){const g=scene.add.graphics();g.fillStyle(0x40583b,.22).fillEllipse(p.x+2,p.y+8,71,22);
   for(const [dx,dy]of [[-13,0],[14,8],[-10,-17]]){const x=p.x+dx,y=p.y+dy;g.fillStyle(0x927247).fillRoundedRect(x-18,y-17,36,20,2);g.fillStyle(0xc4a366).fillRect(x-17,y-16,34,17);g.fillStyle(0xe1c383).fillPoints([{x:x-18,y:y-17},{x:x-11,y:y-24},{x:x+22,y:y-24},{x:x+18,y:y-17}],true);g.fillStyle(0xab864e).fillPoints([{x:x+18,y:y-17},{x:x+22,y:y-24},{x:x+22,y:y-5},{x:x+18,y:y+3}],true);
    for(let i=0;i<12;i++){const xx=x-15+i*2.6;g.lineStyle(.65,i%3?0xdec286:0x9e7a43).lineBetween(xx,y-14,xx+3,y-2);g.lineStyle(.65,0xf0d798).lineBetween(xx,y-19,xx+5,y-22);}for(const xx of [x-8,x+9]){g.lineStyle(1.3,0x716b4d).lineBetween(xx,y-16,xx,y+2).lineBetween(xx,y-17,xx+5,y-24);g.lineStyle(.4,0xb3ac7c).lineBetween(xx+1,y-15,xx+1,y+1);}}
   this.arts.push({g,y:p.y+10});
  }
  for(let i=0;i<animalShopYard.boundary.length;i++)this.fences.push(scene.add.graphics());scene.events.once('shutdown',()=>{this.arts.forEach(a=>a.g.destroy());this.fences.forEach(g=>g.destroy());});
 }
 update(actor:{x:number;y:number}){for(const a of this.arts)a.g.setDepth(actor.y<a.y?101:3);const poly=animalShopYard.boundary,gate={x:poly[3].x,y:(poly[3].y+poly[0].y)/2},open=Math.hypot(actor.x-gate.x,actor.y-gate.y)<30;for(let i=0;i<this.fences.length;i++){const g=this.fences[i],a=poly[i],b=poly[(i+1)%poly.length];drawAnimalFence(g,animalShopYard,open,i);g.setDepth(actor.y<(a.y+b.y)/2?101:3);}}
}
