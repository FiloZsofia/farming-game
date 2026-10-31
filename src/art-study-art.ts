import type Phaser from 'phaser';
import {studyPlants,studyTrees} from './art-study-layout';
export const studyPalette=new Map<number,number>([
 [0x759c48,0x729578],[0x536b3d,0x436b5e],[0x718b4e,0x699173],[0x9ca76a,0x99ad80],
 [0x354f3b,0x294c50],[0x506d45,0x3d7167],[0x6f8751,0x64947a],[0x819559,0x87a587],[0x405e3e,0x365b60],
 [0x738354,0x4b6d61],[0xa5936c,0x918c76],[0xc1ae85,0xb8ae91],[0x9f916e,0x96917d],[0xd6c29a,0xd6c6a7],
 [0x566c48,0x3e6860],[0x8c9a67,0x719786],[0x354d3b,0x2d4f51],[0x817b68,0x6e7977],[0xaaa18a,0x9ca397],[0x99947e,0x858f89],
 [0x604e3d,0x4d454b],[0x9b654b,0x94705c],[0x704937,0x654f4b],[0xb37e58,0xb69270],
 [0xc3b17b,0xe9c18a],[0xa4916c,0x919182],[0x625640,0x52615d],[0xc0a77b,0xb5b397],
 [0x246c7c,0x315b70],[0x288b98,0x3b7886],[0x42a5a7,0x649794],[0x62794f,0x4b7366],[0xaeaa82,0x9aa58d],
]);
export const studyColor=(color:number)=>studyPalette.get(color)??color;
const snap=(v:number)=>Math.round(v/2)*2;
// Rows of solid two-pixel blocks form deliberate stepped edges, never blurry washes.
function leafMass(g:Phaser.GameObjects.Graphics,x:number,y:number,w:number,h:number,color:number){
 g.fillStyle(color);for(let row=-h;row<=h;row+=2){const span=snap(w*Math.sqrt(Math.max(0,1-(row/h)**2)));g.fillRect(snap(x)-span,snap(y+row),span*2,2);}
}
export function drawStudyTree(g:Phaser.GameObjects.Graphics,x:number,y:number,s=1){
 g.fillStyle(0x47545e,.35).fillRect(snap(x-22*s),snap(y+12*s),58*s,8*s);
 g.fillStyle(0x514649).fillRect(snap(x-4*s),snap(y-35*s),8*s,58*s);g.fillStyle(0x8a7768).fillRect(snap(x-2*s),snap(y-25*s),2*s,44*s);
 for(const [dx,dy,w,h]of [[-26,-28,22,19],[-12,-48,22,18],[12,-49,21,20],[30,-28,21,21],[-7,-25,26,23],[15,-12,22,17],[-28,-10,18,16]]){
  leafMass(g,x+dx*s,y+dy*s,w*s,h*s,0x294c50);leafMass(g,x+(dx-2)*s,y+(dy-4)*s,w*s*.88,h*s*.72,0x42776d);
 }
 let seed=Math.abs(Math.round(x*19+y*43));const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 for(let i=0;i<130;i++){
  const dx=(random()*2-1)*43,dy=-55+random()*55;
  if(((dx+2)/42)**2+((dy+29)/31)**2>1)continue;
  const xx=snap(x+dx*s),yy=snap(y+dy*s);g.fillStyle(dx+dy< -15?(i%3?0x719a7e:0x94ac8b):(i%3?0x365d60:0x625f76)).fillRect(xx,yy,(i%3+1)*2,2);
  if(i%4===0)g.fillRect(xx+2,yy-2,2,2);
 }

}
export function drawStudyGrass(g:Phaser.GameObjects.Graphics,left:number,top:number,width:number,height:number,random:()=>number){
 g.fillStyle(0x729578).fillRect(left,top,width,height);
 for(let i=0;i<3300;i++){
  const x=snap(left+random()*width),y=snap(top+random()*height);g.fillStyle([0x688c73,0x7b9b7a,0x87a383][i%3]).fillRect(x,y,i%6===0?8:4,2);
  if(i%13===0){g.fillStyle(0x4d7464).fillRect(x,y-4,2,6).fillRect(x-2,y-2,2,2);g.fillStyle(0x9eb08a).fillRect(x+2,y-2,2,4);}
 }
}
export function drawStudyBorders(g:Phaser.GameObjects.Graphics){
 for(const p of [...studyPlants,...studyTrees.map(t=>({...t,kind:'tree' as const}))].sort((a,b)=>a.y-b.y)){
  if(p.kind==='tree'){drawStudyTree(g,p.x,p.y,p.size);continue;}
  const {x,y,size:r}=p;g.fillStyle(0x53616c,.4).fillRect(snap(x-r),snap(y+3),r*2,4);
  if(p.kind==='fern'){
   for(let side=-1;side<=1;side+=2)for(let i=0;i<5;i++){const xx=snap(x+side*i*3),yy=snap(y-i*2);g.fillStyle(i%2?0x507b6b:0x73937b).fillRect(xx,yy,6,2).fillRect(xx+side*2,yy-2,4,2);}g.fillStyle(0x9eae85).fillRect(snap(x),snap(y-12),2,14);continue;
  }
  if(p.kind==='spike'){
   for(let i=0;i<3;i++){const xx=snap(x+(i-1)*5),yy=snap(y-12-i%2*6);g.fillStyle(0x3d6a5e).fillRect(xx,yy,2,y-yy);g.fillStyle(0x796985).fillRect(xx-2,yy-5,6,8);g.fillStyle(0xb0a0b8).fillRect(xx-2,yy-5,2,4);}continue;
  }
  for(const [dx,dy,k]of [[-.5,-.2,.65],[.35,-.3,.7],[0,-.65,.7],[0,0,.75]]){
   leafMass(g,x+dx*r,y+dy*r,r*k,r*k*.9,0x2c5356);leafMass(g,x+(dx-.06)*r,y+(dy-.16)*r,r*k*.85,r*k*.66,0x467b6c);leafMass(g,x+(dx-.22)*r,y+(dy-.32)*r,r*k*.43,r*k*.3,0x73977d);
  }
  // Offset upright leaf fans, with a dark crease, distinguish shrubs from rocks.
  for(let i=0;i<7;i++){
   const xx=snap(x+(i-3)*r*.22),yy=snap(y-r*(.15+((i*3+p.x)%5)*.12));
   g.fillStyle(i%2?0x75a186:0x528775).fillRect(xx,yy-10,4,10).fillRect(xx-2,yy-6,8,6).fillRect(xx-4,yy-2,10,4);
   g.fillStyle(0x315b59).fillRect(xx+2,yy-6,2,8);g.fillStyle(0x9bb296).fillRect(xx,yy-10,2,4);
  }
  // A few lilac shadow pixels give cool depth without a purple screen filter.
  g.fillStyle(0x68657a).fillRect(snap(x+r*.5),snap(y),4,2).fillRect(snap(x+r*.4),snap(y-2),2,2);
 }
}
