import {drawLily,drawDuckNest} from './pond-place-art';
import {drawLeafCrown} from './tree-foliage';
import {orchardGrowth} from './orchard-growth';
import {drawTreeBlossomGaps} from './pollination-art';
import {drawRipeMarker} from './crop-art';
import Phaser from 'phaser';
import {reedReady,type Estate} from './estate';
export function drawEstate(scene:Phaser.Scene,estate:Estate,day:number){
 const g=scene.add.graphics().setDepth(2);
 for(const t of estate.trees){const growth=orchardGrowth(t.planted,day),grown=growth.mature,s=growth.scale,x=t.x,y=t.y;
  g.fillStyle(0x345737,.25).fillEllipse(x+7,y+5,61*s,22*s);g.lineStyle(7*s,0x785738).lineBetween(x,y,x,y-49*s);g.lineStyle(3*s,0x96714b).lineBetween(x-1,y,x-1,y-48*s);
  if(growth.progress>=1/3){g.lineStyle(3*s,0x785738).lineBetween(x,y-25*s,x-13*s,y-43*s).lineBetween(x,y-32*s,x+12*s,y-49*s);}
  // One continuous crown replaces the three overlapping round canopy puffs.
  const matureCrown=growth.canopies===3;
  drawLeafCrown(g,x,y-(matureCrown?53:growth.canopies===2?51:49)*s,(matureCrown?37:growth.canopies===2?30:23)*s,(matureCrown?31:growth.canopies===2?26:18.5)*s,false,Math.abs(Math.round(x*31+y*17)));
  g.lineStyle(.9*s,0x493e30,.7).lineBetween(x+2*s,y-3*s,x+2*s,y-29*s);
  g.lineStyle(.7*s,0xb09463,.8).lineBetween(x-2*s,y-8*s,x-2*s,y-24*s);
  if(grown)drawTreeBlossomGaps(g,x,y,s,t.fruit>0,t.bloomState);
  if(t.fruit)for(let i=0;i<t.fruit;i++){const xx=x+Math.cos(i*2.4)*19,yy=y-48+Math.sin(i*2.4)*14;g.fillStyle(t.fruitDay!==undefined&&day-t.fruitDay>=2?(t.kind==='cherry'?0xa26b59:t.kind==='plum'?0x81738a:0xa99a6f):t.kind==='cherry'?0xb94f49:t.kind==='plum'?0x776187:t.kind==='apple'?0xbe5146:0xc1b566);if(t.kind==='pear'){g.fillEllipse(xx,yy+1.4,6.5,6).fillEllipse(xx,yy-2,3.6,6);}else g.fillEllipse(xx,yy,6,6);g.lineStyle(1,0x65583a).lineBetween(xx,yy-3,xx+1,yy-6);}
  if(t.fruit)drawRipeMarker(g,x+25*s,y-65*s);
 }
 for(const p of estate.pond){if(p.kind==='lily'){drawLily(g,p.x,p.y);}
  else if(p.kind==='reed'){
   const growth=Math.min(1,Math.max(0,(day-(p.lastHarvest??p.day))/3)),shoots=7+Math.min(5,Math.floor((day-p.day)/3));
   g.fillStyle(0x416f53,.4).fillEllipse(p.x,p.y+2,25,8);for(let i=0;i<shoots;i++){const offset=i<7?(i-3)*3:(i%2?-1:1)*(12+(i-7)*2),x=p.x+offset,s=i<7?.32+growth*.68:.3+growth*.36,h=(21+i%3*7)*s,lean=offset*.55;g.lineStyle(i<7?2:1.4,i<7?0x6e8d43:0x91ac60).lineBetween(x,p.y,x+lean,p.y-h);g.lineStyle(1,0xa4b877).lineBetween(x,p.y-3,x+lean-4,p.y-h*.7);if(i<7&&growth>=.8)g.lineStyle(3,0x816440).lineBetween(x+lean,p.y-h,x+lean,p.y-h-8);}
   if(reedReady(p,day))drawRipeMarker(g,p.x+16,p.y-40);
  }
  else{drawDuckNest(g,p.x,p.y);}
 }
 // Spawn clings to submerged vegetation in the shallows, rather than a marker on land.
 if(Object.values(estate.roe).some(n=>n>0)){
  const x=526,y=443;
  g.fillStyle(0x245d58,.25).fillEllipse(x+1,y+4,25,10);
  g.lineStyle(2,0x718e54,.9).beginPath().moveTo(x-12,y+5).lineTo(x-3,y+1).lineTo(x+11,y-3).strokePath();
  for(const [dx,dy]of [[-8,-2],[-3,-5],[3,-5],[8,-2],[-7,3],[-2,0],[4,0],[9,3],[-2,5],[4,5]]){
   g.fillStyle(0xd1b878,.72).fillCircle(x+dx,y+dy,2.8);g.lineStyle(.7,0xf2e4b9,.9).strokeCircle(x+dx,y+dy,2.8);g.fillStyle(0x897044,.9).fillCircle(x+dx+.3,y+dy+.5,1);g.fillStyle(0xfff5d4,.95).fillCircle(x+dx-.9,y+dy-1,.7);
  }
  g.lineStyle(.7,0xafd4c5,.65).lineBetween(x-15,y+8,x-7,y+8).lineBetween(x+10,y+6,x+17,y+6);
 }
 const nest=estate.pond.find(p=>p.kind==='duckNest');
 if(estate.eggs&&nest)for(let i=0;i<Math.min(4,estate.eggs);i++){const x=nest.x-6+(i%2)*9,y=nest.y-5+Math.floor(i/2)*4;g.fillStyle(0x665c40,.35).fillEllipse(x+1,y+2,7,4);g.fillStyle(0xe6dfb9).fillEllipse(x,y,6,8);g.fillStyle(0xfff0d1).fillEllipse(x-1,y-1.5,2,3);}

 return g;
}

