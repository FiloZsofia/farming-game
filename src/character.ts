import Phaser from 'phaser';
export class FarmerArt{
 readonly root:Phaser.GameObjects.Container;
 private leftLeg:Phaser.GameObjects.Container;private rightLeg:Phaser.GameObjects.Container;
 private leftArm:Phaser.GameObjects.Container;private rightArm:Phaser.GameObjects.Container;
 private head:Phaser.GameObjects.Container;private pony:Phaser.GameObjects.Container;
 private tool:Phaser.GameObjects.Graphics;private action=0;private phase=0;private equipped='hoe';
 constructor(scene:Phaser.Scene,neighbor=false){
  this.root=scene.add.container(0,0);
  const part=(parent:Phaser.GameObjects.Container,x:number,y:number,w:number,h:number,c:number)=>{const p=scene.add.rectangle(x,y,w,h,c);parent.add(p);return p;};
  const leg=(x:number)=>{const c=scene.add.container(x,-16);this.root.add(c);part(c,0,5,5,12,neighbor?0x596b78:0x526c43);part(c,-1,5,1,10,0x7c925d);part(c,0,13,6,5,0x654d39);part(c,1,15,6,2,0x3c3d30);return c;};
  this.leftLeg=leg(-3.5);this.rightLeg=leg(3.5);
  part(this.root,0,-24,14,17,neighbor?0x9b7654:0xf0e7cc);part(this.root,-6,-24,2,13,neighbor?0x73563d:0xc9c9ac);part(this.root,1,-20,1,9,0xc3bb96);part(this.root,0,-16,13,3,0x777548);part(this.root,1,-16,3,2,0xcbb477);
  const arm=(x:number)=>{const c=scene.add.container(x,-30);this.root.add(c);part(c,0,4,5,8,neighbor?0x9b7654:0xeae1c6);part(c,0,8,5,2,0xb9b99d);part(c,0,11,4,6,0xe0ae83);part(c,-1,10,1,4,0xf4cba0);return c;};
  this.leftArm=arm(-8);this.rightArm=arm(8);
  this.pony=scene.add.container(8,-38);this.root.add(this.pony);part(this.pony,0,3,5,12,neighbor?0x5c4636:0xb68b43);part(this.pony,-1,4,2,10,neighbor?0x856b4c:0xddb969);part(this.pony,0,-2,5,3,0x718052);this.pony.visible=!neighbor;
  this.head=scene.add.container(0,-40);this.root.add(this.head);
  part(this.head,0,0,14,13,0x9b6c4b);part(this.head,0,1,12,12,0xe9bd93);part(this.head,0,4,10,6,0xf3cda6);part(this.head,0,-6,14,5,neighbor?0x604b39:0xc49b50);part(this.head,-5,-2,3,7,neighbor?0x604b39:0xd5ae61);part(this.head,3,-5,5,3,neighbor?0x806345:0xe6c57e);
  for(const x of [-3,3]){part(this.head,x,1,2,3,0x424a39);part(this.head,x,0,1,1,0xfff4d7);part(this.head,x*1.4,4,2,1,0xd99483);}part(this.head,0,5,2,1,0xb27d61);
  if(neighbor){part(this.head,0,-9,15,5,0xbba171);part(this.head,0,-6,20,2,0x827450);}
  this.tool=scene.add.graphics();this.rightArm.add(this.tool);this.equip('hoe');
 }
 equip(name:string){this.equipped=name;this.drawTool();}
 use(){this.action=.52;}
 private drawTool(){
  const g=this.tool;g.clear();const r=(x:number,y:number,w:number,h:number,c:number)=>{g.fillStyle(c);g.fillRect(x,y,w,h);};
  const name=this.equipped;
  if(['hoe','axe','pickaxe'].includes(name)){r(0,8,2,21,0x654b32);r(0,8,1,20,0xc6a46b);if(name==='hoe'){r(-2,25,9,3,0x8faaa2);r(4,26,3,6,0x536e69);}if(name==='axe'){g.fillStyle(0x91aaa4);g.fillTriangle(1,23,10,21,8,31);r(8,24,2,5,0xd2d9c4);}if(name==='pickaxe'){r(-7,24,17,2,0x98afa9);r(-8,26,2,3,0xc2cdba);r(9,26,2,3,0xc2cdba);}}
  else if(name==='water'){r(0,12,10,9,0x648f80);r(1,12,8,2,0xa9c4a4);g.lineStyle(2,0x8cab93);g.strokeCircle(5,11,4);g.lineBetween(9,16,15,12);r(14,10,3,4,0xc3d4b8);if(this.action>0){g.fillStyle(0x99d6df);for(let i=0;i<3;i++)g.fillEllipse(16+i*2,17+i*3,1,3);}}
  else if(name==='harvest'){r(-1,15,13,8,0xa38051);g.lineStyle(1,0xd7bc80);g.strokeCircle(5,14,5);for(let y=17;y<23;y+=3)g.lineBetween(0,y,11,y);}
  else if(['radish','potato','pea'].includes(name)){r(0,12,9,12,0xdfc796);r(1,14,7,6,0xf2e8c7);r(3,15,3,4,name==='radish'?0xdf8791:name==='potato'?0xa58451:0x7caa55);}
 }
 update(walking:boolean,running:boolean,dir:{x:number;y:number},dt:number,jumping=false){
  this.phase+=walking?dt*(running?17:11):0;this.action=Math.max(0,this.action-dt);
  const stride=walking?Math.sin(this.phase)*(running?25:18):0;
  this.leftLeg.angle=stride;this.rightLeg.angle=-stride;this.leftLeg.y=-16+(walking?Math.max(0,Math.sin(this.phase))*2:0);this.rightLeg.y=-16+(walking?Math.max(0,-Math.sin(this.phase))*2:0);
  this.leftArm.angle=-stride*.6;this.rightArm.angle=this.action>0?-35+Math.sin(this.action/.52*Math.PI*2)*55:stride*.45;
  this.head.y=-40+(walking?Math.abs(Math.sin(this.phase))*-.7:0);this.pony.angle=walking?Math.sin(this.phase)*12:0;this.pony.x=dir.x<0?-8:8;
  this.root.scaleX=dir.x<0?-.98:1;this.root.scaleY=1;this.root.y=jumping?this.root.y:0;
  this.drawTool();
 }
}
