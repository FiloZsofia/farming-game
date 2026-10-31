import Phaser from 'phaser';
import {forestEnemies,forestGateBlocked,encounterDefeated,type Forest,inForest} from './forest';
export type ForestEnemyDefinition={id:string;kind:'vine'|'spore';x:number;y:number;hp:number};
type Enemy={id:string;kind:'vine'|'spore';x:number;y:number;homeX:number;homeY:number;hp:number;timer:number;phase:'rest'|'warn'|'strike';aimX:number;aimY:number};
export class ForestCombat{
 private art:Phaser.GameObjects.Graphics;private enemies:Enemy[]=[];private invulnerable=0;private swing=0;private time=0;
 health=5;power=1;
 constructor(private scene:Phaser.Scene,private definitions:readonly ForestEnemyDefinition[]=forestEnemies,private contains:(x:number,y:number)=>boolean=inForest){this.art=scene.add.graphics().setDepth(91);}
 reset(){this.enemies=[];this.health=5;this.invulnerable=0;this.swing=0;}
 blocks(x:number,y:number,state:Forest){return forestGateBlocked(x,y,state);}
 encounterName(player:{x:number;y:number},state:Forest){const enemy=this.enemies.filter(e=>e.hp>0&&!encounterDefeated(state).includes(e.id)&&Math.hypot(e.x-player.x,e.y-player.y)<170).sort((a,b)=>Math.hypot(a.x-player.x,a.y-player.y)-Math.hypot(b.x-player.x,b.y-player.y))[0];return enemy?`${enemy.kind==='vine'?'Indagubanc':'Spórapamacs'} · Túrabot: F / kattintás · Space: kitérés`:'';}
 attack(player:{x:number;y:number},direction:{x:number;y:number},state:Forest,onDefeat:(id:string)=>void){
  if(this.swing>0||!state.stick)return false;this.swing=.58;
  for(const e of this.enemies){const dx=e.x-player.x,dy=e.y-player.y,d=Math.hypot(dx,dy);if(e.hp<=0||encounterDefeated(state).includes(e.id)||d>76+(this.power>1?14:0)||(d>24&&(dx*direction.x+dy*direction.y)/d<.15))continue;e.hp=Math.max(0,e.hp-this.power);e.timer=.6;e.phase='rest';if(e.hp===0)onDefeat(e.id);else if(e.kind==='spore'){e.x+=dx/(d||1)*12*this.power;e.y+=dy/(d||1)*12*this.power;}break;}
  return true;
 }
 update(dt:number,player:{x:number;y:number},state:Forest,jumping:boolean,onHurt:()=>void){
  this.time+=dt;this.swing=Math.max(0,this.swing-dt);this.invulnerable=Math.max(0,this.invulnerable-dt);const g=this.art;g.clear();
  if(!this.contains(player.x,player.y))return;
  if(!this.enemies.length)this.enemies=this.definitions.map((e,i)=>({...e,homeX:e.x,homeY:e.y,timer:1+i*.4,phase:'rest',aimX:0,aimY:0}));
  if(this.definitions===forestEnemies&&encounterDefeated(state).includes('vine-inner')&&!forestEnemies.every(e=>encounterDefeated(state).includes(e.id))){g.lineStyle(8,0x486237).strokePoints([{x:-907,y:954},{x:-881,y:977},{x:-900,y:1007},{x:-863,y:1040}]);g.lineStyle(5,0x6d8043).lineBetween(-866,954,-903,1040);}
  for(const e of this.enemies){if(encounterDefeated(state).includes(e.id)||e.hp<=0)continue;const distance=Math.hypot(player.x-e.x,player.y-e.y);e.timer-=dt;
   if(e.timer<=0){if(e.phase==='rest'&&distance<155){e.phase='warn';e.timer=.9;const d=distance||1;e.aimX=(player.x-e.x)/d;e.aimY=(player.y-e.y)/d;}
    else if(e.phase==='warn'){e.phase='strike';e.timer=.3;}else{e.phase='rest';e.timer=1.5;}}
   if(e.phase==='strike'&&e.kind==='spore'){e.x+=e.aimX*dt*130;e.y+=e.aimY*dt*130;}
   if(e.phase==='rest'&&e.kind==='spore'){e.x+=(e.homeX-e.x)*dt*.6;e.y+=(e.homeY-e.y)*dt*.6;}
   const reach=e.kind==='vine'?72:22,hitX=e.x+(e.kind==='vine'?e.aimX*45:0),hitY=e.y+(e.kind==='vine'?e.aimY*45:0);
   if(e.phase==='strike'&&!jumping&&this.invulnerable<=0&&Math.hypot(player.x-hitX,player.y-hitY)<reach*.6+10){this.health=Math.max(0,this.health-1);this.invulnerable=1.3;onHurt();}
   g.fillStyle(0x25372c,.25).fillEllipse(e.x,e.y+4,e.kind==='vine'?56:33,12);
   if(e.phase==='warn'){const reach=e.kind==='vine'?45:39;g.lineStyle(2,0xe7b56c,.75).strokeCircle(e.x+e.aimX*reach,e.y+e.aimY*reach,e.kind==='vine'?53:24);g.lineStyle(4,0xe7b56c,.6).lineBetween(e.x,e.y,e.x+e.aimX*60,e.y+e.aimY*60);}
   if(e.kind==='vine'){
    const pulse=Math.sin(this.time*3+e.homeX)*2,coil=e.phase==='warn'?7:0;
    g.fillStyle(0x293f2d).fillEllipse(e.x,e.y-4,61,37);g.fillStyle(0x3d6037).fillEllipse(e.x,e.y-13,45,32);
    for(let i=0;i<5;i++){const angle=i*Math.PI*.4+this.time*.14,dx=Math.cos(angle)*30,dy=Math.sin(angle)*17;g.lineStyle(7,0x304e2d).strokePoints([{x:e.x,y:e.y-9},{x:e.x+dx*.5,y:e.y-24-coil},{x:e.x+dx,y:e.y+dy-8+pulse},{x:e.x+dx*1.3,y:e.y+dy+5}]);g.lineStyle(1.4,0x849a50).lineBetween(e.x+dx*.6,e.y-16-coil,e.x+dx,e.y+dy-9);g.fillStyle(0xb5a572).fillTriangle(e.x+dx,e.y+dy-12,e.x+dx+4,e.y+dy-20,e.x+dx+7,e.y+dy-8);}
    g.fillStyle(0x182d20).fillEllipse(e.x,e.y-11,25,19);g.fillStyle(e.phase==='warn'?0xffd16c:0xd2a358).fillEllipse(e.x-7,e.y-17,6,3).fillEllipse(e.x+7,e.y-17,6,3);g.lineStyle(2,0x8d9c58).lineBetween(e.x-10,e.y-5,e.x+9,e.y-8);
    for(const side of [-1,1]){const reach=e.phase==='strike'?80:30,dx=e.phase==='strike'?e.aimX*reach:side*reach,dy=e.phase==='strike'?e.aimY*reach:Math.sin(this.time*2+side)*6;g.lineStyle(6,0x59773d).strokePoints([{x:e.x+side*12,y:e.y-7},{x:e.x+dx*.6,y:e.y-24-coil},{x:e.x+dx,y:e.y+dy}]);for(let j=1;j<4;j++)g.fillStyle(0xc3b185).fillTriangle(e.x+dx*j/4,e.y+dy*j/4-8,e.x+dx*j/4+3,e.y+dy*j/4-15,e.x+dx*j/4+5,e.y+dy*j/4-5);}

   }else{
    const y=e.y-(e.phase==='strike'?Math.sin(e.timer/.3*Math.PI)*20:3+Math.sin(this.time*3+e.homeX)*2),s=e.phase==='warn'?.8:1;
    // A lobed, fibrous puffball with a shaded underside and moving spore dust.
    g.fillStyle(0x626b50).fillEllipse(e.x,y+1,24*s,11);g.lineStyle(1,0xa8ab7d,.85);
    for(let i=0;i<7;i++){const dx=(i-3)*4;g.strokePoints([{x:e.x+dx,y:y+1},{x:e.x+dx*1.25,y:y+5+Math.sin(this.time*3+i)*2},{x:e.x+dx*1.45+2,y:y+7}]);}
    for(let i=0;i<10;i++){const a=i*Math.PI*.2,r=14+(i%3)*1.2,cx=e.x+Math.cos(a)*r*s,cy=y-12+Math.sin(a)*r*.72;g.fillStyle(i%2?0x9d9d7e:0x7e8969).fillEllipse(cx,cy,10*s,10);}
    g.fillStyle(0x8e9473).fillEllipse(e.x,y-10,33*s,29);g.fillStyle(0xc5bc95).fillEllipse(e.x-4,y-16,25*s,23);g.fillStyle(0xded3aa,.7).fillEllipse(e.x-7,y-21,14*s,9);
    for(let i=0;i<14;i++){const a=i*2.4,rx=Math.cos(a)*(5+i%4*2.5),ry=Math.sin(a)*(4+i%3*2);g.fillStyle(i%3?0xa49c78:0xe0d7b1,.8).fillCircle(e.x+rx*s,y-13+ry,i%3===0?1.3:.7);}
    g.lineStyle(.8,0xe7dfb9,.65);for(let i=0;i<8;i++){const a=i*Math.PI*.25;g.lineBetween(e.x+Math.cos(a)*13*s,y-12+Math.sin(a)*10,e.x+Math.cos(a)*21*s,y-12+Math.sin(a)*16);}
    g.fillStyle(0x566048).fillEllipse(e.x-6,y-10,4.5,5).fillEllipse(e.x+6,y-10,4.5,5);g.fillStyle(e.phase==='warn'?0xf4d592:0xc5ceae).fillCircle(e.x-6.5,y-11,1).fillCircle(e.x+5.5,y-11,1);
    for(let i=0;i<7;i++){const a=i*Math.PI*2/7+this.time*.55,drift=22+Math.sin(this.time*1.4+i)*5;g.fillStyle(0xded2a6,.4+(i%3)*.16).fillCircle(e.x+Math.cos(a)*drift,y-13+Math.sin(a)*20,1+i%2*.5);}

   }
   const max=this.definitions.find(d=>d.id===e.id)?.hp??3;if(e.hp<max){g.fillStyle(0x303e30).fillRoundedRect(e.x-13,e.y-40,26,4,2);g.fillStyle(0xb3c17b).fillRoundedRect(e.x-13,e.y-40,26*e.hp/max,4,2);}
  }
 }
 destroy(){this.art.destroy();}
}
