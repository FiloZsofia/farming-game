import type Phaser from 'phaser';
type Mailbox={x:number;y:number;w:number;h:number};
/** The body and moving flag share the same world anchor as postal interactions. */
export function drawMailbox(g:Phaser.GameObjects.Graphics,m:Mailbox){
 const {x,y,w,h}=m;
 g.fillStyle(0x344c36,.22).fillEllipse(x+w/2+3,y+h+20,22,7);
 g.fillStyle(0x65543c).fillRect(x+9,y+h-2,7,22);g.fillStyle(0xa88a5c).fillRect(x+10,y+h-1,4,21);g.lineStyle(.8,0xd0b17b).lineBetween(x+10.5,y+h,x+10.5,y+h+19);g.lineStyle(.6,0x806743).lineBetween(x+13,y+h+4,x+13.5,y+h+16);
 g.fillStyle(0x725e42).fillRoundedRect(x+5,y+h-1,16,3,1);g.lineStyle(.6,0xb89c6b).lineBetween(x+6,y+h-1,x+20,y+h-1);
 g.fillStyle(0x354f4c).fillRoundedRect(x-1,y-2,w+2,h+3,3);g.fillStyle(0x617f75).fillRoundedRect(x,y-1,w,h+1,3);g.fillStyle(0x849b88).fillRoundedRect(x+1,y-1,w-3,5,2);g.lineStyle(.8,0xb7c3a6).lineBetween(x+4,y,x+w-4,y);
 g.fillStyle(0x47675f).fillRoundedRect(x+w-7,y+2,7,h-3,2);g.lineStyle(.7,0x344f49).lineBetween(x+w-7,y+3,x+w-7,y+h-2);g.lineStyle(.6,0x9aaf96).lineBetween(x+w-5,y+3,x+w-2,y+3);
 g.fillStyle(0x47665e).fillRoundedRect(x+1,y+3,w-9,h-4,2);g.lineStyle(.65,0xa0b29a).strokeRoundedRect(x+2,y+3,w-11,h-5,1.5);
 g.fillStyle(0x2b4741).fillRoundedRect(x+5,y+5,8,1.8,.6);g.lineStyle(.6,0xb2bda0).lineBetween(x+5,y+4.5,x+13,y+4.5);
 g.fillStyle(0xcbb788).fillRoundedRect(x+6,y+9,6,4,.6);g.lineStyle(.5,0x847853).lineBetween(x+6.5,y+9.5,x+9,y+11.4).lineBetween(x+9,y+11.4,x+11.5,y+9.5);
 for(const xx of [3,w-10]){g.fillStyle(0x3a5149).fillCircle(x+xx,y+h-2,.7);g.fillStyle(0xc3c5a7).fillCircle(x+xx-.2,y+h-2.2,.25);}
 g.lineStyle(1,0xb5b7a0).lineBetween(x+3,y+h,x+13,y+h);g.fillStyle(0x344f48).fillCircle(x+w-3,y+7,2);g.fillStyle(0xb3b697).fillCircle(x+w-3,y+7,1);
}
export function drawMailboxFlag(g:Phaser.GameObjects.Graphics,m:Mailbox){
 const x=m.x+m.w-3,y=m.y+7;
 g.lineStyle(2.6,0x8f793e).lineBetween(x,y,x,y-17);g.lineStyle(1.2,0xe1b653).lineBetween(x-.3,y-1,x-.3,y-17);
 g.fillStyle(0x98763b).fillRoundedRect(x,y-18,9,6,1);g.fillStyle(0xe7b55a).fillRoundedRect(x,y-18,8,4.8,.7);g.lineStyle(.7,0xffdc8b).lineBetween(x+1,y-17.5,x+7,y-17.5);
 g.fillStyle(0x5b6850).fillCircle(x,y,1.8);g.fillStyle(0xe4cd8b).fillCircle(x-.2,y-.2,.8);
}
