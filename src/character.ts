import Phaser from 'phaser';
import {WORK_SECONDS,workAngle} from './tool-motion';
export class FarmerArt{
 readonly root:Phaser.GameObjects.Container;
 private leftLeg:Phaser.GameObjects.Container;private rightLeg:Phaser.GameObjects.Container;
 private leftArm:Phaser.GameObjects.Container;private rightArm:Phaser.GameObjects.Container;
 private head:Phaser.GameObjects.Container;private pony:Phaser.GameObjects.Container;
 private tool:Phaser.GameObjects.Graphics;private action=0;private phase=0;private equipped='hoe';private actionTool='hoe';private aim={x:0,y:1};
 constructor(scene:Phaser.Scene,neighbor=false){
  this.root=scene.add.container(0,0);
  const part=(parent:Phaser.GameObjects.Container,x:number,y:number,w:number,h:number,c:number)=>{const p=scene.add.graphics();p.fillStyle(c);p.fillRoundedRect(x-w/2,y-h/2,w,h,Math.min(w,h)*.4);parent.add(p);return p;};
  const leg=(x:number)=>{const c=scene.add.container(x,-16);this.root.add(c);part(c,0,5,5,12,neighbor?0x596b78:0x526c43);part(c,-1,5,1,10,0x7c925d);part(c,0,13,6,5,0x654d39);part(c,1,15,6,2,0x3c3d30);return c;};
  this.leftLeg=leg(-3.5);this.rightLeg=leg(3.5);
  part(this.root,0,-24,14,17,neighbor?0x9b7654:0xf0e7cc);part(this.root,-6,-24,2,13,neighbor?0x73563d:0xc9c9ac);part(this.root,1,-20,1,9,0xc3bb96);part(this.root,0,-16,13,3,0x777548);part(this.root,1,-16,3,2,0xcbb477);
  const arm=(x:number)=>{const c=scene.add.container(x,-30);this.root.add(c);part(c,0,4,5,8,neighbor?0x9b7654:0xeae1c6);part(c,0,8,5,2,0xb9b99d);part(c,0,11,4,6,0xe0ae83);part(c,-1,10,1,4,0xf4cba0);return c;};
  this.leftArm=arm(-8);this.rightArm=arm(8);
  this.pony=scene.add.container(3,-48);this.root.add(this.pony);
  const tail=scene.add.graphics();tail.fillStyle(0x61422e);tail.fillEllipse(3,-3,8,8);tail.fillEllipse(7,3,7,12);tail.fillStyle(0x96683f);tail.fillEllipse(3,-4,5,5);tail.fillEllipse(6,2,3,8);tail.fillStyle(0x6d864f);tail.fillRoundedRect(0,-5,5,3,1);this.pony.add(tail);this.pony.visible=!neighbor;
  this.head=scene.add.container(0,-40);this.root.add(this.head);
  const face=scene.add.graphics();this.head.add(face);
  face.fillStyle(0x624631);face.fillEllipse(0,-1,15,16);
  face.fillStyle(0xe8b68d);face.fillEllipse(0,1,13,14);face.fillStyle(0xf3cba4);face.fillEllipse(-1,2,11,11);
  face.fillStyle(0x725035);face.fillEllipse(0,-6,14,7);face.fillEllipse(-5,-2,4,9);face.fillStyle(0x997047);face.fillEllipse(-1,-7,10,3);
  for(const x of [-3,3]){face.fillStyle(0x414536);face.fillEllipse(x,1,1.6,2.5);face.fillStyle(0xf7e7cb);face.fillCircle(x-.25,.4,.45);face.fillStyle(0xd99483,.7);face.fillEllipse(x*1.35,4,2.5,1.5);}
  face.lineStyle(.8,0xa56455);face.beginPath();face.moveTo(-2,4.8);face.lineTo(-.6,5.6);face.lineTo(.7,5.6);face.lineTo(2,4.8);face.strokePath();
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
  else if(name==='harvest'){r(-1,15,13,8,0xa38051);g.lineStyle(1,0xd7bc80);g.strokeCircle(5,14,5);for(let y=17;y<23;y+=3)g.lineBetween(0,y,11,y);}
  else if(['radish','potato','pea'].includes(name)){r(0,12,9,12,0xdfc796);r(1,14,7,6,0xf2e8c7);r(3,15,3,4,name==='radish'?0xdf8791:name==='potato'?0xa58451:0x7caa55);}
 }
 update(walking:boolean,running:boolean,dir:{x:number;y:number},dt:number,jumping=false){
  this.phase+=walking?dt*(running?17:11):0;this.action=Math.max(0,this.action-dt);
  const stride=walking?Math.sin(this.phase)*(running?25:18):0;
  this.leftLeg.angle=stride;this.rightLeg.angle=-stride;this.leftLeg.y=-16+(walking?Math.max(0,Math.sin(this.phase))*2:0);this.rightLeg.y=-16+(walking?Math.max(0,-Math.sin(this.phase))*2:0);
  const look=this.action>0?this.aim:dir;
  this.leftArm.angle=-stride*.6;this.rightArm.rotation=this.action>0?workAngle(this.aim.x,this.aim.y+12,this.action,look.x<0):Phaser.Math.DegToRad(stride*.45);
  this.rightArm.setPosition(this.action>0?0:8,this.action>0?-12:-30);
  this.rightArm.setScale(1,this.action>0?Phaser.Math.Clamp(Math.hypot(this.aim.x,this.aim.y+12)/31,.4,1.4):1);
  this.head.y=-40+(walking?Math.abs(Math.sin(this.phase))*-.7:0);this.pony.angle=walking?Math.sin(this.phase)*12:0;this.pony.x=3;
  this.root.scaleX=look.x<0?-.98:1;this.root.scaleY=1;this.root.y=jumping?this.root.y:0;
  this.drawTool();
 }
}
