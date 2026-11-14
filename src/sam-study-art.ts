import type Phaser from 'phaser';
// Curved shapes are sampled in local coordinates; all established animation pivots remain.
export function drawSamStudy(scene:Phaser.Scene,root:Phaser.GameObjects.Container){
 const graphics=(parent:Phaser.GameObjects.Container)=>{const g=scene.add.graphics();parent.add(g);return g;};
 const shape=(g:Phaser.GameObjects.Graphics,color:number,start:number[],curves:number[][])=>{const points=[{x:start[0],y:start[1]}];let x=start[0],y=start[1];for(const [ax,ay,bx,by,cx,cy]of curves){for(let i=1;i<=12;i++){const t=i/12,u=1-t;points.push({x:u*u*u*x+3*u*u*t*ax+3*u*t*t*bx+t*t*t*cx,y:u*u*u*y+3*u*u*t*ay+3*u*t*t*by+t*t*t*cy});}x=cx;y=cy;}g.fillStyle(color).fillPoints(points,true);};
 const stroke=(g:Phaser.GameObjects.Graphics,color:number,width:number,start:number[],curves:number[][])=>{const points=[{x:start[0],y:start[1]}];let x=start[0],y=start[1];for(const [ax,ay,bx,by,cx,cy]of curves){for(let i=1;i<=12;i++){const t=i/12,u=1-t;points.push({x:u*u*u*x+3*u*u*t*ax+3*u*t*t*bx+t*t*t*cx,y:u*u*u*y+3*u*u*t*ay+3*u*t*t*by+t*t*t*cy});}x=cx;y=cy;}g.lineStyle(width,color).strokePoints(points);};
 const leg=(x:number)=>{const c=scene.add.container(x,-16);root.add(c);const g=graphics(c);g.setScale(.84,1);
  shape(g,0x416b86,[-2.9,-1.4],[[ -1.6,-2,1.7,-2,2.9,-1.4],[2.7,2.5,2.3,6.5,2.3,11], [1,11.6,-1.5,11.5,-2.3,11],[-2.6,6.4,-3.2,2.3,-2.9,-1.4]]);
  shape(g,0x608ba3,[-2.4,-1],[[-1.7,-1.3,-.9,-1.2,-.6,-.8],[-1.1,3,-1,7.4,-1.3,10.5],[-1.6,10.8,-2.1,10.8,-2.2,10.5],[-2.4,6.6,-2.7,2.4,-2.4,-1]]);
  stroke(g,0x31536c,.45,[2.1,1],[[1.9,4,1.8,7.6,1.9,10]]);stroke(g,0x8cabbb,.4,[-1.5,5.1],[[-.8,5.6,.3,5.7,1.1,5.5]]);
  g.fillStyle(0x8faab8).fillRoundedRect(-2.5,10,5,1.6,.45);stroke(g,0xc3d0d0,.35,[-2.1,10.4],[[-.6,10.6,1,10.6,2.1,10.4]]);
  // Ankle boots occupy the lowest fifth of the leg, rather than most of the calf.
  shape(g,0x82563b,[-2.2,11.6],[[-.8,11.8,.9,11.8,2,11.5],[1.8,12.6,1.6,13.6,2.8,14.2],[3.9,14.9,3.5,15.8,2.1,16],[.4,16.3,-2.7,16.1,-2.9,15.4],[-2.9,14.2,-2.3,13.6,-2.2,11.6]]);
  shape(g,0xaf7b50,[-1.9,12],[[-1.3,12.3,-.8,12.2,-.7,12.6],[-1.1,13.6,-1.5,14.3,-.1,14.9],[.7,15.2,1.9,15.1,2.6,15.2],[.9,15.8,-2,15.8,-2.3,15],[-2.3,14.2,-1.9,13,-1.9,12]]);
  stroke(g,0x4c3a2b,.8,[-2.6,15.6],[[-.9,16.1,2.4,16,3.2,15.4]]);stroke(g,0xd0aa7e,.45,[-1.9,12.1],[[-.9,12.4,.7,12.4,1.6,12]]);stroke(g,0x5c432f,.45,[1,12.6],[[.9,13.5,1.1,14,1.6,14.4]]);
  stroke(g,0xd3ae82,.4,[-1.4,14.5],[[.2,14,1.7,14.4,2.6,14.9]]);return c;
 };
 const leftLeg=leg(-2.5),rightLeg=leg(2.5),body=graphics(root);
 body.fillStyle(0xefb993).fillRoundedRect(-1.6,-35,3.2,5.2,1.2);
 // Fitted ivory blouse tucked into the high waistband.
 shape(body,0xeee8d7,[-1.7,-32.6],[[-2.8,-32,-4.2,-31.5,-4.6,-30],[-5.3,-28.8,-5.3,-26.8,-4.5,-25.6],[-3.8,-24.6,-3.2,-23.7,-3.1,-22.5],[-1.4,-22,1.4,-22,3.1,-22.5],[3.2,-23.7,3.8,-24.6,4.5,-25.6],[5.3,-26.8,5.3,-28.8,4.6,-30],[4.2,-31.5,2.8,-32,1.7,-32.6],[1.1,-30.5,-1.1,-30.5,-1.7,-32.6]]);
 shape(body,0xcac8b7,[-4.4,-29.3],[[-3.8,-28.3,-4.1,-26.8,-2.9,-26],[-2.1,-25.5,-2.2,-23.8,-2.5,-22.5],[-3.1,-22.4,-3.5,-23.5,-3.8,-24.4],[-5,-26.1,-5.1,-28.1,-4.4,-29.3]]);
 shape(body,0xf6f0df,[-3,-29.4],[[-1.3,-30,1.8,-29.8,3.3,-28.9],[3.7,-28.2,3.2,-27.1,1.8,-26.8],[.3,-26.6,-2.5,-26.8,-3.3,-27.4],[-3.7,-28,-3.6,-29,-3,-29.4]]);
 shape(body,0xf4c29c,[-1.65,-32.6],[[-1,-31.7,-.7,-30.3,0,-29.6],[.7,-30.3,1,-31.7,1.65,-32.6],[.9,-33.1,-.9,-33.1,-1.65,-32.6]]);
 shape(body,0xfff8e9,[-1.7,-32.7],[[-2.4,-32.2,-2.8,-31.2,-3,-30.3],[-1.9,-30.5,-1.3,-29.8,-.6,-29.1],[-.2,-30.4,-1.2,-31.6,-1.7,-32.7]]);
 shape(body,0xd7d5c3,[1.7,-32.7],[[2.4,-32.2,2.8,-31.2,3,-30.3],[1.9,-30.5,1.3,-29.8,.6,-29.1],[.2,-30.4,1.2,-31.6,1.7,-32.7]]);
 stroke(body,0xb4b5a3,.4,[.2,-29.5],[[.4,-27.4,.3,-24.8,.2,-22.7]]);for(const y of [-28,-25.9,-23.8]){body.fillStyle(0xb3ae96).fillCircle(.65,y,.35);body.fillStyle(0xfff9e9).fillCircle(.55,y-.12,.12);}
 stroke(body,0xc6c4b0,.4,[-1.6,-24.2],[[-1,-23.7,-1.2,-22.9,-1.1,-22.5]]);stroke(body,0xc1c0ac,.4,[1.8,-24.1],[[1.2,-23.5,1.4,-22.8,1.3,-22.4]]);
 const pants=graphics(root);pants.setScale(.87,1);
 // Continuous high waist and hips, with a single centred fly above the leg split.
 shape(pants,0x416b86,[-3.2,-23.1],[[-1.6,-22.8,1.6,-22.8,3.2,-23.1],[3.5,-21.5,5.4,-19.8,5.7,-17],[5.9,-15.6,5.8,-14.4,5.5,-13.6],[3.7,-13.1,1.8,-13.3,.6,-14.2],[.2,-14.5,-.2,-14.5,-.6,-14.2],[-1.8,-13.3,-3.7,-13.1,-5.5,-13.6],[-5.8,-14.4,-5.9,-15.6,-5.7,-17],[-5.4,-19.8,-3.5,-21.5,-3.2,-23.1]]);
 shape(pants,0x638ca3,[-2.9,-22.4],[[-1.9,-22.2,-1.3,-22.2,-.8,-22.2],[-1.8,-19.4,-3.3,-17.5,-3.9,-13.8],[-4.7,-13.6,-5.2,-13.8,-5.3,-14.3],[-5.7,-17.8,-3.8,-20.3,-2.9,-22.4]]);
 stroke(pants,0x2f536b,.65,[-3.1,-22.7],[[-1.4,-22.4,1.4,-22.4,3.1,-22.7]]);stroke(pants,0x9db5bf,.4,[-3.1,-21.7],[[-1.4,-21.4,1.4,-21.4,3.1,-21.7]]);
 pants.fillStyle(0xbdb295).fillCircle(0,-22.1,.4);stroke(pants,0x2e5069,.5,[0,-21.2],[[.15,-19.3,.15,-17,0,-15.3]]);stroke(pants,0x88a6b6,.35,[.6,-21],[[.7,-19.2,.7,-17.1,.5,-16.2]]);
 for(const sign of [-1,1])stroke(pants,0x2d5068,.5,[sign*3.7,-20.4],[[sign*3.5,-18.7,sign*2.6,-18.1,sign*2.1,-18]]);
 const armX=4.2,armY=-30.2;
 const arm=(x:number)=>{const c=scene.add.container(x,armY);c.rotation=x<0?.06:-.06;root.add(c);const g=graphics(c);g.setScale(x<0?-.69:.69,1);
  shape(g,0xefb88e,[-1.4,5.4],[[-1.2,6.8,-.7,7.8,-.6,8.8],[-.4,10,-.7,11.6,-1,12.7],[-1.7,14.2,-.8,15.1,.4,15.1],[1.6,15.1,1.9,14.1,1.3,13.1],[.9,12.4,1.2,10.7,1.5,9.1],[1.9,7.8,1.4,6.7,1.2,5.8],[.4,5.7,-.6,5.5,-1.4,5.4]]);
  stroke(g,0xffd7b2,.55,[-.2,9.3],[[-.1,10.4,-.2,11.5,-.5,12.3]]);stroke(g,0xc98f6c,.35,[-.7,14.3],[[0,14.7,.8,14.6,1.2,14.1]]);
  // The sleeve cap overlaps the sloping shoulder and shares its tangent.
  shape(g,0xeee8d7,[-1.3,-1.1],[[-.7,-1.8,.8,-1.6,1.5,-.6],[2.2,.7,2,2.5,1.5,4.1],[1.1,5.9,1.6,7.4,1.5,8.8],[.4,9.2,-.8,9.2,-1.4,8.7],[-1.7,7.3,-1.4,5.5,-1.7,3.8],[-2.1,1.7,-2,.1,-1.3,-1.1]]);
  stroke(g,0xc7c6b3,.35,[-.9,-.8],[[.1,-1.2,1.2,-.1,1.5,1.2]]);
  stroke(g,0xc0c1ae,.4,[-1.5,2.8],[[-.4,3.2,-.7,4.9,-1,5.4]]);stroke(g,0xfff6df,.5,[.6,1.4],[[.8,3,.7,4.7,.4,6.1]]);
  g.fillStyle(0xd2d0bb).fillRoundedRect(-1.8,7.5,3.8,1.8,.45);stroke(g,0xfff8e6,.5,[-1.5,7.9],[[-.5,8,1,8,1.7,7.9]]);stroke(g,0xaeb09d,.35,[-1.4,9],[[0,9.2,1,9.1,1.6,9]]);return c;
 };
 const leftArm=arm(-armX),rightArm=arm(armX),pony=scene.add.container(3,-39);root.add(pony);const braid=graphics(pony);
 // Hair chosen from the peach-blouse reference, kept at its original placement.
 shape(braid,0x794b2e,[1.5,-6],[[3.2,-6.5,5.8,-5.9,6,-3.9],[6.3,-1.5,6.3,1.4,6.9,3.1],[6,5.4,7.4,6.8,6.8,9],[6,10.9,7.3,12.7,6.3,14.1],[5.8,15,5,15,4.7,14],[4.3,11.2,4.7,8,3.8,5.8],[3,2.8,3.7,-.3,2.7,-2.3],[1.8,-3.6,.8,-4.5,1.5,-6]]);
 for(let i=0;i<7;i++){const yy=-4.8+i*2.45,xx=3.7+i*.32;shape(braid,i%2?0xb17a44:0xc08a4e,[xx-.6,yy-.9],[[xx+1.7,yy-.4,xx+2,yy+.4,xx+.3,yy+1.8],[xx-.9,yy+1.1,xx-1.8,yy+.7,xx-.6,yy-.9]]);stroke(braid,0x704629,.35,[xx-.8,yy+.4],[[xx-.1,yy+.7,xx+.7,yy+1,xx+1.1,yy+1.5]]);stroke(braid,0xd5a164,.35,[xx-.2,yy-.2],[[xx+.4,yy+.1,xx+.7,yy+.3,xx+.8,yy+.6]]);}
 braid.fillStyle(0x798b68).fillRoundedRect(4.8,12.7,2.4,1.3,.45);stroke(braid,0xb4c29b,.35,[5.1,13],[[5.6,12.9,6.3,12.9,6.8,13.1]]);
 shape(braid,0xab733e,[5.1,14],[[4.6,15.6,5.9,16.5,5.4,17.5],[7.4,16.4,7.7,15.5,6.8,14],[6.2,14.4,5.6,14.4,5.1,14]]);
 const head=scene.add.container(0,-40);root.add(head);const face=graphics(head);
 shape(face,0x6c432d,[-6,-5.8],[[-4.3,-10,2.5,-10.4,5.7,-6.5],[7,-4.6,6.5,-1.5,5.8,1.7],[5.6,-.1,4.8,-1.9,3.9,-3.5],[1.4,-5.3,-2,-5.1,-4.6,-2.6],[-5.2,-.3,-5.7,1.2,-6.2,2.2],[-7.4,-.1,-7.2,-4.1,-6,-5.8]]);
 face.fillStyle(0xe9ae84).fillEllipse(5.9,1.6,2.3,3.7);
 // Restore the complete face approved in the peach-blouse preview.
 shape(face,0xf1bd94,[-5.3,-4.2],[[-3.5,-7.4,2.3,-7.6,4.5,-4.7],[6.2,-2.5,5.9,2.4,4.1,5.4],[2.1,8,-1.2,7.7,-3.7,5.5],[-5.9,3.3,-6.6,-1.8,-5.3,-4.2]]);
 shape(face,0xffd2ac,[-4.9,-3],[[-3,-5.8,1.9,-6,3.7,-3.9],[5.2,-2,4.7,2.8,2.9,5],[.4,7,-2.4,6,-4,4],[-5.3,2,-5.8,-.7,-4.9,-3]]);
 for(const x of [-2.6,2.6]){face.fillStyle(0xfff4df).fillEllipse(x,.55,2.65,2.8);face.fillStyle(0x805438).fillEllipse(x+.15,.7,1.75,2.25);face.fillStyle(0x3c3026).fillEllipse(x+.25,.85,1,1.65);face.fillStyle(0xffffff).fillCircle(x-.05,.05,.36);stroke(face,0x684a35,.4,[x-1.35,-.2],[[x-.65,-1,x+.6,-1,x+1.25,-.1]]);stroke(face,0x805c3d,.5,[x-1.25,-2.6],[[x-.4,-3.1,x+.5,-3.1,x+1.2,-2.6]]);face.fillStyle(0xe9a18a,.4).fillEllipse(x*1.3,3,1.8,.9);}
 stroke(face,0xb37968,.5,[-1.5,4.5], [[-.5,5.05,.7,5.1,1.6,4.35]]);stroke(face,0xe4aa90,.3,[-.5,5.25],[[0,5.4,.5,5.35,.8,5.2]]);
 stroke(face,0xd39570,.5,[-.5,1.3],[[-1.2,2.6,-.2,3.2,.9,2.7]]);
 shape(face,0x84512f,[-6.1,-3.5],[[-5.5,-8.6,1.5,-10.1,5.3,-6.8],[6.7,-4.6,6.4,-2.6,5.5,-.5],[4.1,-1.1,3.8,-3.6,3.1,-4.3],[1.7,-5.6,.7,-5.9,-.6,-5.7],[-.4,-3.8,-2.3,-2.7,-3.9,-2.6],[-3.5,-1.2,-4.4,.2,-5.7,1],[-6.1,.2,-6.4,-1.4,-6.1,-3.5]]);
 shape(face,0xb77d43,[-5.3,-4.6],[[-3.7,-7.8,-.9,-8.1,1.2,-7.6],[-1.3,-7.5,-.8,-5.1,-3.9,-4.4],[-5,-4,-5.1,-3.1,-5.5,-2.9],[-5.8,-3.5,-5.6,-4.1,-5.3,-4.6]]);
 stroke(face,0xd7a164,.6,[-4.7,-5.3],[[-3.6,-6.8,-2,-7.1,-.8,-7.1]]);stroke(face,0xac733d,.65,[3.1,-7],[[4.3,-6.5,5.2,-5.4,5.2,-4.3]]);
 const tool=graphics(rightArm),grip=graphics(rightArm);grip.fillStyle(0xf3bd94).fillRoundedRect(-.8,12.8,2,2.5,.75);stroke(grip,0xcc9674,.35,[-.8,13.6],[[0,13.9,.8,13.8,1.2,13.7]]);
 return {leftLeg,rightLeg,leftArm,rightArm,head,pony,tool,armX,armY};
}
