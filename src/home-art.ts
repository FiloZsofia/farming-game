import Phaser from 'phaser';
import {HOME_ORIGIN} from './home';
export function drawHome(scene:Phaser.Scene){
 const root=scene.add.container(0,HOME_ORIGIN).setDepth(0),g=scene.add.graphics();root.add(g);
 g.fillStyle(0x323b32).fillRect(0,0,800,600);g.fillStyle(0x3e4639).fillRect(88,140,624,386);g.fillStyle(0xb7b093).fillRect(100,148,600,62);g.fillStyle(0x77634b).fillRect(100,210,600,304);
 for(let y=213;y<514;y+=18){g.lineStyle(1,0x534b37).lineBetween(100,y,700,y);for(let x=105+(y%5)*32;x<700;x+=122)g.lineBetween(x,y,x,y+18);g.lineStyle(1,0xac9467,.32).lineBetween(110,y+3,687,y+3);}
 g.lineStyle(5,0x69553c).lineBetween(100,209,700,209);g.lineStyle(4,0x8d7854).lineBetween(101,148,699,148);
 // Daylight, linen curtains and a simple window overlooking the garden.
 g.fillStyle(0x6d634b).fillRoundedRect(310,154,110,64,3);g.fillStyle(0xa6bda1).fillRect(317,160,96,49);g.fillStyle(0xd9dfb4,.55).fillTriangle(317,160,412,160,317,207);g.lineStyle(3,0xe0d0a4).lineBetween(365,160,365,209).lineBetween(317,184,413,184);g.fillStyle(0xe9ddba).fillRect(302,157,13,54).fillRect(415,157,13,54);
 // Wooden bed, moss-green quilt, soft folded edge and two pillows.
 g.fillStyle(0x29382b,.25).fillEllipse(195,362,124,28);g.fillStyle(0x624d35).fillRoundedRect(143,245,99,120,6);g.fillStyle(0xa8895b).fillRoundedRect(140,239,105,19,4);g.lineStyle(2,0xc5ab79).lineBetween(146,242,239,242);g.fillStyle(0xe5d6af).fillRoundedRect(150,258,85,91,6);g.fillStyle(0xf5e9cd).fillRoundedRect(157,262,32,20,5).fillRoundedRect(196,262,30,20,5);g.fillStyle(0x7c9164).fillRoundedRect(151,290,83,63,4);g.fillStyle(0xa3b07b).fillRoundedRect(151,287,83,11,3);for(let y=305;y<350;y+=11)g.lineStyle(1,0x5b7552,.6).lineBetween(155,y,230,y);g.fillStyle(0x9c7d50).fillRoundedRect(141,353,103,12,3);for(const x of [146,236])g.fillStyle(0x614d35).fillRect(x,364,5,9);
 // A small bedside cabinet, with drawer, brass knob and a linen-shaded reading lamp.
 g.fillStyle(0x29382b,.22).fillEllipse(280,306,48,12);g.fillStyle(0x775737).fillRoundedRect(260,267,38,37,3);g.fillStyle(0xb58d58).fillRoundedRect(256,259,46,10,3);g.lineStyle(1.5,0xd6b37b).lineBetween(259,261,299,261);g.fillStyle(0x9b7649).fillRoundedRect(264,274,30,14,2);g.lineStyle(1,0x594a32).strokeRoundedRect(264,274,30,14,2);g.fillStyle(0xd3b16c).fillCircle(279,281,1.8);g.fillStyle(0x5c4931).fillRect(263,302,4,6).fillRect(291,302,4,6);
 g.fillStyle(0x9c8557).fillEllipse(279,261,19,5);g.lineStyle(3,0xb4a077).lineBetween(279,248,279,261);g.fillStyle(0xe8d3a4).fillPoints([{x:269,y:237},{x:289,y:237},{x:295,y:252},{x:263,y:252}],true);g.lineStyle(1,0xbaa074).lineBetween(269,237,289,237).lineBetween(263,252,295,252);g.fillStyle(0xc7ad80).fillEllipse(279,237,20,4);
 // Bookcase: varied books, archive box and an old field guide, with room left empty.
 g.fillStyle(0x71583d).fillRoundedRect(550,161,115,75,3);g.fillStyle(0x463e2d).fillRect(556,168,103,60);for(const y of [194,224]){g.fillStyle(0xa18456).fillRect(554,y,107,5);g.lineStyle(1,0xd3ba85).lineBetween(557,y,658,y);}for(let i=0;i<9;i++){const x=560+i*10,h=17+i%3*3;g.fillStyle([0x738760,0xa47b59,0xb4a07b,0x6c8380][i%4]).fillRect(x,193-h,7,h);g.lineStyle(1,0xd0be90).lineBetween(x+1,190,x+6,190);}g.fillStyle(0xa59573).fillRoundedRect(560,202,33,20,2);g.lineStyle(1,0xc5b58e).strokeRect(560,202,33,20);g.fillStyle(0xd5cba6).fillRect(568,209,16,6);g.fillStyle(0x69816b).fillRect(609,208,30,5);
 // Woven rug, unpacked bag and a pair of moving boxes.
 g.fillStyle(0x397f82).fillRoundedRect(332,370,143,83,5);g.lineStyle(4,0xd99452).strokeRoundedRect(338,376,131,71,4);g.lineStyle(1,0xf0d2a0).strokeRoundedRect(344,382,119,59,3);
 for(let y=379;y<448;y+=5){g.lineStyle(1,0xe3c795,.9).lineBetween(327,y,332,y).lineBetween(475,y,480,y);}for(const x of [369,403,437]){g.fillStyle(0xe8bc78).fillPoints([{x,y:394},{x:x+9,y:411},{x,y:428},{x:x-9,y:411}],true);g.fillStyle(0xb7623e).fillCircle(x,411,3);}

 g.fillStyle(0x6b5038).fillRoundedRect(274,425,38,24,5);g.lineStyle(3,0x8c734e).strokeRoundedRect(286,418,14,10,3);g.fillStyle(0xb49865).fillRect(281,426,3,22).fillRect(302,426,3,22);for(const [x,y]of [[600,385],[632,396]]){g.fillStyle(0xb09a70).fillRoundedRect(x,y,29,27,2);g.lineStyle(1,0x786447).strokeRect(x,y,29,27);g.fillStyle(0xd1bd8c).fillRect(x+12,y,5,27);}
 g.fillStyle(0x363b2c).fillRect(373,501,54,13);g.fillStyle(0xb49b6c).fillRoundedRect(369,498,62,5,2);g.fillStyle(0x88734f).fillEllipse(400,484,49,17);
 return root;
}
