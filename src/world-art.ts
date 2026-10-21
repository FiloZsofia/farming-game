import Phaser from 'phaser';
import {pondRadius} from './pond-shape';
import {activeDebris,createClearing,type Clearing} from './cleanup';
import {createGarden,type Garden} from './gardening';
import {farmLayout as layout} from './layout';

// Original procedural artwork. World anchors stay shared with interaction/collision.
export function drawFarm(scene:Phaser.Scene,clearing:Clearing=createClearing(),garden:Garden=createGarden(),birdhouse:{x:number;y:number}|null=null){
 const g=scene.add.graphics();
 let seed=71;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 const rect=(x:number,y:number,w:number,h:number,c:number,a=1)=>{g.fillStyle(c,a);g.fillRect(Math.round(x),Math.round(y),w,h);};
 const oval=(x:number,y:number,w:number,h:number,c:number,a=1)=>{g.fillStyle(c,a);g.fillEllipse(x,y,w,h);};
 const poly=(points:number[],c:number,a=1)=>{g.fillStyle(c,a);g.fillPoints(Array.from({length:points.length/2},(_,i)=>new Phaser.Geom.Point(points[i*2],points[i*2+1])),true);};
 const line=(x:number,y:number,xx:number,yy:number,c:number,w=1,a=1)=>{g.lineStyle(w,c,a);g.lineBetween(x,y,xx,yy);};
 const tuft=(x:number,y:number,size=1)=>{line(x,y,x-4*size,y-5*size,0x536b3d);line(x,y,x+size,y-8*size,0x718b4e);line(x+1,y,x+5*size,y-4*size,0x9ca76a);};
 const rock=(x:number,y:number,s=1)=>{
  oval(x+3*s,y+4*s,33*s,12*s,0x273c32,.27);
  poly([x-15*s,y+2*s,x-12*s,y-9*s,x-3*s,y-16*s,x+10*s,y-13*s,x+17*s,y-3*s,x+13*s,y+7*s,x-6*s,y+8*s],0x505f5b);
  poly([x-12*s,y-9*s,x-3*s,y-16*s,x+10*s,y-13*s,x+7*s,y-5*s,x-4*s,y-2*s],0xb7bbae);
  poly([x-12*s,y-9*s,x-4*s,y-2*s,x-6*s,y+6*s,x-15*s,y+2*s],0x8d9b93);
  poly([x-4*s,y-2*s,x+7*s,y-5*s,x+17*s,y-3*s,x+13*s,y+5*s,x-6*s,y+6*s],0x75857f);
  line(x-3*s,y-13*s,x-5*s,y-7*s,0xd2d0bb);line(x+7*s,y-5*s,x+5*s,y+2*s,0x4d5c58);
  oval(x-9*s,y+5*s,9*s,3*s,0x78854c);tuft(x-17*s,y+7*s,.65);
 };
 const tree=(x:number,y:number,s=1)=>{
  oval(x+9*s,y+20*s,57*s,23*s,0x243c31,.25);
  poly([x-5*s,y+19*s,x-3*s,y-14*s,x+6*s,y-14*s,x+8*s,y+20*s,x+13*s,y+24*s,x+2*s,y+21*s,x-10*s,y+25*s],0x695139);
  line(x+1*s,y+17*s,x+1*s,y-17*s,0x9b7950,2*s);
  // Layered angular foliage avoids the old circular lollipop silhouette.
  const lobes=[[-19,-17,19],[-2,-32,26],[18,-19,21],[-6,-7,27],[13,0,17]];
  for(const [dx,dy,r] of lobes){const xx=x+dx*s,yy=y+dy*s,rr=r*s;
   poly([xx-rr,yy,xx-rr*.8,yy-rr*.6,xx-rr*.2,yy-rr,xx+rr*.5,yy-rr*.8,xx+rr,yy-rr*.1,xx+rr*.6,yy+rr*.5,xx-rr*.3,yy+rr*.6],0x354f3b);
   poly([xx-rr*.9,yy-rr*.15,xx-rr*.5,yy-rr*.65,xx+rr*.1,yy-rr*.8,xx+rr*.6,yy-rr*.4,xx+rr*.4,yy+rr*.05,xx-rr*.4,yy+rr*.2],0x506d45);
   for(let j=0;j<13;j++){const fx=xx+(random()-.5)*rr*1.35,fy=yy+(random()-.6)*rr;rect(fx,fy,3+random()*3,2,[0x6f8751,0x819559,0x405e3e][j%3]);}
  }
 };
 rect(0,0,800,600,0x759c48);
 for(let i=0;i<180;i++)oval(random()*800,random()*600,35+random()*70,15+random()*35,i%2?0x5b873c:0x9eb45c,.13);
 for(let i=0;i<4200;i++){const x=random()*800,y=random()*600;rect(x,y,1+random()*2,1,[0x658b3f,0xb0bf71,0x82a851][i%3],.55);if(i%10===0)tuft(x,y,.35);}
 const pathStroke=(width:number,color:number)=>{for(const p of layout.paths){g.lineStyle(p.width+width,color);g.beginPath();p.points.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.strokePath();for(const [x,y]of p.points)oval(x,y,p.width+width,p.width+width,color);}};
 pathStroke(5,0x738354);pathStroke(1,0xa5936c);pathStroke(-3,0xc1ae85);
 // Texture follows the paths rather than spilling over their edges.
 for(const p of layout.paths)for(let i=1;i<p.points.length;i++){const [ax,ay]=p.points[i-1],[bx,by]=p.points[i],length=Math.hypot(bx-ax,by-ay);for(let j=0;j<length;j+=3){const t=j/length,offset=(random()-.5)*(p.width-7);rect(ax+(bx-ax)*t-(by-ay)/length*offset,ay+(by-ay)*t+(bx-ax)/length*offset,2,1,j%2?0x9f916e:0xd6c29a,.7);}}
 // Boundary trees leave the usable centre and paths open.
 for(let i=0;i<30;i++){const x=random()*800,y=random()*600;if(y<48||x<27||x>779)tree(x,y,.75+random()*.3);}
 // Cottage: plaster, stone foundation, tiled roof, mullioned windows and porch.
 poly([132,204,347,204,375,243,159,248],0x284936,.28);oval(246,231,234,36,0x2e4333,.24);rect(132,128,215,95,0xd6cbb0);rect(132,138,215,8,0x9b927c);rect(132,211,215,12,0x817b68);
 for(let x=134;x<345;x+=17){rect(x,213,15,7,x%2?0xaaa18a:0x99947e);line(x+1,220,x+14,220,0x656d5c);}
 for(let i=0;i<100;i++)rect(135+random()*208,148+random()*60,2,1,0xb3ac92,.45);
 poly([116,138,154,83,325,83,365,138],0x604e3d);poly([120,134,156,85,323,85,359,134],0x965f47);
 for(let row=0;row<6;row++){const y=88+row*8,left=154-row*5.8,right=325+row*5.6;line(left,y+6,right,y+6,0x704937,2);for(let x=left+row%2*8;x<right-4;x+=16){line(x,y,x-2,y+6,0x704937);line(x+2,y+1,x+12,y+1,0xb37e58);}}
 rect(116,136,249,4,0x554b3b);rect(173,75,18,32,0xaca591);for(let y=78;y<107;y+=7){line(173,y,191,y,0x827f70);line(y%2?178:185,y,y%2?178:185,y+7,0x827f70);}rect(170,72,24,6,0x6c7166);
 rect(222,166,35,57,0x8c7c5d);rect(226,170,27,53,0x66503c);for(let x=230;x<253;x+=6)line(x,172,x,221,0x8e7150);rect(246,196,3,4,0xd7ba70);
 for(const x of [161,287]){rect(x-3,158,33,35,0xede1bf);rect(x,161,27,28,0x5a665f);rect(x+3,164,21,22,0x8eaaa4);poly([x+3,164,x+24,164,x+3,185],0xbaccc0,.6);line(x+13,164,x+13,186,0xe7ddc0,2);line(x+3,175,x+24,175,0xe7ddc0,2);rect(x-4,190,35,4,0x8d7958);}
 rect(190,222,95,29,0x635140);rect(193,223,89,26,0xa0825a);for(let y=225;y<251;y+=5){line(193,y,282,y,0x6c5942);line(196,y+1,278,y+1,0xb99b70);}
 rect(215,251,48,7,0x927858);rect(221,258,36,5,0xae9771);line(215,251,263,251,0xcabb92);
 for(const x of [190,280]){rect(x,184,5,65,0x65513c);rect(x,185,2,62,0xb29467);rect(x-2,245,9,5,0x70664f);}
 poly([179,190,237,153,295,190],0x704d39);poly([183,187,237,155,291,187],0xa16e4a);for(let y=169;y<188;y+=6){const d=(y-153)*1.56;line(237-d,y,237+d,y,0x6c4b37);}
 rect(260,229,16,10,0x5e4632);rect(261,226,13,5,0xe8dcaf);rect(267,226,1,5,0x977f51);
 const box=layout.shipping;oval(box.x+17,box.y+24,39,11,0x273c32,.25);rect(box.x,box.y,box.w,box.h,0x574a35);rect(box.x+2,box.y+2,box.w-4,8,0xb29260);for(let y=box.y+12;y<box.y+24;y+=5)rect(box.x+2,y,box.w-4,4,0x967447);for(const x of [box.x+5,box.x+25])rect(x,box.y,2,box.h,0x534e40);rect(box.x+14,box.y+7,5,12,0xc2ad72);
 const c=layout.catalog;rect(c.x-3,c.y+c.h,24,4,0x836341);rect(c.x,c.y,c.w,c.h,0x4c7059);rect(c.x+3,c.y+2,12,8,0xe8dfb9);rect(c.x+8,c.y+2,1,8,0x867958);
 const m=layout.mailbox;rect(m.x+10,m.y+m.h,5,20,0x80613e);rect(m.x,m.y,m.w,m.h,0x536e72);rect(m.x+2,m.y+2,m.w-4,4,0x94a7a2);rect(m.x+8,m.y+9,8,2,0x273f40);
 const ox=layout.shedOffset.x,oy=layout.shedOffset.y;
 poly([601+ox,183+oy,719+ox,183+oy,741+ox,218+oy,620+ox,224+oy],0x284936,.3);oval(662+ox,205+oy,137,21,0x273c32,.25);rect(601+ox,133+oy,118,68,0x9b8662);for(let x=604;x<719;x+=9){line(x+ox,136+oy,x+ox,200+oy,0x61553f,2);line(x+ox+3,140+oy,x+ox+3,194+oy,0xb39b71);}
 rect(636+ox,151+oy,43,50,0x63513a);for(let x=640;x<679;x+=8)line(x+ox,153+oy,x+ox,199+oy,0x8b7352);line(639+ox,157+oy,676+ox,194+oy,0x9e855a,3);rect(655+ox,152+oy,3,49,0x332f29);rect(650+ox,172+oy,13,4,0x817f6b);rect(655+ox,175+oy,6,7,0xc5ae69);
 poly([562,121,592,84,685,84,710,121],0x665b44);for(let y=89;y<121;y+=7){const d=(y-84)*.8;line(592-d,y,685+d*.65,y,0x8e805b,4);}line(562,122,710,122,0x454c3c,3);
 // Water keeps the exact collision ellipse; only shoreline detail extends outward.
 const p=layout.pond;
 const shoreline=(inset:number)=>{const points:number[]=[];for(let i=0;i<64;i++){const a=i/64*Math.PI*2;const wobble=pondRadius(a);points.push(p.x+Math.cos(a)*(p.rx+inset)*wobble,p.y+Math.sin(a)*(p.ry+inset)*wobble);}return points;};
 poly(shoreline(13),0x62794f);poly(shoreline(7),0xaeaa82);poly(shoreline(0),0x246c7c);
 // Broad shallow patches follow the bays, instead of concentric swimming-pool rings.
 poly(shoreline(-7),0x288b98);const shallows=new Phaser.Curves.Spline([p.x-100,p.y-25,p.x-74,p.y-62,p.x-13,p.y-76,p.x+44,p.y-56,p.x+101,p.y-9,p.x+118,p.y+38,p.x+68,p.y+76,p.x+9,p.y+87,p.x-68,p.y+55,p.x-104,p.y+12,p.x-100,p.y-25]);poly(shallows.getPoints(72).flatMap(point=>[point.x,point.y]),0x42a5a7);
 for(let i=0;i<110;i++){const x=p.x-p.rx+random()*p.rx*2,y=p.y-p.ry+random()*p.ry*2;if(((x-p.x)/p.rx)**2+((y-p.y)/p.ry)**2<.87)line(x,y,x+4+random()*12,y, i%3?0x98d9cb:0xe1edbc,1,.45);}
 for(const [dx,dy,w]of [[-72,-52,18],[-61,-48,8],[-89,-44,13],[-44,-59,10],[-68,-39,5]])line(p.x+dx,p.y+dy,p.x+dx+w,p.y+dy,0xf0f0c2,1,.8);
 for(let i=0;i<48;i++){const a=random()*Math.PI*2,wobble=pondRadius(a),x=p.x+Math.cos(a)*(p.rx+5)*wobble,y=p.y+Math.sin(a)*(p.ry+5)*wobble;if(x<500&&y<420)continue;tuft(x,y,.8);if(i%5===0)rock(x,y,.3);}
 for(const [x,y]of [[570,443],[731,480],[620,540]]){oval(x+2,y+2,18,8,0x345e52);oval(x,y,16,7,0x7b9a64);line(x-5,y,x+4,y,0xa1b27e);oval(x+3,y-3,5,4,0xe2cfb1);}
 for(let i=0;i<17;i++){const x=557+i*6,y=358-Math.sin(i*.3)*5;line(x,y,x-2,y-17,0x4c6945);rect(x-3,y-21,2,7,0x735e3d);}
 const d=layout.dock;oval(d.x+34,d.y+27,76,17,0x2f5047,.35);rect(d.x,d.y,d.w,d.h,0x5f503c);for(let x=d.x+2;x<d.x+d.w;x+=8){rect(x,d.y+2,6,d.h-4,0xa18a61);line(x+2,d.y+5,x+2,d.y+d.h-6,0xc0ab7a);rect(x+2,d.y+4,1,1,0x4a4a3a);}for(const x of [d.x,d.x+d.w-5]){rect(x,d.y-5,5,11,0x735337);rect(x,d.y+d.h-6,5,11,0x735337);rect(x,d.y-5,5,2,0xc2aa78);}
 for(const b of layout.beds){rect(b.x,b.y,b.w,b.h,0x655638);rect(b.x+2,b.y+2,b.w-4,b.h-4,0x846846);for(let y=b.y+6;y<b.y+b.h-3;y+=5){line(b.x+4,y,b.x+b.w-4,y,0x5f4d36);line(b.x+4,y+1,b.x+b.w-4,y+1,0xa08055);}rect(b.x,b.y,b.w,2,0xb29a6b);}
 for(const item of activeDebris(clearing,garden).filter(d=>d.kind==='rock'))rock(item.x,item.y,item.scale);
 // Clearly legible fallen branches, with bark, cut ends and ground shadows.
 for(const {x,y}of activeDebris(clearing,garden).filter(d=>d.kind==='branch')){line(x-16,y+4,x+18,y+1,0x364b35,7,.24);line(x-16,y,x+18,y-3,0x574431,5);line(x-16,y-1,x+18,y-4,0xa08354,2);line(x+2,y-2,x+9,y-12,0x70573b,3);oval(x-16,y,4,5,0xc0a477);tuft(x+18,y+3,.8);}
 const fence=(x:number,y:number,count:number)=>{for(let i=0;i<count;i++){rect(x+i*25,y+8,25,4,0x9b8560);rect(x+i*25,y+18,25,3,0x796c4d);line(x+i*25,y+8,x+(i+1)*25,y+8,0xbca77a);}for(let i=0;i<=count;i++){poly([x+i*25,y+28,x+i*25,y+2,x+i*25+2,y-1,x+i*25+5,y+2,x+i*25+5,y+28],0x6f6047);rect(x+i*25+1,y+3,2,23,0xac956b);}};
 fence(28,499,4);fence(211,515,9);fence(433,176,4);fence(691,221,3);rect(490,249,3,94,0x846c45);rect(498,249,3,94,0x9c8050);for(let y=249;y<=343;y+=23)rect(487,y,16,5,0x765f3e);rect(132,492,6,37,0x715436);rect(201,505,6,37,0x715436);rect(121,504,4,25,0x947348);
 for(let i=0;i<110;i++){const x=45+random()*710,y=275+random()*265;if(Math.abs(x-215)<65||x>480&&y>340||x>325&&x<495&&y<380)continue;tuft(x,y,.6+random()*.4);if(i%4===0){line(x,y-3,x,y-9,0x4e7149);oval(x,y-10,4,3,i%2?0xd9cfac:0xb5a5bd);}}
 for(const {x,y}of activeDebris(clearing,garden).filter(d=>d.kind==='weed')){oval(x+2,y+2,25,9,0x314c2b,.3);for(let i=-2;i<=2;i++){tuft(x+i*3,y-Math.abs(i),1.3);line(x+i*2,y,x+i*3,y-13+Math.abs(i),0x3d7137,2);}oval(x-4,y-9,6,3,0x78a844);oval(x+5,y-7,7,3,0x9cbd57);}
 if(birdhouse){const {x,y}=birdhouse;oval(x+4,y+3,23,8,0x31472f,.3);rect(x-1,y-22,3,25,0x725639);rect(x-8,y-34,17,16,0xc69c64);rect(x-7,y-32,3,13,0xdfb77a);poly([x-12,y-33,x,y-45,x+13,y-33,x+10,y-30,x,y-39,x-9,y-30],0x80523c);oval(x+1,y-27,7,7,0x304a3b);rect(x,y-21,3,2,0xe5c88c);}
 return g;
}
