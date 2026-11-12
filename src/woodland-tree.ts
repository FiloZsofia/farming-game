import {natureTreeClear} from './nature-resources';
import type Phaser from 'phaser';

// Original pixel drawing inspired by the supplied reference; no external asset is used.
// Logical pixels stay in the former tree envelope. Runs keep the static drawing small.
export function drawWoodlandTree(g:Phaser.GameObjects.Graphics,random:()=>number,x:number,y:number,kind:number,s=1){
 if(!natureTreeClear(x,y,s))return;
 let seed=0;
 if(kind!==2)for(let i=0;i<264;i++)seed=(seed+Math.floor(random()*65535))>>>0;
 const width=44,height=53,pixels=new Int32Array(width*height).fill(-1);
 const hash=(a:number,b:number)=>((Math.imul(a+seed,374761393)^Math.imul(b+17,668265263))>>>0);
 const put=(px:number,py:number,c:number)=>{const xx=Math.round(px/2)+22,yy=Math.round((py+100)/2);if(xx>=0&&xx<width&&yy>=0&&yy<height)pixels[yy*width+xx]=c;};
 const birch=kind===1;
 const bark=birch?[0x535b61,0x8794a3,0xc7cec7,0xe0dfc8]:[0x49382b,0x6d4c30,0x927044,0xad8956];
 // Roots, taper and forked branches are visible between the leaf masses.
 for(let py=-55;py<=4;py+=2)for(let px=-8;px<=8;px+=2){
  const root=py>0?8:py> -5?6:4;
  if(Math.abs(px)>root)continue;
  const h=hash(Math.floor(px/3),Math.floor(py/7));
  let c=bark[px< -2?0:px<1?2:1];if(h%9===0)c=bark[3];
  if(birch&&Math.floor((py+3)/8)%3===0&&px> -2)c=bark[0];
  put(px,py,c);
 }
 for(const side of [-1,1])for(let j=0;j<18;j++){
  const px=side*j*.9,py=-25-j*1.4;
  put(px,py,bark[1]);put(px-2,py,bark[birch?2:2]);
 }
 if(kind===2){
  const palette=[0x193d2e,0x28553a,0x386a43,0x4c7b4b,0x648b55];
  // Broken, drooping branch tiers, rather than separate triangular plates.
  for(let tier=0;tier<6;tier++){
   const top=-96+tier*11,half=8+tier*5;
   for(let py=top;py<=top+26;py+=2)for(let px=-half;px<=half;px+=2){
    const t=(py-top)/26,edge=half*t+(hash(Math.floor(py/4),tier)%3-1)*1.4;
    if(Math.abs(px)>edge)continue;
    const branch=Math.floor((px+half)/6),ripple=(branch%2)*3;
    const shade=py>top+21-ripple?0:px<0?2:1;
    const needle=hash(Math.floor(px/4),Math.floor(py/4)+tier)%7;
    put(px,py,palette[Math.min(4,shade+(needle===0?2:needle<3?1:0))]);
   }
  }
 }else{
  const palette=birch?[0x234b3d,0x346b4f,0x47865e,0x62a16e,0x80b37b]:[0x233f2c,0x345b36,0x4d7943,0x68904e,0x8ba65f];
  const lobes=birch?[
   [-19,-72,17,19],[7,-78,20,18],[24,-62,16,21],[-24,-48,17,16],[0,-57,17,20],
   [19,-38,18,17],[-17,-29,17,14],[0,-32,19,17]
  ]:[[-19,-63,19,23],[2,-77,23,19],[24,-62,16,21],[-23,-40,18,17],[2,-53,24,23],[23,-35,16,16],[-8,-30,24,15]];
  for(let l=0;l<lobes.length;l++){
   const [cx,cy,rx,ry]=lobes[l];
   for(let py=cy-ry;py<=cy+ry;py+=2)for(let px=cx-rx;px<=cx+rx;px+=2){
    const dx=(px-cx)/rx,dy=(py-cy)/ry,a=Math.atan2(dy,dx);
    const boundary=1+Math.sin(a*7+l)*.065+Math.sin(a*11-l)*.035;
    const radius=dx*dx+dy*dy;if(radius>boundary)continue;
    const blockX=Math.floor(px/5),blockY=Math.floor(py/4),h=hash(blockX+l*7,blockY);
    // Connected light shapes sit above recessed lower/right leaf folds.
    let shade=dy>.48||dx>.7?1:dy<-.2&&dx<.4?3:2;
    if(radius>.78)shade=Math.max(0,shade-1);
    const leafX=((px%5)+5)%5,leafY=((py%4)+4)%4;
    if(h%5===0&&leafX<4&&leafY<2)shade=Math.min(4,shade+1);
    else if(h%4===0&&leafY>1)shade=Math.max(0,shade-1);
    put(px,py,palette[shade]);
   }
  }
 }
 g.fillStyle(0x294d3a,.25).fillEllipse(x+10*s,y+8*s,67*s,22*s);
 for(let row=0;row<height;row++)for(let col=0;col<width;){
  const color=pixels[row*width+col];let end=col+1;while(end<width&&pixels[row*width+end]===color)end++;
  if(color!==-1)g.fillStyle(color).fillRect(x+(col-22)*2*s,y+(row*2-100)*s,(end-col)*2*s,2*s);
  col=end;
 }
}
