import type Phaser from 'phaser';
import {greenhouse,maraVillageParking,ornamentalShrubs} from './nursery-grounds';
export function drawMaraBay(g:Phaser.GameObjects.Graphics){
 const {x,y}=maraVillageParking;
 g.fillStyle(0x455e38,.22).fillEllipse(x+5,y+24,159,191);
 g.fillStyle(0xa69b78).fillRoundedRect(x-60,773,120,158,21);g.fillStyle(0xb8ac88).fillRoundedRect(x-56,774,112,152,20);
 let seed=411;const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 for(let i=0;i<330;i++){const px=x-52+rnd()*104,py=780+rnd()*140;g.fillStyle([0xd0c5a1,0x918970,0xa2987b][i%3],.8).fillEllipse(px,py,1+rnd()*2,1+rnd());}
 // Two worn wheel tracks run into the grass-and-gravel bay from the road.
 for(const dx of [-28,28]){g.lineStyle(9,0xa99f7c,.5).lineBetween(x+dx,768,x+dx,908);g.lineStyle(2,0xd0c3a0,.35).lineBetween(x+dx-2,783,x+dx-2,911);}
 for(let i=0;i<24;i++){const px=x-65+(i%2)*130+rnd()*8,py=782+Math.floor(i/2)*12;g.lineStyle(1,0x72934d).lineBetween(px,py,px-2,py-4).lineBetween(px,py,px+2,py-3);}

}
export function drawGreenhouse(g:Phaser.GameObjects.Graphics){
 const {x,y,w,h}=greenhouse,front=w-10;
 const rect=(dx:number,dy:number,a:number,b:number,c:number,alpha=1)=>g.fillStyle(c,alpha).fillRect(x+dx,y+dy,a,b);
 const line=(ax:number,ay:number,bx:number,by:number,c:number,width=1,alpha=1)=>g.lineStyle(width,c,alpha).lineBetween(x+ax,y+ay,x+bx,y+by);
 const poly=(points:number[][],c:number,alpha=1)=>g.fillStyle(c,alpha).fillPoints(points.map(([a,b])=>({x:x+a,y:y+b})),true);
 g.fillStyle(0x314b34,.24).fillEllipse(x+39,y+h+4,91,19);
 // Brick plinth, shaded side and visible timber staging behind the glazing.
 rect(-3,h-8,front+6,10,0x8b7860);for(let row=0;row<2;row++)for(let col=0;col<8;col++)rect(col*9+(row%2)*4,h-7+row*4,8,3,(row+col)%2?0xb39a76:0x9e876b);
 rect(0,0,front,h-8,0x5f7867);poly([[front,0],[w,-7],[w,h-10],[front,h-8]],0x658778);
 rect(3,3,front-6,h-15,0xa9c1ad,.36);rect(5,40,front-10,3,0x9c845b);rect(7,43,2,13,0x6c6548);rect(front-9,43,2,13,0x6c6548);
 for(const [dx,dy]of [[10,33],[22,35],[43,34],[54,32]]){rect(dx-3,dy+1,6,7,0xae7856);rect(dx-4,dy,8,2,0xc49a6a);line(dx,dy,dx,dy-12,0x456b40);for(const side of [-1,1])g.fillStyle(side<0?0x63854c:0x8ba76b).fillEllipse(x+dx+side*3,y+dy-7,6,3);}
 // A second timber shelf and seed trays remain behind the door and reflections.
 rect(4,53,front-8,2,0xa38f6a);for(const dx of [8,13,49,54]){rect(dx,48,4,4,0x9f7759);line(dx+2,48,dx+2,44,0x748f58,.7);g.fillStyle(0xa2b27d).fillEllipse(x+dx+3,y+44,4,2);}
 // Sage-painted mullions and a central framed glass door.
 for(const dx of [0,20,43,front]){rect(dx-1,0,3,h-7,0x7a927b);rect(dx,0,1,h-9,0xc8ceb1);}for(const dy of [1,26,h-9]){rect(0,dy,front,2,0x658570);rect(1,dy,front-2,.7,0xd0cfaa);}
 rect(21,13,22,h-20,0x6d8572);rect(23,15,18,h-25,0xa8c6b0,.4);line(23,36,41,36,0xc4caa6,1.5);rect(38,39,2,5,0xd6bb77);rect(22,h-8,21,3,0xc3b48c);
 for(const dx of [4,25,47])poly([[dx,5],[dx+9,5],[dx,22]],0xe1e7ce,.42);for(const dx of [5,47])line(dx,31,dx+11,46,0xc4dcc3,1,.65);
 // Pitched glazed roof with individual panes, ridge cap, flashing and gutter.
 poly([[-4,0],[front/2,-26],[front+4,0]],0x4f7765);poly([[-2,-1],[front/2,-23],[front/2,-1]],0x9ab7a1,.74);poly([[front/2,-23],[front+2,-1],[front/2,-1]],0x6f9c89,.9);poly([[front/2,-26],[front/2+10,-32],[w+4,-7],[front+4,0]],0x8fb09b);
 line(-4,0,front/2,-26,0xd2d1a9,2);line(front/2,-26,front+4,0,0xc7cba4,2);line(front/2,-26,front/2+10,-32,0xe0d7af,2);line(front/2+10,-32,w+4,-7,0xaebc99,2);
 for(const k of [.33,.66]){line(front/2*k,-26*k,front-front/2*k,-26*k,0xd5d6b0,1);line(front/2,-24,front*k,-1,0xd5d6b0,1);}
 line(-4,1,front+5,1,0x4b6857,3);line(-4,0,front+5,0,0xc6cba6);line(w,-6,w,h-9,0xb9c5a0,2);
 // Hinged roof vent, subtle pane seals and side wall divisions.
 poly([[41,-17],[49,-11],[60,-9],[52,-16]],0xb3cab2,.8);line(41,-17,52,-16,0xe0dfbc,.8);line(52,-16,60,-9,0xcbd3b1,.8);line(49,-11,50,-6,0x78917b,.7);
 for(const dy of [22,44])line(front+2,dy,w-1,dy-7,0xb9c6a7,.8);line(front+5,-2,front+5,h-10,0xaebfa1,.7);
 line(-3,3,-3,h-3,0x78917c,1.8);line(-3,3,-2,3,0xc6cdae,.7);rect(-4,h-3,3,3,0x9b9e81);
 rect(19,h+2,28,4,0xc5b99a);line(20,h+2,46,h+2,0xe0d3b0);
}

