import type Phaser from 'phaser';
// Uses the existing character's animation pivots and footprint. Only the artwork changes.
export function drawSamStudy(scene:Phaser.Scene,root:Phaser.GameObjects.Container){
 const polygon=(g:Phaser.GameObjects.Graphics,points:number[],color:number)=>{g.fillStyle(color).fillPoints(points.reduce<{x:number;y:number}[]>((out,_,i)=>{if(i%2===0)out.push({x:points[i],y:points[i+1]});return out;},[]),true);};
 const graphics=(parent:Phaser.GameObjects.Container)=>{const g=scene.add.graphics();parent.add(g);return g;};
 const leg=(x:number)=>{const c=scene.add.container(x,-16);root.add(c);const g=graphics(c);
  polygon(g,[-2.6,-.2,2.5,-.2,2.3,7.5,2,11,-2.3,11,-2.7,6],0x536b44);polygon(g,[-2.6,0,-.7,0,-.9,10,-2.3,10],0x71845a);
  g.lineStyle(.45,0x364c36).lineBetween(2,1,1.8,10).lineBetween(-1,6,1.8,5.4);g.lineStyle(.45,0x8e9c70).lineBetween(-2,3.5,-.4,4.2);
  g.fillStyle(0x788763).fillRoundedRect(-2.5,9,5,2,0.4);g.lineStyle(.4,0xa0ab83).lineBetween(-2.2,9.3,2,9.3);
  polygon(g,[-2.3,11,2.1,11,2.4,13.5,3.1,14.5,3.1,16,-2.9,16,-3,14.5],0x604a36);g.fillStyle(0x3d392f).fillRoundedRect(-3,15,6.3,1.4,.4);
  g.lineStyle(.55,0x9d7d53).lineBetween(-1.8,11.7,1.5,11.7).lineBetween(-1.6,14,1.9,14.4);g.lineStyle(.4,0x443b2d).lineBetween(.8,12,.9,14);
  return c;
 };
 const leftLeg=leg(-3.2),rightLeg=leg(3.2);
 const shirt=graphics(root);
 // A small neck, sloping shoulders and a tucked hem retain Sam's familiar silhouette.
 shirt.fillStyle(0xe4b38c).fillRoundedRect(-2,-33,4,4,1);
 polygon(shirt,[-2,-32,-5.5,-29.9,-6.1,-26.8,-5.2,-21,-5.6,-16,5.6,-16,5.2,-21,6.1,-26.8,5.5,-29.9,2,-32],0xeee3c7);
 polygon(shirt,[-5.5,-29.5,-4.1,-27,-3.8,-19,-4.3,-16,-5.6,-16,-5.2,-21,-6.1,-26.8],0xc7c5a5);
 polygon(shirt,[2,-30,4.8,-28.8,4.2,-22,4.9,-17,1.8,-17],0xe2d6b7);
 polygon(shirt,[-2,-32,-3.2,-29,-.3,-28.2,0,-30.3],0xfff4da);polygon(shirt,[2,-32,3.2,-29,.3,-28.2,0,-30.3],0xe0d5b9);
 shirt.lineStyle(.45,0xaba98a).lineBetween(0,-28.3,0,-17.4).lineBetween(-3.2,-29,-.3,-28.2).lineBetween(.3,-28.2,3.2,-29);
 for(const y of [-26,-22.6,-19.2]){shirt.fillStyle(0x9a9576).fillCircle(.8,y,.42);shirt.fillStyle(0xfff6de).fillCircle(.65,y-.1,.15);}
 // Chest pocket, hem stitching, cloth folds and belt loops are deliberately quiet.
 polygon(shirt,[-4.5,-26.5,-1.4,-26.5,-1.5,-23.5,-2.8,-22.9,-4.3,-23.5],0xe4d9be);shirt.lineStyle(.4,0xb6b298).lineBetween(-4.4,-26.2,-1.6,-26.2).lineBetween(-4.2,-23.5,-2.8,-23.1);
 shirt.lineStyle(.4,0xc1b99d).lineBetween(2.4,-20.5,4,-19.5).lineBetween(-4,-18.1,-2,-18.5);
 shirt.fillStyle(0x655a3e).fillRoundedRect(-5.5,-16.7,11,2.1,.4);shirt.lineStyle(.45,0x9a8d60).lineBetween(-5,-16.3,5,-16.3);
 shirt.fillStyle(0xbdab77).fillRoundedRect(.2,-16.6,2.3,1.7,.3);shirt.fillStyle(0x625c40).fillRect(.7,-16.2,1.2,.7);
 for(const x of [-3.8,3.5])shirt.lineStyle(.65,0x83906a).lineBetween(x,-17,x,-14.4);
 // Trouser pocket openings sit below the shirt, above the leg animation pivots.
 shirt.lineStyle(.55,0x40543b).lineBetween(-4.8,-14.3,-2.8,-12.8).lineBetween(4.8,-14.3,3,-12.8);
 const armX=6.1,armY=-29;
 const arm=(x:number)=>{const c=scene.add.container(x,armY);root.add(c);const g=graphics(c);
  polygon(g,[-1,0,1,1,2.1,5.8,1.7,7.2,-1.6,7.2,-2,3.5],0xe9dfc3);g.lineStyle(.45,0xc1bda0).lineBetween(-1.3,3,-1,5.8).lineBetween(.3,4.7,1.6,5.4);
  g.fillStyle(0xd1ccb0).fillRoundedRect(-1.9,6.3,4,2,0.5);g.lineStyle(.5,0xf9efd6).lineBetween(-1.6,6.7,1.6,6.7);g.lineStyle(.4,0xadae90).lineBetween(-1.5,8,1.5,8);
  g.fillStyle(0xe2b38b).fillRoundedRect(-1.4,8.4,3,5.8,1);g.lineStyle(.5,0xf4ceaa).lineBetween(-.9,9,-.7,12.6);g.fillStyle(0xd19e79).fillEllipse(.4,13.7,2.7,2.5);
  return c;
 };
 const leftArm=arm(-armX),rightArm=arm(armX);
 // A single tapered ponytail starts behind the skull, with a visible hair tie at the nape.
 const pony=scene.add.container(3,-39);root.add(pony);const hair=graphics(pony);
 polygon(hair,[2,2,5,2,7.8,5.5,9,9.5,7.7,14,5.1,15.5,4.2,13,5.2,10,3.7,7,1.5,5],0x624630);
 polygon(hair,[3.7,3.4,5.2,3.6,7,6.5,7.2,10.4,5.6,13.2,6,9.3,4.3,6.7],0x976c43);hair.lineStyle(.5,0xb18a59).lineBetween(5,5,6.3,8).lineBetween(6.3,8,5.9,10.5);
 hair.fillStyle(0x556e49).fillRoundedRect(1.5,2,4,2,0.6);hair.lineStyle(.45,0x9cae75).lineBetween(2,2.3,5,2.3);
 const head=scene.add.container(0,-40);root.add(head);const face=graphics(head);
 face.fillStyle(0x624631).fillEllipse(0,-1,14.6,16);face.fillStyle(0xe6b58e).fillEllipse(0,1,12.6,13.8);face.fillStyle(0xf2cba4).fillEllipse(-.7,1.5,10.7,11.8);
 // Keep the existing friendly face; trim the fringe into one connected sweep.
 polygon(face,[-7,-1,-6.7,-5.2,-3.7,-8,1,-8.3,5.7,-6.2,6.8,-2.3,5.4,-.8,4.6,-3.2,2.6,-4.5,.8,-3.5,-1,-2.8,-3,-.5,-4.7,1.1,-5,3.2,-6.4,2],0x725035);
 polygon(face,[-5.8,-4.4,-3.4,-6.6,.3,-7.3,3.5,-6.1,.3,-6,-2.4,-4.5,-4.7,-2.7],0x997047);
 for(const x of [-2.7,2.7]){face.fillStyle(0x414536).fillEllipse(x,1.2,1.45,2.2);face.fillStyle(0xf9edcf).fillCircle(x-.2,.7,.32);face.fillStyle(0xd89c85,.55).fillEllipse(x*1.4,3.8,2,1.1);}
 face.lineStyle(.45,0xc28e6e).lineBetween(.1,2.1,.6,3);face.lineStyle(.6,0xa66c53).strokePoints([{x:-1.5,y:4.5},{x:-.4,y:5},{x:.6,y:5},{x:1.6,y:4.4}]);
 const tool=graphics(rightArm);
 return {leftLeg,rightLeg,leftArm,rightArm,head,pony,tool,armX,armY};
}
