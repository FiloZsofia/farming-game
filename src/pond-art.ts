import type Phaser from 'phaser';
import {farmLayout} from './layout';
import {pondOutline,pondWaterAt,currentPondExpansion} from './pond-shape';
/** Muted, irregular shallows and a mineral bank; no pre-planted decorative reeds. */
export function drawNaturalPond(g:Phaser.GameObjects.Graphics){
 const expansion=currentPondExpansion(),outline=(inset:number)=>pondOutline(expansion,inset);
 const fill=(points:{x:number;y:number}[],color:number,alpha=1)=>g.fillStyle(color,alpha).fillPoints(points,true);
 fill(outline(13),0x637752);fill(outline(8),0x92916d);fill(outline(4),0x798674);fill(outline(0),0x63877d);
 const water=outline(-8);fill(water,0x517b75);
 const deep=outline(-22).map((p,i)=>({x:p.x+Math.sin(i*.71)*3,y:p.y+Math.cos(i*.49)*3}));fill(deep,0x426a69);
 const inner=outline(-38).map((p,i)=>({x:p.x-7+Math.sin(i*.43)*5,y:p.y+3+Math.cos(i*.67)*3}));fill(inner,0x365b60,.65);
 const bank=outline(5),p=farmLayout.pond;
 for(let i=0;i<bank.length;i++){
  const b=bank[i],next=bank[(i+1)%bank.length];
  if(b.x<535&&b.y<421)continue;
  g.lineStyle(.8,0x526b56,.4).lineBetween(b.x,b.y,next.x,next.y);
  if(i%2===0){const w=2+i%4,h=1.1+i%3*.4;
   fill([{x:b.x-w,y:b.y},{x:b.x-w*.5,y:b.y-h},{x:b.x+w*.55,y:b.y-h*.7},{x:b.x+w,y:b.y+h*.2},{x:b.x+w*.3,y:b.y+h},{x:b.x-w*.7,y:b.y+h*.6}],i%4?0x989f85:0x798b7b);
   g.lineStyle(.65,0xc1bda0,.7).lineBetween(b.x-w*.4,b.y-h*.6,b.x+w*.45,b.y-h*.5);
  }
  const a=i*.91,gravel=outline(-4)[i];if(i%3===0){g.fillStyle(0xb0af8e,.38).fillEllipse(gravel.x+Math.sin(a)*2,gravel.y,2.4,1.1);}
 }
 const bounds=outline(-10),minX=Math.min(...bounds.map(p=>p.x)),maxX=Math.max(...bounds.map(p=>p.x)),minY=Math.min(...bounds.map(p=>p.y)),maxY=Math.max(...bounds.map(p=>p.y));
 let seed=419;const rnd=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 for(let i=0;i<160;i++){
  const x=minX+rnd()*(maxX-minX),y=minY+rnd()*(maxY-minY),w=2+rnd()*7;
  if(!pondWaterAt(x,y,expansion,.87))continue;
  g.lineStyle(.7,i%3?0xa6c1b2:0x7fa79b,i%5?.25:.4).lineBetween(x,y,x+w,y-.3);
  if(i%9===0)g.lineStyle(.55,0xabc9b8,.22).lineBetween(x+2,y+2,x+w*.7,y+2);
 }
}
