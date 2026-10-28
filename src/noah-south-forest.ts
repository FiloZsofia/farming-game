import Phaser from 'phaser';
import {ForestCombat} from './forest-combat';
import {createForest} from './forest';
import {drawWoodlandTree} from './woodland-tree';
import type {NoahTestState} from './noah-test-story';
export const resinTree={x:-665,y:2058};
export const southRoot={x:-490,y:1750};
export const inNoahSouth=(x:number,y:number)=>x<0&&y>=1300&&y<2240;
const pathX=(y:number)=>y<1510?-444:y<1790?-444-(y-1510)*.2:-500-(y-1790)*.46;
export function southBlocked(x:number,y:number,state:NoahTestState){
 if(x>=0||y<1190)return null;
 if(!state.simonAsked&&y>1295)return true;
 if(y>2200||x< -1040||x> -120)return true;
 if(y<1350)return Math.abs(x+444)>31;
 if(y>1695&&y<1800&&!state.rootDefeated)return Math.abs(x+490)>90||y>1735;
 return Math.abs(x-pathX(y))>(y>1930?125:105);
}
export class NoahSouthForest{
 private terrain:Phaser.GameObjects.Graphics;private art:Phaser.GameObjects.Graphics;
 private label:Phaser.GameObjects.Text;private minorCombat:ForestCombat;private minorState={...createForest(),stick:true};
 get minorRemaining(){return 2-this.minorState.defeated.length;}
 setUnlocked(value:boolean){this.terrain.setVisible(value);this.art.setVisible(value);}
 get phaseName(){return this.phase;}
 get hitPoints(){return this.hp;}
 private age=0;private timer=1.4;private phase:'rest'|'warn'|'strike'='rest';private hp=6;private invulnerable=0;private swing=0;private aim={x:0,y:-1};
 constructor(private scene:Phaser.Scene){
  this.minorCombat=new ForestCombat(scene,[{id:'vine',kind:'vine',x:-440,y:1475,hp:3},{id:'spore-a',kind:'spore',x:-495,y:1590,hp:2}],inNoahSouth);this.terrain=scene.add.graphics().setDepth(-.4).setVisible(false);this.art=scene.add.graphics().setDepth(91);this.label=scene.add.text(southRoot.x+122,southRoot.y-78,'Gombával átszőtt gyökércsomó',{fontFamily:'sans-serif',fontSize:'11px',color:'#f1dfb9',stroke:'#263c2b',strokeThickness:3}).setOrigin(.5).setDepth(93);const g=this.terrain;
  // Match the existing meadow and blend the northern edge without a straight seam.
  g.fillStyle(0x759c48).fillRect(-1120,1510,1120,770);
  for(let y=1320;y<1540;y+=10)for(let x=-1120;x<0;x+=17){const n=Math.abs(Math.sin(x*12.23+y*4.71));g.fillStyle(0x759c48,Math.min(1,(y-1320)/180)).fillRect(x,y,18,12);}
  for(let i=0;i<13500;i++){const n=Math.abs(Math.sin(i*7.713)),x=-1120+(i*73%1117),y=1320+(i*47%950);g.fillStyle([0x4f783f,0x9bb669,0xb1bf72][i%3],.5).fillRect(x+n*8,y,1+n*2,1);}
  for(let i=0;i<25;i++){const y=1400+i*32,x=pathX(y)+(i%2?190:-185);g.fillStyle(0x365b3c,.1).fillEllipse(x,y,230,95);}
  const points=Array.from({length:48},(_,i)=>{const y=1231+i*20;return{x:pathX(y),y};});
  g.lineStyle(48,0x647746).strokePoints(points);g.lineStyle(35,0x9b9566).strokePoints(points);g.lineStyle(27,0xb3a878).strokePoints(points);
  let seed=312;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  for(let y=1380;y<2260;y+=64)for(let x=-1050;x< -60;x+=70){const xx=x+random()*32,yy=y+random()*20;if(Math.abs(xx-pathX(yy))<145)continue;drawWoodlandTree(g,random,xx,yy,Math.floor(random()*3),.95+random()*.35);}
  // A living larch with warm bark and soft needles supplies naturally exuded resin.
  g.fillStyle(0x253e2c,.4).fillEllipse(resinTree.x,resinTree.y+14,140,30);
  drawWoodlandTree(g,random,resinTree.x,resinTree.y,2,1.5);
  g.fillStyle(0x73523a).fillRoundedRect(resinTree.x-13,resinTree.y-83,26,85,5);
  for(let i=0;i<6;i++)g.lineStyle(1.3,0xb28a58).lineBetween(resinTree.x-9+i*4,resinTree.y-76,resinTree.x-10+i*4,resinTree.y-7);
  g.lineStyle(3,0x4a3929).strokePoints([{x:resinTree.x-3,y:resinTree.y-65},{x:resinTree.x+3,y:resinTree.y-48},{x:resinTree.x-2,y:resinTree.y-30}]);
  for(let i=0;i<24;i++){const x=-900+random()*640,y=1450+random()*730;g.fillStyle(0xb3a077,.35).fillRect(x,y,3,1);}
 }
 attack(player:{x:number;y:number},direction:{x:number;y:number},upgraded:boolean,state:NoahTestState){
  if(this.swing>0)return false;
  const rootDistance=Math.hypot(southRoot.x-player.x,southRoot.y-player.y);
  if(state.rootDefeated||rootDistance>110){this.minorCombat.power=upgraded?2:1;return this.minorCombat.attack(player,direction,this.minorState,id=>{if(!this.minorState.defeated.includes(id))this.minorState.defeated.push(id);});}
  this.swing=.55;
  const dx=southRoot.x-player.x,dy=southRoot.y-player.y,d=Math.hypot(dx,dy);
  if(d>(upgraded?100:80)||d>25&&(dx*direction.x+dy*direction.y)/d<.1||this.phase!=='rest')return true;
  this.hp-=upgraded?2:1;this.timer=Math.max(this.timer,.7);this.scene.cameras.main.shake(70,.0015);
  if(this.hp<=0)state.rootDefeated=true;return true;
 }
 update(dt:number,player:{x:number;y:number},state:NoahTestState,jumping:boolean,hurt:()=>void){
  this.label.setVisible(inNoahSouth(player.x,player.y)&&!state.rootDefeated&&Math.hypot(player.x-southRoot.x,player.y-southRoot.y)<210);this.age+=dt;this.invulnerable=Math.max(0,this.invulnerable-dt);this.swing=Math.max(0,this.swing-dt);const g=this.art;g.clear();
  if(!state.ingredientGathered){const x=resinTree.x,y=resinTree.y;for(let i=0;i<4;i++){const yy=y-57+i*11+Math.sin(this.age*.8+i)*1.4;g.fillStyle(0xbf7c2d).fillEllipse(x+i%2*5-3,yy,7,11);g.fillStyle(0xe9b751).fillEllipse(x+i%2*5-4,yy-1,4,8);g.fillStyle(0xffdf9a).fillEllipse(x+i%2*5-5,yy-3,1.5,3);}}

  this.minorCombat.update(dt,player,this.minorState,jumping,hurt);
  if(!inNoahSouth(player.x,player.y)||state.rootDefeated)return;
  const {x,y}=southRoot,d=Math.hypot(player.x-x,player.y-y);this.timer-=dt;
  if(this.timer<=0){if(this.phase==='rest'&&d<220){this.phase='warn';this.timer=1;this.aim={x:(player.x-x)/(d||1),y:(player.y-y)/(d||1)};}else if(this.phase==='warn'){this.phase='strike';this.timer=.35;}else{this.phase='rest';this.timer=1.65;}}
  g.fillStyle(0x172f24,.4).fillEllipse(x,y+12,130,42);
  for(let i=0;i<9;i++){const a=i*Math.PI*2/9,stretch=this.phase==='strike'?125:55+Math.sin(this.age*2+i)*4;const xx=x+Math.cos(a)*stretch,yy=y+Math.sin(a)*stretch*.6;
   g.lineStyle(9,0x433e2c).strokePoints([{x,y:y-12},{x:x+Math.cos(a)*35,y:y-48},{x:xx,y:yy}]);g.lineStyle(2,0x9c9870).lineBetween(x+Math.cos(a)*35,y-44,xx,yy-3);
   g.fillStyle(0xd2c5a0).fillTriangle(xx-4,yy,xx,yy-16,xx+4,yy);}
  g.fillStyle(0x4e4d36).fillEllipse(x,y-13,76,61);g.fillStyle(0x777b58).fillEllipse(x-10,y-27,49,40);
  for(let i=0;i<11;i++){g.lineStyle(1,0xcbc9a9,.6).lineBetween(x-28+i*5,y-29+(i%3)*6,x-25+i*5,y+4);}
  if(this.phase==='warn'){g.lineStyle(2,0xe1b175,.8).strokeEllipse(x,y,240,135);g.fillStyle(0xf0bd69).fillEllipse(x-13,y-27,8,4).fillEllipse(x+13,y-27,8,4);}
  if(this.phase==='strike'&&!jumping&&d<125&&this.invulnerable===0){this.invulnerable=1.3;hurt();}
  g.fillStyle(0x26382a).fillRoundedRect(x-30,y-66,60,5,2);g.fillStyle(0xc6c18a).fillRoundedRect(x-30,y-66,60*Math.max(0,this.hp)/6,5,2);
  for(let i=0;i<9;i++){const a=this.age*.3+i*2.4;g.fillStyle(0xd1c8a0,.35).fillCircle(x+Math.sin(a)*78,y-40+Math.cos(a*1.4)*40,1);}
 }
 reset(){this.minorCombat.reset();this.minorState={...createForest(),stick:true};this.hp=6;this.phase='rest';this.timer=1.4;}
 destroy(){this.terrain.destroy();this.art.destroy();this.label.destroy();this.minorCombat.destroy();}
}
