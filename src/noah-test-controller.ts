import Phaser from 'phaser';
import {itemIcon} from './item-icons';
import type {Snapshot} from './storage';
import {noahLetter,noahGoal,upgradeNoahStick,mixNoahExtract,type NoahTestConfig,type NoahTestState} from './noah-test-story';
import {NoahSouthForest,resinTree,inNoahSouth,southRoot} from './noah-south-forest';
type Host={read:()=>Snapshot;commit:(s:Snapshot,after:()=>void)=>Promise<boolean>;show:(title:string,text:string,label?:string)=>void;notice:(text:string)=>void};
export class NoahTestController{
 readonly forest:NoahSouthForest;private steam:Phaser.GameObjects.Graphics;private batch:{step:number}|null=null;private added=new Set<string>();private pendingResult=false;private busy=false;
 constructor(scene:Phaser.Scene,public state:NoahTestState,readonly config:NoahTestConfig,private host:Host){this.forest=new NoahSouthForest(scene);this.steam=scene.add.graphics().setDepth(108);}
 updatePresentation(now:number){
  this.forest.setUnlocked(this.state.simonAsked);const g=this.steam;g.clear();if(!this.batch)return;
  for(let i=0;i<7;i++){const t=((now/1500+i/7)%1);g.lineStyle(1.3,0xd6d8b6,(1-t)*.5).strokeEllipse(337+Math.sin(now/900+i)*10,3330-t*45,4+t*9,3+t*12);}
 }
 get hasResult(){return this.pendingResult||this.state.complete;}
 get goal(){return this.pendingResult?'Vizsgáld meg a kísérlet eredményét':noahGoal(this.state);}
 private panel(){const panel=document.querySelector<HTMLElement>('#research-panel')!;panel.replaceChildren();panel.hidden=false;return panel;}
 private button(panel:HTMLElement,id:string,text:string,action:()=>void,disabled=false){const b=document.createElement('button');b.type='button';b.id=id;b.textContent=text;b.disabled=disabled;b.onclick=action;panel.append(b);return b;}
 openLetter(){
  this.host.show('Noah levele',noahLetter,'LEVÉL A LABORBÓL');const panel=this.panel();
  if(!this.state.letter)this.button(panel,'noah-take-package','Átveszem a küldeményt',()=>{this.state.letter=true;this.state.concentrate=this.config.shipment;this.host.show('Kísérleti koncentrátum',`${this.config.shipment} adag koncentrátum érkezett. A levél megmarad a postaládában.`,'NOAH KÜLDEMÉNYE');});
 }
 openSimon(){
  this.state.simonAsked=true;
  this.host.show('Simon',this.state.upgraded?'A fémhüvely tartja a bot végét. Jó szolgálatot fog tenni az ösvényen.':'Kötőanyag? A vörösfenyő gyantája eszembe jutott. Errefelé csak a patakon túl, a déli erdőben nő vörösfenyő. A törzsén aranyszínű cseppeket keress. Hogy a keverékedhez jó lesz-e, azt már neked kell kiderítened.\n\nOdalent mostanában veszélyesebb az ösvény. Meg tudom erősíteni a túrabotod végét, és új markolatot teszek rá. A fejlesztést megtalálod a kínálatomban.','EGY KEDVES SZÓ');
 }
 appendShop(panel:HTMLElement,refresh:()=>void){
  if(!this.state.letter)return;
  const s=this.host.read(),c=this.config,card=document.createElement('article');card.className='shop-card';const text=document.createElement('div'),title=document.createElement('strong');title.textContent='Megerősített túrabot';const costs=document.createElement('p');costs.textContent=`Fa: ${s.clearing.wood} / ${c.wood} · Ócskavas: ${s.travel.research.materials.scrap} / ${c.scrap}`;text.append(title,costs);
  card.append(itemIcon('walkingStick'),text);
  this.button(card,'noah-upgrade-stick',this.state.upgraded?'Megvásárolva':`${c.gold} gold · Megveszem`,()=>{const result=upgradeNoahStick(this.host.read(),this.state,c);if(!result||this.busy)return;this.busy=true;void this.host.commit(result.snapshot,()=>{this.state=result.state;refresh();this.host.notice('Megerősített túrabot');}).finally(()=>{this.busy=false;});},!upgradeNoahStick(s,this.state,c));panel.prepend(card);
 }
 openMachine(){
  this.host.show('Növényi kivonatkészítő berendezés',this.state.complete?'A kísérleti keverék elkészült. A méhek közelében még nem használhatom.':'','MŰHELY');const panel=this.panel();
  if(this.state.complete)return;
  if(this.pendingResult){const text=document.createElement('p');text.textContent='A kezelt minta vizsgálatra kész.';panel.append(text);return;}
  if(!this.state.letter){const text=document.createElement('p');text.textContent='Az első kísérlethez még hiányzik valami.';panel.append(text);return;}
  const c=this.config,s=this.host.read();
  const demo=document.createElement('div');demo.className=`noah-extractor ${this.batch?'working':''}`;demo.innerHTML='<div class="noah-vat"><i></i><i></i><i></i></div><div class="noah-pipe"></div><div class="noah-filter"></div><div class="noah-coil"></div><div class="noah-flask"></div>';panel.append(demo);
  if(!this.batch){
   const ingredients:[string,string,number,number][]=[['thyme','Vadkakukkfű',s.travel.estate.produce.thyme,c.thyme],['plantain','Lándzsás útifű',s.travel.estate.produce.plantain,c.plantain]];
   ingredients.push(['ingredient',c.ingredientName,this.state.ingredient,c.ingredient]);
   for(const [id,name,held,need]of ingredients){const row=document.createElement('div');row.className='noah-ingredient';const label=document.createElement('span');label.textContent=`${name}: ${held} / ${need}`;row.append(id==='ingredient'?this.ingredientIcon():itemIcon(id as 'thyme'|'plantain'),label);const b=this.button(row,`noah-add-${id}`,this.added.has(id)?'Bekerült':'Beleteszem',()=>{this.added.add(id);row.classList.add('added');b.disabled=true;b.textContent='Bekerült';demo.classList.add('loaded');start.disabled=!ingredients.every(([key])=>this.added.has(key))||!mixNoahExtract(this.host.read(),this.state,c);},held<need||this.added.has(id));panel.append(row);}
   const concentrate=document.createElement('p');concentrate.textContent=`Kísérleti koncentrátum: ${this.state.concentrate} / ${c.concentrate}`;panel.append(concentrate);
   const start=this.button(panel,'noah-start-extraction','Elindítom a kivonást',()=>{const result=mixNoahExtract(this.host.read(),this.state,c);if(!result||this.busy)return;this.busy=true;void this.host.commit(result.snapshot,()=>{this.state=result.state;this.batch={step:0};this.added.clear();this.openMachine();}).finally(()=>{this.busy=false;});},!ingredients.every(([id])=>this.added.has(id))||!mixNoahExtract(s,this.state,c));
   return;
  }
  const steps=[['Kivonás','A növényi részek körül lassan elszíneződik a folyadék.','Átengedem a szűrőn'],['Szűrés','A szűrő visszatartja a növényi maradványokat.','Lehűtöm a spirálban'],['Hűtés','A tiszta kivonat végigcsorog a hűtőspirálon.','Hozzáadom a koncentrátumot']];const step=steps[this.batch.step];
  const title=document.createElement('h3');title.textContent=step[0];const text=document.createElement('p');text.textContent=step[1];panel.append(title,text);demo.dataset.step=String(this.batch.step);
  this.button(panel,'noah-extraction-step',step[2],()=>{if(!this.batch)return;if(this.batch.step<2){this.batch.step++;this.openMachine();}else{this.batch=null;this.pendingResult=true;this.host.show('A kezelt minta elkészült','Egy kis részt félretettem az összehasonlításhoz.','SAM');}});
 }
 openMicroscope(){
  this.host.show('A kísérlet megfigyelése','','MIKROSZKÓP');const panel=this.panel();
  if(!this.pendingResult){const text=document.createElement('p');text.textContent='A kezelt mintán lassabban terjedtek a gombafonalak. Az eredmény nem bizonyítja, hogy a keverék biztonságos a méhek számára.';panel.append(text);}
  const fields=document.createElement('div');fields.className='noah-microscopy';
  for(const treated of [false,true]){const column=document.createElement('div'),label=document.createElement('strong');label.textContent=treated?'Kezelt minta':'Kontroll';column.append(label);const field=document.createElement('div');field.className=`noah-micro-field ${treated?'treated':''} ${this.state.complete?'improved':''}`;let paths='';for(let i=0;i<12;i++){const x=15+i*6,y=20+(i*17)%57;paths+=`<path d="M${x} ${y}q12-9 18 8t-10 22m4-15 14-6m-10-3-9-8"/>`;}field.innerHTML=`<svg viewBox="0 0 100 100"><g fill="none" stroke="#7b7752" stroke-width="1.1">${paths}</g></svg>`;column.append(field);fields.append(column);}panel.append(fields);
  const focus=document.createElement('input');focus.type='range';focus.min='0';focus.max='100';focus.value='20';focus.id='noah-microscope-focus';focus.setAttribute('aria-label','Élesség');panel.append(focus);const apply=()=>fields.style.filter=`blur(${Math.abs(Number(focus.value)-72)/12}px)`;focus.oninput=()=>{apply();if(observe)observe.disabled=Math.abs(Number(focus.value)-72)>12;};apply();
  const observe=this.pendingResult?this.button(panel,'noah-observe-result','Megvizsgálom',()=>{this.pendingResult=false;this.state.complete=true;this.host.show('Biztató eredmény','A kezelt mintán lassabban terjednek a gombafonalak, de ez még nem bizonyítja, hogy a keveréket biztonságosan használhatom a méhek közelében. Meg kell osztanom az eredményt Noah-val.','SAM');},true):null;
 }
 interactSouth(player:{x:number;y:number}){
  if(!inNoahSouth(player.x,player.y)||Math.hypot(player.x-resinTree.x,player.y-resinTree.y)>65)return false;
  if(!this.state.rootDefeated)return false;
  if(this.state.ingredientGathered){this.host.show('Vörösfenyő','A kifolyt gyantából már összegyűjtöttem egy adagot.','SAM');return true;}
  this.host.show(this.config.ingredientName,'A vörösfenyő sérült kérgén aranyszínű gyantacseppek csillannak. A már kifolyt gyantából gyűjtök; a fát nem sebzem meg.','SAM');this.button(this.panel(),'noah-collect-ingredient','Összegyűjtöm',()=>{this.state.ingredientGathered=true;this.state.ingredient+=this.config.ingredient;this.host.show(this.config.ingredientName,'Ezt érdemes lesz kipróbálni.','SAM');});return true;
 }
 statusPanel(panel:HTMLElement){
  const card=document.createElement('section');card.className='noah-test-items';const title=document.createElement('h3');title.textContent='Kísérleti anyagok';card.append(title);
  for(const [name,count]of [['Kísérleti koncentrátum',this.state.concentrate],[this.config.ingredientName,this.state.ingredient]] as const){if(!count)continue;const row=document.createElement('div');row.className='noah-test-item';const label=document.createElement('span');label.textContent=name;const amount=document.createElement('strong');amount.className='stack-count';amount.textContent=String(count);let icon:Element;if(name===this.config.ingredientName)icon=this.ingredientIcon();else{icon=itemIcon('glassJar');icon.classList.add('noah-concentrate-icon');}row.append(icon,label,amount);card.append(row);}panel.append(card);
 }
 private ingredientIcon(){const icon=document.createElement('span');icon.className='noah-resin-icon';icon.setAttribute('aria-hidden','true');return icon;}
 destroy(){this.forest.destroy();this.steam.destroy();}
}
