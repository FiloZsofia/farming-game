import type Phaser from 'phaser';
export type PaintedPath={width:number;capEnd?:boolean;points:readonly (readonly number[])[]};
// Paint each material across the WHOLE network before moving to the next one.
// Painting complete outlined paths one by one leaves border seams at junctions.
export function drawPathNetwork(g:Phaser.GameObjects.Graphics,paths:readonly PaintedPath[],mapColor:(color:number)=>number=color=>color){
 for(const [extra,color]of [[5,0x738354],[1,0xa5936c],[-3,0xc1ae85]])for(const [index,path]of paths.entries()){
  const width=path.width+extra;g.lineStyle(width,mapColor(color)).beginPath();path.points.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.strokePath();
  for(const [x,y]of path.points.filter((_,i)=>!(index===0&&i===0)&&!(path.capEnd===false&&i===path.points.length-1)))g.fillStyle(mapColor(color)).fillEllipse(x,y,width,width);
 }
}
