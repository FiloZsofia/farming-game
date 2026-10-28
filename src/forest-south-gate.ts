import type Phaser from 'phaser';
import {drawWoodlandTree} from './woodland-tree';
export function drawForestSouthGate(scene:Phaser.Scene,closed:boolean){
 const root=scene.add.container(0,0).setDepth(.7),g=scene.add.graphics();root.add(g);
 const x=-444,y=1295;
 if(closed){
  // Overlapping woodland silhouettes conceal the unreleased southern region.
  g.fillStyle(0x36583b).fillPoints([{x:-1120,y:1370},{x:-1000,y:1345},{x:-850,y:1370},{x:-650,y:1340},{x:-430,y:1355},{x:-200,y:1330},{x:0,y:1370},{x:0,y:2300},{x:-1120,y:2300}],true);
  let seed=813;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  for(let row=2;row>=0;row--)for(let column=0;column<17;column++){const xx=-1110+column*67+random()*17,yy=1370+row*55+random()*17;drawWoodlandTree(g,random,xx,yy,column%3,1.05);}
  for(const side of [-1,1]){g.fillStyle(0x5c4430).fillRect(x+side*46-4,y-40,8,49);g.fillStyle(0xa17b4b).fillRect(x+side*46-3,y-42,6,5);}
  g.lineStyle(8,0x795231).lineBetween(x-47,y-27,x+47,y-18).lineBetween(x-47,y-10,x+47,y-3);g.lineStyle(1,0xb18b53).lineBetween(x-47,y-30,x+47,y-21);
  g.lineStyle(2,0xb9b9a0).strokePoints([{x:x-30,y:y-23},{x:x-10,y:y-13},{x:x+12,y:y-14},{x:x+30,y:y-20}]);g.fillStyle(0x5e6358).fillRoundedRect(x-3,y-17,9,11,2);
 }
 // The warning remains beside the open route after access becomes available.
 g.fillStyle(0x5e4932).fillRect(x+69,y-34,4,43);g.fillStyle(0x9b7950).fillRoundedRect(x+42,y-66,58,37,3);g.lineStyle(1,0xc0a16b).strokeRoundedRect(x+42,y-66,58,37,3);
 g.fillStyle(0xe0bd73).fillTriangle(x+71,y-61,x+60,y-43,x+82,y-43);g.lineStyle(2,0x4a3a28).lineBetween(x+71,y-56,x+71,y-50);g.fillStyle(0x4a3a28).fillCircle(x+71,y-47,1);
 const text=scene.add.text(x+71,y-39,'VESZÉLY',{fontFamily:'sans-serif',fontSize:'6px',color:'#f4e5bc'}).setOrigin(.5);root.add(text);return root;
}
