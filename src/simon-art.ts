import Phaser from 'phaser';
// Original shared drawing for Simon in the workshop and his face portrait.
export class SimonArt{
 readonly root:Phaser.GameObjects.Container;
 constructor(scene:Phaser.Scene){
  this.root=scene.add.container(0,0);const g=scene.add.graphics(),eyes=scene.add.graphics(),arm=scene.add.container(-11,-27);this.root.add([g,arm,eyes]);const a=scene.add.graphics();arm.add(a);
  const rect=(x:number,y:number,w:number,h:number,c:number,r=1.5)=>g.fillStyle(c).fillRoundedRect(x,y,w,h,r),shape=(p:number[],c:number)=>g.fillStyle(c).fillPoints(Array.from({length:p.length/2},(_,i)=>({x:p[i*2],y:p[i*2+1]})),true);
  rect(-8,-18,7,17,0x555d51);rect(2,-18,7,17,0x555d51);rect(-9,-4,9,5,0x66503c);rect(1,-4,10,5,0x66503c);
  g.fillStyle(0x78939b).fillRoundedRect(-12,-33,24,22,5);rect(-3,-37,6,7,0xd6aa82);shape([-5,-34,-1,-31,-5,-27,-8,-32],0xa3b6b0);shape([5,-34,1,-31,5,-27,8,-32],0xa3b6b0);
  rect(-8,-27,17,21,0x8f6d48);g.lineStyle(2,0xbd9c68).lineBetween(-7,-31,-5,-25).lineBetween(7,-31,6,-25);rect(-5,-17,12,8,0xa58354);g.lineStyle(.7,0xd0af79).lineBetween(-4,-16,6,-16).lineBetween(-4,-9,6,-9);rect(2,-23,1.5,9,0xe2b66c,.4);rect(-3,-21,3,8,0xbeb89a,.4);g.lineStyle(.6,0x786b4d).lineBetween(-3,-18,0,-18).lineBetween(-3,-16,0,-16);
  a.fillStyle(0x78939b).fillRoundedRect(-2,-2,6,9,2);a.fillStyle(0xa8bbb4).fillRoundedRect(-2,5,6,4,1);a.fillStyle(0xdeaf86).fillRoundedRect(-1,9,5,8,2);a.fillStyle(0x9a9d81).fillEllipse(2,17,7,5);a.lineStyle(1,0xd4c28b).lineBetween(0,17,4,17);
  rect(8,-30,5,12,0x78939b);rect(8,-20,5,4,0xa8bbb4);rect(8,-16,5,8,0xdeaf86);
  g.fillStyle(0xd6a17b).fillEllipse(-8,-42,3,6).fillEllipse(8,-42,3,6);
  shape([-7,-49,-3,-52,3,-52,7,-49,8,-42,6,-35,2,-31,-3,-31,-7,-36,-8,-43],0xe1ae85);shape([-5,-47,-2,-50,3,-49,4,-43,1,-37,-4,-38],0xecc09a);shape([5,-45,7,-42,5,-35,1,-33,2,-37],0xca936e);
  // Short, slightly wavy dark hair with just a few grey temple strands.
  shape([-8,-42,-9,-48,-7,-52,-3,-54,1,-53,4,-54,8,-51,9,-45,7,-41,6,-47,2,-48,-1,-47,-4,-49,-6,-46,-6,-41],0x4c3a2d);g.lineStyle(1.1,0x69513b).lineBetween(-6,-50,-2,-51).lineBetween(1,-50,5,-51);g.lineStyle(.8,0x9d9b8e).lineBetween(-7,-45,-7,-41).lineBetween(7,-45,7,-42);
  g.lineStyle(.9,0x5f4933).lineBetween(-5,-45.5,-2,-46).lineBetween(2,-46,5,-45.5);
  for(const x of [-3.4,3.4]){eyes.fillStyle(0xffedda).fillEllipse(x,-43.5,3.7,2.8);eyes.fillStyle(0x74563a).fillEllipse(x,-43.3,1.9,2.4);eyes.fillStyle(0x303d32).fillEllipse(x+.1,-43.2,1,1.7);eyes.fillStyle(0xfff6df).fillCircle(x-.3,-43.9,.45);g.lineStyle(.55,0xa67858).lineBetween(x+(x<0?-3:3),-43,x+(x<0?-2:2),-42);}
  g.lineStyle(.8,0xbe8965).lineBetween(.5,-42,.5,-39).lineBetween(.5,-39,2,-38.8);g.fillStyle(0x655345,.18).fillEllipse(0,-35.5,12,7);for(const [x,y]of [[-5,-37],[-4,-34],[-2,-33],[1,-33],[4,-34],[5,-37]])g.fillStyle(0x6b5845,.45).fillCircle(x,y,.4);g.lineStyle(.8,0x925d46).strokePoints([{x:-2.8,y:-36.5},{x:-1.2,y:-35.7},{x:1.1,y:-35.7},{x:2.8,y:-36.6}]);g.lineStyle(.6,0xefc09a).lineBetween(-1.5,-34.7,1.3,-34.7);
  const update=(time:number)=>{arm.rotation=Math.sin(time/850)*.08;eyes.setVisible(time%5100<4930);};scene.events.on('update',update);this.root.once('destroy',()=>scene.events.off('update',update));
 }
}
export function simonPortrait(scene:Phaser.Scene){const image=document.createElement('img');image.className='item-icon';image.alt='Simon arcképe';const art=new SimonArt(scene);art.root.setPosition(40,193).setScale(3.5);const portrait=scene.add.renderTexture(0,0,80,80).setVisible(false);portrait.draw(art.root);art.root.destroy();portrait.snapshot(result=>{if(result instanceof HTMLImageElement)image.src=result.src;portrait.destroy();});return image;}
