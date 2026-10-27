import Phaser from 'phaser';
import {WORK_SECONDS,WORK_CONTACT,workPose,workProgress,heavyTool,gentleWorkAngle} from './tool-motion';
export class FarmerArt{
 readonly root:Phaser.GameObjects.Container;
 private leftLeg:Phaser.GameObjects.Container;private rightLeg:Phaser.GameObjects.Container;
 private leftArm:Phaser.GameObjects.Container;private rightArm:Phaser.GameObjects.Container;
 private head:Phaser.GameObjects.Container;private pony:Phaser.GameObjects.Container;
 private armX:number;private armY:number;private carrying=false;
 setCarrying(value:boolean){this.carrying=value;}
 rummagePose(t:number){this.root.y=7+Math.sin(t*16);this.root.rotation=.08;this.head.y=-37;this.leftArm.setAngle(-65+Math.sin(t*22)*12);this.rightArm.setAngle(60-Math.sin(t*22)*15);}
 private contact:(()=>void)|null=null;private toolEnd=29;
 private tool:Phaser.GameObjects.Graphics;private action=0;private throwing=0;private phase=0;private equipped='hoe';private actionTool='hoe';private aim={x:0,y:1};
 constructor(private scene:Phaser.Scene,neighbor=false){
  this.root=scene.add.container(0,0);
  if(!neighbor){
   // First brown-haired appearance, restored from 8d40544.
   this.armX=6.8;this.armY=-29;
  const part=(parent:Phaser.GameObjects.Container,x:number,y:number,w:number,h:number,c:number)=>{const p=scene.add.graphics();p.fillStyle(c);p.fillRoundedRect(x-w/2,y-h/2,w,h,Math.min(w,h)*.4);parent.add(p);return p;};
  const leg=(x:number)=>{const c=scene.add.container(x,-16);this.root.add(c);part(c,0,5,5,12,neighbor?0x596b78:0x526c43);part(c,-1,5,1,10,0x7c925d);part(c,0,13,6,5,0x654d39);part(c,1,15,6,2,0x3c3d30);return c;};
  this.leftLeg=leg(-3.5);this.rightLeg=leg(3.5);
  const shirt=scene.add.graphics();shirt.fillStyle(0xf0e7cc);shirt.fillPoints([{x:-2,y:-32.5},{x:-6,y:-29},{x:-7,y:-25},{x:-7,y:-16},{x:7,y:-16},{x:7,y:-25},{x:6,y:-29},{x:2,y:-32.5}],true);this.root.add(shirt);part(this.root,-6,-24,2,13,neighbor?0x73563d:0xc9c9ac);part(this.root,1,-20,1,9,0xc3bb96);part(this.root,0,-16,13,3,0x777548);part(this.root,1,-16,3,2,0xcbb477);
  const arm=(x:number)=>{const c=scene.add.container(x,this.armY);this.root.add(c);const sleeve=scene.add.graphics();sleeve.fillStyle(0xeae1c6);sleeve.fillPoints([{x:-1.5,y:0},{x:1,y:1},{x:1.8,y:7},{x:-1.4,y:7}],true);c.add(sleeve);part(c,0,7,3.4,1.5,0xb9b99d);part(c,0,10,3.4,6,0xe0ae83);part(c,-.6,9,1,4,0xf4cba0);return c;};
  this.leftArm=arm(-this.armX);this.rightArm=arm(this.armX);
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
   return;
  }
  // Annie's long blond hair falls behind her shoulders; Sam's artwork is unchanged.
  const backHair=scene.add.graphics();this.root.add(backHair);backHair.fillStyle(0xb89556).fillRoundedRect(-9,-47,18,29,7);backHair.fillStyle(0xd9bb78).fillRoundedRect(-8,-44,16,25,5);backHair.lineStyle(1,0xf1d69a).lineBetween(-6,-38,-6.5,-22).lineBetween(6,-38,6.5,-22);backHair.lineStyle(.7,0xb29052).lineBetween(-3,-32,-3,-20).lineBetween(3,-32,3,-20);
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
  face.fillStyle(0xb89556);face.fillEllipse(0,-1,neighbor?17:12.8,18);
  face.fillStyle(0xe8b68d);face.fillEllipse(0,1,neighbor?15:11.8,16);
  face.fillStyle(0xf3cba4);face.fillEllipse(-.6,1,neighbor?13:10.2,14.5);
  face.fillStyle(0xd9bb78);face.fillEllipse(0,-7,neighbor?16:12.5,6);face.fillEllipse(neighbor?-7:-5.7,-3,1.6,6);
  face.fillStyle(0xf0d59a);face.fillEllipse(-1,-7.5,neighbor?10:8,2.4);
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
 async surprise(){
  this.cancelWork();this.equip('none');
  await Promise.all([new Promise<void>(resolve=>this.scene.tweens.add({targets:this.leftArm,angle:-170,duration:160,hold:650,yoyo:true,onComplete:()=>resolve()})),new Promise<void>(resolve=>this.scene.tweens.add({targets:this.rightArm,angle:170,duration:160,hold:650,yoyo:true,onComplete:()=>resolve()}))]);
 }
 equip(name:string){this.equipped=name;this.drawTool();}
 throwFish(dx:number){this.action=0;this.throwing=.85;this.aim={x:dx,y:0};this.equip('hand');}
 isWorking(){return this.action>0;}
 cancelWork(){this.action=0;this.contact=null;this.leftArm.setAngle(0);this.rightArm.setAngle(0).setPosition(this.armX,this.armY).setScale(1);this.tool.setScale(1).setY(0);this.root.setPosition(0,0).setRotation(0).setScale(1);this.head.y=-40;this.pony.angle=0;this.leftLeg.angle=0;this.rightLeg.angle=0;this.drawTool();}
 use(dx=0,dy=1,tool=this.equipped,onContact?:()=>void){this.actionTool=tool;this.action=WORK_SECONDS;this.aim={x:dx,y:dy};this.contact=onContact??null;}
 workFrame(){if(!this.isWorking())return null;const tip=this.tool.getWorldTransformMatrix().transformPoint(0,this.toolEnd);return {tool:this.actionTool,progress:workProgress(this.action),phase:workPose(1,1,this.action).phase,tip:{x:tip.x,y:tip.y}};}
 private drawTool(){
  const g=this.tool;g.clear();const r=(x:number,y:number,w:number,h:number,c:number)=>{g.fillStyle(c);g.fillRect(x,y,w,h);};
  const name=this.action>0?this.actionTool:this.equipped;
  if(name==='stick'){this.toolEnd=36;g.lineStyle(3,0x785537).strokePoints([{x:0,y:5},{x:1,y:31},{x:5,y:37}]);g.lineStyle(1,0xcfad77).lineBetween(-1,7,0,30);}
  else if(name==='crowbar'){this.toolEnd=34;g.lineStyle(3.5,0x556e61).strokePoints([{x:0,y:7},{x:0,y:29},{x:4,y:35},{x:9,y:34},{x:10,y:29}]);g.lineStyle(1.1,0xc8d4b8).lineBetween(-1,8,-1,28).lineBetween(4,33,8,32);}
  else if(heavyTool(name)){const length=this.action>0?29+11*workPose(1,1,this.action).extension:29;this.toolEnd=length;
   r(0,8,2,length-7,0x654b32);r(0,8,1,length-8,0xc6a46b);
   if(name==='hoe'){r(-2,length-4,9,3,0x8faaa2);r(4,length-3,3,6,0x536e69);}
   if(name==='axe'){g.fillStyle(0x91aaa4).fillTriangle(1,length-6,11,length-9,9,length+2);r(8,length-6,2,6,0xd2d9c4);}
   if(name==='pickaxe'){r(-8,length-5,18,2,0x98afa9);r(-9,length-3,2,3,0xc2cdba);r(9,length-3,2,3,0xc2cdba);}
  }
  else if(name==='water'){r(0,12,10,9,0x648f80);r(1,12,8,2,0xa9c4a4);g.lineStyle(2,0x8cab93);g.strokeCircle(5,11,4);g.lineBetween(9,16,15,12);r(14,10,3,4,0xc3d4b8);if(this.action>0){g.fillStyle(0x99d6df);for(let i=0;i<3;i++)g.fillEllipse(16+i*2,17+i*3,1,3);}}
  else if(name==='harvest'){r(-1,15,13,8,0xa38051);g.lineStyle(1,0xd7bc80);g.strokeCircle(5,14,5);for(let y=17;y<23;y+=3)g.lineBetween(0,y,11,y);}
  else if(['strawberry','honeyberry','blueberry'].includes(name)){r(0,16,9,7,0xb08255);r(-1,15,11,2,0xd0a575);r(4,7,1,8,0x658e49);g.fillStyle(0x8eb866);g.fillEllipse(2,10,5,3);g.fillEllipse(7,8,5,3);}
  else if(['radish','potato','pea','carrot','lettuce','onion'].includes(name)){r(0,12,9,12,0xdfc796);r(1,14,7,6,0xf2e8c7);r(3,15,3,4,name==='radish'?0xdf8791:name==='potato'?0xa58451:0x7caa55);}
 }
 update(walking:boolean,running:boolean,dir:{x:number;y:number},dt:number,jumping=false){
  const previous=this.action;this.phase+=walking?dt*(running?17:11):0;this.action=Math.max(0,this.action-dt);const contact=previous>WORK_SECONDS*(1-WORK_CONTACT)&&this.action<=WORK_SECONDS*(1-WORK_CONTACT)?this.contact:null;if(contact)this.contact=null;
  const stride=walking?Math.sin(this.phase)*(running?25:18):0;
  this.leftLeg.angle=stride;this.rightLeg.angle=-stride;this.leftLeg.y=-16+(walking?Math.max(0,Math.sin(this.phase))*2:0);this.rightLeg.y=-16+(walking?Math.max(0,-Math.sin(this.phase))*2:0);
  this.throwing=Math.max(0,this.throwing-dt);
  const look=this.action>0||this.throwing>0?this.aim:dir;
  const working=this.action>0,heavy=working&&heavyTool(this.actionTool),mirror=look.x<0;
  const shoulderDx=this.aim.x-(mirror?-this.armX:this.armX),shoulderDy=this.aim.y-this.armY;
  const pose=workPose(shoulderDx,shoulderDy,this.action,mirror);
  this.leftArm.rotation=heavy?pose.angle*.78:Phaser.Math.DegToRad(-stride*.6);
  this.rightArm.rotation=working?(heavy?pose.angle:gentleWorkAngle(shoulderDx,shoulderDy,this.action,mirror)):Phaser.Math.DegToRad(stride*.45);
  this.rightArm.setPosition(this.armX+(heavy?pose.weight*3:0),this.armY+(heavy?Math.max(0,pose.weight)*5:0)).setScale(1);
  this.tool.setScale(1,heavy?pose.reach:1).setY(heavy?12-12*pose.reach:0);
  if(heavy&&this.actionTool==='crowbar'&&workProgress(this.action)>.6){this.rightArm.rotation-=Math.sin((workProgress(this.action)-.6)/.4*Math.PI)*.28;}
  this.root.x=heavy?pose.weight*2:0;this.root.rotation=heavy?pose.weight*.045:0;
  if(heavy&&!walking){this.leftLeg.angle=-4*pose.weight;this.rightLeg.angle=4*pose.weight;}
  if(this.throwing>0){const t=1-this.throwing/.85;this.rightArm.setPosition(this.armX,this.armY).setScale(1);this.rightArm.rotation=-Math.sin(t*Math.PI)*2.8;this.leftArm.rotation=Math.sin(t*Math.PI)*.35;}
  if(working&&['harvest','restore','search'].includes(this.actionTool)){
   const t=workProgress(this.action),gather=this.actionTool==='harvest',bend=Math.sin(Math.min(1,t/.6)*Math.PI/2)*(t<.6?1:1-(t-.6)/.4),pull=gather?Math.sin(Math.max(0,(t-.45)/.55)*Math.PI):0;
   this.root.y=4*bend-3*pull;this.root.rotation=(mirror?-.07:.07)*bend;this.leftLeg.angle=-9*bend;this.rightLeg.angle=9*bend;this.leftArm.rotation=gentleWorkAngle(shoulderDx,shoulderDy,this.action,mirror)*.7-.28*bend;this.rightArm.rotation=gentleWorkAngle(shoulderDx,shoulderDy,this.action,mirror)-pull*.7;
  }
  this.head.y=-40+(heavy?pose.weight*1.5:0)+(walking?Math.abs(Math.sin(this.phase))*-.7:0);this.pony.angle=heavy?-pose.weight*9:walking?Math.sin(this.phase)*12:0;this.pony.x=3;
  this.root.scaleX=look.x<0?-.98:1;this.root.scaleY=1;this.root.y=jumping||working&&['harvest','restore','search'].includes(this.actionTool)?this.root.y:heavy?Math.max(0,pose.weight)*1.5:0;
  this.drawTool();if(this.carrying){this.leftArm.setAngle(-65);this.rightArm.setAngle(65);this.tool.clear();}if(contact)contact();
 }
}

// The contact portrait is rendered from the same character, including her outfit and hat.
export function anniePortrait(scene:Phaser.Scene){
 const image=document.createElement('img');image.className='item-icon';image.alt='Annie arcképe hosszú, szőke hajjal';
 const art=new FarmerArt(scene,true);art.equip('none');art.root.setPosition(40,200).setScale(4);
 const portrait=scene.add.renderTexture(0,0,80,80).setVisible(false);
 portrait.draw(art.root);art.root.destroy();
 portrait.snapshot(result=>{if(result instanceof HTMLImageElement)image.src=result.src;portrait.destroy();});
 return image;
}
