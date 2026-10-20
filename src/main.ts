import Phaser from 'phaser';
import './style.css';
import { move, START } from './movement';
const dialogue=document.querySelector<HTMLDialogElement>('#dialogue')!;
const story='A kutatólaborban mindig akadt egy újabb feladat. Szerettem a munkámat, de elfáradtam. Változásra volt szükségem.\n\nMost itt vagyok. A ház előtt gaz nő, a kerítés javításra vár. Nem kell mindent ma rendbe hoznom. Ez egy új kezdet.';
function showDialogue(title:string,text:string,label='A BIRTOKON'){
 release();
 document.querySelector('#dialogue-title')!.textContent=title;
 document.querySelector('#dialogue-text')!.textContent=text;
 document.querySelector('#dialogue-label')!.textContent=label;
 if(!dialogue.open)dialogue.showModal();
}
document.querySelector('#story')!.addEventListener('click',()=>showDialogue('Végre megérkeztem.',story,'EGY ÚJ KEZDET'));
document.querySelector('#help')!.addEventListener('click',()=>showDialogue('Lassan, a saját tempódban.','Mozgás: WASD, nyilak vagy a képernyő iránygombjai.\n\nA háznál, tónál és melléképületnél az E billentyűvel vagy a megjelenő jelzésre kattintva nézhetsz körül. A Házhoz gomb visszavisz a verandára.\n\nEz még mozgáspróba: a kertészkedés, a játékidő és a mentés később készül el.','IRÁNYÍTÁS'));
const held=new Set<string>();
function release(){held.clear();document.querySelectorAll('.active').forEach(el=>el.classList.remove('active'));}
window.addEventListener('blur',release);document.addEventListener('visibilitychange',()=>{if(document.hidden)release();});
document.querySelectorAll<HTMLButtonElement>('[data-dir]').forEach(button=>{
 button.addEventListener('pointerdown',e=>{if(button.hasPointerCapture(e.pointerId) || e.isTrusted) button.setPointerCapture(e.pointerId);held.add(button.dataset.dir!);button.classList.add('active');});
 const up=()=>{held.delete(button.dataset.dir!);button.classList.remove('active');};
 button.addEventListener('pointerup',up);button.addEventListener('pointercancel',up);button.addEventListener('lostpointercapture',up);
});
class Farm extends Phaser.Scene {
 private actor!:Phaser.GameObjects.Container;
 private keys!:Record<string,Phaser.Input.Keyboard.Key>;
 private hair!:Phaser.GameObjects.Rectangle;
 private facing=1;
 private bubble!:Phaser.GameObjects.Text;
 private nearby='';
 create(){
  const g=this.add.graphics();
  const rect=(x:number,y:number,w:number,h:number,c:number)=>{g.fillStyle(c);g.fillRect(x,y,w,h);};
  rect(0,0,800,600,0x8da85e);
  // Deterministic decoration keeps the prototype reproducible.
  let seed=71;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  for(let i=0;i<1100;i++){const x=random()*800,y=random()*600;rect(x,y,2,random()*4+1,[0x79944e,0x9cb96a,0xb1bf77][i%3]);}
  g.lineStyle(38,0xc5b481);g.beginPath();g.moveTo(180,600);g.lineTo(190,440);g.lineTo(246,335);g.lineTo(250,242);g.strokePath();
  g.lineStyle(24,0xc5b481);g.beginPath();g.moveTo(246,335);g.lineTo(425,335);g.lineTo(655,240);g.strokePath();
  for(let i=0;i<70;i++){const x=random()*800,y=random()*600;if(y<65||x<35||x>765)this.tree(g,x,y);}
  // Cottage and covered veranda.
  rect(140,142,215,89,0x53643f);rect(132,128,215,95,0xd5c6a3);rect(132,211,215,12,0x9a8767);
  g.fillStyle(0x97573b);g.fillTriangle(116,138,365,138,325,83);g.fillTriangle(116,138,325,83,154,83);
  for(let i=0;i<8;i++)rect(150+i*23,93+i%2*4,3,37,0xb7774a);
  rect(172,75,19,32,0x9c9781);rect(169,73,25,8,0x77776a);
  rect(225,169,29,54,0x70503b);rect(246,196,3,4,0xd7ba70);
  for(const x of [161,287]){rect(x,161,27,28,0x6a5239);rect(x+3,164,21,22,0x8eafb0);rect(x+13,164,2,22,0xeee0b5);}
  rect(192,222,91,29,0x947144);for(let y=224;y<250;y+=7)rect(192,y,91,1,0xb18a58);
  rect(215,251,48,7,0xae8c5e);rect(221,258,36,5,0xbea16f);
  rect(190,184,5,65,0x74513a);rect(280,184,5,65,0x74513a);
  g.fillStyle(0x955b40);g.fillTriangle(179,190,295,190,237,153);
  rect(260,229,16,10,0x5e4632);rect(261,226,13,5,0xe8dcaf);rect(267,226,1,5,0x977f51);
  // Locked outbuilding.
  rect(607,152,117,55,0x57623b);rect(601,133,118,68,0x92744c);
  for(let x=604;x<719;x+=12)rect(x,137,2,63,0x79603f);
  rect(636,151,43,50,0x6e5137);rect(656,151,3,50,0x392f26);rect(651,172,12,5,0xa8a18c);rect(655,175,5,7,0xc3b16f);
  g.fillStyle(0x77553b);g.fillTriangle(587,141,735,141,710,104);g.fillTriangle(587,141,710,104,617,104);
  // Pond banks and water, matching collision bounds approximately.
  g.fillStyle(0x71884d);g.fillEllipse(666,461,242,163);g.fillStyle(0xb7ae7a);g.fillEllipse(666,459,224,149);g.fillStyle(0x568b91);g.fillEllipse(666,458,207,132);
  for(let i=0;i<27;i++){const x=592+random()*135,y=417+random()*78;rect(x,y,9+random()*9,2,0x7aa9a6);}
  for(const [x,y] of [[588,442],[730,465],[646,502]]){g.fillStyle(0x739659);g.fillEllipse(x,y,15,7);rect(x+3,y-4,3,3,0xe5d8b7);}
  for(let i=0;i<16;i++){const x=581+i*9;rect(x,399-Math.sin(i)*6,2,14,0x596f3a);}
  // Old beds, stones, and fences.
  for(const [x,y] of [[329,301],[399,301],[329,365]]){rect(x,y,56,39,0xb69b64);rect(x+3,y+3,50,33,0x755b3e);for(let i=0;i<5;i++)rect(x+8+i*9,y+10+i%2*12,3,7,0x668046);}
  for(const [x,y] of [[74,353],[478,280],[527,543]]){rect(x,y,24,18,0x80877a);rect(x+3,y,15,5,0xa4a998);}
  const fence=(x:number,y:number,count:number)=>{rect(x,y+7,count*25,4,0x846c45);rect(x,y+16,count*25,3,0x9c8050);for(let i=0;i<=count;i++)rect(x+i*25,y,5,27,0x765f3e);};
  fence(38,555,5);fence(246,555,11);fence(433,181,5);fence(711,240,2);
  for(let i=0;i<100;i++){const x=45+random()*710,y=275+random()*265;if(Math.abs(x-215)<50||x>550&&y>385)continue;rect(x,y,2,4,0x668344);if(i%3===0)rect(x-1,y-2,4,3,i%2?0xe9d7a1:0xb7a3ba);}
  this.actor=this.add.container(START.x,START.y).setDepth(100);
  const part=(x:number,y:number,w:number,h:number,color:number)=>{const r=this.add.rectangle(x,y,w,h,color);this.actor.add(r);return r;};
  this.actor.add(this.add.ellipse(0,0,20,7,0x35442e,0.25));
  part(-4,-4,6,8,0x604632);part(4,-4,6,8,0x604632);
  part(-3,-13,5,15,0x4c6744);part(3,-13,5,15,0x4c6744);
  part(0,-26,13,15,0xe6dfc5);part(-9,-25,4,13,0xe9c49c);part(9,-25,4,13,0xe9c49c);
  part(0,-39,11,12,0xe9c49c);part(0,-45,13,5,0xc7a256);part(-5,-41,3,7,0xc7a256);
  this.hair=part(8,-38,5,12,0xc7a256);part(3,-39,2,2,0x4b4334);
  this.bubble=this.add.text(0,0,'', {fontFamily:'Georgia',fontSize:'20px',color:'#fff4cf',backgroundColor:'#293e30',padding:{x:9,y:4}}).setOrigin(.5,1).setDepth(101).setInteractive({useHandCursor:true});
  const inspect=()=>{
    if(dialogue.open)return;
    if(this.nearby==='house')showDialogue('Az első este még várhat.','Itt, a verandán fogom vezetni a naplómat. Most előbb körülnézek.');
    if(this.nearby==='pond')showDialogue('Egy kis tó.','Jó lesz itt megpihenni. Később az öntözőkannát is itt tölthetem újra.');
    if(this.nearby==='shed')showDialogue('?','');
  };
  this.bubble.on('pointerdown',inspect);
  this.input.keyboard!.on('keydown-E',inspect);
  const resize=()=>{
    const {width,height}=this.scale;
    this.cameras.main.setZoom(Math.max(width/800,height/600)).setBounds(0,0,800,600).startFollow(this.actor,true,1,1);
  };
  resize();this.scale.on('resize',resize);
  this.events.once('shutdown',()=>this.scale.off('resize',resize));
  dialogue.addEventListener('close',()=>{this.input.keyboard?.resetKeys();release();});
  showDialogue('Végre megérkeztem.',story,'EGY ÚJ KEZDET');
  this.keys=this.input.keyboard!.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT') as Record<string,Phaser.Input.Keyboard.Key>;
  document.querySelector('#home')!.addEventListener('click',()=>{this.actor.setPosition(START.x,START.y);release();});
 }
 private tree(g:Phaser.GameObjects.Graphics,x:number,y:number){g.fillStyle(0x6d5739);g.fillRect(x-3,y,7,24);g.fillStyle(0x45693f);g.fillCircle(x,y-10,23);g.fillStyle(0x628348);g.fillCircle(x-7,y-18,18);g.fillStyle(0x799650);g.fillCircle(x-10,y-23,11);}
 update(time:number,delta:number){
  if(!this.actor)return;
  if(dialogue.open){this.input.keyboard?.resetKeys();return;}
  const k=this.keys;
  const dx=Number(k.D.isDown||k.RIGHT.isDown||held.has('right'))-Number(k.A.isDown||k.LEFT.isDown||held.has('left'));
  const dy=Number(k.S.isDown||k.DOWN.isDown||held.has('down'))-Number(k.W.isDown||k.UP.isDown||held.has('up'));
  const before={x:this.actor.x,y:this.actor.y};const next=move(before.x,before.y,dx,dy,delta/1000);this.actor.setPosition(next.x,next.y);
  if(dx)this.facing=dx>0?1:-1;
  this.hair.x=this.facing*8;
  const walking=next.x!==before.x||next.y!==before.y;
  this.actor.setScale(1,walking?1+Math.sin(time/85)*0.025:1);
  const near=(x:number,y:number,d:number)=>Phaser.Math.Distance.Between(next.x,next.y,x,y)<d;
  this.nearby=near(657,206,66)?'shed':near(555,450,65)?'pond':near(250,244,55)?'house':'';
  this.bubble.setPosition(next.x,next.y-54).setText(this.nearby==='shed'?'?':this.nearby?'…':'').setVisible(Boolean(this.nearby));
  document.querySelector('#status')!.textContent=this.nearby==='shed'?'?':this.nearby==='house'?'Veranda · E / koppints a buborékra':this.nearby==='pond'?'Tópart · E / koppints a buborékra':'';
 }
}
new Phaser.Game({type:Phaser.AUTO,parent:'game',width:800,height:600,pixelArt:true,backgroundColor:'#8da85e',scene:Farm,scale:{mode:Phaser.Scale.RESIZE,autoCenter:Phaser.Scale.CENTER_BOTH},input:{keyboard:true}});
