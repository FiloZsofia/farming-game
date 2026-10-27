import {HOME_ORIGIN} from './home';
import type Phaser from 'phaser';
export const suitcaseSpot={x:293,y:HOME_ORIGIN+450};
export const tossedClothes=[{x:245,y:HOME_ORIGIN+474,angle:18},{x:326,y:HOME_ORIGIN+490,angle:-25},{x:264,y:HOME_ORIGIN+494,angle:35}];
export function drawSuitcase(g:Phaser.GameObjects.Graphics,x:number,y:number,open=true){
 g.fillStyle(0x263d32,.25).fillEllipse(x,y+3,47,15);
 g.fillStyle(0x684a34).fillRoundedRect(x-21,y-13,42,18,4);g.fillStyle(0x9c774c).fillRoundedRect(x-19,y-12,38,14,3);
 g.fillStyle(0x423c30).fillRoundedRect(x-16,y-14,32,5,2);g.fillStyle(0xb69b6c).fillRect(x-16,y-13,17,3);
 if(open){g.fillStyle(0x77583b).fillRoundedRect(x-21,y-39,42,23,4);g.fillStyle(0xb19a73).fillRoundedRect(x-17,y-36,34,17,2);
 g.lineStyle(2,0x523e2e).strokeRoundedRect(x-6,y-45,12,7,2);}else{g.fillStyle(0x9c774c).fillRoundedRect(x-21,y-23,42,14,4);g.lineStyle(2,0x523e2e).strokeRoundedRect(x-6,y-28,12,6,2);}
 for(const dx of [-13,11]){g.fillStyle(0x544332).fillRect(x+dx,y-12,3,16);g.fillStyle(0xcbb17c).fillRect(x+dx-1,y-8,5,3);}
}
export function drawClothing(g:Phaser.GameObjects.Graphics,index:number){
 if(index===0){g.fillStyle(0xc58457).fillPoints([{x:-12,y:-6},{x:-5,y:-11},{x:5,y:-11},{x:13,y:-5},{x:9,y:1},{x:5,y:-2},{x:6,y:10},{x:-6,y:10},{x:-5,y:-2},{x:-9,y:1}],true);g.lineStyle(1,0xe0b082).lineBetween(-2,-8,1,7);}
 else if(index===1){g.fillStyle(0x708b9a).fillRoundedRect(-10,-5,20,9,3);g.fillStyle(0x8da4ab).fillRoundedRect(-8,-3,18,7,2);g.lineStyle(1,0x465c69).lineBetween(-3,-3,4,3);}
 else{g.fillStyle(0xe0d5b2).fillRoundedRect(-3,-10,6,15,2).fillRoundedRect(-3,1,12,6,3);g.lineStyle(1,0xb3a680).lineBetween(-2,-7,2,-7);}
}
export function drawBedroomLuggage(g:Phaser.GameObjects.Graphics,unpacked=false){
 drawSuitcase(g,suitcaseSpot.x,suitcaseSpot.y-HOME_ORIGIN,unpacked);
 if(unpacked)tossedClothes.forEach((p,i)=>{g.save().translateCanvas(p.x,p.y-HOME_ORIGIN).rotateCanvas(p.angle*Math.PI/180);drawClothing(g,i);g.restore();});
}
