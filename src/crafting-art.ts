import Phaser from 'phaser';
import {irrigatedPlots,type Crafting} from './crafting';
import {TILE,type Garden} from './gardening';
export function drawCrafting(scene:Phaser.Scene,c:Crafting|undefined,interact:(index:number)=>void){
 const root=scene.add.container(0,0).setDepth(.8);
 for(const [index,m]of(c?.machines??[]).entries()){const g=scene.add.graphics(),x=m.x,y=m.y;root.add(g);const rect=(dx:number,dy:number,w:number,h:number,color:number)=>g.fillStyle(color).fillRoundedRect(x+dx,y+dy,w,h,1),line=(dx:number,dy:number,xx:number,yy:number,color:number,w=1)=>g.lineStyle(w,color).lineBetween(x+dx,y+dy,x+xx,y+yy),oval=(dx:number,dy:number,w:number,h:number,color:number)=>g.fillStyle(color).fillEllipse(x+dx,y+dy,w,h);
  g.fillStyle(0x2b4232,.25).fillEllipse(x+2,y+5,42,13);
  if(m.kind==='composter'){rect(-20,-33,40,36,0x785b39);rect(-22,-36,44,7,0xaf8954);oval(0,-34,33,10,0x4d6339);for(let i=0;i<4;i++){rect(-19,-25+i*7,38,5,0xad8953);line(-16,-24+i*7,15,-24+i*7,0xcfad70);}for(const dx of [-18,14])rect(dx,-34,4,39,0x625539);for(let i=0;i<6;i++)line(-12+i*5,-35,-9+i*4,-39-i%2*3,0x86a052,2);if(m.ready)oval(0,-42,8,8,0xe6ce7f);}
  if(m.kind==='basketMaker'){for(const dx of [-17,14])rect(dx,-17,5,23,0x785a39);rect(-23,-22,46,9,0xb08a50);rect(-14,-42,26,21,0x8f7146);for(let i=0;i<6;i++)line(-11+i*4,-40,-11+i*4,-23,0xd2b47b);for(let i=0;i<4;i++)line(-12,-37+i*4,10,-37+i*4,0xb6a477);line(17,-32,23,-32,0x8a9378,3);line(23,-32,23,-25,0x8a9378,3);oval(-3,-9,19,11,0xc3a063);for(let i=0;i<3;i++)line(-11,-12+i*3,6,-12+i*3,0xe0c18a);if(m.ready)oval(0,-47,8,8,0xe6ce7f);}
  if(m.kind==='beeHabitat'){rect(-3,-17,6,24,0x785b3b);rect(-19,-48,38,32,0x9c7847);g.fillStyle(0x6a5940).fillTriangle(x-24,y-46,x,y-67,x+24,y-46);g.fillStyle(0xc19b61).fillTriangle(x-18,y-47,x,y-61,x+18,y-47);rect(-15,-43,30,23,0xc3a56b);for(let row=0;row<3;row++)for(let col=0;col<4;col++){oval(-10+col*7,-38+row*7,6,6,0xe1ca94);oval(-10+col*7,-38+row*7,3,3,0x665537);}}
  if(m.kind==='irrigation'){oval(0,0,22,9,0x667b64);rect(-3,-27,6,29,0x829986);line(-1,-24,-1,-2,0xc0cbb0);rect(-10,-28,20,6,0xb79d65);oval(0,-28,9,6,0xd4c38a);rect(-13,-27,4,4,0x657e72);rect(9,-27,4,4,0x657e72);}
  if(m.kind==='basket'){oval(0,-7,32,20,0xad8750);g.lineStyle(2,0xd3b37c).strokeEllipse(x,y-16,24,29);for(let i=0;i<5;i++)line(-15,-14+i*4,15,-14+i*4,0xd2af74);}
  const zone=scene.add.zone(x,y-15,46,56).setInteractive({useHandCursor:true});zone.on('pointerdown',()=>interact(index));root.add(zone);
 }
 return root;
}
export function drawIrrigationArcs(g:Phaser.GameObjects.Graphics,garden:Garden,c:Crafting|undefined,now:number,until:number){
 g.clear();if(now>=until)return;for(const m of c?.machines??[]){if(m.kind!=='irrigation')continue;for(const [i,p]of irrigatedPlots(garden,m).entries()){const[x,y]=p.key.split(',').map(Number),tx=x+TILE/2,ty=y+TILE/2,startY=m.y-28,height=18+Math.abs(tx-m.x)*.27;const points=Array.from({length:22},(_,j)=>{const t=j/21;return {x:m.x+(tx-m.x)*t,y:startY+(ty-startY)*t-4*height*t*(1-t)};});g.lineStyle(1.2,0xa5d6da,.65).strokePoints(points);for(let j=0;j<5;j++){const t=((now/1050)+j/5+i*.12)%1;g.fillStyle(0xd6f1e2,.85).fillEllipse(m.x+(tx-m.x)*t,startY+(ty-startY)*t-4*height*t*(1-t),2,3);}g.lineStyle(.8,0xb8dedb,.6).strokeEllipse(tx,ty,8+Math.sin(now/110+i)*2,4);}}
}
