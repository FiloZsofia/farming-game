import Phaser from 'phaser';
import type {Clearing} from './cleanup';
import {junkSites,junkPoint,junkProgress,junkScale,junkWorkPoint} from './junk-sites';
export function drawJunkSites(scene:Phaser.Scene,clearing:Clearing,day:number){
 const root=scene.add.container(0,0).setDepth(.7),indicators=scene.add.graphics().setDepth(175);root.once('destroy',()=>indicators.destroy());const markers:{x:number;y:number;hits:number}[]=[];root.setData('indicators',indicators);root.setData('markers',markers);
 for(const site of junkSites){const p=junkPoint(clearing,site.id),progress=junkProgress(clearing,site.id,day),g=scene.add.graphics();root.add(g);g.save().translateCanvas(p.x,p.y).scaleCanvas(junkScale,junkScale).translateCanvas(-p.x,-p.y);
  const rect=(x:number,y:number,w:number,h:number,c:number)=>g.fillStyle(c).fillRoundedRect(p.x+x,p.y+y,w,h,1.5),oval=(x:number,y:number,w:number,h:number,c:number,a=1)=>g.fillStyle(c,a).fillEllipse(p.x+x,p.y+y,w,h),line=(x:number,y:number,xx:number,yy:number,c:number,w=1)=>g.lineStyle(w,c).lineBetween(p.x+x,p.y+y,p.x+xx,p.y+yy),poly=(a:number[],c:number)=>g.fillStyle(c).fillPoints(Array.from({length:a.length/2},(_,i)=>({x:p.x+a[i*2],y:p.y+a[i*2+1]})),true);
  const wheel=(x:number,y:number,r:number)=>{oval(x+2,y+3,r*2+3,r+8,0x273c31,.3);oval(x,y,r*2,r*2,0x3b4037);oval(x,y,r*1.45,r*1.45,0x595c4b);oval(x,y,r*.85,r*.85,0xb09b6b);for(let i=0;i<5;i++){const a=i*Math.PI*.4;line(x,y,x+Math.cos(a)*r*.55,y+Math.sin(a)*r*.55,0x777b69,1.5);}oval(x,y,4,4,0xd0ba86);};
  oval(3,20,149,36,0x263c2f,.3);oval(-9,20,111,20,0x6d7348,.35);
  if(site.id==='vehicle'){
   wheel(-42,10,15);wheel(44,13,16);line(-57,4,61,8,0x595e51,7);line(-54,0,59,4,0xa3966d,2);line(-39,9,45,13,0x514c3c,3);
   // A broken cab, open engine bay and a wooden rear platform.
   poly([-16,-45,9,-49,27,-35,26,1,-17,0],0x826348);poly([-14,-43,8,-46,21,-34,20,-2,-13,-3],0xa08257);poly([-10,-41,6,-43,17,-33,-10,-30],0x3c514a);poly([-8,-39,2,-40,-8,-32],0x8fa69b);line(7,-42,15,-34,0xc6b98f);line(-15,-45,10,-49,0xc2a070,3);line(11,-45,26,-33,0x6b5640,3);rect(-8,-23,21,18,0x91634b);line(-5,-21,10,-22,0xc3946a);rect(8,-15,4,2,0xd8c391);
   poly([-58,-21,-27,-28,-15,-18,-18,1,-57,-1],0x657a55);poly([-55,-19,-29,-25,-21,-18,-28,-11,-54,-10],0x8e9a68);poly([-49,-11,-30,-13,-24,-3,-51,-3],0x3e4c3d);for(let i=0;i<4;i++)line(-48+i*5,-10,-46+i*5,-2,0x979d81,2);line(-26,-21,-20,-7,0x74654d,3);oval(-52,-16,7,6,0xc4b58d);line(-56,1,-61,7,0x8e7957,4);
   rect(27,-8,38,8,0x73543b);for(let i=0;i<4;i++){line(28,-8+i*2,62,-7+i*2,0xae8a57);rect(31+i*8,-9,2,8,0x5c604b);}line(24,-16,62,-12,0x7b6346,3);line(24,-18,24,0,0x8d7853,3);line(62,-13,63,1,0x8d7853,3);
   oval(-34,-23,10,4,0x7f6a48);oval(16,-7,7,4,0x6c7849);line(-8,-3,-5,-10,0x9e704f);
  }else if(site.id==='trailer'){
   wheel(-35,8,14);wheel(43,-22,14);poly([-60,-27,48,-18,59,17,-50,11],0x78573d);poly([-55,-23,44,-15,52,11,-47,6],0xa08052);
   for(let i=0;i<6;i++){const x=-46+i*15;line(x,-21,x+8,8,0x674e37,2);line(x+3,-19,x+9,5,0xc3a174);}
   line(-60,-27,48,-18,0x58614f,5);line(-50,11,59,17,0x58614f,5);line(-60,-27,-50,11,0x8b9277,3);line(48,-18,59,17,0x8b9277,3);line(-40,-24,45,14,0x615842,4);line(-38,-24,47,12,0xa79b70);line(56,9,76,21,0x777960,4);oval(77,22,10,7,0x4a5244);oval(77,22,5,3,0x9c9b7c);rect(-53,-16,11,3,0x5c5340);rect(25,2,17,4,0x6d4e3a);
  }else{
   // A sloping tabletop, snapped leg, rusty vice and collapsed tool drawer.
   line(-43,-20,-47,20,0x73543a,9);line(43,-15,36,17,0x73543a,9);line(-44,10,36,8,0x92744d,5);line(-43,-15,34,10,0x756342,4);poly([-62,-32,54,-24,61,-11,-58,-18],0x604d36);poly([-59,-33,54,-25,58,-17,-55,-23],0xb08a55);for(let i=0;i<4;i++)line(-51,-30+i*2,50,-23+i*2,0xd0aa71);poly([-14,-28,-5,-27,-10,-20,-20,-21],0x725337);rect(22,-36,19,12,0x687368);rect(28,-41,8,8,0x8f9780);line(19,-32,45,-30,0xb4b493,3);line(33,-35,35,-20,0x4c584b,3);oval(46,-30,5,5,0x8f8969);poly([-34,-12,-6,-8,-10,14,-39,9],0x8d6d46);line(-35,-9,-11,-5,0xc4a171);rect(-29,-3,8,3,0x4c5746);line(-1,-12,7,7,0x7b8270,3);oval(1,-10,9,6,0xa6a68a);line(10,-8,18,6,0x98794e,3);rect(15,-12,7,5,0xa0aa95);
  }
  // Loose boards, fittings and brick ballast are removed part by part; the ruin remains.
  for(let part=0;part<6;part++){if(part<4&&part<progress.part)continue;const offsets=[[-34,6],[0,8],[32,8],[-30,-12],[3,-10],[35,-10]], [x,y]=offsets[part];if(part===2||part===5){for(let i=0;i<4;i++){const xx=x+(i%2)*10-7,yy=y+Math.floor(i/2)*5;poly([xx-5,yy-3,xx+5,yy-2,xx+6,yy+3,xx-5,yy+3],i%2?0xb09d7b:0x9d8768);line(xx-4,yy-2,xx+3,yy-1,0xd5c4a0);}}else{for(let i=0;i<2;i++){line(x-15,y+i*4,x+13,y-3+i*4,0x987044,4);line(x-13,y-1+i*4,x+11,y-4+i*4,0xd0a66e);oval(x-8,y+i*4,1.5,1.5,0x525a49);}rect(x+7,y-1,7,4,0x7f8a78);line(x+6,y,x+11,y-4,0xb8b495,2);}}
  if(progress.part<4){const target=junkWorkPoint(clearing,site.id,day),x=(target.x-p.x)/junkScale,y=(target.y-p.y)/junkScale;g.lineStyle(1.3,0xf3d88b,.8).strokeRoundedRect(p.x+x-20,p.y+y-9,40,20,4);g.fillStyle(0xf1d78b,.09).fillRoundedRect(p.x+x-20,p.y+y-9,40,20,4);markers.push({x:target.x,y:target.y,hits:progress.hits});}g.restore();
 }
 return root;
}

// Separate foreground layer, placed outside Sam's head/body bounds from any approach.
export function updateJunkIndicators(root:Phaser.GameObjects.Container,actor:{x:number;y:number}){
 const g=root.getData('indicators') as Phaser.GameObjects.Graphics;g.clear();for(const m of root.getData('markers') as {x:number;y:number;hits:number}[]){if(Math.hypot(m.x-actor.x,m.y-actor.y)>150)continue;let x=m.x,y=m.y-34;if(Math.abs(x-actor.x)<40&&y>actor.y-85&&y<actor.y+16)x=actor.x+(m.x>=actor.x?45:-45);g.fillStyle(0x263e31,.94).fillRoundedRect(x-21,y-10,42,22,5);for(let i=0;i<3;i++){g.fillStyle(i<m.hits?0xf3d58c:0x718565).fillRoundedRect(x-14+i*11,y-6,6,13,2);g.lineStyle(1,0xd4ce9b,.7).strokeRoundedRect(x-14+i*11,y-6,6,13,2);}}
}