export function drawDuck(g:Phaser.GameObjects.Graphics,x:number,y:number,male:boolean,wing=0,pose:{ground?:boolean;stride?:number;facing?:1|-1}={}){
 g.save().translateCanvas(x,y).scaleCanvas(pose.facing??1,1);x=0;y=0;
 if(pose.ground){g.fillStyle(0x334f43,.2).fillEllipse(1,10,25,6);for(const [i,hip]of [-4,4].entries()){const step=Math.sin((pose.stride??0)+i*Math.PI)*2.5,lift=Math.max(0,Math.sin((pose.stride??0)+i*Math.PI))*1.5,foot=hip+step;g.lineStyle(1.7,0xb68e56).lineBetween(hip,1,foot,8-lift);g.fillStyle(0xc69e64).fillTriangle(foot-2,8-lift,foot+5,9-lift,foot-2,10-lift);}}
 else g.fillStyle(0x334f43,.18).fillEllipse(2,4,24,7);
 // Layered body and overlapping flight feathers keep the familiar silhouette.
 g.fillStyle(male?0x8d9386:0x8b7353).fillEllipse(0,-2,23,13);
 g.fillStyle(male?0xb9baaa:0xb49b74).fillEllipse(-2,-4,18,9);
 g.fillStyle(male?0x6f8077:0x9c825e).fillPoints([{x:-10,y:-6},{x:0,y:-8},{x:6,y:-3},{x:1,y:2},{x:-9,y:1}],true);
 for(let i=0;i<5;i++){
  const xx=-8+i*2.4,yy=-5+i*.55;
  g.lineStyle(.7,male?0xc2c5b2:0xc0a87e,.8).lineBetween(xx,yy,xx+3,yy+2);
  g.lineStyle(.55,male?0x53675d:0x735d43,.75).lineBetween(xx,yy+1.5,xx+2.8,yy+3);
 }
 g.fillStyle(male?0x566e7c:0x7a7162).fillPoints([{x:-6,y:-3},{x:0,y:-4},{x:3,y:-1},{x:-3,y:0}],true);
 g.lineStyle(.7,0xd0c8ab,.8).lineBetween(-6,-3,0,-4);
 g.fillStyle(male?0x354e41:0x776044).fillTriangle(-10,-3,-17,-6,-12,1);
 g.lineStyle(.6,male?0x959f88:0xb49b74).lineBetween(-15,-5,-10,-3);
 // A short neck, shaped head, two-tone bill and a small eye highlight.
 g.fillStyle(male?0x715a43:0x9b7e57).fillEllipse(7,-5,7,8);
 g.fillStyle(male?0x365c49:0x88704f).fillEllipse(9,-10,10,11);
 g.fillStyle(male?0x547762:0xa58b63).fillEllipse(8,-12,6,5);
 if(!male){g.lineStyle(.65,0x5b503d).lineBetween(5,-10,11,-11);g.lineStyle(.6,0xc1ab83).lineBetween(6,-8,11,-9);}
 else g.lineStyle(1,0xd3cdb1).lineBetween(6,-6,12,-6);
 g.fillStyle(0xb79457).fillPoints([{x:13,y:-12},{x:19,y:-10},{x:19,y:-8},{x:13,y:-8}],true);
 g.lineStyle(.6,0xd1b378).lineBetween(13,-11,18,-10);g.lineStyle(.6,0x806c46).lineBetween(14,-8.5,18,-8.5);
 g.fillStyle(0x253c31).fillCircle(10,-11,1);g.fillStyle(0xe4dbc2).fillCircle(10.3,-11.4,.3);
 if(wing)g.lineStyle(3,0x8d9b85).lineBetween(0,-5,-10,-5-wing);
 g.restore();
}
