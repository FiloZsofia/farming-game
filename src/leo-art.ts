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
  rect(-2.5,-36,5,6,0xd7a880);
  // Brow, cheekbones and a tapered jaw replace the oval head.
  g.fillStyle(0x6a4931).fillPoints([{x:-7,y:-48},{x:3,y:-50},{x:7,y:-46},{x:7,y:-39},{x:5,y:-33},{x:1,y:-31},{x:-4,y:-32},{x:-7,y:-39}],true);
  g.fillStyle(0xe4b58c).fillPoints([{x:-6,y:-46},{x:4,y:-47},{x:6.5,y:-43},{x:6,y:-38},{x:3.5,y:-33},{x:-2,y:-33},{x:-5.5,y:-37},{x:-6.5,y:-41}],true);
  g.fillStyle(0xf2c9a1).fillEllipse(-2,-41,7,10);g.fillStyle(0xcf9b77).fillEllipse(-6.5,-40,2.5,4).fillEllipse(6.5,-40,2.5,4);
  g.fillStyle(0x654631).fillPoints([{x:-6,y:-40},{x:-4,y:-37},{x:-1,y:-38},{x:2,y:-38},{x:5,y:-40},{x:6,y:-37},{x:4,y:-32},{x:0,y:-30.5},{x:-4,y:-32},{x:-6,y:-36}],true);
  g.fillStyle(0x92704d).fillEllipse(-3,-34,2,3).fillEllipse(3,-34,2,3);
  g.fillStyle(0xe9b890).fillEllipse(0,-36.3,7.5,4);g.lineStyle(1,0x9c5f50).beginPath().moveTo(-2.5,-36.5).lineTo(0,-35.5).lineTo(2.5,-36.5).strokePath();g.lineStyle(.7,0xf3cfab).lineBetween(-1.4,-34.7,1.4,-34.7);
  g.fillStyle(0x66462f).fillEllipse(-2,-49,12,7).fillEllipse(5,-47,6,7);g.fillStyle(0x9e784e).fillEllipse(-3,-50,8,3);g.lineStyle(.7,0xb18b5a).lineBetween(-6,-49,0,-51);
  g.lineStyle(1.1,0x6c4b33).lineBetween(-5,-44.5,-1.5,-45).lineBetween(1.5,-45,5,-44.5);
  g.fillStyle(0xffecd0).fillEllipse(-3.2,-42,3.5,2.6).fillEllipse(3.2,-42,3.5,2.6);g.fillStyle(0x41625a).fillEllipse(-3,-42,1.8,2.5).fillEllipse(3,-42,1.8,2.5);g.fillStyle(0xf9eed8).fillCircle(-3.3,-42.6,.5).fillCircle(2.7,-42.6,.5);
  g.lineStyle(.75,0xb18060).lineBetween(0,-41,1,-38.5);g.lineStyle(.7,0xd3937e).lineBetween(-5,-38,-3.5,-37.5).lineBetween(3.5,-37.5,5,-38);

 }
}
export function leoPortrait(scene:Phaser.Scene){
 const image=document.createElement('img');image.className='item-icon';image.alt='Leo arcképe';const art=new LeoArt(scene);art.root.setPosition(40,185).setScale(3.5);const portrait=scene.add.renderTexture(0,0,80,80).setVisible(false);portrait.draw(art.root);art.root.destroy();portrait.snapshot(result=>{if(result instanceof HTMLImageElement)image.src=result.src;portrait.destroy();});return image;
}
