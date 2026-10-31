import {studyColor} from './art-study-art';
import Phaser from 'phaser';
import {farmLayout} from './layout';

// Original procedural art, enlarged around the same doorway anchor.
export class WorkshopExterior {
 private art:Phaser.GameObjects.Graphics;
 private window:Phaser.GameObjects.Graphics;
 private light:HTMLDivElement;
 private scene:Phaser.Scene;
 private open:boolean|null=null;

 constructor(scene:Phaser.Scene,study=false){
  const x=601+farmLayout.shedOffset.x,y=133+farmLayout.shedOffset.y;
  this.scene=scene;this.art=scene.add.graphics().setDepth(-.9);this.window=scene.add.graphics().setDepth(-.8);this.light=document.createElement('div');this.light.className='workshop-lamp-light';this.light.setAttribute('aria-hidden','true');for(const name of ['halo','pool','core']){const part=document.createElement('i');part.className=name;this.light.append(part);}document.querySelector('#game')!.append(this.light);
  const scale=farmLayout.shedScale;for(const art of [this.art,this.window])art.setScale(scale).setPosition(632*(1-scale),181*(1-scale));
  const g=this.art;
  const rect=(a:number,b:number,w:number,h:number,c:number)=>{g.fillStyle(study?studyColor(c):c).fillRect(x+a,y+b,w,h);};
  const line=(a:number,b:number,c:number,d:number,color:number,width=1)=>{g.lineStyle(width,study?studyColor(color):color).lineBetween(x+a,y+b,x+c,y+d);};
  const poly=(p:number[],c:number,alpha=1)=>{g.fillStyle(study?studyColor(c):c,alpha).fillPoints(p.reduce<Phaser.Types.Math.Vector2Like[]>((v,_,i)=>{if(i%2===0)v.push({x:x+p[i],y:y+p[i+1]});return v;},[]),true);};
  g.fillStyle(0x294231,.25).fillEllipse(x+65,y+73,155,24);
  poly([118,0,130,-8,130,62,118,68],0x665b45);rect(0,0,118,68,0xa4916c);
  for(let i=0;i<118;i+=9){rect(i,2,1,55,0x625640);line(i+3,5,i+3,51,0xc0a77b);line(i+6,24+i%17,i+6,39+i%13,0x8b795b);}
  rect(0,54,118,16,0x686a58);
  for(let row=0;row<2;row++)for(let col=0;col<8;col++){const a=col*16-(row%2)*7;rect(Math.max(0,a),55+row*7,Math.min(15,118-Math.max(0,a)),6,[0x92917b,0xa29d84,0x7b806c][(row+col)%3]);}
  rect(1,1,5,55,0x6f5940);rect(113,1,5,54,0x69543c);line(2,3,2,52,0xb09669);
  // Door, iron hinges and keyhole; threshold meets the existing approach.
  rect(33,15,47,54,0x544a36);rect(37,19,39,49,0x7c6144);
  for(let i=40;i<75;i+=7){line(i,20,i,66,0x4f4230);line(i+2,22,i+2,63,0xa18358);}
  line(39,24,74,60,0xad8b5e,3);line(39,24,74,60,0x7a5e3e);
  for(const b of [28,57]){rect(37,b,11,2,0x3f463e);rect(39,b,1,1,0xb6b097);}
  rect(65,39,4,9,0x343f39);line(67,41,72,41,0xb7b498,2);g.fillStyle(0x171f1c).fillCircle(x+67,y+46,1.2);rect(66.5,46,1,2,0x171f1c);
  rect(30,68,53,5,0x807d68);line(32,69,80,69,0xc0b79a);rect(35,73,44,3,0x9f9679);
  // Slightly asymmetric clay roof: staggered tiles, ridge caps, moss and gutter.
  poly([-13,3,15,-41,96,-43,133,-3,120,5],0x514c3b);
  poly([-10,-1,16,-38,96,-40,128,-5,118,1],0x986d50);
  for(let row=0;row<6;row++){const b=-36+row*6,a=15-row*4.7,end=98+row*4.7;line(a,b+5,end,b+3,0x624c39,1.5);for(let col=a+(row%2)*7;col<end-5;col+=13){line(col,b,col-1,b+5,0x72513d);line(col+2,b+1,col+9,b+1,0xb78a61);}}
  line(15,-40,96,-42,0xc09a70,3);for(let i=20;i<96;i+=12)line(i,-41,i+1,-38,0x725a40);
  for(const [a,b]of [[3,-10],[9,-13],[110,-7],[101,-13],[20,-26]]){g.fillStyle(0x6b7849).fillEllipse(x+a,y+b,9,3);g.fillStyle(0x8c9660).fillEllipse(x+a-1,y+b-1,4,2);}
  line(-10,3,120,1,0x454e43,3);line(-9,2,119,0,0x9c9a7d);line(120,1,122,63,0x4d594c,3);line(121,3,123,60,0x9a9d7d);
  // Sparse ivy stays on the corner, away from the entrance and window.
  line(5,55,9,19,0x53613e);line(9,32,16,18,0x53613e);
  for(let i=0;i<11;i++){const a=5+(i%3)*4,b=17+i*3;g.fillStyle(i%2?0x677a48:0x47633f).fillEllipse(x+a,y+b,6,3);}
  // Terracotta pots sit beside the wall, never across the approach.
  for(const [a,b,s]of [[9,69,1],[22,65,.7]]){g.fillStyle(0x334a32,.25).fillEllipse(x+a,y+b+4,16*s,5*s);poly([a-6*s,b-9*s,a+6*s,b-9*s,a+4*s,b+3*s,a-4*s,b+3*s],0xa16b4d);line(a-7*s,b-9*s,a+7*s,b-9*s,0xd29d71,2);g.fillStyle(0x493f2e).fillEllipse(x+a,y+b-9*s,11*s,3*s);line(a-3*s,b-6*s,a-2*s,b+1*s,0xc38b60);}
  // Wall lantern on the right-hand corner, clear of the shutter.
  line(112,19,119,19,0x37443a,2);line(119,19,119,24,0x37443a,2);rect(115,25,9,12,0x3d493e);rect(117,27,5,8,0xc7b080);poly([113,25,119,21,126,25],0x455044);rect(114,37,11,2,0x37443a);line(119,27,119,35,0x6d7255);

 }
 update(shutter:boolean,darkness:number){
  const x=601+farmLayout.shedOffset.x,y=133+farmLayout.shedOffset.y;
  if(this.open!==shutter){this.open=shutter;const g=this.window;g.clear();g.fillStyle(0x544b36).fillRect(x+86,y+16,23,30);g.fillStyle(0xd1bd90).fillRect(x+87,y+17,21,28);
   if(shutter){g.fillStyle(0x50665b).fillRect(x+89,y+23,17,19);g.fillStyle(0x9aafa0,.65).fillTriangle(x+89,y+23,x+105,y+23,x+89,y+40);g.lineStyle(2,0xb4a078).lineBetween(x+97,y+23,x+97,y+42).lineBetween(x+89,y+32,x+106,y+32);g.fillStyle(0x9b8864).fillRoundedRect(x+87,y+17,21,6,2);}
   else{g.fillStyle(0x87795a).fillRect(x+89,y+19,17,23);for(let i=20;i<43;i+=3)g.lineStyle(1,0x5e5943).lineBetween(x+89,y+i,x+106,y+i);}
   g.fillStyle(0xb8a17a).fillRect(x+84,y+45,27,3);
  }
  const camera=this.scene.cameras.main,z=camera.zoom,scale=farmLayout.shedScale,lx=632+(x+119-632)*scale,ly=181+(y+31-181)*scale;this.light.style.transform=`translate(${(lx-camera.worldView.x)*z}px,${(ly-camera.worldView.y)*z}px) scale(${z*scale})`;this.light.style.opacity=String(Math.min(1,Math.max(0,darkness/.55)));this.light.hidden=!camera.worldView.contains(lx,ly);
 }
 destroy(){this.art.destroy();this.window.destroy();this.light.remove();}
}
