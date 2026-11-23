import type Phaser from 'phaser';
/** Tied canvas sack, shared by Mara's carried parcel and the saved ground delivery. */
export function drawFeedSack(g:Phaser.GameObjects.Graphics,x=0,y=0){
 g.clear();g.fillStyle(0x344c35,.2).fillEllipse(x+2,y+3,25,9);
 g.fillStyle(0x766347).fillRoundedRect(x-11,y-18,22,22,5);g.fillStyle(0xb5a078).fillRoundedRect(x-10,y-18,20,21,5);g.fillStyle(0xcfbc90).fillEllipse(x-3,y-9,10,17);
 g.fillStyle(0xb4a17b).fillTriangle(x-7,y-25,x+7,y-25,x,y-16);g.lineStyle(.8,0x786342).lineBetween(x-5,y-24,x-1,y-18).lineBetween(x+5,y-24,x+1,y-18);g.lineStyle(1.7,0x735b3e).lineBetween(x-4,y-18,x+4,y-18);g.lineStyle(.8,0xe0cda1).lineBetween(x,y-18,x+6,y-15);
 for(let i=0;i<6;i++)g.lineStyle(.4,0x937f58,.55).lineBetween(x-8,y-13+i*2.6,x+8,y-13+i*2.6);
 g.fillStyle(0x6f8055).fillRoundedRect(x-5,y-13,10,10,1);g.lineStyle(.6,0xe1cb87).lineBetween(x,y-11,x,y-5);for(let i=0;i<3;i++)g.fillStyle(0xdfbd67).fillEllipse(x+(i%2?-1.4:1.4),y-10+i*1.6,2.5,1.4);
}
