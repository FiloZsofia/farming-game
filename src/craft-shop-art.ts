import {SimonArt} from './simon-art';
import Phaser from 'phaser';
import {shopOrigins} from './village-layout';
export function drawCraftShop(scene:Phaser.Scene){
 const y0=shopOrigins.craftShop,g=scene.add.graphics().setDepth(-1),rect=(x:number,y:number,w:number,h:number,c:number)=>g.fillStyle(c).fillRect(x,y+y0,w,h),line=(x:number,y:number,xx:number,yy:number,c:number,w=1)=>g.lineStyle(w,c).lineBetween(x,y+y0,xx,yy+y0),oval=(x:number,y:number,w:number,h:number,c:number)=>g.fillStyle(c).fillEllipse(x,y+y0,w,h);
 rect(0,0,800,600,0x263b31);rect(94,105,612,418,0x705b41);rect(102,111,596,85,0xc7b997);rect(102,196,596,317,0xad8c5e);rect(102,186,596,13,0x7c6749);
 for(let y=204;y<513;y+=15){line(102,y,698,y,0x80633e);line(104,y+2,696,y+2,0xd0ac73);for(let x=114+(y%4)*32;x<690;x+=93)line(x,y,x,y+14,0x8f704b);}
 for(const x of [126,559]){rect(x-4,120,117,60,0x806c4b);rect(x,124,109,52,0x8fae9c);g.fillStyle(0xcbd6ae,.7).fillTriangle(x+2,y0+126,x+105,y0+126,x+2,y0+174);line(x+54,124,x+54,176,0xe1d1a7,3);line(x,149,x+109,149,0xe1d1a7,3);rect(x-7,177,123,6,0x9d8054);}
 const basket=(x:number,y:number,s=1)=>{oval(x,y,35*s,17*s,0x907044);g.lineStyle(2*s,0xcfad71).strokeEllipse(x,y0+y-8*s,25*s,27*s);for(let i=0;i<4;i++)line(x-16*s,y-4*s+i*3*s,x+16*s,y-4*s+i*3*s,0xc6a16a);};
 rect(111,251,82,19,0xb49560);for(const x of [118,180])rect(x,270,6,148,0x79603d);rect(115,375,73,9,0x8b7047);basket(149,350);basket(158,409,.8);
 rect(116,273,70,31,0x9b794e);for(let i=0;i<5;i++)line(122+i*12,278,122+i*12,301,0xc1a471);rect(116,271,71,7,0xc0a16c);
 for(const [x,y]of [[124,231],[145,231],[170,231]]){line(x,y,x+2,y-33,0x6b7d4b,2);line(x+3,y-1,x+8,y-30,0x9b9c61,2);}rect(119,231,61,13,0x8e7049);
 rect(609,244,78,10,0x9a7c50);rect(609,328,78,10,0x9a7c50);rect(609,413,78,10,0x9a7c50);for(const x of [611,680])rect(x,254,5,161,0x715d3c);
 for(let i=0;i<3;i++){rect(619+i*21,224,16,19,0x8f977f);rect(619+i*21,223,16,4,0xc5bda0);line(621+i*21,227,632+i*21,227,0xe3d2ab);basket(627+i*21,307,.55);rect(620+i*20,382,16,30,0xb59e73);for(let j=0;j<3;j++)line(621+i*20,386+j*8,634+i*20,386+j*8,0x816a45);}
 // Tool rail and drawings above the maker's counter.
 rect(262,121,104,52,0x867349);rect(266,125,96,44,0xddd0a6);line(274,156,350,156,0x8c926e);for(let i=0;i<3;i++){line(280+i*24,153,280+i*24,135,0x74846a);line(276+i*24,139,287+i*24,139,0x74846a);}
 line(396,164,528,164,0x795e3d,5);for(let i=0;i<5;i++){const x=405+i*25;line(x,163,x,191,0xa88a54,3);rect(x-7,188,14,5,i%2?0x7f8d7a:0xb9bda4);}
 rect(286,332,224,99,0x7e8c63);rect(292,338,212,87,0xa9af81);for(let y=341;y<426;y+=7)line(294,y,502,y,0xbcc09a);for(let x=294;x<502;x+=7){line(x,331,x,336,0xd0c59d);line(x,427,x,433,0xd0c59d);}
 rect(373,495,54,17,0x6b5a3d);for(let y=499;y<512;y+=6)line(376,y,424,y,0xc0a477);
 // A maker in a russet work apron; the counter masks the lower body.
 const merchant=new SimonArt(scene),person=scene.add.container(423,y0+235,[merchant.root]).setDepth(0).setName('shop-simon');
 const front=scene.add.graphics().setDepth(1);front.fillStyle(0x785739).fillRect(338,y0+225,224,63);front.fillStyle(0xc09b63).fillRoundedRect(332,y0+216,236,15,2);front.lineStyle(2,0xe1c18a).lineBetween(337,y0+219,561,y0+219);for(let x=348;x<560;x+=21)front.lineStyle(1,0xa07c4b).lineBetween(x,y0+235,x,y0+283);front.fillStyle(0xe5d3a1).fillRect(469,y0+205,35,12);front.lineStyle(1,0x8c9573).lineBetween(474,y0+209,497,y0+209).lineBetween(474,y0+213,493,y0+213);front.fillStyle(0x7d8b74).fillRect(354,y0+207,15,9);
 scene.add.text(400,y0+139,'Műhelybolt',{fontFamily:'Georgia',fontSize:'17px',color:'#fff0c6',backgroundColor:'#665b41',padding:{x:10,y:6}}).setOrigin(.5).setDepth(4);
 const background=scene.add.renderTexture(0,y0,800,600).setOrigin(0).setDepth(-1);background.draw(g,0,-y0);g.destroy();return {person,background,front};
}
