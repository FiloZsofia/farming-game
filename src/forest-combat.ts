import Phaser from 'phaser';
import {forestEnemies,type Forest,inForest} from './forest';
type Enemy={id:string;kind:'vine'|'spore';x:number;y:number;homeX:number;homeY:number;hp:number;timer:number;phase:'rest'|'warn'|'strike';aimX:number;aimY:number};
export class ForestCombat{
 private art:Phaser.GameObjects.Graphics;private enemies:Enemy[]=[];private invulnerable=0;private swing=0;private time=0;
 health=5;
 constructor(private scene:Phaser.Scene){this.art=scene.add.graphics().setDepth(91);}
 reset(){this.enemies=[];this.health=5;this.invulnerable=0;this.swing=0;}
 blocks(x:number,y:number,state:Forest){return !state.defeated.includes('vine')&&Math.hypot((x+665)/24,(y-977)/36)<1;}
 encounterName(player:{x:number;y:number},state:Forest){const enemy=this.enemies.filter(e=>e.hp>0&&!state.defeated.includes(e.id)&&Math.hypot(e.x-player.x,e.y-player.y)<170).sort((a,b)=>Math.hypot(a.x-player.x,a.y-player.y)-Math.hypot(b.x-player.x,b.y-player.y))[0];return enemy?`${enemy.kind==='vine'?'Indagubanc':'Spórapamacs'} · Túrabot: F / kattintás · Space: kitérés`:'';}
 attack(player:{x:number;y:number},direction:{x:number;y:number},state:Forest,onDefeat:(id:string)=>void){
  if(this.swing>0||!state.stick)return false;this.swing=.58;
  for(const e of this.enemies){const dx=e.x-player.x,dy=e.y-player.y,d=Math.hypot(dx,dy);if(e.hp<=0||state.defeated.includes(e.id)||d>76||(d>24&&(dx*direction.x+dy*direction.y)/d<.15))continue;e.hp--;e.timer=.6;e.phase='rest';if(e.hp===0)onDefeat(e.id);else if(e.kind==='spore'){e.x+=dx/(d||1)*12;e.y+=dy/(d||1)*12;}break;}
  return true;
 }
 update(dt:number,player:{x:number;y:number},state:Forest,jumping:boolean,onHurt:()=>void){
  this.time+=dt;this.swing=Math.max(0,this.swing-dt);this.invulnerable=Math.max(0,this.invulnerable-dt);const g=this.art;g.clear();
  if(!inForest(player.x,player.y))return;
  if(!this.enemies.length)this.enemies=forestEnemies.map((e,i)=>({...e,homeX:e.x,homeY:e.y,timer:1+i*.4,phase:'rest',aimX:0,aimY:0}));
  for(const e of this.enemies){if(state.defeated.includes(e.id)||e.hp<=0)continue;const distance=Math.hypot(player.x-e.x,player.y-e.y);e.timer-=dt;
   if(e.timer<=0){if(e.phase==='rest'&&distance<155){e.phase='warn';e.timer=.9;const d=distance||1;e.aimX=(player.x-e.x)/d;e.aimY=(player.y-e.y)/d;}
    else if(e.phase==='warn'){e.phase='strike';e.timer=.3;}else{e.phase='rest';e.timer=1.5;}}
   if(e.phase==='strike'&&e.kind==='spore'){e.x+=e.aimX*dt*130;e.y+=e.aimY*dt*130;}
   if(e.phase==='rest'&&e.kind==='spore'){e.x+=(e.homeX-e.x)*dt*.6;e.y+=(e.homeY-e.y)*dt*.6;}
   const reach=e.kind==='vine'?72:22,hitX=e.x+(e.kind==='vine'?e.aimX*45:0),hitY=e.y+(e.kind==='vine'?e.aimY*45:0);
   if(e.phase==='strike'&&!jumping&&this.invulnerable<=0&&Math.hypot(player.x-hitX,player.y-hitY)<reach*.6+10){this.health=Math.max(0,this.health-1);this.invulnerable=1.3;onHurt();}
   g.fillStyle(0x25372c,.25).fillEllipse(e.x,e.y+4,e.kind==='vine'?56:33,12);
   if(e.phase==='warn'){const reach=e.kind==='vine'?45:39;g.lineStyle(2,0xe7b56c,.75).strokeCircle(e.x+e.aimX*reach,e.y+e.aimY*reach,e.kind==='vine'?53:24);g.lineStyle(4,0xe7b56c,.6).lineBetween(e.x,e.y,e.x+e.aimX*60,e.y+e.aimY*60);}
   if(e.kind==='vine'){
    g.lineStyle(7,0x395b38).strokePoints([{x:e.x-23,y:e.y+6},{x:e.x-15,y:e.y-19},{x:e.x+3,y:e.y-27},{x:e.x+20,y:e.y-9},{x:e.x+10,y:e.y+5},{x:e.x-9,y:e.y-5}]);g.lineStyle(2,0x96a15a).lineBetween(e.x-19,e.y-15,e.x+1,e.y-23);for(let i=0;i<5;i++)g.fillStyle(0x65814c).fillEllipse(e.x-22+i*10,e.y-13+(i%2)*10,15,8);
    if(e.phase==='strike')g.lineStyle(6,0x7c9150).lineBetween(e.x,e.y-10,e.x+e.aimX*80,e.y+e.aimY*80);
   }else{
    const y=e.y-(e.phase==='strike'?Math.sin(e.timer/.3*Math.PI)*20:3+Math.sin(this.time*3+e.homeX)*2),s=e.phase==='warn'?.8:1;
    g.fillStyle(0x8e8870).fillEllipse(e.x,y-8,29*s,24/s);g.fillStyle(0xc0b997).fillEllipse(e.x-4,y-12,20*s,16);g.fillStyle(0x6e7359).fillCircle(e.x-5,y-8,1.5).fillCircle(e.x+5,y-8,1.5);for(let i=0;i<5;i++){const a=i*Math.PI*.4+this.time*.5;g.fillStyle(0xd1c69d,.55).fillCircle(e.x+Math.cos(a)*20,y-8+Math.sin(a)*15,1.3);}
   }
   const max=e.kind==='vine'?3:2;if(e.hp<max){g.fillStyle(0x303e30).fillRoundedRect(e.x-13,e.y-40,26,4,2);g.fillStyle(0xb3c17b).fillRoundedRect(e.x-13,e.y-40,26*e.hp/max,4,2);}
  }
 }
 destroy(){this.art.destroy();}
}
