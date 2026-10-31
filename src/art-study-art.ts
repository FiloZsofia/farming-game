import {farmLayout} from './layout';
import {pondRadius} from './pond-shape';
import type Phaser from 'phaser';
import {studyPlants,studyTrees} from './art-study-layout';
// A restrained extension of the live game's warm palette, not a global colour filter.
export const studyPalette=new Map<number,number>([
 [0x759c48,0x7f9c58],[0x536b3d,0x496b45],[0x718b4e,0x789254],[0x9ca76a,0xa4b779],
 [0x354f3b,0x35584b],[0x506d45,0x52794f],[0x6f8751,0x819b5d],[0x819559,0x9db371],[0x405e3e,0x436650],
 [0x738354,0x71835b],[0xa5936c,0xa28f6c],[0xc1ae85,0xc9b68e],[0x9f916e,0xaf9c75],[0xd6c29a,0xdfcba3],
 [0x566c48,0x50714f],[0x8c9a67,0x98a979],[0x354d3b,0x3c5847],[0x817b68,0x7f8172],
 [0x604e3d,0x614b3d],[0x9b654b,0xa76f51],[0x704937,0x764e3a],[0xb37e58,0xc39468],
 [0xc3b17b,0xe8c58b],[0x246c7c,0x2e7480],[0x288b98,0x3696a0],[0x42a5a7,0x58afb0],
]);
export const studyColor=(color:number)=>studyPalette.get(color)??color;
const rng=(seed:number)=>()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
function polygon(g:Phaser.GameObjects.Graphics,points:{x:number;y:number}[],color:number){g.fillStyle(color).fillPoints(points,true);}
// Pointed leaves have a midrib and a lit half; their shape stays legible when moving.
function leaf(g:Phaser.GameObjects.Graphics,x:number,y:number,length:number,width:number,angle:number,color:number,light:number){
 const dx=Math.cos(angle),dy=Math.sin(angle),p=(a:number,b:number)=>({x:x+dx*a-dy*b,y:y+dy*a+dx*b});
 polygon(g,[p(0,0),p(length*.25,-width*.4),p(length*.65,-width*.5),p(length,0),p(length*.65,width*.5),p(length*.25,width*.4)],color);
 polygon(g,[p(0,0),p(length*.4,-width*.55),p(length,0),p(length*.5,0)],light);
}
function twig(g:Phaser.GameObjects.Graphics,x:number,y:number,dx:number,dy:number,size:number,light:boolean){
 g.lineStyle(.7,0x655e40).lineBetween(x,y,x+dx,y+dy);
 for(let i=1;i<=4;i++){const t=i/4,xx=x+dx*t,yy=y+dy*t,angle=Math.atan2(dy,dx);leaf(g,xx,yy,size*(1-t*.35),size*.48,angle-.65,0x476e49,light?0xa5b971:0x74965d);if(i<4)leaf(g,xx,yy,size*.8,size*.4,angle+.85,0x50794e,light?0x94af69:0x6e9060);}
}
export function drawStudyTree(g:Phaser.GameObjects.Graphics,x:number,y:number,s=1){
 const random=rng(Math.abs(Math.round(x*31+y*17))+43);
 g.fillStyle(0x324c40,.2).fillEllipse(x+10*s,y+11*s,83*s,20*s);
 polygon(g,[{x:x-5*s,y:y+18*s},{x:x-3*s,y:y-45*s},{x:x+4*s,y:y-52*s},{x:x+6*s,y:y+16*s},{x:x+12*s,y:y+20*s},{x:x+1*s,y:y+18*s},{x:x-10*s,y:y+22*s}],0x66523e);
 g.lineStyle(1.5*s,0xa0875e).lineBetween(x-1*s,y+15*s,x,y-42*s);
 for(const side of [-1,1]){g.lineStyle(4*s,0x66523e).lineBetween(x,y-15*s,x+side*29*s,y-44*s);g.lineStyle(s,0x937c54).lineBetween(x,y-18*s,x+side*25*s,y-43*s);}
 // Overlapping irregular clusters replace the previous stepped circular crowns.
 for(const [dx,dy,w,h]of [[-30,-33,26,19],[-16,-55,26,22],[13,-58,26,20],[33,-37,25,21],[-9,-33,30,23],[15,-20,25,17]]){
  const xx=x+dx*s,yy=y+dy*s;polygon(g,[{x:xx-w*s,y:yy},{x:xx-w*.8*s,y:yy-h*.65*s},{x:xx-w*.2*s,y:yy-h*s},{x:xx+w*.55*s,y:yy-h*.85*s},{x:xx+w*s,y:yy-h*.15*s},{x:xx+w*.75*s,y:yy+h*.65*s},{x:xx-w*.35*s,y:yy+h*.85*s}],0x35594b);
  polygon(g,[{x:xx-w*.87*s,y:yy-h*.1*s},{x:xx-w*.45*s,y:yy-h*.7*s},{x:xx+w*.1*s,y:yy-h*.8*s},{x:xx+w*.65*s,y:yy-h*.35*s},{x:xx+w*.35*s,y:yy+h*.2*s},{x:xx-w*.45*s,y:yy+h*.15*s}],0x5c8352);
  for(let i=0;i<32;i++){const a=random()*Math.PI*2,r=Math.sqrt(random()),lx=xx+Math.cos(a)*w*s*r,ly=yy+Math.sin(a)*h*s*r;leaf(g,lx,ly,(3+random()*3)*s,(2+random()*1.5)*s,-2.9+random()*2.2,0x577f50,ly<yy?0x9db36c:0x789957);}
 }
}
export function drawStudyGrass(g:Phaser.GameObjects.Graphics,left:number,top:number,width:number,height:number,random:()=>number){
 g.fillStyle(0x7f9c58).fillRect(left,top,width,height);
 // Fine, sparse blade marks; no enlarged pixels or broad mottled paint patches.
 for(let i=0;i<5500;i++){
  const x=left+random()*width,y=top+random()*height;g.lineStyle(.55,[0x71934e,0x91a966,0xabc17c][i%3],.65).lineBetween(x,y,x+1.5,y-.5);
  if(i%17===0){g.lineStyle(.65,0x587c46).lineBetween(x,y,x-1,y-3.5).lineBetween(x,y,x+2,y-2.5);g.lineStyle(.5,0xaac07c).lineBetween(x+1,y,x+1,y-4);}
 }
}
function fern(g:Phaser.GameObjects.Graphics,x:number,y:number,r:number){
 for(let i=0;i<7;i++){
  const angle=-Math.PI*.94+i*Math.PI*.145,len=r*(i%2?.9:1.15);let last={x,y};
  for(let k=1;k<=7;k++){const t=k/7,xx=x+Math.cos(angle)*len*t,yy=y+Math.sin(angle)*len*t+len*.23*t*t;g.lineStyle(.55,0x6d8d50).lineBetween(last.x,last.y,xx,yy);const w=(1-t)*5+.4;leaf(g,xx,yy,w*1.8,w*.55,angle-1.1,0x315b48,0x6f9158);leaf(g,xx,yy,w*1.7,w*.5,angle+1.1,0x3d6b4d,0x86a366);last={x:xx,y:yy};}
 }
}
function shrub(g:Phaser.GameObjects.Graphics,x:number,y:number,r:number,airy:boolean){
 const random=rng(Math.abs(Math.round(x*41+y*83))+79);
 if(!airy){for(const [dx,dy,w,h]of [[-.5,-.25,.65,.5],[.4,-.3,.65,.6],[0,-.65,.7,.5],[0,0,.7,.3]])g.fillStyle(0x365d48).fillEllipse(x+dx*r,y+dy*r,w*r*2,h*r*2);}
 for(let i=0;i<(airy?9:13);i++){
  const a=-Math.PI*.94+random()*Math.PI*.9,len=r*(.65+random()*.65),dx=Math.cos(a)*len,dy=Math.sin(a)*len;
  twig(g,x+(random()-.5)*r*.55,y,dx,dy,airy?6.5:7.5,i%3===0);
 }
}
function sedge(g:Phaser.GameObjects.Graphics,x:number,y:number,r:number){
 for(let i=0;i<13;i++){const dx=(i-6)*r*.12,h=r*(.65+(i*7%9)/12);polygon(g,[{x:x+(i-6)*.5,y},{x:x+dx,y:y-h},{x:x+dx*.45+1,y:y-h*.45}],i%3?0x56784b:0x8da564);g.lineStyle(.45,0xb4bd7d).lineBetween(x+(i-6)*.5,y,x+dx,y-h);}
}
function rock(g:Phaser.GameObjects.Graphics,x:number,y:number,r:number){
 polygon(g,[{x:x-r,y},{x:x-r*.7,y:y-r*.55},{x:x-r*.15,y:y-r*.8},{x:x+r*.7,y:y-r*.6},{x:x+r,y:y-r*.1},{x:x+r*.6,y:y+r*.2},{x:x-r*.6,y:y+r*.2}],0x788478);
 polygon(g,[{x:x-r*.7,y:y-r*.55},{x:x-r*.15,y:y-r*.8},{x:x+r*.7,y:y-r*.6},{x:x+r*.35,y:y-r*.1},{x:x-r*.4,y:y-r*.2}],0xb4b8a2);g.lineStyle(.7,0x596957).lineBetween(x-r*.15,y-r*.75,x-r*.3,y);
 for(let i=0;i<5;i++)g.fillStyle(i%2?0x6f8950:0x8ea15d).fillEllipse(x-r*.7+i*r*.32,y+(i%2?1:-2),r*.5,r*.2);
}
export function drawStudyBorders(g:Phaser.GameObjects.Graphics){
 // Narrow bank plants follow the existing irregular shoreline, clear of the dock.
 const pond=farmLayout.pond;for(const angle of [-1.85,-1.5,-1.1,-.7,-.2,.4,.9]){const wobble=pondRadius(angle),x=pond.x+Math.cos(angle)*(pond.rx+9)*wobble,y=pond.y+Math.sin(angle)*(pond.ry+9)*wobble;sedge(g,x,y,15+Math.cos(angle*7)*4);}

 for(const p of [...studyPlants,...studyTrees.map(t=>({...t,kind:'tree' as const}))].sort((a,b)=>a.y-b.y)){
  if(p.kind==='tree'){drawStudyTree(g,p.x,p.y,p.size);continue;}
  const {x,y,size:r}=p;g.fillStyle(0x304d3b,.18).fillEllipse(x+3,y+3,r*2.3,r*.5);
  if(p.kind==='fern')fern(g,x,y,r);else if(p.kind==='sedge')sedge(g,x,y,r);else if(p.kind==='rock'){rock(g,x,y,r);fern(g,x-r*.8,y+2,r*.65);}
  else if(p.kind==='spike'){for(let i=0;i<4;i++){const xx=x+(i-1.5)*4,yy=y-r*.7-(i%2)*5;g.lineStyle(.6,0x547848).lineBetween(xx,y,xx,yy);for(let j=0;j<3;j++){g.fillStyle(j%2?0x9a90af:0x7f7794).fillEllipse(xx+(j%2?1:-1),yy+j*3,3,4);}leaf(g,xx,y-5,7,2,-2,0x476f46,0x8aa363);}}
  else shrub(g,x,y,r,p.kind==='hazel');
 }
}
export function drawStudyVine(g:Phaser.GameObjects.Graphics,x:number,y:number,length:number){
 g.lineStyle(.65,0x5d7047).lineBetween(x,y,x+2,y+length);
 for(let i=0;i<length;i+=4){const side=i%8?-1:1;leaf(g,x+2*i/length,y+i,5,3,side>0?.5:2.8,0x4f7548,0x8ba365);}
}
export function drawStudyHouseDetails(g:Phaser.GameObjects.Graphics){
 for(const x of [134,337])drawStudyVine(g,x,193,18);
 for(const x of [164,323])drawStudyVine(g,x,196,13);
 for(const x of [134,175,295,336])for(const y of [163,184]){g.fillStyle(0x425344).fillRect(x,y,4,.8);g.fillStyle(0xd2c19c).fillCircle(x+1,y+.3,.35);}
 for(let i=0;i<25;i++){const x=i<12?134+i*3:310+(i-12)*2.4,y=210-(i*7%9);polygon(g,[{x,y},{x:x+2,y:y-2},{x:x+5,y:y-.5},{x:x+4,y:y+2},{x:x+1,y:y+1}],i%2?0xc6bc9e:0xb7ae92);}
 for(const [x,y]of [[148,122],[321,125],[304,94]])for(let i=0;i<8;i++){g.fillStyle(i%2?0x71834d:0x8b965d).fillEllipse(x+(i%4)*2.5,y-Math.floor(i/4)*2,4,1.7);}
 for(const y of [229,244,252]){g.lineStyle(.45,0x786044).strokeEllipse(185+(y%3)*20,y,5,1.7);g.lineStyle(.4,0xc7ac7d).lineBetween(183,y+1.5,199,y+1.5);}
}
