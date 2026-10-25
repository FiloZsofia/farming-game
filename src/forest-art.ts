import Phaser from 'phaser';
import {FOREST_LEFT,forestNest,forestPlants,walkingStick,type Forest} from './forest';
export function drawForest(scene:Phaser.Scene){
 const g=scene.add.graphics();let seed=815;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 g.fillStyle(0x527344).fillRect(FOREST_LEFT,620,-FOREST_LEFT+30,800);
 for(let i=0;i<180;i++){const x=FOREST_LEFT+random()*1120,y=670+random()*730;g.fillStyle([0x74924d,0x668545,0x3e633f][i%3],.5).fillEllipse(x,y,30+random()*90,12+random()*40);}
 // Contour shelves: warm sunlit upper meadow, a shaded hollow beyond a narrow saddle.
 for(const [x,y,w,h]of [[-850,780,440,210],[-850,1200,440,220],[-320,740,550,115]]){g.fillStyle(0x324f36,.7).fillEllipse(x,y+13,w,h);g.fillStyle(0x607b49).fillEllipse(x,y,w,h);g.lineStyle(3,0x8a9961,.6).strokeEllipse(x,y-10,w-15,h-15);}
 const path=[{x:40,y:930},{x:-120,y:938},{x:-270,y:1000},{x:-450,y:995},{x:-570,y:962},{x:-660,y:978},{x:-780,y:984},{x:-940,y:1010}];
 g.lineStyle(35,0x9a9970,.7).strokePoints(path);g.lineStyle(23,0xb5aa7b,.45).strokePoints(path);
 // A shallow brook curls through the lower edge, crossed by an old plank footbridge.
 const brook=[{x:-1000,y:1280},{x:-760,y:1240},{x:-590,y:1210},{x:-440,y:1195},{x:-250,y:1240},{x:-70,y:1310}];g.lineStyle(22,0x384f3c).strokePoints(brook);g.lineStyle(15,0x588a85).strokePoints(brook);g.lineStyle(3,0xa5beb0,.6).strokePoints(brook);
 for(let i=0;i<7;i++){g.fillStyle(i%2?0xa88b5c:0x947951).fillRect(-465,1170+i*8,43,6);}g.lineStyle(3,0x67533b).lineBetween(-464,1169,-464,1225).lineBetween(-421,1169,-421,1225);
 for(let i=0;i<46;i++){const x=-1080+random()*1050,y=i%2?680+random()*150:1235+random()*155;const birch=i%3===0;g.fillStyle(0x233d2e,.3).fillEllipse(x+10,y+8,74,23);g.fillStyle(birch?0xc5c5a6:0x65503a).fillRect(x-4,y-43,8,48);if(birch)for(let j=0;j<5;j++)g.fillStyle(0x656c56).fillRect(x-3,y-j*8,4,2);for(const [dx,dy,r]of [[-17,-53,25],[15,-60,29],[0,-80,26],[0,-44,30]]){g.fillStyle(birch?0x6e8d4d:0x355d3d).fillCircle(x+dx,y+dy,r);g.fillStyle(birch?0x91a85d:0x527c47).fillEllipse(x+dx-5,y+dy-7,r*1.6,r*.9);}}
 // Mossy stones and a recognizable sheltered resting place.
 for(const [x,y]of [[-300,826],[-487,850],[-740,1130],[-1010,950]]){g.fillStyle(0x737d6c).fillEllipse(x,y,40,22);g.fillStyle(0xa1aa8a).fillEllipse(x-5,y-5,27,12);g.fillStyle(0x50734a).fillEllipse(x+7,y+5,23,9);}
 g.fillStyle(0x564b35).fillRect(-486,959,5,20).fillRect(-440,959,5,20);g.fillStyle(0xa28655).fillRoundedRect(-492,951,61,9,2);g.lineStyle(3,0xc1a776).lineBetween(-489,948,-434,948);g.lineStyle(6,0x715a3d).lineBetween(-490,932,-433,932);
 const n=forestNest;g.fillStyle(0x3d3c2a).fillEllipse(n.x,n.y+9,91,25);g.fillStyle(0x796448).fillRoundedRect(n.x-48,n.y-35,96,39,11);g.lineStyle(2,0xad9161).lineBetween(n.x-35,n.y-31,n.x+35,n.y-27).lineBetween(n.x-35,n.y-14,n.x+25,n.y-8);for(let i=0;i<7;i++){const x=n.x-30+i*10,y=n.y-20+(i%2)*8;g.fillStyle(i%3?0x453d2d:0xa8986d).fillCircle(x,y,3.5);}g.fillStyle(0x6b8548).fillEllipse(n.x+17,n.y-35,48,11);
 const texture=scene.add.renderTexture(FOREST_LEFT,620,-FOREST_LEFT+35,800).setOrigin(0).setDepth(-.4);texture.draw(g,-FOREST_LEFT,-620);g.destroy();
 return texture;
}
export function drawForestObjects(scene:Phaser.Scene,f:Forest,day:number){
 const g=scene.add.graphics().setDepth(1);
 for(const p of forestPlants){if(f.picked[p.id]!==undefined&&day-f.picked[p.id]<3)continue;g.fillStyle(0x2f4f32,.22).fillEllipse(p.x,p.y+2,27,9);
  if(p.kind==='thyme'){for(let i=0;i<9;i++){const x=p.x+(i%3-1)*6,y=p.y-Math.floor(i/3)*4;g.lineStyle(1.5,0x527449).lineBetween(x,y+3,x,y-7);g.fillStyle(i%2?0xa789b5:0xc3a4c4).fillCircle(x,y-7,2);}}
  else for(let i=0;i<5;i++){const x=p.x+(i-2)*4,h=p.kind==='nettle'?19+(i%2)*7:12+(i%2)*5;g.lineStyle(1.5,0x45683d).lineBetween(x,p.y,x,p.y-h);g.fillStyle(p.kind==='nettle'?0x598743:0x75944a).fillEllipse(x-3,p.y-h+4,7,p.kind==='nettle'?6:13);if(p.kind==='nettle')g.fillTriangle(x,p.y-h,x-5,p.y-h+8,x+5,p.y-h+8);}
 }
 if(!f.stick){g.lineStyle(4,0x715238).strokePoints([{x:walkingStick.x-20,y:walkingStick.y+4},{x:walkingStick.x+12,y:walkingStick.y-4},{x:walkingStick.x+22,y:walkingStick.y-13}]);g.lineStyle(1,0xc6aa78).lineBetween(walkingStick.x-18,walkingStick.y+2,walkingStick.x+12,walkingStick.y-6);}
 return g;
}
