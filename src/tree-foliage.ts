import type Phaser from 'phaser';

/** Small overlapping leaf sprays, shaded from top left, within the existing crown. */
export function drawLeafCrown(g:Phaser.GameObjects.Graphics,x:number,y:number,rx:number,ry:number,birch=false,seed=1){
 let state=seed>>>0;
 const random=()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296;};
 const base=birch?0x65814d:0x456644;
 const middle=birch?[0x789454,0x829c5b,0x718c50]:[0x5c7d4c,0x668653,0x537447];
 const light=birch?[0x9aaf70,0x90a568]:[0x8ba367,0x7f9b5f];
 g.fillStyle(base).fillEllipse(x,y,rx*1.86,ry*1.8);
 // Each spray has a small shadow and several narrow leaves. No large light disk.
 for(let i=0;i<64;i++){
  const angle=i*2.399963+random()*.2,r=Math.sqrt((i+.5)/64)*.9;
  const xx=x+Math.cos(angle)*rx*r,yy=y+Math.sin(angle)*ry*r;
  const w=rx*(.15+random()*.07),h=ry*(.10+random()*.05);
  const lit=(yy-y)/ry+(xx-x)/rx*.3<-.12;
  g.fillStyle(birch?0x536f43:0x35563b,.65).fillEllipse(xx+w*.12,yy+h*.65,w*1.5,h*1.6);
  g.fillStyle(middle[i%3]).fillEllipse(xx,yy,w*1.7,h*1.7);
  for(let j=0;j<3;j++){
   const lx=xx+(j-1)*w*.48,ly=yy+(j%2?-.35:.15)*h;
   g.fillStyle(lit?light[(i+j)%2]:middle[(i+j+1)%3],.85).fillEllipse(lx,ly,w*.85,h*.55);
  }
 }
}
