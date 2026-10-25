import {drawWoodlandTree} from './woodland-tree';
import Phaser from 'phaser';
import {FOREST_LEFT,forestNest,forestPlants,walkingStick,type Forest} from './forest';
// Paint into the village's own cached terrain: no overlay rectangle or separate palette.
export function paintForest(g:Phaser.GameObjects.Graphics,random:()=>number){
 const oval=(x:number,y:number,w:number,h:number,c:number,a=1)=>g.fillStyle(c,a).fillEllipse(x,y,w,h);
 for(const [x,y,w,h]of [[-850,785,440,205],[-850,1210,440,220],[-380,730,570,145]]){
  oval(x+8,y+25,w,h,0x44683f,.38);oval(x-7,y+8,w*.98,h*.82,0x638743,.5);oval(x-35,y-8,w*.8,h*.56,0x8ba352,.36);
 }
 // Small overlapping shade patches deepen the hollow gradually, without straight edges.
 for(let i=0;i<100;i++){const x=-1080+random()*1060,y=690+random()*670;oval(x,y,45+random()*110,18+random()*35,0x406846,.05+Math.max(0,-x-200)/3000);}
 const path=[{x:107,y:930},{x:40,y:930},{x:-120,y:938},{x:-270,y:1000},{x:-450,y:995},{x:-570,y:962},{x:-660,y:978},{x:-780,y:984},{x:-940,y:1010}];
 for(const [width,color]of [[24,0x738354],[20,0xa5936c],[16,0xc1ae85]]){g.lineStyle(width,color).strokePoints(path);for(const p of path)oval(p.x,p.y,width,width,color);}
 // Curved banks, exposed stones and bright broken reflections make the brook readable.
 const brook=new Phaser.Curves.Spline([new Phaser.Math.Vector2(-1060,1285),new Phaser.Math.Vector2(-780,1250),new Phaser.Math.Vector2(-600,1207),new Phaser.Math.Vector2(-440,1195),new Phaser.Math.Vector2(-260,1240),new Phaser.Math.Vector2(-30,1320)]).getPoints(90);
 for(const [width,color]of [[40,0x617347],[32,0x9c9a70],[25,0x3c7778],[17,0x70aaa5]]){g.lineStyle(width,color).strokePoints(brook);for(const p of brook)oval(p.x,p.y,width,width,color);}
 for(let i=3;i<brook.length-3;i+=5){const p=brook[i];g.lineStyle(1.2,0xd5e3bd,.8).lineBetween(p.x-6,p.y-3,p.x+7,p.y-3);oval(p.x+(i%2?18:-18),p.y+7,8,5,0xa6ab89);g.lineStyle(1.5,0x5c8249).lineBetween(p.x+21,p.y,p.x+23,p.y-10).lineBetween(p.x+23,p.y,p.x+27,p.y-7);}
 for(let i=0;i<8;i++){g.fillStyle(i%2?0xae925f:0x947951).fillRect(-464,1167+i*8,40,6);}g.lineStyle(3,0x67533b).lineBetween(-465,1165,-465,1229).lineBetween(-423,1165,-423,1229);
 for(let i=0;i<46;i++){const x=-1080+random()*1030,y=i%2?700+random()*130:1260+random()*115;drawWoodlandTree(g,random,x,y,i%3,.85+(i%3)*.08);}
 // Dense trunks and brambles follow the actual impassable shoulders of both gates.
 for(const [center,top,bottom]of [[-665,934,1020],[-885,954,1040]]){
  for(const x of [center-25,center,center+25]){
   for(let y=725;y<top+1;y+=48)drawWoodlandTree(g,random,x+(y%3)*3,y,Math.abs(Math.round(x+y))%3,.9);
   for(let y=bottom+99;y<1380;y+=47)drawWoodlandTree(g,random,x+(y%3)*3,y,Math.abs(Math.round(x+y))%3,.9);
   for(let y=715;y<1340;y+=26)if(y<top-5||y>bottom+5){g.lineStyle(2,0x456b3c).lineBetween(x-12,y+7,x+8,y-3).lineBetween(x-4,y+9,x-9,y-8);g.fillStyle(0x6d8a49).fillEllipse(x-10,y,18,8).fillEllipse(x+4,y+4,20,7);}
  }
 }
 for(const [x,y]of [[-300,826],[-487,850],[-740,1130],[-1010,950]]){oval(x,y,40,22,0x737d6c);oval(x-5,y-5,27,12,0xa1aa8a);oval(x+7,y+5,23,9,0x50734a);}
 // A complete wooden resting bench: back slats, supports, seat and four clear legs.
 oval(-461,977,76,16,0x344a30,.25);g.fillStyle(0x655035).fillRect(-489,933,5,43).fillRect(-437,933,5,43).fillRect(-486,960,5,21).fillRect(-440,960,5,21);
 g.fillStyle(0xa88a57).fillRoundedRect(-494,928,64,9,2).fillRoundedRect(-494,939,64,8,2);g.lineStyle(1,0xd4b577).lineBetween(-491,930,-433,930).lineBetween(-491,941,-433,941);
 g.fillStyle(0xb69a65).fillPoints([{x:-493,y:950},{x:-434,y:950},{x:-427,y:961},{x:-499,y:961}],true);g.fillStyle(0x7e6240).fillRect(-499,961,72,5);g.lineStyle(1,0xd0b47b).lineBetween(-492,954,-432,954).lineBetween(-495,958,-430,958);for(const x of [-486,-438])g.fillStyle(0x66543a).fillCircle(x,933,1).fillCircle(x,943,1);
 const n=forestNest;oval(n.x,n.y+10,128,28,0x2f452f,.3);
 // Fallen hardwood: bark ridges, broken branch, growth rings and pre-existing nesting holes.
 g.fillStyle(0x594531).fillPoints([{x:n.x-62,y:n.y-13},{x:n.x-52,y:n.y-40},{x:n.x+43,y:n.y-34},{x:n.x+61,y:n.y-18},{x:n.x+53,y:n.y+6},{x:n.x-47,y:n.y+9}],true);
 g.fillStyle(0x94734a).fillRoundedRect(n.x-48,n.y-34,90,36,7);
 for(let i=0;i<7;i++)g.lineStyle(i%2?2:1, i%2?0x5e4932:0xb08c59).strokePoints([{x:n.x-47,y:n.y-29+i*5},{x:n.x-18,y:n.y-32+i*5},{x:n.x+10,y:n.y-27+i*5},{x:n.x+40,y:n.y-29+i*5}]);
 g.fillStyle(0xb59867).fillEllipse(n.x+46,n.y-14,28,43);g.lineStyle(1,0x80653f).strokeEllipse(n.x+46,n.y-14,21,34).strokeEllipse(n.x+46,n.y-14,12,22).lineBetween(n.x+46,n.y-14,n.x+54,n.y-28);
 g.lineStyle(9,0x675038).lineBetween(n.x-23,n.y-33,n.x-35,n.y-51);g.fillStyle(0xb59764).fillEllipse(n.x-35,n.y-51,11,5);
 for(const [dx,dy,plug]of [[-33,-20,0],[-18,-10,1],[-4,-23,1],[13,-13,0],[28,-25,1]]){oval(n.x+dx,n.y+dy,9,10,0x493c29);oval(n.x+dx-1,n.y+dy-1,6,7,plug?0xa39368:0x282e24);if(plug)g.lineStyle(.7,0xc4b687).lineBetween(n.x+dx-2,n.y+dy,n.x+dx+2,n.y+dy-1);}
 oval(n.x-9,n.y-34,46,9,0x62804a);for(let i=0;i<9;i++)oval(n.x-30+i*5,n.y-36+(i%2)*3,5,3,0x8fa057);
}
export function drawForestObjects(scene:Phaser.Scene,f:Forest,day:number){
 const g=scene.add.graphics().setDepth(1);
 for(const p of forestPlants){if(f.picked[p.id]!==undefined&&day-f.picked[p.id]<3)continue;g.fillStyle(0x2f4f32,.22).fillEllipse(p.x,p.y+2,27,9);
  if(p.kind==='thyme'){for(let i=0;i<9;i++){const x=p.x+(i%3-1)*6,y=p.y-Math.floor(i/3)*4;g.lineStyle(1.5,0x527449).lineBetween(x,y+3,x,y-7);g.fillStyle(i%2?0xa789b5:0xc3a4c4).fillCircle(x,y-7,2);}}
  else if(p.kind==='plantain'){
   // Basal rosette of long narrow ribbed leaves, with upright brown flower spikes.
   for(let i=0;i<7;i++){const angle=-Math.PI+i*Math.PI/6,dx=Math.cos(angle)*20,dy=Math.sin(angle)*10;const bx=p.x,by=p.y-2,tx=bx+dx,ty=by+dy;g.fillStyle(i%2?0x75964d:0x527d40).fillPoints([{x:bx,y:by},{x:bx+dx*.35-dy*.23,y:by+dy*.35+dx*.13},{x:tx,y:ty},{x:bx+dx*.45+dy*.2,y:by+dy*.45-dx*.13}],true);g.lineStyle(.7,0xadbd75).lineBetween(bx,by,tx,ty);}
   for(const [dx,h]of [[-5,25],[2,32],[8,23]]){g.lineStyle(1.3,0x6f8650).lineBetween(p.x+dx,p.y-3,p.x+dx-2,p.y-h);g.fillStyle(0x967a50).fillRoundedRect(p.x+dx-3,p.y-h-7,3,9,1);g.lineStyle(.8,0xd5c69a).lineBetween(p.x+dx-3,p.y-h-5,p.x+dx,p.y-h-5);}
  }else{
   // Upright nettle stems and opposite pairs of toothed leaves.
   for(const [dx,h]of [[-9,30],[0,39],[10,28]]){const x=p.x+dx;g.lineStyle(1.8,0x53753f).lineBetween(x,p.y,x-1,p.y-h);
    for(let level=0;level<3;level++)for(const side of [-1,1]){const y=p.y-9-level*8,w=9-level*1.3;g.fillStyle(level%2?0x6f9a4d:0x4e7c3d).fillPoints([{x,y},{x:x+side*3,y:y-5},{x:x+side*5,y:y-3},{x:x+side*7,y:y-7},{x:x+side*8,y:y-5},{x:x+side*w,y:y-10},{x:x+side*(w+3),y:y-5},{x:x+side*w,y:y-3},{x:x+side*(w+1),y:y-1},{x:x+side*5,y:y+1}],true);g.lineStyle(.6,0x9fb56b).lineBetween(x,y,x+side*w,y-7);}
    g.fillStyle(0x8caa60).fillTriangle(x-3,p.y-h+5,x,p.y-h-3,x+3,p.y-h+5);
   }
  }
 }
 if(!f.stick){g.lineStyle(4,0x715238).strokePoints([{x:walkingStick.x-20,y:walkingStick.y+4},{x:walkingStick.x+12,y:walkingStick.y-4},{x:walkingStick.x+22,y:walkingStick.y-13}]);g.lineStyle(1,0xc6aa78).lineBetween(walkingStick.x-18,walkingStick.y+2,walkingStick.x+12,walkingStick.y-6);}
 return g;
}
