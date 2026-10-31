import type Phaser from 'phaser';
export type MushroomPoint={x:number;y:number;s:number};
export function drawMushroomArt(g:Phaser.GameObjects.Graphics,h:Phaser.GameObjects.Graphics,points:readonly MushroomPoint[],age:number,night:number){
  const light=Math.min(1,night/.55);g.clear();h.clear();
  for(const p of points){const {x,y,s:base}=p,s=base,pulse=.82+Math.sin(age*1.7+x)*.18;
   if(night>0){
    // Purple emission follows the mushroom silhouette, with only a faint ground tint.
    for(let layer=8;layer>=1;layer--){const radius=(27+layer*3)*s,points=Array.from({length:24},(_,i)=>{const angle=i/24*Math.PI*2,r=radius*(1+.06*Math.sin(i*2.3+x));return{x:x+Math.cos(angle)*r,y:y+4*s+Math.sin(angle)*r*.34};});h.fillStyle(0x713593,light*.022*pulse).fillPoints(points,true);}
    h.fillStyle(0x8651b0,light*.36*pulse).fillRoundedRect(x-6*s,y-36*s,12*s,38*s,4*s);
    h.fillStyle(0x9356bd,light*.46*pulse).fillEllipse(x,y-42*s,60*s,32*s);
    h.fillStyle(0xb286cf,light*.23*pulse).fillEllipse(x-9*s,y-48*s,34*s,18*s);
   }

   g.fillStyle(0x263b30,.3).fillEllipse(x+4,y+4,40*s,10*s);g.fillStyle(0xa99aab).fillRoundedRect(x-6*s,y-36*s,12*s,38*s,4*s);g.fillStyle(0xc1b3c0).fillRect(x-4*s,y-30*s,3*s,30*s);
   g.fillStyle(0x493952).fillEllipse(x,y-31*s,58*s,14*s);g.fillStyle(0x775781).fillEllipse(x,y-42*s,60*s,32*s);g.fillStyle(0x9975a2).fillEllipse(x-9*s,y-48*s,34*s,18*s);g.lineStyle(1.5*s,0xc2a6c9,.7).strokeEllipse(x,y-32*s,54*s,9*s);
   for(let i=0;i<7;i++){const xx=x+Math.cos(i*2.4)*(10+i%3*5)*s,yy=y-43*s+Math.sin(i*2.4)*8*s;g.fillStyle(0xe4d6df).fillEllipse(xx,yy,(3+i%2)*s,3*s);if(night>0)h.fillStyle(0xc5a0db,light*.35*pulse).fillCircle(xx,yy,3*s);}
  }
 }
