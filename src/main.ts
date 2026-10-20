import Phaser from 'phaser';
import './style.css';
import { move, START } from './movement';
import { farmLayout } from './layout';
import { createGarden, targetTile, cultivable, reachable, work, TILE, type Tile, type Tool, nextDayGarden, isRipe, growthTarget, cropNames } from './gardening';
import { createClock, advanceClock, clockLabel, nightOpacity, type Clock } from './clock';
import { JUMP_DURATION, JUMP_COOLDOWN, jumpHeight, movementSpeed } from './jump';
import { SaveStore, snapshot } from './storage';
import {createOrders,seedPrices,orderCost,quantityTotal,purchaseSeeds,deliverOrders,collectPackage, type Orders} from './orders';
import { createEconomy, crops, salePrices, shippingValue, settleSales, transferProduce, type Economy } from './economy';
const dialogue=document.querySelector<HTMLDialogElement>('#dialogue')!;
const story='A kutatólaborban mindig akadt egy újabb feladat. Szerettem a munkámat, de elfáradtam. Változásra volt szükségem.\n\nMost itt vagyok. A ház előtt gaz nő, a kerítés javításra vár. Nem kell mindent ma rendbe hoznom. Ez egy új kezdet.';
function showDialogue(title:string,text:string,label='A BIRTOKON'){
 release();
 document.querySelector<HTMLButtonElement>('#sleep')!.hidden=true;
 document.querySelector<HTMLButtonElement>('#export-save')!.hidden=true;
 for(const id of ['shipping-panel','menu-panel','inventory-panel','catalog-panel','mailbox-panel'])document.querySelector<HTMLElement>(`#${id}`)!.hidden=true;
 document.querySelector('#dialogue-close')!.textContent='Folytatás';
 document.querySelector('#dialogue-title')!.textContent=title;
 document.querySelector('#dialogue-text')!.textContent=text;
 document.querySelector('#dialogue-label')!.textContent=label;
 if(!dialogue.open)dialogue.showModal();
}
document.querySelector('#story')!.addEventListener('click',()=>showDialogue('Végre megérkeztem.',story,'EGY ÚJ KEZDET'));
document.querySelector('#help')!.addEventListener('click',()=>showDialogue('Lassan, a saját tempódban.','Mozgás: WASD, nyilak vagy a képernyő iránygombjai. Ugrás: Space. Futás: tartsd a Shiftet. Az ugrás magasabbra és messzebbre visz; akadályokon továbbra sem lehet áthaladni.\n\nA háznál, tónál és melléképületnél az E billentyűvel vagy a megjelenő jelzésre kattintva nézhetsz körül. A napló, a magkatalógus, az eladóláda és a postaláda a világban használható: sétálj oda, majd E vagy kattintás/koppintás.\n\nKertészkedés: 1–6 vagy az alsó eszközsáv. Kattints egy közeli földkockára, vagy használd az F billentyűt az előtted lévő kockán. Kapa → ültetőanyag → öntözés. A három ágyásban és a szabad rétfoltokon dolgozhatsz.\n\n6 perc nappal után éjszaka lesz. A 2. és 3. éjszakai percben figyelmeztetés érkezik, majd 3:30–4:00 között elfáradsz és otthon ébredsz, veszteség nélkül. A verandán a Naplóval korábban is lefekhetsz.\n\nA kert és az idő automatikusan mentődik ebben a böngészőben. Az öntözött növények reggel fejlődnek. Éréskor válaszd a Szedés eszközt (6), majd kattints a növényre. A leszedett termények Tab-bal vagy a Menü → Készlet pontban nézhetők meg. A veranda bal oldalán lévő eladóládába teheted a termést. Napzárásig visszavehető, reggel megkapod az árát. Retek: 15, burgonya: 30, borsó: 12 gold/db. A háznál lévő magkatalógusból rendelhetsz (retek 5, burgonya 10, borsó 15 gold/db), másnap a kapu melletti postaládából veheted át. Készlet: Tab; bezárás: Escape. A stamina még nincs bekötve.','IRÁNYÍTÁS'));
const held=new Set<string>();
function release(){held.clear();const run=document.querySelector<HTMLButtonElement>('#run');if(run)run.setAttribute('aria-pressed','false');document.querySelectorAll('.active').forEach(el=>el.classList.remove('active'));}
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
 private garden=createGarden();
 private economy:Economy=createEconomy();
 private orders:Orders=createOrders();
 private tool:Tool='hoe';
 private target:Tile|null=null;
 private mailFlag!:Phaser.GameObjects.Graphics;
 private planted!:Phaser.GameObjects.Graphics;
 private selection!:Phaser.GameObjects.Graphics;
 private direction={x:0,y:1};
 private feedbackUntil=0;
 private body!:Phaser.GameObjects.Container;
 private shadow!:Phaser.GameObjects.Ellipse;
 private jumpRemaining=0;
 private jumpCooldown=0;
 private clock:Clock=createClock();
 private store=new SaveStore();
 private ready=false;
 private transitioning=false;
 private collapseRemaining=0;
 private lastTick=performance.now();
 private sinceSave=0;
 private saveRevision=0;
 private lockRelease:(()=>void)|null=null;
 private notice(text:string){
  const el=document.querySelector<HTMLElement>('#feedback')!;el.classList.add('notice');el.textContent=text;this.feedbackUntil=this.time.now+5000;
 }
 private async persist(){
  if(!this.ready||this.transitioning)return;
  const label=document.querySelector<HTMLElement>('#save-state')!;
  const revision=++this.saveRevision;label.textContent='Mentés…';
  try{await this.store.save(snapshot(this.actor,this.clock,this.garden,this.economy,this.orders));if(revision===this.saveRevision)label.textContent='Mentve ebben a böngészőben';}
  catch{if(revision===this.saveRevision){label.textContent='Nem sikerült menteni';this.notice('A mentés nem sikerült. A következő automatikus mentés újrapróbálja.');}}
 }
 private async initStorage(){
  const load=async()=>{
   try{
    const loaded=await this.store.load();
    if(loaded.data){const {player,clock,seeds,produce,plots,economy,orders}=loaded.data;this.economy=economy;this.orders=orders;this.actor.setPosition(player.x,player.y);this.clock=clock;this.garden={seeds,produce,plots:new Map(plots)};this.drawGarden();}
    this.ready=true;this.lastTick=performance.now();
    if(loaded.recovered)showDialogue('Az előző mentésből folytatjuk.','A legutóbbi mentés hibás volt. Az előző érvényes állapotot sikerült visszaállítani.','MENTÉS HELYREÁLLÍTVA');
    else if(loaded.data&&dialogue.open)dialogue.close();
    await this.persist();
   }catch(error){
    document.querySelector('#save-state')!.textContent='A mentés nem tölthető be';
    showDialogue('A mentésedet megőriztem.',error instanceof Error?error.message:'A böngésző tárhelye nem érhető el. A játékot nem indítom el mentés nélkül.','MENTÉSI HIBA');
   }
  };
  if(!navigator.locks){document.querySelector('#save-state')!.textContent='A böngésző nem támogatott';showDialogue('A mentés nem indítható.','A biztonságos mentéshez friss Chrome, Brave, Firefox vagy Safari szükséges.');return;}
  void navigator.locks.request('erdoszeli-birtok-session',{ifAvailable:true},async lock=>{
   if(!lock){document.querySelector('#save-state')!.textContent='Másik ablakban nyitva';showDialogue('A farm már nyitva van.','Zárd be a játék másik böngészőlapját, majd frissítsd ezt az oldalt. Így a két ablak nem írja felül egymás mentését.');return;}
   await load();await new Promise<void>(resolve=>{this.lockRelease=resolve;});
  }).catch(()=>{showDialogue('A mentés nem indítható.','A böngésző nem enged hozzáférést a játék mentéséhez.');});
  document.addEventListener('visibilitychange',()=>{this.lastTick=performance.now();if(document.hidden)void this.persist();});
  window.addEventListener('blur',()=>{this.lastTick=performance.now();void this.persist();});
  window.addEventListener('focus',()=>{this.lastTick=performance.now();});
  window.addEventListener('pagehide',()=>{void this.persist().finally(()=>{this.ready=false;this.store.close();this.lockRelease?.();});});
  window.addEventListener('pageshow',event=>{if(event.persisted)location.reload();});
 }
 private startJump(){
  if(!this.ready||dialogue.open||this.transitioning||this.collapseRemaining>0||this.jumpRemaining>0||this.jumpCooldown>0)return;
  this.jumpRemaining=JUMP_DURATION;this.jumpCooldown=JUMP_DURATION+JUMP_COOLDOWN;
 }
 private openJournal(){
  if(!this.ready||this.transitioning||this.collapseRemaining>0||dialogue.open)return;
  if(Math.hypot(this.actor.x-250,this.actor.y-244)>55){this.notice('A naplót a ház verandáján találod.');return;}
  if(this.jumpRemaining>0)return;
  showDialogue('Mára elég volt?','A kert holnap is megvár. Lezárom a naplót, és reggelig pihenek.','ESTI NAPLÓ');
  document.querySelector<HTMLButtonElement>('#sleep')!.hidden=false;
  document.querySelector<HTMLButtonElement>('#export-save')!.hidden=false;
 }
 private async finishDay(forced:boolean){
  if(this.transitioning||!this.ready)return;
  this.transitioning=true;this.saveRevision++;
  const nextClock=createClock(this.clock.day+1);
  const nextGarden=nextDayGarden(this.garden);
  try{
   const nextEconomy=settleSales(this.economy,this.clock.day);
   const nextOrders=deliverOrders(this.orders);
   await this.store.save(snapshot(START,nextClock,nextGarden,nextEconomy,nextOrders));
   this.clock=nextClock;this.garden=nextGarden;this.economy=nextEconomy;this.orders=nextOrders;this.actor.setPosition(START.x,START.y);this.actor.setAngle(0);this.body.setY(0);this.jumpRemaining=0;this.jumpCooldown=0;this.collapseRemaining=0;this.bubble.setVisible(false);this.nearby='';document.querySelector('#status')!.textContent='';this.shadow.setScale(1);this.drawGarden();this.aimAhead();
   document.querySelector<HTMLElement>('#night-warning')!.hidden=true;
   document.querySelector<HTMLElement>('#sleep-shade')!.style.opacity='0';
   document.querySelector('#save-state')!.textContent='Mentve ebben a böngészőben';
   showDialogue('Új reggel a birtokon.',(forced?'Tegnap elnyomott az álom. Itthon ébredtem, minden holmim megvan.':'A napló eltéve. Egy új nap vár a kertben.')+'\n\n'+this.receiptText()+(quantityTotal(this.orders.mailbox)>0?'\n\nCsomag vár a kapu melletti postaládában.':''),'JÓ REGGELT');
  }catch{
   this.collapseRemaining=0;this.actor.setAngle(0);document.querySelector<HTMLElement>('#sleep-shade')!.style.opacity='0';
   document.querySelector('#save-state')!.textContent='A napváltás nincs elmentve';
   showDialogue('Még nem sikerült menteni.','A következő napot nem kezdtem el. Próbáld újra a napzárást; a kert és a magok változatlanok.','MENTÉSI HIBA');
   document.querySelector<HTMLButtonElement>('#sleep')!.hidden=false;
  }finally{this.transitioning=false;this.lastTick=performance.now();}
 }

 private openInventory(){
  if(!this.ready||this.transitioning||this.collapseRemaining>0)return;
  showDialogue('Készlet','A leszedett termények és a nálad lévő ültetőanyagok.','NÁLAD VAN');
  for(const [selector,items,seeds] of [['inventory-produce',this.garden.produce,false],['inventory-seeds',this.garden.seeds,true]] as const){
   const grid=document.querySelector<HTMLElement>(`#${selector}`)!;grid.replaceChildren();
   for(const crop of crops){
    const card=document.createElement('div');card.className=`inventory-card crop-${crop}`;card.dataset[seeds?'inventorySeed':'inventoryCrop']=crop;
    const name=document.createElement('span');name.textContent=cropNames[crop]+(seeds?(crop==='potato'?' · vetőgumó':' · mag'):'');
    const amount=document.createElement('strong');amount.textContent=`${items[crop]} db`;card.append(name,amount);grid.append(card);
   }
  }
  document.querySelector<HTMLElement>('#inventory-panel')!.hidden=false;document.querySelector('#dialogue-close')!.textContent='Vissza a kertbe';
 }
 private drawMailFlag(){
  if(!this.mailFlag)return;this.mailFlag.clear();
  if(quantityTotal(this.orders.mailbox)>0){const m=farmLayout.mailbox;this.mailFlag.fillStyle(0xe7b55a);this.mailFlag.fillRect(m.x+m.w-3,m.y-10,3,13);this.mailFlag.fillRect(m.x+m.w,m.y-10,8,5);}
 }
 private nearObject(area:{x:number;y:number;w:number;h:number},distance=55){return Math.hypot(this.actor.x-area.x-area.w/2,this.actor.y-area.y-area.h/2)<=distance;}
 private canInteract(){return this.ready&&!dialogue.open&&!this.transitioning&&this.collapseRemaining<=0&&this.jumpRemaining<=0;}
 private openCatalog(){
  if(!this.canInteract())return;if(!this.nearObject(farmLayout.catalog)){this.notice('Sétálj a ház jobb oldali ablaka melletti magkatalógushoz.');return;}
  showDialogue('Mit ültessünk legközelebb?','A rendelés árát most fizeted ki. A magok másnap reggel a postaládába érkeznek.','MAGKATALÓGUS');
  const rows=document.querySelector<HTMLElement>('#catalog-rows')!;rows.replaceChildren();
  for(const crop of crops){
   const label=document.createElement('label');label.className='catalog-row';label.textContent=`${cropNames[crop]} · ${seedPrices[crop]} gold/db`;
   const input=document.createElement('input');input.type='number';input.min='0';input.max='999999';input.step='1';input.value='0';input.dataset.orderCrop=crop;input.setAttribute('aria-label',`${cropNames[crop]} rendelési mennyiség`);input.addEventListener('input',()=>this.updateCart());label.append(input);rows.append(label);
  }
  this.updateCart();document.querySelector<HTMLElement>('#catalog-panel')!.hidden=false;
 }
 private readCart(){const cart={radish:0,potato:0,pea:0};for(const crop of crops)cart[crop]=document.querySelector<HTMLInputElement>(`[data-order-crop="${crop}"]`)!.valueAsNumber;return cart;}
 private updateCart(){
  const cart=this.readCart(),cost=orderCost(cart),canOrder=purchaseSeeds(this.economy,this.orders,this.garden.seeds,cart);
  document.querySelector('#catalog-total')!.textContent=Number.isNaN(cost)?'Egész, nem negatív mennyiséget adj meg.':`Összesen: ${cost} gold · Nálad: ${this.economy.gold} gold${cost>this.economy.gold?' · Nincs elég gold.':''}`;
  document.querySelector<HTMLButtonElement>('#place-order')!.disabled=!canOrder||this.transitioning;
 }
 private async placeOrder(){
  if(!this.ready||this.transitioning||document.querySelector<HTMLElement>('#catalog-panel')!.hidden)return;
  const purchase=purchaseSeeds(this.economy,this.orders,this.garden.seeds,this.readCart());if(!purchase)return;
  this.transitioning=true;this.saveRevision++;document.querySelector<HTMLButtonElement>('#place-order')!.disabled=true;
  try{
   await this.store.save(snapshot(this.actor,this.clock,this.garden,purchase.economy,purchase.orders));
   this.economy=purchase.economy;this.orders=purchase.orders;document.querySelector('#save-state')!.textContent='Mentve ebben a böngészőben';
   showDialogue('A rendelés elküldve.','A magok másnap reggel érkeznek a kapu melletti postaládába.','MAGKATALÓGUS');
  }catch{document.querySelector('#save-state')!.textContent='A rendelést nem sikerült menteni';document.querySelector('#catalog-total')!.textContent='Nem sikerült menteni. Goldot nem vontam le; próbáld újra.';}
  finally{this.transitioning=false;this.lastTick=performance.now();if(!document.querySelector<HTMLElement>('#catalog-panel')!.hidden)document.querySelector<HTMLButtonElement>('#place-order')!.disabled=!purchaseSeeds(this.economy,this.orders,this.garden.seeds,this.readCart());}
 }
 private openMailbox(){
  if(!this.canInteract())return;if(!this.nearObject(farmLayout.mailbox)){this.notice('A postaláda a kapu bal oldalán áll.');return;}
  showDialogue('Nézzük a postát.','', 'POSTALÁDA');
  const count=quantityTotal(this.orders.mailbox);
  document.querySelector('#mailbox-content')!.textContent=count?crops.filter(c=>this.orders.mailbox[c]>0).map(c=>`${cropNames[c]}: ${this.orders.mailbox[c]} db`).join('\n'):quantityTotal(this.orders.pending)>0?'A rendelésed úton van, holnap reggel érkezik.':'Most nincs csomag a postaládában.';
  document.querySelector<HTMLButtonElement>('#collect-package')!.hidden=count===0;
  document.querySelector<HTMLElement>('#mailbox-panel')!.hidden=false;
 }
 private async collectMail(){
  if(!this.ready||this.transitioning||document.querySelector<HTMLElement>('#mailbox-panel')!.hidden)return;
  const collected=collectPackage(this.garden,this.orders);if(!collected)return;
  this.transitioning=true;this.saveRevision++;document.querySelector<HTMLButtonElement>('#collect-package')!.disabled=true;
  try{
   await this.store.save(snapshot(this.actor,this.clock,collected.garden,this.economy,collected.orders));
   this.garden=collected.garden;this.orders=collected.orders;this.drawGarden();document.querySelector('#save-state')!.textContent='Mentve ebben a böngészőben';
   showDialogue('A csomag átvéve.','Az ültetőanyagok bekerültek a készletedbe.','POSTALÁDA');
  }catch{document.querySelector('#save-state')!.textContent='Az átvételt nem sikerült menteni';document.querySelector('#mailbox-content')!.textContent='Nem sikerült menteni. A csomag megmaradt a postaládában; próbáld újra.';}
  finally{this.transitioning=false;this.lastTick=performance.now();document.querySelector<HTMLButtonElement>('#collect-package')!.disabled=false;}
 }
 private receiptText(){
  const receipt=this.economy.lastSale;
  if(!receipt)return 'Még nincs eladási elszámolás.';
  const lines=crops.filter(c=>receipt.items[c]>0).map(c=>`${cropNames[c]}: ${receipt.items[c]} × ${salePrices[c]} = ${receipt.items[c]*salePrices[c]} gold`);
  return `${receipt.day}. napi elszámolás\n${lines.length?lines.join('\n'):'Nem adtál el terményt.'}\nBevétel: ${receipt.total} gold\nEgyenleg: ${this.economy.gold} gold`;
 }
 private renderShipping(){
  const panel=document.querySelector<HTMLElement>('#shipping-rows')!;panel.replaceChildren();
  for(const crop of crops){
   const row=document.createElement('div');row.className='shipping-row';
   const title=document.createElement('p');title.textContent=`${cropNames[crop]} · ${salePrices[crop]} gold/db`;
   const counts=document.createElement('p');counts.dataset.shippingCrop=crop;counts.textContent=`Nálad: ${this.garden.produce[crop]} · Ládában: ${this.economy.shipping[crop]}`;
   row.append(title,counts);
   for(const [direction,all,label] of [['deposit',false,'+1'],['deposit',true,'Mind be'],['withdraw',false,'−1'],['withdraw',true,'Mind vissza']] as const){
    const button=document.createElement('button');button.type='button';button.textContent=label;button.dataset.transfer=`${crop}-${direction}-${all?'all':'one'}`;
    button.setAttribute('aria-label',`${cropNames[crop]}: ${label}`);
    const available=direction==='deposit'?this.garden.produce[crop]:this.economy.shipping[crop];button.disabled=available===0;
    button.addEventListener('click',()=>{
     if(!this.ready||this.transitioning||this.collapseRemaining>0)return;
     const amount=all?(direction==='deposit'?this.garden.produce[crop]:this.economy.shipping[crop]):1;
     if(transferProduce(this.garden,this.economy,crop,amount,direction)){this.renderShipping();this.drawGarden();void this.persist();}
    });row.append(button);
   }
   panel.append(row);
  }
  document.querySelector('#shipping-total')!.textContent=`Várható reggeli bevétel: ${shippingValue(this.economy.shipping)} gold`;
 }
 private openShipping(){
  if(!this.ready||dialogue.open||this.transitioning||this.collapseRemaining>0||this.jumpRemaining>0)return;
  const box=farmLayout.shipping;
  if(Math.hypot(this.actor.x-(box.x+box.w/2),this.actor.y-(box.y+box.h/2))>55){this.notice('Sétálj a veranda bal oldalán lévő eladóládához.');return;}
  showDialogue('Mit adjunk el?','A terményeket napzárásig visszaveheted. A bevétel másnap reggel érkezik.','ELADÓLÁDA');
  this.renderShipping();document.querySelector<HTMLElement>('#shipping-panel')!.hidden=false;
 }
 private selectTool(tool:Tool){
  this.tool=tool;
  document.querySelectorAll<HTMLButtonElement>('[data-tool]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.tool===tool)));
 }
 private drawGarden(){
  const g=this.planted;g.clear();
  for(const [key,plot] of this.garden.plots){
   const [x,y]=key.split(',').map(Number);
   g.fillStyle(plot.watered?0x493f31:0x88603f);g.fillRect(x+1,y+1,TILE-2,TILE-2);
   g.lineStyle(1,plot.watered?0x635b43:0xa17b51);for(let row=4;row<TILE;row+=4)g.lineBetween(x+3,y+row,x+TILE-3,y+row);
   if(plot.crop){
    const colors={radish:0xd57c91,potato:0xc5a363,pea:0x9db56a};
    const stage=Math.min(1,plot.growth/growthTarget(plot));
    const size=stage===0?3:stage<.5?5:7;
    if(plot.crop==='pea'&&stage>.25){g.lineStyle(1,0xa28e67);g.lineBetween(x+5,y+12,x+5,y-3);g.lineBetween(x+12,y+12,x+12,y-3);g.lineBetween(x+5,y,x+12,y);}
    g.fillStyle(0x62904a);g.fillRect(x+8-size/2,y+8-size/2,size,size);g.fillRect(x+3,y+5,Math.max(3,size-1),3);
    if(isRipe(plot)){g.fillStyle(colors[plot.crop]);g.fillRect(x+6,y+8,5,5);g.fillStyle(0xf6df90);g.fillRect(x+TILE-4,y-2,3,3);}
    else if(stage>.3){g.fillStyle(0x8bae57);g.fillRect(x+9,y+3,3,5);}
   }
   if(plot.watered){g.fillStyle(0x83b8c5);g.fillRect(x+TILE-4,y+3,2,3);}
  }
  this.drawMailFlag();
  const surface=document.querySelector<HTMLElement>('#game')!;
  surface.dataset.plots=String(this.garden.plots.size);surface.dataset.planted=String([...this.garden.plots.values()].filter(p=>p.crop).length);surface.dataset.watered=String([...this.garden.plots.values()].filter(p=>p.watered).length);surface.dataset.ripe=String([...this.garden.plots.values()].filter(p=>isRipe(p)).length);surface.dataset.produce=String(Object.values(this.garden.produce).reduce((a,b)=>a+b,0));
  for(const crop of ['radish','potato','pea'] as const)document.querySelector(`[data-count="${crop}"]`)!.textContent=String(this.garden.seeds[crop]);
 }
 private doWork(){
  if(!this.ready||dialogue.open||this.transitioning||this.collapseRemaining>0||this.jumpRemaining>0||!this.target)return;
  const result=work(this.garden,this.tool,this.target,this.actor);
  const feedback=document.querySelector<HTMLElement>('#feedback')!;
  feedback.textContent=result.message+(result.ok&&this.tool==='harvest'?' Készlet: Tab.':'');feedback.dataset.result=result.ok?'success':'error';this.feedbackUntil=this.time.now+4000;
  this.drawGarden();if(result.ok)void this.persist();
 }

 create(){
  const g=this.add.graphics();
  const rect=(x:number,y:number,w:number,h:number,c:number)=>{g.fillStyle(c);g.fillRect(x,y,w,h);};
  rect(0,0,800,600,0x8da85e);
  // Deterministic decoration keeps the prototype reproducible.
  let seed=71;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  for(let i=0;i<1100;i++){const x=random()*800,y=random()*600;rect(x,y,2,random()*4+1,[0x79944e,0x9cb96a,0xb1bf77][i%3]);}
  for(const path of farmLayout.paths){
    g.lineStyle(path.width,0xc5b481);g.beginPath();
    path.points.forEach(([x,y],i)=>i===0?g.moveTo(x,y):g.lineTo(x,y));g.strokePath();
    g.fillStyle(0xc5b481);for(const [x,y] of path.points)g.fillCircle(x,y,path.width/2);
  }
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
  // Shipping crate: left of the veranda, distinct from the journal table.
  const box=farmLayout.shipping;rect(box.x,box.y,box.w,box.h,0x705137);rect(box.x+2,box.y+2,box.w-4,8,0xb78f54);rect(box.x+2,box.y+12,box.w-4,2,0x9c7746);rect(box.x+13,box.y+7,6,12,0xd2b75d);
  const crate=this.add.zone(box.x+box.w/2,box.y+box.h/2,box.w,box.h).setInteractive({useHandCursor:true});crate.on('pointerdown',()=>this.openShipping());
  const objectZone=(id:string,area:{x:number;y:number;w:number;h:number},action:()=>void)=>{
   const zone=this.add.zone(area.x+area.w/2,area.y+area.h/2,area.w+10,area.h+10).setInteractive({useHandCursor:true});zone.setName(id);zone.on('pointerdown',action);
  };
  objectZone('journal',farmLayout.journal,()=>this.openJournal());
  const catalog=farmLayout.catalog;rect(catalog.x-3,catalog.y+catalog.h,24,4,0x836341);rect(catalog.x,catalog.y,catalog.w,catalog.h,0x668a68);rect(catalog.x+3,catalog.y+2,12,8,0xe8dfb9);rect(catalog.x+8,catalog.y+2,1,8,0x867958);
  objectZone('catalog',catalog,()=>this.openCatalog());
  const mail=farmLayout.mailbox;rect(mail.x+10,mail.y+mail.h,5,20,0x80613e);rect(mail.x,mail.y,mail.w,mail.h,0x718e91);rect(mail.x+2,mail.y+3,mail.w-4,4,0xc7cfbc);rect(mail.x+8,mail.y+9,8,2,0x384e4d);
  objectZone('mailbox',mail,()=>this.openMailbox());
  this.mailFlag=this.add.graphics().setDepth(3);
  // Locked outbuilding, closer to the garden as in the reference.
  const shedRect=(x:number,y:number,w:number,h:number,c:number)=>rect(x+farmLayout.shedOffset.x,y+farmLayout.shedOffset.y,w,h,c);
  shedRect(607,152,117,55,0x57623b);shedRect(601,133,118,68,0x92744c);
  for(let x=604;x<719;x+=12)shedRect(x,137,2,63,0x79603f);
  shedRect(636,151,43,50,0x6e5137);shedRect(656,151,3,50,0x392f26);shedRect(651,172,12,5,0xa8a18c);shedRect(655,175,5,7,0xc3b16f);
  g.fillStyle(0x77553b);g.fillTriangle(562,121,710,121,685,84);g.fillTriangle(562,121,685,84,592,84);
  // A larger, irregular-looking pond and short dock echo the reference's lower-right shoreline.
  const pond=farmLayout.pond;
  g.fillStyle(0x71884d);g.fillEllipse(pond.x,pond.y,pond.rx*2+22,pond.ry*2+22);
  g.fillStyle(0xb7ae7a);g.fillEllipse(pond.x,pond.y,pond.rx*2+10,pond.ry*2+10);
  g.fillStyle(0x568b91);g.fillEllipse(pond.x,pond.y,pond.rx*2,pond.ry*2);
  for(let i=0;i<48;i++){const x=pond.x-pond.rx+random()*pond.rx*2,y=pond.y-pond.ry+random()*pond.ry*2;if(((x-pond.x)/pond.rx)**2+((y-pond.y)/pond.ry)**2<.8)rect(x,y,9+random()*9,2,0x7aa9a6);}
  for(const [x,y] of [[570,443],[731,480],[620,540]]){g.fillStyle(0x739659);g.fillEllipse(x,y,15,7);rect(x+3,y-4,3,3,0xe5d8b7);}
  for(let i=0;i<20;i++){const x=560+i*8;rect(x,350-Math.sin(i)*6,2,17,0x596f3a);}
  const dock=farmLayout.dock;
  rect(dock.x,dock.y,dock.w,dock.h,0x77573c);
  for(let x=dock.x+2;x<dock.x+dock.w;x+=8)rect(x,dock.y+2,6,dock.h-4,0xb18c59);
  for(const x of [dock.x,dock.x+dock.w-5]){rect(x,dock.y-5,5,11,0x735337);rect(x,dock.y+dock.h-6,5,11,0x735337);}
  // Beds are grouped to the right of the veranda, away from all path edges.
  for(const bed of farmLayout.beds){const {x,y,w,h}=bed;rect(x,y,w,h,0xb69b64);rect(x+3,y+3,w-6,h-6,0x755b3e);}
  for(const [x,y] of [[74,353],[518,280],[440,491]]){rect(x,y,24,18,0x80877a);rect(x+3,y,15,5,0xa4a998);}
  const fence=(x:number,y:number,count:number)=>{rect(x,y+7,count*25,4,0x846c45);rect(x,y+16,count*25,3,0x9c8050);for(let i=0;i<=count;i++)rect(x+i*25,y,5,27,0x765f3e);};
  fence(28,499,4);fence(211,515,9);fence(433,176,4);fence(691,221,3);
  rect(490,249,3,94,0x846c45);rect(498,249,3,94,0x9c8050);
  for(let y=249;y<=343;y+=23)rect(487,y,16,5,0x765f3e);
  // Open gate on the lower-left path.
  rect(132,492,6,37,0x715436);rect(201,505,6,37,0x715436);rect(121,504,4,25,0x947348);
  for(let i=0;i<100;i++){const x=45+random()*710,y=275+random()*265;if(Math.abs(x-215)<65||x>480&&y>340||x>325&&x<495&&y<380)continue;rect(x,y,2,4,0x668344);if(i%3===0)rect(x-1,y-2,4,3,i%2?0xe9d7a1:0xb7a3ba);}
  this.planted=this.add.graphics().setDepth(1);
  this.selection=this.add.graphics().setDepth(2);
  this.drawGarden();
  const tools:Tool[]=['hoe','water','radish','potato','pea','harvest'];
  document.querySelectorAll<HTMLButtonElement>('[data-tool]').forEach(button=>button.addEventListener('click',(event)=>{this.selectTool(button.dataset.tool as Tool);if(event.detail>0)button.blur();}));
  document.querySelectorAll<HTMLButtonElement>('#toolbar button,#work,#jump,#run').forEach(b=>b.addEventListener('keydown',e=>{if(e.code==='Space')e.stopPropagation();}));
  this.input.keyboard!.on('keydown', (event:KeyboardEvent)=>{
    if(!this.ready||dialogue.open||this.transitioning||this.collapseRemaining>0)return;
    if(event.code==='Space'&&!event.repeat&&!(event.target as HTMLElement)?.closest('button')){event.preventDefault();this.startJump();}
    if(event.key>='1'&&event.key<='6')this.selectTool(tools[Number(event.key)-1]);
    if(event.code==='KeyF'&&!event.repeat){event.preventDefault();this.aimAhead();this.doWork();}
  });
  this.input.on('pointermove',(pointer:Phaser.Input.Pointer)=>{
    if(!this.ready||dialogue.open||pointer.wasTouch)return;
    const point=this.cameras.main.getWorldPoint(pointer.x,pointer.y);this.target=targetTile(point.x,point.y);
  });
  this.input.on('pointerdown',(pointer:Phaser.Input.Pointer)=>{
    if(!this.ready||dialogue.open||pointer.button!==0)return;
    const point=this.cameras.main.getWorldPoint(pointer.x,pointer.y);this.target=targetTile(point.x,point.y);this.doWork();
  });
  this.actor=this.add.container(START.x,START.y).setDepth(100);
  this.shadow=this.add.ellipse(0,0,20,7,0x35442e,0.25);this.actor.add(this.shadow);
  this.body=this.add.container(0,0);this.actor.add(this.body);
  const part=(x:number,y:number,w:number,h:number,color:number)=>{const r=this.add.rectangle(x,y,w,h,color);this.body.add(r);return r;};
  part(-4,-4,6,8,0x604632);part(4,-4,6,8,0x604632);
  part(-3,-13,5,15,0x4c6744);part(3,-13,5,15,0x4c6744);
  part(0,-26,13,15,0xe6dfc5);part(-9,-25,4,13,0xe9c49c);part(9,-25,4,13,0xe9c49c);
  part(0,-39,11,12,0xe9c49c);part(0,-45,13,5,0xc7a256);part(-5,-41,3,7,0xc7a256);
  this.hair=part(8,-38,5,12,0xc7a256);part(3,-39,2,2,0x4b4334);
  this.bubble=this.add.text(0,0,'', {fontFamily:'Georgia',fontSize:'20px',color:'#fff4cf',backgroundColor:'#293e30',padding:{x:9,y:4}}).setOrigin(.5,1).setDepth(101).setInteractive({useHandCursor:true});
  const inspect=()=>{
    if(!this.ready||dialogue.open||this.transitioning||this.collapseRemaining>0)return;
    if(this.nearby==='catalog')this.openCatalog();
    if(this.nearby==='mailbox')this.openMailbox();
    if(this.nearby==='shipping')this.openShipping();
    if(this.nearby==='house')this.openJournal();
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
  void this.initStorage();
  this.keys=this.input.keyboard!.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT,SHIFT') as Record<string,Phaser.Input.Keyboard.Key>;
  document.querySelector('#produce')!.addEventListener('click',()=>this.openInventory());
  window.addEventListener('keydown',event=>{if(event.code==='Tab'&&!event.repeat&&!dialogue.open&&this.ready&&!this.transitioning&&this.collapseRemaining<=0){event.preventDefault();this.openInventory();}},true);
  document.querySelector('#menu')!.addEventListener('click',()=>{showDialogue('Erdőszéli birtok','', 'MENÜ');document.querySelector<HTMLElement>('#menu-panel')!.hidden=false;});
  document.querySelector('#place-order')!.addEventListener('click',()=>void this.placeOrder());
  document.querySelector('#collect-package')!.addEventListener('click',()=>void this.collectMail());
  document.querySelector('#sleep')!.addEventListener('click',()=>void this.finishDay(false));
  document.querySelector('#export-save')!.addEventListener('click',()=>{
   const blob=new Blob([JSON.stringify(snapshot(this.actor,this.clock,this.garden,this.economy,this.orders),null,2)],{type:'application/json'});
   const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download=`erdoszeli-birtok-${this.clock.day}.json`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  });
 }
 private aimAhead(){this.target=targetTile(this.actor.x+this.direction.x*22,this.actor.y+this.direction.y*22);}
 private tree(g:Phaser.GameObjects.Graphics,x:number,y:number){g.fillStyle(0x6d5739);g.fillRect(x-3,y,7,24);g.fillStyle(0x45693f);g.fillCircle(x,y-10,23);g.fillStyle(0x628348);g.fillCircle(x-7,y-18,18);g.fillStyle(0x799650);g.fillCircle(x-10,y-23,11);}
 update(time:number,delta:number){
  if(!this.actor)return;
  const now=performance.now();const seconds=Math.max(0,(now-this.lastTick)/1000);this.lastTick=now;
  document.querySelector('#gold')!.textContent=String(this.economy.gold);
  document.querySelector('#day-number')!.textContent=`${this.clock.day}.`;
  document.querySelector('#clock-label')!.textContent=clockLabel(this.clock);
  document.querySelector<HTMLElement>('#night-shade')!.style.opacity=String(nightOpacity(this.clock));
  const surface=document.querySelector<HTMLElement>('#game')!;surface.dataset.pendingSeeds=String(quantityTotal(this.orders.pending));surface.dataset.mailSeeds=String(quantityTotal(this.orders.mailbox));surface.dataset.gold=String(this.economy.gold);surface.dataset.shipping=String(shippingValue(this.economy.shipping));surface.dataset.day=String(this.clock.day);surface.dataset.elapsed=String(this.clock.elapsed);surface.dataset.ready=String(this.ready);surface.dataset.jumping=String(this.jumpRemaining>0);
  if(!this.ready||dialogue.open||this.transitioning||document.hidden||!document.hasFocus()){this.input.keyboard?.resetKeys();this.selection.setVisible(false);return;}
  if(this.collapseRemaining>0){
   this.collapseRemaining=Math.max(.001,this.collapseRemaining-seconds);this.actor.setAngle(75);document.querySelector<HTMLElement>('#sleep-shade')!.style.opacity=String(1-this.collapseRemaining);
   if(this.collapseRemaining<=.001)void this.finishDay(true);return;
  }
  const clockEvents=advanceClock(this.clock,seconds);
  for(const warning of clockEvents.warnings){
   const el=document.querySelector<HTMLElement>('#night-warning')!;el.hidden=false;el.textContent=warning===480?'Későre jár. Ideje hazamenni és pihenni.':'Alig bírom nyitva tartani a szemem. Most már tényleg le kell feküdnöm.';
  }
  if(clockEvents.collapse){release();this.jumpRemaining=0;this.body.setY(0);this.collapseRemaining=1;this.notice('Elálmosodtam…');return;}
  this.sinceSave+=seconds;if(this.sinceSave>=5){this.sinceSave=0;void this.persist();}
  this.jumpCooldown=Math.max(0,this.jumpCooldown-seconds);
  this.jumpRemaining=Math.max(0,this.jumpRemaining-Math.min(seconds,.05));
  const height=jumpHeight(this.jumpRemaining);this.body.setY(-height);this.shadow.setScale(1-height/90);

  this.selection.setVisible(true);
  const k=this.keys;
  const dx=Number(k.D.isDown||k.RIGHT.isDown||held.has('right'))-Number(k.A.isDown||k.LEFT.isDown||held.has('left'));
  const dy=Number(k.S.isDown||k.DOWN.isDown||held.has('down'))-Number(k.W.isDown||k.UP.isDown||held.has('up'));
  const before={x:this.actor.x,y:this.actor.y};const next=move(before.x,before.y,dx,dy,delta/1000,movementSpeed(this.jumpRemaining>0,k.SHIFT.isDown));this.actor.setPosition(next.x,next.y);
  surface.dataset.running=String(k.SHIFT.isDown);surface.dataset.jumpHeight=String(height);
  surface.dataset.playerX=String(Math.round(next.x));surface.dataset.playerY=String(Math.round(next.y));
  if(dx)this.facing=dx>0?1:-1;
  if(dx||dy){this.direction={x:dx,y:dy};this.aimAhead();}
  if(!this.target)this.aimAhead();
  this.selection.clear();
  if(this.target){
    const valid=cultivable(this.target)&&reachable(this.target,this.actor);
    const plot=this.garden.plots.get(`${this.target.x},${this.target.y}`);
    const hint=document.querySelector<HTMLElement>('#crop-hint')!;hint.textContent=plot?.crop?`${cropNames[plot.crop]} · ${isRipe(plot)?'Betakarítható':`${plot.growth}/${growthTarget(plot)} nap`}${isRipe(plot)?'':` · ${plot.watered?'öntözve':'öntözést kér'}`}`:'';
    this.selection.lineStyle(1,valid?0xf1df9e:0xd69077,1).strokeRect(this.target.x,this.target.y,TILE,TILE);
    this.selection.fillStyle(valid?0xf1df9e:0xd69077,.12).fillRect(this.target.x,this.target.y,TILE,TILE);
  }
  if(this.time.now>this.feedbackUntil){const feedback=document.querySelector<HTMLElement>('#feedback')!;feedback.textContent='Kattints közeli földre · F: művelet · Space: ugrás · Shift: futás';delete feedback.dataset.result;feedback.classList.remove('notice');}
  this.hair.x=this.facing*8;
  const walking=next.x!==before.x||next.y!==before.y;
  this.actor.setScale(1,walking?1+Math.sin(time/(k.SHIFT.isDown?55:85))*0.025:1);
  const near=(x:number,y:number,d:number)=>Phaser.Math.Distance.Between(next.x,next.y,x,y)<d;
  this.nearby=near(farmLayout.catalog.x+9,farmLayout.catalog.y+6,40)?'catalog':near(farmLayout.mailbox.x+12,farmLayout.mailbox.y+8,55)?'mailbox':near(farmLayout.shipping.x+16,farmLayout.shipping.y+12,50)?'shipping':near(657+farmLayout.shedOffset.x,206+farmLayout.shedOffset.y,66)?'shed':near(farmLayout.dock.x+25,farmLayout.dock.y+10,60)?'pond':near(250,244,55)?'house':'';
  this.bubble.setPosition(next.x,next.y-54).setText(this.nearby==='shed'?'?':this.nearby?'…':'').setVisible(Boolean(this.nearby)&&this.jumpRemaining<=0);
  document.querySelector('#status')!.textContent=this.nearby==='shed'?'?':this.nearby==='catalog'?'Magkatalógus · E / kattintás':this.nearby==='mailbox'?`Postaláda${quantityTotal(this.orders.mailbox)>0?' · Csomag érkezett':''} · E / kattintás`:this.nearby==='shipping'?'Eladóláda · E / koppints a ládára':this.nearby==='house'?'Veranda · E / koppints a buborékra':this.nearby==='pond'?'Tópart · E / koppints a buborékra':'';
 }
}
new Phaser.Game({type:Phaser.AUTO,parent:'game',width:800,height:600,pixelArt:true,backgroundColor:'#8da85e',scene:Farm,scale:{mode:Phaser.Scale.RESIZE,autoCenter:Phaser.Scale.CENTER_BOTH},input:{keyboard:true}});
