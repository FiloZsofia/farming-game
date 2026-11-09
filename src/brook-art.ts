import type Phaser from 'phaser';
import {brookSamples,brookAt,brookLength,brookSource,brookStones,underBrookBridge} from './brook-layout';
export function drawBrookBed(g:Phaser.GameObjects.Graphics){
 const points=brookSamples.map(p=>({x:p.x,y:p.y}));
 for(const [extra,color]of [[15,0x6f8152],[8,0xa39d77],[2,0x658c83],[-2,0x76a79c],[-10,0x527e7b]]){for(let i=1;i<points.length;i++){const p=brookSamples[i],w=Math.max(3,brookAt(p.distance).width+extra);g.lineStyle(w,color).lineBetween(points[i-1].x,points[i-1].y,p.x,p.y);g.fillStyle(color).fillEllipse(p.x,p.y,w,w);}}
 // Submerged gravel stays visible beneath thin water at the bank, not across the deep channel.
 for(let i=0;i<180;i++){const d=24+(brookLength-45)*i/180,p=brookAt(d,(i%2?1:-1)*(5+i%4));if(underBrookBridge(p))continue;g.fillStyle([0xa2b49b,0xb5bd9c,0x7f9d8a][i%3],.55).fillEllipse(p.x,p.y,2+i%3,1.4+i%2);}
 for(const [i,s]of brookStones.entries()){g.fillStyle(0x3c6a66,.3).fillEllipse(s.x+2,s.y+3,s.radius*2+5,s.radius+4);g.fillStyle(0x8f9d88).fillEllipse(s.x,s.y,s.radius*2,s.radius*1.35);g.fillStyle(0xb5bba0).fillEllipse(s.x-1,s.y-1,s.radius*1.4,s.radius*.65);g.lineStyle(.8,0xd3d4b1,.75).lineBetween(s.x-s.radius*.5,s.y-2,s.x+1,s.y-3);if(i%2===0)g.fillStyle(0x77905d).fillEllipse(s.x+2,s.y+1,s.radius,.4*s.radius);}
 for(let i=0;i<45;i++){const p=brookAt(45+(brookLength-80)*i/45,(i%2?1:-1)*(20+i%5));if(underBrookBridge(p))continue;g.fillStyle(0x6d8c53,.7).fillEllipse(p.x,p.y,7,3);g.lineStyle(.8,0x93a06a,.8).lineBetween(p.x,p.y,p.x+2,p.y-5);}
}
export function drawBrookSpring(g:Phaser.GameObjects.Graphics){
 const {x,y}=brookSource;g.fillStyle(0x5b764a,.35).fillEllipse(x+1,y-2,86,47);g.fillStyle(0xa09d7e).fillEllipse(x,y+3,47,23);g.fillStyle(0x507e77).fillEllipse(x,y+3,34,15);g.fillStyle(0x91b4a4).fillEllipse(x-2,y+2,25,10);
 // The dark rock seam is behind the falling thread; foreground stones frame the pool.
 for(const [i,[dx,dy,w,h]]of [[-22,-14,26,24],[17,-15,34,23],[-5,-22,28,20]].entries()){const stone=[[-.5,-.1],[-.32,-.43],[.15,-.5],[.48,-.22],[.4,.28],[.07,.45],[-.39,.3]].map(([a,b])=>({x:x+dx+a*w,y:y+dy+b*h}));g.fillStyle(0x758573).fillPoints(stone,true);g.fillStyle(0xa9b39a).fillPoints([stone[0],stone[1],stone[2],{x:x+dx+w*.15,y:y+dy-h*.12},{x:x+dx-w*.25,y:y+dy}],true);g.lineStyle(.65,0xcbd0b1,.75).strokePoints(stone.slice(0,3));g.lineStyle(.65,0x596d5d,.65).lineBetween(x+dx+3,y+dy-4,x+dx+6,y+dy+4);for(let j=0;j<7;j++){const xx=x+dx-w*.3+j*w*.09,yy=y+dy+h*.24+Math.sin(j*2+i)*2;g.fillStyle(j%2?0x7a965b:0x648551).fillEllipse(xx,yy,5,2.5);g.fillStyle(0x9ba970,.6).fillEllipse(xx-1,yy-.5,2,.7);}}
 for(let i=0;i<18;i++){const a=i*2.4,r=6+i%5*2,xx=x+Math.cos(a)*r,yy=y+3+Math.sin(a)*r*.32;g.fillStyle(i%2?0xa4b69a:0x799d8a,.5).fillEllipse(xx,yy,2+i%2,1.2);}
 g.fillStyle(0x3b5c51).fillEllipse(x,y-12,13,9);g.lineStyle(3,0x9bc6b3,.8).lineBetween(x,y-11,x-1,y+1);g.lineStyle(1,0xd9e8cd,.85).lineBetween(x-.6,y-10,x-1.5,y);g.lineStyle(.7,0xd4e1bf,.75).strokeEllipse(x-1,y+2,12,4);g.fillStyle(0xc1d7ba,.6).fillEllipse(x-3,y+2,4,1.5);
 for(const [dx,dy]of [[-19,9],[18,8]]){g.fillStyle(0x8e9c7d).fillEllipse(x+dx,y+dy,17,10);g.fillStyle(0xb3b99a).fillEllipse(x+dx-2,y+dy-2,12,4);}
 for(let i=0;i<16;i++){const a=i*2.1,r=28+i%3*9,xx=x+Math.cos(a)*r,yy=y+Math.sin(a)*r*.5;if(xx<x-15&&yy>y)continue;g.lineStyle(.8,0x72924e).lineBetween(xx,yy,xx-1,yy-6);g.fillStyle(i%3?0xd4c78e:0xbba8bd).fillEllipse(xx,yy-7,3,2.5);g.fillStyle(0x93ab69).fillEllipse(xx+2,yy-3,4,2);}
}
export function drawBrookMouth(g:Phaser.GameObjects.Graphics){
 // The stream continues past the world edge; overlapping reeds conceal the visible boundary.
 for(let i=0;i<56;i++){const x=-1040-(i%8)*18+(i%3)*3,y=1267+Math.floor(i/8)*8;g.fillStyle(i%3?0x53784a:0x6d8b50,.95).fillEllipse(x,y,22,10);for(let k=0;k<3;k++){const top=y-17-(i+k)%5*3;g.lineStyle(.9,0x547d50).lineBetween(x+k*3-3,y+2,x+k*3-5,top);g.lineStyle(.7,0x9aab6b,.85).lineBetween(x+k*3-5,top,x+k*3-9,top+5);if((i+k)%4===0)g.lineStyle(2,0x9d9666).lineBetween(x+k*3-5,top+1,x+k*3-5,top+6);}}
}
export class BrookCurrent{
 private g:Phaser.GameObjects.Graphics;private spring:Phaser.GameObjects.Graphics;private time=0;
 constructor(private scene:Phaser.Scene){this.g=scene.add.graphics().setDepth(-.4);this.spring=scene.add.graphics().setDepth(-.23);}
 update(dt:number,visible:boolean){const g=this.g;g.clear();this.spring.clear().setVisible(visible);g.setVisible(visible);if(!visible)return;this.time+=dt;const view=this.scene.cameras.main.worldView;
  for(let i=0;i<125;i++){const lane=i%5-2,speed=Math.abs(lane)===2?7:Math.abs(lane)===1?13:20,d=(i*79.1+this.time*speed)%brookLength,p=brookAt(d,lane*3.1);if(d<23||!view.contains(p.x,p.y)||underBrookBridge(p)||brookStones.some(s=>Math.hypot(p.x-s.x,p.y-s.y)<s.radius+2)||p.x< -1038)continue;const alpha=(.17+.14*Math.sin((i+this.time*.4)*1.7)**2)*(lane===0?1:.7);g.lineStyle(.5+(i%3)*.13,0xd5e4c7,alpha).strokePoints(Array.from({length:5},(_,j)=>{const v=brookAt(d+(3+i%5)*j/4,lane*3.1+Math.sin(j*.8+i)*.4);return{x:v.x,y:v.y};}));}
  for(const [i,s]of brookStones.entries()){if(!view.contains(s.x,s.y)||underBrookBridge(s))continue;const d=s.distance+7,p=brookAt(d,(i%2?1:-1)*(i%3?6:12)),phase=(this.time*.38+i*.23)%1;g.lineStyle(.6,0xd8e6c8,(1-phase)*.42).strokePoints(Array.from({length:13},(_,j)=>{const a=j*Math.PI/8+phase*2,r=2+phase*3;return{x:p.x+s.tx*phase*6+Math.cos(a)*r,y:p.y+s.ty*phase*6+Math.sin(a)*r*.45};}));for(let k=0;k<3;k++){const q=brookAt(d+phase*15+k*3,(i%2?1:-1)*(i%3?6:12)+(k-1)*1.6);g.fillStyle(0xe1e8cc,(1-phase)*.45).fillEllipse(q.x,q.y,1.4,1);}}
  if(view.contains(brookSource.x,brookSource.y)){const {x,y}=brookSource,h=this.spring,phase=(this.time*.9)%1;h.lineStyle(.65,0xe5eed9,.6).lineBetween(x-1,y-9+phase*8,x-1.4,y-6+phase*7);h.lineStyle(.55,0xe0e9d0,(1-phase)*.65).strokeEllipse(x-1,y+2,5+phase*11,1.5+phase*2);for(let i=0;i<3;i++){const a=this.time*.6+i*2.1;h.fillStyle(0xd4e7cf,.28+Math.sin(a)**2*.22).fillEllipse(x+Math.cos(a)*7,y+3+Math.sin(a)*2,1.6,.8);}}
 }
 destroy(){this.g.destroy();this.spring.destroy();}
}
