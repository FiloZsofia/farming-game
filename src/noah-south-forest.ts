import {southRoot,inNoahSouth} from './south-forest-terrain';
import {drawMushroomArt} from './mushroom-art';
import {MushroomLight} from './mushroom-light';
import {availableLarchCones,coneVisualPoint} from './larch-cones';
import {resinTree,larchGlade,gladePool,inLarchGlade,drawLarchHollow,drawOldLarch} from './larch-glade';
export {resinTree} from './larch-glade';
import {forestLog,logPoint,logCoordinates,onFloatingLog,logCrossingStep,floatingLogPose} from './forest-log-crossing';
import {sporeShelters,sporeFieldPhase,sporeFieldHurts,sporeSheltered,inSporeField} from './spore-field';
import Phaser from 'phaser';
import {ForestCombat} from './forest-combat';
import {createForest} from './forest';
import {drawForestHerb} from './forest-art';
import {southRoute,southPath,distanceToSouthPath,swampAt,swampStones,swampStep,southHerbs} from './south-forest-layout';
import {drawWoodlandTree} from './woodland-tree';
import {rootStrike,rootStrikePose,ROOT_STRIKE_COUNT,ROOT_STRIKE_INTERVAL,ROOT_STRIKE_DURATION} from './root-strikes';
import type {NoahTestState} from './noah-story';
export {southRoot,inNoahSouth,southBlocked} from './south-forest-terrain';
const southEnemies=[{id:'vine',kind:'vine' as const,x:-325,y:1490,hp:3},{id:'spore-a',kind:'spore' as const,x:-665,y:1680,hp:3},{id:'spore-b',kind:'spore' as const,x:-485,y:1908,hp:3},{id:'vine-bramble',kind:'vine' as const,x:-360,y:1950,hp:3},{id:'spore-c',kind:'spore' as const,x:-570,y:2385,hp:3},{id:'vine-larch',kind:'vine' as const,x:-750,y:2670,hp:3},{id:'spore-d',kind:'spore' as const,x:-850,y:2670,hp:3}];
const mushrooms=[{x:-380,y:1450,s:1.1},{x:-590,y:1580,s:1.5},{x:-755,y:1790,s:1.3},{x:-570,y:1930,s:1.7},{x:-335,y:2220,s:1.2},{x:-745,y:2390,s:1.6},{x:-800,y:2580,s:1.8},{x:-680,y:2815,s:1.05},{x:-976,y:2865,s:.85}];
export class NoahSouthForest{
 private terrain:Phaser.GameObjects.RenderTexture;private art:Phaser.GameObjects.Graphics;private fungi:Phaser.GameObjects.Graphics;private glow:Phaser.GameObjects.Graphics;private struck=new Set<number>();
 private lastSafe={x:-444,y:2000};private logSafe=logPoint(0);private logLoad=0;private logEdgeTime=0;private logArt:Phaser.GameObjects.Graphics;private hollowFx:Phaser.GameObjects.Graphics;
 get logPose(){return onFloatingLog(this.sceneActor)?floatingLogPose(this.age,this.logLoad):{sway:0,sink:0};}
 private mushroomLight:MushroomLight;
 private sceneActor={x:0,y:0};private herbs:Phaser.GameObjects.Graphics;
 private minorCombat:ForestCombat;private minorState={...createForest(),stick:true};
 get fieldPhase(){return sporeFieldPhase(this.age);}
 get minorRemaining(){return southEnemies.length-this.minorState.defeated.length;}
 setUnlocked(value:boolean){if(!value)this.mushroomLight.hide();const v=this.scene.cameras.main.worldView,visible=value&&v.bottom>1300&&v.top<2950&&v.left<0;this.hollowFx.setVisible(visible);this.glow.setVisible(visible);this.logArt.setVisible(visible);this.terrain.setVisible(visible);this.art.setVisible(visible);this.herbs.setVisible(visible);this.fungi.setVisible(visible);if(!visible)this.mushroomLight.hide();}
 get phaseName(){return this.phase;}
 get hitPoints(){return this.hp;}
 private rootKilled=false;
 private age=0;private timer=1.4;private phase:'rest'|'warn'|'strike'='rest';private hp=6;private invulnerable=0;private swing=0;private aim={x:0,y:-1};
 constructor(private scene:Phaser.Scene){
  this.mushroomLight=new MushroomLight(scene,mushrooms);
  this.hollowFx=scene.add.graphics().setDepth(4);this.logArt=scene.add.graphics().setDepth(3);this.minorCombat=new ForestCombat(scene,southEnemies,inNoahSouth);this.art=scene.add.graphics().setDepth(91);this.herbs=scene.add.graphics().setDepth(2);this.glow=scene.add.graphics().setDepth(94).setBlendMode(Phaser.BlendModes.ADD);this.fungi=scene.add.graphics().setDepth(92);const g=scene.add.graphics();
  // Match the existing meadow and blend the northern edge without a straight seam.
  g.fillStyle(0x759c48).fillRect(-1120,1510,1120,1470);
  for(let y=1320;y<1540;y+=10)for(let x=-1120;x<0;x+=17){const n=Math.abs(Math.sin(x*12.23+y*4.71));g.fillStyle(0x759c48,Math.min(1,(y-1320)/180)).fillRect(x,y,18,12);}
  for(let i=0;i<21000;i++){const n=Math.abs(Math.sin(i*7.713)),x=-1120+(i*73%1117),y=1320+(i*47%1660);g.fillStyle([0x4f783f,0x9bb669,0xb1bf72][i%3],.5).fillRect(x+n*8,y,1+n*2,1);}
  for(const p of southRoute){g.fillStyle(0x365b3c,.17).fillEllipse(p.x-150,p.y+20,210,110);g.fillEllipse(p.x+145,p.y-10,200,95);}
  drawLarchHollow(g);
  // Draw the route as one network, then let the marsh interrupt its middle.
  // Shared polygon edges taper the first steps into grass; never paint over existing crowns.
  const edge=(i:number,width:number)=>{const p=southPath[i],a=southPath[Math.max(0,i-1)],b=southPath[Math.min(southPath.length-1,i+1)],d=Math.hypot(b.x-a.x,b.y-a.y)||1,endFade=p.y>2700?Phaser.Math.Clamp((2750-p.y)/50,0,1):1,t=Phaser.Math.Clamp((p.y-1231)/100,0,1);return {x:p.x,y:p.y,nx:-(b.y-a.y)/d*width*.5*Math.sqrt(t)*endFade,ny:(b.x-a.x)/d*width*.5*Math.sqrt(t)*endFade};};
  for(const [width,color]of [[48,0x647746],[35,0x9b9566],[27,0xb3a878]])for(let i=1;i<southPath.length;i++){const a=edge(i-1,width),b=edge(i,width),alpha=Phaser.Math.Clamp(((a.y+b.y)/2-1231)/85,0,1)*Phaser.Math.Clamp((2750-(a.y+b.y)/2)/50,0,1);g.fillStyle(color,alpha).fillPoints([{x:a.x-a.nx,y:a.y-a.ny},{x:b.x-b.nx,y:b.y-b.ny},{x:b.x+b.nx,y:b.y+b.ny},{x:a.x+a.nx,y:a.y+a.ny}],true);}
  for(let i=0;i<40;i++){const y=1235+i*2.3,x=-444+Math.sin(i*12.7)*(3+i*.12);g.fillStyle(i%3?0xb3a878:0x91a35e,.2+i/75).fillEllipse(x,y,2+i%3,1);}
  const marsh=Array.from({length:40},(_,i)=>{const a=i/40*Math.PI*2,r=1+.05*Math.sin(i*2.7);return{x:-480+Math.cos(a)*165*r,y:2160+Math.sin(a)*143*r};});
  g.fillStyle(0x526447).fillPoints(marsh,true);g.lineStyle(14,0x78815a).strokePoints(marsh,true);g.fillStyle(0x3c6254).fillPoints(marsh,true);
  for(let i=0;i<65;i++){const x=-625+(i*73%290),y=2035+(i*47%245);if(swampAt(x,y)){g.fillStyle(0x7c9463,.35).fillEllipse(x,y,12+i%4*5,3);g.lineStyle(1,0x9fac75,.3).lineBetween(x,y,x+9,y);}}
  for(const p of swampStones){g.fillStyle(0x293e34,.5).fillEllipse(p.x+4,p.y+5,59,30);g.fillStyle(0x8f9b87).fillPoints([{x:p.x-26,y:p.y+6},{x:p.x-20,y:p.y-12},{x:p.x+6,y:p.y-18},{x:p.x+27,y:p.y-3},{x:p.x+20,y:p.y+13},{x:p.x-10,y:p.y+15}],true);g.lineStyle(2,0xc2c5a5).lineBetween(p.x-18,p.y-10,p.x+4,p.y-15);g.fillStyle(0x678153).fillEllipse(p.x+9,p.y+5,18,7);}
  let seed=312;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  for(let y=1380;y<3010;y+=64)for(let x=-1050;x< -60;x+=70){const xx=x+random()*32,yy=y+random()*20;if(distanceToSouthPath(xx,yy)<104||swampAt(xx,yy)||yy>2630&&((xx+820)/232)**2+((yy-2780)/(yy>2780?315:185))**2<1)continue;drawWoodlandTree(g,random,xx,yy,Math.floor(random()*3),.95+random()*.35);}
  // A muddy, root-lined pool interrupts the path; a continuous floating trunk forms the crossing.
  const local=(t:number,n:number)=>logPoint(t,n),hollow=[local(.08,-118),local(.22,-130),local(.85,-122),local(.92,-100),local(.92,108),local(.75,126),local(.15,114),local(.08,90)];
  g.fillStyle(0x657849).fillPoints(hollow,true);g.lineStyle(10,0x83905b).strokePoints(hollow,true);g.fillStyle(0x3d5143).fillPoints(hollow.map(p=>({x:p.x,y:p.y+3})),true);
  for(let i=0;i<44;i++){const p=local(.12+i*.017,Math.sin(i*8.7)*88);g.fillStyle(i%2?0x526044:0x68704a,.5).fillEllipse(p.x,p.y,8+i%4*3,3);}
  for(let i=0;i<16;i++){const p=local(.14+i*.047,i%2?-92:86);g.lineStyle(2,0x6c6240).lineBetween(p.x,p.y,p.x+Math.sin(i*2.7)*12,p.y+13);}
  // Fallen, mossy trunks offer cover from the wind-driven spore field.
  for(const cover of sporeShelters){const p={x:cover.x-34,y:cover.y-8};g.fillStyle(0x2c4838,.5).fillEllipse(p.x+3,p.y+9,65,35);g.fillStyle(0x67513b).fillRoundedRect(p.x-23,p.y-15,46,28,6);g.fillStyle(0x98754c).fillEllipse(p.x,p.y-14,45,19);g.lineStyle(1,0x604b36).strokeEllipse(p.x,p.y-14,31,12);g.fillStyle(0x617a40).fillEllipse(p.x-13,p.y-5,22,12);}
  // Dense rear trees frame the sheltered hollow, leaving its approach and floor open.
  for(const [x,y,kind,scale]of [[-1050,2735,2,1.35],[-1000,2635,0,1.25],[-845,2605,2,1.3],[-650,2650,2,1.25],[-590,2820,0,1.3]])drawWoodlandTree(g,random,x,y,kind,scale);
  drawOldLarch(g);
  for(let i=0;i<24;i++){const x=-900+random()*640,y=1450+random()*1390;g.fillStyle(0xb3a077,.35).fillRect(x,y,3,1);}
  this.terrain=scene.add.renderTexture(-1120,1190,1120,1790).setOrigin(0).setDepth(-.4).setVisible(false);this.terrain.draw(g,1120,-1190);g.destroy();
 }
 attack(player:{x:number;y:number},direction:{x:number;y:number},upgraded:boolean,state:NoahTestState){
  if(this.swing>0)return false;
  const rootDistance=Math.hypot(southRoot.x-player.x,southRoot.y-player.y);
  if(this.rootKilled||rootDistance>110){this.minorCombat.power=upgraded?2:1;return this.minorCombat.attack(player,direction,this.minorState,id=>{if(!this.minorState.defeated.includes(id))this.minorState.defeated.push(id);});}
  this.swing=.55;
  const dx=southRoot.x-player.x,dy=southRoot.y-player.y,d=Math.hypot(dx,dy);
  if(d>(upgraded?100:80)||d>25&&(dx*direction.x+dy*direction.y)/d<.1||this.phase!=='rest')return true;
  this.hp-=upgraded?2:1;this.timer=Math.max(this.timer,.7);this.scene.cameras.main.shake(70,.0015);
  if(this.hp<=0){this.rootKilled=true;state.rootDefeated=true;}return true;
 }
 update(dt:number,player:{x:number;y:number},state:NoahTestState,jumping:boolean,hurt:()=>void,fall?:(point:{x:number;y:number})=>void,day=1,night=0,sunny=true){
  this.sceneActor={x:player.x,y:player.y};if(!inNoahSouth(player.x,player.y)){this.logLoad=0;this.logEdgeTime=0;return;}
  this.age+=dt;this.invulnerable=Math.max(0,this.invulnerable-dt);this.swing=Math.max(0,this.swing-dt);const g=this.art;g.clear();
  if(!state.ingredientGathered){const x=resinTree.x,y=resinTree.y;for(let i=0;i<4;i++){const yy=y-60+i*12+Math.sin(this.age*.8+i)*.65,xx=x+i%2*6-3;g.fillStyle(0x56301b).fillEllipse(xx,yy+1,11,15);g.fillStyle(0xe99224).fillEllipse(xx,yy,9,13);g.fillStyle(0xffc94e).fillEllipse(xx-1,yy-2,6,9);g.fillStyle(0xfff0ab).fillEllipse(xx-2,yy-4,2.5,4);g.lineStyle(.8,0xffe3a0,.8).strokeEllipse(xx,yy,8,12);}const gleam=(Math.sin(this.age*1.7)+1)*.5;g.lineStyle(1,0xffefbe,.25+gleam*.55).lineBetween(x+3,y-54,x+9,y-54).lineBetween(x+6,y-57,x+6,y-51);}

  for(const cone of availableLarchCones(state,day)){const p=coneVisualPoint(cone),cos=Math.cos(cone.angle),sin=Math.sin(cone.angle),at=(dx:number,dy:number)=>({x:p.x+dx*cos-dy*sin,y:p.y+dx*sin+dy*cos});g.fillStyle(0x3f402c,.3).fillEllipse(p.x+2,p.y+3,12,5);g.fillStyle(0x63452c).fillPoints([at(0,-8),at(4,-4),at(5,1),at(1,7),at(-3,4),at(-5,-1)],true);for(let row=0;row<3;row++)for(let side=0;side<2;side++){g.fillStyle((row+side)%2?0xc29c62:0x977042).fillPoints([at(-4+side*4,-6+row*4),at(1+side*4,-4+row*4),at(-2+side*4,-1+row*4)],true);}}
  this.drawMushrooms(night);this.mushroomLight.update(night,this.age);this.drawHollowAtmosphere(player,night,sunny);
  this.herbs.clear();if(state.upgraded)for(const p of southHerbs){if(state.herbsPicked[p.id]!==undefined&&day-state.herbsPicked[p.id]<3)continue;drawForestHerb(this.herbs,p);}
  this.sceneActor={x:player.x,y:player.y};const loaded=onFloatingLog(player)&&!jumping;
  this.logLoad=Phaser.Math.Clamp(this.logLoad+dt*(loaded?.9:-.6),0,1);this.drawFloatingLog();
  const crossing=logCrossingStep(player,jumping,this.logSafe);this.logSafe=crossing.safe;this.logEdgeTime=crossing.fall?this.logEdgeTime+dt:0;if(this.logEdgeTime>=.18){this.logEdgeTime=0;fall?.(this.logSafe);return;}
  if(inNoahSouth(player.x,player.y)){const step=swampStep(player,jumping,this.lastSafe);this.lastSafe=step.safe;if(step.fall){fall?.(this.lastSafe);return;}}
  // Thin drifting mist and small bubbles make the marsh feel alive.
  if(state.upgraded)for(let i=0;i<10;i++){const x=-610+(i*39+this.age*5)%260,y=2090+i%4*35;g.fillStyle(0xc9d5b6,.035).fillEllipse(x,y,90,11);}
  if(state.upgraded)for(let i=0;i<22;i++){
   const x=-620+(i*71%285),y=2040+(i*47%238);if(!swampAt(x,y)||swampStones.some(p=>Math.hypot(p.x-x,p.y-y)<31))continue;
   this.drawMudBubble(g,x,y,i);
  }
  if(state.upgraded)for(let i=0;i<34;i++){const across=-100+(i*43%202),t=.13+(i*19%68)/100;if(Math.abs(across)<30)continue;const p=logPoint(t,across);this.drawMudBubble(g,p.x,p.y,i+22);}

  this.drawSporeField(player,state.upgraded);
  if(state.upgraded&&sporeFieldHurts(this.age,player,jumping)&&this.invulnerable===0){this.invulnerable=1.3;hurt();}
  this.minorCombat.update(dt,player,this.minorState,jumping,hurt);
  if(!inNoahSouth(player.x,player.y)||this.rootKilled)return;
  const {x,y}=southRoot,d=Math.hypot(player.x-x,player.y-y);this.timer-=dt;
  if(this.timer<=0){if(this.phase==='rest'&&d<220){this.phase='warn';this.timer=1;this.aim={x:(player.x-x)/(d||1),y:(player.y-y)/(d||1)};}else if(this.phase==='warn'){this.phase='strike';this.timer=ROOT_STRIKE_DURATION;this.struck.clear();}else{this.phase='rest';this.timer=1.65;}}
  g.fillStyle(0x172f24,.4).fillEllipse(x,y+12,130,42);
  const elapsed=ROOT_STRIKE_DURATION-this.timer;
  for(let i=0;i<ROOT_STRIKE_COUNT;i++){
   const tip=rootStrike(i,this.aim,southRoot),pose=rootStrikePose(elapsed,i),striking=this.phase==='strike',angle=i*Math.PI*2/ROOT_STRIKE_COUNT;
   const end=striking?tip:{x:x+Math.cos(angle)*58,y:y+Math.sin(angle)*36};
   const lifted=striking?pose.active?(1-pose.drop)*65:pose.impact?0:30:12;
   const extension=striking?(pose.active||pose.impact?1:.32):1,xx=x+(end.x-x)*extension,yy=y+(end.y-y)*extension;
   g.lineStyle(9,0x433e2c).strokePoints([{x,y:y-12},{x:x+(xx-x)*.45,y:y-45-lifted},{x:xx,y:yy-lifted}]);g.lineStyle(2,0x9c9870).lineBetween(x+(xx-x)*.45,y-42-lifted,xx,yy-lifted-3);
   g.fillStyle(0xd2c5a0).fillTriangle(xx-4,yy-lifted,xx,yy-lifted-16,xx+4,yy-lifted);
   if(this.phase==='warn'){g.lineStyle(1.5,0xe1b175,.65).strokeEllipse(tip.x,tip.y,54,24);}
   if(striking&&pose.impact){
    const age=elapsed-(i+.6)*ROOT_STRIKE_INTERVAL;
    if(!this.struck.has(i)){this.struck.add(i);this.scene.cameras.main.shake(65,.001);if(!jumping&&Math.hypot(player.x-tip.x,player.y-tip.y)<38&&this.invulnerable===0){this.invulnerable=1.3;hurt();}}
    if(age<.85)for(let j=0;j<8;j++){const a=j*2.4,r=7+age*25;g.fillStyle(j%2?0xa89a75:0x716449,(1-age/.85)*.6).fillEllipse(tip.x+Math.cos(a)*r,tip.y+Math.sin(a)*r*.4-age*13,7+age*10,4+age*6);}
   }
  }
  g.fillStyle(0x4e4d36).fillEllipse(x,y-13,76,61);g.fillStyle(0x777b58).fillEllipse(x-10,y-27,49,40);
  for(let i=0;i<11;i++){g.lineStyle(1,0xcbc9a9,.6).lineBetween(x-28+i*5,y-29+(i%3)*6,x-25+i*5,y+4);}
  if(this.phase==='warn'){g.lineStyle(2,0xe1b175,.8).strokeEllipse(x,y,240,135);g.fillStyle(0xf0bd69).fillEllipse(x-13,y-27,8,4).fillEllipse(x+13,y-27,8,4);}
  g.fillStyle(0x26382a).fillRoundedRect(x-30,y-66,60,5,2);g.fillStyle(0xc6c18a).fillRoundedRect(x-30,y-66,60*Math.max(0,this.hp)/6,5,2);
  for(let i=0;i<9;i++){const a=this.age*.3+i*2.4;g.fillStyle(0xd1c8a0,.35).fillCircle(x+Math.sin(a)*78,y-40+Math.cos(a*1.4)*40,1);}
 }
 restoreRoot(cleared:boolean){this.rootKilled=cleared;if(cleared)this.hp=0;}
 reset(){this.rootKilled=false;this.minorCombat.reset();this.minorState={...createForest(),stick:true};this.hp=6;this.phase='rest';this.timer=1.4;}
 private drawFloatingLog(){const g=this.logArt;g.clear();const pose=floatingLogPose(this.age,this.logLoad),local=(t:number,n:number)=>{const p=logPoint(t,n);return{x:p.x+pose.sway,y:p.y+pose.sink};};
  for(const [from,to]of [[.045,.96]]){
   const a=local(from,0),b=local(to,0);g.lineStyle(48,0x263b2c,.55).lineBetween(a.x+4,a.y+7,b.x+4,b.y+7);
   g.fillStyle(0x735033).fillPoints([local(from,-22),local(to,-22),local(to,22),local(from,22)],true);
   g.fillStyle(0xa67b4b).fillPoints([local(from,-20),local(to,-20),local(to,2),local(from,2)],true);
   for(const offset of [-8,-3,5,10]){const x=local(from,offset),y=local(to,offset+1);g.lineStyle(1,offset<0?0xcc9f64:0x543d2c).lineBetween(x.x,x.y,y.x,y.y);}
   const broken=from<.1?to:from,sign=from<.1?1:-1;
   const ring=(radius:number)=>Array.from({length:18},(_,i)=>local(broken+Math.cos(i/18*Math.PI*2)*.012*radius,Math.sin(i/18*Math.PI*2)*21*radius));
   g.fillStyle(0xc5a16b).fillPoints(ring(1),true);for(const radius of [.4,.7,.95])g.lineStyle(1,0x8d633d).strokePoints(ring(radius),true);
   const knot=local((from+to)/2,4);g.fillStyle(0x523c2b).fillEllipse(knot.x,knot.y,7,5);g.lineStyle(1,0xd2ad70).strokeEllipse(knot.x,knot.y,11,7);
   const branch=local((from+to)/2,-20),tip=local((from+to)/2+.035,-35);g.lineStyle(7,0x735033).lineBetween(branch.x,branch.y,tip.x,tip.y);g.fillStyle(0xb48b55).fillEllipse(tip.x,tip.y,5,4);
   for(let i=0;i<5;i++){const p=local(broken,(i-2)*5),tip=local(broken+sign*(.025+i%2*.015),(i-2)*5+2);g.lineStyle(2,i%2?0xc8a16b:0x8a633d).lineBetween(p.x,p.y,tip.x,tip.y);}
   for(let i=0;i<5;i++){const p=local(from+(to-from)*i/5,-8);g.fillStyle(0x779453,.8).fillEllipse(p.x,p.y,10,4);}
  }
 }
 private drawMudBubble(g:Phaser.GameObjects.Graphics,x:number,y:number,i:number){
  const t=(this.age*.5+i*.173)%1,r=2+Math.sin(Math.min(1,t/.72)*Math.PI/2)*(3+i%4);
  if(t<.72){g.fillStyle(0x795838,.65).fillEllipse(x,y-t*4,r*2,r*1.3);g.lineStyle(1,0xb08d57,.7).strokeEllipse(x-1,y-t*4,r*1.7,r);g.fillStyle(0xc4a571,.65).fillEllipse(x-r*.25,y-t*4-r*.2,2,1);}
  else{const pop=(t-.72)/.28;g.lineStyle(1,0x9b7950,1-pop).strokeEllipse(x,y-2,12+pop*14,5+pop*5);for(let j=0;j<3;j++)g.fillStyle(0x8d6a45,1-pop).fillCircle(x+(j-1)*pop*10,y-2-Math.sin(pop*Math.PI)*(5+j),1.2);}
 }
 private drawSporeField(player:{x:number;y:number},unlocked:boolean){
  if(!unlocked)return;const g=this.art,phase=sporeFieldPhase(this.age),releasing=phase==='release',warning=phase==='warning';
  for(const [i,p]of [{x:-780,y:1800},{x:-560,y:1830},{x:-765,y:1890}].entries()){
   const swell=warning?1+Math.sin(this.age*9)*.1:1;g.fillStyle(0xada191).fillRoundedRect(p.x-6,p.y-22,12,30,4);g.fillStyle(0x715968).fillEllipse(p.x,p.y-28,58*swell,31*swell);g.fillStyle(0xbba6b3).fillEllipse(p.x-10,p.y-34,24,12);
   for(let j=0;j<6;j++)g.fillStyle(warning?0xe6c294:0xcfbfc3).fillCircle(p.x+Math.cos(j*2.4)*18,p.y-29+Math.sin(j*2.4)*7,2.5);
   if(releasing)for(let j=0;j<20;j++){const t=(this.age*.45+j*.077+i*.23)%1,x=p.x+t*160,y=p.y-22+Math.sin(j*2.4)*19;g.fillStyle(0xc5b396,(1-t)*.24).fillEllipse(x,y,20+t*35,12+t*17);g.fillStyle(0xe4cfa8,(1-t)*.7).fillCircle(x+Math.sin(j)*9,y-5,1+j%2);}
  }
  if(warning)for(let i=0;i<15;i++){const p=southPath.find(p=>p.y>=1775+i*8);if(!p)continue;const pulse=.35+Math.sin(this.age*10+i*.2)*.15;g.lineStyle(1,0xd7ba87,pulse).strokeEllipse(p.x,p.y,58,13);}
  if(releasing)for(let i=0;i<70;i++){const y=1775+i*1.8,p=southPath.find(p=>p.y>=y);if(!p)continue;const t=(this.age*.7+i*.13)%1,x=p.x-100+t*200;g.fillStyle(0xb5b697,.1*Math.sin(t*Math.PI)).fillEllipse(x,y-16,42,20);g.fillStyle(0xe2d6ac,.7*Math.sin(t*Math.PI)).fillCircle(x,y-18+Math.sin(i)*10,1.5);}
  if(releasing)for(let i=0;i<45;i++){const x=-810+(i*47+this.age*60)%350,y=1782+i*31%120;g.fillStyle(0xc5baa2,.2).fillCircle(x,y,1+i%2);}
  if(inSporeField(player.x,player.y)&&sporeSheltered(player.x,player.y))for(const p of sporeShelters)g.lineStyle(1,0xc4d39c,.45).strokeEllipse(p.x,p.y+6,58,32);
 }
 private drawHollowAtmosphere(player:{x:number;y:number},night:number,sunny:boolean){
  const g=this.hollowFx;g.clear();if(Math.hypot(player.x-larchGlade.x,player.y-larchGlade.y)>420)return;
  const {x,y}=larchGlade;
  for(let i=0;i<3;i++){const cx=x-100+(this.age*5+i*43)%210,cy=y+32+i%3*19,points=[];for(let j=0;j<=18;j++){const xx=cx-65+j*7,yy=cy+Math.sin(j*.4+this.age*.3+i)*4;points.push({x:xx,y:yy});}for(let j=18;j>=0;j--){const xx=cx-65+j*7,yy=cy+Math.sin(j*.4+this.age*.3+i)*4+Math.sin(j/18*Math.PI)*7;points.push({x:xx,y:yy});}g.fillStyle(night>.2?0xa1a6b5:0xd6ddbd,.055).fillPoints(points,true);}
  // Small reflections and a falling needle ripple make the shallow pool readable.
  const p=gladePool,ripple=(this.age*.16)%1;g.lineStyle(.8,0xc5d2b3,(1-ripple)*.28).strokeEllipse(p.x-9,p.y-1,3+ripple*42,1+ripple*9);
  for(let i=0;i<3;i++){const xx=p.x-23+i*17+Math.sin(this.age*.6+i)*2;g.lineStyle(1,0xb6c7b2,.22).lineBetween(xx,p.y-4+i*3,xx+9,p.y-4+i*3);}
  for(let i=0;i<12;i++){const t=(this.age*.035+i*.13)%1,xx=x-110+t*228,yy=y-54+i*29%103+Math.sin(this.age*.45+i)*3;g.fillStyle(night>.2?0xc5c6a5:0xf3d9a1,.2+Math.sin(t*Math.PI)*.22).fillRect(xx,yy,i%4===0?1.5:1,1);}
  for(let i=0;i<8;i++){const xx=x+137+i%3*7,yy=y-52+i*17;g.lineStyle(1,0x6b8a4d,.7).lineBetween(xx,yy,xx+Math.sin(this.age*.9+i)*3,yy-7-i%3*2);}
  const sun=sunny?1-Math.min(1,night/.3):0;if(sun>0){for(let i=0;i<5;i++)g.fillStyle(0xf6d490,sun*.014).fillPoints([{x:resinTree.x-65-i*2,y:resinTree.y-195},{x:resinTree.x-45+i*2,y:resinTree.y-195},{x:resinTree.x+34+i*3,y:resinTree.y+20},{x:resinTree.x-5-i*3,y:resinTree.y+22}],true);}
 }
 private drawMushrooms(night:number){drawMushroomArt(this.fungi,this.glow,mushrooms,this.age,night);}
 destroy(){this.mushroomLight.destroy();this.hollowFx.destroy();this.glow.destroy();this.logArt.destroy();this.fungi.destroy();this.terrain.destroy();this.art.destroy();this.herbs.destroy();this.minorCombat.destroy();}
}
