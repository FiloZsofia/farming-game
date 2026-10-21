import Phaser from 'phaser';
import {createFarmerSprite,poseFarmer} from './farmer-sprite';
import {WORK_SECONDS,workAngle} from './tool-motion';
export class FarmerArt{
 readonly root:Phaser.GameObjects.Container;
 private leftLeg!:Phaser.GameObjects.Container;private rightLeg!:Phaser.GameObjects.Container;
 private leftArm!:Phaser.GameObjects.Container;private rightArm:Phaser.GameObjects.Container;
 private head!:Phaser.GameObjects.Container;private pony!:Phaser.GameObjects.Container;
 private armX=6.2;private armY=-29;
 private sprite:Phaser.GameObjects.Image|null=null;
 private tool:Phaser.GameObjects.Graphics;private action=0;private phase=0;private equipped='hoe';private actionTool='hoe';private aim={x:0,y:1};
 constructor(scene:Phaser.Scene,neighbor=false){
  this.root=scene.add.container(0,0);
  if(!neighbor){
   this.sprite=createFarmerSprite(scene);this.root.add(this.sprite);
   this.rightArm=scene.add.container(this.armX,this.armY);this.root.add(this.rightArm);
   this.tool=scene.add.graphics();this.rightArm.add(this.tool);this.equip('hoe');return;
  }
  const part=(parent:Phaser.GameObjects.Container,x:number,y:number,w:number,h:number,c:number)=>{const p=scene.add.graphics();p.fillStyle(c);p.fillEllipse(x,y,w,h);parent.add(p);return p;};
  const leg=(x:number)=>{const c=scene.add.container(x,-16);this.root.add(c);part(c,0,5,6,12,neighbor?0x596b78:0x526c43);part(c,-1,5,1,10,0x7c925d);part(c,0,13,6,5,0x654d39);part(c,1,15,6,2,0x3c3d30);return c;};
  this.leftLeg=leg(-3.5);this.rightLeg=leg(3.5);
  this.armX=neighbor?8:6.2;this.armY=neighbor?-30:-29;
  if(neighbor){part(this.root,0,-24,16,18,0x9b7654);part(this.root,-6,-24,2,13,0x73563d);}
  else{
   // Sloping shoulders, fitted sides and a tucked hem give the shirt a real waist.
   const shirt=scene.add.graphics();this.root.add(shirt);
   shirt.fillStyle(0xf0e7cc);shirt.fillPoints([{x:-2,y:-32},{x:-6,y:-29},{x:-5.6,y:-25},{x:-3.6,y:-19},{x:-4.2,y:-16},{x:4.2,y:-16},{x:3.6,y:-19},{x:5.6,y:-25},{x:6,y:-29},{x:2,y:-32}],true);
   shirt.lineStyle(.7,0xc6bea0);shirt.lineBetween(0,-28,0,-17);
   shirt.fillStyle(0xfff5df);shirt.fillTriangle(-2,-32,-3.6,-28,0,-29);shirt.fillTriangle(2,-32,3.6,-28,0,-29);
   part(this.root,0,-32,3.8,4,0xe8b68d);
  }
  part(this.root,0,-16,neighbor?13:8.6,2,0x777548);part(this.root,1,-16,2,1.5,0xcbb477);
  const arm=(x:number)=>{const c=scene.add.container(x,this.armY);this.root.add(c);if(neighbor)part(c,0,4,5,8,0x9b7654);else{const sleeve=scene.add.graphics();sleeve.fillStyle(0xeae1c6);sleeve.fillPoints([{x:-1.5,y:0},{x:1,y:1.5},{x:1.8,y:7.5},{x:-1.5,y:7.5}],true);c.add(sleeve);}part(c,0,8,neighbor?5:3.2,1.5,0xb9b99d);part(c,0,11,3.4,6,0xe0ae83);part(c,-.7,10,1,4,0xf4cba0);return c;};
  this.leftArm=arm(-this.armX);this.rightArm=arm(this.armX);
  this.pony=scene.add.container(3,-48);this.root.add(this.pony);
  const tail=scene.add.graphics();tail.fillStyle(0x61422e);tail.fillEllipse(3,-3,8,8);tail.fillEllipse(7,3,7,12);tail.fillStyle(0x96683f);tail.fillEllipse(3,-4,5,5);tail.fillEllipse(6,2,3,8);this.pony.add(tail);this.pony.visible=!neighbor;
  this.head=scene.add.container(0,-40);this.root.add(this.head);
  const face=scene.add.graphics();this.head.add(face);
  face.fillStyle(0x624631);face.fillEllipse(0,-1,neighbor?17:12.8,18);
  face.fillStyle(0xe8b68d);face.fillEllipse(0,1,neighbor?15:11.8,16);
  face.fillStyle(0xf3cba4);face.fillEllipse(-.6,1,neighbor?13:10.2,14.5);
  face.fillStyle(0x725035);face.fillEllipse(0,-7,neighbor?16:12.5,6);face.fillEllipse(neighbor?-7:-5.7,-3,1.6,6);
  face.fillStyle(0x997047);face.fillEllipse(-1,-7.5,neighbor?10:8,2.4);
  for(const x of [-2.6,2.6]){
   face.fillStyle(0xfff5df);face.fillEllipse(x,.5,3,3.4);
   face.fillStyle(0x61704b);face.fillEllipse(x+.15,.7,1.9,2.7);
   face.fillStyle(0x303c31);face.fillEllipse(x+.2,.8,1,2);
   face.fillStyle(0xffffff);face.fillCircle(x-.2,-.1,.48);
   face.lineStyle(.55,0x624631);face.lineBetween(x-1.3,-1,x+.8,-1.3);
   face.lineStyle(.55,0x805637);face.lineBetween(x-1,-3,x+.7,-3.3);
   face.fillStyle(0xd99483,.6);face.fillEllipse(x*1.35,3.6,2,1.3);
  }
  face.lineStyle(.55,0xc18c6d);face.lineBetween(.3,2,.7,3);
  face.lineStyle(.7,0xa56455);face.beginPath();face.moveTo(-1.6,4.7);face.lineTo(-.6,5.3);face.lineTo(.6,5.3);face.lineTo(1.6,4.7);face.strokePath();
  if(neighbor){part(this.head,0,-9,15,5,0xbba171);part(this.head,0,-6,20,2,0x827450);}
  this.tool=scene.add.graphics();this.rightArm.add(this.tool);this.equip('hoe');
 }
 equip(name:string){this.equipped=name;this.drawTool();}
 use(dx=0,dy=1,tool=this.equipped){this.actionTool=tool;this.action=WORK_SECONDS;this.aim={x:dx,y:dy};}
 private drawTool(){
  const g=this.tool;g.clear();const r=(x:number,y:number,w:number,h:number,c:number)=>{g.fillStyle(c);g.fillRect(x,y,w,h);};
  const name=this.action>0?this.actionTool:this.equipped;
  if(['hoe','axe','pickaxe'].includes(name)){r(0,8,2,21,0x654b32);r(0,8,1,20,0xc6a46b);if(name==='hoe'){r(-2,25,9,3,0x8faaa2);r(4,26,3,6,0x536e69);}if(name==='axe'){g.fillStyle(0x91aaa4);g.fillTriangle(1,23,10,21,8,31);r(8,24,2,5,0xd2d9c4);}if(name==='pickaxe'){r(-7,24,17,2,0x98afa9);r(-8,26,2,3,0xc2cdba);r(9,26,2,3,0xc2cdba);}}
  else if(name==='water'){r(0,12,10,9,0x648f80);r(1,12,8,2,0xa9c4a4);g.lineStyle(2,0x8cab93);g.strokeCircle(5,11,4);g.lineBetween(9,16,15,12);r(14,10,3,4,0xc3d4b8);if(this.action>0){g.fillStyle(0x99d6df);for(let i=0;i<3;i++)g.fillEllipse(16+i*2,17+i*3,1,3);}}
  else if(name==='harvest'){
   // Arched handle, oval opening and tapered woven belly read as a basket at game scale.
   g.lineStyle(2.5,0x6f4c2e);g.strokeEllipse(5,13,12,14);g.lineStyle(1,0xd8b575);g.strokeEllipse(5,12.5,11,13);
   g.fillStyle(0x65472e);g.fillEllipse(5,17,16,6);
   g.fillStyle(0xb78a50);g.fillPoints([{x:-3,y:17},{x:13,y:17},{x:10.5,y:25},{x:7,y:27},{x:2,y:27},{x:-.5,y:25}],true);
   g.fillStyle(0xcc9e60);g.fillEllipse(5,24,11,5);
   for(let y=19;y<=25;y+=2){g.lineStyle(.7,0x866039);g.lineBetween(-1+(y-19)*.2,y,11-(y-19)*.2,y);}
   for(let x=1;x<=9;x+=3){g.lineStyle(.7,0xe4bd7b);g.lineBetween(x,18,x+(5-x)*.17,25);}
   g.lineStyle(1.5,0xe2bd80);g.strokeEllipse(5,17,16,5);g.lineStyle(1,0x765434);g.lineBetween(1,26,9,26);
  }
  else if(['strawberry','honeyberry','blueberry'].includes(name)){r(0,16,9,7,0xb08255);r(-1,15,11,2,0xd0a575);r(4,7,1,8,0x658e49);g.fillStyle(0x8eb866);g.fillEllipse(2,10,5,3);g.fillEllipse(7,8,5,3);}
  else if(['radish','potato','pea'].includes(name)){r(0,12,9,12,0xdfc796);r(1,14,7,6,0xf2e8c7);r(3,15,3,4,name==='radish'?0xdf8791:name==='potato'?0xa58451:0x7caa55);}
 }
 update(walking:boolean,running:boolean,dir:{x:number;y:number},dt:number,jumping=false){
  this.phase+=walking?dt*(running?17:11):0;this.action=Math.max(0,this.action-dt);
  const stride=walking?Math.sin(this.phase)*(running?25:18):0;
  const look=this.action>0?this.aim:dir;
  if(this.sprite){
   poseFarmer(this.sprite,walking,this.phase,look,this.action>0);
   this.rightArm.rotation=this.action>0?workAngle(this.aim.x,this.aim.y+12,this.action,look.x<0):Phaser.Math.DegToRad(stride*.25);
   this.rightArm.setPosition(this.action>0?0:this.armX,this.action>0?-12:this.armY);
   this.rightArm.setScale(1,this.action>0?Phaser.Math.Clamp(Math.hypot(this.aim.x,this.aim.y+12)/31,.4,1.4):1);
   this.root.scaleX=look.x<0?-1:1;this.root.scaleY=1;this.drawTool();return;
  }
  this.leftLeg.angle=stride;this.rightLeg.angle=-stride;this.leftLeg.y=-16+(walking?Math.max(0,Math.sin(this.phase))*2:0);this.rightLeg.y=-16+(walking?Math.max(0,-Math.sin(this.phase))*2:0);
  this.leftArm.angle=-stride*.6;this.rightArm.rotation=this.action>0?workAngle(this.aim.x,this.aim.y+12,this.action,look.x<0):Phaser.Math.DegToRad(stride*.45);
  this.rightArm.setPosition(this.action>0?0:this.armX,this.action>0?-12:this.armY);
  this.rightArm.setScale(1,this.action>0?Phaser.Math.Clamp(Math.hypot(this.aim.x,this.aim.y+12)/31,.4,1.4):1);
  this.head.y=-40+(walking?Math.abs(Math.sin(this.phase))*-.7:0);this.pony.angle=walking?Math.sin(this.phase)*12:0;this.pony.x=3;
  this.root.scaleX=look.x<0?-.98:1;this.root.scaleY=1;this.root.y=jumping?this.root.y:0;
  this.drawTool();
 }
}

// The contact portrait is rendered from the same character, including her outfit and hat.
export function anniePortrait(scene:Phaser.Scene){
 const image=document.createElement('img');image.className='item-icon';image.alt='Annie arcképe kalappal';
 const art=new FarmerArt(scene,true);art.equip('none');art.root.setPosition(40,200).setScale(4);
 const portrait=scene.add.renderTexture(0,0,80,80).setVisible(false);
 portrait.draw(art.root);art.root.destroy();
 portrait.snapshot(result=>{if(result instanceof HTMLImageElement)image.src=result.src;portrait.destroy();});
 return image;
}
