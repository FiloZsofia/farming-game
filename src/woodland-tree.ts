import {drawLeafCrown} from './tree-foliage';
import {natureTreeClear} from './nature-resources';
import Phaser from 'phaser';
export function drawWoodlandTree(g:Phaser.GameObjects.Graphics,random:()=>number,x:number,y:number,kind:number,s=1){
 if(!natureTreeClear(x,y,s))return;
 const rect=(x:number,y:number,w:number,h:number,c:number,a=1)=>{g.fillStyle(c,a).fillRect(x,y,w,h);};
 const oval=(x:number,y:number,w:number,h:number,c:number,a=1)=>{g.fillStyle(c,a).fillEllipse(x,y,w,h);};
 const line=(x:number,y:number,xx:number,yy:number,c:number,w=1,a=1)=>{g.lineStyle(w,c,a).lineBetween(x,y,xx,yy);};
 const poly=(p:number[],c:number,a=1)=>{g.fillStyle(c,a).fillPoints(Array.from({length:p.length/2},(_,i)=>new Phaser.Geom.Point(p[i*2],p[i*2+1])),true);};

  oval(x+10*s,y+8*s,67*s,22*s,0x294d3a,.27);
  rect(x-4*s,y-44*s,9*s,49*s,kind===1?0xc6c9b0:0x6b543a);
  // Bark, roots and forked branches stay inside the existing silhouette.
  line(x+3*s,y+3*s,x+2*s,y-41*s,kind===1?0x929e89:0x493f32,1.4*s,.8);
  line(x-2*s,y+3*s,x-7*s,y+5*s,kind===1?0xb1b79e:0x806744,2*s);
  if(kind!==2){line(x,y-25*s,x+17*s,y-48*s,kind===1?0xb5bca2:0x6b543a,3*s);line(x,y-29*s,x-17*s,y-51*s,kind===1?0xb5bca2:0x6b543a,2.5*s);}
  if(kind===0)for(let i=0;i<5;i++){const yy=y-5*s-i*7*s;line(x-2*s,yy,x-1*s,yy-4*s,0xa38759,.7*s,.75);line(x+1*s,yy-2*s,x+2*s,yy-6*s,0x493f32,.7*s,.7);}
  if(kind===1){for(let i=0;i<6;i++)rect(x-3*s,y-i*7*s,4*s,2*s,0x667463);line(x,y-24*s,x-16*s,y-47*s,0xb5bca2,3*s);}
  if(kind===2){for(let i=0;i<4;i++){const yy=y-90*s+i*19*s,w=(15+i*8)*s;poly([x,yy,x-w*.31,yy+12*s,x-w*.18,yy+11*s,x-w*.68,yy+25*s,x-w*.48,yy+23*s,x-w,yy+35*s,x-w*.35,yy+32*s,x,yy+35*s,x+w*.5,yy+32*s,x+w,yy+35*s,x+w*.55,yy+22*s,x+w*.7,yy+24*s,x+w*.24,yy+10*s],i%2?0x426d52:0x365c47);poly([x-2*s,yy+4*s,x-w*.75,yy+30*s,x+6*s,yy+28*s],0x62875b,.8);for(let j=0;j<5;j++){const bx=x+(j-2)*w*.25,by=yy+(21+Math.abs(j-2)*4)*s;line(bx,by,bx-4*s,by+3*s,0x809862,.7*s,.65);line(bx+3*s,by+4*s,bx+8*s,by+6*s,0x284d3f,.8*s,.65);}}}
  else for(const[xx,yy,w,h]of [[-18,-48,45,39],[12,-56,51,47],[-3,-76,49,39],[0,-38,56,32]]){
   const cx=x+xx*s,cy=y+yy*s,rx=w*s/2,ry=h*s/2;
   // Consume the original shared random sequence so no scenery moves.
   let seed=0;
   for(let i=0;i<22;i++){const a=random(),b=random(),c=random();seed=(seed+Math.floor((a+b+c)*0x1fffffff))>>>0;}
   drawLeafCrown(g,cx,cy,rx,ry,kind===1,seed);

  }
}
