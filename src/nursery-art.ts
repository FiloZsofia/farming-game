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
 for(const p of ornamentalShrubs){g.fillStyle(0x314a34,.24).fillEllipse(p.x+3,p.y+3,36,12);g.fillStyle(0x786044).fillRect(p.x-2,p.y-15,4,17);g.fillStyle(0x355d40).fillRoundedRect(p.x-17,p.y-27,34,28,11);g.fillStyle(0x527c49).fillRoundedRect(p.x-16,p.y-30,32,25,10);g.fillStyle(0x789451).fillRoundedRect(p.x-13,p.y-32,26,9,6);for(let i=0;i<10;i++)g.fillStyle(i%2?0x829d5a:0x426d41).fillEllipse(p.x-12+(i%4)*8,p.y-20+Math.floor(i/4)*7,4,2);g.fillStyle(0x8a9d58).fillEllipse(p.x+18,p.y+2,4,2).fillEllipse(p.x+22,p.y+5,3,2);}
}
export function drawGreenhouse(g:Phaser.GameObjects.Graphics){
 const {x,y,w,h}=greenhouse,front=w-10;
 const rect=(dx:number,dy:number,a:number,b:number,c:number,alpha=1)=>g.fillStyle(c,alpha).fillRect(x+dx,y+dy,a,b);
 const line=(ax:number,ay:number,bx:number,by:number,c:number,width=1,alpha=1)=>g.lineStyle(width,c,alpha).lineBetween(x+ax,y+ay,x+bx,y+by);
 const poly=(points:number[][],c:number,alpha=1)=>g.fillStyle(c,alpha).fillPoints(points.map(([a,b])=>({x:x+a,y:y+b})),true);
 g.fillStyle(0x314b34,.24).fillEllipse(x+39,y+h+4,91,19);
 // Brick plinth, shaded side and visible timber staging behind the glazing.
 rect(-3,h-8,front+6,10,0x8b7860);for(let row=0;row<2;row++)for(let col=0;col<8;col++)rect(col*9+(row%2)*4,h-7+row*4,8,3,(row+col)%2?0xb39a76:0x9e876b);
 rect(0,0,front,h-8,0x405e4e);poly([[front,0],[w,-7],[w,h-10],[front,h-8]],0x426a5d);
 rect(3,3,front-6,h-15,0x7da696,.44);rect(5,40,front-10,3,0x9c845b);rect(7,43,2,13,0x6c6548);rect(front-9,43,2,13,0x6c6548);
 for(const [dx,dy]of [[10,33],[22,35],[43,34],[54,32]]){rect(dx-3,dy+1,6,7,0xae7856);rect(dx-4,dy,8,2,0xc49a6a);line(dx,dy,dx,dy-12,0x456b40);for(const side of [-1,1])g.fillStyle(side<0?0x63854c:0x8ba76b).fillEllipse(x+dx+side*3,y+dy-7,6,3);}
 // Sage-painted mullions and a central framed glass door.
 for(const dx of [0,20,43,front]){rect(dx-1,0,3,h-7,0x577a67);rect(dx,0,1,h-9,0xc3c9a3);}for(const dy of [1,26,h-9]){rect(0,dy,front,2,0x658570);rect(1,dy,front-2,.7,0xd0cfaa);}
 rect(21,13,22,h-20,0x465f4f);rect(23,15,18,h-25,0x94b8a4,.44);line(23,36,41,36,0xc4caa6,1.5);rect(38,39,2,5,0xd6bb77);rect(22,h-8,21,3,0xc3b48c);
 for(const dx of [4,25,47])poly([[dx,5],[dx+9,5],[dx,22]],0xe1e7ce,.42);for(const dx of [5,47])line(dx,31,dx+11,46,0xc4dcc3,1,.65);
 // Pitched glazed roof with individual panes, ridge cap, flashing and gutter.
 poly([[-4,0],[front/2,-26],[front+4,0]],0x4f7765);poly([[-2,-1],[front/2,-23],[front/2,-1]],0x9ab7a1,.74);poly([[front/2,-23],[front+2,-1],[front/2,-1]],0x6f9c89,.9);poly([[front/2,-26],[front/2+10,-32],[w+4,-7],[front+4,0]],0x8fb09b);
 line(-4,0,front/2,-26,0xd2d1a9,2);line(front/2,-26,front+4,0,0xc7cba4,2);line(front/2,-26,front/2+10,-32,0xe0d7af,2);line(front/2+10,-32,w+4,-7,0xaebc99,2);
 for(const k of [.33,.66]){line(front/2*k,-26*k,front-front/2*k,-26*k,0xd5d6b0,1);line(front/2,-24,front*k,-1,0xd5d6b0,1);}
 line(-4,1,front+5,1,0x4b6857,3);line(-4,0,front+5,0,0xc6cba6);line(w,-6,w,h-9,0xb9c5a0,2);
 rect(19,h+2,28,4,0xc5b99a);line(20,h+2,46,h+2,0xe0d3b0);
}
