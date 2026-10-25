import {SimonArt} from './simon-art';
import Phaser from 'phaser';
import {shopOrigins} from './village-layout';
// Original scenery. All side furniture stays inside the existing solid display footprints.
export function drawCraftShop(scene:Phaser.Scene){
 const y0=shopOrigins.craftShop,g=scene.add.graphics().setDepth(-1);
 const rect=(x:number,y:number,w:number,h:number,c:number,a=1)=>g.fillStyle(c,a).fillRect(x,y+y0,w,h);
 const line=(x:number,y:number,xx:number,yy:number,c:number,w=1,a=1)=>g.lineStyle(w,c,a).lineBetween(x,y+y0,xx,yy+y0);
 const oval=(x:number,y:number,w:number,h:number,c:number,a=1)=>g.fillStyle(c,a).fillEllipse(x,y+y0,w,h);
 const poly=(p:number[],c:number,a=1)=>g.fillStyle(c,a).fillPoints(Array.from({length:p.length/2},(_,i)=>({x:p[i*2],y:y0+p[i*2+1]})),true);
 let seed=2741;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 rect(0,0,800,600,0x263b31);rect(94,105,612,418,0x65553e);rect(102,111,596,85,0xc9ba98);rect(102,196,596,317,0xac895a);
 for(let y=200;y<513;y+=16)for(let x=102-((y/16)%3)*36;x<698;x+=94){const left=Math.max(102,x),right=Math.min(698,x+92);rect(left,y,right-left,14,[0xab895b,0xb18e60,0xa78557][Math.floor(random()*3)]);line(left,y+1,right,y+1,0xd2ad76,1,.65);line(left,y+15,right,y+15,0x735b3d,1,.7);if(x>105&&x<685){line(x+1,y+3,x+1,y+12,0x795d3d);oval(x+15,y+8,7,2,0x775b3d,.4);line(x+4,y+10,x+39,y+10,0x7c6342,.15);}}
 // Worn boards, plaster patches and quiet timber joints give the room its age.
 for(let i=0;i<110;i++){const x=110+random()*575,y=204+random()*300;line(x,y,x+3+random()*17,y-.5,random()>.5?0xddbb84:0x6b573c,.65,.15);}
 for(const [x,y,w,h]of [[247,121,20,5],[270,182,41,4],[509,119,29,4],[683,154,11,20],[350,178,23,6]])rect(x,y,w,h,0xd8c9a5,.5);
 rect(102,105,596,9,0x755a3b);line(104,107,696,107,0xad8956,2);rect(102,111,8,88,0x92714a);rect(690,111,8,88,0x92714a);rect(102,186,596,13,0x7a6342);line(103,187,696,187,0xb18d5b,2);
 for(const x of [126,559]){rect(x-4,120,117,60,0x715f42);rect(x,124,109,52,0x97b3a0);poly([x+2,126,x+105,126,x+2,174],0xd9deb4,.7);line(x+54,124,x+54,176,0xebd9b0,3);line(x,149,x+109,149,0xebd9b0,3);rect(x-7,177,123,6,0x9f8051);line(x-7,178,x+116,178,0xc7a470);}
 // Sunlight belongs on the floor, below the furniture and the walking character.
 poly([128,199,233,199,355,377,178,396],0xffe4a0,.09);poly([565,199,669,199,684,350,536,333],0xffe7ad,.09);
 const basket=(x:number,y:number,s=1)=>{oval(x+2,y+5*s,38*s,12*s,0x4c4c32,.2);poly([x-17*s,y-6*s,x+17*s,y-6*s,x+12*s,y+9*s,x-12*s,y+9*s],0xa17c48);g.lineStyle(2*s,0xd5b477).strokeEllipse(x,y0+y-9*s,25*s,25*s);for(let i=0;i<4;i++)line(x-15*s,y-3*s+i*3*s,x+15*s,y-3*s+i*3*s,0xd0ac70);for(let i=0;i<4;i++)line(x-10*s+i*7*s,y-5*s,x-8*s+i*5*s,y+8*s,0xc3a065);};
 const gear=(x:number,y:number,r=8)=>{for(let i=0;i<8;i++){const a=i*Math.PI/4;line(x+Math.cos(a)*r*.8,y+Math.sin(a)*r*.8,x+Math.cos(a)*(r+2),y+Math.sin(a)*(r+2),0x7b8977,3);}g.lineStyle(3,0xa9ae8b).strokeCircle(x,y+y0,r*.7);oval(x,y,r*.6,r*.6,0x596a55);};
 // A working bench: vice, tool marks, mallet, ruler and pale curling shavings.
 oval(151,408,88,19,0x394d35,.15);rect(112,268,80,12,0x745337);rect(109,262,86,10,0xbd965d);line(112,264,192,264,0xe0bc7b,2);for(const x of [117,180]){rect(x,280,6,128,0x765635);line(x+1,284,x+1,405,0xa38050);}
 rect(115,357,73,8,0x987343);line(116,358,186,358,0xc7a168);rect(121,279,60,23,0x9d7849);for(let i=0;i<3;i++){rect(123+i*19,280,17,20,0xb08a54);rect(129+i*19,287,6,3,0x6e6445);}
 rect(119,246,25,16,0x778476);rect(116,244,31,5,0xa8ad8e);rect(122,261,10,12,0x61705f);line(114,255,151,255,0xc0b995,2);oval(152,255,5,5,0x8e967c);rect(135,234,4,10,0x83917f);rect(119,236,4,8,0x83917f);
 line(159,260,177,250,0x8f7046,3);line(173,245,182,256,0xc09a61,6);line(151,252,187,254,0xd4b77e,3);for(let i=0;i<7;i++)line(153+i*5,251,153+i*5,254,0x7a6748);
 rect(157,239,20,10,0xe2d3a3);line(159,242,173,242,0x8c9675);line(159,246,169,246,0x8c9675);gear(166,327,9);basket(144,344,.62);
 for(let i=0;i<13;i++){const x=116+random()*70,y=371+random()*39;g.lineStyle(.9,0xd9b77b,.85).beginPath().arc(x,y+y0,2+random()*2,0,Math.PI*1.6).strokePath();}
 // The wheel being repaired is recognisable, with a strap and a replacement spoke.
 line(125,402,146,356,0x7b5f3b,4);line(174,401,147,356,0x8d6c43,4);g.lineStyle(5,0x795a36).strokeEllipse(148,y0+382,42,48);g.lineStyle(2,0xc4a06c).strokeEllipse(148,y0+382,34,40);for(let i=0;i<6;i++){const a=i*Math.PI/3;if(i!==1)line(148,382,148+Math.cos(a)*17,382+Math.sin(a)*20,0xbc955d,2);}oval(148,382,9,8,0x7c846e);line(160,373,169,389,0xa9ae8f,3);line(139,405,155,376,0xd5b480,3);rect(146,396,8,4,0x6d775f);
 // A brass task lamp warms the bench; it never hides the aisle or the counter.
 for(const [r,a]of [[35,.025],[24,.045],[13,.07]])g.fillStyle(0xffd98c,a).fillCircle(183,y0+246,r);oval(183,258,16,5,0x706447);line(183,257,183,236,0x847548,3);line(183,236,175,230,0x847548,2);poly([169,226,180,228,184,236,166,233],0x68806b);line(168,232,183,235,0xd8bc7c,2);
 // Unequal shelves hold copper fittings, twine, folded cloth and baskets.
 for(const x of [611,681])rect(x,221,5,196,0x715a3b);for(const [y,w]of [[246,79],[327,75],[412,80]]){rect(608,y,w,9,0xa17e4d);line(610,y,608+w,y,0xd1ae73,2);}
 for(const [x,y]of [[622,235],[637,230]]){g.lineStyle(5,0xae784b).beginPath().moveTo(x,y+y0).lineTo(x,y+y0-12).lineTo(x+8,y+y0-12).strokePath();line(x-1,y-1,x-1,y-11,0xd7a76f,1);}
 for(const [x,y,r]of [[660,235,8],[677,235,6]]){oval(x,y,r*2,r*1.45,0xbdab7c);for(let i=-2;i<=2;i++)line(x-r+2,y+i*2,x+r-2,y+i*2,0x8d8158,.8);rect(x-2,y-7,4,12,0xd3c194);}
 basket(626,311,.74);basket(654,316,.49);rect(663,299,18,5,0xc7bc96);rect(661,305,22,5,0xe0d3ad);rect(664,311,17,6,0xadae8d);line(673,299,673,317,0x8d825e);
 rect(615,379,29,32,0x9e7d4b);for(let i=0;i<3;i++){rect(617,381+i*9,25,7,0xb1915b);rect(627,383+i*9,6,2,0x726b4a);}rect(650,389,30,21,0x87613e);rect(648,385,34,7,0xbe9a61);line(651,387,678,387,0xd7b47b);rect(662,389,6,8,0x7e805d);
 // An irrigation sketch, rolled plans and a rail of distinct hand tools.
 rect(262,121,83,52,0x7e6c48);rect(266,125,75,44,0xe2d3a7);line(280,158,328,158,0xa7a47c);for(let i=0;i<3;i++)oval(294+i*14,154,8,5,0x8d9f6c);line(280,158,280,143,0x718a7c,2);g.lineStyle(.9,0x7e9ea0).strokePoints(new Phaser.Curves.QuadraticBezier(new Phaser.Math.Vector2(281,y0+143),new Phaser.Math.Vector2(299,y0+122),new Phaser.Math.Vector2(321,y0+153)).getPoints(16));
 rect(350,166,23,7,0xd1bc8c);oval(352,169,5,7,0x8a7750);line(359,166,359,173,0x8f7954);line(367,166,367,173,0x8f7954);
 line(395,164,529,164,0x7d603d,4);for(const x of [403,444,473,501,522])line(x,164,x,170,0x596c5a,1.5);
 line(402,170,402,184,0x8e7447,2);rect(396,171,12,6,0x7b8c7c);rect(396,169,5,7,0xa9b09a);line(402,184,407,184,0xb9bfa3,1.5);
 line(444,170,442,185,0xa68853,3);rect(437,170,15,5,0xa7b29c);rect(449,170,4,8,0x859884);
 poly([466,174,487,170,490,177,469,183],0xb8bba0);for(let i=0;i<5;i++)poly([470+i*4,181-i*.7,473+i*4,180-i*.7,472+i*4,184-i*.7],0x687565);g.lineStyle(2,0x937048).strokeRoundedRect(461,y0+172,9,11,2);
 line(501,170,501,184,0xb0b79c,3);line(501,183,512,183,0xb0b79c,3);line(504,171,504,180,0x748471);
 line(521,173,518,184,0x9d7651,2);line(523,173,527,184,0x9d7651,2);g.lineStyle(2,0xa4af99).strokeEllipse(522,y0+171,7,8);
 g.lineStyle(2,0x826e48).strokeCircle(540,y0+136,10);oval(540,136,16,16,0xded0a5);line(540,136,540,130,0x6e775c);line(540,136,544,139,0x6e775c);
 // A small worn woven rug, with a muted terracotta centre and loose fringes.
 rect(305,336,189,98,0x6d6347);rect(309,340,181,90,0xb58f5d);rect(314,345,171,80,0xa77154);for(let y=347;y<424;y+=5)line(315,y,484,y,0xc7996d,.6,.4);for(let x=310;x<490;x+=7){line(x,332,x,338,0xd9bd8c);line(x,430,x,438,0xd0b486);}
 for(let i=0;i<5;i++){const x=332+i*34;poly([x,372,x+10,383,x,394,x-10,383],0xcba77b,.7);poly([x,377,x+5,383,x,389,x-5,383],0x697c67,.8);}for(const y of [350,420])for(let x=319;x<482;x+=9)line(x,y,x+4,y,0xdfc398,.8,.6);
 rect(373,495,54,17,0x6b5a3d);for(let y=499;y<512;y+=6)line(376,y,424,y,0xc0a477);
 // Plant and pottery at the window stay above the bench, away from the entrance.
 rect(208,169,18,10,0xa9754f);rect(206,168,22,4,0xc89765);for(let i=0;i<4;i++){line(217,168,208+i*6,151-i%2*6,0x617b45);oval(207+i*7,154-i%2*7,11,5,0x87a35f);}
 const merchant=new SimonArt(scene),person=scene.add.container(423,y0+235,[merchant.root]).setDepth(0).setName('shop-simon');
 const front=scene.add.graphics().setDepth(1);front.fillStyle(0x77563a).fillRect(338,y0+225,224,63);front.fillStyle(0xc49c62).fillRoundedRect(332,y0+216,236,15,2);front.lineStyle(2,0xe6c58a).lineBetween(337,y0+219,561,y0+219);for(const x of [347,454]){front.fillStyle(0x936e44).fillRoundedRect(x,y0+237,97,43,2);front.lineStyle(1,0xb9955e).strokeRoundedRect(x+3,y0+240,91,37,1);}for(const x of [432,466])front.fillStyle(0xd0b77c).fillCircle(x,y0+258,2);
 front.fillStyle(0xe2d1a0).fillRect(474,y0+204,33,12);front.lineStyle(.8,0x889477).lineBetween(479,y0+208,501,y0+208).lineBetween(479,y0+212,495,y0+212);front.fillStyle(0xb7a278).fillEllipse(470,y0+208,7,13);front.fillStyle(0x8e7952).fillEllipse(470,y0+208,3,7);front.fillStyle(0x7e8c76).fillRoundedRect(354,y0+205,15,11,2);for(let i=0;i<4;i++)front.lineStyle(.8,0xc6c5a0).lineBetween(357+i*3,y0+208,358+i*3,y0+213);front.fillStyle(0xa9754b).fillEllipse(540,y0+210,12,9);front.lineStyle(1,0xcb9b69).strokeEllipse(548,y0+210,6,6);
 scene.add.text(400,y0+139,'Műhelybolt',{fontFamily:'Georgia',fontSize:'17px',color:'#fff0c6',backgroundColor:'#665b41',padding:{x:10,y:6}}).setOrigin(.5).setDepth(4);
 const background=scene.add.renderTexture(0,y0,800,600).setOrigin(0).setDepth(-1);background.draw(g,0,-y0);g.destroy();return {person,background,front};
}
