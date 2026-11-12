import type Phaser from 'phaser';

/** A tapered oval leaf, shared by pixel trees and small garden shrubs. */
export function leafContour(length:number,halfWidth:number){return [-length,0,-length*.65,-halfWidth*.7,0,-halfWidth,length*.65,-halfWidth*.65,length,0,length*.35,halfWidth,-length*.25,halfWidth*.85,-length*.7,halfWidth*.55];}
export function drawShrubLeaf(g:Phaser.GameObjects.Graphics,x:number,y:number,angle:number,light:boolean,size=1){
 const cos=Math.cos(angle),sin=Math.sin(angle);
 const leaf=(l:number,h:number,c:number)=>{
  const p=leafContour(l*size,h*size),points:{x:number;y:number}[]=[];
  for(let i=0;i<p.length;i+=2)points.push({x:x+p[i]*cos-p[i+1]*sin,y:y+p[i]*sin+p[i+1]*cos});
  const min=Math.floor(Math.min(...points.map(p=>p.y))),max=Math.ceil(Math.max(...points.map(p=>p.y)));
  g.fillStyle(c);
  for(let yy=min;yy<=max;yy++){
   const hits:number[]=[];
   for(let i=0,j=points.length-1;i<points.length;j=i++){
    const a=points[j],b=points[i];if((a.y>yy)!==(b.y>yy))hits.push(a.x+(yy-a.y)*(b.x-a.x)/(b.y-a.y));
   }
   hits.sort((a,b)=>a-b);
   for(let i=0;i+1<hits.length;i+=2){const left=Math.ceil(hits[i]),right=Math.floor(hits[i+1]);if(right>=left)g.fillRect(left,yy,right-left+1,1);}
  }
 };
 leaf(2.8,1.65,0x385f40);leaf(1.95,.9,light?0x648b53:0x4e7848);
}
