import {farmBounds} from './layout';
import {paintForest} from './forest-art';
import {FOREST_LEFT} from './forest';
import {drawWoodlandTree} from './woodland-tree';
import Phaser from 'phaser';
import {villageLayout as layout,villagePaths,woodlandTreeClear,villageTrees,forestTrees,WORLD_HEIGHT,WORLD_WIDTH,benchPose,benchPoint,type BenchPose,shopNames} from './village-layout';
// Original procedural scenery, sharing coordinates with the walkable village.
export function drawVillage(scene:Phaser.Scene){
 const g=scene.add.graphics().setDepth(-.5),labels:Phaser.GameObjects.Text[]=[];
 let seed=193;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 const rect=(x:number,y:number,w:number,h:number,c:number,a=1)=>{g.fillStyle(c,a).fillRect(x,y,w,h);};
 const oval=(x:number,y:number,w:number,h:number,c:number,a=1)=>{g.fillStyle(c,a).fillEllipse(x,y,w,h);};
 const line=(x:number,y:number,xx:number,yy:number,c:number,w=1,a=1)=>{g.lineStyle(w,c,a).lineBetween(x,y,xx,yy);};
 const poly=(p:number[],c:number,a=1)=>{g.fillStyle(c,a).fillPoints(Array.from({length:p.length/2},(_,i)=>new Phaser.Geom.Point(p[i*2],p[i*2+1])),true);};
 const label=(x:number,y:number,text:string,size=9)=>{const t=scene.add.text(x,y,text,{fontFamily:'Georgia, serif',fontSize:`${size}px`,color:'#fff1ce',backgroundColor:'#574f37',padding:{x:6,y:4}}).setOrigin(.5).setDepth(5);labels.push(t);};
 rect(FOREST_LEFT,600,1200-FOREST_LEFT,WORLD_HEIGHT-600,0x759c48);rect(FOREST_LEFT,farmBounds.top,-400-FOREST_LEFT,600-farmBounds.top,0x759c48);
 // Layered hill shoulders: cool lower slopes and sunlit rounded crowns.
 for(const [x,y,w,h]of [[40,760,440,220],[110,965,470,280],[20,1160,450,210]]){
  oval(x+8,y+30,w,h,0x44683f,.55);oval(x-7,y+8,w*.98,h*.82,0x638743,.7);oval(x-35,y-8,w*.8,h*.56,0x8ba352,.5);
  g.lineStyle(2,0xa5b16c,.26).beginPath().arc(x-20,y-2,w*.31,Math.PI*1.12,Math.PI*1.84).strokePath();
 }
 oval(160,900,365,590,0x406846,.48);oval(570,1100,470,490,0x99ae60,.35);
 for(let i=0;i<9200;i++){const x=FOREST_LEFT+random()*(1200-FOREST_LEFT),y=600+random()*(WORLD_HEIGHT-600);rect(x,y,1+random()*2,1,[0x4f783f,0x9bb669,0xb1bf72][i%3],.6);}
 // Northern woodland backdrop continues beyond the farm's left edge, instead of blank green.
 for(let i=0;i<4700;i++){const x=FOREST_LEFT+random()*(-400-FOREST_LEFT),y=farmBounds.top+random()*(600-farmBounds.top);rect(x,y,1+random()*2,1,[0x4f783f,0x9bb669,0xb1bf72][i%3],.6);}
 const path=(points:number[][],width:number,openStart=false)=>{for(const [w,c]of [[width+5,0x738354],[width+1,0xa5936c],[width-3,0xc1ae85]]){g.lineStyle(w,c).beginPath();points.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.strokePath();for(const[x,y]of (openStart?points.slice(1):points))oval(x,y,w,w,c);}};
 // The road starts with a straight continuation at the farm edge, without an overlapping end cap.
 for(const [i,p]of villagePaths.slice(0,4).entries())path(p.points,p.width,i===0);
 oval(479,1089,374,240,0x83915d);oval(476,1080,360,230,0xc3b697);
 for(let y=977;y<1183;y+=10)for(let x=298+(y%20?0:8);x<655;x+=17){if(((x-476)/176)**2+((y-1080)/109)**2>1)continue;rect(x,y,14,7,(x+y)%3?0xcabb9a:0xaeaa8e);line(x+2,y+1,x+12,y+1,0xdfcdae);}
 // A shallow stone fountain and a few pots give the square a quiet centre.
 oval(478,1089,67,30,0x485e43,.3);oval(476,1083,59,37,0x817e6b);oval(476,1078,55,31,0xc3b998);oval(476,1076,44,23,0x587e7e);oval(474,1074,36,16,0x8bb8ab);rect(472,1056,8,20,0xa9a88e);oval(476,1055,23,8,0xe0d1a9);line(476,1053,476,1063,0xc3e2cc,2);line(463,1078,470,1078,0xd2dfbc);line(484,1073,490,1073,0xd2dfbc);
 const flowers=(x:number,y:number)=>{oval(x+3,y+4,22,9,0x385d3d,.25);poly([x-9,y-7,x+9,y-7,x+6,y+7,x-6,y+7],0xa8744e);rect(x-10,y-9,20,4,0xc49764);for(let i=0;i<9;i++){const xx=x+(random()-.5)*22,yy=y-10-random()*8;line(xx,yy+5,xx,yy,0x496b3a);oval(xx,yy,4,3,[0xe7bf8e,0xc37c85,0xd6d4a1][i%3]);}};
 const bench=(pose:BenchPose)=>{
  const p=(x:number,y:number,z=0)=>{const q=benchPoint(pose,x,y);return {x:q.x,y:pose.y+(q.y-pose.y)*.42-z};};
  const board=(x:number,y:number,w:number,h:number,z:number,c:number)=>{const a=p(x,y,z),b=p(x+w,y,z),d=p(x+w,y+h,z),e=p(x,y+h,z);poly([a.x,a.y,b.x,b.y,d.x,d.y,e.x,e.y],c);};
  const post=(x:number,y:number,top:number)=>{const a=p(x,y,0),b=p(x,y,top);line(a.x,a.y,b.x,b.y,0x4b5946,3);line(a.x-1,a.y,b.x-1,b.y,0x89927a);};
  oval(pose.x+4,pose.y+7,61,23,0x355c3a,.23);
  for(const x of [-24,24]){post(x,-8,32);post(x,9,12);}
  for(const z of [18,25]){const a=p(-28,-9,z),b=p(28,-9,z);line(a.x,a.y,b.x,b.y,0x72583d,7);line(a.x,a.y-1,b.x,b.y-1,0xc3a06b,4);}
  for(const y of [-5,1,7])board(-29,y,58,5,12,0xb79762);
  for(const x of [-26,26]){const a=p(x,-9,19),b=p(x,11,19);line(a.x,a.y,b.x,b.y,0x53614a,3);}
 };
 for(const b of layout.benches)bench(benchPose(b.angle));flowers(300,985);flowers(666,1165);flowers(627,1128);
 const house=(x:number,y:number,w:number,h:number,roof:number,wall:number)=>{
  poly([x,y+h-3,x+w,y+h-3,x+w+23,y+h+18,x+13,y+h+21],0x33583b,.28);
  rect(x,y,w,h,wall);rect(x,y+h-10,w,10,0x9c967b);for(let xx=x+2;xx<x+w-10;xx+=15){rect(xx,y+h-9,13,5,0xb9af90);}
  for(let yy=y+6;yy<y+h-12;yy+=9)line(x+4,yy,x+w-4,yy,0xb3aa87,1,.35);
  poly([x-12,y+15,x+20,y-39,x+w-23,y-39,x+w+13,y+15],0x5c5341);poly([x-8,y+11,x+22,y-36,x+w-24,y-36,x+w+8,y+11],roof);
  for(let yy=y-31;yy<y+10;yy+=7){const d=(yy-y+36)*.61;line(x+22-d,yy,x+w-24+d,yy,0x534b3c,1,.55);for(let xx=x+25-d;xx<x+w-25+d;xx+=15)line(xx,yy,xx-2,yy+6,0xc4aa77,1,.3);}
  rect(x+w*.44,y+h-48,25,48,0x654f39);rect(x+w*.44+3,y+h-45,19,42,0x8f7753);rect(x+w*.44+18,y+h-26,2,3,0xe5cb7d);
  for(const xx of[x+18,x+w-48]){rect(xx-3,y+30,34,37,0xe6d7ac);rect(xx,y+33,28,29,0x4d6966);poly([xx+2,y+35,xx+26,y+35,xx+2,y+59],0xa5bcb0,.7);line(xx+14,y+34,xx+14,y+62,0xe5d6ad,2);line(xx+1,y+48,xx+27,y+48,0xe5d6ad,2);rect(xx-4,y+65,36,4,0x7c704f);}
  rect(x+w*.44-4,y+h,34,5,0xb9aa86);rect(x+w*.44-7,y+h+5,40,4,0xd0bf97);
 };
 const n=layout.nursery;house(n.x,n.y,n.w,n.h,0x657b52,0xd6c8a0);label(593,864,'FAISKOLA',10);
 // Nursery saplings in tubs, a little glass lean-to and hand-painted tree sign.
 rect(503,952,55,20,0xada17c);rect(630,952,55,20,0xada17c);
 for(const {x,y}of layout.nurserySaplings){rect(x-6,y-7,12,12,0x92704a);line(x,y-7,x,y-36,0x765639,2);oval(x-5,y-30,18,22,0x4d7843);oval(x+4,y-39,20,24,0x66924f);oval(x+1,y-44,13,15,0x8aa75b);}

 rect(684,839,64,68,0x586d59);for(let i=0;i<3;i++){rect(688+i*20,845,16,55,0xa6bdb0,.8);line(689+i*20,846,701+i*20,888,0xd7dfc7);}poly([680,839,712,815,751,839],0x8da998);line(682,839,712,817,0xe0d6b2,3);line(712,817,750,839,0xe0d6b2,3);
 // Broad long-side elevation: all walls and joinery stand upright.
 const f=layout.fishShop;
 oval(785,1098,258,32,0x35583b,.24);rect(f.x,f.y,f.w,f.h,0xd7c9a2);rect(f.x,f.y+115,f.w,13,0x9c967b);
 for(let y=f.y+9;y<f.y+115;y+=10)line(f.x+3,y,f.x+f.w-3,y,0xb2a783);
 poly([650,974,677,921,882,921,910,974],0x486a64);poly([658,969,682,925,878,925,901,969],0x6c9080);
 for(let y=930;y<969;y+=8)line(681-(y-925)*.5,y,878+(y-925)*.5,y,0x9bb29a,1,.6);
 rect(691,1031,34,57,0x67543c);rect(695,1035,26,49,0xa18559);rect(698,1038,20,23,0x89b1a5);rect(715,1067,3,4,0xe6c778);
 rect(684,1088,49,6,0xaea385);rect(681,1094,55,6,0xd0bf99);
 for(const x of [753,825]){rect(x-4,1005,49,51,0xf0dfb7);rect(x,1009,41,43,0x6a9d96);line(x+20,1009,x+20,1052,0xe7dabc,3);line(x,1030,x+41,1030,0xe7dabc,3);line(x+3,1012,x+15,1026,0xc5d7be,2);rect(x-6,1057,53,6,0x796e4d);}
 rect(680,1025,56,6,0x638776);line(680,1025,736,1025,0xb8c4a2,2);label(780,987,shopNames.fishShop,12);
 oval(865,1107,33,16,0x587d6d);rect(849,1086,32,21,0x947d54);oval(865,1086,32,12,0x5b9595);oval(863,1084,24,6,0x92c4b6);
 const c=layout.cottage;house(c.x,c.y,c.w,c.h,0x9b7155,0xd4c1a1);flowers(331,1343);flowers(446,1344);
 // Diverse forest silhouettes: broad oak, silver birch and fir.
 const tree=(x:number,y:number,kind:number,s=1)=>{if(woodlandTreeClear(x,y,s,kind))drawWoodlandTree(g,random,x,y,kind,s);};
 paintForest(g,random);
 for(let row=0;row<17;row++)for(let column=0;column<9;column++){const x=FOREST_LEFT+25+column*77+(row%2)*24,y=farmBounds.top+50+row*65;if(x< -445)tree(x,y,(row+column)%3,.85+(column%3)*.08);}

 // Backdrop foliage frames the route without filling its walking spaces.
 for(let i=0;i<18;i++){tree(18+random()*750,700+Math.floor(i/9)*660,i%3,.65);}
 for(let i=0;i<25;i++)tree(-170+(i%4)*47,695+Math.floor(i/4)*83,i%3,.85+(i%3)*.08);
 for(const t of [...villageTrees,...forestTrees].sort((a,b)=>a.y-b.y))tree(t.x,t.y,t.kind);
 for(const[x,y,k]of [[410,750,0],[746,766,1],[762,1178,0],[738,1337,2],[559,1372,1],[273,1375,0]])tree(x,y,k,.9);
 // Ferns, fallen leaves and meadow flowers along the shaded fork.
 for(let i=0;i<70;i++){const x=45+random()*240,y=660+random()*520;for(let j=0;j<4;j++)line(x,y,x+(j-1.5)*4,y-5-random()*8,0x63894e);if(i%3===0)oval(x,y,4,2,0xc6b77c,.7);}
 // Supported wooden signs at the road and its forest fork, rather than text in grass.
 const sign=(postX:number,groundY:number,left:number,top:number,width:number,text:string,direction:'left'|'right'|'down')=>{
  oval(postX+4,groundY+3,19,7,0x35553a,.22);rect(postX-2,top+10,5,groundY-top-8,0x6b5438);rect(postX-1,top+12,2,groundY-top-10,0xac8858);
  const arrow=direction==='down'?[left,top,left+width,top,left+width,top+18,left+width/2,top+33,left,top+18]:direction==='right'?[left,top,left+width-10,top,left+width,top+11,left+width-10,top+22,left,top+22]:[left+10,top,left+width,top,left+width,top+22,left+10,top+22,left,top+11];
  poly(arrow,0x604f35);poly(arrow.map((v,i)=>v+(i%2? -1:0)),0xa98a59);line(left+12,top+3,left+width-12,top+3,0xcfb17b);if(direction!=='down')line(left+12,top+19,left+width-12,top+19,0x735b3c);oval(postX,top+6,2,2,0x5c5b45);oval(postX,top+16,2,2,0x5c5b45);
  const title=scene.add.text(left+width/2+(direction==='left'?3:direction==='right'?-3:0),top+11,text,{fontFamily:'Georgia,serif',fontSize:'9px',color:'#fff0c8',resolution:2}).setOrigin(.5).setDepth(5);labels.push(title);
 };
 sign(235,673,208,608,54,'Falu','down');sign(292,810,220,759,88,'Erdei ösvény','left');

 rect(416,930,4,42,0x615940);rect(409,925,18,18,0xd9c994);rect(408,924,20,3,0x5b6550);poly([406,924,418,913,430,924],0x566650);
 // This scenery is static too; keep tree canopies and paving out of the per-frame geometry pass.
 const terrain=scene.add.renderTexture(FOREST_LEFT,farmBounds.top,1200-FOREST_LEFT,WORLD_HEIGHT-farmBounds.top).setOrigin(0).setDepth(-.5);terrain.draw(g,-FOREST_LEFT,-farmBounds.top);g.destroy();
 return {graphics:terrain,labels};
}
export function drawForage(scene:Phaser.Scene,picked:Record<string,number>,day:number){
 const g=scene.add.graphics().setDepth(2);
 for(const b of layout.bushes){g.fillStyle(0x2f5138,.25).fillEllipse(b.x+3,b.y+5,40,13);g.fillStyle(0x3e693e).fillEllipse(b.x,b.y-6,35,24);g.fillStyle(0x719047).fillEllipse(b.x-6,b.y-12,21,15);g.fillStyle(0x92a85a).fillEllipse(b.x+4,b.y-15,15,10);
  if(picked[b.id]===undefined||day-picked[b.id]>=2)for(const[dx,dy]of [[-10,-5],[2,-12],[10,-4],[-3,0]]){g.fillStyle(0x565b84).fillCircle(b.x+dx,b.y+dy,3);g.fillStyle(0xa8a9c7).fillCircle(b.x+dx-1,b.y+dy-1,1);}}
 return g;
}
