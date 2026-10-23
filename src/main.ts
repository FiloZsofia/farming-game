import {HOME_ORIGIN,inHome,homeObjects} from './home';
import {drawHome} from './home-art';
import {MovementInput} from './movement-input';
import {WorkEffects,type ImpactKind} from './work-effects';
import {WeatherEffects,RainSound} from './weather-effects';
import {weatherOnDay,weatherNames,randomWeatherSeed,waterFromRain} from './weather';
import {questEntries} from './quest-log';
import {DuckLife} from './duck-life';
import {drawResearch,drawWorkshop} from './research-art';
import {WORKSHOP_ORIGIN,inWorkshop,salvageSites,researchMaterials,researchNames,repairNeeds,workshopObjects,inspectWorkshop,entranceShutterOpen,workshopLit,remainingWebs,clearCobweb,startResearch,plantFlower,flowerAt,advanceResearch,beeAvailable,beeAnchor,observeBee,grantKey,collectSalvage,supplyMaterial,repairMachine,type Research} from './research';
import {PondLife} from './pond-life';
import {drawEstate,drawDuck} from './estate-art';
import {goods,treeKinds,trees,goodNames,goodPrices,extraNames,extraPrices,extras,extraValue,emptyExtras,buyGood,placeGood,collectEstate,advanceEstate,seasons,seasonIndex,seasonDay,type Good,type Extra,type Estate} from './estate';
import {LeoArt,leoPortrait} from './leo-art';
import {morningSale,saleRows,displayedBalance,type MorningSale} from './morning-report';
import {drawShop} from './shop-art';
import {VillageAmbience} from './village-ambience';
import {robInventory,nightLossText} from './night-loss';
import {worldBlocked,outsideFarm,villageLayout,WORLD_HEIGHT,shopAt,shopOrigins,shopsOpen,shopNames,merchantNearby,benchPose,type Shop} from './village-layout';
import {drawVillage,drawForage} from './village-art';
import {createTravel,forageReady} from './travel';
import Phaser from 'phaser';
import './style.css';
import { move, START,blocked } from './movement';
import { farmLayout,farmBounds } from './layout';
import {findSeeds,unlockedSeeds} from './seed-find';
import {FarmMusic,musicTracks,type MusicTrack} from './music';
import {createGardenSkill,gainGardening,LEVEL_TWO_XP,LEVEL_THREE_XP,gardeningLevel,gardeningTarget,gardeningProgress,gardeningCredit,levelThreeSeeds,type LevelThreeSeed,rewardFruits,type RewardFruit} from './gardening-skill';
import {FarmerArt,anniePortrait} from './character';
import {Wildlife} from './wildlife';
import {createStory,type FarmStory} from './story-events';
import {drawFarm} from './world-art';
import {HouseExterior} from './house-exterior';
import {WorkshopExterior} from './workshop-exterior';
import {createClearing,activeDebris,clearDebris,debrisAt,neededTool,debrisNames,regrowDebris,type ClearingTool} from './cleanup';
import {drawCrop} from './crop-art';
import { createGarden, targetTile, cultivable, reachable, work, TILE, type Tile, type Tool, nextDayGarden, isRipe, growthTarget, cropNames } from './gardening';
import { createClock, SPRING_PREVIEW_LAST_DAY, calendarDay, isTestingFarm, springPreviewComplete, advanceClock, clockLabel, nightOpacity, type Clock } from './clock';
import { JUMP_DURATION, JUMP_COOLDOWN, jumpHeight, movementSpeed } from './jump';
import {itemIcon,seedIcon,goodIcon} from './item-icons';
import {normalizeFarmName} from './farm-name';
import { SaveStore, snapshot,type Snapshot } from './storage';
import {createOrders,seedPrices,orderCost,quantityTotal,purchaseSeeds,deliverOrders,collectPackage, type Orders} from './orders';
import { createEconomy, crops, emptyQuantities, salePrices, shippingValue, settleSales, transferProduce, type Economy } from './economy';
const dialogue=document.querySelector<HTMLDialogElement>('#dialogue')!;
const story="Sam egy kutatólaborban dolgozott, ahol rovarokon élősködő gombákat vizsgáltak.\n\nAz utolsó hónapokban egy szokatlan minta érkezett a laborba. Az eredmények nem illettek ahhoz, amit addig tudtak. Sam még azelőtt eljött, hogy kiderült volna, mit találtak.\n\n„Szeretném megtudni, képes vagyok-e a saját kezemmel otthont teremteni ezen a helyen.”";
function showDialogue(title:string,text:string,label='A BIRTOKON'){
 release();dialogue.querySelector('.machine-petals')?.remove();delete dialogue.dataset.presentation;delete dialogue.dataset.speaker;document.querySelector<HTMLElement>('#speaker')!.hidden=true;document.querySelector('#speaker-portrait')!.replaceChildren();
 document.querySelector<HTMLButtonElement>('#sleep')!.hidden=true;
 document.querySelector<HTMLButtonElement>('#export-save')!.hidden=true;
 for(const id of ['research-panel','preview-end-panel','shop-panel','start-panel','morning-sale-panel','level-reward-panel','farm-name-panel','shipping-panel','menu-panel','inventory-panel','catalog-panel','mailbox-panel'])document.querySelector<HTMLElement>(`#${id}`)!.hidden=true;
 document.querySelector<HTMLButtonElement>('#dialogue-close')!.hidden=false;
 document.querySelector('#dialogue-close')!.textContent='Folytatás';
 document.querySelector('#dialogue-title')!.textContent=title;document.querySelector<HTMLElement>('#dialogue-title')!.hidden=!title;document.querySelector<HTMLElement>('#dialogue-label')!.hidden=!label;
 if(title){dialogue.setAttribute('aria-labelledby','dialogue-title');dialogue.removeAttribute('aria-label');}else{dialogue.removeAttribute('aria-labelledby');dialogue.setAttribute('aria-label','Sam története');}
 document.querySelector('#dialogue-text')!.textContent=text;
 document.querySelector('#dialogue-label')!.textContent=label;
 if(!dialogue.open)dialogue.showModal();
}
document.querySelector('#story')!.addEventListener('click',()=>showDialogue('',story,''));
document.querySelector('#help')!.addEventListener('click',()=>showDialogue('Lassan, a saját tempódban.','Mozgás: WASD, nyilak vagy a képernyő iránygombjai. Ugrás: Space. Futás: tartsd a Shiftet. Az ugrás magasabbra és messzebbre visz; akadályokon továbbra sem lehet áthaladni.\n\nA háznál, tónál és melléképületnél az E billentyűvel vagy a megjelenő jelzésre kattintva nézhetsz körül. A napló, a magkatalógus, az eladóláda és a postaláda a világban használható: sétálj oda, majd E vagy kattintás/koppintás.\n\nTakarítás: Kéz (7) a gazhoz, Fejsze (8) az ágakhoz, Csákány (9) a kövekhez. Kattints közelről vagy F. Három nap után, műveletlen helyen újra megjelennek.\n\nKertészkedés: 1–6 vagy az alsó eszközsáv. Kattints egy közeli földkockára, vagy használd az F billentyűt az előtted lévő kockán. Kapa → ültetőanyag → öntözés. A három ágyásban és a szabad rétfoltokon dolgozhatsz.\n\n6 perc nappal után éjszaka lesz. A 2. és 3. éjszakai percben figyelmeztetés érkezik, majd 3:30–4:00 között elfáradsz és otthon ébredsz. A farmon minden holmid biztonságban van. A birtokon kívül 50% eséllyel egy nálad lévő tárgyat (az alap szerszámok és a madárodú kivételével), máskülönben legfeljebb 10 goldot veszítesz. Üres készlet vagy erszény esetén a kiválasztott rablási kísérlet sikertelen. A verandán a Naplóval korábban is lefekhetsz.\n\nA kert és az idő automatikusan mentődik ebben a böngészőben. Az öntözött növények reggel fejlődnek. Éréskor válaszd a Szedés eszközt (6), majd kattints a növényre. A leszedett termények Tab-bal vagy a Menü → Készlet pontban nézhetők meg. A veranda bal oldalán lévő eladóládába teheted a termést. Napzárásig visszavehető, reggel megkapod az árát. Retek: 15, burgonya: 30, borsó: 12 gold/db. A háznál lévő magkatalógusból rendelhetsz (retek 5, burgonya 10, borsó 15 gold/db), másnap a kapu melletti postaládából veheted át. Készlet: Tab; bezárás: Tab vagy Escape. A déli kapun át a faluba sétálhatsz; balra az erdei ösvényen áfonyát gyűjthetsz (E, F vagy koppintás), a bokrok két nap után újrateremnek. A falutéren faiskola, Kertitó Szaküzlet és pihenőpad vár. Az üzletek csak nappal tartanak nyitva, éjszakára bezárnak. A stamina még nincs bekötve.','IRÁNYÍTÁS'));
const held=new Set<string>();
const movementInput=new MovementInput();
window.addEventListener('keydown',event=>movementInput.keyDown(event),true);
window.addEventListener('keyup',event=>movementInput.keyUp(event),true);
function release(){held.clear();const run=document.querySelector<HTMLButtonElement>('#run');if(run)run.setAttribute('aria-pressed','false');document.querySelectorAll('.active').forEach(el=>el.classList.remove('active'));}
window.addEventListener('blur',()=>{movementInput.clear();release();});document.addEventListener('visibilitychange',()=>{if(document.hidden){movementInput.clear();release();}});
document.querySelectorAll<HTMLButtonElement>('[data-dir]').forEach(button=>{
 button.addEventListener('pointerdown',e=>{if(button.hasPointerCapture(e.pointerId) || e.isTrusted) button.setPointerCapture(e.pointerId);held.add(button.dataset.dir!);button.classList.add('active');});
 const up=()=>{held.delete(button.dataset.dir!);button.classList.remove('active');};
 button.addEventListener('pointerup',up);button.addEventListener('pointercancel',up);button.addEventListener('lostpointercapture',up);
});
type FarmTool=Tool|ClearingTool|'birdhouse'|'wildflower';
class Farm extends Phaser.Scene {
 private researchArt:Phaser.GameObjects.Container|null=null;
 private homeArt:Phaser.GameObjects.Container|null=null;
 private houseExterior:HouseExterior|null=null;
 private workshopExterior:WorkshopExterior|null=null;
 private workshopArt:Phaser.GameObjects.Container|null=null;
 private leoVisitor:Phaser.GameObjects.Container|null=null;
 private leoStep=0;
 private beeArt:Phaser.GameObjects.Graphics|null=null;
 private duckLife:DuckLife|null=null;
 private weatherEffects:WeatherEffects|null=null;
 private rainSound=new RainSound();
 private workEffects:WorkEffects|null=null;
 private placing:Good|null=null;
 private pondLife!:PondLife;
 private fishThrowPlaying=false;
 private estateArt:Phaser.GameObjects.Graphics|null=null;
 private actor!:Phaser.GameObjects.Container;
 private cameraRegion:string|null=null;
 private shopAnnie:ReturnType<typeof drawShop>|null=null;
 private shopLeo:ReturnType<typeof drawShop>|null=null;
 private closingRetryAt=0;
 private morningPlaying=false;
 private morningStage='none';
 private shownGold:number|null=null;
 private keys!:Record<string,Phaser.Input.Keyboard.Key>;
 private avatar!:FarmerArt;
 private wildlife!:Wildlife;
 private villageAmbience!:VillageAmbience;
 private story=createStory();
 private skill=createGardenSkill();
 private skillUntil=0;
 private seedFindAnimation:Animation|null=null;
 private warningAnimation:Animation|null=null;
 private music=new FarmMusic();
 private neighbor:Phaser.GameObjects.Container|null=null;
 private neighborArt:FarmerArt|null=null;
 private neighborStep=0;
 private eventRetry=0;
 private thought!:Phaser.GameObjects.Text;
 private thoughtRemaining=0;
 private thoughtBack!:Phaser.GameObjects.Graphics;
 private facing=1;
 private bubble!:Phaser.GameObjects.Text;
 private nearby='';
 private farmName:string|null=null;
 private farmerName:string|null=null;
 private naming=false;
 private choosingFarm=true;
 private draftingFarm=false;
 private hasFarm=false;
 private loadRecovered=false;
 private travel=createTravel();
 private villageForage:Phaser.GameObjects.Graphics|null=null;
 private garden=createGarden();
 private economy:Economy={...createEconomy(),gold:100};
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
  if(!this.ready||this.transitioning||this.choosingFarm||!this.hasFarm)return;
  const label=document.querySelector<HTMLElement>('#save-state')!;
  const revision=++this.saveRevision;label.textContent='Mentés…';
  try{await this.store.save(snapshot(this.actor,this.clock,this.garden,this.economy,this.orders,this.farmName,this.clearing,this.story,this.skill,this.farmerName,this.travel));if(revision===this.saveRevision)label.textContent='Mentve ebben a böngészőben';}
  catch{if(revision===this.saveRevision){label.textContent='Nem sikerült menteni';this.notice('A mentés nem sikerült. A következő automatikus mentés újrapróbálja.');}}
 }
 private async initStorage(){
  const load=async()=>{
   try{
    const loaded=await this.store.load();
    if(loaded.data){const {player,clock,seeds,produce,plots,economy,orders,farmName,farmerName,clearing,story,skill,travel}=loaded.data;this.travel={...travel,weatherSeed:travel.weatherSeed??randomWeatherSeed()};this.skill=skill;this.story=story;this.clearing=clearing;this.farmName=farmName;this.farmerName=farmerName;this.updateFarmTitle();this.economy=economy;this.orders=orders;this.actor.setPosition(player.x,player.y);this.clock=clock;this.garden={seeds,produce,plots:new Map(plots)};if(this.currentWeather()==='rain'&&!springPreviewComplete(this.clock,this.farmName))waterFromRain(this.garden);this.redrawScenery();this.drawGarden();if(travel.weatherSeed===undefined)await this.store.save(snapshot(this.actor,this.clock,this.garden,this.economy,this.orders,this.farmName,this.clearing,this.story,this.skill,this.farmerName,this.travel));}
    this.hasFarm=Boolean(loaded.data);this.loadRecovered=loaded.recovered;await this.store.listFarms();this.ready=true;this.lastTick=performance.now();
    let resume:string|null=null;try{resume=sessionStorage.getItem('farm-resume-once');sessionStorage.removeItem('farm-resume-once');}catch{}
    if(resume&&resume===this.store.selectedFarmId&&this.hasFarm)this.resumeCurrentFarm();
    else await this.openStartMenu(false);
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
 private currentSnapshot(){return snapshot(this.actor,this.clock,this.garden,this.economy,this.orders,this.farmName,this.clearing,this.story,this.skill,this.farmerName,this.travel);}
 private async openStartMenu(saveCurrent=true){
  if(!this.ready||this.transitioning)return;
  this.choosingFarm=true;this.naming=false;this.draftingFarm=false;this.transitioning=true;release();
  this.warningAnimation?.cancel();document.querySelector<HTMLElement>('#night-warning')!.hidden=true;this.seedFindAnimation?.cancel();document.querySelector<HTMLElement>('#seed-find')!.hidden=true;
  showDialogue('Erdőszéli birtok','Folytasd a kerted gondozását, vagy kezdj új életet egy másik farmon.','');
  document.querySelector<HTMLElement>('#start-panel')!.hidden=false;document.querySelector<HTMLButtonElement>('#dialogue-close')!.hidden=true;
  const list=document.querySelector<HTMLElement>('#farm-list')!,error=document.querySelector<HTMLElement>('#farm-list-error')!,retry=document.querySelector<HTMLButtonElement>('#retry-farms')!,resume=document.querySelector<HTMLButtonElement>('#continue-farm')!,create=document.querySelector<HTMLButtonElement>('#new-farm')!;
  list.replaceChildren();error.textContent='Mentések betöltése…';resume.disabled=true;create.disabled=true;retry.hidden=true;
  try{
   if(saveCurrent&&this.hasFarm){await this.store.save(this.currentSnapshot());document.querySelector('#save-state')!.textContent='Mentve ebben a böngészőben';}
   const farms=await this.store.listFarms();error.textContent='';resume.hidden=!this.hasFarm;resume.disabled=!this.hasFarm;create.disabled=false;
   document.querySelector('#continue-farm-name')!.textContent=this.hasFarm?`${this.farmName??'Névtelen farm'} · ${calendarDay(this.clock.day,this.farmName)}. nap`:'';
   for(const farm of farms){
    const card=document.createElement('article');card.className='farm-save-card';card.dataset.farmId=farm.id;const info=document.createElement('div'),name=document.createElement('h3'),details=document.createElement('p'),date=document.createElement('small');name.textContent=farm.name;details.textContent=`${calendarDay(farm.day,farm.name)}. nap · ${farm.gold} gold`;date.textContent=`Mentve: ${new Date(farm.updatedAt).toLocaleString('hu-HU')}`;info.append(name);info.append(details,date);
    const play=document.createElement('button');play.type='button';play.textContent=farm.id===this.store.selectedFarmId?'Folytatom':'Megnyitom';play.addEventListener('click',()=>void this.chooseFarm(farm.id));const actions=document.createElement('div');actions.className='farm-card-actions';const remove=document.createElement('button');remove.type='button';remove.textContent='Törlés';remove.dataset.deleteFarm=farm.id;remove.className='delete-farm';remove.setAttribute('aria-label',`${farm.name} törlése`);remove.addEventListener('click',()=>this.confirmFarmDeletion(farm.id,farm.name));actions.append(play,remove);card.append(info,actions);list.append(card);
   }
   if(!farms.length){const empty=document.createElement('p');empty.className='farm-list-empty';empty.textContent='Még nincs mentett farmod. Az első kerted rád vár.';list.append(empty);}
   (this.hasFarm?resume:create).focus();
  }catch{error.textContent='A mentések betöltése vagy az aktuális farm mentése nem sikerült. A farmokat megőriztem; próbáld újra.';retry.hidden=false;resume.hidden=true;create.disabled=true;}
  finally{this.transitioning=false;this.lastTick=performance.now();}
 }
 private confirmFarmDeletion(id:string,name:string){
  if(!this.ready||this.transitioning||!this.choosingFarm)return;
  const popup=document.querySelector<HTMLDialogElement>('#delete-farm-dialog')!,cancel=document.querySelector<HTMLButtonElement>('#cancel-delete-farm')!,confirm=document.querySelector<HTMLButtonElement>('#confirm-delete-farm')!;
  document.querySelector('#delete-farm-name')!.textContent=name;document.querySelector('#delete-farm-error')!.textContent='';cancel.disabled=false;confirm.disabled=false;
  cancel.onclick=()=>popup.close();confirm.onclick=()=>void this.removeFarm(id);popup.oncancel=event=>{if(this.transitioning)event.preventDefault();};popup.showModal();cancel.focus();
 }
 private async removeFarm(id:string){
  if(!this.ready||this.transitioning||!this.choosingFarm)return;
  this.transitioning=true;const popup=document.querySelector<HTMLDialogElement>('#delete-farm-dialog')!,selected=this.store.selectedFarmId===id;
  document.querySelector<HTMLButtonElement>('#confirm-delete-farm')!.disabled=true;document.querySelector<HTMLButtonElement>('#cancel-delete-farm')!.disabled=true;
  try{
   await this.store.deleteFarm(id);popup.close();
   if(selected){this.ready=false;try{sessionStorage.removeItem('farm-resume-once');}catch{}this.store.close();this.lockRelease?.();location.reload();return;}
   this.transitioning=false;await this.openStartMenu(false);
  }catch{document.querySelector('#delete-farm-error')!.textContent='A törlés nem sikerült. A farmod megmaradt; próbáld újra.';document.querySelector<HTMLButtonElement>('#confirm-delete-farm')!.disabled=false;document.querySelector<HTMLButtonElement>('#cancel-delete-farm')!.disabled=false;}
  finally{this.transitioning=false;this.lastTick=performance.now();}
 }
 private resumeCurrentFarm(){
  this.choosingFarm=false;document.querySelector<HTMLElement>('#start-panel')!.hidden=true;this.lastTick=performance.now();release();
  if(!this.farmName){this.openFarmNaming();return;}
  if(springPreviewComplete(this.clock,this.farmName)){this.showPreviewEnd();return;}
  if(this.loadRecovered){this.loadRecovered=false;showDialogue('Az előző mentésből folytatjuk.','A legutóbbi mentés hibás volt. Az előző érvényes állapotot sikerült visszaállítani.','MENTÉS HELYREÁLLÍTVA');}
  else if(this.travel.morning||this.travel.sale||this.travel.estate.duckArrivalPending){dialogue.close();void this.presentMorning();}
  else dialogue.close();
 }
 private reloadFarm(id:string){
  this.ready=false;try{sessionStorage.setItem('farm-resume-once',id);}catch{}
  this.store.close();this.lockRelease?.();location.reload();
 }
 private async chooseFarm(id:string){
  if(!this.ready||this.transitioning)return;
  if(id===this.store.selectedFarmId){this.resumeCurrentFarm();return;}
  this.transitioning=true;const error=document.querySelector<HTMLElement>('#farm-list-error')!;error.textContent='Farm megnyitása…';
  try{await this.store.selectFarm(id);this.reloadFarm(id);}catch{error.textContent='Ezt a farmot most nem sikerült megnyitni. A jelenlegi és a többi mentésed megmaradt.';this.transitioning=false;}
 }
 private updateFarmTitle(){
  const name=this.farmName??'A farmod';document.querySelector('h1')!.textContent=name;document.title=`${name} · farmjáték`;document.querySelector('#app')!.setAttribute('aria-label',name);
 }
 private openFarmNaming(isNew=false){
  this.naming=true;this.draftingFarm=isNew;showDialogue('',story,'');
  document.querySelector<HTMLElement>('#farm-name-panel')!.hidden=false;document.querySelector<HTMLButtonElement>('#dialogue-close')!.hidden=true;
  const input=document.querySelector<HTMLInputElement>('#farm-name')!;input.value='';input.focus();this.validateFarmName();
 }
 private validateFarmName(){
  const input=document.querySelector<HTMLInputElement>('#farm-name')!,name=normalizeFarmName(input.value);
  document.querySelector<HTMLButtonElement>('#start-farm')!.disabled=!name||this.transitioning;
  document.querySelector('#farm-name-error')!.textContent=!input.value.trim()?'':!name?'A farm neve legfeljebb 40 karakter lehet.':'';
 }
 private async confirmFarmName(){
  if(!this.naming||!this.ready||this.transitioning)return;
  const name=normalizeFarmName(document.querySelector<HTMLInputElement>('#farm-name')!.value);if(!name)return;
  this.transitioning=true;this.saveRevision++;document.querySelector<HTMLButtonElement>('#start-farm')!.disabled=true;
  try{
   if(this.draftingFarm){
    const data:Snapshot=snapshot(START,createClock(),createGarden(),{...createEconomy(),gold:100},createOrders(),name,createClearing(),createStory(),createGardenSkill());
    data.travel.weatherSeed=randomWeatherSeed();const id=await this.store.createFarm(data);this.reloadFarm(id);return;
   }
   this.travel.weatherSeed??=randomWeatherSeed();
   await this.store.save(snapshot(this.actor,this.clock,this.garden,this.economy,this.orders,name,this.clearing,this.story,this.skill,this.farmerName,this.travel));
   this.farmName=name;this.naming=false;this.choosingFarm=false;this.hasFarm=true;this.updateFarmTitle();document.querySelector<HTMLButtonElement>('#dialogue-close')!.hidden=false;dialogue.close();document.querySelector('#save-state')!.textContent='Mentve ebben a böngészőben';
  }catch{document.querySelector('#farm-name-error')!.textContent='A nevet nem sikerült menteni. A farmod megmaradt; próbáld újra.';}
  finally{this.transitioning=false;this.lastTick=performance.now();document.querySelector<HTMLButtonElement>('#start-farm')!.disabled=!normalizeFarmName(document.querySelector<HTMLInputElement>('#farm-name')!.value);}
 }
 private startJump(){
  if(this.fishThrowPlaying||this.avatar.isWorking())return;
  if(!this.ready||dialogue.open||this.transitioning||this.collapseRemaining>0||this.jumpRemaining>0||this.jumpCooldown>0)return;
  this.jumpRemaining=JUMP_DURATION;this.jumpCooldown=JUMP_DURATION+JUMP_COOLDOWN;
 }
 private openJournal(){
  if(!this.ready||this.transitioning||this.collapseRemaining>0||dialogue.open)return;
  if(Math.hypot(this.actor.x-farmLayout.journal.x-9,this.actor.y-farmLayout.journal.y-7)>55){this.notice('A naplót a ház verandáján találod.');return;}
  if(this.jumpRemaining>0)return;
  showDialogue('Mára elég volt?','A kert holnap is megvár. Lezárom a naplót, és reggelig pihenek.','ESTI NAPLÓ');
  const observation=this.travel.research.observation;if(observation){const panel=document.querySelector<HTMLElement>('#research-panel')!;panel.hidden=false;panel.textContent=`Első megfigyelés · Tavasz ${observation.seasonDay}. napja — Szarvas faliméh (Osmia cornuta). Egy példány a vadvirágoknál. Ez jó jel, de egyetlen megfigyelésből még nem tudom, miért lettek kevesebben.`;}
  document.querySelector<HTMLButtonElement>('#sleep')!.hidden=false;
  document.querySelector<HTMLButtonElement>('#export-save')!.hidden=false;
 }
 private async finishDay(forced:boolean){
  if(this.transitioning||!this.ready)return;
  this.avatar.cancelWork();this.workEffects?.clear();
  if(this.clock.day>=SPRING_PREVIEW_LAST_DAY&&!isTestingFarm(this.farmName)){await this.finishSpringPreview();return;}
  this.transitioning=true;this.saveRevision++;
  const nextClock=createClock(this.clock.day+1);
  if(this.currentWeather()==='rain')waterFromRain(this.garden);
  const exhausted=forced||this.clock.elapsed>=this.clock.collapseAt;
  const robbery=exhausted&&outsideFarm(this.actor.y)?robInventory(this.garden,this.clearing,this.economy.gold,Math.random,this.travel.estate):null;
  const nextGarden=nextDayGarden(robbery?.garden??this.garden);
  if(weatherOnDay(this.travel.weatherSeed??0,nextClock.day)==='rain')waterFromRain(nextGarden);
  const nextTravel=structuredClone(this.travel);
  nextTravel.estate=advanceEstate(robbery?.estate??this.travel.estate,nextClock.day,Math.random,this.farmName);
  nextTravel.research=advanceResearch(this.travel.research,this.garden,nextClock.day);
  const loss=robbery?.loss;
  const carriedEconomy={...this.economy,gold:robbery?.gold??this.economy.gold};
  const morning=loss?nightLossText(loss):null;
  let nextDayReady=false;
  nextTravel.morning=morning;
  try{
   const nextEconomy=settleSales(carriedEconomy,this.clock.day,nextTravel.estate.shipping);
   nextTravel.estate.shipping=emptyExtras();
   nextTravel.sale=morningSale(nextEconomy.lastSale!,carriedEconomy.gold);
   const nextOrders=deliverOrders(this.orders);
   const nextClearing=regrowDebris(robbery?.clearing??this.clearing,nextClock.day,nextGarden,this.story.birdhouse,Math.random,[...nextTravel.estate.trees,...nextTravel.estate.pond,...salvageSites.filter(s=>!nextTravel.research.picked.includes(s.id))]);
   await this.store.save(snapshot(START,nextClock,nextGarden,nextEconomy,nextOrders,this.farmName,nextClearing,this.story,this.skill,this.farmerName,nextTravel));
   this.travel=nextTravel;this.thoughtRemaining=0;this.thought?.setVisible(false);this.thoughtBack?.clear();this.clearing=nextClearing;this.clock=nextClock;this.garden=nextGarden;this.redrawScenery();this.economy=nextEconomy;this.orders=nextOrders;this.actor.setPosition(START.x,START.y);this.actor.setAngle(0);this.body.setY(0);this.jumpRemaining=0;this.jumpCooldown=0;this.collapseRemaining=0;this.bubble.setVisible(false);this.nearby='';document.querySelector('#status')!.textContent='';this.shadow.setScale(1);this.drawGarden();this.aimAhead();
   this.warningAnimation?.cancel();this.warningAnimation=null;document.querySelector<HTMLElement>('#night-warning')!.hidden=true;
   document.querySelector<HTMLElement>('#sleep-shade')!.style.opacity='0';
   document.querySelector('#save-state')!.textContent='Mentve ebben a böngészőben';
   if(dialogue.open)dialogue.close();
   document.querySelector('#feedback')!.textContent='';this.feedbackUntil=this.time.now+2000;
   nextDayReady=true;
  }catch{
   this.collapseRemaining=0;this.actor.setAngle(0);document.querySelector<HTMLElement>('#sleep-shade')!.style.opacity='0';
   document.querySelector('#save-state')!.textContent='A napváltás nincs elmentve';
   showDialogue('Még nem sikerült menteni.','A következő napot nem kezdtem el. Próbáld újra a napzárást; a kert és a magok változatlanok.','MENTÉSI HIBA');
  document.querySelector<HTMLButtonElement>('#sleep')!.hidden=false;
  }finally{this.transitioning=false;this.lastTick=performance.now();}
  if(nextDayReady)void this.presentMorning();
 }

 private showPreviewEnd(){
  showDialogue('Itt tart most a történet.','Elérted a játék jelenlegi változatának végét. A következő napot egy későbbi frissítésben folytathatod. Köszönöm, hogy játszottál! 🙂','FOLYTATÁS KÖVETKEZIK');
  dialogue.dataset.presentation='development-end';document.querySelector<HTMLElement>('#preview-end-panel')!.hidden=false;document.querySelector<HTMLButtonElement>('#dialogue-close')!.hidden=true;document.querySelector<HTMLButtonElement>('#export-save')!.hidden=false;
 }
 private async finishSpringPreview(){
  this.transitioning=true;this.saveRevision++;release();const clock={...this.clock,elapsed:this.clock.collapseAt};
  try{
   await this.store.save(snapshot(this.actor,clock,this.garden,this.economy,this.orders,this.farmName,this.clearing,this.story,this.skill,this.farmerName,this.travel));this.clock=clock;
   this.collapseRemaining=0;this.actor.setAngle(0);this.body.setY(0);this.jumpRemaining=0;this.shadow.setScale(1);this.warningAnimation?.cancel();this.warningAnimation=null;document.querySelector<HTMLElement>('#night-warning')!.hidden=true;document.querySelector<HTMLElement>('#sleep-shade')!.style.opacity='0';document.querySelector('#save-state')!.textContent='Mentve ebben a böngészőben';this.showPreviewEnd();
  }catch{
   this.clock.elapsed=Math.min(this.clock.elapsed,this.clock.collapseAt-.001);this.collapseRemaining=0;this.actor.setAngle(0);document.querySelector<HTMLElement>('#sleep-shade')!.style.opacity='0';showDialogue('Még nem sikerült menteni.','A tavasz lezárását nem sikerült elmenteni. A farmod változatlan; próbáld újra.','MENTÉSI HIBA');document.querySelector<HTMLButtonElement>('#sleep')!.hidden=false;
  }finally{this.transitioning=false;this.lastTick=performance.now();}
 }
 private async saveMorningState(){
  try{await this.store.save(this.currentSnapshot());document.querySelector('#save-state')!.textContent='Mentve ebben a böngészőben';}
  catch{this.notice('Az értesítés állapotát nem sikerült menteni. Az aranyad és a reggeli elszámolás megmaradt.');}
 }
 private async presentMorning(){
  if(this.morningPlaying||(!this.travel.morning&&!this.travel.sale&&!this.travel.estate.duckArrivalPending))return;
  this.morningPlaying=true;this.transitioning=true;release();document.querySelector('#app')!.classList.add('morning-playing');
  this.shownGold=this.travel.sale?.beforeGold??this.economy.gold;
  try{
   if(this.travel.morning){
    const message=this.travel.morning,robbed=message.includes('kirabol');
    if(robbed){
     this.morningStage='reaction';void this.music.playSurprise();
     const jump=new Promise<void>(resolve=>this.tweens.add({targets:this.body,y:-24,duration:240,hold:100,yoyo:true,delay:180,ease:'Sine.easeOut',onComplete:()=>resolve()}));
     this.tweens.add({targets:this.shadow,scaleX:.75,scaleY:.75,duration:240,hold:100,yoyo:true,delay:180});
     await Promise.all([this.avatar.surprise(),jump]);this.avatar.equip(this.tool);
    }
    this.morningStage='loss';
    showDialogue(robbed?(message.includes('nem találtak nálam semmit')?'Éjszakai kaland…':'Valami hiányzik…'):'Új reggel a birtokon.',message,robbed?'ÉJSZAKAI TÖRTÉNÉS':'JÓ REGGELT');dialogue.dataset.presentation='loss';
    document.querySelector('#dialogue-close')!.textContent='Értem';
    await new Promise<void>(resolve=>dialogue.addEventListener('close',()=>resolve(),{once:true}));
    this.travel.morning=null;await this.saveMorningState();
   }
   if(this.travel.estate.duckArrivalPending)await this.presentDuckArrival();
   if(this.travel.sale){await this.presentIncome(this.travel.sale);this.travel.sale=null;await this.saveMorningState();}
   if(quantityTotal(this.orders.mailbox)>0)this.notice('Csomag vár a kapu melletti postaládában.');
  }finally{this.shownGold=null;this.morningStage='none';this.morningPlaying=false;this.transitioning=false;document.querySelector('#app')!.classList.remove('morning-playing');this.lastTick=performance.now();}
 }
 private async presentDuckArrival(){
  const nest=this.travel.estate.pond.find(p=>p.kind==='duckNest');if(!nest)return;
  this.morningStage='ducks';this.cameras.main.stopFollow().pan(nest.x,nest.y,550,'Sine.easeInOut');
  await new Promise<void>(resolve=>this.time.delayedCall(600,()=>resolve()));
  const birds=this.add.graphics().setDepth(150),motion={t:0};
  await new Promise<void>(resolve=>this.tweens.add({targets:motion,t:1,duration:2200,ease:'Sine.easeInOut',onUpdate:()=>{document.querySelector<HTMLElement>('#game')!.dataset.duckArrivalProgress=String(motion.t);birds.clear();for(let i=0;i<2;i++){const t=Phaser.Math.Clamp(motion.t-i*.07,0,1),x=nest.x-230*(1-t)+(i? -20:23),y=nest.y-100*(1-t)+(i?13:8)-Math.sin(t*Math.PI)*35;drawDuck(birds,x,y,i===0,Math.sin(t*48)*10);}},onComplete:()=>resolve()}));birds.destroy();this.estateArt?.destroy();this.estateArt=drawEstate(this,{...this.travel.estate,duckArrivalPending:false},this.clock.day);
  showDialogue('Új lakók a tónál!','Két vadkacsa talált rá a fészekre. Úgy látszik, megtetszett nekik ez a nyugodt kis zug. Jó reggelt, új szomszédok!','ÉLET A KERTBEN');document.querySelector('#dialogue-close')!.textContent='Isten hozott benneteket!';
  await new Promise<void>(resolve=>dialogue.addEventListener('close',()=>resolve(),{once:true}));this.travel.estate.duckArrivalPending=false;await this.saveMorningState();this.redrawScenery();this.fitCamera();
 }
 private async presentIncome(sale:MorningSale){
  this.morningStage='income';
  showDialogue('Tegnapi eladások','',`${calendarDay(sale.day,this.farmName)}. NAPI ELSZÁMOLÁS`);dialogue.dataset.presentation='income';document.querySelector<HTMLButtonElement>('#dialogue-close')!.hidden=false;document.querySelector('#dialogue-close')!.textContent='Indulhat a nap';
  const closed=new Promise<void>(resolve=>dialogue.addEventListener('close',()=>resolve(),{once:true}));
  const panel=document.querySelector<HTMLElement>('#morning-sale-panel')!;panel.replaceChildren();panel.hidden=false;
  const table=document.createElement('table');table.className='morning-sale-table';table.innerHTML='<thead><tr><th>Termény</th><th>Darab</th><th>Bevétel</th></tr></thead>';
  const body=document.createElement('tbody');
  for(const row of saleRows(sale)){const tr=document.createElement('tr'),item=document.createElement('td'),quantity=document.createElement('td'),value=document.createElement('td');item.append(itemIcon(row.crop),document.createTextNode(({...cropNames,...extraNames})[row.crop]));quantity.textContent=String(row.quantity);value.textContent=`${row.value} gold`;tr.append(item,quantity,value);body.append(tr);}
  if(!body.children.length){const row=document.createElement('tr'),cell=document.createElement('td');cell.colSpan=3;cell.className='morning-empty';cell.textContent='Tegnap nem tettél terményt az eladóládába.';row.append(cell);body.append(row);}table.append(body);const items=document.createElement('div');items.className='morning-sale-items';items.append(table);panel.append(items);
  const income=document.createElement('div');income.className='morning-income';income.innerHTML='<span>Tegnapi bevételed</span>';const total=document.createElement('strong');total.id='morning-income';total.textContent=`+${sale.total} gold`;income.append(total);
  const wallet=document.createElement('div');wallet.className='morning-wallet';wallet.innerHTML='<span>Az aranyad</span>';const balance=document.createElement('strong');balance.id='morning-balance';balance.dataset.start=String(sale.beforeGold);balance.dataset.target=String(sale.afterGold);balance.textContent=`${sale.beforeGold} gold`;wallet.append(balance);panel.append(income,wallet);
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  await new Promise<void>(resolve=>{
   let elapsed=0,last=performance.now(),launched=false;
   const tick=(now:number)=>{
    elapsed+=document.hidden?0:Math.min(80,now-last);last=now;
    const amount=displayedBalance(sale,elapsed,reduced);balance.textContent=`${amount} gold`;this.shownGold=amount;
    if(elapsed>=650&&!launched){launched=true;if(!reduced&&sale.total>0){total.animate([{transform:'translateY(0) scale(1)',opacity:1},{transform:'translateY(45px) scale(.7)',opacity:0}],{duration:1100,easing:'ease-in'});wallet.animate([{boxShadow:'0 0 0 0 #efcf7655'},{boxShadow:'0 0 24px 7px #efcf7655'},{boxShadow:'0 0 0 0 #efcf7600'}],{duration:1400});}}
    if(dialogue.open&&elapsed<(reduced?1800:3300)){requestAnimationFrame(tick);return;}resolve();
   };requestAnimationFrame(tick);
  });
  await closed;this.shownGold=sale.afterGold;
 }

 private inventoryTab(selected:'items'|'people'|'skills'|'goals'){
  const descriptions={goals:['Célok','A birtokon felfedezett feladatok és az elért eredményeid.'],items:['Készlet','A leszedett termények és a nálad lévő ültetőanyagok.'],people:['Ismerősök','Akikkel az új életed során megismerkedtél.'],skills:['Jártasságok','Amit a birtokon töltött napok során megtanultál.']};
  document.querySelector('#dialogue-title')!.textContent=descriptions[selected][0];document.querySelector('#dialogue-text')!.textContent=descriptions[selected][1];
  for(const id of ['items','people','skills','goals']){document.querySelector<HTMLElement>(`#${id}-page`)!.hidden=id!==selected;const tab=document.querySelector<HTMLButtonElement>(`#${id}-tab`)!;tab.setAttribute('aria-selected',String(id===selected));tab.tabIndex=id===selected?0:-1;}
 }
 private drawSkills(){
  const page=document.querySelector<HTMLElement>('#skills-page')!;page.replaceChildren();
  const card=document.createElement('article');card.className='skill-card';card.dataset.skill='gardening';
  const heading=document.createElement('h3');heading.append(itemIcon('hoe'),document.createTextNode('Kertészkedés'));
  const level=document.createElement('strong');level.className='skill-card-level';level.textContent=`${gardeningLevel(this.skill)}. szint`;
  const {current,required}=gardeningProgress(this.skill);
  const meter=document.createElement('progress');meter.max=required;meter.value=current;meter.setAttribute('aria-label',`Kertészkedés: haladás a ${this.skill.rewarded?3:2}. szintig`);
  const progress=document.createElement('p');progress.dataset.skillProgress='gardening';progress.textContent=this.skill.levelThreeRewarded?'Elérted a jelenleg elérhető legmagasabb, 3. szintet.':`${current} / ${required} tapasztalatpont · Még ${gardeningTarget(this.skill)-this.skill.xp} pont a ${this.skill.rewarded?3:2}. szintig.`;
  card.append(heading,level,meter,progress);page.append(card);
 }
 private openInventory(tab:'items'|'people'|'skills'|'goals'='items'){
  if(!this.ready||this.transitioning||this.fishThrowPlaying||this.collapseRemaining>0)return;
  showDialogue('Készlet','A leszedett termények és a nálad lévő ültetőanyagok.','NÁLAD VAN');
  for(const [selector,items,seeds] of [['inventory-produce',this.garden.produce,false],['inventory-seeds',this.garden.seeds,true]] as const){
   const grid=document.querySelector<HTMLElement>(`#${selector}`)!;grid.replaceChildren();
   for(const crop of crops){
    if(items[crop]===0)continue;
    const card=document.createElement('div');card.className=`inventory-card crop-${crop}`;card.dataset[seeds?'inventorySeed':'inventoryCrop']=crop;if(!seeds&&Object.prototype.hasOwnProperty.call(rewardFruits,crop))card.dataset.inventoryFruit=crop;
    const name=document.createElement('span');name.textContent=cropNames[crop]+(seeds?` · ${this.materialName(crop)}`:'');
    const amount=document.createElement('strong');amount.textContent=`${items[crop]} db`;card.append(seeds?seedIcon(crop):itemIcon(crop),name,amount);grid.append(card);
   }
  }
  const materials=document.querySelector<HTMLElement>('#inventory-materials')!;materials.replaceChildren();
  this.appendEstateInventory();this.appendResearchInventory();
  for(const [key,name]of [['wood','Fa'],['stone','Kő'],['weed','Gaz']] as const){if(this.clearing[key]===0)continue;const card=document.createElement('div');card.className='inventory-card';card.dataset.material=key;const label=document.createElement('span');label.textContent=name;const count=document.createElement('strong');count.textContent=`${this.clearing[key]} db`;card.append(itemIcon(key),label,count);materials.append(card);}
  if(this.story.giftReceived&&!this.story.birdhouse){const card=document.createElement('div');card.className='inventory-card';card.dataset.birdhouse='true';const label=document.createElement('span');label.textContent=this.story.birdhouse?'Madárodú · elhelyezve':'Madárodú · 1 db';card.append(itemIcon('birdhouse'),label);if(!this.story.birdhouse){const place=document.createElement('button');place.type='button';place.textContent='Elhelyezem';place.addEventListener('click',()=>{dialogue.close();this.selectTool('birdhouse');this.notice('Válassz egy közeli, szabad füves helyet, és kattints.');});card.append(place);}materials.append(card);}
  for(const id of ['inventory-produce','inventory-seeds','inventory-materials']){const grid=document.querySelector<HTMLElement>(`#${id}`)!;if(!grid.children.length){const empty=document.createElement('p');empty.className='inventory-empty';empty.textContent='Ebből most nincs nálad.';grid.append(empty);}}
  this.drawSkills();this.drawGoals();this.inventoryTab(tab);
  const people=document.querySelector<HTMLElement>('#people-page')!;people.replaceChildren();
  if(this.story.giftReceived||this.travel.metAnnie){const card=document.createElement('article');card.className='person-card';card.dataset.person='annie';const text=document.createElement('div');const name=document.createElement('h3');name.textContent='Annie';const description=document.createElement('p');description.textContent=this.story.giftReceived?'A kedves szomszéd, akitől a madárodút kaptad. A Kertitó Szaküzletben is találkozhatsz vele.':'Annie a Kertitó Szaküzletben dolgozik.';text.append(name,description);card.append(anniePortrait(this),text);people.append(card);}
  if(this.travel.metLeo){const card=document.createElement('article');card.className='person-card';card.dataset.person='leo';const text=document.createElement('div'),name=document.createElement('h3'),description=document.createElement('p');name.textContent='Leo';description.textContent='A faiskola barátságos kertésze. Facsemetéket gondoz, és szívesen mesél róluk.';text.append(name,description);card.append(leoPortrait(this),text);people.append(card);}
  if(!people.children.length)people.textContent='Hamarosan megismered a szomszédaidat.';
  document.querySelector<HTMLElement>('#inventory-panel')!.hidden=false;document.querySelector('#dialogue-close')!.textContent='Vissza a kertbe';
 }
 private drawMailFlag(){
  if(!this.mailFlag)return;this.mailFlag.clear();
  if(quantityTotal(this.orders.mailbox)>0){const m=farmLayout.mailbox;this.mailFlag.fillStyle(0xe7b55a);this.mailFlag.fillRect(m.x+m.w-3,m.y-10,3,13);this.mailFlag.fillRect(m.x+m.w,m.y-10,8,5);}
 }
 private nearObject(area:{x:number;y:number;w:number;h:number},distance=55){return Math.hypot(this.actor.x-area.x-area.w/2,this.actor.y-area.y-area.h/2)<=distance;}
 private async gatherForage(id:string){
  if(!this.canInteract())return;
  const bush=villageLayout.bushes.find(b=>b.id===id);if(!bush||Math.hypot(this.actor.x-bush.x,this.actor.y-bush.y)>45)return;
  if(!forageReady(this.travel,id,this.clock.day)){this.notice('A bokor most pihen. Két nap után újra szedhető.');return;}
  if(this.garden.produce.blueberry>=999999){this.notice('Ebből már nem fér több a készletbe.');return;}
  this.transitioning=true;this.saveRevision++;
  const travel=structuredClone(this.travel),garden=structuredClone(this.garden);travel.picked[id]=this.clock.day;garden.produce.blueberry++;
  try{await this.store.save(snapshot(this.actor,this.clock,garden,this.economy,this.orders,this.farmName,this.clearing,this.story,this.skill,this.farmerName,travel));this.travel=travel;this.garden=garden;this.redrawScenery();this.drawGarden();this.avatar.use(bush.x-this.actor.x,bush.y-this.actor.y,'hand');this.notice('+1 áfonya · A készletedbe került.');}
  catch{this.notice('A gyűjtögetést nem sikerült menteni. A bokor érintetlen maradt.');}
  finally{this.transitioning=false;this.lastTick=performance.now();}
 }
 private updateLocation(){
  const {x,y}=this.actor,shop=shopAt(y),region=inHome(y)?'home':inWorkshop(y)?'workshop':shop??(outsideFarm(y)?(x<315&&y<1200?'forest':'village'):'farm');document.querySelector<HTMLElement>('#game')!.dataset.region=region;
  document.querySelector('#location-label')!.textContent=region==='home'?'AZ OTTHONOD':region==='workshop'?'A RÉGI MŰHELY':region==='farm'?'AZ OTTHONOD':region==='forest'?'ERDEI ÖSVÉNY':shop==='nursery'?'FAISKOLA':shop==='fishShop'?'KERTITÓ SZAKÜZLET':'A FALU';
 }
 private fitCamera(){
  const shop=shopAt(this.actor.y);if(inHome(this.actor.y)){this.cameraRegion='home';this.cameras.main.setZoom(Math.max(this.scale.width/800,this.scale.height/600)).setBounds(0,HOME_ORIGIN,800,600).startFollow(this.actor,true,1,1);return;}if(inWorkshop(this.actor.y)){this.cameraRegion='workshop';this.cameras.main.setZoom(Math.max(this.scale.width/800,this.scale.height/600)).setBounds(0,WORKSHOP_ORIGIN,800,600).startFollow(this.actor,true,1,1);return;}this.cameraRegion=shop??'outside';this.cameras.main.setZoom(Math.max(this.scale.width/800,this.scale.height/600)).setBounds(shop?0:farmBounds.left,shop?shopOrigins[shop]:farmBounds.top,shop?800:farmBounds.right-farmBounds.left,shop?600:WORLD_HEIGHT-farmBounds.top).startFollow(this.actor,true,1,1);
 }
 private async travelTo(point:{x:number;y:number},greeting?:Shop){
  if(!this.canInteract())return;this.transitioning=true;this.saveRevision++;release();
  const nextTravel=structuredClone(this.travel),firstHome=inHome(point.y)&&!nextTravel.homeVisited;if(inHome(point.y))nextTravel.homeVisited=true;if(greeting==='fishShop')nextTravel.metAnnie=true;if(greeting==='nursery')nextTravel.metLeo=true;
  try{await this.store.save(snapshot(point,this.clock,this.garden,this.economy,this.orders,this.farmName,this.clearing,this.story,this.skill,this.farmerName,nextTravel));this.travel=nextTravel;this.actor.setPosition(point.x,point.y);this.fitCamera();this.nearby='';this.aimAhead();if(firstHome){this.thought.setText('Még elég üres. Idővel szeretném igazán otthonossá tenni.');this.thoughtRemaining=8;}}
  catch{this.notice('Most nem sikerült menteni az átlépést. Próbáld újra.');}
  finally{this.transitioning=false;this.lastTick=performance.now();if(greeting&&shopAt(this.actor.y)===greeting)this.inspectVillage(greeting);}
 }
 private homeNearby(){if(!inHome(this.actor.y))return '';if(Math.hypot(this.actor.x-400,this.actor.y-HOME_ORIGIN-500)<38)return 'home-exit';const object=homeObjects.find(o=>Math.hypot(this.actor.x-o.x,this.actor.y-o.y)<55);return object?`home:${object.id}`:'';}
 private interactHome(){const nearby=this.homeNearby();if(!nearby||!this.canInteract())return false;if(nearby==='home-exit'){void this.travelTo({x:farmLayout.houseDoor.x,y:274});return true;}const object=homeObjects.find(o=>`home:${o.id}`===nearby);if(object)showDialogue(object.title,object.text,'OTTHON');return true;}
 private enterShop(shop:Shop){if(!shopsOpen(this.clock.elapsed)){this.notice(`${shopNames[shop]} · Éjszaka zárva. Reggel újra várunk!`);return;}void this.travelTo({x:400,y:shopOrigins[shop]+467},shop);}
 private leaveShop(){const shop=shopAt(this.actor.y);if(shop){const door=villageLayout[shop].door;void this.travelTo({x:door.x,y:door.y+18});}}
 private inspectVillage(place:string){
  if(!this.canInteract())return;
  if((place==='nursery'||place==='fishShop')&&!shopsOpen(this.clock.elapsed)){this.notice('Az üzletek éjszakára bezártak. Reggel újra várnak!');return;}
  if((place==='nursery'||place==='fishShop')&&!shopAt(this.actor.y)){void this.enterShop(place);return;}
  if(place==='nursery'||place==='fishShop')this.openShop(place);
  if(place==='bench')showDialogue('Egy nyugodt pillanat.','Leülök egy kicsit a hűvös padra. Hallgatom a szökőkutat, és nézem, ahogy a fény megcsillan a leveleken. A labor zúgása most egészen távolinak tűnik.','A FALU TERE');
 }

 private async talkMerchant(shop:Shop){
  if(!this.canInteract()||!shopsOpen(this.clock.elapsed)||shopAt(this.actor.y)!==shop||!merchantNearby(shop,this.actor.x,this.actor.y))return;
  const key=shop==='nursery'?'metLeo':'metAnnie';if(!this.travel[key]){this.transitioning=true;this.saveRevision++;const travel=structuredClone(this.travel);travel[key]=true;try{await this.store.save(snapshot(this.actor,this.clock,this.garden,this.economy,this.orders,this.farmName,this.clearing,this.story,this.skill,this.farmerName,travel));this.travel=travel;}catch{this.notice('A találkozást nem sikerült menteni. Próbáljuk újra egy kicsit később.');return;}finally{this.transitioning=false;this.lastTick=performance.now();}}
  if(await this.researchMerchant(shop))return;
  const text=shop==='nursery'?'Jó látni, hogy új élet költözik a régi birtokra! Egy fának idő kell, míg megerősödik. Nekünk is szabad néha lassabban növekednünk.':this.story.giftReceived?(this.story.birdhouse?'Örülök, hogy helyet találtál a madárodúnak! Jó lesz hallgatni a kis lakók dalát — és közben a kertedre is vigyáznak.':'Remélem, hamar találsz egy kedves kis zugot a madárodúnak! A madarak dalával még otthonosabb lesz a birtokod, és a kertedre is vigyáznak majd.'):'Jó, hogy benéztél! Egy kis víz a kertben annyi életet vonz. Szeretem figyelni, ahogy lassan mindenki otthonra talál körülötte.';
  showDialogue(shop==='nursery'?'Leo':'Annie',text,'EGY KEDVES SZÓ');this.showSpeaker(shop);
 }
 private showSpeaker(shop:Shop){
  dialogue.dataset.speaker=shop==='nursery'?'leo':'annie';document.querySelector<HTMLElement>('#speaker')!.hidden=false;document.querySelector('#speaker-name')!.textContent=shop==='nursery'?'Leo':'Annie';document.querySelector('#speaker-portrait')!.replaceChildren(shop==='nursery'?leoPortrait(this):anniePortrait(this));
 }
 private openShop(shop:Shop,message=''){
  showDialogue(shopNames[shop],message||(shop==='nursery'?'Szia! Nézz körül a csemetéim között. Tavasszal ültetheted el őket; 15 nap alatt megnőnek, öntözés nélkül.':'Válassz valamit a tavadhoz! A vásárolt holmit rögtön a készletedbe teszem.'),shop==='nursery'?'LEO':'ANNIE');
  this.showSpeaker(shop);
  const panel=document.querySelector<HTMLElement>('#shop-panel')!;panel.replaceChildren();panel.hidden=false;
  const balance=document.createElement('p');balance.textContent=`Nálad: ${this.economy.gold} gold`;balance.setAttribute('role','status');panel.append(balance);
  for(const good of goods.filter(k=>shop==='nursery'?treeKinds.includes(k as typeof treeKinds[number]):!treeKinds.includes(k as typeof treeKinds[number]))){
   const card=document.createElement('article');card.className='shop-card';const text=document.createElement('div'),name=document.createElement('strong'),info=document.createElement('p');name.textContent=goodNames[good];
   const spec=treeKinds.includes(good as typeof treeKinds[number])?trees[good as typeof treeKinds[number]]:null;
   info.textContent=spec?`${seasons[spec.season]} · ${spec.yield} db / ${spec.repeat} nap · ${spec.sale} gold/db`:good==='duckNest'?'A kihelyezéstől 3 nap után két kacsa költözik ide; utána 4 naponta 2–4 tojás · 13 gold/db':good==='goldfish'||good==='carp'?'A tó 3 naponta közös ikraadagot ad.':good==='reed'?'Később kosárfonáshoz hasznosítható.':'Dekoráció a tó vizén.';
   text.append(name,info);const buy=document.createElement('button');buy.type='button';buy.dataset.buyGood=good;buy.textContent=`${goodPrices[good]} gold · Megveszem`;buy.disabled=this.economy.gold<goodPrices[good]||this.transitioning;buy.addEventListener('click',()=>void this.purchaseGood(shop,good));card.append(goodIcon(good),text,buy);panel.append(card);
  }
 }
 private async purchaseGood(shop:Shop,good:Good){
  if(!this.ready||this.transitioning||shopAt(this.actor.y)!==shop||!shopsOpen(this.clock.elapsed)||document.querySelector<HTMLElement>('#shop-panel')!.hidden)return;
  const purchase=buyGood(this.travel.estate,this.economy.gold,good,1,this.clock.day);if(!purchase)return;
  this.transitioning=true;this.saveRevision++;document.querySelectorAll<HTMLButtonElement>('[data-buy-good]').forEach(b=>b.disabled=true);
  const travel=structuredClone(this.travel),economy={...this.economy,gold:purchase.gold};travel.estate=purchase.estate;
  try{await this.store.save(snapshot(this.actor,this.clock,this.garden,economy,this.orders,this.farmName,this.clearing,this.story,this.skill,this.farmerName,travel));this.travel=travel;this.economy=economy;this.transitioning=false;this.openShop(shop,`${goodNames[good]} a készletedbe került. Tab → Készlet → Elhelyezem.`);}
  catch{this.transitioning=false;this.openShop(shop,'Nem sikerült menteni. Az aranyad és a készleted változatlan maradt.');}
  finally{this.transitioning=false;this.lastTick=performance.now();}
 }
 private appendEstateInventory(){
  const material=document.querySelector<HTMLElement>('#inventory-materials')!,produce=document.querySelector<HTMLElement>('#inventory-produce')!;
  for(const good of goods){const quantity=this.travel.estate.goods[good];if(!quantity)continue;const card=document.createElement('div');card.className='inventory-card';card.dataset.good=good;const name=document.createElement('span');name.textContent=`${goodNames[good]} · ${quantity} db`;const place=document.createElement('button');place.type='button';place.dataset.placeGood=good;place.textContent='Elhelyezem';place.addEventListener('click',()=>{dialogue.close();this.selectTool('hand');this.placing=good;this.notice('Válassz közeli helyet a farmon. Másik szerszámmal megszakíthatod az elhelyezést.');});card.append(goodIcon(good),name,place);material.append(card);}
  for(const k of extras){const n=this.travel.estate.produce[k];if(!n)continue;const card=document.createElement('div');card.className='inventory-card';card.dataset.extra=k;const label=document.createElement('span');label.textContent=`${extraNames[k]} · ${n} db · ${extraPrices[k]} gold/db`;card.append(itemIcon(k),label);produce.querySelector('.inventory-empty')?.remove();produce.append(card);}
 }
 private estateLand(x:number,y:number){
  return x>farmBounds.left+40&&x<farmBounds.right-40&&y>farmBounds.top+48&&y<565&&!blocked(x,y)&&!debrisAt(this.clearing,this.garden,x,y)&&![...this.garden.plots.keys()].some(key=>{const [px,py]=key.split(',').map(Number);return Math.hypot(px+8-x,py+8-y)<40;})&&!(this.story.birdhouse&&Math.hypot(x-this.story.birdhouse.x,y-this.story.birdhouse.y)<40)&&!farmLayout.paths.some(path=>path.points.slice(1).some((b,i)=>{const a=path.points[i],dx=b[0]-a[0],dy=b[1]-a[1],t=Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/(dx*dx+dy*dy)));return Math.hypot(x-a[0]-t*dx,y-a[1]-t*dy)<path.width/2+24;}));
 }
 private async commitEstate(estate:Estate,message:string){
  this.transitioning=true;this.saveRevision++;const travel=structuredClone(this.travel);travel.estate=estate;
  try{await this.store.save(snapshot(this.actor,this.clock,this.garden,this.economy,this.orders,this.farmName,this.clearing,this.story,this.skill,this.farmerName,travel));this.travel=travel;this.redrawScenery();this.notice(message);return true;}
  catch{this.notice('Nem sikerült menteni. A készleted változatlan maradt.');return false;}
  finally{this.transitioning=false;this.lastTick=performance.now();}
 }
 private async placeEstateGood(){
  if(!this.target||!this.placing||!this.canInteract())return;const x=this.target.x+8,y=this.target.y+8,good=this.placing;
  if(Math.hypot(x-this.actor.x,y-this.actor.y)>90||this.actor.y>=600){this.notice('Sétálj közelebb a kiválasztott farmbeli helyhez.');return;}
  const next=placeGood(this.travel.estate,good,x,y,this.clock.day,this.estateLand(x,y),this.farmName);
  if(!next){this.notice(treeKinds.includes(good as typeof treeKinds[number])&&seasonIndex(calendarDay(this.clock.day,this.farmName))!==0?'Facsemetét tavasszal ültethetsz.':'Itt nincs megfelelő szabad hely. A halak és tavi növények a vízbe, a fészek a száraz tópartra kerül.');return;}
  if(good==='goldfish'||good==='carp'){
   this.fishThrowPlaying=true;
   try{if(await this.commitEstate(next,`${goodNames[good]} a tóba került!`)){if(!next.goods[good])this.placing=null;const visual=structuredClone(next);visual.fish[good]--;this.estateArt?.destroy();this.estateArt=drawEstate(this,visual,this.clock.day);this.avatar.throwFish(x-this.actor.x);await this.pondLife.throwFish(this.actor,{x,y},good==='goldfish');this.redrawScenery();}}
   finally{this.fishThrowPlaying=false;}
  }else if(await this.commitEstate(next,`${goodNames[good]} a helyén!`)){if(!next.goods[good])this.placing=null;}
 }
 private async gatherEstate(){if(!this.canInteract())return;const next=collectEstate(this.travel.estate,this.actor.x,this.actor.y,this.clock.day);if(next)await this.commitEstate(next,'Begyűjtve! A termés a készletedbe került.');}

 private canInteract(){return this.ready&&!dialogue.open&&!this.transitioning&&!this.fishThrowPlaying&&!this.avatar.isWorking()&&!springPreviewComplete(this.clock,this.farmName)&&this.collapseRemaining<=0&&this.jumpRemaining<=0;}
 private materialName(crop:string){return crop==='potato'?'vetőgumó':crop==='strawberry'?'palánta':['honeyberry','blueberry'].includes(crop)?'csemete':'mag';}
 private openCatalog(){
  if(!this.canInteract())return;if(!this.nearObject(farmLayout.catalog)){this.notice('Sétálj a ház jobb oldali ablaka melletti magkatalógushoz.');return;}
  showDialogue('Mit ültessünk legközelebb?','A rendelés árát most fizeted ki. A magok másnap reggel a postaládába érkeznek.','MAGKATALÓGUS');
  const rows=document.querySelector<HTMLElement>('#catalog-rows')!;rows.replaceChildren();
  for(const crop of crops){
   if(!unlockedSeeds(this.skill).includes(crop))continue;
   const label=document.createElement('label');label.className='catalog-row';label.textContent=`${cropNames[crop]} · ${this.materialName(crop)} · ${seedPrices[crop]} gold/db`;
   const input=document.createElement('input');input.type='number';input.min='0';input.max='999999';input.step='1';input.value='0';input.dataset.orderCrop=crop;input.setAttribute('aria-label',`${cropNames[crop]} rendelési mennyiség`);input.addEventListener('input',()=>this.updateCart());label.prepend(seedIcon(crop));label.append(input);rows.append(label);
  }
  this.updateCart();document.querySelector<HTMLElement>('#catalog-panel')!.hidden=false;
 }
 private readCart(){const cart=emptyQuantities();for(const crop of crops)cart[crop]=document.querySelector<HTMLInputElement>(`[data-order-crop="${crop}"]`)?.valueAsNumber??0;return cart;}
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
   await this.store.save(snapshot(this.actor,this.clock,this.garden,purchase.economy,purchase.orders,this.farmName,this.clearing,this.story,this.skill,this.farmerName,this.travel));
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
   const label=document.createElement('span');label.textContent=`${cropNames[crop]} · ${this.materialName(crop)}: ${this.orders.mailbox[crop]} db`;card.append(seedIcon(crop),label);content.append(card);
  }}else content.textContent=quantityTotal(this.orders.pending)>0?'A rendelésed úton van, holnap reggel érkezik.':'Most nincs csomag a postaládában.';
  document.querySelector<HTMLButtonElement>('#collect-package')!.hidden=count===0;
  document.querySelector<HTMLElement>('#mailbox-panel')!.hidden=false;
 }
 private async collectMail(){
  if(!this.ready||this.transitioning||document.querySelector<HTMLElement>('#mailbox-panel')!.hidden)return;
  const collected=collectPackage(this.garden,this.orders);if(!collected)return;
  this.transitioning=true;this.saveRevision++;document.querySelector<HTMLButtonElement>('#collect-package')!.disabled=true;
  try{
   await this.store.save(snapshot(this.actor,this.clock,collected.garden,this.economy,collected.orders,this.farmName,this.clearing,this.story,this.skill,this.farmerName,this.travel));
   this.garden=collected.garden;this.orders=collected.orders;this.drawGarden();document.querySelector('#save-state')!.textContent='Mentve ebben a böngészőben';
   showDialogue('A csomag átvéve.','Az ültetőanyagok bekerültek a készletedbe.','POSTALÁDA');
  }catch{document.querySelector('#save-state')!.textContent='Az átvételt nem sikerült menteni';document.querySelector('#mailbox-content')!.textContent='Nem sikerült menteni. A csomag megmaradt a postaládában; próbáld újra.';}
  finally{this.transitioning=false;this.lastTick=performance.now();document.querySelector<HTMLButtonElement>('#collect-package')!.disabled=false;}
 }
 private renderShipping(){
  const focused=(document.activeElement as HTMLElement)?.dataset.item;
  for(const [id,items,from] of [['shipping-crate',{...this.economy.shipping,...this.travel.estate.shipping},'crate'],['shipping-inventory',{...this.garden.produce,...this.travel.estate.produce},'inventory']] as const){
   const grid=document.querySelector<HTMLElement>(`#${id}`)!;grid.replaceChildren();
   const present=[...crops,...extras].filter(c=>items[c]>0);
   for(const crop of present){
    const slot=document.createElement('button');slot.type='button';slot.className='item-slot';slot.draggable=true;slot.dataset.item=`${from}-${crop}`;
    slot.title=`${({...cropNames,...extraNames})[crop]} · ${items[crop]} db · ${{...salePrices,...extraPrices}[crop]} gold/db`;slot.setAttribute('aria-label',`${({...cropNames,...extraNames})[crop]}: ${items[crop]} db, ${from==='crate'?'visszavétel':'eladásra tesz'}`);
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
     if(!data||![...crops,...extras].includes(data.crop)||!['inventory','crate'].includes(data.from)||data.from===from)return;
     const crop=data.crop as typeof crops[number]|Extra,quantity=data.from==='inventory'?{...this.garden.produce,...this.travel.estate.produce}[crop]:{...this.economy.shipping,...this.travel.estate.shipping}[crop];this.moveShipping(crop,data.from,quantity);
    }catch{/* Ignore unrelated drag payloads. */}
   };
  }
  document.querySelector('#shipping-total')!.textContent=`Reggel érkezik: ${shippingValue(this.economy.shipping)+extraValue(this.travel.estate.shipping)} gold`;
  if(focused){const next=document.querySelector<HTMLButtonElement>(`[data-item="${focused}"]`)??document.querySelector<HTMLButtonElement>('.item-slot');next?.focus({preventScroll:true});}
 }
 private moveShipping(crop:typeof crops[number]|Extra,from:'inventory'|'crate',amount:number){
  if(!this.ready||this.transitioning||this.collapseRemaining>0||document.querySelector<HTMLElement>('#shipping-panel')!.hidden)return;
  if(extras.includes(crop as Extra)){const k=crop as Extra,source=from==='inventory'?this.travel.estate.produce:this.travel.estate.shipping,dest=from==='inventory'?this.travel.estate.shipping:this.travel.estate.produce;if(Number.isSafeInteger(amount)&&amount>0&&source[k]>=amount&&dest[k]+amount<=999999){source[k]-=amount;dest[k]+=amount;this.renderShipping();void this.persist();}return;}
  if(transferProduce(this.garden,this.economy,crop as typeof crops[number],amount,from==='inventory'?'deposit':'withdraw')){this.renderShipping();this.drawGarden();void this.persist();}
 }
 private openShipping(){
  if(!this.ready||dialogue.open||this.transitioning||this.collapseRemaining>0||this.jumpRemaining>0)return;
  const box=farmLayout.shipping;
  if(Math.hypot(this.actor.x-(box.x+box.w/2),this.actor.y-(box.y+box.h/2))>55){this.notice('Sétálj a veranda bal oldalán lévő eladóládához.');return;}
  showDialogue('Eladóláda','Tedd be, amit el szeretnél adni. Napzárásig visszaveheted.','ELADÓLÁDA');
  this.renderShipping();document.querySelector<HTMLElement>('#shipping-panel')!.hidden=false;
 }
 private selectTool(tool:FarmTool){
  if(crops.includes(tool as typeof crops[number])&&this.garden.seeds[tool as typeof crops[number]]===0){this.notice('Ebből az ültetőanyagból most nincs nálad.');return;}
  if(tool==='wildflower'&&!this.travel.research.seeds)return;this.placing=null;this.tool=tool;this.avatar?.equip(tool==='wildflower'?'radish':tool);
  document.querySelector<HTMLButtonElement>(`#toolbar [data-tool="${tool}"]`)?.scrollIntoView({block:'nearest',inline:'nearest'});
  document.querySelectorAll<HTMLButtonElement>('#toolbar [data-tool]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.tool===tool)));
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
  this.drawMailFlag();this.redrawResearch();
  const surface=document.querySelector<HTMLElement>('#game')!;
  surface.dataset.plots=String(this.garden.plots.size);surface.dataset.planted=String([...this.garden.plots.values()].filter(p=>p.crop).length);surface.dataset.watered=String([...this.garden.plots.values()].filter(p=>p.watered).length);surface.dataset.ripe=String([...this.garden.plots.values()].filter(p=>isRipe(p)).length);surface.dataset.produce=String(Object.values(this.garden.produce).reduce((a,b)=>a+b,0));
  for(const crop of crops){document.querySelector(`[data-count="${crop}"]`)!.textContent=String(this.garden.seeds[crop]);document.querySelector<HTMLButtonElement>(`#toolbar [data-tool="${crop}"]`)!.hidden=this.garden.seeds[crop]===0;}
  if(crops.includes(this.tool as typeof crops[number])&&this.garden.seeds[this.tool as typeof crops[number]]===0)this.selectTool('hoe');
 }
 private async saveStory(next:FarmStory,after:()=>void){
  if(this.transitioning)return;this.transitioning=true;this.saveRevision++;
  try{await this.store.save(snapshot(this.actor,this.clock,this.garden,this.economy,this.orders,this.farmName,this.clearing,next,this.skill,this.farmerName,this.travel));this.story=next;document.querySelector('#save-state')!.textContent='Mentve ebben a böngészőben';after();}
  catch{this.eventRetry=5;this.notice('Az eseményt nem sikerült menteni. Próbáljuk újra egy kicsit később.');}
  finally{this.transitioning=false;this.lastTick=performance.now();}
 }
 private async receiveGift(){
  if(!this.canInteract()||this.story.giftReceived||!this.neighbor||Math.hypot(this.actor.x-this.neighbor.x,this.actor.y-this.neighbor.y)>55)return;
  await this.saveStory({...this.story,giftReceived:true},()=>{
   showDialogue('Egy kedves szomszéd, Annie.','Szia, Annie vagyok, a szomszédod! Gondoltam, benézek, hogy megy a berendezkedés. Hoztam neked egy madárodút. A madarak nemcsak dalolnak: a kártevőket is segítenek távol tartani.\n\nVálassz neki egy szép helyet a farmon!\n\nA madárodú bekerült a készletedbe. Tab → Alapanyagok → Madárodú → Elhelyezem.','ÜDV A SZOMSZÉDBAN');
   this.neighbor?.destroy();this.neighbor=null;this.neighborArt=null;
  });
 }
 private canPlaceBirdhouse(x:number,y:number){
  return this.story.giftReceived&&!this.story.birdhouse&&!this.travel.estate.trees.some(t=>Math.hypot(t.x-x,t.y-y)<40)&&!this.travel.estate.pond.some(p=>Math.hypot(p.x-x,p.y-y)<28)&&!blocked(x,y)&&y>farmBounds.top+48&&x>farmBounds.left+40&&x<farmBounds.right-40&&y<570&&Math.hypot(x-this.actor.x,y-this.actor.y)<=60&&!debrisAt(this.clearing,this.garden,x,y)&&![...this.garden.plots.keys()].some(key=>{const [px,py]=key.split(',').map(Number);return Math.abs(px+8-x)<22&&Math.abs(py+8-y)<22;});
 }
 private async placeBirdhouse(){
  if(!this.canInteract()||!this.target)return;const {x,y}=this.target,point={x:x+8,y:y+8};
  if(!this.canPlaceBirdhouse(point.x,point.y)){this.notice('Válassz egy közeli, szabad helyet a kertben.');return;}
  await this.saveStory({...this.story,birdhouse:point},()=>{this.redrawScenery();this.selectTool('hand');this.notice('Az odú a helyén! Remélem, hamar beköltöznek a madarak.');});
 }
 private updateVisit(dt:number){
  this.eventRetry=Math.max(0,this.eventRetry-dt);
  if(!this.story.giftReceived&&this.clock.elapsed>=2&&this.clock.elapsed<360){
   if(!this.neighbor){this.neighbor=this.add.container(170,510).setDepth(95);this.neighborArt=new FarmerArt(this,true);this.neighborArt.equip('none');this.neighbor.add(this.add.ellipse(0,0,21,7,0x35442e,.25));this.neighbor.add(this.neighborArt.root);const zone=this.add.zone(0,-20,27,49).setInteractive({useHandCursor:true});this.neighbor.add(zone);zone.on('pointerdown',()=>void this.receiveGift());this.neighborStep=0;}
   const route=[[168,500],[207,404],[249,328],[215,275]];const target=route[this.neighborStep];
   if(target){const dx=target[0]-this.neighbor.x,dy=target[1]-this.neighbor.y,distance=Math.hypot(dx,dy),step=Math.min(distance,dt*58);if(distance<2)this.neighborStep++;else{this.neighbor.x+=dx/distance*step;this.neighbor.y+=dy/distance*step;}this.neighborArt?.update(true,false,{x:dx,y:dy},dt);}
   else{this.neighborArt?.update(false,false,{x:0,y:1},dt);if(!this.eventRetry&&Math.hypot(this.actor.x-this.neighbor.x,this.actor.y-this.neighbor.y)<=55)void this.receiveGift();}
  }
  if(this.story.giftReceived&&this.clock.day>=2&&!this.story.morningSeen&&!this.eventRetry&&!this.transitioning){
   void this.saveStory({...this.story,morningSeen:true},()=>{this.thought.setText(this.story.birdhouse?'De jó! A madarak is segítenek.':'De jó! Kiteszem a madárodút.');this.thoughtRemaining=8;});
  }
 }
 private showNightWarning(message:string){
  const el=document.querySelector<HTMLElement>('#night-warning')!;this.warningAnimation?.cancel();el.hidden=false;el.textContent=message;
  const travel=el.offsetTop+el.offsetHeight+8;
  const animation=el.animate([{transform:'translate(-50%, 0)',opacity:1,offset:0},{transform:'translate(-50%, 0)',opacity:1,offset:.3},{opacity:1,offset:.85},{transform:`translate(-50%, -${travel}px)`,opacity:0,offset:1}],{duration:8000,easing:'ease-in-out',fill:'forwards'});
  this.warningAnimation=animation;void animation.finished.then(()=>{if(this.warningAnimation===animation){el.hidden=true;animation.cancel();this.warningAnimation=null;}}).catch(()=>{});
 }
 private showGardening(previous:number){
  this.skillUntil=performance.now()+5000;document.querySelector<HTMLElement>('#gardening-skill')!.hidden=false;
  const {current,required}=gardeningProgress(this.skill);
  const fill=document.querySelector<HTMLElement>('#skill-fill')!,track=document.querySelector<HTMLElement>('.skill-track')!,count=document.querySelector<HTMLElement>('#skill-xp')!,gain=document.querySelector<HTMLElement>('#skill-gain')!;
  fill.style.height=`${current/required*100}%`;
  track.setAttribute('aria-valuenow',String(current));track.setAttribute('aria-valuemax',String(required));track.setAttribute('aria-label',this.skill.levelThreeRewarded?'Kertészkedés: a 3. szint elérve':`Haladás a ${this.skill.rewarded?3:2}. szint felé`);
  document.querySelector('#skill-level')!.textContent=`${gardeningLevel(this.skill)}. szint`;
  count.textContent=`${current} / ${required}`;
  for(const element of [count,track,gain])for(const animation of element.getAnimations())animation.cancel();
  gain.hidden=true;
  if(this.skill.xp>previous){
   const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
   count.animate(reduced?[{opacity:.5},{opacity:1}]:[{transform:'translateY(0) scale(1)'},{transform:'translateY(-4px) scale(1.25)',offset:.4},{transform:'translateY(0) scale(1)'}],{duration:460,easing:'ease-out'});
   if(!reduced)track.animate([{transform:'translateX(0)'},{transform:'translateX(-2px)'},{transform:'translateX(2px)'},{transform:'translateX(-1px)'},{transform:'translateX(0)'}],{duration:300});
   gain.hidden=false;gain.textContent=`+${this.skill.xp-previous}`;
   const animation=gain.animate(reduced?[{opacity:1},{opacity:0}]:[{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(-14px)'}],{duration:1000,fill:'forwards'});void animation.finished.then(()=>{gain.hidden=true;}).catch(()=>{});
  }
  if(previous<LEVEL_TWO_XP&&this.skill.xp===LEVEL_TWO_XP)this.showGardeningCelebration();
  if(previous<LEVEL_THREE_XP&&this.skill.xp===LEVEL_THREE_XP)this.showGardeningCelebration(3);
 }
 private showGardeningCelebration(level:2|3=2){
   showDialogue(`Kertészkedés · ${level}. szint`,'A gondoskodásod meghozta a gyümölcsét! Új növényekkel gazdagíthatod a kertedet.','SZINTET LÉPTÉL!');
   const panel=document.querySelector<HTMLElement>('#level-reward-panel')!;panel.replaceChildren();panel.hidden=false;
   const petals=document.createElement('div');petals.className='reward-petals';petals.setAttribute('aria-hidden','true');
   for(let i=0;i<18;i++){const petal=document.createElement('i');petal.style.setProperty('--left',`${i*37%100}%`);petal.style.setProperty('--delay',`${-i*.47}s`);petal.style.setProperty('--duration',`${5+i%4}s`);petals.append(petal);}panel.append(petals);
   const gifts=document.createElement('div');gifts.className='reward-gifts';
   for(const fruit of Object.keys(level===2?rewardFruits:levelThreeSeeds) as (RewardFruit|LevelThreeSeed)[]){const gift=document.createElement('div');gift.append(seedIcon(fruit));const label=document.createElement('strong');label.textContent=`4 × ${cropNames[fruit]}`;const kind=document.createElement('span');kind.textContent=this.materialName(fruit);gift.append(label,kind);gifts.append(gift);}panel.append(gifts);
   const hint=document.createElement('p');hint.textContent='Az ültetőanyagokat már kiválaszthatod az alsó eszközsoron. A magkatalógusból is rendelhetsz belőlük.';panel.append(hint);
   document.querySelector('#dialogue-close')!.textContent='Irány a kert!';

 }
 private showSeedFind(found:NonNullable<ReturnType<typeof findSeeds>>){
  if(dialogue.open){dialogue.addEventListener('close',()=>this.showSeedFind(found),{once:true});return;}
  const toast=document.querySelector<HTMLElement>('#seed-find')!;this.seedFindAnimation?.cancel();toast.replaceChildren();toast.hidden=false;
  const petals=document.createElement('div');petals.className='reward-petals';petals.setAttribute('aria-hidden','true');for(let i=0;i<6;i++){const petal=document.createElement('i');petal.style.setProperty('--left',`${i*19}%`);petal.style.setProperty('--delay',`${-i*.7}s`);petal.style.setProperty('--duration','4s');petals.append(petal);}
  const text=document.createElement('div');const title=document.createElement('strong');title.textContent='Ültetőanyagot találtál!';const detail=document.createElement('span');detail.textContent=`+${found.amount} ${cropNames[found.crop]} · ${this.materialName(found.crop)}`;text.append(title,detail);toast.append(petals,seedIcon(found.crop),text);
  const animation=toast.animate([{opacity:0,transform:'translate(-50%, 8px)',offset:0},{opacity:1,transform:'translate(-50%, 0)',offset:.08},{opacity:1,offset:.85},{opacity:0,transform:'translate(-50%, -8px)',offset:1}],{duration:4800,fill:'forwards'});this.seedFindAnimation=animation;void animation.finished.then(()=>{if(this.seedFindAnimation===animation){toast.hidden=true;animation.cancel();this.seedFindAnimation=null;}}).catch(()=>{});
 }
 private wildflowerIcon(){const icon=document.createElement('span');icon.className='research-icon';icon.setAttribute('aria-hidden','true');icon.textContent='✿';return icon;}
 private redrawResearch(){
  this.researchArt?.destroy();this.researchArt=drawResearch(this,this.travel.research);this.workshopArt?.destroy();this.workshopArt=drawWorkshop(this,this.travel.research);
  const button=document.querySelector<HTMLButtonElement>('#toolbar [data-tool="wildflower"]');if(button){button.hidden=!this.travel.research.seeds;button.querySelector('[data-count]')!.textContent=String(this.travel.research.seeds);}
  if(this.tool==='wildflower'&&!this.travel.research.seeds)this.selectTool('hoe');
 }
 private drawGoals(){
  const page=document.querySelector<HTMLElement>('#goals-page')!;page.replaceChildren();
  for(const q of questEntries(this.travel.research,this.garden,this.clock.day,this.clock.elapsed)){
   const card=document.createElement('article');card.className=`quest-card${q.done?' completed':''}`;card.dataset.quest=q.id;
   const mark=document.createElement('span');mark.className='quest-mark';mark.setAttribute('aria-label',q.done?'Teljesítve':'Folyamatban');mark.textContent=q.done?'✓':'–';
   const text=document.createElement('div'),heading=document.createElement('h3'),detail=document.createElement('p');heading.textContent=q.title;detail.textContent=q.detail;text.append(heading);if(q.detail)text.append(detail);card.append(mark,text);page.append(card);
  }
 }
 private updateResearchGoal(){
  const el=document.querySelector<HTMLElement>('#quest-tracker')!,r=this.travel.research;
  const active=questEntries(r,this.garden,this.clock.day,this.clock.elapsed).filter(q=>!q.done);
  el.hidden=this.choosingFarm||dialogue.open||!this.ready||!active.length;
  const lines=active.map(q=>`• ${q.title}${q.detail?'\n'+q.detail:''}`);
  const materials:string[]=[];
  if(r.discovered&&!r.repaired)for(const [k,n]of Object.entries(repairNeeds)){const held=k==='wood'?this.clearing.wood:k==='stone'?this.clearing.stone:r.materials[k as keyof Research['materials']];materials.push(`• ${k==='wood'?'Fa':k==='stone'?'Kő':researchNames[k as keyof Research['materials']]}: ${Math.min(held,n)} / ${n}`);}
  if(materials.length)lines.push(materials.join('\n'));
  const text=lines.join('\n\n');if(el.dataset.content!==text){el.dataset.content=text;el.replaceChildren();for(const q of active){const line=document.createElement('p');line.className='hud-quest';const bullet=document.createElement('span');bullet.className='quest-bullet';bullet.textContent='•';bullet.setAttribute('aria-hidden','true');line.append(bullet,document.createTextNode(`${q.title}${q.detail?'\n'+q.detail:''}`));el.append(line);}if(materials.length){const list=document.createElement('ul');list.className='quest-material-list';for(const item of materials){const row=document.createElement('li');row.textContent=item.slice(2);list.append(row);}el.append(list);}}
  const game=document.querySelector<HTMLElement>('#game')!;game.dataset.researchStage=r.repaired?'repaired':r.discovered?'repair':r.key?'workshop':r.observation?'report':r.gifted?'flowers':'waiting';game.dataset.calendarDay=String(calendarDay(this.clock.day,this.farmName));game.dataset.shutter=String(r.shutter);game.dataset.entranceShutter=String(entranceShutterOpen(r));game.dataset.clearedWebs=String(r.clearedWebs?.length??0);
 }
 private async commitResearch(research:Research,wood=this.clearing.wood,stone=this.clearing.stone){
  if(this.transitioning)return false;this.transitioning=true;this.saveRevision++;const travel=structuredClone(this.travel);travel.research=research;const clearing={...this.clearing,wood,stone};
  try{await this.store.save(snapshot(this.actor,this.clock,this.garden,this.economy,this.orders,this.farmName,clearing,this.story,this.skill,this.farmerName,travel));this.travel=travel;this.clearing=clearing;this.redrawResearch();this.actor.setAlpha(1);return true;}
  catch{this.notice('Nem sikerült menteni. Próbáld újra; a készleted változatlan maradt.');return false;}
  finally{this.transitioning=false;this.lastTick=performance.now();}
 }
 private async plantWildflower(){
  if(!this.canInteract()||!this.target)return;const target={...this.target},research=plantFlower(this.travel.research,this.garden,target,this.actor);if(!research){this.notice('Üres, felkapált földbe ültesd a vadvirágmagot, közelről.');return;}
  const skill=gainGardening(this.skill,`plant:${this.clock.day}:${target.x},${target.y}`)??this.skill,garden=structuredClone(this.garden),travel=structuredClone(this.travel);travel.research=research;
  if(!this.skill.rewarded&&skill.rewarded)for(const fruit of Object.keys(rewardFruits) as RewardFruit[])garden.seeds[fruit]+=4;
  if(!this.skill.levelThreeRewarded&&skill.levelThreeRewarded)for(const crop of Object.keys(levelThreeSeeds) as LevelThreeSeed[])garden.seeds[crop]+=4;
  this.transitioning=true;this.saveRevision++;
  try{await this.store.save(snapshot(this.actor,this.clock,garden,this.economy,this.orders,this.farmName,this.clearing,this.story,skill,this.farmerName,travel));const before=this.skill.xp;this.travel=travel;this.skill=skill;this.garden=garden;this.avatar.use(target.x+8-this.actor.x,target.y+8-this.actor.y,'radish');this.drawGarden();this.showGardening(before);this.notice('Vadvirág elültetve. Négy megöntözött nap alatt virágzik ki.');}
  catch(error){console.error('Vadvirág ültetése',error);this.notice('Az ültetést nem sikerült menteni. A mag megmaradt.');}finally{this.transitioning=false;this.lastTick=performance.now();}
 }
 private appendResearchInventory(){
  const r=this.travel.research,materials=document.querySelector<HTMLElement>('#inventory-materials')!;
  const card=(name:string,quantity:number,icon:string)=>{const el=document.createElement('div');el.className='inventory-card';const drawn=icon==='scrap'||icon==='workshopKey'||icon==='copperPipe'||icon==='linenCloth'||icon==='glassJar';const image=drawn?itemIcon(icon):document.createElement('span');if(!drawn){image.setAttribute('class','research-icon');image.textContent=icon;}const label=document.createElement('span');label.textContent=`${name} · ${quantity} db`;el.append(image,label);return el;};
  if(r.seeds){const el=card('Vadvirágmag',r.seeds,'✿'),button=document.createElement('button');button.type='button';button.textContent='Elültetem';button.onclick=()=>{dialogue.close();this.selectTool('wildflower');};el.append(button);document.querySelector('#inventory-seeds')!.append(el);}
  for(const k of researchMaterials)if(r.materials[k])materials.append(card(researchNames[k],r.materials[k],{scrap:'scrap',copper:'copperPipe',glass:'glassJar',linen:'linenCloth'}[k]));
  if(r.key)materials.append(card('Melléképület kulcsa',1,'workshopKey'));
 }
 private researchNearby(){
  const r=this.travel.research,near=(x:number,y:number,d=48)=>Math.hypot(this.actor.x-x,this.actor.y-y)<d;
  if(inWorkshop(this.actor.y)){
   if(near(400,3500,38))return 'workshop-exit';
   const web=remainingWebs(r).filter(w=>near(w.x,w.y,50)).sort((a,b)=>Math.hypot(this.actor.x-a.x,this.actor.y-a.y)-Math.hypot(this.actor.x-b.x,this.actor.y-b.y))[0];if(web)return `cobweb:${web.id}`;
   const object=workshopObjects.filter(o=>workshopLit(r)||o.id==='shutter'&&!r.shutter||o.id==='entrance-shutter'&&!entranceShutterOpen(r)).map(o=>({o,d:Math.hypot(this.actor.x-o.x,this.actor.y-o.y)})).sort((a,b)=>a.d-b.d)[0];
   return object&&object.d<76?`examine:${object.o.id}`:'';
  }
  if(this.leoVisitor&&near(this.leoVisitor.x,this.leoVisitor.y,55)&&!r.gifted)return 'leo-visit';
  const anchor=beeAnchor(r);if(anchor&&beeAvailable(r,this.clock.day,this.clock.elapsed)&&near(anchor.x,anchor.y,55))return 'observe-bee';
  const salvage=salvageSites.find(s=>!r.picked.includes(s.id)&&near(s.x,s.y,50));if(salvage)return `salvage:${salvage.id}`;
  return '';
 }
 private researchHint(){const n=this.nearby;if(n.startsWith('cobweb:'))return 'Pókháló · Kézzel leszedhető · E / F';if(n==='leo-visit')return 'Leo · Beszélgetés · E / F';if(n==='observe-bee')return 'Szarvas faliméh · Megfigyelés · E / F';if(n==='workshop-exit')return 'Vissza a kertbe · E / F';if(n.startsWith('examine:'))return `${workshopObjects.find(o=>o.id===n.slice(8))?.name} · Megvizsgálom · E / F`;if(n.startsWith('salvage:'))return 'Régi alkatrészek · Begyűjtés · E / F';if(n==='shed'&&this.travel.research.key)return 'Melléképület · Belépés · E';return '';}
 private researchInteraction(){
  if(!this.canInteract())return false;const n=this.researchNearby();
  if(n==='workshop-exit'){void this.travelTo({x:632,y:224});return true;}
  if(n==='leo-visit'){void this.receiveFlowers();return true;}
  if(n==='observe-bee'){void this.observeResearchBee();return true;}
  if(n.startsWith('cobweb:')){void this.removeCobweb(n.slice(7));return true;}
  if(n.startsWith('examine:')){void this.examineWorkshop(n.slice(8));return true;}
  if(n.startsWith('salvage:')){void this.gatherSalvage(n.slice(8));return true;}
  return false;
 }
 private async receiveFlowers(){
  if(!this.canInteract()||this.researchNearby()!=='leo-visit')return;const research=startResearch(this.travel.research,this.clock.day);if(!research)return;
  if(await this.commitResearch(research)){this.travel.metLeo=true;await this.persist();this.leoVisitor?.destroy();this.leoVisitor=null;showDialogue('Leo','Tavaly ilyenkor sok szarvas faliméh járt a csemeték virágaira. Idén eddig alig láttam belőlük. Nálad megfordultak?\n\nHoztam hat tasak vadvirágmagot. Ültesd el őket, és nézzük meg, kik látogatják a virágokat! A szarvas faliméh sötét fejű, rozsdabarna potrohú, tavasszal a gyümölcsfák fontos beporzója.\n\n6 vadvirágmag a készletedbe került.','A FALIMÉHEK NYOMÁBAN');this.showSpeaker('nursery');}
 }
 private async observeResearchBee(){
  if(!this.canInteract())return;const next=observeBee(this.travel.research,this.clock.day,this.clock.elapsed,this.actor,seasonDay(calendarDay(this.clock.day,this.farmName)));if(!next)return;
  if(await this.commitResearch(next))showDialogue('Egy szarvas faliméh!','Sötét fej, rozsdabarna potroh… Igen, ő az. Egy példány már rátalált a virágokra. Ez még nem mondja meg, miért láttak belőlük olyan keveset.\n\nFeljegyeztem a megfigyelést a naplómba. Elmesélem Leónak.','ELSŐ MEGFIGYELÉS');
 }
 private async gatherSalvage(id:string){
  if(!this.canInteract())return;const next=collectSalvage(this.travel.research,id,this.actor,this.clock.day);if(!next)return;if(await this.commitResearch(next))this.notice(id==='old-pump'?'+1 rézcső · A régi szivattyúból megmentve.':'+2 ócskavas · A készletedbe került.');
 }
 private async researchMerchant(shop:Shop){
  let next:Research|null=null,text='';
  if(shop==='nursery'&&this.travel.research.observation&&!this.travel.research.key){next=grantKey(this.travel.research);text='Örülök, hogy láttál egyet! De figyeljük tovább őket. A birtok előző gazdája is sokat foglalkozott a kert élővilágával. Rám bízta a melléképület kulcsát; most már nálad a helye. Talán találsz ott valamit, ami segít megérteni, min dolgozott.';}
  else{next=supplyMaterial(this.travel.research,shop==='nursery'?'leo':'annie');text=shop==='nursery'?'A régi berendezéshez szűrő kell? Van egy darab tiszta lenszövetem. Vidd csak el — kíváncsi vagyok, mire jutsz vele!':'Egy ép üvegedényre van szükséged? Ezt szívesen neked adom. Jó látni, hogy a régi műhely ismét életre kel.';}
  if(!next)return false;if(await this.commitResearch(next)){showDialogue(shop==='nursery'?'Leo':'Annie',text,'EGY KEDVES SZÓ');this.showSpeaker(shop);}return true;
 }
 private async removeCobweb(id:string){
  if(!this.canInteract()||!inWorkshop(this.actor.y))return;const web=remainingWebs(this.travel.research).find(w=>w.id===id);if(!web)return;const next=clearCobweb(this.travel.research,id,this.actor,'hand');if(!next){this.notice('Ezt kézzel le tudom szedni.');return;}
  if(await this.commitResearch(next)){this.avatar.use(web.x-this.actor.x,web.y-this.actor.y,'hand');this.notice('A pókháló eltűnt.');}
 }
 private async examineWorkshop(id:string){
  if(!this.canInteract()||!inWorkshop(this.actor.y))return;const object=workshopObjects.find(o=>o.id===id);if(!object||Math.hypot(this.actor.x-object.x,this.actor.y-object.y)>78)return;const next=inspectWorkshop(this.travel.research,id);if(!next)return;
  if(await this.commitResearch(next)){showDialogue(object.name,['shutter','entrance-shutter'].includes(id)?object.text:this.travel.research.repaired&&['vat','pipes','filter','coil'].includes(id)?'A helyreállított kivonatkészítő egyik része. A berendezés újra egyben van; a használatát egy későbbi fejezetben fedezhetem fel.':object.text,'A RÉGI MŰHELY');if(id==='vat'&&!next.repaired)this.openRepairPanel();}
 }
 private showMachinePetals(){
  dialogue.dataset.presentation='machine-restored';const petals=document.createElement('div');petals.className='reward-petals machine-petals';petals.setAttribute('aria-hidden','true');
  for(let i=0;i<24;i++){const petal=document.createElement('i');petal.style.setProperty('--left',`${i*37%100}%`);petal.style.setProperty('--delay',`${-i*.43}s`);petal.style.setProperty('--duration',`${5+i%5}s`);petals.append(petal);}dialogue.append(petals);
 }
 private openRepairPanel(){
  const panel=document.querySelector<HTMLElement>('#research-panel')!;panel.hidden=false;panel.replaceChildren();
  for(const [k,n]of Object.entries(repairNeeds)){const line=document.createElement('p');line.textContent=`${k==='wood'?'Fa':k==='stone'?'Kő':researchNames[k as keyof Research['materials']]}: ${k==='wood'?this.clearing.wood:k==='stone'?this.clearing.stone:this.travel.research.materials[k as keyof Research['materials']]} / ${n}`;panel.append(line);}
  const inspected=document.createElement('p');inspected.className='inspected-parts';inspected.textContent=`Megvizsgált géprészek: ${['vat','pipes','filter','coil'].filter(id=>this.travel.research.examined.includes(id)).length} / 4`;panel.append(inspected);
  const warning=document.createElement('p');warning.id='repair-warning';warning.setAttribute('role','alert');warning.hidden=true;panel.append(warning);
  const button=document.createElement('button');button.type='button';button.id='repair-machine';button.textContent='Megjavítom a berendezést';button.onclick=async()=>{if(this.transitioning||!inWorkshop(this.actor.y)||panel.hidden)return;const fixed=repairMachine(this.travel.research,this.clearing);if(!fixed){warning.hidden=false;warning.textContent=Object.entries(repairNeeds).some(([k,n])=>(k==='wood'?this.clearing.wood:k==='stone'?this.clearing.stone:this.travel.research.materials[k as keyof Research['materials']])<n)?'Nincs nálad elég nyersanyag.':'Még nem vizsgáltad meg a berendezés minden részét.';return;}button.disabled=true;if(await this.commitResearch(fixed.research,fixed.wood,fixed.stone)){showDialogue('Növényi kivonatkészítő berendezés','A tartály stabil, a csövek ismét zárnak, a szűrő és a hűtőspirál is a helyére került. Most már felismerem: növényi kivonatok készítésére használták.\n\nTalán a régi jegyzetekből később azt is megtudhatom, hogyan segíthetett vele a kert élővilágán. A helyi méhek megfogyatkozásának okát még fel kell derítenem.','A MŰHELY ÚJRA ÉLETRE KEL');this.showMachinePetals();}else button.disabled=false;};panel.append(button);
 }
 private updateResearchLife(dt:number){
  const r=this.travel.research;
  if(!this.duckLife)this.duckLife=new DuckLife(this);this.duckLife.update(this.travel.estate,this.clock.elapsed);
  if(this.clock.day>=4&&!r.gifted&&this.story.giftReceived&&this.clock.elapsed<360){
   if(!this.leoVisitor){this.leoVisitor=this.add.container(170,510).setDepth(96);this.leoVisitor.add(this.add.ellipse(0,0,23,7,0x35442e,.25));this.leoVisitor.add(new LeoArt(this).root);this.leoStep=0;const zone=this.add.zone(0,-22,30,54).setInteractive({useHandCursor:true});zone.on('pointerdown',()=>void this.receiveFlowers());this.leoVisitor.add(zone);}
   const route=[[168,500],[207,404],[249,328],[296,275]],point=route[this.leoStep];if(point){const dx=point[0]-this.leoVisitor.x,dy=point[1]-this.leoVisitor.y,d=Math.hypot(dx,dy);if(d<2)this.leoStep++;else{this.leoVisitor.x+=dx/d*Math.min(d,dt*56);this.leoVisitor.y+=dy/d*Math.min(d,dt*56);}}else if(this.researchNearby()==='leo-visit')void this.receiveFlowers();
  }
  if(!this.beeArt)this.beeArt=this.add.graphics().setDepth(90);this.beeArt.clear();const anchor=beeAnchor(r);
  if(anchor&&beeAvailable(r,this.clock.day,this.clock.elapsed)){const t=this.clock.elapsed,x=anchor.x+Math.sin(t*2)*5,y=anchor.y-12+Math.cos(t*3)*2,g=this.beeArt;g.fillStyle(0xcbdede,.7).fillEllipse(x-2,y-3,5,3).fillEllipse(x+2,y-3,5,3);g.fillStyle(0xa26939).fillEllipse(x,y,7,5);g.fillStyle(0x3c3b30).fillCircle(x+3,y-1,2);g.lineStyle(.7,0x443c31).lineBetween(x-1,y-2,x-1,y+2);}
 }

 private redrawScenery(){this.homeArt?.destroy();this.homeArt=drawHome(this);this.houseExterior?.destroy();this.houseExterior=new HouseExterior(this);this.workshopExterior?.destroy();this.workshopExterior=new WorkshopExterior(this);this.redrawResearch();this.estateArt?.destroy();this.estateArt=drawEstate(this,this.travel.estate,this.clock.day);this.scenery?.destroy();this.scenery=drawFarm(this,this.clearing,this.garden,this.story.birdhouse).setDepth(-1);this.villageForage?.destroy();this.villageForage=drawForage(this,this.travel.picked,this.clock.day);}
 private animateWork(x:number,y:number,tool:string,kind:ImpactKind,contact:()=>void){
  this.workEffects??=new WorkEffects(this);this.avatar.use(x-this.actor.x,y-this.actor.y,tool,()=>{contact();this.workEffects?.impact(x,y,kind);});
 }
 private async clean(item:NonNullable<ReturnType<typeof debrisAt>>){
  if(!this.canInteract())return;
  const next=clearDebris(this.clearing,item,this.tool,this.actor,this.clock.day);
  if(!next){this.notice(Math.hypot(this.actor.x-item.x,this.actor.y-item.y)>44?'Sétálj közelebb.':`Ehhez ${item.kind==='weed'?'a Kéz':item.kind==='branch'?'a Fejsze':'a Csákány'} eszközt válaszd.`);return;}
  const nextSkill=item.kind==='weed'?gainGardening(this.skill,`weed:${this.clock.day}:${item.id}`)??this.skill:this.skill;
  const nextGarden=structuredClone(this.garden);if(!this.skill.rewarded&&nextSkill.rewarded)for(const fruit of Object.keys(rewardFruits) as RewardFruit[])nextGarden.seeds[fruit]+=4;
  if(!this.skill.levelThreeRewarded&&nextSkill.levelThreeRewarded)for(const crop of Object.keys(levelThreeSeeds) as LevelThreeSeed[])nextGarden.seeds[crop]+=4;
  const found=item.kind==='weed'?findSeeds(nextSkill,nextGarden.seeds,this.orders):null;if(found)nextGarden.seeds[found.crop]+=found.amount;
  this.transitioning=true;this.saveRevision++;
  try{
   await this.store.save(snapshot(this.actor,this.clock,nextGarden,this.economy,this.orders,this.farmName,next,this.story,nextSkill,this.farmerName,this.travel));
   const previous=this.skill.xp;this.skill=nextSkill;this.garden=nextGarden;this.clearing=next;document.querySelector('#save-state')!.textContent='Mentve ebben a böngészőben';
   this.animateWork(item.x,item.y,item.kind==='branch'?'axe':item.kind==='rock'?'pickaxe':'hand',item.kind==='branch'?'wood':item.kind==='rock'?'stone':'weed',()=>{this.redrawScenery();this.drawGarden();this.notice(item.kind==='weed'?'Gaz került a készletbe.':item.kind==='branch'?'Fa került a készletbe.':'Kő került a készletbe.');if(item.kind==='weed')this.showGardening(previous);if(found)this.showSeedFind(found);});
  }catch{this.notice('Nem sikerült menteni. A tárgy megmaradt; próbáld újra.');}
  finally{this.transitioning=false;this.lastTick=performance.now();}
 }
 private async doWork(){
  if(!this.ready||dialogue.open||this.transitioning||this.fishThrowPlaying||this.collapseRemaining>0||this.jumpRemaining>0||this.avatar.isWorking()||!this.target)return;
  if(inHome(this.actor.y)){this.interactHome();return;}
  if(inWorkshop(this.actor.y)){this.researchInteraction();return;}
  if(this.tool==='wildflower'){void this.plantWildflower();return;}
  if(flowerAt(this.travel.research,this.target)&&this.tool!=='water'){this.notice('Így marad meg a vadméhek virágos kertje. Öntözd a virágokat.');return;}
  const salvage=salvageSites.find(s=>!this.travel.research.picked.includes(s.id)&&Math.hypot(s.x-this.target!.x-8,s.y-this.target!.y-8)<23);if(salvage){void this.gatherSalvage(salvage.id);return;}
  if(this.placing){void this.placeEstateGood();return;}
  if((this.tool==='hand'||this.tool==='harvest')&&collectEstate(this.travel.estate,this.actor.x,this.actor.y,this.clock.day)){void this.gatherEstate();return;}
  if(this.travel.estate.trees.some(t=>Math.hypot(this.target!.x+8-t.x,this.target!.y+8-t.y)<24)||this.travel.estate.pond.some(p=>p.kind==='duckNest'&&Math.hypot(this.target!.x+8-p.x,this.target!.y+8-p.y)<24)){this.notice('Itt már egy fa vagy fészek áll.');return;}
  if(this.tool==='birdhouse'){void this.placeBirdhouse();return;}
  if(this.story.birdhouse&&Math.hypot(this.target.x+8-this.story.birdhouse.x,this.target.y+8-this.story.birdhouse.y)<25){
   if(this.tool!=='axe'){this.notice('A madárodút fejszével veheted vissza (8).');return;}
   if(Math.hypot(this.actor.x-this.story.birdhouse.x,this.actor.y-this.story.birdhouse.y)>44){this.notice('Sétálj közelebb a madárodúhoz.');return;}
   const point=this.story.birdhouse;
   void this.saveStory({...this.story,birdhouse:null},()=>{this.avatar.use(point.x-this.actor.x,point.y-this.actor.y);this.redrawScenery();this.notice('A madárodú visszakerült a készletbe. Máshová is kiteheted.');});return;
  }
  const item=debrisAt(this.clearing,this.garden,this.target.x+8,this.target.y+8);
  if(item){void this.clean(item);return;}
  if(this.tool==='hand'||this.tool==='axe'||this.tool==='pickaxe'){this.notice('Kattints közeli gazra, faágra vagy kőre.');return;}
  if(this.story.birdhouse&&Math.hypot(this.target.x+8-this.story.birdhouse.x,this.target.y+8-this.story.birdhouse.y)<25){this.notice('Itt a madárodú áll.');return;}
  const usedTool=this.tool,target={...this.target},nextGarden=structuredClone(this.garden),before=this.garden.plots.get(`${target.x},${target.y}`);
  const result=work(nextGarden,usedTool,target,this.actor);
  if(!result.ok){this.notice(result.message);return;}
  if(this.currentWeather()==='rain')waterFromRain(nextGarden);
  const tileKey=`${target.x},${target.y}`;
  const credit=gardeningCredit(usedTool,tileKey,this.clock.day,before);
  const nextSkill=credit?gainGardening(this.skill,credit)??this.skill:this.skill;
  if(!this.skill.rewarded&&nextSkill.rewarded)for(const fruit of Object.keys(rewardFruits) as RewardFruit[])nextGarden.seeds[fruit]+=4;
  if(!this.skill.levelThreeRewarded&&nextSkill.levelThreeRewarded)for(const crop of Object.keys(levelThreeSeeds) as LevelThreeSeed[])nextGarden.seeds[crop]+=4;
  this.transitioning=true;this.saveRevision++;
  try{
   await this.store.save(snapshot(this.actor,this.clock,nextGarden,this.economy,this.orders,this.farmName,this.clearing,this.story,nextSkill,this.farmerName,this.travel));
   const previous=this.skill.xp;this.garden=nextGarden;this.skill=nextSkill;document.querySelector('#save-state')!.textContent='Mentve ebben a böngészőben';
   this.animateWork(target.x+8,target.y+8,usedTool,usedTool==='water'?'water':usedTool==='harvest'?'harvest':'soil',()=>{this.drawGarden();if(usedTool==='hoe')this.redrawScenery();this.notice(result.message+(usedTool==='harvest'?' Készlet: Tab.':''));if(credit)this.showGardening(previous);});
  }catch{this.notice('Nem sikerült menteni. A kert és a jártasság változatlan; próbáld újra.');}
  finally{this.transitioning=false;this.lastTick=performance.now();}

 }

 create(){
  drawVillage(this);this.shopLeo=drawShop(this,'nursery');this.shopAnnie=drawShop(this,'fishShop');
  this.redrawScenery();
  const objectZone=(id:string,area:{x:number;y:number;w:number;h:number},action:()=>void)=>{
   const zone=this.add.zone(area.x+area.w/2,area.y+area.h/2,area.w+10,area.h+10).setInteractive({useHandCursor:true});zone.setName(id);zone.on('pointerdown',action);
  };
  for(const shop of ['nursery','fishShop'] as const){const origin=shopOrigins[shop];objectZone(`merchant-${shop}`,{x:409,y:origin+177,w:28,h:55},()=>this.talkMerchant(shop));objectZone(`exit-${shop}`,{x:373,y:origin+491,w:54,h:24},()=>{if(this.canInteract()&&shopAt(this.actor.y)===shop&&Math.hypot(this.actor.x-400,this.actor.y-origin-500)<48)this.leaveShop();});objectZone(`counter-${shop}`,{x:333,y:origin+225,w:234,h:65},()=>{if(this.canInteract()&&shopAt(this.actor.y)===shop&&Math.hypot(this.actor.x-450,this.actor.y-origin-292)<60)this.inspectVillage(shop);});}
  for(const bush of villageLayout.bushes)objectZone(`forage:${bush.id}`,{x:bush.x-18,y:bush.y-23,w:36,h:32},()=>void this.gatherForage(bush.id));
  for(const id of ['nursery','fishShop'] as const){const door=villageLayout[id].door;objectZone(id,villageLayout[id].entrance,()=>{if(this.canInteract()&&Math.hypot(this.actor.x-door.x,this.actor.y-door.y)<50)this.inspectVillage(id);});}
  for(const [index,b]of villageLayout.benches.entries()){const pose=benchPose(b.angle);objectZone(`village-bench-${index}`,{x:pose.x-30,y:pose.y-25,w:60,h:50},()=>{if(this.canInteract()&&Math.hypot(this.actor.x-pose.x,this.actor.y-pose.y)<55)this.inspectVillage('bench');});}
  objectZone('shipping',farmLayout.shipping,()=>this.openShipping());
  objectZone('journal',farmLayout.journal,()=>this.openJournal());
  objectZone('house-door',{x:216,y:153,w:43,h:70},()=>{if(this.canInteract()&&Math.hypot(this.actor.x-farmLayout.houseDoor.x,this.actor.y-farmLayout.houseDoor.y)<55)void this.travelTo({x:400,y:HOME_ORIGIN+470});});
  objectZone('catalog',farmLayout.catalog,()=>this.openCatalog());
  objectZone('mailbox',farmLayout.mailbox,()=>this.openMailbox());
  this.mailFlag=this.add.graphics().setDepth(3);
  this.planted=this.add.graphics().setDepth(1);
  this.selection=this.add.graphics().setDepth(2);
  this.drawGarden();
  for(const button of Array.from(document.querySelectorAll<HTMLButtonElement>('#toolbar [data-tool]'))){
   const tool=button.dataset.tool as FarmTool;
   const label=button.querySelector('span')!;
   const names={hoe:'Kapa',water:'Öntözés',radish:'Retek',potato:'Burgonya',pea:'Borsó',harvest:'Szedés',hand:'Kéz',axe:'Fejsze',pickaxe:'Csákány',birdhouse:'Madárodú',strawberry:'Eper',honeyberry:'Mézbogyó',blueberry:'Áfonya',carrot:'Sárgarépa',lettuce:'Saláta',onion:'Hagyma'};
   if(tool==='hoe'||tool==='water'||tool==='harvest'||tool==='wildflower')for(const node of Array.from(button.childNodes))if(node.nodeType===Node.TEXT_NODE)node.remove();
   if(tool==='wildflower')label.replaceChildren(document.createTextNode('Vadvirág'),document.createElement('br'),document.createTextNode('magok'));else label.textContent=names[tool];button.prepend(crops.includes(tool as typeof crops[number])?seedIcon(tool as typeof crops[number]):tool==='wildflower'?this.wildflowerIcon():itemIcon(tool));button.setAttribute('aria-label',tool==='wildflower'?'Vadvirág magok':names[tool]);
  }
  const tools:FarmTool[]=['hoe','water','radish','potato','pea','harvest','hand','axe','pickaxe'];
  document.querySelectorAll<HTMLButtonElement>('#toolbar [data-tool]').forEach(button=>button.addEventListener('click',(event)=>{this.selectTool(button.dataset.tool as FarmTool);if(event.detail>0)button.blur();}));
  document.querySelectorAll<HTMLButtonElement>('#toolbar button,#work,#jump,#run').forEach(b=>b.addEventListener('keydown',e=>{if(e.code==='Space')e.stopPropagation();}));
  this.input.keyboard!.on('keydown', (event:KeyboardEvent)=>{
    if(!this.ready||dialogue.open||this.transitioning||this.collapseRemaining>0)return;
    if(event.code==='Space'&&!event.repeat&&!(event.target as HTMLElement)?.closest('button')){event.preventDefault();this.startJump();}
    if(event.key>='1'&&event.key<='9')this.selectTool(tools[Number(event.key)-1]);
    if(event.code==='KeyF'&&!event.repeat){event.preventDefault();if(this.interactHome())return;
    if(this.researchInteraction())return;if(this.interactHome())return;
    if(this.researchInteraction())return;
    if(this.nearby==='leaveShop'){this.leaveShop();return;}
    if(this.nearby==='merchant'){const shop=shopAt(this.actor.y);if(shop)this.talkMerchant(shop);return;}
    if(this.nearby==='shopCounter'){const shop=shopAt(this.actor.y);if(shop)this.inspectVillage(shop);return;}
    if(this.nearby.startsWith('forage:')){void this.gatherForage(this.nearby.slice(7));return;}this.aimAhead();this.doWork();}
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
  const musicButton=document.querySelector<HTMLButtonElement>('#music-toggle')!,trackSelect=document.querySelector<HTMLSelectElement>('#music-track')!;
  for(const [id,name]of Object.entries(musicTracks))trackSelect.append(new Option(name,id));trackSelect.value=this.music.getTrack();
  const updateMusic=()=>{musicButton.textContent=`Zene: ${this.music.isEnabled()?'be':'ki'}`;trackSelect.value=this.music.getTrack();};updateMusic();
  musicButton.addEventListener('click',()=>{void this.music.toggle().then(updateMusic);});trackSelect.addEventListener('change',()=>{void this.music.setTrack(trackSelect.value as MusicTrack).then(updateMusic);});
  window.addEventListener('pointerdown',()=>{void this.music.activate();void this.rainSound.activate();},{once:true});window.addEventListener('keydown',()=>{void this.music.activate();void this.rainSound.activate();},{once:true});
  this.events.once('shutdown',()=>{this.weatherEffects?.destroy();this.rainSound.destroy();});
  this.avatar=new FarmerArt(this);this.body=this.avatar.root;this.actor.add(this.body);
  this.wildlife=new Wildlife(this);this.pondLife=new PondLife(this);this.villageAmbience=new VillageAmbience(this);
  this.thoughtBack=this.add.graphics().setDepth(159);
  this.thought=this.add.text(0,0,'',{fontFamily:'Georgia',fontSize:'10px',color:'#344939',padding:{x:5,y:3},wordWrap:{width:112},align:'center'}).setOrigin(.5,1).setDepth(160).setResolution(2).setVisible(false);
  this.bubble=this.add.text(0,0,'', {fontFamily:'Georgia',fontSize:'20px',color:'#fff4cf',backgroundColor:'#293e30',padding:{x:9,y:4}}).setOrigin(.5,1).setDepth(101).setInteractive({useHandCursor:true});
  const inspect=()=>{
    if(!this.ready||dialogue.open||this.transitioning||this.collapseRemaining>0)return;
    if(this.interactHome())return;
    if(this.researchInteraction())return;
    if(this.nearby==='leaveShop'){this.leaveShop();return;}
    if(this.nearby==='merchant'){const shop=shopAt(this.actor.y);if(shop)this.talkMerchant(shop);return;}
    if(this.nearby==='shopCounter'){const shop=shopAt(this.actor.y);if(shop)this.inspectVillage(shop);return;}
    if(this.nearby==='neighbor'){void this.receiveGift();return;}
    if(this.nearby.startsWith('forage:')){void this.gatherForage(this.nearby.slice(7));return;}
    if(this.nearby==='nursery'||this.nearby==='fishShop'||this.nearby==='bench'){this.inspectVillage(this.nearby);return;}
    if(this.nearby==='catalog')this.openCatalog();
    if(this.nearby==='mailbox')this.openMailbox();
    if(this.nearby==='shipping')this.openShipping();
    if(this.nearby==='journal')this.openJournal();
    if(this.nearby==='house')void this.travelTo({x:400,y:HOME_ORIGIN+470});
    if(collectEstate(this.travel.estate,this.actor.x,this.actor.y,this.clock.day)){void this.gatherEstate();return;}
    if(this.nearby==='pond')showDialogue('Egy kis tó.','Jó lesz itt megpihenni. Később az öntözőkannát is itt tölthetem újra.');
    if(this.nearby==='shed'){if(this.travel.research.key)void this.travelTo({x:400,y:3470});else showDialogue('?','');}
  };
  this.bubble.on('pointerdown',inspect);
  this.input.keyboard!.on('keydown-E',inspect);
  const resize=()=>this.fitCamera();
  resize();this.scale.on('resize',resize);
  this.events.once('shutdown',()=>this.scale.off('resize',resize));
  this.game.canvas.tabIndex=-1;
  dialogue.addEventListener('close',()=>{this.input.keyboard?.resetKeys();release();queueMicrotask(()=>{if(this.ready&&this.hasFarm&&!this.choosingFarm&&!this.naming&&!dialogue.open&&!this.transitioning)this.game.canvas.focus({preventScroll:true});});});
  showDialogue('',story,'');
  void this.initStorage();
  this.keys=this.input.keyboard!.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT,SHIFT',false) as Record<string,Phaser.Input.Keyboard.Key>;
  const inventoryTabs=['items','people','skills','goals'] as const;
  for(const [index,id] of inventoryTabs.entries()){const tab=document.querySelector<HTMLButtonElement>(`#${id}-tab`)!;tab.addEventListener('click',()=>this.inventoryTab(id));tab.addEventListener('keydown',event=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?inventoryTabs.length-1:(index+(event.key==='ArrowRight'?1:-1)+inventoryTabs.length)%inventoryTabs.length;this.inventoryTab(inventoryTabs[next]);document.querySelector<HTMLButtonElement>(`#${inventoryTabs[next]}-tab`)!.focus();}});}
  document.querySelector('#produce')!.addEventListener('click',()=>this.openInventory());
  window.addEventListener('keydown',event=>{
   if(document.querySelector<HTMLDialogElement>('#delete-farm-dialog')!.open){if(event.code==='Escape'&&this.transitioning)event.preventDefault();return;}
   if(event.code==='Escape'&&!dialogue.open&&this.placing){this.placing=null;this.notice('Elhelyezés megszakítva.');return;}
   if(event.code==='Escape'&&dialogue.open){event.preventDefault();if(dialogue.dataset.presentation==='development-end')return;if(!this.naming&&!this.choosingFarm)dialogue.close();return;}
   if(event.code!=='Tab'||event.repeat||this.naming||this.choosingFarm)return;
   if(dialogue.open&&!document.querySelector<HTMLElement>('#inventory-panel')!.hidden){event.preventDefault();dialogue.close();return;}
   if(!dialogue.open&&this.ready&&!this.transitioning&&this.collapseRemaining<=0){event.preventDefault();this.openInventory();}
  },true);
  dialogue.addEventListener('cancel',event=>{if(this.naming||this.choosingFarm||dialogue.dataset.presentation==='development-end')event.preventDefault();});
  document.querySelector('#dialogue form')!.addEventListener('submit',event=>{if(this.naming){event.preventDefault();void this.confirmFarmName();}else if(this.choosingFarm||dialogue.dataset.presentation==='development-end')event.preventDefault();});
  document.querySelector('#farm-name')!.addEventListener('input',()=>this.validateFarmName());
  document.querySelector('#start-farm')!.addEventListener('click',()=>void this.confirmFarmName());
  document.querySelector('#new-farm')!.addEventListener('click',()=>{if(this.ready&&!this.transitioning)this.openFarmNaming(true);});
  document.querySelector('#cancel-farm-name')!.addEventListener('click',()=>{if(!this.transitioning){this.naming=false;void this.openStartMenu(false);}});
  document.querySelector('#continue-farm')!.addEventListener('click',()=>{if(this.ready&&!this.transitioning&&this.hasFarm)this.resumeCurrentFarm();});
  document.querySelector('#retry-farms')!.addEventListener('click',()=>void this.openStartMenu());
  document.querySelector('#preview-farms')!.addEventListener('click',()=>void this.openStartMenu(false));
  document.querySelector('#open-start-menu')!.addEventListener('click',()=>void this.openStartMenu());
  document.querySelector('#menu')!.addEventListener('click',()=>{if(this.morningPlaying)return;showDialogue(this.farmName??'A farmod','', 'MENÜ');document.querySelector<HTMLElement>('#menu-panel')!.hidden=false;});
  document.querySelector('#place-order')!.addEventListener('click',()=>void this.placeOrder());
  document.querySelector('#collect-package')!.addEventListener('click',()=>void this.collectMail());
  document.querySelector('#sleep')!.addEventListener('click',()=>void this.finishDay(false));
  document.querySelector('#export-save')!.addEventListener('click',()=>{
   const blob=new Blob([JSON.stringify(snapshot(this.actor,this.clock,this.garden,this.economy,this.orders,this.farmName,this.clearing,this.story,this.skill,this.farmerName,this.travel),null,2)],{type:'application/json'});
   const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download=`erdoszeli-birtok-${this.clock.day}.json`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  });
 }
 private currentWeather(){return weatherOnDay(this.travel.weatherSeed??0,this.clock.day);}
 private aimAhead(){this.target=targetTile(this.actor.x+this.direction.x*22,this.actor.y+this.direction.y*22);}
 update(time:number,delta:number){
  if(!this.actor)return;
  if(this.cameraRegion!==(inHome(this.actor.y)?'home':inWorkshop(this.actor.y)?'workshop':shopAt(this.actor.y)??'outside'))this.fitCamera();
  this.actor.setAlpha(inWorkshop(this.actor.y)&&!this.travel.research.shutter&&!entranceShutterOpen(this.travel.research)?.3:1);this.updateLocation();this.updateResearchGoal();
  this.shopAnnie?.person.setVisible(shopsOpen(this.clock.elapsed));this.shopLeo?.person.setVisible(shopsOpen(this.clock.elapsed));
  if(performance.now()>this.skillUntil)document.querySelector<HTMLElement>('#gardening-skill')!.hidden=true;
  const now=performance.now();const seconds=Math.max(0,(now-this.lastTick)/1000);this.lastTick=now;
  document.querySelector('#gold')!.textContent=String(this.shownGold??this.economy.gold);
  document.querySelector('#day-number')!.textContent=`${seasonDay(calendarDay(this.clock.day,this.farmName))}.`;document.querySelector('#season-name')!.textContent=seasons[seasonIndex(calendarDay(this.clock.day,this.farmName))];
  document.querySelector('#clock-label')!.textContent=clockLabel(this.clock);
  document.querySelector<HTMLElement>('#night-shade')!.style.opacity=String(nightOpacity(this.clock));
  this.houseExterior?.update(nightOpacity(this.clock));
  this.workshopExterior?.update(entranceShutterOpen(this.travel.research),nightOpacity(this.clock));
  const weather=this.currentWeather(),outdoors=!shopAt(this.actor.y)&&!inWorkshop(this.actor.y)&&!inHome(this.actor.y),playing=this.ready&&!dialogue.open&&!this.transitioning&&!this.choosingFarm&&!document.hidden&&document.hasFocus()&&!springPreviewComplete(this.clock,this.farmName);
  document.querySelector<HTMLElement>('#sunlight')!.style.opacity=String(outdoors?(1-Math.min(1,nightOpacity(this.clock)/.55))*(weather==='sunny'?1:weather==='cloudy'?.18:0):0);
  document.querySelector('#weather-label')!.textContent=weatherNames[weather];
  if(!this.weatherEffects)this.weatherEffects=new WeatherEffects();this.weatherEffects.draw(playing?Math.min(seconds,.1):0,weather,outdoors,nightOpacity(this.clock),{x:this.cameras.main.worldView.x,y:this.cameras.main.worldView.y,zoom:this.cameras.main.zoom});this.rainSound.update(weather==='rain'&&outdoors&&playing);
  if(this.ready&&this.hasFarm&&!springPreviewComplete(this.clock,this.farmName)&&weather==='rain'&&waterFromRain(this.garden))this.drawGarden();
  const surface=document.querySelector<HTMLElement>('#game')!;surface.dataset.cameraX=String(this.cameras.main.worldView.x);surface.dataset.cameraY=String(this.cameras.main.worldView.y);surface.dataset.zoom=String(this.cameras.main.zoom);surface.dataset.placing=this.placing??'';surface.dataset.fish=String(this.travel.estate.fish.goldfish+this.travel.estate.fish.carp);surface.dataset.trees=String(this.travel.estate.trees.length);surface.dataset.morningStage=this.morningStage;surface.dataset.shopLeo=String(Boolean(this.shopLeo?.person.visible&&shopAt(this.actor.y)==='nursery'));surface.dataset.shopsOpen=String(shopsOpen(this.clock.elapsed));surface.dataset.shopAnnie=String(Boolean(this.shopAnnie?.person.visible&&shopAt(this.actor.y)==='fishShop'));surface.dataset.pendingSeeds=String(quantityTotal(this.orders.pending));surface.dataset.mailSeeds=String(quantityTotal(this.orders.mailbox));surface.dataset.gardeningXp=String(this.skill.xp);surface.dataset.gardeningReward=String(this.skill.rewarded);surface.dataset.gift=String(this.story.giftReceived);surface.dataset.birdhouse=String(Boolean(this.story.birdhouse));surface.dataset.morningSeen=String(this.story.morningSeen);surface.dataset.gold=String(this.economy.gold);surface.dataset.shipping=String(shippingValue(this.economy.shipping));surface.dataset.day=String(this.clock.day);surface.dataset.elapsed=String(this.clock.elapsed);surface.dataset.ready=String(this.ready);surface.dataset.jumping=String(this.jumpRemaining>0);
  surface.dataset.weather=weather;surface.dataset.previewComplete=String(springPreviewComplete(this.clock,this.farmName));
  if(this.ready&&!this.choosingFarm&&!dialogue.open&&!this.transitioning&&springPreviewComplete(this.clock,this.farmName))this.showPreviewEnd();
  if(!this.ready||dialogue.open||this.transitioning||springPreviewComplete(this.clock,this.farmName)||document.hidden||!document.hasFocus()){this.input.keyboard?.resetKeys();this.selection.setVisible(false);return;}
  if(this.collapseRemaining>0){
   this.collapseRemaining=Math.max(.001,this.collapseRemaining-seconds);this.actor.setAngle(75);document.querySelector<HTMLElement>('#sleep-shade')!.style.opacity=String(1-this.collapseRemaining);
   if(this.collapseRemaining<=.001)void this.finishDay(true);return;
  }
  const clockEvents=advanceClock(this.clock,seconds);
  for(const warning of clockEvents.warnings){
   this.showNightWarning(warning===480?'Későre jár. Ideje hazamenni és pihenni.':'Alig bírom nyitva tartani a szemem. Most már tényleg le kell feküdnöm.');
  }
  if(shopAt(this.actor.y)&&!shopsOpen(this.clock.elapsed)&&now>=this.closingRetryAt){this.closingRetryAt=now+3000;this.notice('Estére bezárnak az üzletek. Ideje hazaindulni.');this.leaveShop();return;}
  if(clockEvents.collapse){release();this.jumpRemaining=0;this.body.setY(0);this.collapseRemaining=1;this.notice('Elálmosodtam…');return;}
  this.sinceSave+=seconds;if(this.sinceSave>=5){this.sinceSave=0;void this.persist();}
  this.jumpCooldown=Math.max(0,this.jumpCooldown-seconds);
  this.jumpRemaining=Math.max(0,this.jumpRemaining-Math.min(seconds,.05));
  const height=jumpHeight(this.jumpRemaining);this.body.setY(-height);this.shadow.setScale(1-height/90);

  this.selection.setVisible(true);
  const k=this.keys;
  const dx=this.fishThrowPlaying||this.avatar.isWorking()?0:Number(movementInput.down('KeyD','ArrowRight')||k.D.isDown||k.RIGHT.isDown||held.has('right'))-Number(movementInput.down('KeyA','ArrowLeft')||k.A.isDown||k.LEFT.isDown||held.has('left'));
  const dy=this.fishThrowPlaying||this.avatar.isWorking()?0:Number(movementInput.down('KeyS','ArrowDown')||k.S.isDown||k.DOWN.isDown||held.has('down'))-Number(movementInput.down('KeyW','ArrowUp')||k.W.isDown||k.UP.isDown||held.has('up'));
  const before={x:this.actor.x,y:this.actor.y};const rocks=activeDebris(this.clearing,this.garden).filter(d=>d.kind==='rock');
  const rockBlocked=(x:number,y:number)=>rocks.some(r=>{const radiusX=r.scale*17+6,radiusY=r.scale*12+3;const old=((before.x-r.x)/radiusX)**2+((before.y-r.y)/radiusY)**2,now=((x-r.x)/radiusX)**2+((y-r.y)/radiusY)**2;return now<1&&(old>=1||now<=old);});
  const next=move(before.x,before.y,dx,dy,seconds,movementSpeed(this.jumpRemaining>0,movementInput.running),(x,y)=>rockBlocked(x,y)||this.travel.estate.trees.some(t=>Math.hypot(x-t.x,y-t.y)<12)||this.travel.estate.pond.some(p=>p.kind==='duckNest'&&Math.hypot(x-p.x,y-p.y)<12),worldBlocked);this.actor.setPosition(next.x,next.y);
  surface.dataset.cleared=String(Object.keys(this.clearing.removed).length);surface.dataset.wood=String(this.clearing.wood);surface.dataset.stone=String(this.clearing.stone);surface.dataset.running=String(movementInput.running);surface.dataset.jumpHeight=String(height);
  const insideShop=shopAt(next.y);
  this.actor.setAlpha(inWorkshop(this.actor.y)&&!this.travel.research.shutter&&!entranceShutterOpen(this.travel.research)?.3:1);this.updateLocation();this.updateResearchGoal();
  surface.dataset.playerX=String(Math.round(next.x));surface.dataset.playerY=String(Math.round(next.y));
  if(dx)this.facing=dx>0?1:-1;
  if(dx||dy){this.direction={x:dx,y:dy};this.aimAhead();}
  if(!this.target)this.aimAhead();
  this.selection.clear();
  if(this.target){
    const debris=debrisAt(this.clearing,this.garden,this.target.x+8,this.target.y+8);
    const valid=this.placing?Math.hypot(this.target.x+8-this.actor.x,this.target.y+8-this.actor.y)<=90&&Boolean(placeGood(this.travel.estate,this.placing,this.target.x+8,this.target.y+8,this.clock.day,this.estateLand(this.target.x+8,this.target.y+8),this.farmName)):this.tool==='birdhouse'?this.canPlaceBirdhouse(this.target.x+8,this.target.y+8):debris?Math.hypot(this.actor.x-debris.x,this.actor.y-debris.y)<=44&&neededTool[debris.kind]===this.tool:cultivable(this.target)&&reachable(this.target,this.actor);
    const plot=this.garden.plots.get(`${this.target.x},${this.target.y}`);
    const hint=document.querySelector<HTMLElement>('#crop-hint')!;hint.textContent=this.placing?`${goodNames[this.placing]} · válassz közeli ${treeKinds.includes(this.placing as typeof treeKinds[number])?'szabad földet':this.placing==='duckNest'?'tópartot':'vizet'} · kattintás / F`:this.tool==='birdhouse'?'Madárodú · kattints egy közeli, szabad helyre':debris?`${debrisNames[debris.kind]} · ${debris.kind==='weed'?'Kéz (7)':debris.kind==='branch'?'Fejsze (8)':'Csákány (9)'} · F / kattintás`:plot?.crop?`${cropNames[plot.crop]} · ${isRipe(plot)?'Betakarítható':`${plot.growth}/${growthTarget(plot)} nap`}${isRipe(plot)?'':` · ${plot.watered?'öntözve':'öntözést kér'}`}`:'';
    this.selection.lineStyle(1,valid?0xf1df9e:0xd69077,1).strokeRect(this.target.x,this.target.y,TILE,TILE);
    this.selection.fillStyle(valid?0xf1df9e:0xd69077,.12).fillRect(this.target.x,this.target.y,TILE,TILE);
  }
  if(outsideFarm(next.y)||inWorkshop(next.y)||inHome(next.y)){this.selection.clear();document.querySelector('#crop-hint')!.textContent='';}
  if(this.time.now>this.feedbackUntil){const feedback=document.querySelector<HTMLElement>('#feedback')!;feedback.textContent=inHome(next.y)?'Otthon':inWorkshop(next.y)?'Lépj közel a tárgyakhoz · E / F / buborék':insideShop?'Kijárat az ajtónál · E / koppintás':outsideFarm(next.y)?'Északra: a farm · Space: ugrás · Shift: futás':'Kattints közeli földre · F: művelet · Space: ugrás · Shift: futás';delete feedback.dataset.result;feedback.classList.remove('notice');}

  const walking=next.x!==before.x||next.y!==before.y;
  surface.dataset.walking=String(walking);surface.dataset.tool=this.tool;
  this.avatar.update(walking,movementInput.running,this.direction,Math.min(seconds,.05),this.jumpRemaining>0);this.workEffects?.update(Math.min(seconds,.05),this.avatar.workFrame());const workFrame=this.avatar.workFrame();surface.dataset.working=String(this.avatar.isWorking());surface.dataset.workPhase=workFrame?.phase??'idle';surface.dataset.workProgress=String(workFrame?.progress??0);
  this.wildlife.update(Math.min(seconds,.05),this.clock.day>=2&&this.story.giftReceived,this.clock.elapsed<360,this.actor.y<600?this.story.birdhouse:null,!insideShop&&!inWorkshop(next.y)&&!inHome(next.y)&&weather!=='rain',weather==='sunny'?1.5:.5);
  this.pondLife.update(Math.min(seconds,.05),this.travel.estate,this.clock.elapsed<360,!insideShop&&!inWorkshop(next.y)&&!inHome(next.y));
  this.villageAmbience.update(Math.min(seconds,.05),nightOpacity(this.clock),!insideShop&&!inWorkshop(next.y)&&!inHome(next.y)&&this.cameras.main.worldView.bottom>600);
  this.updateVisit(Math.min(seconds,.05));this.updateResearchLife(Math.min(seconds,.05));
  this.thoughtRemaining=Math.max(0,this.thoughtRemaining-seconds);this.thought.setVisible(this.thoughtRemaining>0).setPosition(Phaser.Math.Clamp(next.x,this.cameras.main.worldView.left+65,this.cameras.main.worldView.right-65),next.y-55);
  this.thoughtBack.clear();if(this.thoughtRemaining>0){const b=this.thought.getBounds();this.thoughtBack.fillStyle(0xfff0cc).fillRoundedRect(b.x-2,b.y-2,b.width+4,b.height+4,5).fillCircle(this.thought.x+5,b.bottom+6,2.5).fillCircle(this.thought.x+1,b.bottom+11,1.5);}
  const near=(x:number,y:number,d:number)=>Phaser.Math.Distance.Between(next.x,next.y,x,y)<d;
  const estateReady=Boolean(collectEstate(this.travel.estate,next.x,next.y,this.clock.day));
  const nearbyBush=villageLayout.bushes.find(b=>near(b.x,b.y,45));
  this.nearby=this.homeNearby()|| (insideShop&&near(400,shopOrigins[insideShop]+500,48)?'leaveShop':insideShop&&merchantNearby(insideShop,next.x,next.y)?'merchant':insideShop&&near(450,shopOrigins[insideShop]+292,60)?'shopCounter':nearbyBush?`forage:${nearbyBush.id}`:near(villageLayout.nursery.door.x,villageLayout.nursery.door.y,45)?'nursery':near(villageLayout.fishShop.door.x,villageLayout.fishShop.door.y,45)?'fishShop':villageLayout.benches.some(b=>{const p=benchPose(b.angle);return near(p.x,p.y,55);})?'bench':this.neighbor&&!this.story.giftReceived&&near(this.neighbor.x,this.neighbor.y,55)?'neighbor':near(farmLayout.catalog.x+9,farmLayout.catalog.y+6,40)?'catalog':near(farmLayout.mailbox.x+12,farmLayout.mailbox.y+8,55)?'mailbox':near(farmLayout.shipping.x+16,farmLayout.shipping.y+12,50)?'shipping':near(657+farmLayout.shedOffset.x,206+farmLayout.shedOffset.y,66)?'shed':near(farmLayout.dock.x+25,farmLayout.dock.y+10,60)?'pond':near(farmLayout.journal.x+9,farmLayout.journal.y+7,22)?'journal':near(farmLayout.houseDoor.x,farmLayout.houseDoor.y,28)?'house':'');
  this.nearby=this.researchNearby()||this.nearby;
  this.bubble.setPosition(next.x,next.y-54).setText(estateReady?'…':this.nearby==='shed'?'?':this.nearby?'…':'').setVisible(Boolean(this.nearby||estateReady)&&this.jumpRemaining<=0);
  document.querySelector('#status')!.textContent=this.researchHint()|| (estateReady?'Begyűjthető · E / F / Szedés':this.nearby==='leaveShop'?'Vissza a térre · E / koppintás':this.nearby==='merchant'?`${insideShop==='nursery'?'Leo':'Annie'} · Beszélgetés · E / koppintás`:this.nearby==='shopCounter'?'Pult · E / koppintás':nearbyBush?(forageReady(this.travel,nearbyBush.id,this.clock.day)?'Erdei áfonya · E / F / koppintás':'Áfonyabokor · most pihen'):this.nearby==='nursery'||this.nearby==='fishShop'?`${shopNames[this.nearby]} · ${shopsOpen(this.clock.elapsed)?'E / koppintás':'Zárva · reggel nyit'}`:this.nearby==='bench'?'Pihenőpad · E / koppintás':this.nearby==='neighbor'?'Szomszéd · E / kattintás':this.nearby==='shed'?'?':this.nearby==='catalog'?'Magkatalógus · E / kattintás':this.nearby==='mailbox'?`Postaláda${quantityTotal(this.orders.mailbox)>0?' · Csomag érkezett':''} · E / kattintás`:this.nearby==='shipping'?'Eladóláda · E / koppints a ládára':this.nearby==='home-exit'?'Vissza a verandára · E':this.nearby.startsWith('home:')?'Megvizsgálom · E':this.nearby==='journal'?'Napló · E':this.nearby==='house'?'Otthon · Belépés · E':this.nearby==='pond'?'Tópart · E / koppints a buborékra':'');
 }
}
new Phaser.Game({type:Phaser.AUTO,parent:'game',width:800,height:600,pixelArt:true,backgroundColor:'#8da85e',scene:Farm,scale:{mode:Phaser.Scale.RESIZE,autoCenter:Phaser.Scale.CENTER_BOTH},input:{keyboard:true}});
