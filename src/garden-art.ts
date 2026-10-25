import type Phaser from 'phaser';
import {TILE,isRipe,type Garden} from './gardening';
import {drawCrop,drawRipeMarker} from './crop-art';
// Soil first, plants second, ripe badges last: insertion order cannot hide a harvest.
export function drawGardenPlots(g:Phaser.GameObjects.Graphics,garden:Garden){
 const plots=[...garden.plots].map(([key,plot])=>{const [x,y]=key.split(',').map(Number);return {x,y,plot};}).sort((a,b)=>a.y-b.y||a.x-b.x);
 for(const {x,y,plot}of plots){g.save().translateCanvas(x+TILE/2,y+TILE/2).scaleCanvas(.9,.9).translateCanvas(-x-TILE/2,-y-TILE/2);g.fillStyle(plot.watered?0x493f31:0x88603f).fillRect(x+1,y+1,TILE-2,TILE-2);g.lineStyle(1,plot.watered?0x635b43:0xa17b51);for(let row=4;row<TILE;row+=4)g.lineBetween(x+3,y+row,x+TILE-3,y+row);if(plot.mulched){g.lineStyle(1.4,plot.watered?0x9d8655:0xb99b64);for(const [dx,dy]of [[4,5],[17,6],[5,17],[16,19]])g.lineBetween(x+dx,y+dy,x+dx+3,y+dy-2);}g.restore();}
 for(const {x,y,plot}of plots){g.save().translateCanvas(x+TILE/2,y+TILE/2).scaleCanvas(.9,.9).translateCanvas(-x-TILE/2,-y-TILE/2);drawCrop(g,x,y,plot);if(plot.watered)g.fillStyle(0x83b8c5).fillRect(x+TILE-4,y+3,2,3);g.restore();}
 let markers=0;for(const {x,y,plot}of plots)if(isRipe(plot)){drawRipeMarker(g,x+TILE*.75,y-5);markers++;}return markers;
}
