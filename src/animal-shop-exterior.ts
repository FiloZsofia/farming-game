import type Phaser from 'phaser';
import {worldText} from './world-text';
import {animalShopSite as a,animalShopDisplays} from './animal-shop-site';
import {drawAnimalItem} from './livestock-art';
export function drawAnimalShopFront(scene:Phaser.Scene,g:Phaser.GameObjects.Graphics){
 const r=(x:number,y:number,w:number,h:number,c:number)=>g.fillStyle(c).fillRect(x,y,w,h),line=(x:number,y:number,xx:number,yy:number,c:number,w=1)=>g.lineStyle(w,c).lineBetween(x,y,xx,yy),poly=(p:number[],c:number)=>g.fillStyle(c).fillPoints(Array.from({length:p.length/2},(_,i)=>({x:p[i*2],y:p[i*2+1]})),true);
 const {x,y,w,h}=a;g.fillStyle(0x35513c,.24).fillEllipse(x+w/2+12,y+h+8,w+38,36);r(x,y,w,h,0xd5c39e);r(x+3,y+5,w-6,h-12,0xe0cfaa);
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
 const t=worldText(scene,x+w/2,y+30,'ÁLLATOSBOLT',{fontFamily:'Georgia,serif',fontSize:'11px',color:'#f9ebc6',backgroundColor:'#4a5e4b',padding:{x:8,y:5}}).setOrigin(.5).setDepth(5);scene.events.once('shutdown',()=>t.destroy());
}
export class AnimalShopDisplayArt{
 private arts:{g:Phaser.GameObjects.Graphics;y:number}[]=[];
 constructor(scene:Phaser.Scene){for(const p of animalShopDisplays){const g=scene.add.graphics();g.save().translateCanvas(p.x,p.y).scaleCanvas(p.scale,p.scale);if(p.kind==='feed'){for(const [dx,dy]of [[-7,0],[10,-3]]){g.fillStyle(0x9b8159).fillRoundedRect(dx-8,dy-22,16,25,3);g.fillStyle(0xc4ab79).fillRoundedRect(dx-7,dy-23,14,22,3);g.lineStyle(1,0xe0c58e).lineBetween(dx-5,dy-19,dx+5,dy-19);g.fillStyle(0x63816b).fillRect(dx-4,dy-12,8,7);g.lineStyle(.7,0xe2d1a7).lineBetween(dx,dy-6,dx,dy-11);}}else drawAnimalItem(g,p.kind,0,0,1);g.restore();this.arts.push({g,y:p.y});}scene.events.once('shutdown',()=>this.arts.forEach(a=>a.g.destroy()));}
 update(actor:{y:number}){for(const a of this.arts)a.g.setDepth(actor.y<a.y?101:3);}
}
