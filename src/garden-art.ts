import type Phaser from 'phaser';
import {TILE,isRipe,type Garden} from './gardening';
import {drawCrop,drawRipeMarker} from './crop-art';
// Soil first, plants second, ripe badges last: insertion order cannot hide a harvest.
export function drawGardenPlots(g:Phaser.GameObjects.Graphics,garden:Garden){
 const plots=[...garden.plots].map(([key,plot])=>{const [x,y]=key.split(',').map(Number);return {x,y,plot};}).sort((a,b)=>a.y-b.y||a.x-b.x);
 for(const {x,y,plot}of plots){g.fillStyle(plot.watered?0x493f31:0x88603f).fillRect(x+1,y+1,TILE-2,TILE-2);g.lineStyle(1,plot.watered?0x635b43:0xa17b51);for(let row=4;row<TILE;row+=4)g.lineBetween(x+3,y+row,x+TILE-3,y+row);}
 for(const {x,y,plot}of plots){drawCrop(g,x,y,plot);if(plot.watered)g.fillStyle(0x83b8c5).fillRect(x+TILE-4,y+3,2,3);}
 let markers=0;for(const {x,y,plot}of plots)if(isRipe(plot)){drawRipeMarker(g,x+12,y-4);markers++;}return markers;
}
