import {leafContour} from './foliage-leaf';
import {natureTreeClear} from './nature-resources';
import type Phaser from 'phaser';

// Hand-shaped original pixel silhouettes and leaf folds, using the user's image
// as a style reference. World anchors, size and shared random consumption stay fixed.
export function drawWoodlandTree(g:Phaser.GameObjects.Graphics,random:()=>number,x:number,y:number,kind:number,s=1){
 if(!natureTreeClear(x,y,s))return;
 let seed=0;if(kind!==2)for(let i=0;i<264;i++)seed=(seed+Math.floor(random()*65535))>>>0;
 const pixel=1,width=84,height=105,data=new Int32Array(width*height).fill(-1);
 const hash=(a:number,b:number)=>((Math.imul(a+seed,374761393)^Math.imul(b+19,668265263))>>>0);
 const put=(xx:number,yy:number,c:number)=>{const a=Math.round(xx/pixel)+42,b=Math.round((yy+99)/pixel);if(a>=0&&a<width&&b>=0&&b<height)data[b*width+a]=c;};
 const shape=(points:number[],color:number)=>{
  const ys=points.filter((_,i)=>i%2),min=Math.min(...ys),max=Math.max(...ys);
  for(let row=Math.ceil((min+99)/pixel);row<=Math.floor((max+99)/pixel);row++){
   const yy=row*pixel-99,cross:number[]=[];
   for(let i=0,j=points.length-2;i<points.length;j=i,i+=2){const ax=points[j],ay=points[j+1],bx=points[i],by=points[i+1];if((ay>yy)!==(by>yy))cross.push(ax+(yy-ay)*(bx-ax)/(by-ay));}
   cross.sort((a,b)=>a-b);
   for(let k=0;k+1<cross.length;k+=2)for(let col=Math.ceil(cross[k]/pixel);col<=Math.floor(cross[k+1]/pixel);col++)put(col*pixel,yy,color);
  }
 };
 const birch=kind===1;
 const bark=birch?[0x545566,0x878fa5,0xbcc5d1,0xdce0da]:[0x453224,0x69472e,0x926539,0xb08349];
 // Flared roots and a tapered trunk, with broad bark facets rather than dots.
 shape([-9,5,-8,0,-5,-5,-5,-49,-2,-58,4,-55,5,-7,8,-1,10,5],bark[0]);
 shape([-5,3,-3,-8,-3,-50,0,-56,2,-43,2,-7,5,3],bark[2]);
 shape([0,2,1,-20,0,-28,2,-34,2,-47,4,-42,4,-5,7,3],bark[1]);
 shape([-4,-4,-2,-10,-2,-25,0,-29,0,-20,-1,-15,0,-7,-1,3],bark[3]);
 if(kind!==2){
 shape([-2,-29,-12,-42,-18,-54,-14,-57,-8,-45,2,-36],bark[1]);
 shape([1,-38,11,-52,16,-65,19,-64,15,-49,4,-31],bark[2]);
 }
 for(let i=0;i<7;i++){
  const yy=-3-i*6;
  if(birch){const left=i%2?-3:0,right=i%2?0:3;shape([left,yy,right,yy-1.5,right,yy+1.5,left-1.5,yy+1.5],bark[0]);if(i%3===0)shape([-3,yy-3,-1.5,yy-3,-1.5,yy-1.5,-3,yy-1.5],bark[1]);}
  else shape([1,yy,3,yy-3,4,yy-2,3,yy+3,1,yy+4],i%2?bark[0]:bark[3]);
 }
 const palette=kind===2?[0x123624,0x19492b,0x235f32,0x2e773b,0x428b49]:birch?[0x174333,0x255d47,0x37825b,0x53a36d,0x6cb77e]:[0x183d28,0x245631,0x32783c,0x45964b,0x64a95a];
 if(kind===2){
  // A single stepped outline with long irregular, downturned branch fans.
  shape([0,-98,3,-92,3,-86,7,-83,8,-76,14,-72,13,-69,21,-65,16,-63,11,-64,16,-58,23,-54,20,-51,28,-48,23,-46,18,-47,24,-40,32,-36,27,-33,22,-34,30,-27,38,-23,33,-20,25,-21,31,-15,19,-14,10,-15,3,-19,-4,-16,-14,-14,-25,-15,-30,-18,-25,-21,-38,-23,-28,-28,-23,-33,-32,-34,-27,-38,-21,-42,-27,-45,-18,-49,-23,-52,-17,-57,-11,-61,-18,-63,-11,-67,-7,-73,-5,-80,-2,-84,-2,-93],palette[0]);
  for(let tier=0;tier<6;tier++){
   const cy=-88+tier*12,w=6+tier*5;
   const fan=[0,cy-6,3,cy,3,cy+5,w*.5,cy+9,w,cy+14,w*.6,cy+14,w*.3,cy+11,w*.45,cy+16,1,cy+12,-w*.4,cy+16,-w*.25,cy+11,-w,cy+14,-w*.6,cy+9,-3,cy+5,-2,cy];
   shape(fan,palette[1]);
   shape([-1,cy-3,2,cy+3,0,cy+7,w*.65,cy+13,w*.25,cy+12,-1,cy+9,-w*.6,cy+13,-w*.3,cy+7],palette[2]);
   shape([-1,cy,0,cy+5,-w*.4,cy+10,-w*.6,cy+11,-w*.3,cy+7],palette[3]);
   for(let j=0;j<9;j++){
    const side=j%2?-1:1,xx=side*w*(.1+j*.075),yy=cy+5+j*.75;
    shape([xx,yy,xx+side*3,yy+1.5,xx+side*5,yy+4.5,xx+side*1.5,yy+3,xx-side*1.5,yy],palette[2]);
    shape([xx,yy,xx+side*1.5,yy+1.5,xx+side*3,yy+4.5,xx,yy+3],j%2?palette[3]:palette[1]);
   }
   for(let j=0;j<12;j++){const xx=(j-5.5)*w*.13,yy=cy+6+Math.abs(j-5.5)*1.1;shape([xx,yy,xx+1.5,yy+1.5,xx+4,yy+4,xx+1.5,yy+3,xx-1.5,yy+1.5],j%3?palette[1]:palette[3]);}
  }
 }else{
  // One coherent crown: forks/gaps in the birch, a dense rounded oak outline.
  const silhouette=birch?[-12,-95,-6,-94,-2,-97,5,-94,13,-95,15,-91,23,-93,24,-86,29,-86,32,-79,35,-77,33,-70,38,-67,34,-60,38,-55,35,-48,40,-44,37,-36,32,-34,34,-28,27,-23,19,-24,14,-20,5,-22,1,-25,-8,-21,-15,-23,-20,-20,-29,-25,-34,-25,-37,-32,-35,-39,-40,-45,-37,-51,-40,-56,-35,-62,-32,-62,-33,-70,-29,-73,-29,-80,-23,-81,-24,-87,-18,-87,-18,-92]:[-8,-96,0,-97,5,-94,13,-96,17,-92,23,-92,23,-87,30,-86,30,-81,34,-79,33,-72,38,-69,36,-62,40,-59,38,-53,40,-48,36,-43,39,-38,34,-31,28,-29,25,-24,17,-22,11,-24,5,-21,-1,-24,-9,-21,-14,-25,-22,-24,-25,-29,-33,-30,-32,-36,-38,-39,-36,-45,-40,-49,-37,-55,-39,-60,-35,-64,-36,-70,-31,-73,-30,-80,-24,-81,-23,-88,-16,-88,-14,-94];
  shape(silhouette,palette[0]);
  const crownMask=data.map(c=>c===-1?0:1);
  const patches=[
   [-19,-79,17,15],[4,-85,18,13],[23,-72,14,17],[-28,-58,12,13],[-6,-65,17,17],
   [17,-53,18,16],[-22,-37,14,12],[0,-36,18,12],[25,-33,10,9]
  ];
  for(let k=0;k<patches.length;k++){
   const [cx,cy,rx,ry]=patches[k],p=(coords:number[])=>coords.map((v,i)=>i%2?cy+(v+Math.sin(i*2.3+k)*.055)*ry:cx+(v+Math.cos(i*1.7+k)*.055)*rx);
   // Irregular interlocking leaf fingers: no circular base or concentric highlight.
   shape(p([-.9,.15,-1,-.2,-.7,-.3,-.8,-.65,-.45,-.65,-.4,-.95,0,-.85,.25,-1,.45,-.7,.8,-.75,.75,-.4,1,-.2,.85,.15,1,.45,.65,.55,.7,.9,.3,.8,.1,1,-.2,.8,-.6,.9,-.55,.55,-.95,.5]),palette[1]);
   shape(p([-.85,-.15,-.55,-.25,-.65,-.55,-.3,-.5,-.25,-.8,.1,-.7,.3,-.85,.45,-.55,.75,-.55,.65,-.2,.85,0,.55,.1,.7,.35,.35,.3,.4,.6,.05,.4,-.15,.6,-.3,.3,-.65,.4,-.55,.05]),palette[2]);
  }
  // Finish all crown volumes first, then draw fully outlined little leaves on top.
  // Later volume patches must not paint over the outlines of earlier leaves.
  for(let k=0;k<patches.length;k++){
   const [cx,cy,rx,ry]=patches[k];
   for(let row=0;row<4;row++)for(let col=0;col<5;col++){
    const a=hash(k*31+row*5+col,k+7);if(a%7===0)continue;
    const xx=Math.round(cx+(col-2)*rx*.34+(row%2?2:0)+(a%3)-1),yy=Math.round(cy+(row-1.5)*ry*.39+(col%2)+((a>>>5)%3)-1);
    const angle=(col<2?-1:1)*(.45+(a%3)*.18),cos=Math.cos(angle),sin=Math.sin(angle);
    const transform=(points:number[])=>points.map((v,i)=>i%2?yy+points[i-1]*sin+v*cos:xx+v*cos-points[i+1]*sin);
    const leaf=(length:number,height:number)=>transform(leafContour(length,height));
    // A one-pixel dark rim all around, not just a drop shadow.
    shape(leaf(3.4,1.9),birch?0x2c6450:0x2c5936);
    shape(leaf(2.35,1),row<2?(birch?0x4a9264:0x3d8444):palette[2]);
    if(row<2&&a%3===0)shape(transform([-1,-1,1,-1,0,0,-1,0]),palette[3]);
   }
  }

  if(birch){
   // Small real gaps preserve the pale branching visible in the reference.
   shape([-13,-70,-10,-70,-9,-58,-5,-53,-5,-47,-9,-52,-12,-60],bark[1]);
   shape([-11,-67,-9,-64,-7,-55,-5,-51,-7,-52,-10,-59],bark[2]);
   shape([12,-69,15,-72,13,-62,9,-56,8,-51,6,-52,8,-60],bark[2]);
   shape([-8,-55,-6,-54,-6,-52,-8,-53],bark[0]);
  }
  // Keep all leaf fingers inside the hand-drawn silhouette.
  for(let i=0;i<data.length;i++)if(!crownMask[i])data[i]=-1;
 }
 g.fillStyle(0x294d3a,.25).fillEllipse(x+10*s,y+8*s,67*s,22*s);
 for(let row=0;row<height;row++)for(let col=0;col<width;){const c=data[row*width+col];let end=col+1;while(end<width&&data[row*width+end]===c)end++;if(c!==-1)g.fillStyle(c).fillRect(x+(col-42)*pixel*s,y+(row*pixel-99)*s,(end-col)*pixel*s,pixel*s);col=end;}
}
