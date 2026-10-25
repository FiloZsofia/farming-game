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
  if(kind===1){for(let i=0;i<6;i++)rect(x-3*s,y-i*7*s,4*s,2*s,0x667463);line(x,y-24*s,x-16*s,y-47*s,0xb5bca2,3*s);}
  if(kind===2){for(let i=0;i<4;i++){const yy=y-90*s+i*19*s,w=(15+i*8)*s;poly([x,yy,x-w,yy+35*s,x+w,yy+35*s],i%2?0x426d52:0x365c47);poly([x-2*s,yy+4*s,x-w*.75,yy+30*s,x+6*s,yy+28*s],0x62875b,.8);}}
  else for(const[xx,yy,w,h]of [[-18,-48,45,39],[12,-56,51,47],[-3,-76,49,39],[0,-38,56,32]]){
   const cx=x+xx*s,cy=y+yy*s,rx=w*s/2,ry=h*s/2;
   const canopy=(dx:number,dy:number,k:number,c:number)=>poly([cx+dx-rx*k,cy+dy,cx+dx-rx*.8*k,cy+dy-ry*.65*k,cx+dx-rx*.1*k,cy+dy-ry*k,cx+dx+rx*.65*k,cy+dy-ry*.8*k,cx+dx+rx*k,cy+dy-ry*.1*k,cx+dx+rx*.7*k,cy+dy+ry*.65*k,cx+dx-rx*.25*k,cy+dy+ry*.7*k],c);
   canopy(0,0,1,kind===1?0x587644:0x35583c);canopy(-3*s,-5*s,.84,kind===1?0x87a457:0x587b47);
   for(let i=0;i<22;i++)rect(cx+(random()-.5)*w*s*.75,cy+(random()-.55)*h*s*.65,(2+random()*3)*s,2*s,[0x98ac63,0x74944d,0xb9c37b][i%3],.65);
  }
}
