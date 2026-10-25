import {drawCraftShop} from './craft-shop-art';
import {LeoArt} from './leo-art';
import Phaser from 'phaser';
import {FarmerArt} from './character';
import {shopOrigins,shopNames,type Shop} from './village-layout';
export function drawShop(scene:Phaser.Scene,shop:Shop){
 if(shop==='craftShop')return drawCraftShop(scene);
 const y0=shopOrigins[shop],g=scene.add.graphics().setDepth(-1),nursery=shop==='nursery';
 const rect=(x:number,y:number,w:number,h:number,c:number,a=1)=>g.fillStyle(c,a).fillRect(x,y+y0,w,h);
 const oval=(x:number,y:number,w:number,h:number,c:number,a=1)=>g.fillStyle(c,a).fillEllipse(x,y+y0,w,h);
 const line=(x:number,y:number,xx:number,yy:number,c:number,w=1)=>g.lineStyle(w,c).lineBetween(x,y+y0,xx,yy+y0);
 const label=(x:number,y:number,text:string,size=11)=>scene.add.text(x,y+y0,text,{fontFamily:'Georgia,serif',fontSize:`${size}px`,color:'#fff0c6',backgroundColor:'#5a523c',padding:{x:7,y:4}}).setOrigin(.5).setDepth(4);
 rect(0,0,800,600,0x263b31);rect(92,99,616,426,0x62523d);rect(100,108,600,404,0xc6b38c);rect(100,110,600,85,nursery?0xd2d0ad:0xb9c9b4);rect(100,188,600,12,0x766848);rect(100,200,600,312,0xa7865c);
 for(let y=202;y<511;y+=14){line(101,y,699,y,0x715b42);line(101,y+2,699,y+2,0xc4a06c);for(let x=110+(y%3)*45;x<690;x+=95)line(x,y,x,y+13,0x7d6748);}
 for(const x of [125,555]){rect(x-4,115,121,63,0x796c4f);rect(x,119,113,55,0xa9c5b4);for(let i=0;i<3;i++){line(x+28+i*28,119,x+28+i*28,173,0xe9ddb9,3);}line(x,146,x+113,146,0xe9ddb9,3);oval(x+30,136,29,17,0x78935e,.6);rect(x-7,175,128,6,0x9c8257);}
 // A woven runner, wood counter and small handwritten catalogues.
 rect(294,322,212,112,nursery?0x7b8e59:0x698c87);rect(300,328,200,100,nursery?0x9ca66c:0x8da99b);for(let x=302;x<500;x+=7){line(x,328,x,428,nursery?0xb8b986:0xb0bfaa);line(x,320,x,325,0xd5c79d);line(x,431,x,437,0xd5c79d);}
 rect(338,235,224,53,0x72523b);rect(333,227,234,14,0xb69a6b);line(337,230,561,230,0xe1c18a,2);for(let x=350;x<558;x+=22)line(x,244,x,284,0x94724b);rect(453,218,26,10,0x766849);rect(456,217,10,8,0xeee0b6);rect(468,217,10,8,0xdfcfa5);line(466,218,466,226,0x8c7753);
 const pot=(x:number,y:number,s=1)=>{oval(x+3,y+7*s,29*s,10*s,0x3a5036,.2);rect(x-9*s,y-8*s,18*s,20*s,0x9c7350);rect(x-11*s,y-10*s,22*s,5*s,0xc29869);line(x,y-10*s,x,y-43*s,0x6e6640,2*s);for(const [dx,dy]of [[-10,-28],[9,-38],[-4,-47]]){oval(x+dx*s,y+dy*s,19*s,12*s,0x557c49);oval(x+(dx-2)*s,y+(dy-2)*s,13*s,7*s,0x88a55e);}};
 const aquarium=(x:number,y:number,w:number,h:number,style=0)=>{
  rect(x-w/2-3,y-3,w+6,h+7,0x566c61);rect(x-w/2,y,w,h,style?0x6e9f94:0x699ba5);rect(x-w/2+4,y+4,w-8,h-12,0xa3c9b2,.7);
  for(let i=0;i<7;i++)oval(x-w/2+7+i*(w-14)/6,y+h-5,8,4,i%2?0xb2a985:0x9d9b78);
  for(let i=0;i<3;i++){const xx=x-w/2+8+i*6;line(xx,y+h-6,xx+(i-1)*5,y+h-23-i*5,0x4d8054,2);}
  for(let i=0;i<(style?2:3);i++){const xx=x-10+i*14,yy=y+13+i*7;oval(xx,yy,10+i,4,style?0xd7b27b:0xd3cbb0);g.fillStyle(style?0xb89665:0x8daba1).fillTriangle(xx+4,yy+y0,xx+9,yy+y0-3,xx+9,yy+y0+3);}
  line(x-w/2+3,y+3,x-w/2+3,y+h-9,0xe1e6cc,1);line(x-w/2+3,y+3,x+w/2-4,y+3,0xd3e2cf,1);
 };
 if(nursery){
  // A working potting bench, root-wrapped trees and mixed-height displays.
  rect(112,287,78,14,0xae8b58);rect(117,301,6,111,0x745b3d);rect(176,301,6,111,0x745b3d);rect(115,384,68,7,0x92764c);
  for(let i=0;i<3;i++){rect(119+i*21,265,18,21,0x947349);oval(128+i*21,264,19,6,0x544e35);for(let j=0;j<2;j++){line(125+i*21+j*5,264,126+i*21+j*4,250-i*4,0x648445,2);oval(123+i*21+j*7,252-i*4,9,5,0x88a659);}}
  rect(126,365,47,18,0xa29161);for(let i=0;i<5;i++)line(130+i*8,367,130+i*8,382,0xd5c395);
  pot(650,280,1.05);pot(631,377,.8);pot(669,417,.55);
  oval(152,459,55,18,0x8f7750);oval(152,452,37,25,0xbfa77b);for(let i=0;i<5;i++)line(136+i*7,447,144+i*3,463,0xe0c693);line(152,444,152,397,0x6d5338,3);oval(140,412,30,23,0x5f814b);oval(161,398,31,28,0x88a45a);
  rect(251,125,48,42,0x86724c);rect(255,129,40,34,0xe6d7ad);line(276,157,276,137,0x7b6945,2);oval(270,140,17,13,0x6f914e);oval(281,137,17,16,0x8ca35c);
  line(316,137,359,137,0x8b7750,3);for(let i=0;i<3;i++){line(324+i*13,140,324+i*13,164,0xb7955e,2);rect(320+i*13,162,9,6,i%2?0x778c7c:0x9caa90);}
  pot(286,240,.85);rect(609,463,68,19,0x9c8055);rect(604,456,77,8,0xb99b6b);label(400,139,shopNames.nursery,16);label(153,230,'Palántázóasztal',9);label(647,230,'Gyümölcsfák',9);
 }else{
  // Plant-filled display tub, reeds and a woven nest replace cloned tanks.
  rect(110,280,82,23,0x795c3e);oval(151,277,83,32,0xb39767);oval(151,274,73,25,0x5d9183);oval(137,273,23,10,0x668f52);oval(162,278,22,9,0x86a95f);
  for(let i=0;i<6;i++)oval(159+Math.cos(i*Math.PI/3)*5,266+Math.sin(i*Math.PI/3)*3,8,4,0xe7c5b4);oval(159,266,4,3,0xe4cb79);
  oval(145,382,49,18,0x94764f);rect(123,356,44,24,0x93734c);oval(145,356,47,15,0xc3a276);for(let i=0;i<8;i++){const x=127+i*5;line(x,355,x+(i-4)*2,318-i%3*8,0x6e8b4d,2);rect(x+(i-4)*2-1,310-i%3*8,3,12,0x7b6844);}
  rect(113,411,73,7,0x9d7b4c);oval(150,407,58,25,0xc2a573);oval(150,404,39,14,0x716748);for(let i=0;i<10;i++)line(123+i*5,403,130+i*4,411,0xdec38a);
  // Two different aquariums stand on purpose-built wooden furniture.
  rect(608,286,79,27,0x88734f);for(const x of [612,678])rect(x,313,5,14,0x6b5b41);aquarium(647,238,78,45);
  rect(618,402,61,9,0xb39561);for(const x of [624,671])rect(x,411,4,18,0x6c5f44);aquarium(648,334,54,65,1);
  // Folded nets, plant labels and a supply chest make this a working shop.
  line(274,236,296,190,0x92784f,3);g.lineStyle(1,0xa8bca1).strokeEllipse(300,y0+181,27,20);for(let i=0;i<4;i++)line(289+i*6,175,289+i*6,188,0xa8bca1);
  rect(591,451,68,31,0x876d47);rect(587,444,76,11,0xb49865);line(592,449,658,449,0xd7bc86);rect(623,449,6,13,0x6c7763);
  rect(245,119,48,48,0x8a7956);rect(249,123,40,40,0xe5d7ae);oval(269,146,27,16,0x85aa92);oval(265,144,16,6,0x709459);oval(272,138,8,5,0xe4bcae);line(255,154,282,154,0x9a9a70);
  label(400,139,shopNames.fishShop,14);label(153,229,'Tavi növények',9);label(648,220,'Halak',9);
 }
 rect(373,494,54,19,0x675c41);line(376,499,424,499,0xc0a575);line(376,505,424,505,0xc0a575);label(400,545,'Kijárat · E / koppintás',10);
 {
  const merchant=nursery?new LeoArt(scene):new FarmerArt(scene,true);if(merchant instanceof FarmerArt)merchant.equip('none');const person=scene.add.container(423,y0+235,[merchant.root]).setDepth(0).setName(nursery?'shop-leo':'shop-annie');
  // Foreground counter hides her lower body, rather than drawing her over it.
  const front=scene.add.graphics().setDepth(1);front.fillStyle(0x72523b).fillRect(338,y0+225,224,63);front.fillStyle(0xb69a6b).fillRect(333,y0+217,234,14);front.lineStyle(1,0xe1c18a).lineBetween(337,y0+220,561,y0+220);for(let x=350;x<558;x+=22)front.lineStyle(1,0x94724b).lineBetween(x,y0+244,x,y0+284);
  front.fillStyle(0x6d6348).fillRect(453,y0+210,26,8);front.fillStyle(0xeadcb2).fillRect(455,y0+210,10,6);front.fillStyle(0xd7c79e).fillRect(467,y0+210,10,6);
  const background=scene.add.renderTexture(0,y0,800,600).setOrigin(0).setDepth(-1);background.draw(g,0,-y0);g.destroy();
  return {person,background,front};
 }
}
