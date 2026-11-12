import type Phaser from 'phaser';
export function drawLily(g:Phaser.GameObjects.Graphics,x:number,y:number){
 for(const [dx,dy,r]of [[-8,3,14],[10,6,12]]){
  const points=Array.from({length:20},(_,i)=>{const a=i/20*Math.PI*2,w=1+.025*Math.sin(i*2.8);return{x:x+dx+Math.cos(a)*r*w,y:y+dy+Math.sin(a)*r*.48*w};});
  g.fillStyle(0x294f43,.4).fillEllipse(x+dx+1,y+dy+2,r*2,r*.95);g.fillStyle(0x477454).fillPoints(points,true);
  g.fillStyle(0x668b5e,.65).fillEllipse(x+dx-2,y+dy-1,r*1.55,r*.64);
  for(let j=0;j<6;j++){const a=j*Math.PI/3;g.lineStyle(.55,0x91a57b,.65).lineBetween(x+dx,y+dy,x+dx+Math.cos(a)*r*.82,y+dy+Math.sin(a)*r*.39);}
  g.fillStyle(0x719292).fillTriangle(x+dx,y+dy,x+dx+r,y+dy-1.5,x+dx+r*.8,y+dy+2.5);
 }
 g.fillStyle(0x35584c,.35).fillEllipse(x,y-1,23,7);
 for(const [count,radius,h]of [[10,8,4.2],[8,5.5,5],[6,3,6]])for(let i=0;i<count;i++){
  const a=i/count*Math.PI*2,px=x+Math.cos(a)*radius,py=y-5+Math.sin(a)*radius*.4;
  g.fillStyle(i%2?0xd4b7b5:0xe3cdbe).fillPoints([{x,y:y-3},{x:px-2,y:py},{x:px,y:py-h},{x:px+2,y:py},{x:x+1,y:y-3}],true);
  g.lineStyle(.45,0xf0dfce,.7).lineBetween(x,y-4,px,py-h+1);
 }
 g.fillStyle(0xc3a45d).fillEllipse(x,y-5,5,3);g.fillStyle(0xe2cb89).fillEllipse(x-1,y-6,2,1.5);
}
export function drawDuckNest(g:Phaser.GameObjects.Graphics,x:number,y:number){
 g.fillStyle(0x354c35,.3).fillEllipse(x+2,y+4,37,15);g.fillStyle(0x725b3f).fillEllipse(x,y,34,20);g.fillStyle(0x9c8053).fillEllipse(x,y-2,32,18);
 g.fillStyle(0x4f4a33).fillEllipse(x,y-4,21,11);g.fillStyle(0x71603d).fillEllipse(x,y-2,19,6);
 for(let ring=0;ring<3;ring++)for(let i=0;i<21;i++){
  const a=i/21*Math.PI*2+ring*.17,rx=11+ring*2,ry=5+ring*1.3,xx=x+Math.cos(a)*rx,yy=y-3+Math.sin(a)*ry;
  g.lineStyle(.9,i%3?0xb09664:0x79603d).lineBetween(xx-Math.sin(a)*2.3,yy+Math.cos(a),xx+Math.sin(a)*2.3,yy-Math.cos(a));
 }
 for(let i=0;i<11;i++){const a=i*2.4,xx=x+Math.cos(a)*11,yy=y-4+Math.sin(a)*3;g.lineStyle(.65,i%2?0xc3ab77:0x9d8456).lineBetween(xx-2,yy,xx+3,yy+(i%3-1)*2);}
}
