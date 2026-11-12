import type Phaser from 'phaser';
import {drawShrubLeaf} from './foliage-leaf';

/** A simple angular crown with sparse pointed leaves, without overlapping disks. */
export function drawLeafCrown(g:Phaser.GameObjects.Graphics,x:number,y:number,rx:number,ry:number,birch=false,seed=1){
 let state=seed>>>0;
 const random=()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296;};
 const outline=[[-.94,-.18],[-.77,-.56],[-.47,-.65],[-.3,-.91],[.12,-.94],[.37,-.78],[.7,-.72],[.83,-.43],[.97,-.15],[.84,.13],[.9,.4],[.56,.68],[.25,.76],[0,.94],[-.32,.76],[-.6,.7],[-.88,.43]];
 g.fillStyle(birch?0x4f7951:0x365f40).fillPoints(outline.map(([dx,dy])=>({x:x+dx*rx,y:y+dy*ry})),true);
 // Broad connected facets provide depth, rather than pale rounded patches.
 g.fillStyle(birch?0x60885a:0x48754a).fillPoints([[-.84,-.2],[-.47,-.65],[-.3,-.84],[.12,-.87],[.65,-.62],[.71,-.24],[.35,-.06],[.03,.26],[-.37,.1],[-.63,.41]].map(([dx,dy])=>({x:x+dx*rx,y:y+dy*ry})),true);
 for(let i=0;i<19;i++){
  const a=i*2.399963,r=Math.sqrt((i+.5)/19)*.78;
  const xx=x+Math.cos(a)*rx*r,yy=y+Math.sin(a)*ry*r;
  drawShrubLeaf(g,xx,yy,-.8+random()*1.6,yy<y,Math.max(.45,rx/23)*1.1);
 }
}