export class OrnamentalShrubArt{
 private g:Phaser.GameObjects.Graphics;private signature='';
 constructor(scene:Phaser.Scene){this.g=scene.add.graphics().setDepth(-.24);this.paint([0,0]);}
 paint(progress:readonly number[]){const key=progress.map(p=>Math.round(p*24)).join(',');if(key===this.signature)return;this.signature=key;const g=this.g;g.clear();ornamentalShrubs.forEach((p,i)=>{const t=progress[i],w=36-t*5;g.fillStyle(0x314a34,.2).fillEllipse(p.x+3,p.y+3,38,12);g.fillStyle(0x786044).fillRect(p.x-2,p.y-16,4,18);g.fillStyle(0x395e41).fillRoundedRect(p.x-w/2,p.y-29,w,29,9);g.fillStyle(0x5d814c).fillRoundedRect(p.x-w/2+1,p.y-32,w-2,25,8);g.fillStyle(0x829c5b).fillRoundedRect(p.x-w/2+4,p.y-33,w-8,8,4);for(let k=0;k<13;k++){const a=k*2.4,x=p.x+Math.cos(a)*(14-t*4),y=p.y-18+Math.sin(a)*(13-t*5);g.fillStyle(k%2?0x739452:0x527a46).fillEllipse(x,y,5+(1-t)*3,3+(1-t)*2);}if(t>.3){g.lineStyle(.7,0x9aae6a,t*.6).lineBetween(p.x-10,p.y-29,p.x+10,p.y-29);for(let k=0;k<Math.floor(t*6);k++)g.fillStyle(k%2?0x8da464:0x68894c).fillEllipse(p.x+17+k%3*3,p.y-2+Math.floor(k/3)*3,3,1.5);} });}
 destroy(){this.g.destroy();}
}
