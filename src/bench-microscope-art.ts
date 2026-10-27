import type Phaser from 'phaser';
// One drawing for Sam's old instrument, both in her hands and on the workbench.
export function drawMicroscope(g:Phaser.GameObjects.Graphics,x:number,y:number,scale=1){
 g.save().translateCanvas(x,y).scaleCanvas(scale,scale);
 g.fillStyle(0x30483e).fillRoundedRect(-16,-5,32,7,3);
 g.lineStyle(6,0x7e9586).strokePoints([{x:8,y:-5},{x:11,y:-16},{x:8,y:-28},{x:0,y:-34},{x:-7,y:-29}]);
 g.lineStyle(2,0xc5c6a5).lineBetween(10,-15,7,-26);
 g.lineStyle(5,0x3e514b).lineBetween(-8,-31,-1,-19);
 g.lineStyle(3,0xc7b07b).lineBetween(-7,-29,-2,-21);
 g.fillStyle(0x263f38).fillRoundedRect(-12,-17,21,4,1);
 g.fillStyle(0xd4cba2).fillRect(-8,-19,11,2);
 g.fillStyle(0xb5a477).fillCircle(10,-18,4);g.fillStyle(0x52675b).fillCircle(10,-18,2);
 g.fillStyle(0xd3d5bb).fillEllipse(-3,-9,10,3);
 // Small worn brass edges distinguish it from a new laboratory instrument.
 g.lineStyle(1,0xab9565).lineBetween(-13,-4,-6,-4).lineBetween(6,-3,12,-3);
 g.restore();
}
