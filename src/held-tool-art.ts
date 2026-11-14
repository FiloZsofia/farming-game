import type Phaser from 'phaser';
export const HAND_GRIP={x:0,y:14};
/** Resize around the actual handle contact, never around the wrist/graphics origin. */
export function heldToolLayout(name:string,reach=1,working=false,angleOverride?:number){
 const size=name==='water'?.52:name==='harvest'?.65:name==='stick'?.68:name==='crowbar'?.66:name==='hoe'?.68:['axe','pickaxe','support'].includes(name)?.7:1;
 const origin=name==='water'?{x:-2.625,y:18.625}:name==='harvest'?{x:5,y:7.5}:HAND_GRIP;
 const angle=angleOverride??(name==='hoe'&&!working?-.2:0),sx=size,sy=size*reach,c=Math.cos(angle),s=Math.sin(angle);
 return {sx,sy,angle,x:HAND_GRIP.x-c*origin.x*sx+s*origin.y*sy,y:HAND_GRIP.y-s*origin.x*sx-c*origin.y*sy,origin};
}
export function waterToolAngle(dx:number,dy:number,armAngle:number){const natural=Math.atan2(15-18.625,25.5+2.625),a=Math.atan2(dy,dx)-armAngle-natural;return Math.atan2(Math.sin(a),Math.cos(a));}
export function heldToolTip(name:string,length=29){return name==='hoe'?{x:6,y:length+2}:name==='water'?{x:25.5,y:15}:name==='crowbar'?{x:4.5,y:31}:name==='stick'?{x:2.2,y:36}:name==='harvest'?{x:5,y:25}:name==='support'?{x:0,y:28}:{x:0,y:length};}
/** Original drawing coordinates; layout maps the correct handle point into Sam's palm. */
export function drawHeldTool(g:Phaser.GameObjects.Graphics,name:string,length:number,reinforced:boolean,working:boolean):number|null{
 const poly=(p:number[],color:number)=>g.fillStyle(color).fillPoints(p.reduce<{x:number;y:number}[]>((a,_,i)=>{if(!(i%2))a.push({x:p[i],y:p[i+1]});return a;},[]),true);
 if(name==='hoe'||name==='axe'||name==='pickaxe'){
  g.lineStyle(3.1,0x705138).strokePoints([{x:.3,y:7},{x:-.5,y:17},{x:1,y:length-3}]);g.lineStyle(1,0xb99a67).lineBetween(-.6,8,-.8,19).lineBetween(-.8,19,.1,length-4);
  g.lineStyle(.45,0x493d2c).lineBetween(.9,10,.6,14).lineBetween(.6,18,1.5,22);g.lineStyle(2.1,0x4c655e).lineBetween(.6,length-7,1,length-1);
  if(name==='hoe'){poly([-2,length-5,2,length-5,3,length-2,7,length-1,9,length+1,8,length+3,3,length+2,1,length-1,-2,length-2],0x5f7a74);poly([3,length,8,length+1,7.5,length+2.8,3,length+2],0x94aaa0);g.lineStyle(.65,0xd3d9c3).lineBetween(3,length+2,7.5,length+2.8);g.lineStyle(.6,0xa4b9ab).lineBetween(-1.5,length-4,1.5,length-4);}
  else if(name==='axe'){poly([0,length-6,6,length-8,11,length-7,10,length+3,6,length+2,1,length-2],0x627d77);poly([7,length-7,11,length-7,10,length+3,7,length+1],0xc2cec0);g.lineStyle(.6,0xe1e3ce).lineBetween(10,length-6,9.4,length+2);}
  else{poly([-10,length-1,-8,length-6,-3,length-7,3,length-7,8,length-5,11,length,-1,length-4,-6,length-4],0x6e8881);g.lineStyle(.8,0xc5d1c0).lineBetween(-8,length-5,-3,length-6).lineBetween(3,length-6,8,length-4);}
  g.fillStyle(0xa9b9a5).fillCircle(1,length-4,.65);return length;
 }
 if(name==='crowbar'){
  g.lineStyle(2.7,0x4e6860).strokePoints([{x:1,y:7},{x:-.5,y:9},{x:-.5,y:27},{x:.8,y:30},{x:3.4,y:31},{x:5.3,y:29.6},{x:5.5,y:27.3}]);
  g.lineStyle(.75,0xafc0b2).lineBetween(-1.1,10,-1.1,26).lineBetween(.8,29,3.2,30).lineBetween(4.7,29.2,4.8,27.8);
  poly([4.1,27.5,6.7,27.5,7.1,25.7,5.7,26.1,5.3,27.1,4.9,26.1,3.8,26.4],0x8fa59a);g.lineStyle(.45,0xd3dcca).lineBetween(4,26.5,4.9,26.2);return 31;
 }
 if(name==='water'){
  const handle=Array.from({length:25},(_,i)=>{const t=i/24,u=1-t;return {x:u*u*u*4.5+3*u*u*t*(-5)+3*u*t*t*(-5)+t*t*t*4.5,y:u*u*u*15+3*u*u*t*12+3*u*t*t*25+t*t*t*23};});
  g.lineStyle(2.1,0x587d70).strokePoints(handle);g.lineStyle(.65,0xb7c9b0).strokePoints(handle.map(p=>({x:p.x-.35,y:p.y-.15})));
  poly([15,19,23,13,25.4,15.5,18,23,14,23],0x57796f);g.lineStyle(.8,0xb3c6ac).lineBetween(16,19,23,14.4);
  g.fillStyle(0x648879).fillRoundedRect(4,14,13,12,2);g.fillStyle(0x8da797).fillEllipse(10.5,14.5,13,5);g.fillStyle(0x395c55).fillEllipse(10.4,14,6.2,2.6);
  g.lineStyle(.8,0xc4cfb2).lineBetween(6,17,6,22.7);g.lineStyle(.6,0x3e655c).strokeEllipse(10.4,24,11,2);g.lineStyle(.6,0xa4b9a0).lineBetween(8,17,14.5,17);g.fillStyle(0xa7baa3).fillCircle(4.8,16,.65).fillCircle(4.8,23,.65);
  g.fillStyle(0x9fae96).fillEllipse(25,14.7,4.6,7);g.lineStyle(.65,0xd6dcc2).strokeEllipse(24.8,14.5,4.4,6.4);for(let j=0;j<3;j++)g.fillStyle(0x4c726b).fillCircle(25.5,12.8+j*1.7,.4);
  if(working)for(let i=0;i<5;i++){const xx=27+i*2.3,yy=14.8-i*.25+i*i*.06;g.lineStyle(.7,0xb9dfe0,.8).lineBetween(xx,yy,xx+1.7,yy+.2);g.fillStyle(0xe3eee0,.7).fillEllipse(xx+1.8,yy+.3,1.1,1.4);}return 29;
 }
 if(name==='stick'){
  const points=[{x:.3,y:7},{x:-.4,y:15},{x:1.1,y:24},{x:.8,y:30},{x:2.2,y:36}];g.lineStyle(2.7,0x735638).strokePoints(points);g.fillStyle(0x735638).fillCircle(.3,7,1.35).fillCircle(2.2,36,1.35);
  g.lineStyle(.8,0xba9764).strokePoints([{x:-.4,y:8},{x:-.9,y:15},{x:.5,y:24},{x:.2,y:30},{x:1.5,y:35.4}]);g.lineStyle(.5,0x513f2d).lineBetween(1.1,19,2.3,17.7).lineBetween(.6,27,1.4,28.4);g.fillStyle(0x906c42).fillEllipse(.5,11,1.6,2.3);
  if(reinforced){g.lineStyle(3.1,0x7b8b7c).strokePoints([{x:.9,y:31},{x:2,y:35}]);g.fillStyle(0x7b8b7c).fillEllipse(2,35,3.1,2.2);g.lineStyle(.6,0xb8c4ac).lineBetween(.1,31.7,1.2,34.5);for(const yy of [26,27.8,29.6])g.lineStyle(.8,0xb69d74).lineBetween(-.8,yy,2,yy-.35);}return 36;
 }
 if(name==='harvest'){
  g.lineStyle(1.6,0x8d6c43).strokeEllipse(5,14,12,13);g.lineStyle(.6,0xcdb17d).strokeEllipse(5,13.8,9.8,10.8);poly([-2,16,12,16,10,25,0,25],0x987348);g.fillStyle(0xc6a16a).fillEllipse(5,16,14,4);g.fillStyle(0x695339).fillEllipse(5,15.8,10,1.8);for(const yy of [19,22,24])g.lineStyle(.65,0xd1b583).lineBetween(0,yy,10,yy);for(const xx of [1,4,7,10])g.lineStyle(.55,0x6e5639).lineBetween(xx,18,xx-.6,24);return 29;
 }
 if(name==='support'){
  poly([-1.6,5,1.7,5,1.5,25,0,28,-1.5,25],0x9c7c51);g.lineStyle(.7,0xd3b785).lineBetween(-.8,6,-.8,24);g.lineStyle(.55,0x715335).lineBetween(.8,8,.6,17);g.lineStyle(1,0xd2bd88).strokeEllipse(.2,17,6,3);g.lineStyle(.7,0xa99264).lineBetween(3,17,4,22);return 29;
 }
 return null;
}
