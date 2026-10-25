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
  // A new face: sculpted cheekbones, open eyes, a visible smile and a neat full beard.
  const shape=(points:number[],color:number)=>g.fillStyle(color).fillPoints(Array.from({length:points.length/2},(_,i)=>({x:points[i*2],y:points[i*2+1]})),true);
  g.fillStyle(0xd9a780).fillEllipse(-7,-40.8,3,5).fillEllipse(7,-40.8,3,5);
  shape([-6.5,-46.5,-3,-49,3,-49,6.5,-46,6.8,-40.5,5.4,-35,2.8,-31.8,-2.8,-31.8,-5.4,-35,-6.8,-40.5],0xe8b78e);
  shape([-5.7,-44.6,-2.8,-47.2,2,-47.5,4,-44.6,3,-39.5,0,-36,-4,-37.8],0xf1c69f);
  shape([4.8,-44,6.5,-42.4,5.4,-36,2.7,-33,2,-36.6],0xd29b76);
  // One consistent brown for the swept hair and short sideburns.
  shape([-7.1,-42.5,-7.4,-47,-5.7,-50,-1.5,-51.5,4.4,-50.9,7.2,-48.7,7.4,-43,5.6,-40.7,5.4,-46.4,1,-47.1,-3,-46,-5.7,-45.5,-5.7,-41],0x63432e);
  g.lineStyle(1,0x63432e).lineBetween(-5,-44,-1.8,-44.5).lineBetween(1.8,-44.5,5,-43.8);
  for(const x of [-3.1,3.1]){g.fillStyle(0xffefdc).fillEllipse(x,-42.2,3.6,2.7);g.fillStyle(0x527069).fillEllipse(x+.1,-42.1,1.7,2.5);g.fillStyle(0x293f38).fillEllipse(x+.2,-42,1,1.7);g.fillStyle(0xfff8e8).fillCircle(x-.25,-42.7,.45);g.lineStyle(.55,0x73533c).lineBetween(x-1.7,-43.1,x+1.4,-43.1);}
  g.lineStyle(.65,0xbb8865).lineBetween(.1,-41.4,.8,-38.8).lineBetween(.8,-38.8,-.3,-38.5);
  // Trimmed beard follows the jaw, leaving the mouth readable.
  shape([-6.1,-39.9,-4.4,-37.4,-2,-37.1,0,-38,2,-37.1,4.5,-37.7,6.1,-40,5.8,-35,3.7,-31.5,0,-30.4,-3.7,-31.5,-5.8,-35],0x63432e);
  g.fillStyle(0xe8b58d).fillEllipse(0,-35.9,6.6,2.7);
  g.lineStyle(.85,0x915747).strokePoints([{x:-2.3,y:-36.2},{x:-1,y:-35.6},{x:1,y:-35.6},{x:2.4,y:-36.4}]);
  g.lineStyle(.6,0xf3c9a1).lineBetween(-1.4,-34.6,1.5,-34.6);


 }
}
export function leoPortrait(scene:Phaser.Scene){
 const image=document.createElement('img');image.className='item-icon';image.alt='Leo arcképe';const art=new LeoArt(scene);art.root.setPosition(40,185).setScale(3.5);const portrait=scene.add.renderTexture(0,0,80,80).setVisible(false);portrait.draw(art.root);art.root.destroy();portrait.snapshot(result=>{if(result instanceof HTMLImageElement)image.src=result.src;portrait.destroy();});return image;
}
