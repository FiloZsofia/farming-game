import type Phaser from 'phaser';
import {growthTarget,isRipe,type Plot} from './gardening';
export const isPollinatedBerry=(crop:string|null)=>crop==='strawberry'||crop==='honeyberry'||crop==='blueberry';
// Healthy foliage remains: these marks show missing fruit, not a diseased plant.
export function drawBerryFlowers(g:Phaser.GameObjects.Graphics,p:Plot,cx:number,cy:number){
 if(!p.crop||!isPollinatedBerry(p.crop))return;
 const stage=p.growth/growthTarget(p);
 if(stage<.3&&!p.regrowing)return;
 if(p.fruitAftermath==='fallen'){for(const dx of [-4,4])g.fillStyle(p.crop==='strawberry'?0xa87159:0x666e83,.8).fillEllipse(cx+dx,cy+5,2.5,1.7);}
 for(const [i,dx,dy]of [[0,-3,-2],[1,3,-5],[2,0,1]]){
  const x=cx+dx,y=cy+dy;
  if(stage<.65&&p.fruitSet!==false&&!p.fruitAftermath&&i!==2){for(const [px,py]of [[-1,0],[1,0],[0,-1],[0,1]])g.fillStyle(0xf1e9cb).fillEllipse(x+px,y+py,2,1.6);g.fillStyle(0xd7b568).fillCircle(x,y,.6);}
  else if(i===2||p.fruitSet===false||!!p.fruitAftermath||stage>=.65&&!isRipe(p)){
   g.lineStyle(.7,0x9b9270).lineBetween(x,y-2,x,y+1).lineBetween(x-1.5,y,x+1.5,y);g.fillStyle(0xc4b991).fillCircle(x,y-.4,.7);
   if(i!==2&&stage>=.65&&p.fruitSet!==false&&!p.fruitAftermath)g.fillStyle(0x91a35a).fillEllipse(x,y+1,2.3,2.7);
  }
 }
 for(const [dx,dy]of [[-4,5],[4,4]]){g.fillStyle(p.crop==='strawberry'?0xe2c6b9:0xe4d9bd,.8).fillEllipse(cx+dx,cy+dy,2.4,1.2);}
}
export function drawTreeBlossomGaps(g:Phaser.GameObjects.Graphics,x:number,y:number,scale:number,hasFruit:boolean,state?:'empty'|'fallen'){
 for(const [i,dx,dy]of [[0,-23,-48],[1,7,-66],[2,26,-43],[3,-7,-34],[4,24,-64]]){
  const xx=x+dx*scale,yy=y+dy*scale;
  if(!hasFruit&&!state&&i<2){for(const [px,py]of [[-2,0],[2,0],[0,-2],[0,2]])g.fillStyle(0xeadbc7).fillEllipse(xx+px*scale,yy+py*scale,3.3*scale,2.8*scale);g.fillStyle(0xc8aa66).fillCircle(xx,yy,1*scale);}
  else{g.lineStyle(.9,0x9f9874).lineBetween(xx,yy-3*scale,xx,yy+2*scale).lineBetween(xx-2*scale,yy,xx+2*scale,yy);g.fillStyle(0xbba981).fillCircle(xx,yy,1*scale);}
 }
 if(state==='fallen')for(let i=0;i<3;i++)g.fillStyle(0x92765c,.75).fillEllipse(x-11+i*11,y+5,4*scale,3*scale);
 for(let i=0;i<5;i++)g.fillStyle(i%2?0xd9bdac:0xe4d4bc,.75).fillEllipse(x-19+i*8,y+3+(i%3)*2,3.5*scale,1.7*scale);
}
