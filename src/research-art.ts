import Phaser from 'phaser';
import {salvageSites,type Research} from './research';
export function drawResearch(scene:Phaser.Scene,r:Research){
 const root=scene.add.container(0,0).setDepth(3),g=scene.add.graphics();root.add(g);
 for(const s of salvageSites){if(r.picked.includes(s.id))continue;g.fillStyle(0x33452c,.25).fillEllipse(s.x+3,s.y+4,29,10);
  if(s.kind==='scrap'){for(let i=0;i<4;i++){g.fillStyle(i%2?0x807f70:0x9a6548).fillRoundedRect(s.x-13+i*6,s.y-9+i%2*4,11,9,2);g.lineStyle(1,0xc09a6c).lineBetween(s.x-12+i*6,s.y-8+i%2*4,s.x-5+i*6,s.y-8+i%2*4);}g.lineStyle(2,0x69766e).strokeCircle(s.x+1,s.y-10,7);}
  else{g.fillStyle(0x777d68).fillRoundedRect(s.x-10,s.y-20,20,23,4);g.lineStyle(4,0xa47e52).beginPath().moveTo(s.x,s.y-18).lineTo(s.x,s.y-30).lineTo(s.x+18,s.y-30).lineTo(s.x+18,s.y-20).strokePath();g.lineStyle(2,0xb7b093).strokeCircle(s.x,s.y-9,6);}
 }
 for(const f of r.flowers){const x=f.x+8,y=f.y+10;for(let i=0;i<3;i++){const dx=(i-1)*4,h=4+f.growth*2;g.lineStyle(1,0x456a38).lineBetween(x+dx,y,x+dx-1,y-h);g.fillStyle(0x6e984d).fillEllipse(x+dx+2,y-4,5,2);if(f.growth===4){const c=[0xe9bf64,0xc99aaa,0xd6d9ee][i];for(let a=0;a<5;a++)g.fillStyle(c).fillCircle(x+dx-1+Math.cos(a*1.257)*2,y-h+Math.sin(a*1.257)*2,1.7);g.fillStyle(0xd9a34f).fillCircle(x+dx-1,y-h,1);}}}
 return root;
}
export function drawWorkshop(scene:Phaser.Scene,r:Research){
 const root=scene.add.container(0,3000).setDepth(0),g=scene.add.graphics();root.add(g);
 g.fillStyle(0x2e302b).fillRect(0,0,800,600);
 g.fillStyle(0x252b2b).fillRect(88,138,624,388);g.fillStyle(0x635747).fillRect(100,198,600,316);
 for(let y=200;y<514;y+=19){g.lineStyle(1,0x413e36).lineBetween(100,y,700,y);for(let x=100+(y%3)*50;x<700;x+=150)g.lineBetween(x,y,x,y+19);}
 g.fillStyle(0x55594c).fillRect(100,147,600,51);g.lineStyle(4,0x353e35).lineBetween(100,195,700,195);
 for(let x=110;x<700;x+=145){g.fillStyle(0x4b4235).fillRect(x,148,10,50);g.fillStyle(0x84775a).fillRect(x,147,10,5);}
 // Worn grain and small chips keep the old room warm rather than pristine.
 for(let i=0;i<200;i++){const x=109+(i*137)%580,y=205+(i*53)%300;g.lineStyle(.65,i%3?0xa18b62:0x413c30,.25).lineBetween(x,y,x+4+i%9,y);}
 g.fillStyle(0x8d7954,.5).fillRoundedRect(123,399,117,40,4);for(let x=129;x<239;x+=9)g.lineStyle(1,0xbd9c69,.4).lineBetween(x,402,x,436);
 // Window, rolled shutter and warm daylight.
 g.fillStyle(0x322d28).fillRoundedRect(151,152,108,65,3);g.fillStyle(r.shutter?0xc9d8bb:0x655b48).fillRect(159,159,92,52);
 if(r.shutter){g.fillStyle(0xead6a0,.21).fillPoints([{x:159,y:211},{x:251,y:211},{x:445,y:482},{x:171,y:487}],true);g.lineStyle(4,0x8b7350).lineBetween(205,159,205,212).lineBetween(159,184,251,184);g.fillStyle(0xb4a184).fillRoundedRect(152,148,106,13,3);}
 else for(let y=163;y<213;y+=7)g.lineStyle(2,0x8d7d5e).lineBetween(160,y,250,y);
 g.lineStyle(1,0xc9b997).lineBetween(263,158,263,232);g.fillStyle(0xbba16f).fillCircle(263,233,3);
 // Workbench, shelves, pressed plants and old notebook.
 g.fillStyle(0x574535).fillRect(124,365,12,50).fillRect(212,365,12,50);g.fillStyle(0x9c7c51).fillRoundedRect(118,352,112,20,3);g.lineStyle(2,0xc09e68).lineBetween(122,354,226,354);
 g.fillStyle(0x687875).fillRoundedRect(143,346,23,5,2);g.fillStyle(0x71503b).fillRect(155,339,5,14);g.fillStyle(0xb9aa7c).fillRoundedRect(180,340,28,10,2);
 for(let y=245;y<324;y+=37){g.fillStyle(0x896d49).fillRect(568,y,100,6);for(let i=0;i<4;i++){g.fillStyle([0x718b76,0x9e9b76,0xb59164,0x6f8988][i]).fillRoundedRect(575+i*22,y-22,13,21,3);g.lineStyle(2,0xc8bb8b).lineBetween(577+i*22,y-20,586+i*22,y-20);}}
 g.fillStyle(0x71573b).fillRoundedRect(584,351,78,28,3);g.fillStyle(0xd0bc88).fillPoints([{x:599,y:344},{x:627,y:342},{x:630,y:366},{x:602,y:368}],true);for(let y=348;y<364;y+=4)g.lineStyle(1,0x8c825f).lineBetween(605,y,624,y-1);
 // Dried herbs hang from the rafters; a pair of pots has waited by the bench.
 for(let i=0;i<4;i++){const x=333+i*22;g.lineStyle(1,0xbaa073).lineBetween(x,159,x,178+i%2*4);for(let j=0;j<5;j++){g.lineStyle(1.2,0x7e8658).lineBetween(x,178,x+(j-2)*3,195+i%2*5);g.fillStyle(j%2?0x929262:0x737e50).fillEllipse(x+(j-2)*3,190+i%2*5,4,8);}}
 g.fillStyle(0x8d6547).fillRoundedRect(139,415,17,20,3).fillRoundedRect(164,420,12,15,2);g.lineStyle(2,0xb08a5c).lineBetween(138,417,157,417).lineBetween(163,421,177,421);
 // Large apparatus: vat, independent pipework, filter vessel and copper cooling coil.
 const copper=r.repaired?0xbc8253:0x96734f,edge=r.repaired?0xe0b77a:0xb39a70;
 g.fillStyle(0x252c28,.35).fillEllipse(400,356,268,34);
 g.fillStyle(0x554c3b).fillRect(303,332,12,37).fillRect(362,332,12,37);g.fillStyle(0x8e7961).fillRoundedRect(300,350,80,12,3);
 g.fillStyle(0x655548).fillEllipse(339,314,91,32);g.fillStyle(copper).fillRoundedRect(294,270,91,69,18);g.fillStyle(edge,.75).fillEllipse(339,270,91,31);g.fillStyle(0x695a43).fillEllipse(339,270,70,19);g.fillStyle(0xa3885a).fillEllipse(339,265,84,16);g.fillStyle(0xc8a676).fillRoundedRect(335,251,9,12,3);
 for(let i=0;i<7;i++){g.fillStyle(edge).fillCircle(303+i*12,279+Math.sin(i*.5)*4,1.2);}g.fillStyle(0x534b3a).fillCircle(369,292,9);g.fillStyle(0xcbbb8f).fillCircle(369,292,6);g.lineStyle(1,0x6b563c).lineBetween(369,292,372,289);
 g.lineStyle(3,0x6b5741).strokeEllipse(339,326,85,24);g.lineStyle(2,edge,.8).lineBetween(303,282,303,316);
 for(const x of [284,386])g.lineStyle(5,copper).strokeEllipse(x,290,14,18);
 g.lineStyle(8,0x493e33).beginPath().moveTo(339,251).lineTo(339,227).lineTo(446,227).lineTo(446,260).strokePath();g.lineStyle(5,copper).beginPath().moveTo(339,251).lineTo(339,227).lineTo(446,227).lineTo(446,260).strokePath();
 g.lineStyle(6,copper).lineBetween(286,304,294,304).lineBetween(278,252,278,r.repaired?304:280);if(r.repaired)g.lineBetween(278,304,287,304);else{g.lineStyle(2,0x483d35).lineBetween(275,279,281,282);}
 g.fillStyle(0x63766d).fillRoundedRect(421,262,50,63,9);g.fillStyle(0x9ba18a).fillEllipse(446,264,50,14);g.fillStyle(0xbaa879).fillRoundedRect(428,274,36,35,2);for(let y=277;y<309;y+=5)g.lineStyle(1,0x7c8167).lineBetween(430,y,462,y);
 g.lineStyle(6,copper).beginPath().moveTo(470,282).lineTo(501,282).lineTo(501,245).strokePath();
 for(let i=0;i<7;i++){g.lineStyle(5,0x5e4c3c).strokeEllipse(526,248+i*10,48,15);g.lineStyle(3,copper).strokeEllipse(526,246+i*10,48,15);g.lineStyle(1,edge).beginPath().arc(526,246+i*10,22,Math.PI*.05,Math.PI*.7).strokePath();}
 g.lineStyle(5,copper).beginPath().moveTo(548,305).lineTo(559,305).lineTo(559,335).lineTo(486,335).strokePath();
 g.fillStyle(r.repaired?0xb4d1bb:0x645e4b,r.repaired?.65:1).fillRoundedRect(478,337,23,25,4);g.lineStyle(2,edge).strokeRoundedRect(478,337,23,25,4);
 if(!r.repaired){g.lineStyle(3,0x54534b).lineBetween(510,243,543,307);g.lineStyle(2,0x9a674a).lineBetween(369,285,361,302);g.fillStyle(0x998d71).fillPoints([{x:313,y:280},{x:345,y:283},{x:356,y:328},{x:321,y:334}],true);g.lineStyle(1,0xb6a98a).lineBetween(320,285,328,329);}
 g.fillStyle(0x302e26).fillRect(373,501,54,13);g.fillStyle(0xa28a62).fillRoundedRect(369,498,62,5,2);
 if(r.shutter)for(let i=0;i<30;i++){const x=170+(i*37)%180,y=225+(i*29)%220;if(x<170+(y-210)*.7)g.fillStyle(0xffe3a8,.24).fillCircle(x,y,.6+i%2*.3);}
 if(!r.shutter){g.fillStyle(0x111b20,.94).fillRect(88,138,624,388);g.fillStyle(0xd6c99c,.35).fillRect(159,208,92,2);g.fillStyle(0xd6c99c,.12).fillTriangle(159,210,251,210,215,255);}
 return root;
}
