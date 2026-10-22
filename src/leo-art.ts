import Phaser from 'phaser';
// Leo's shop sprite and portrait share this original drawing.
export class LeoArt{
 readonly root:Phaser.GameObjects.Container;
 constructor(scene:Phaser.Scene){
  this.root=scene.add.container(0,0);const g=scene.add.graphics();this.root.add(g);
  const rect=(x:number,y:number,w:number,h:number,c:number)=>g.fillStyle(c).fillRoundedRect(x,y,w,h,Math.min(2,w/3));
  rect(-6,-17,5,14,0x586c57);rect(1,-17,5,14,0x586c57);rect(-7,-4,7,4,0x62503c);rect(1,-4,7,4,0x62503c);
  g.fillStyle(0xb3926c).fillPoints([{x:-3,y:-33},{x:-9,y:-29},{x:-7,y:-17},{x:7,y:-17},{x:9,y:-29},{x:3,y:-33}],true);
  rect(-10,-28,4,11,0xc7aa7b);rect(6,-28,4,11,0xc7aa7b);rect(-10,-18,4,6,0xe1b38a);rect(6,-18,4,6,0xe1b38a);
  rect(-6,-29,12,14,0x627e50);rect(-4,-31,2,7,0x8e9a68);rect(3,-31,2,7,0x8e9a68);rect(-3,-24,7,5,0x80915c);rect(1,-23,1,3,0xcaba83);
  rect(-2,-36,4,5,0xd7a880);g.fillStyle(0x664a34).fillEllipse(0,-43,15,18);g.fillStyle(0xe3b68d).fillEllipse(0,-40,13,17);g.fillStyle(0xf0c9a0).fillEllipse(-2,-42,8,9);
  g.fillStyle(0x745437).fillEllipse(-3,-49,11,7).fillEllipse(4,-48,8,6);g.fillStyle(0x9b774b).fillEllipse(-4,-50,7,3);
  g.fillStyle(0xf1e5c5).fillEllipse(-3,-42,3,3).fillEllipse(3,-42,3,3);g.fillStyle(0x3e4b3b).fillEllipse(-3,-42,1.6,2.4).fillEllipse(3,-42,1.6,2.4);
  g.lineStyle(.7,0xb37f60).lineBetween(-.5,-40,.5,-39);g.lineStyle(.8,0x8b6150).beginPath().moveTo(-3,-36).lineTo(0,-35).lineTo(3,-36).strokePath();g.fillStyle(0xc29170,.5).fillEllipse(-4,-38,3,2).fillEllipse(4,-38,3,2);
 }
}
export function leoPortrait(scene:Phaser.Scene){
 const image=document.createElement('img');image.className='item-icon';image.alt='Leo arcképe';const art=new LeoArt(scene);art.root.setPosition(40,210).setScale(4);const portrait=scene.add.renderTexture(0,0,80,80).setVisible(false);portrait.draw(art.root);art.root.destroy();portrait.snapshot(result=>{if(result instanceof HTMLImageElement)image.src=result.src;portrait.destroy();});return image;
}
