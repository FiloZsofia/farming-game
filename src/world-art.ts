import Phaser from 'phaser';
import {pondRadius} from './pond-shape';
import {activeDebris,createClearing,type Clearing} from './cleanup';
import {createGarden,type Garden} from './gardening';
import {farmLayout as layout,farmBounds} from './layout';

// Original procedural artwork. World anchors stay shared with interaction/collision.
export function drawFarm(scene:Phaser.Scene,clearing:Clearing=createClearing(),garden:Garden=createGarden(),birdhouse:{x:number;y:number}|null=null){
 let g=scene.add.graphics();const ground=g;
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
 const {left,top,right,bottom}=farmBounds,width=right-left,height=bottom-top;
 rect(left,top,width,height,0x759c48);
 for(let i=0;i<480;i++)oval(left+random()*width,top+random()*height,35+random()*70,15+random()*35,i%2?0x5b873c:0x9eb45c,.13);
 for(let i=0;i<12500;i++){const x=left+random()*width,y=top+random()*height;rect(x,y,1+random()*2,1,[0x658b3f,0xb0bf71,0x82a851][i%3],.55);if(i%10===0)tuft(x,y,.35);}
 const pathStroke=(width:number,color:number)=>{for(const p of layout.paths){g.lineStyle(p.width+width,color);g.beginPath();p.points.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.strokePath();for(const [x,y]of p.points)oval(x,y,p.width+width,p.width+width,color);}};
 pathStroke(5,0x738354);pathStroke(1,0xa5936c);pathStroke(-3,0xc1ae85);
 // Texture follows the paths rather than spilling over their edges.
 for(const p of layout.paths)for(let i=1;i<p.points.length;i++){const [ax,ay]=p.points[i-1],[bx,by]=p.points[i],length=Math.hypot(bx-ax,by-ay);for(let j=0;j<length;j+=3){const t=j/length,offset=(random()-.5)*(p.width-7);rect(ax+(bx-ax)*t-(by-ay)/length*offset,ay+(by-ay)*t+(bx-ax)/length*offset,2,1,j%2?0x9f916e:0xd6c29a,.7);}}
 // Boundary trees leave the usable centre and paths open.
 for(let i=0;i<50;i++){const x=left+random()*width,y=top+random()*height;if(y<top+35||x<left+30||x>right-30)tree(x,y,.8+random()*.35);}
 for(let x=left+20;x<right;x+=48)tree(x,top+10,.85+random()*.2);
 for(let y=top+50;y<bottom-20;y+=58){tree(left+7,y,.9);tree(right-6,y,.9);}
 const fixtures=scene.add.graphics().setDepth(-.7);g=fixtures;
 // Porch journal: a real open book on a small writing desk, with a ribbon and pen.
 const j=layout.journal;
 oval(j.x+11,j.y+15,31,7,0x283c2e,.3);
 for(const x of [j.x-2,j.x+21]){rect(x,j.y+8,3,13,0x523e2c);rect(x,j.y+9,1,10,0xb59460);}
 poly([j.x-4,j.y+1,j.x+20,j.y+1,j.x+25,j.y+8,j.x+1,j.y+8],0xbaa074);
 rect(j.x-4,j.y+8,29,3,0x6c4c33);line(j.x-2,j.y+8,j.x+23,j.y+8,0xe0bf86);
 // Dark leather cover peeks out around the warm, individually shaded pages.
 poly([j.x-1,j.y,j.x+8,j.y-2,j.x+18,j.y,j.x+19,j.y+9,j.x+9,j.y+8,j.x,j.y+10],0x714634);
 poly([j.x,j.y,j.x+8,j.y-1,j.x+9,j.y+7,j.x+1,j.y+8],0xffedc0);
 poly([j.x+9,j.y-1,j.x+17,j.y,j.x+18,j.y+7,j.x+10,j.y+7],0xe6cea0);
 line(j.x+8,j.y,j.x+9,j.y+7,0x9c7950);
 for(let y=2;y<=5;y+=2){line(j.x+2,j.y+y,j.x+6,j.y+y-1,0xb9a67f);line(j.x+11,j.y+y-1,j.x+15,j.y+y,0xb09b74);}
 poly([j.x+11,j.y+5,j.x+13,j.y+5,j.x+14,j.y+12,j.x+12,j.y+11,j.x+11,j.y+12],0xad5a4a);
 line(j.x+21,j.y+2,j.x+24,j.y+6,0x374d4c,1.5);rect(j.x+20,j.y+1,2,2,0xe8d2a2);
 // Shipping crate: open dark interior, thick rim, separate front/side boards and ironwork.
 const box=layout.shipping,x=box.x,y=box.y;
 oval(x+18,y+25,41,11,0x273c32,.3);
 poly([x,y+5,x+25,y+2,x+32,y+8,x+32,y+23,x+7,y+27,x,y+21],0x4a382a);
 poly([x+25,y+5,x+32,y+9,x+32,y+23,x+25,y+20],0x745133);
 poly([x+2,y+7,x+24,y+4,x+29,y+8,x+7,y+11],0x302e23);
 line(x+1,y+5,x+25,y+2,0xe3bd7d,3);line(x+25,y+2,x+32,y+8,0xa58352,3);
 poly([x+1,y+9,x+26,y+7,x+26,y+24,x+1,y+23],0xae7f49);
 for(let row=0;row<3;row++){line(x+3,y+12+row*5,x+24,y+10+row*5,0x6e4e31);line(x+4,y+13+row*5,x+23,y+11+row*5,0xc49b61);}
 line(x+1,y+9,x+26,y+7,0xf0cd8c,2);line(x+26,y+7,x+32,y+8,0xc5a16a,2);
 for(const dx of [2,23]){rect(x+dx,y+9,2,14,0x52605a);rect(x+dx,y+10,1,2,0xc1c2a5);rect(x+dx,y+20,1,2,0xc1c2a5);}
 // Cut-out side handle and a small produce emblem identify this as the harvest crate.
 line(x+28,y+13,x+30,y+14,0x302c24,2);
 rect(x+9,y+13,11,8,0xf0dfb0);line(x+10,y+20,x+18,y+20,0xbda16d);
 oval(x+14,y+17,5,4,0xba6054);line(x+14,y+15,x+12,y+12,0x527346,1.5);line(x+14,y+15,x+17,y+12,0x527346,1.5);
 // Seed catalogue: an upright green illustrated cover, cream page edges and wooden stand.
 const c=layout.catalog;
 oval(c.x+9,c.y+14,30,6,0x283c2e,.25);
 rect(c.x-3,c.y+11,3,9,0x684b32);rect(c.x+19,c.y+11,3,9,0x684b32);
 poly([c.x-5,c.y+10,c.x+19,c.y+8,c.x+25,c.y+14,c.x-1,c.y+16],0xa78552);
 line(c.x-4,c.y+11,c.x+19,c.y+9,0xd6b47a);
 poly([c.x-2,c.y-5,c.x+17,c.y-5,c.x+20,c.y+10,c.x,c.y+12],0x294b3e);
 poly([c.x+1,c.y-5,c.x+17,c.y-5,c.x+19,c.y+9,c.x+3,c.y+11],0x6b8b55);
 line(c.x+1,c.y-4,c.x+3,c.y+10,0xb9bf83);
 line(c.x+4,c.y+11,c.x+19,c.y+9,0xe8d9b0,2);
 poly([c.x+5,c.y-2,c.x+14,c.y-2,c.x+16,c.y+6,c.x+6,c.y+7],0xf2e4bd);
 line(c.x+11,c.y+5,c.x+10,c.y,0x597847);
 oval(c.x+8,c.y+1,4,2,0x6c9651);oval(c.x+12,c.y,4,2,0x81a75a);
 rect(c.x+7,c.y+8,6,1,0xe4cb88);
 const m=layout.mailbox;rect(m.x+10,m.y+m.h,5,20,0x80613e);rect(m.x,m.y,m.w,m.h,0x536e72);rect(m.x+2,m.y+2,m.w-4,4,0x94a7a2);rect(m.x+8,m.y+9,8,2,0x273f40);
 g=ground;
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
 for(const b of layout.beds){
  // Taller timber sides and a broader soil lip keep existing crop tiles in place.
  oval(b.x+b.w/2+3,b.y+b.h+7,b.w+16,12,0x30412d,.24);
  rect(b.x-2,b.y,b.w+10,b.h+8,0x795b38);rect(b.x,b.y+2,b.w+6,b.h-2,0x846846);
  for(let y=b.y+6;y<b.y+b.h-3;y+=5){line(b.x+4,y,b.x+b.w+2,y,0x5f4d36);line(b.x+4,y+1,b.x+b.w+2,y+1,0xa08055);}
  rect(b.x-3,b.y,b.w+12,3,0xc0a479);rect(b.x-3,b.y+3,3,b.h+4,0xa38458);rect(b.x+b.w+6,b.y+2,3,b.h+6,0x695135);
  rect(b.x-2,b.y+b.h,b.w+10,8,0x946e43);line(b.x,b.y+b.h+2,b.x+b.w+6,b.y+b.h+2,0xc09a64);line(b.x,b.y+b.h+6,b.x+b.w+6,b.y+b.h+6,0x674f34);
  for(const x of [b.x+1,b.x+b.w+4]){rect(x,b.y+b.h+2,1,3,0x454d3a);}
 }

 // Clearly legible fallen branches, with bark, cut ends and ground shadows.
 const fence=(x:number,y:number,count:number)=>{for(let i=0;i<count;i++){rect(x+i*25,y+8,25,4,0x9b8560);rect(x+i*25,y+18,25,3,0x796c4d);line(x+i*25,y+8,x+(i+1)*25,y+8,0xbca77a);}for(let i=0;i<=count;i++){poly([x+i*25,y+28,x+i*25,y+2,x+i*25+2,y-1,x+i*25+5,y+2,x+i*25+5,y+28],0x6f6047);rect(x+i*25+1,y+3,2,23,0xac956b);}};
 fence(28,499,4);fence(211,515,9);fence(433,176,4);fence(691,221,3);rect(132,492,6,37,0x715436);rect(201,505,6,37,0x715436);rect(121,504,4,25,0x947348);
 for(let i=0;i<110;i++){const x=45+random()*710,y=275+random()*265;if(Math.abs(x-215)<65||x>480&&y>340||x>325&&x<495&&y<380)continue;tuft(x,y,.6+random()*.4);if(i%4===0){line(x,y-3,x,y-9,0x4e7149);oval(x,y-10,4,3,i%2?0xd9cfac:0xb5a5bd);}}
 // Bake the static landscape once; its thousands of marks become one draw per frame.
 const terrain=scene.add.renderTexture(left,top,width,height).setOrigin(0).setDepth(-1);
 terrain.draw(ground,-left,-top);ground.destroy();terrain.setVisible(false);
 const landscape=scene.add.renderTexture(left,top,width,height).setOrigin(0).setDepth(-1);
 const clutter=scene.add.graphics().setVisible(false);
 const redraw=(clearing:Clearing,garden:Garden,birdhouse:{x:number;y:number}|null)=>{g=clutter;clutter.clear();
 for(const item of activeDebris(clearing,garden).filter(d=>d.kind==='rock'))rock(item.x,item.y,item.scale);
 for(const {x,y}of activeDebris(clearing,garden).filter(d=>d.kind==='branch')){line(x-16,y+4,x+18,y+1,0x364b35,7,.24);line(x-16,y,x+18,y-3,0x574431,5);line(x-16,y-1,x+18,y-4,0xa08354,2);line(x+2,y-2,x+9,y-12,0x70573b,3);oval(x-16,y,4,5,0xc0a477);tuft(x+18,y+3,.8);}
 for(const {x,y}of activeDebris(clearing,garden).filter(d=>d.kind==='weed')){oval(x+2,y+2,25,9,0x314c2b,.3);for(let i=-2;i<=2;i++){tuft(x+i*3,y-Math.abs(i),1.3);line(x+i*2,y,x+i*3,y-13+Math.abs(i),0x3d7137,2);}oval(x-4,y-9,6,3,0x78a844);oval(x+5,y-7,7,3,0x9cbd57);}
 if(birdhouse){const {x,y}=birdhouse;oval(x+4,y+3,23,8,0x31472f,.3);rect(x-1,y-22,3,25,0x725639);rect(x-8,y-34,17,16,0xc69c64);rect(x-7,y-32,3,13,0xdfb77a);poly([x-12,y-33,x,y-45,x+13,y-33,x+10,y-30,x,y-39,x-9,y-30],0x80523c);oval(x+1,y-27,7,7,0x304a3b);rect(x,y-21,3,2,0xe5c88c);}
  landscape.clear().draw(terrain,0,0).draw(clutter,-left,-top);clutter.clear();
 };
 redraw(clearing,garden,birdhouse);
 return {redraw,destroy(){landscape.destroy();terrain.destroy();clutter.destroy();fixtures.destroy();}};
}
