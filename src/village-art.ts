import Phaser from 'phaser';
import {villageLayout as layout,WORLD_HEIGHT} from './village-layout';
// Original procedural scenery, sharing coordinates with the walkable village.
export function drawVillage(scene:Phaser.Scene){
 const g=scene.add.graphics().setDepth(-.5),labels:Phaser.GameObjects.Text[]=[];
 let seed=193;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 const rect=(x:number,y:number,w:number,h:number,c:number,a=1)=>{g.fillStyle(c,a).fillRect(x,y,w,h);};
 const oval=(x:number,y:number,w:number,h:number,c:number,a=1)=>{g.fillStyle(c,a).fillEllipse(x,y,w,h);};
 const line=(x:number,y:number,xx:number,yy:number,c:number,w=1,a=1)=>{g.lineStyle(w,c,a).lineBetween(x,y,xx,yy);};
 const poly=(p:number[],c:number,a=1)=>{g.fillStyle(c,a).fillPoints(Array.from({length:p.length/2},(_,i)=>new Phaser.Geom.Point(p[i*2],p[i*2+1])),true);};
 const label=(x:number,y:number,text:string,size=9)=>{const t=scene.add.text(x,y,text,{fontFamily:'Georgia, serif',fontSize:`${size}px`,color:'#fff1ce',backgroundColor:'#574f37',padding:{x:6,y:4}}).setOrigin(.5).setDepth(5);labels.push(t);};
 rect(0,600,800,WORLD_HEIGHT-600,0x759c48);
 oval(160,900,365,590,0x406846,.48);oval(570,1100,470,490,0x99ae60,.35);
 for(let i=0;i<4600;i++){const x=random()*800,y=600+random()*(WORLD_HEIGHT-600);rect(x,y,1+random()*2,1,[0x4f783f,0x9bb669,0xb1bf72][i%3],.6);}
 const path=(points:number[][],width:number)=>{for(const [w,c]of [[width+5,0x6e8050],[width,0xb5a17b],[width-5,0xd0b992]]){g.lineStyle(w,c).beginPath();points.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.strokePath();for(const[x,y]of points)oval(x,y,w,w,c);}};
 path([[170,595],[174,672],[305,784],[393,909],[476,1030],[493,1320],[493,1414]],31);
 path([[278,760],[150,813],[107,930],[211,1040],[356,1080]],17);
 path([[474,1016],[586,978],[591,940]],28);path([[555,1136],[643,1254]],28);
 oval(479,1089,374,240,0x83915d);oval(476,1080,360,230,0xc3b697);
 for(let y=977;y<1183;y+=10)for(let x=298+(y%20?0:8);x<655;x+=17){if(((x-476)/176)**2+((y-1080)/109)**2>1)continue;rect(x,y,14,7,(x+y)%3?0xcabb9a:0xaeaa8e);line(x+2,y+1,x+12,y+1,0xdfcdae);}
 // A shallow stone fountain and a few pots give the square a quiet centre.
 oval(478,1089,67,30,0x485e43,.3);oval(476,1083,59,37,0x817e6b);oval(476,1078,55,31,0xc3b998);oval(476,1076,44,23,0x587e7e);oval(474,1074,36,16,0x8bb8ab);rect(472,1056,8,20,0xa9a88e);oval(476,1055,23,8,0xe0d1a9);line(476,1053,476,1063,0xc3e2cc,2);line(463,1078,470,1078,0xd2dfbc);line(484,1073,490,1073,0xd2dfbc);
 const flowers=(x:number,y:number)=>{oval(x+3,y+4,22,9,0x385d3d,.25);poly([x-9,y-7,x+9,y-7,x+6,y+7,x-6,y+7],0xa8744e);rect(x-10,y-9,20,4,0xc49764);for(let i=0;i<9;i++){const xx=x+(random()-.5)*22,yy=y-10-random()*8;line(xx,yy+5,xx,yy,0x496b3a);oval(xx,yy,4,3,[0xe7bf8e,0xc37c85,0xd6d4a1][i%3]);}};
 const bench=(x:number,y:number)=>{oval(x+4,y+11,55,11,0x355c3a,.25);for(const xx of[x-20,x+20]){rect(xx,y,3,14,0x4c5c4d);rect(xx,y-13,3,15,0x4c5c4d);}for(let i=0;i<3;i++)rect(x-25,y-14+i*4,53,3,0x997c4f);poly([x-25,y,x+27,y,x+31,y+7,x-21,y+7],0xba9a63);line(x-22,y+3,x+28,y+3,0x756044);};
 bench(367,1019);bench(540,1180);flowers(337,991);flowers(622,1005);flowers(589,1183);
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
 for(let i=0;i<5;i++){const x=490+i*30,y=993+(i%2)*8;rect(x-6,y-7,12,12,0x92704a);line(x,y-7,x,y-36,0x765639,2);oval(x-5,y-30,18,22,0x4d7843);oval(x+4,y-39,20,24,0x66924f);oval(x+1,y-44,13,15,0x8aa75b);}
 rect(684,884,64,68,0x586d59);for(let i=0;i<3;i++){rect(688+i*20,890,16,55,0xa6bdb0,.8);line(689+i*20,891,701+i*20,933,0xd7dfc7);}poly([680,884,712,860,751,884],0x8da998);line(682,884,712,862,0xe0d6b2,3);line(712,862,750,884,0xe0d6b2,3);
 const f=layout.fishShop;house(f.x,f.y,f.w,f.h,0x69888b,0xd8cca7);label(647,1154,'TÓPARTI BOLT',9);
 for(let i=0;i<5;i++){const x=578+i*27;poly([x,1190,x+27,1190,x+30,1208,x-2,1208],i%2?0xe1d4ac:0x698f8a);}line(576,1208,716,1208,0x53695e,2);
 oval(741,1235,30,18,0x627c70);rect(726,1213,30,22,0x947d54);oval(741,1213,30,12,0x5b9595);oval(739,1211,23,6,0x92c4b6);line(728,1218,753,1218,0xc3ad78);line(728,1230,753,1230,0x5e5b41);
 const c=layout.cottage;house(c.x,c.y,c.w,c.h,0x9b7155,0xd4c1a1);flowers(331,1343);flowers(446,1344);
 // Diverse forest silhouettes: broad oak, silver birch and fir.
 const tree=(x:number,y:number,kind:number,s=1)=>{
  oval(x+10*s,y+8*s,67*s,22*s,0x294d3a,.27);
  rect(x-4*s,y-44*s,9*s,49*s,kind===1?0xc6c9b0:0x6b543a);
  if(kind===1){for(let i=0;i<6;i++)rect(x-3*s,y-i*7*s,4*s,2*s,0x667463);line(x,y-24*s,x-16*s,y-47*s,0xb5bca2,3*s);}
  if(kind===2){for(let i=0;i<4;i++){const yy=y-90*s+i*19*s,w=(15+i*8)*s;poly([x,yy,x-w,yy+35*s,x+w,yy+35*s],i%2?0x426d52:0x365c47);poly([x-2*s,yy+4*s,x-w*.75,yy+30*s,x+6*s,yy+28*s],0x62875b,.8);}}
  else for(const[xx,yy,w,h]of [[-18,-48,45,39],[12,-56,51,47],[-3,-76,49,39],[0,-38,56,32]]){
   const cx=x+xx*s,cy=y+yy*s,rx=w*s/2,ry=h*s/2;
   const canopy=(dx:number,dy:number,k:number,c:number)=>poly([cx+dx-rx*k,cy+dy,cx+dx-rx*.8*k,cy+dy-ry*.65*k,cx+dx-rx*.1*k,cy+dy-ry*k,cx+dx+rx*.65*k,cy+dy-ry*.8*k,cx+dx+rx*k,cy+dy-ry*.1*k,cx+dx+rx*.7*k,cy+dy+ry*.65*k,cx+dx-rx*.25*k,cy+dy+ry*.7*k],c);
   canopy(0,0,1,kind===1?0x587644:0x35583c);canopy(-3*s,-5*s,.84,kind===1?0x87a457:0x587b47);
   for(let i=0;i<22;i++)rect(cx+(random()-.5)*w*s*.75,cy+(random()-.55)*h*s*.65,(2+random()*3)*s,2*s,[0x98ac63,0x74944d,0xb9c37b][i%3],.65);
  }
 };
 // Backdrop foliage frames the route without filling its walking spaces.
 for(let i=0;i<18;i++){tree(18+random()*750,700+Math.floor(i/9)*660,i%3,.65);}
 for(const t of layout.trees)tree(t.x,t.y,t.kind);
 for(const[x,y,k]of [[410,750,0],[746,766,1],[754,1052,0],[738,1337,2],[559,1372,1],[273,1375,0]])tree(x,y,k,.9);
 // Ferns, fallen leaves and meadow flowers along the shaded fork.
 for(let i=0;i<70;i++){const x=45+random()*240,y=660+random()*520;for(let j=0;j<4;j++)line(x,y,x+(j-1.5)*4,y-5-random()*8,0x63894e);if(i%3===0)oval(x,y,4,2,0xc6b77c,.7);}
 rect(229,661,4,40,0x7b6341);poly([216,665,264,665,272,674,264,683,216,683],0xae9567);label(243,674,'Falu ↓',8);label(88,694,'Erdei ösvény',8);
 rect(416,930,4,42,0x615940);rect(409,925,18,18,0xd9c994);rect(408,924,20,3,0x5b6550);poly([406,924,418,913,430,924],0x566650);
 return {graphics:g,labels};
}
export function drawForage(scene:Phaser.Scene,picked:Record<string,number>,day:number){
 const g=scene.add.graphics().setDepth(2);
 for(const b of layout.bushes){g.fillStyle(0x2f5138,.25).fillEllipse(b.x+3,b.y+5,40,13);g.fillStyle(0x3e693e).fillEllipse(b.x,b.y-6,35,24);g.fillStyle(0x719047).fillEllipse(b.x-6,b.y-12,21,15);g.fillStyle(0x92a85a).fillEllipse(b.x+4,b.y-15,15,10);
  if(picked[b.id]===undefined||day-picked[b.id]>=2)for(const[dx,dy]of [[-10,-5],[2,-12],[10,-4],[-3,0]]){g.fillStyle(0x565b84).fillCircle(b.x+dx,b.y+dy,3);g.fillStyle(0xa8a9c7).fillCircle(b.x+dx-1,b.y+dy-1,1);}}
 return g;
}
