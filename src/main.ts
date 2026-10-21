import Phaser from 'phaser';
import './style.css';
import { move, START } from './movement';
import { farmLayout } from './layout';
import {drawFarm} from './world-art';
import {createClearing,clearDebris,debrisAt,neededTool,debrisNames,regrowDebris,type ClearingTool} from './cleanup';
import {drawCrop} from './crop-art';
import { createGarden, targetTile, cultivable, reachable, work, TILE, type Tile, type Tool, nextDayGarden, isRipe, growthTarget, cropNames } from './gardening';
import { createClock, advanceClock, clockLabel, nightOpacity, type Clock } from './clock';
import { JUMP_DURATION, JUMP_COOLDOWN, jumpHeight, movementSpeed } from './jump';
import {itemIcon,seedIcon} from './item-icons';
import {normalizeFarmName} from './farm-name';
import { SaveStore, snapshot } from './storage';
import {createOrders,seedPrices,orderCost,quantityTotal,purchaseSeeds,deliverOrders,collectPackage, type Orders} from './orders';
import { createEconomy, crops, salePrices, shippingValue, settleSales, transferProduce, type Economy } from './economy';
const dialogue=document.querySelector<HTMLDialogElement>('#dialogue')!;
const story='A kutatólaborban mindig akadt egy újabb feladat. Szerettem a munkámat, de elfáradtam. Változásra volt szükségem.\n\nMost itt vagyok. A ház előtt gaz nő, a kerítés javításra vár. Nem kell mindent ma rendbe hoznom. Ez egy új kezdet.';
function showDialogue(title:string,text:string,label='A BIRTOKON'){
 release();
 document.querySelector<HTMLButtonElement>('#sleep')!.hidden=true;
 document.querySelector<HTMLButtonElement>('#export-save')!.hidden=true;
 for(const id of ['farm-name-panel','shipping-panel','menu-panel','inventory-panel','catalog-panel','mailbox-panel'])document.querySelector<HTMLElement>(`#${id}`)!.hidden=true;
 document.querySelector<HTMLButtonElement>('#dialogue-close')!.hidden=false;
 document.querySelector('#dialogue-close')!.textContent='Folytatás';
 document.querySelector('#dialogue-title')!.textContent=title;
 document.querySelector('#dialogue-text')!.textContent=text;
 document.querySelector('#dialogue-label')!.textContent=label;
 if(!dialogue.open)dialogue.showModal();
}
document.querySelector('#story')!.addEventListener('click',()=>showDialogue('Végre megérkeztem.',story,'EGY ÚJ KEZDET'));
document.querySelector('#help')!.addEventListener('click',()=>showDialogue('Lassan, a saját tempódban.','Mozgás: WASD, nyilak vagy a képernyő iránygombjai. Ugrás: Space. Futás: tartsd a Shiftet. Az ugrás magasabbra és messzebbre visz; akadályokon továbbra sem lehet áthaladni.\n\nA háznál, tónál és melléképületnél az E billentyűvel vagy a megjelenő jelzésre kattintva nézhetsz körül. A napló, a magkatalógus, az eladóláda és a postaláda a világban használható: sétálj oda, majd E vagy kattintás/koppintás.\n\nTakarítás: Kéz (7) a gazhoz, Fejsze (8) az ágakhoz, Csákány (9) a kövekhez. Kattints közelről vagy F. Két nap után, műveletlen helyen újra megjelennek.\n\nKertészkedés: 1–6 vagy az alsó eszközsáv. Kattints egy közeli földkockára, vagy használd az F billentyűt az előtted lévő kockán. Kapa → ültetőanyag → öntözés. A három ágyásban és a szabad rétfoltokon dolgozhatsz.\n\n6 perc nappal után éjszaka lesz. A 2. és 3. éjszakai percben figyelmeztetés érkezik, majd 3:30–4:00 között elfáradsz és otthon ébredsz, veszteség nélkül. A verandán a Naplóval korábban is lefekhetsz.\n\nA kert és az idő automatikusan mentődik ebben a böngészőben. Az öntözött növények reggel fejlődnek. Éréskor válaszd a Szedés eszközt (6), majd kattints a növényre. A leszedett termények Tab-bal vagy a Menü → Készlet pontban nézhetők meg. A veranda bal oldalán lévő eladóládába teheted a termést. Napzárásig visszavehető, reggel megkapod az árát. Retek: 15, burgonya: 30, borsó: 12 gold/db. A háznál lévő magkatalógusból rendelhetsz (retek 5, burgonya 10, borsó 15 gold/db), másnap a kapu melletti postaládából veheted át. Készlet: Tab; bezárás: Tab vagy Escape. A stamina még nincs bekötve.','IRÁNYÍTÁS'));
const held=new Set<string>();
function release(){held.clear();const run=document.querySelector<HTMLButtonElement>('#run');if(run)run.setAttribute('aria-pressed','false');document.querySelectorAll('.active').forEach(el=>el.classList.remove('active'));}
window.addEventListener('blur',release);document.addEventListener('visibilitychange',()=>{if(document.hidden)release();});
document.querySelectorAll<HTMLButtonElement>('[data-dir]').forEach(button=>{
 button.addEventListener('pointerdown',e=>{if(button.hasPointerCapture(e.pointerId) || e.isTrusted) button.setPointerCapture(e.pointerId);held.add(button.dataset.dir!);button.classList.add('active');});
 const up=()=>{held.delete(button.dataset.dir!);button.classList.remove('active');};
 button.addEventListener('pointerup',up);button.addEventListener('pointercancel',up);button.addEventListener('lostpointercapture',up);
});
type FarmTool=Tool|ClearingTool;
class Farm extends Phaser.Scene {
 private actor!:Phaser.GameObjects.Container;
 private keys!:Record<string,Phaser.Input.Keyboard.Key>;
 private hair!:Phaser.GameObjects.Rectangle;
 private facing=1;
 private bubble!:Phaser.GameObjects.Text;
 private nearby='';
 private farmName:string|null=null;
 private naming=false;
 private garden=createGarden();
 private economy:Economy=createEconomy();
 private orders:Orders=createOrders();
 private tool:FarmTool='hoe';
 private clearing=createClearing();
 private scenery!:Phaser.GameObjects.Graphics;
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
  try{await this.store.save(snapshot(this.actor,this.clock,this.garden,this.economy,this.orders,this.farmName,this.clearing));if(revision===this.saveRevision)label.textContent='Mentve ebben a böngészőben';}
  catch{if(revision===this.saveRevision){label.textContent='Nem sikerült menteni';this.notice('A mentés nem sikerült. A következő automatikus mentés újrapróbálja.');}}
 }
 private async initStorage(){
  const load=async()=>{
   try{
    const loaded=await this.store.load();
    if(loaded.data){const {player,clock,seeds,produce,plots,economy,orders,farmName,clearing}=loaded.data;this.clearing=clearing;this.farmName=farmName;this.updateFarmTitle();this.economy=economy;this.orders=orders;this.actor.setPosition(player.x,player.y);this.clock=clock;this.garden={seeds,produce,plots:new Map(plots)};this.redrawScenery();this.drawGarden();}
    this.ready=true;this.lastTick=performance.now();
    if(!this.farmName)this.openFarmNaming();
    else if(loaded.recovered)showDialogue('Az előző mentésből folytatjuk.','A legutóbbi mentés hibás volt. Az előző érvényes állapotot sikerült visszaállítani.','MENTÉS HELYREÁLLÍTVA');
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
 private updateFarmTitle(){
  const name=this.farmName??'A farmod';document.querySelector('h1')!.textContent=name;document.title=`${name} · farmjáték`;document.querySelector('#app')!.setAttribute('aria-label',name);
 }
 private openFarmNaming(){
  this.naming=true;showDialogue('Végre megérkeztem.',story,'EGY ÚJ KEZDET');
  document.querySelector<HTMLElement>('#farm-name-panel')!.hidden=false;document.querySelector<HTMLButtonElement>('#dialogue-close')!.hidden=true;
  document.querySelector<HTMLInputElement>('#farm-name')!.focus();this.validateFarmName();
 }
 private validateFarmName(){
  const input=document.querySelector<HTMLInputElement>('#farm-name')!,name=normalizeFarmName(input.value);
  document.querySelector<HTMLButtonElement>('#start-farm')!.disabled=!name||this.transitioning;
  document.querySelector('#farm-name-error')!.textContent=!input.value.trim()?'Válassz egy nevet a farmodnak.':!name?'A név legfeljebb 40 karakter lehet.':'';
 }
 private async confirmFarmName(){
  if(!this.naming||!this.ready||this.transitioning)return;
  const name=normalizeFarmName(document.querySelector<HTMLInputElement>('#farm-name')!.value);if(!name)return;
  this.transitioning=true;this.saveRevision++;document.querySelector<HTMLButtonElement>('#start-farm')!.disabled=true;
  try{
   await this.store.save(snapshot(this.actor,this.clock,this.garden,this.economy,this.orders,name,this.clearing));
   this.farmName=name;this.naming=false;this.updateFarmTitle();document.querySelector<HTMLButtonElement>('#dialogue-close')!.hidden=false;dialogue.close();document.querySelector('#save-state')!.textContent='Mentve ebben a böngészőben';
  }catch{document.querySelector('#farm-name-error')!.textContent='A nevet nem sikerült menteni. A farmod megmaradt; próbáld újra.';}
  finally{this.transitioning=false;this.lastTick=performance.now();document.querySelector<HTMLButtonElement>('#start-farm')!.disabled=!normalizeFarmName(document.querySelector<HTMLInputElement>('#farm-name')!.value);}
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
   const nextClearing=regrowDebris(this.clearing,nextClock.day,nextGarden);
   await this.store.save(snapshot(START,nextClock,nextGarden,nextEconomy,nextOrders,this.farmName,nextClearing));
   this.clearing=nextClearing;this.clock=nextClock;this.garden=nextGarden;this.redrawScenery();this.economy=nextEconomy;this.orders=nextOrders;this.actor.setPosition(START.x,START.y);this.actor.setAngle(0);this.body.setY(0);this.jumpRemaining=0;this.jumpCooldown=0;this.collapseRemaining=0;this.bubble.setVisible(false);this.nearby='';document.querySelector('#status')!.textContent='';this.shadow.setScale(1);this.drawGarden();this.aimAhead();
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
    const amount=document.createElement('strong');amount.textContent=`${items[crop]} db`;card.append(seeds?seedIcon(crop):itemIcon(crop),name,amount);grid.append(card);
   }
  }
  const materials=document.querySelector<HTMLElement>('#inventory-materials')!;materials.replaceChildren();
  for(const [key,name]of [['wood','Fa'],['stone','Kő']] as const){const card=document.createElement('div');card.className='inventory-card';card.dataset.material=key;const label=document.createElement('span');label.textContent=name;const count=document.createElement('strong');count.textContent=`${this.clearing[key]} db`;card.append(itemIcon(key),label,count);materials.append(card);}
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
   const input=document.createElement('input');input.type='number';input.min='0';input.max='999999';input.step='1';input.value='0';input.dataset.orderCrop=crop;input.setAttribute('aria-label',`${cropNames[crop]} rendelési mennyiség`);input.addEventListener('input',()=>this.updateCart());label.prepend(seedIcon(crop));label.append(input);rows.append(label);
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
   await this.store.save(snapshot(this.actor,this.clock,this.garden,purchase.economy,purchase.orders,this.farmName,this.clearing));
   this.economy=purchase.economy;this.orders=purchase.orders;document.querySelector('#save-state')!.textContent='Mentve ebben a böngészőben';
   showDialogue('A rendelés elküldve.','A magok másnap reggel érkeznek a kapu melletti postaládába.','MAGKATALÓGUS');
  }catch{document.querySelector('#save-state')!.textContent='A rendelést nem sikerült menteni';document.querySelector('#catalog-total')!.textContent='Nem sikerült menteni. Goldot nem vontam le; próbáld újra.';}
  finally{this.transitioning=false;this.lastTick=performance.now();if(!document.querySelector<HTMLElement>('#catalog-panel')!.hidden)document.querySelector<HTMLButtonElement>('#place-order')!.disabled=!purchaseSeeds(this.economy,this.orders,this.garden.seeds,this.readCart());}
 }
 private openMailbox(){
  if(!this.canInteract())return;if(!this.nearObject(farmLayout.mailbox)){this.notice('A postaláda a kapu bal oldalán áll.');return;}
  showDialogue('Nézzük a postát.','', 'POSTALÁDA');
  const count=quantityTotal(this.orders.mailbox);
  const content=document.querySelector<HTMLElement>('#mailbox-content')!;content.replaceChildren();
  if(count){for(const crop of crops.filter(c=>this.orders.mailbox[c]>0)){
   const card=document.createElement('span');card.className='mail-seed-card';card.dataset.mailCrop=crop;
   const label=document.createElement('span');label.textContent=`${cropNames[crop]}${crop==='potato'?' · vetőgumó':' · mag'}: ${this.orders.mailbox[crop]} db`;card.append(seedIcon(crop),label);content.append(card);
  }}else content.textContent=quantityTotal(this.orders.pending)>0?'A rendelésed úton van, holnap reggel érkezik.':'Most nincs csomag a postaládában.';
  document.querySelector<HTMLButtonElement>('#collect-package')!.hidden=count===0;
  document.querySelector<HTMLElement>('#mailbox-panel')!.hidden=false;
 }
 private async collectMail(){
  if(!this.ready||this.transitioning||document.querySelector<HTMLElement>('#mailbox-panel')!.hidden)return;
  const collected=collectPackage(this.garden,this.orders);if(!collected)return;
  this.transitioning=true;this.saveRevision++;document.querySelector<HTMLButtonElement>('#collect-package')!.disabled=true;
  try{
   await this.store.save(snapshot(this.actor,this.clock,collected.garden,this.economy,collected.orders,this.farmName,this.clearing));
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
  const focused=(document.activeElement as HTMLElement)?.dataset.item;
  for(const [id,items,from] of [['shipping-crate',this.economy.shipping,'crate'],['shipping-inventory',this.garden.produce,'inventory']] as const){
   const grid=document.querySelector<HTMLElement>(`#${id}`)!;grid.replaceChildren();
   const present=crops.filter(c=>items[c]>0);
   for(const crop of present){
    const slot=document.createElement('button');slot.type='button';slot.className='item-slot';slot.draggable=true;slot.dataset.item=`${from}-${crop}`;
    slot.title=`${cropNames[crop]} · ${items[crop]} db · ${salePrices[crop]} gold/db`;slot.setAttribute('aria-label',`${cropNames[crop]}: ${items[crop]} db, ${from==='crate'?'visszavétel':'eladásra tesz'}`);
    const count=document.createElement('span');count.className='slot-count';count.textContent=String(items[crop]);slot.append(itemIcon(crop),count);
    slot.addEventListener('click',event=>this.moveShipping(crop,from,event.shiftKey?1:items[crop]));
    slot.addEventListener('dragstart',event=>{event.dataTransfer?.setData('application/x-farm-item',JSON.stringify({crop,from}));if(event.dataTransfer)event.dataTransfer.effectAllowed='move';});
    grid.append(slot);
   }
   const padding=Math.max(8,Math.ceil((present.length+1)/8)*8)-present.length;
   for(let i=0;i<padding;i++){const empty=document.createElement('span');empty.className='empty-slot';empty.setAttribute('aria-hidden','true');grid.append(empty);}
   grid.ondragover=event=>{event.preventDefault();if(event.dataTransfer)event.dataTransfer.dropEffect='move';};
   grid.ondrop=event=>{
    event.preventDefault();try{
     const data=JSON.parse(event.dataTransfer?.getData('application/x-farm-item')??'null');
     if(!data||!crops.includes(data.crop)||!['inventory','crate'].includes(data.from)||data.from===from)return;
     const crop=data.crop as typeof crops[number],quantity=data.from==='inventory'?this.garden.produce[crop]:this.economy.shipping[crop];this.moveShipping(crop,data.from,quantity);
    }catch{/* Ignore unrelated drag payloads. */}
   };
  }
  document.querySelector('#shipping-total')!.textContent=`Reggel érkezik: ${shippingValue(this.economy.shipping)} gold`;
  if(focused){const next=document.querySelector<HTMLButtonElement>(`[data-item="${focused}"]`)??document.querySelector<HTMLButtonElement>('.item-slot');next?.focus({preventScroll:true});}
 }
 private moveShipping(crop:typeof crops[number],from:'inventory'|'crate',amount:number){
  if(!this.ready||this.transitioning||this.collapseRemaining>0||document.querySelector<HTMLElement>('#shipping-panel')!.hidden)return;
  if(transferProduce(this.garden,this.economy,crop,amount,from==='inventory'?'deposit':'withdraw')){this.renderShipping();this.drawGarden();void this.persist();}
 }
 private openShipping(){
  if(!this.ready||dialogue.open||this.transitioning||this.collapseRemaining>0||this.jumpRemaining>0)return;
  const box=farmLayout.shipping;
  if(Math.hypot(this.actor.x-(box.x+box.w/2),this.actor.y-(box.y+box.h/2))>55){this.notice('Sétálj a veranda bal oldalán lévő eladóládához.');return;}
  showDialogue('Eladóláda','Tedd be, amit el szeretnél adni. Napzárásig visszaveheted.','ELADÓLÁDA');
  this.renderShipping();document.querySelector<HTMLElement>('#shipping-panel')!.hidden=false;
 }
 private selectTool(tool:FarmTool){
  this.tool=tool;
  document.querySelector<HTMLButtonElement>(`[data-tool="${tool}"]`)?.scrollIntoView({block:'nearest',inline:'nearest'});
  document.querySelectorAll<HTMLButtonElement>('[data-tool]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.tool===tool)));
 }
 private drawGarden(){
  const g=this.planted;g.clear();
  for(const [key,plot] of this.garden.plots){
   const [x,y]=key.split(',').map(Number);
   g.fillStyle(plot.watered?0x493f31:0x88603f);g.fillRect(x+1,y+1,TILE-2,TILE-2);
   g.lineStyle(1,plot.watered?0x635b43:0xa17b51);for(let row=4;row<TILE;row+=4)g.lineBetween(x+3,y+row,x+TILE-3,y+row);
   drawCrop(g,x,y,plot);
   if(plot.watered){g.fillStyle(0x83b8c5);g.fillRect(x+TILE-4,y+3,2,3);}
  }
  this.drawMailFlag();
  const surface=document.querySelector<HTMLElement>('#game')!;
  surface.dataset.plots=String(this.garden.plots.size);surface.dataset.planted=String([...this.garden.plots.values()].filter(p=>p.crop).length);surface.dataset.watered=String([...this.garden.plots.values()].filter(p=>p.watered).length);surface.dataset.ripe=String([...this.garden.plots.values()].filter(p=>isRipe(p)).length);surface.dataset.produce=String(Object.values(this.garden.produce).reduce((a,b)=>a+b,0));
  for(const crop of ['radish','potato','pea'] as const)document.querySelector(`[data-count="${crop}"]`)!.textContent=String(this.garden.seeds[crop]);
 }
 private redrawScenery(){this.scenery?.destroy();this.scenery=drawFarm(this,this.clearing,this.garden).setDepth(-1);}
 private async clean(item:NonNullable<ReturnType<typeof debrisAt>>){
  if(!this.canInteract())return;
  const next=clearDebris(this.clearing,item,this.tool,this.actor,this.clock.day);
  if(!next){this.notice(Math.hypot(this.actor.x-item.x,this.actor.y-item.y)>44?'Sétálj közelebb.':`Ehhez ${item.kind==='weed'?'a Kéz':item.kind==='branch'?'a Fejsze':'a Csákány'} eszközt válaszd.`);return;}
  this.transitioning=true;this.saveRevision++;
  try{
   await this.store.save(snapshot(this.actor,this.clock,this.garden,this.economy,this.orders,this.farmName,next));
   this.clearing=next;this.redrawScenery();this.notice(item.kind==='weed'?'A gazat kiszedtem.':item.kind==='branch'?'Fa került a készletbe.':'Kő került a készletbe.');document.querySelector('#save-state')!.textContent='Mentve ebben a böngészőben';
   this.tweens.add({targets:this.body,angle:{from:-12,to:0},duration:180});
  }catch{this.notice('Nem sikerült menteni. A tárgy megmaradt; próbáld újra.');}
  finally{this.transitioning=false;this.lastTick=performance.now();}
 }
 private doWork(){
  if(!this.ready||dialogue.open||this.transitioning||this.collapseRemaining>0||this.jumpRemaining>0||!this.target)return;
  const item=debrisAt(this.clearing,this.garden,this.target.x+8,this.target.y+8);
  if(item){void this.clean(item);return;}
  if(this.tool==='hand'||this.tool==='axe'||this.tool==='pickaxe'){this.notice('Kattints közeli gazra, faágra vagy kőre.');return;}
  const result=work(this.garden,this.tool,this.target,this.actor);
  const feedback=document.querySelector<HTMLElement>('#feedback')!;
  feedback.textContent=result.message+(result.ok&&this.tool==='harvest'?' Készlet: Tab.':'');feedback.dataset.result=result.ok?'success':'error';this.feedbackUntil=this.time.now+4000;
  this.drawGarden();if(result.ok)void this.persist();
 }

 create(){
  this.redrawScenery();
  const objectZone=(id:string,area:{x:number;y:number;w:number;h:number},action:()=>void)=>{
   const zone=this.add.zone(area.x+area.w/2,area.y+area.h/2,area.w+10,area.h+10).setInteractive({useHandCursor:true});zone.setName(id);zone.on('pointerdown',action);
  };
  objectZone('shipping',farmLayout.shipping,()=>this.openShipping());
  objectZone('journal',farmLayout.journal,()=>this.openJournal());
  objectZone('catalog',farmLayout.catalog,()=>this.openCatalog());
  objectZone('mailbox',farmLayout.mailbox,()=>this.openMailbox());
  this.mailFlag=this.add.graphics().setDepth(3);
  this.planted=this.add.graphics().setDepth(1);
  this.selection=this.add.graphics().setDepth(2);
  this.drawGarden();
  for(const button of Array.from(document.querySelectorAll<HTMLButtonElement>('#toolbar [data-tool]'))){
   const tool=button.dataset.tool as FarmTool;
   const label=button.querySelector('span')!;
   const names={hoe:'Kapa',water:'Öntözés',radish:'Retek',potato:'Burgonya',pea:'Borsó',harvest:'Szedés',hand:'Kéz',axe:'Fejsze',pickaxe:'Csákány'};
   if(tool==='hoe'||tool==='water'||tool==='harvest')for(const node of Array.from(button.childNodes))if(node.nodeType===Node.TEXT_NODE)node.remove();
   label.textContent=names[tool];button.prepend(crops.includes(tool as typeof crops[number])?seedIcon(tool as typeof crops[number]):itemIcon(tool));button.setAttribute('aria-label',names[tool]);
  }
  const tools:FarmTool[]=['hoe','water','radish','potato','pea','harvest','hand','axe','pickaxe'];
  document.querySelectorAll<HTMLButtonElement>('[data-tool]').forEach(button=>button.addEventListener('click',(event)=>{this.selectTool(button.dataset.tool as FarmTool);if(event.detail>0)button.blur();}));
  document.querySelectorAll<HTMLButtonElement>('#toolbar button,#work,#jump,#run').forEach(b=>b.addEventListener('keydown',e=>{if(e.code==='Space')e.stopPropagation();}));
  this.input.keyboard!.on('keydown', (event:KeyboardEvent)=>{
    if(!this.ready||dialogue.open||this.transitioning||this.collapseRemaining>0)return;
    if(event.code==='Space'&&!event.repeat&&!(event.target as HTMLElement)?.closest('button')){event.preventDefault();this.startJump();}
    if(event.key>='1'&&event.key<='9')this.selectTool(tools[Number(event.key)-1]);
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
  this.keys=this.input.keyboard!.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT,SHIFT',false) as Record<string,Phaser.Input.Keyboard.Key>;
  document.querySelector('#produce')!.addEventListener('click',()=>this.openInventory());
  window.addEventListener('keydown',event=>{
   if(event.code==='Escape'&&dialogue.open){event.preventDefault();if(!this.naming)dialogue.close();return;}
   if(event.code!=='Tab'||event.repeat||this.naming)return;
   if(dialogue.open&&!document.querySelector<HTMLElement>('#inventory-panel')!.hidden){event.preventDefault();dialogue.close();return;}
   if(!dialogue.open&&this.ready&&!this.transitioning&&this.collapseRemaining<=0){event.preventDefault();this.openInventory();}
  },true);
  dialogue.addEventListener('cancel',event=>{if(this.naming)event.preventDefault();});
  document.querySelector('#dialogue form')!.addEventListener('submit',event=>{if(this.naming){event.preventDefault();void this.confirmFarmName();}});
  document.querySelector('#farm-name')!.addEventListener('input',()=>this.validateFarmName());
  document.querySelector('#start-farm')!.addEventListener('click',()=>void this.confirmFarmName());
  document.querySelector('#menu')!.addEventListener('click',()=>{showDialogue(this.farmName??'A farmod','', 'MENÜ');document.querySelector<HTMLElement>('#menu-panel')!.hidden=false;});
  document.querySelector('#place-order')!.addEventListener('click',()=>void this.placeOrder());
  document.querySelector('#collect-package')!.addEventListener('click',()=>void this.collectMail());
  document.querySelector('#sleep')!.addEventListener('click',()=>void this.finishDay(false));
  document.querySelector('#export-save')!.addEventListener('click',()=>{
   const blob=new Blob([JSON.stringify(snapshot(this.actor,this.clock,this.garden,this.economy,this.orders,this.farmName,this.clearing),null,2)],{type:'application/json'});
   const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download=`erdoszeli-birtok-${this.clock.day}.json`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  });
 }
 private aimAhead(){this.target=targetTile(this.actor.x+this.direction.x*22,this.actor.y+this.direction.y*22);}
 update(time:number,delta:number){
  if(!this.actor)return;
  const now=performance.now();const seconds=Math.max(0,(now-this.lastTick)/1000);this.lastTick=now;
  document.querySelector('#gold')!.textContent=String(this.economy.gold);
  document.querySelector('#day-number')!.textContent=`${this.clock.day}.`;
  document.querySelector('#clock-label')!.textContent=clockLabel(this.clock);
  document.querySelector<HTMLElement>('#night-shade')!.style.opacity=String(nightOpacity(this.clock));
  document.querySelector<HTMLElement>('#sunlight')!.style.opacity=String(1-Math.min(1,nightOpacity(this.clock)/.55));
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
  surface.dataset.cleared=String(Object.keys(this.clearing.removed).length);surface.dataset.wood=String(this.clearing.wood);surface.dataset.stone=String(this.clearing.stone);surface.dataset.running=String(k.SHIFT.isDown);surface.dataset.jumpHeight=String(height);
  surface.dataset.playerX=String(Math.round(next.x));surface.dataset.playerY=String(Math.round(next.y));
  if(dx)this.facing=dx>0?1:-1;
  if(dx||dy){this.direction={x:dx,y:dy};this.aimAhead();}
  if(!this.target)this.aimAhead();
  this.selection.clear();
  if(this.target){
    const debris=debrisAt(this.clearing,this.garden,this.target.x+8,this.target.y+8);
    const valid=debris?Math.hypot(this.actor.x-debris.x,this.actor.y-debris.y)<=44&&neededTool[debris.kind]===this.tool:cultivable(this.target)&&reachable(this.target,this.actor);
    const plot=this.garden.plots.get(`${this.target.x},${this.target.y}`);
    const hint=document.querySelector<HTMLElement>('#crop-hint')!;hint.textContent=debris?`${debrisNames[debris.kind]} · ${debris.kind==='weed'?'Kéz (7)':debris.kind==='branch'?'Fejsze (8)':'Csákány (9)'} · F / kattintás`:plot?.crop?`${cropNames[plot.crop]} · ${isRipe(plot)?'Betakarítható':`${plot.growth}/${growthTarget(plot)} nap`}${isRipe(plot)?'':` · ${plot.watered?'öntözve':'öntözést kér'}`}`:'';
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
