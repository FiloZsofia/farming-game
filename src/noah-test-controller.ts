import {createExtraction,canLoadExtraction} from './extraction';
import {EXPERIMENT_FINDING} from './story-archive';
import Phaser from 'phaser';
import {FarmerArt} from './character';
import {southHerbs} from './south-forest-layout';
import {herbNames} from './forest';
import {createNoahLab,type LabPosition} from './noah-lab-mini';
import {itemIcon} from './item-icons';
import type {Snapshot} from './storage';
import {noahLetter,noahGoal,noahReplyArrived,upgradeNoahStick,mixNoahExtract,type NoahTestConfig,type NoahTestState} from './noah-test-story';
import {NoahSouthForest,resinTree,inNoahSouth,southRoot} from './noah-south-forest';
type Host={read:()=>Snapshot;commit:(s:Snapshot,after:()=>void)=>Promise<boolean>;show:(title:string,text:string,label?:string)=>void;notice:(text:string)=>void;record?:(id:'noah'|'result')=>void;gather?:(point:{x:number;y:number})=>void};
export class NoahTestController{
 private swampArrival=()=>this.host.show('Mocsár','Az iszap lassan bugyog a felszín alatt. Nem szeretnék belesüllyedni.','SAM');
 readonly forest:NoahSouthForest;private steam:Phaser.GameObjects.Graphics;private extraction=createExtraction();private pendingResult=false;private busy=false;private lab:ReturnType<typeof createNoahLab>|null=null;private labAvatars:HTMLImageElement[]=[];private labPosition:LabPosition={x:350,y:350,carrying:null};
 constructor(private scene:Phaser.Scene,public state:NoahTestState,readonly config:NoahTestConfig,private host:Host){this.forest=new NoahSouthForest(scene);scene.events.on('noah-swamp-arrival',this.swampArrival);this.steam=scene.add.graphics().setDepth(108);
  for(let i=0;i<3;i++){const art=new FarmerArt(scene);art.equip('none');art.update(i>0,false,{x:0,y:1},.1+i*.08);const texture=scene.add.renderTexture(0,0,64,96);texture.draw(art.root,32,82);texture.setVisible(false);texture.snapshot(image=>{if(image instanceof HTMLImageElement)this.labAvatars[i]=image;texture.destroy();});art.root.destroy(true);}
 }
 updatePresentation(now:number){
  this.forest.setUnlocked(this.state.upgraded);const g=this.steam;g.clear();if(!['extract','filter','cool'].includes(this.extraction.phase))return;
  for(let i=0;i<7;i++){const t=((now/1500+i/7)%1);g.lineStyle(1.3,0xd6d8b6,(1-t)*.5).strokeEllipse(337+Math.sin(now/900+i)*10,3330-t*45,4+t*9,3+t*12);}
 }
 get hasResult(){return this.pendingResult||this.state.complete;}
 get goal(){return noahGoal(this.state,this.host.read().clock.day);}
 hasUnreadLetter(day:number){return noahReplyArrived(this.state,day)&&!this.state.letter;}
 private panel(){const panel=document.querySelector<HTMLElement>('#research-panel')!;panel.replaceChildren();panel.hidden=false;return panel;}
 private button(panel:HTMLElement,id:string,text:string,action:()=>void,disabled=false){const b=document.createElement('button');b.type='button';b.id=id;b.textContent=text;b.disabled=disabled;b.onclick=action;panel.append(b);return b;}
 openLetter(){
  if(!this.hasUnreadLetter(this.host.read().clock.day))return;
  this.host.show('Noah levele',noahLetter,'LEVÉL A LABORBÓL');const panel=this.panel();
  if(!this.state.letter)this.button(panel,'noah-take-package','Átveszem a küldeményt',()=>{this.state.letter=true;this.host.record?.('noah');this.state.concentrate=this.config.shipment;this.host.show('Kísérleti koncentrátum',`${this.config.shipment} adag koncentrátum érkezett. `,'NOAH KÜLDEMÉNYE');});
 }
 openSimon(){
  if(!this.state.letter){this.host.show('Simon','Jó újra látni! Ma is akad néhány régi darab, amivel elbíbelődhetek.','EGY KEDVES SZÓ');return;}
  this.state.simonAsked=true;
  this.host.show('Simon',this.state.upgraded?'A fémhüvely tartja a bot végét. Jó szolgálatot fog tenni az ösvényen.':'Kötőanyag? A vörösfenyő gyantája eszembe jutott. Errefelé csak a patakon túl, a déli erdőben nő vörösfenyő. A törzsén aranyszínű cseppeket keress. Hogy a keverékedhez jó lesz-e, azt már neked kell kiderítened.\n\nOdalent mostanában veszélyesebb az ösvény. Meg tudom erősíteni a túrabotod végét, és új markolatot teszek rá. A fejlesztést megtalálod a kínálatomban.','EGY KEDVES SZÓ');
 }
 appendShop(panel:HTMLElement,refresh:()=>void){
  if(!this.state.simonAsked)return;
  const s=this.host.read(),c=this.config,card=document.createElement('article');card.className='shop-card';const text=document.createElement('div'),title=document.createElement('strong');title.textContent='Megerősített túrabot';const costs=document.createElement('p');costs.textContent=`Fa: ${s.clearing.wood} / ${c.wood} · Ócskavas: ${s.travel.research.materials.scrap} / ${c.scrap}`;text.append(title,costs);
  card.append(itemIcon('walkingStick'),text);
  this.button(card,'noah-upgrade-stick',this.state.upgraded?'Megvásárolva':`${c.gold} gold · Megveszem`,()=>{const result=upgradeNoahStick(this.host.read(),this.state,c);if(!result||this.busy)return;this.busy=true;void this.host.commit(result.snapshot,()=>{this.state=result.state;refresh();this.host.notice('Megerősített túrabot');}).finally(()=>{this.busy=false;});},!upgradeNoahStick(s,this.state,c));panel.append(card);
 }
 openMachine(){
  this.lab?.dispose();this.lab=null;
  this.host.show('Növényi kivonatkészítő berendezés','','MŰHELY');const panel=this.panel();
  if(this.state.complete){panel.textContent='A kísérlet eredménye megőrizve.';return;}
  if(this.pendingResult){panel.textContent='A kezelt minta vizsgálatra kész.';return;}
  if(!this.state.letter){panel.textContent='Az első kísérlethez még hiányzik valami.';return;}
  document.querySelector<HTMLDialogElement>('#dialogue')!.dataset.presentation='noah-lab';
  const c=this.config;
  const hint=document.createElement('p');hint.className='noah-lab-controls';hint.textContent='WASD / nyilak · E: felvétel, használat · Nyomva tartva: keverés, szűrés, töltés · Szelepek: kattintás / húzás';panel.append(hint);
  this.lab=createNoahLab({avatars:this.labAvatars,position:this.labPosition,session:this.extraction,counts:{thyme:c.thyme,plantain:c.plantain,ingredient:c.ingredient},available:id=>id==='ingredient'?this.state.ingredient>=c.ingredient:id==='aid'?this.state.letter&&this.state.concentrate>=c.concentrate:this.host.read().travel.estate.produce[id as 'thyme'|'plantain']>=c[id as 'thyme'|'plantain'],
   start:()=>{if(this.busy||this.extraction.phase!=='load'||!canLoadExtraction(this.extraction))return;const result=mixNoahExtract(this.host.read(),this.state,c);if(!result)return;this.busy=true;void this.host.commit(result.snapshot,()=>{this.state=result.state;this.extraction.phase='extract';}).finally(()=>{this.busy=false;});},
   finish:()=>{if(this.pendingResult)return;this.pendingResult=true;this.state.mixtureMade=true;setTimeout(()=>{if(this.lab?.canvas.isConnected&&document.querySelector<HTMLDialogElement>('#dialogue')?.open)this.host.show('A kezelt minta elkészült','Egy kis részt félretettem az összehasonlításhoz.','SAM');},800);}

  });panel.append(this.lab.canvas);
 }
 openMicroscope(){
  this.host.show('A kísérlet megfigyelése','','MIKROSZKÓP');const panel=this.panel();
  if(!this.pendingResult){const text=document.createElement('p');text.textContent='A kezelt mintán lassabban terjedtek a gombafonalak. Az eredmény nem bizonyítja, hogy a keverék biztonságos a méhek számára.';panel.append(text);}
  const fields=document.createElement('div');fields.className='noah-microscopy';
  for(const treated of [false,true]){const column=document.createElement('div'),label=document.createElement('strong');label.textContent=treated?'Kezelt minta':'Kontroll';column.append(label);const field=document.createElement('div');field.className=`noah-micro-field ${treated?'treated':''} ${this.state.complete?'improved':''}`;let paths='';for(let i=0;i<12;i++){const x=15+i*6,y=20+(i*17)%57;paths+=`<path d="M${x} ${y}q12-9 18 8t-10 22m4-15 14-6m-10-3-9-8"/>`;}field.innerHTML=`<svg viewBox="0 0 100 100"><g fill="none" stroke="#7b7752" stroke-width="1.1">${paths}</g></svg>`;column.append(field);fields.append(column);}panel.append(fields);
  const focus=document.createElement('input');focus.type='range';focus.min='0';focus.max='100';focus.value='20';focus.id='noah-microscope-focus';focus.setAttribute('aria-label','Élesség');panel.append(focus);const apply=()=>fields.style.filter=`blur(${Math.abs(Number(focus.value)-72)/12}px)`;focus.oninput=()=>{apply();if(observe)observe.disabled=Math.abs(Number(focus.value)-72)>12;};apply();
  const observe=this.pendingResult?this.button(panel,'noah-observe-result','Megvizsgálom',()=>{this.pendingResult=false;this.state.complete=true;this.host.record?.('result');this.host.show('Biztató eredmény',EXPERIMENT_FINDING,'SAM');},true):null;
 }
 interactSouth(player:{x:number;y:number}){
  if(!inNoahSouth(player.x,player.y))return false;
  const day=this.host.read().clock.day,herb=southHerbs.find(p=>Math.hypot(p.x-player.x,p.y-player.y)<42&&(this.state.herbsPicked[p.id]===undefined||day-this.state.herbsPicked[p.id]>=3));
  if(herb){if(!this.busy){this.busy=true;const next=this.host.read();next.travel.estate.produce[herb.kind]++;void this.host.commit(next,()=>{this.state.herbsPicked[herb.id]=day;this.host.gather?.(herb);this.host.notice('+1 '+herbNames[herb.kind]);}).finally(()=>{this.busy=false;});}return true;}
  if(Math.hypot(player.x-resinTree.x,player.y-resinTree.y)>65)return false;
  if(!this.state.rootDefeated)return false;
  if(this.state.ingredientGathered){this.host.show('Vörösfenyő','A kifolyt gyantából már összegyűjtöttem egy adagot.','SAM');return true;}
  this.host.show(this.config.ingredientName,'A vörösfenyő sérült kérgén aranyszínű gyantacseppek csillannak. A már kifolyt gyantából gyűjtök; a fát nem sebzem meg.','SAM');this.button(this.panel(),'noah-collect-ingredient','Összegyűjtöm',()=>{this.state.ingredientGathered=true;this.state.ingredient+=this.config.ingredient;document.querySelector<HTMLDialogElement>('#dialogue')!.close();});return true;
 }
 statusPanel(panel:HTMLElement){
  const card=document.createElement('section');card.className='noah-test-items';const title=document.createElement('h3');title.textContent='Kísérleti anyagok';card.append(title);
  for(const [name,count]of [['Kísérleti koncentrátum',this.state.concentrate],[this.config.ingredientName,this.state.ingredient]] as const){if(!count)continue;const row=document.createElement('div');row.className='noah-test-item';const label=document.createElement('span');label.textContent=name;const amount=document.createElement('strong');amount.className='stack-count';amount.textContent=String(count);let icon:Element;if(name===this.config.ingredientName)icon=this.ingredientIcon();else{icon=itemIcon('glassJar');icon.classList.add('noah-concentrate-icon');}row.append(icon,label,amount);card.append(row);}panel.append(card);
 }
 private ingredientIcon(){const icon=document.createElement('span');icon.className='noah-resin-icon';icon.setAttribute('aria-hidden','true');return icon;}
 destroy(){this.scene.events.off('noah-swamp-arrival',this.swampArrival);this.lab?.dispose();this.forest.destroy();this.steam.destroy();}
}
