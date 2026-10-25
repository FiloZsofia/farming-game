import type Phaser from 'phaser';
export type PaintedPath={width:number;points:readonly (readonly number[])[]};
// Paint each material across the WHOLE network before moving to the next one.
// Painting complete outlined paths one by one leaves border seams at junctions.
export function drawPathNetwork(g:Phaser.GameObjects.Graphics,paths:readonly PaintedPath[]){
 for(const [extra,color]of [[5,0x738354],[1,0xa5936c],[-3,0xc1ae85]])for(const [index,path]of paths.entries()){
  const width=path.width+extra;g.lineStyle(width,color).beginPath();path.points.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.strokePath();
  for(const [x,y]of index===0?path.points.slice(1):path.points)g.fillStyle(color).fillEllipse(x,y,width,width);
 }
}
