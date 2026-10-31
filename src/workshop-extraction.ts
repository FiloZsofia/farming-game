import Phaser from 'phaser';
import type {FarmerArt} from './character';
import {itemIcon} from './item-icons';
import {canLoadExtraction,dropExtraction,stepExtraction,type Extraction} from './extraction';
import {extractionGuide} from './extraction-guidance';
export const workshopStations=[
 {id:'thyme',name:'Vadkakukkfű',x:263,y:3377,standX:268,standY:3420},
 {id:'plantain',name:'Lándzsás útifű',x:263,y:3405,standX:268,standY:3440},
 {id:'resin',name:'Gyanta',x:263,y:3433,standX:268,standY:3462},
 {id:'aid',name:'Előkészítő anyag',x:291,y:3433,standX:294,standY:3462},
 {id:'carrier',name:'Gyantás hordozó',x:310,y:3397,standX:310,standY:3430},
 {id:'vat',name:'Üst',x:339,y:3270,standX:339,standY:3391},
 {id:'stir',name:'Keverőkar',x:313,y:3330,standX:312,standY:3377},
 {id:'heat',name:'Fűtés',x:373,y:3340,standX:377,standY:3393},
 {id:'filter',name:'Szűrő',x:446,y:3290,standX:446,standY:3377},
 {id:'cooler',name:'Hűtővíz',x:526,y:3310,standX:526,standY:3382},
 {id:'concentrate',name:'Koncentrátum',x:420,y:3424,standX:420,standY:3455},
 {id:'dose',name:'Lehűlt keverék',x:489,y:3347,standX:489,standY:3394},
 {id:'bottle',name:'Töltőcsap',x:515,y:3405,standX:515,standY:3446}
];
export type WorkshopCarry={carrying:string|null};
type Options={session:Extraction;carry:WorkshopCarry;actor:Phaser.GameObjects.Container;avatar:FarmerArt;available:(id:string)=>boolean;supply?:(id:string)=>{held:number;required:number}|null;start:()=>void;finish:()=>void;changed:(active:boolean)=>void;map:()=>void};
export class WorkshopExtraction{
 active=true;private art:Phaser.GameObjects.Graphics;private marker:Phaser.GameObjects.Graphics;private label:HTMLDivElement;private held:Phaser.GameObjects.Graphics;private actorDepth:number;private hud:HTMLDivElement;private hint:HTMLParagraphElement;private title:HTMLElement;private carried:HTMLElement;private progress:HTMLProgressElement;private keys=new Set<string>();private destination:string|null=null;private pressed:string|null=null;private dial:{id:string;x:number;value:number}|null=null;private flight:{id:string;target:string;x:number;y:number;age:number}|null=null;private lastDraw=0;private shown='';
 constructor(private scene:Phaser.Scene,private o:Options){
  this.art=scene.add.graphics().setDepth(108);this.marker=scene.add.graphics().setDepth(170);this.held=scene.add.graphics().setDepth(112);this.actorDepth=o.actor.depth;o.actor.setDepth(110);this.label=document.createElement('div');this.label.className='lab-world-label';document.querySelector('#game')!.append(this.label);
  this.hud=document.createElement('div');this.hud.id='workshop-lab';this.hud.setAttribute('role','region');this.hud.setAttribute('aria-label','Kivonatkészítés a Műhelyben');this.title=document.createElement('strong');this.hint=document.createElement('p');this.hint.setAttribute('aria-live','polite');this.carried=document.createElement('span');this.carried.className='lab-carried';this.progress=document.createElement('progress');this.progress.max=1;this.progress.setAttribute('aria-label','A művelet haladása');const back=document.createElement('button');back.type='button';back.textContent='Vissza';back.onclick=()=>this.close();this.hud.append(this.title,this.hint,this.carried,this.progress,back);document.querySelector('#game')!.append(this.hud);document.querySelector<HTMLElement>('#game')!.dataset.laboratory='true';
  o.avatar.cancelWork();o.avatar.equip('none');window.addEventListener('keydown',this.keyDown,true);window.addEventListener('keyup',this.keyUp,true);window.addEventListener('blur',this.pause);scene.input.on('pointerdown',this.pointerDown);scene.input.on('pointerup',this.pointerUp);scene.input.on('pointermove',this.pointerMove);o.changed(true);
 }
 pause=()=>{this.keys.clear();this.pressed=null;this.dial=null;};
 private station=(id:string)=>workshopStations.find(s=>s.id===id)!;
 private near=(id:string)=>{const s=this.station(id);return Math.hypot(this.o.actor.x-s.standX,this.o.actor.y-s.standY)<34;};
 private guide=()=>{const guide=extractionGuide(this.o.session,this.o.carry.carrying),supply=this.o.supply?.(guide.target);return !this.o.carry.carrying&&supply&&supply.held<supply.required?{...guide,text:`${this.station(guide.target).name} · Készlet: ${supply.held} / ${supply.required}`}:guide;};
 private keyDown=(e:KeyboardEvent)=>{
  if(!this.active||e.ctrlKey||e.metaKey||e.altKey)return;if(e.code==='KeyM'){e.preventDefault();e.stopImmediatePropagation();if(!e.repeat){this.pause();this.o.map();}return;}if(document.querySelector<HTMLDialogElement>('#dialogue')?.open)return;e.preventDefault();e.stopImmediatePropagation();if(e.code==='Escape'){this.close();return;}this.keys.add(e.code);if(e.code==='KeyE'&&!e.repeat){const id=this.guide().target;if(this.near(id))this.interact(id);}
  if((e.code==='KeyQ'||e.code==='KeyR')&&!e.repeat){const id=this.guide().target;if((id==='heat'||id==='cooler')&&this.near(id)){const field=id==='heat'?'heat':'coolant';this.o.session[field]=Phaser.Math.Clamp(this.o.session[field]+(e.code==='KeyQ'?-.2:.2),0,1);}}
 };
 private keyUp=(e:KeyboardEvent)=>{if(!this.active)return;e.preventDefault();e.stopImmediatePropagation();this.keys.delete(e.code);};
 private pointerDown=(pointer:Phaser.Input.Pointer)=>{
  if(!this.active||document.querySelector<HTMLDialogElement>('#dialogue')?.open||this.hud.contains(pointer.event.target as Node))return;const p=this.scene.cameras.main.getWorldPoint(pointer.x,pointer.y),s=workshopStations.filter(s=>Math.hypot(s.x-p.x,s.y-p.y)<19).sort((a,b)=>Math.hypot(a.x-p.x,a.y-p.y)-Math.hypot(b.x-p.x,b.y-p.y))[0];if(!s)return;
  this.destination=s.id;this.pressed=s.id;if(this.near(s.id)){this.destination=null;this.interact(s.id);if(s.id==='heat'||s.id==='cooler')this.dial={id:s.id,x:pointer.x,value:this.o.session[s.id==='heat'?'heat':'coolant']};}
 };
 private pointerUp=()=>{this.pressed=null;this.dial=null;};
 private pointerMove=(p:Phaser.Input.Pointer)=>{if(this.dial)this.o.session[this.dial.id==='heat'?'heat':'coolant']=Phaser.Math.Clamp(this.dial.value+(p.x-this.dial.x)/120,0,1);};
 private takeable(id:string){const s=this.o.session;return s.phase==='prepare'?(id==='resin'?!s.resin&&this.o.available('ingredient'):id==='aid'&&!s.aid&&this.o.available('aid')):s.phase==='load'?id==='carrier'?s.carrierReady&&!s.loaded.includes(id):['thyme','plantain'].includes(id)&&!s.loaded.includes(id)&&this.o.available(id):s.phase==='dose'&&id==='concentrate';}
 private interact(id:string){const s=this.o.session,p=this.o.carry;if(this.flight)return;if(p.carrying){if(dropExtraction({...s,loaded:[...s.loaded]},p.carrying,id)){this.flight={id:p.carrying,target:id,x:this.o.actor.x,y:this.o.actor.y-25,age:0};p.carrying=null;}return;}
  if(this.takeable(id)){p.carrying=id;return;}if(id==='vat'&&s.phase==='load'&&canLoadExtraction(s))this.o.start();if(id==='heat'&&s.phase==='extract')s.heat=Math.round((s.heat>=.95?0:s.heat+.2)*10)/10;if(id==='cooler'&&s.phase==='cool')s.coolant=s.coolant>=.95?0:Math.min(1,s.coolant+.25);
 }
 update(dt:number,now:number){
  if(!this.active)return;const a=this.o.actor,s=this.o.session;let dx=Number(this.keys.has('KeyD')||this.keys.has('ArrowRight'))-Number(this.keys.has('KeyA')||this.keys.has('ArrowLeft')),dy=Number(this.keys.has('KeyS')||this.keys.has('ArrowDown'))-Number(this.keys.has('KeyW')||this.keys.has('ArrowUp'));
  if(dx||dy)this.destination=null;if(this.destination&&!dx&&!dy){const t=this.station(this.destination),d=Math.hypot(t.standX-a.x,t.standY-a.y);if(d<5){const id=this.destination;this.destination=null;this.interact(id);}else{dx=(t.standX-a.x)/d;dy=(t.standY-a.y)/d;}}
  if(dx||dy){const d=Math.hypot(dx,dy);a.x=Phaser.Math.Clamp(a.x+dx/d*dt*125,240,565);a.y=Phaser.Math.Clamp(a.y+dy/d*dt*125,3375,3490);}this.o.avatar.update(!!(dx||dy),false,{x:dx,y:dy||1},dt);
  const target=this.guide().target,action=this.keys.has('KeyE')&&this.near(target)?target:this.pressed&&this.near(this.pressed)?this.pressed:null;stepExtraction(s,dt,action);
  if(this.flight){this.flight.age+=dt;if(this.flight.age>=.65){dropExtraction(s,this.flight.id,this.flight.target);this.flight=null;}}
  if(s.phase==='done'){this.o.finish();return;}
  if(now-this.lastDraw<33)return;this.lastDraw=now;this.draw(now,action);
 }
 private draw(now:number,action:string|null){
  const s=this.o.session,g=this.art,m=this.marker,a=this.o.actor,guide=this.guide(),target=this.station(guide.target);g.clear();m.clear();
  // Add only working parts and supplies to the existing apparatus; the room is untouched.
  g.fillStyle(0x826744).fillRoundedRect(250,3366,26,78,3).fillRoundedRect(286,3422,26,23,3).fillRoundedRect(293,3388,35,18,3).fillRoundedRect(407,3414,26,22,3);
  for(const id of ['thyme','plantain','resin','aid','concentrate']){const t=this.station(id);const used=id==='resin'?s.resin:id==='aid'?s.aid:s.loaded.includes(id);if(!used&&this.o.carry.carrying!==id&&this.flight?.id!==id)this.icon(g,id,t.x,t.y);}
  g.fillStyle(0xc4ba90).fillEllipse(310,3397,26,9);g.fillStyle(s.carrierReady?0xbca054:s.resin?0x9e7138:0x5a6047).fillEllipse(310,3396,21,5);if(action==='carrier')g.lineStyle(2,0xe3cf9f).lineBetween(310,3395,310+Math.sin(now/130)*11,3386);
  g.fillStyle(0x674e36).fillEllipse(339,3270,69,18);if(s.loaded.length||!['prepare','load'].includes(s.phase)){g.fillStyle(0x9eaf66).fillEllipse(339,3270,62,13);for(let i=0;i<4;i++)g.fillStyle(0xe3e1a0,.7).fillCircle(316+i*14,3269+Math.sin(now/240+i)*2,1.1);}
  g.fillStyle(0x435647).fillRoundedRect(324,3291,17,31,2);g.fillStyle(0xa2bd84).fillRect(327,3296,11,22);g.fillStyle(0xdbe5bd,.7).fillRect(327,3296,2,20);
  for(const points of [[[339,3251],[339,3227],[446,3227],[446,3260]],[[470,3282],[501,3282],[501,3245]]])if(!['prepare','load'].includes(s.phase)){g.lineStyle(2.5,0xa9c373,.9);for(let i=0;i<points.length-1;i++){const p=points[i],q=points[i+1],t=(now/1000+i*.3)%1;g.fillStyle(0xc0d58f).fillCircle(p[0]+(q[0]-p[0])*t,p[1]+(q[1]-p[1])*t,1.8);}}
  for(const id of ['heat','cooler']){const t=this.station(id),value=id==='heat'?s.heat:s.coolant;g.fillStyle(0x384b39).fillCircle(t.x,t.y,8);const angle=value*Math.PI*1.6-Math.PI*.8;g.lineStyle(2,0xf1d18e).lineBetween(t.x,t.y,t.x+Math.sin(angle)*6,t.y-Math.cos(angle)*6);}
  g.lineStyle(2.5,0xc5ac72).strokeCircle(313,3330,9);const angle=action==='stir'?now/130:0;g.lineBetween(313-Math.cos(angle)*9,3330-Math.sin(angle)*9,313+Math.cos(angle)*9,3330+Math.sin(angle)*9);
  g.fillStyle(0x394e3e).fillRect(391,3288,8,52);g.fillStyle(0xacc176).fillRect(401,3302,3,17);g.fillStyle(s.temperature>.72?0xdd8550:0xd9c077).fillRect(393,3338-s.temperature*48,4,s.temperature*48);
  if(s.phase==='extract'&&s.heat>0)for(let i=0;i<4;i++)g.fillStyle(i%2?0xe9b45b:0xca773f).fillEllipse(325+i*9,3342,4,3+s.heat*(4+Math.sin(now/100+i)*3));
  if(action==='filter')g.lineStyle(2,0xe7d69e).lineBetween(446,3260,446,3250+Math.sin(now/140)*5);
  if(s.phase==='cool'&&s.coolant>0)for(let i=0;i<6;i++)g.fillStyle(0xcce9dc,.7).fillCircle(506+i%2*37,3244+(now/50+i*12)%62,1.2);
  g.fillStyle(0x8aab96,.6).fillRoundedRect(481,3338,17,25,3);if(s.phase==='bottle'||s.phase==='done')g.fillStyle(0xc7b469,.8).fillEllipse(489,3354,13,12);
  g.fillStyle(0x9eb7a0,.7).fillRoundedRect(508,3394,15,23,2);g.fillStyle(0xccb66b).fillRect(511,3414-s.fill*17,9,s.fill*17);if(action==='bottle')g.lineStyle(2,0xe9cf8b).lineBetween(515,3380,515,3394);
  this.held.clear();if(this.o.carry.carrying)this.icon(this.held,this.o.carry.carrying,a.x+10,a.y-24);if(this.flight){const t=this.flight.age/.65,b=this.station(this.flight.target);this.icon(this.held,this.flight.id,this.flight.x+(b.x-this.flight.x)*t,this.flight.y+(b.y-this.flight.y)*t-Math.sin(t*Math.PI)*32);}
  // A bright beacon, moving arrow and travelling dots identify the exact next target.
  const pulse=.5+.5*Math.sin(now/180),r=12+pulse*4;m.fillStyle(0xffdc72,.13+pulse*.13).fillCircle(target.x,target.y,r+5);m.lineStyle(1.8,0xffe398,.85).strokeCircle(target.x,target.y,r);m.fillStyle(0xffe6a0).fillTriangle(target.x-5,target.y-20-pulse*3,target.x+5,target.y-20-pulse*3,target.x,target.y-14-pulse*3);
  for(let i=0;i<5;i++){const t=(now/1700+i/5)%1;m.fillStyle(0xffdc86,Math.sin(t*Math.PI)*.7).fillCircle(a.x+(target.x-a.x)*t,a.y-20+(target.y-a.y+20)*t,1.4);}
  const camera=this.scene.cameras.main,screen=camera.worldView;
  const supply=this.o.supply?.(guide.target);this.label.textContent=target.name+(supply?` · ${supply.held} / ${supply.required}`:'');this.label.style.left=`${(target.x-screen.x)*camera.zoom}px`;
  const overSam=Math.abs(target.x-a.x)<55&&Math.abs(target.y-27-(a.y-35))<35;
  this.label.style.top=`${((overSam?Math.min(target.y-27,a.y-64):target.y-27)-screen.y)*camera.zoom}px`;
  const heading={prepare:'Gyantás hordozó',load:'Hozzávalók',extract:'Kivonás',filter:'Szűrés',cool:'Hűtés',dose:'Koncentrátum',bottle:'Töltés',done:'Elkészült'}[s.phase];const state=heading+'|'+guide.text+'|'+this.o.carry.carrying;if(this.shown!==state){this.shown=state;this.title.textContent=heading;this.hint.textContent=guide.text;this.carried.replaceChildren();if(this.o.carry.carrying){const id=this.o.carry.carrying;this.carried.append(itemIcon(id==='thyme'||id==='plantain'?id:'glassJar'),document.createTextNode(this.station(id==='resin'?'resin':id==='aid'?'aid':id==='carrier'?'carrier':id==='concentrate'?'concentrate':id).name));}}
  this.progress.value=s.phase==='prepare'?s.carrierMix:s.phase==='bottle'?s.fill:s.progress;
  Object.assign(this.hud.dataset,{phase:s.phase,target:guide.target,carrying:this.o.carry.carrying??'',throwing:String(!!this.flight),carrierReady:String(s.carrierReady),heat:String(s.heat),coolant:String(s.coolant),temperature:String(s.temperature),progress:String(this.progress.value),playerX:String(Math.round(a.x)),playerY:String(Math.round(a.y)),cameraX:String(this.scene.cameras.main.worldView.x),cameraY:String(this.scene.cameras.main.worldView.y),zoom:String(this.scene.cameras.main.zoom)});
 }
 private icon(g:Phaser.GameObjects.Graphics,id:string,x:number,y:number){if(id==='resin'||id==='carrier'){g.fillStyle(id==='resin'?0xd7a34c:0xc4aa59).fillEllipse(x,y,8,9);g.fillStyle(0xf1d794).fillRect(x-1,y-3,1,4);}else if(id==='thyme'||id==='plantain'){for(let i=0;i<3;i++){g.lineStyle(1,0x7f9a53).lineBetween(x,y+4,x+(i-1)*4,y-5);g.fillStyle(id==='thyme'?0xc3a1c4:0x9eb66e).fillEllipse(x+(i-1)*4,y-5,4,4);}}else{g.fillStyle(0xc4d7b6).fillRoundedRect(x-4,y-5,8,11,2);g.fillStyle(id==='aid'?0xd6bf80:0xa9c88a).fillRect(x-2,y,4,4);}}
 close(){if(!this.active)return;this.active=false;if(this.flight){this.o.carry.carrying=this.flight.id;this.flight=null;}this.pause();window.removeEventListener('keydown',this.keyDown,true);window.removeEventListener('keyup',this.keyUp,true);window.removeEventListener('blur',this.pause);this.scene.input.off('pointerdown',this.pointerDown);this.scene.input.off('pointerup',this.pointerUp);this.scene.input.off('pointermove',this.pointerMove);this.art.destroy();this.marker.destroy();this.label.remove();this.held.destroy();this.o.actor.setDepth(this.actorDepth);this.hud.remove();delete document.querySelector<HTMLElement>('#game')!.dataset.laboratory;this.o.changed(false);}
}
