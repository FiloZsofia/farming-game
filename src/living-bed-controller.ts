import {pathFootprint,polygonsOverlap,rectanglePolygon,roundedBedPolygon} from './garden-path-footprint';
import {extendGardenPath,makeGardenPath,pathMaterials,pathSupplies,gardenPathCost,type PathMaterial} from './garden-path';
import {paintGardenPaths,gardenPathIcon} from './garden-path-art';
import {GardenLearningHelp,type GardenHelpTopic} from './garden-learning-help';
import type {QuestEntry} from './quest-log';
import {LivingGardenWindow,type GardenWindowMode} from './living-garden-window';
import {observationSketch} from './living-garden-notes';
import {itemIcon,seedIcon} from './item-icons';
import {isFood} from './food';
import Phaser from 'phaser';
import {worldText} from './world-text';
import {livingBedArea as defaultArea,livingPlantPoint,type LivingBedArea} from './living-bed-layout';
import {bedAreaAt,livingBedFits,gardenDecorationFits,nearBedSide,bedMarkerFits} from './living-bed-placement';
import {paintLivingBed,paintBedVisitors,paintMarker} from './living-bed-art';
import {prepareLivingBed,plantLivingBed,waterLivingBed,mulchLivingBed,flowerLivingPlant,harvestLivingPlant,collectLivingSeeds,replantLivingSpot,refillLivingBed,bedKinds,bedMixes,bedPlantStage,bedSeedMethod,livingFlowers,emptyBedSeeds,recommendedBedCounts,recommendedComposition,composeLivingBed,type LivingBed,type BedMix,type BedKind} from './living-bed';
import {LivingGarden,trialSeedPrices,type TrialBed,type GardenPoint} from './living-garden';
import {placedItemAt,pickPlacedItem,type RuntimePlacedItems,type PlacedItem} from './placed-items';
import {farmLayout} from './layout';
import {buyBlueprint,craftMachine,canCraft,blueprintNames,recipes,materialKeys,heldMaterial,materialNames,type Blueprint} from './crafting';
import {craftChest} from './chests';
import type {Snapshot} from './storage';
type Host={actor:()=>GardenPoint;ready:()=>boolean;day:number;snapshot:()=>Snapshot;gain:(kind:BedKind|'stone'|'wood'|'mulch',count:number,point:GardenPoint,label:string,seed?:boolean)=>void;goals:()=>QuestEntry[];rest:()=>void;showWindow:(title:string,label:string)=>void;uiReady:()=>boolean;equip:(tool:'hoe'|'water'|'harvest'|'crowbar'|'stick'|'hand')=>void;thought:(text:string)=>void;celebrate:(level:number,mix:{name:string;detail:string;composition:string})=>void;work:(point:GardenPoint,tool:'hoe'|'hand'|'water'|'harvest'|'crowbar')=>void;advanceDay:(day:number)=>void;panelChanged:()=>void};
type PanelMode='bed'|GardenWindowMode;
type Tool='stick'|'inspect'|'hoe'|'water'|'harvest'|'mulch'|'crowbar'|'path'|'marker'|'irrigation'|'composter'|'chest'|BedKind;
const intersect=(a:LivingBedArea,b:LivingBedArea,pad=0)=>a.x-pad<b.x+b.w&&a.x+a.w+pad>b.x&&a.y-pad<b.y+b.h&&a.y+a.h+pad>b.y;
export class LivingBedController{
 readonly garden:LivingGarden;private active:TrialBed;placing=true;isOpen=false;selected=0;tool:Tool='harvest';
 private pathMaterial:PathMaterial='stone';private pathCredits={stone:0,wood:0,dirt:0};private pathsArt:Phaser.GameObjects.Graphics;private learningHelp:GardenLearningHelp;private addBedButton:HTMLButtonElement;private modal:LivingGardenWindow;private seedControl:HTMLElement|null=null;private toolbarState:{button:HTMLButtonElement;hidden:boolean;disabled:boolean;pressed:string|null}[]=[];private mixDraft:BedMix|null=null;private draftCounts=emptyBedSeeds();
 private progressUI:HTMLElement;private progressUntil=0;private gains:{kind:BedKind|'stone'|'wood'|'mulch';count:number;point:GardenPoint;label:string;seed?:boolean}[]=[];private orderedInCatalog=false;private sprayRemaining=new Map<number,number>();private lastSprayTime=0;private sprayArt:Phaser.GameObjects.Graphics;private catalogMix:BedMix|null=null;private lastPanelSpace=0;private lastToolbarHeight=-1;private mode:PanelMode='bed';private placementUI:HTMLElement;private panel:HTMLElement;private toolbar:HTMLElement;
 private bedsArt=new Map<number,Phaser.GameObjects.Graphics>();private signs=new Map<number,Phaser.GameObjects.Text>();
 private decorations:Phaser.GameObjects.Graphics;private visitors:Phaser.GameObjects.Graphics;private preview:Phaser.GameObjects.Graphics;
 private stroke:GardenPoint[]=[];private drawing=false;private markerBed:number|null=null;private point:GardenPoint={x:0,y:0};private closed=false;private message='';private machineIndex=0;
 private onKey=(event:KeyboardEvent)=>{if((event.target as HTMLElement)?.closest('input,select,textarea')){event.stopImmediatePropagation();return;}if(!this.host.ready())return;if(event.code==='Tab'){event.preventDefault();event.stopImmediatePropagation();this.open('inventory');}if(event.key>='1'&&event.key<='5')this.setTool((['hoe','water','harvest','crowbar','stick'] as Tool[])[Number(event.key)-1]);};
 get state(){return this.garden.sync(this.active);}set state(s:LivingBed){this.active.state=s;}
 get area(){return this.active.area;}set area(b:LivingBedArea){this.active.area=b;}
 get hint(){if(this.markerBed!==null)return 'Ágyásjelölő a kézben · válassz helyet az ágyás közvetlen oldalánál.';return this.message||'Válassz eszközt vagy vetőmagot az alsó sávban, majd kattints az ágyásra.';}

 constructor(private scene:Phaser.Scene,private host:Host){
  this.progressUI=document.createElement('aside');this.progressUI.id='living-garden-progress';this.progressUI.hidden=true;this.progressUI.setAttribute('aria-live','polite');document.querySelector('#app')!.append(this.progressUI);this.learningHelp=new GardenLearningHelp(()=>this.host.panelChanged());this.garden=new LivingGarden(host.snapshot());this.active=this.garden.addBed(defaultArea);this.garden.seeds.wildflower=6;
  this.sprayArt=scene.add.graphics().setDepth(105);this.pathsArt=scene.add.graphics().setDepth(.5);this.decorations=scene.add.graphics().setDepth(4);this.visitors=scene.add.graphics().setDepth(103);this.preview=scene.add.graphics().setDepth(5);
  this.panel=document.createElement('aside');this.panel.id='living-bed-panel';this.panel.hidden=true;this.panel.setAttribute('aria-label','Kertészkedés');document.querySelector('#app')!.append(this.panel);
  this.toolbar=document.querySelector<HTMLElement>('#toolbar')!;this.toolbarState=Array.from(this.toolbar.querySelectorAll<HTMLButtonElement>('[data-tool]')).map(button=>({button,hidden:button.hidden,disabled:button.disabled,pressed:button.getAttribute('aria-pressed')}));for(const {button}of this.toolbarState)button.hidden=false;this.modal=new LivingGardenWindow(host.showWindow,()=>{this.mode='bed';this.isOpen=false;if(this.tool in bedKinds)this.tool='harvest';this.renderToolbar();});
  this.placementUI=document.createElement('div');this.placementUI.id='living-bed-placement';document.querySelector('#app')!.append(this.placementUI);this.addBedButton=document.createElement('button');this.addBedButton.id='living-garden-add-bed';this.addBedButton.type='button';this.addBedButton.textContent='+';this.addBedButton.title='Új ágyás';this.addBedButton.setAttribute('aria-label','Új ágyás kijelölése');this.addBedButton.onclick=()=>{if(this.host.ready()&&!this.placing&&this.markerBed===null)this.newBed();};document.querySelector('#app')!.append(this.addBedButton);
  const place=document.createElement('button');place.id='confirm-living-bed-place';place.type='button';place.textContent='Itt jelölöm ki az ágyást';place.onclick=()=>this.confirmPlace();this.placementUI.append(place);
  window.addEventListener('keydown',this.onKey,true);void document.fonts.load('12px "Kerti Ceruza"').then(()=>{if(!this.closed)this.paint();});
  this.paint();this.render();scene.events.once('shutdown',this.destroy,this);
 }
 private committed(){return this.garden.beds.filter(b=>!this.placing||b!==this.active);}
 private distance(p:GardenPoint,b:LivingBedArea){return Math.hypot(p.x-Math.max(b.x,Math.min(b.x+b.w,p.x)),p.y-Math.max(b.y,Math.min(b.y+b.h,p.y)));}
 near(){return this.distance(this.host.actor(),this.area)<55;}
 blocks(x:number,y:number,before:GardenPoint){if(this.garden.snapshot.travel.crafting?.machines.some(m=>Math.hypot(m.x-x,m.y-y)<15&&Math.hypot(m.x-before.x,m.y-before.y)>=15)||this.garden.snapshot.skill.chests?.placed.some(m=>Math.hypot(m.x-x,m.y-y)<18&&Math.hypot(m.x-before.x,m.y-before.y)>=18))return true;return this.committed().some(b=>{if(!b.state.prepared)return false;const a=b.area,inside=(p:GardenPoint)=>p.x>a.x+4&&p.x<a.x+a.w-4&&p.y>a.y+2&&p.y<a.y+a.h-2;return inside({x,y})&&(!inside(before)||Math.hypot(x-a.x-a.w/2,y-a.y-a.h/2)<Math.hypot(before.x-a.x-a.w/2,before.y-a.y-a.h/2));});}
 private fits(){return livingBedFits(this.area,this.host.actor())&&!this.committed().some(b=>intersect(this.area,b.area,20))&&!this.garden.paths.some(p=>this.distance(p,this.area)<12)&&!this.garden.snapshot.travel.crafting?.machines.some(m=>this.distance(m,this.area)<25)&&!this.garden.snapshot.skill.chests?.placed.some(m=>this.distance(m,this.area)<25)&&!this.runtimeItems().items.some(m=>this.distance(m,this.area)<(m.kind==='bedMarker'?38:15));}
 movePreview(point:GardenPoint){this.point=point;if(this.placing)this.area=bedAreaAt(point);if(this.drawing)this.extendPath(point);this.paintPreview();if(this.placing)this.paint();}
 confirmPlace(){if(!this.placing||!this.host.ready()||!this.fits())return;this.placing=false;this.markerBed=this.active.id;if(!this.garden.packedMarkers.includes(this.active.id))this.garden.packedMarkers.push(this.active.id);this.tool='marker';this.message='';this.host.equip('hand');this.resetPlacementUI();this.paint();this.render();}
 private resetPlacementUI(){this.stroke=[];this.drawing=false;this.placementUI.replaceChildren();const button=this.button(this.placementUI,'Itt jelölöm ki az ágyást','confirm-bed',()=>this.placing?this.confirmPlace():this.placeItem(this.point),false);button.id='confirm-living-bed-place';if(!this.placing&&this.markerBed!==null&&!this.state.prepared)this.button(this.placementUI,'Ágyás helyének módosítása','relocate-pending',()=>{this.markerBed=null;this.placing=true;this.tool='harvest';this.resetPlacementUI();this.paint();this.render();},false);}
 private newBed(){if(this.placing)return;this.closePanel();this.active=this.garden.addBed(bedAreaAt(this.point));this.mixDraft=null;this.placing=true;this.tool='inspect';this.resetPlacementUI();this.paint();this.render();}
 closePanel(){if(!this.isOpen)return;this.isOpen=false;this.learningHelp.collapse();this.panel.hidden=true;if(this.tool in bedKinds){this.tool='harvest';this.host.equip('harvest');}this.renderToolbar();this.host.panelChanged();}
 showInventory(mode:'plans'|'inventory'|'people'|'skills'|'goals'='inventory'){this.open(mode);}
 private canUse(){return this.modal.isOpen?this.host.uiReady():this.host.ready();}
 private open(mode:PanelMode){if(mode==='catalog'&&(!this.modal.isOpen||this.mode!=='catalog'))this.orderedInCatalog=false;if(mode!==this.mode&&mode!=='bed')this.message='';if(mode!=='bed')this.closePanel();else this.modal.close();this.mode=mode;this.isOpen=mode==='bed';this.render();this.panel.hidden=!this.isOpen;this.host.panelChanged();}
 setTool(tool:Tool){if(this.markerBed!==null&&tool!=='marker')return;if(tool in bedKinds&&(!this.isOpen||this.mode!=='bed'||!this.state.mix||!bedMixes[this.state.mix].plants.includes(tool as BedKind)||!this.garden.seeds[tool as BedKind]))return;this.modal.close();this.tool=tool;this.stroke=[];this.drawing=false;this.host.equip(['hoe','water','crowbar','stick','harvest'].includes(tool)?tool as 'hoe'|'water'|'crowbar'|'stick'|'harvest':'hand');this.renderToolbar();this.paintPreview();}
 advanceDay(weather:'sunny'|'rain'){if(!this.host.uiReady())return;this.garden.nextDay(weather);for(const bed of this.garden.beds)if(bed.irrigation)this.sprayRemaining.set(bed.id,2500);this.host.advanceDay(this.garden.snapshot.clock.day);this.message='';this.paint();if(this.isOpen)this.render();}

 private serviceAt(point:GardenPoint,byKeyboard=false){
  for(const [mode,b]of [['catalog',farmLayout.catalog],['mail',farmLayout.mailbox],['notebook',farmLayout.journal]] as const)if(this.distance(point,b)<15){if(this.distance(this.host.actor(),b)<60)this.open(mode);return true;}
  const door=farmLayout.houseDoor;if((this.distance(point,farmLayout.houseBounds)<15||Math.hypot(point.x-door.x,point.y-door.y)<65)&&Math.hypot(this.host.actor().x-door.x,this.host.actor().y-door.y)<75){this.open('rest');return true;}
  const machines=this.garden.snapshot.travel.crafting?.machines??[],index=machines.findIndex(m=>Math.hypot(m.x-point.x,m.y-point.y)<(byKeyboard?55:24));if(index>=0&&this.tool!=='crowbar'){if(Math.hypot(machines[index].x-this.host.actor().x,machines[index].y-this.host.actor().y)<55){this.machineIndex=index;this.open('composter');}return true;}return false;
 }

 pointer(point:GardenPoint,touch=false){
  if(!this.host.ready())return true;
  if(this.placing){this.movePreview(point);if(!touch)this.confirmPlace();return true;}
  if(this.tool==='crowbar')return this.pickup(point);
  if(this.tool==='marker'&&touch){this.movePreview(point);return true;}
  if(this.tool==='marker'||this.tool==='irrigation'||this.tool==='composter'||this.tool==='chest'){this.placeItem(point);return true;}
  if(this.tool==='path'){this.closePanel();this.drawing=true;this.extendPath(point);this.paintPreview();return true;}
  if(this.tool==='harvest'){const i=this.garden.snapshot.travel.fallenFruit?.findIndex(p=>Math.hypot(p.x-point.x,p.y-point.y)<14)??-1;if(i>=0&&this.garden.collectOverripe(i,this.host.actor())){this.host.work(point,'hand');this.paint();this.render();return true;}}
  if(this.serviceAt(point))return true;
  const bed=this.committed().find(b=>this.distance(point,b.area)<8);if(!bed){this.closePanel();return false;}if(this.active!==bed){this.mixDraft=null;if(this.tool in bedKinds){this.tool='harvest';this.host.equip('harvest');}}this.active=bed;if(!this.near()){this.message='Lépj közelebb az ágyáshoz.';return true;}
  if(this.state.plants.length){this.selected=this.state.plants.map((_,i)=>{const p=livingPlantPoint(i,this.area);return {i,d:Math.hypot(p.x-point.x,p.y-point.y)};}).sort((a,b)=>a.d-b.d)[0].i;}
  if(this.tool==='hoe')this.apply(prepareLivingBed(this.state),'hoe','prepare');
  else if(this.tool==='water')this.apply(waterLivingBed(this.state),'water','water');
  else if(this.tool==='mulch')this.mulch();
  else if(this.tool==='harvest'){const p=this.state.plants[this.selected];const next=p?(bedPlantStage(p)==='seed'?collectLivingSeeds(this.state,this.selected):harvestLivingPlant(this.state,this.selected)):null;if(next)this.apply(next,'harvest',bedPlantStage(p)==='seed'?'seeds':'harvest');else this.inspectBed(bed);}
  else if(this.tool in bedKinds)this.apply(replantLivingSpot(this.state,this.selected,this.tool as BedKind),'hand','replant');
  else this.inspectBed(bed);this.paint();if(this.isOpen)this.render();return true;
 }
 interact(){
  if(!this.host.ready())return false;if(this.placing){this.confirmPlace();return true;}
  if(this.markerBed!==null){this.placeItem(this.point);return true;}const actor=this.host.actor();if(this.serviceAt(actor,true))return true;
  const bed=this.committed().filter(b=>this.distance(actor,b.area)<55).sort((a,b)=>this.distance(actor,a.area)-this.distance(actor,b.area))[0];if(!bed)return false;this.inspectBed(bed);return true;
 }
 private announce(previous:number){for(let level=previous+1;level<=this.garden.level;level++){const mix=Object.values(bedMixes).find(m=>m.level===level);if(mix)this.host.celebrate(level,{...mix,composition:recommendedComposition(Object.keys(bedMixes).find(id=>bedMixes[id as BedMix]===mix) as BedMix)});}}
 private inspectBed(bed:TrialBed){if(this.active!==bed)this.mixDraft=null;this.active=bed;const previous=this.garden.level,xp=this.garden.snapshot.skill.xp,observed=this.garden.observe(bed);this.showProgress(xp);this.announce(previous);this.message=observed.text;if(observed.text)this.host.thought(observed.text);this.open('bed');}
 private apply(next:LivingBed|null,tool:'hoe'|'hand'|'water'|'harvest'|'crowbar',action:string){if(!next||!this.near()||!this.host.ready())return;const previousLevel=this.garden.level,previousXp=this.garden.snapshot.skill.xp,plant=this.state.plants[this.selected],point=livingPlantPoint(this.selected,this.area);if(action==='harvest'&&plant)this.gain(plant.kind,Math.max(0,(next.basket[plant.kind]??0)-(this.state.basket[plant.kind]??0)),point,bedKinds[plant.kind].name);if(action==='seeds'&&plant)this.gain(plant.kind,1,point,bedKinds[plant.kind].name+'mag',true);this.garden.accept(this.active,next,action,this.selected);this.showProgress(previousXp);this.announce(previousLevel);this.message='';this.host.work(livingPlantPoint(this.selected,this.area),tool);this.paint();this.render();}
 private mulch(){const next=mulchLivingBed(this.state);if(!next||!this.near()||!this.host.ready())return;if(!this.garden.useMulch()){this.message='A Komposztálóban gazból készíthetsz mulcsot.';if(this.isOpen)this.render();return;}this.apply(next,'hand','mulch');}
 private runtimeItems():RuntimePlacedItems{return {items:[...this.committed().flatMap(b=>[...(b.marker?[{kind:'bedMarker' as const,index:b.id,...b.marker,name:'Ágyásjelölő'}]:[]),...(b.irrigation?[{kind:'bedIrrigation' as const,index:b.id,...b.irrigation,name:'Öntözőrendszer'}]:[])]),...this.garden.paths.map((p,index)=>({kind:'gardenPath' as const,index,x:p.x,y:p.y,name:pathMaterials[p.material].name}))],pickup:(item:PlacedItem)=>{if(item.kind==='gardenPath'){const [piece]=this.garden.paths.splice(item.index,1),supplies=pathSupplies[piece.material];this.pathCredits[piece.material]++;if(this.pathCredits[piece.material]>=supplies.batch){this.garden.snapshot.clearing[supplies.material]++;this.gain(supplies.material,1,item,supplies.material==='stone'?'Kő':'Fa');this.pathCredits[piece.material]-=supplies.batch;}}else{const bed=this.garden.beds.find(b=>b.id===item.index);if(!bed)return null;if(item.kind==='bedMarker'){bed.marker=null;this.garden.packedMarkers.push(bed.id);}else if(item.kind==='bedIrrigation'){bed.irrigation=null;this.garden.snapshot.travel.crafting!.items.irrigation++;}else return null;}return this.garden.snapshot;}};}
 private pickup(point:GardenPoint){const snapshot=this.garden.snapshot;const actor=this.host.actor();snapshot.player={x:actor.x,y:actor.y};const runtime=this.runtimeItems(),item=placedItemAt(snapshot,point,runtime);if(!item)return false;const result=pickPlacedItem(snapshot,item,runtime);if('error'in result)this.message=result.error;else{this.garden.snapshot=result.state;if(item.kind==='bedMarker'){this.markerBed=item.index;this.tool='marker';this.resetPlacementUI();}this.message=item.kind==='gardenPath'?'Az útelem újra felhasználható.':`${item.name} a Készletbe került.`;this.host.work(point,'crowbar');}this.paint();this.render();return true;}
 private decorationFree(point:GardenPoint,rx:number,ry:number){return gardenDecorationFits(point,rx,ry)&&!this.committed().some(b=>this.distance(point,b.area)<Math.max(rx,ry)+4)&&!this.runtimeItems().items.some(p=>Math.hypot(p.x-point.x,p.y-point.y)<(p.kind==='gardenPath'&&rx<=7?14:Math.max(rx,ry)+14))&&!this.garden.snapshot.travel.crafting?.machines.some(p=>Math.hypot(p.x-point.x,p.y-point.y)<Math.max(rx,ry)+24)&&!this.garden.snapshot.skill.chests?.placed.some(p=>Math.hypot(p.x-point.x,p.y-point.y)<Math.max(rx,ry)+24);}
 private canPlaceItem(point:GardenPoint){
  if(Math.hypot(point.x-this.host.actor().x,point.y-this.host.actor().y)>90)return false;
  if(this.tool==='marker'){const id=this.markerBed??this.garden.packedMarkers[0],bed=this.garden.beds.find(b=>b.id===id);return !!bed&&this.garden.packedMarkers.includes(bed.id)&&bedMarkerFits(point,bed.area)&&!this.committed().some(b=>b!==bed&&this.distance(point,b.area)<36)&&!this.runtimeItems().items.some(p=>Math.hypot(p.x-point.x,p.y-point.y)<40)&&!this.garden.snapshot.travel.crafting?.machines.some(p=>Math.hypot(p.x-point.x,p.y-point.y)<50)&&!this.garden.snapshot.skill.chests?.placed.some(p=>Math.hypot(p.x-point.x,p.y-point.y)<50);}
  if(this.tool==='irrigation')return !!this.garden.snapshot.travel.crafting?.items.irrigation&&this.committed().some(b=>nearBedSide(point,b.area)&&!b.irrigation)&&this.decorationFree(point,8,8);
  if(this.tool==='composter')return !!this.garden.snapshot.travel.crafting?.items.composter&&this.decorationFree(point,18,18);
  if(this.tool==='chest')return !!this.garden.snapshot.skill.chests?.packed&&this.decorationFree(point,18,15);
  return false;
 }
 private placeItem(point:GardenPoint){if(!this.canPlaceItem(point))return;
  if(this.tool==='marker'){const id=this.markerBed??this.garden.packedMarkers[0],bed=this.garden.beds.find(b=>b.id===id);if(!bed||!this.garden.packedMarkers.includes(bed.id)||!bedMarkerFits(point,bed.area)||this.committed().some(b=>b!==bed&&this.distance(point,b.area)<36)||this.runtimeItems().items.some(p=>Math.hypot(p.x-point.x,p.y-point.y)<40)||this.garden.snapshot.travel.crafting?.machines.some(p=>Math.hypot(p.x-point.x,p.y-point.y)<50))return;bed.marker={...point};this.garden.packedMarkers.splice(this.garden.packedMarkers.indexOf(bed.id),1);this.markerBed=null;this.tool='harvest';this.host.equip('harvest');}
  else if(this.tool==='irrigation'){const bed=this.committed().find(b=>nearBedSide(point,b.area)&&!b.irrigation);if(!bed||!this.decorationFree(point,8,8)||!this.garden.snapshot.travel.crafting?.items.irrigation)return;bed.irrigation={...point};this.garden.snapshot.travel.crafting.items.irrigation--;}
  else if(this.tool==='composter'){if(!this.decorationFree(point,18,18)||!this.garden.snapshot.travel.crafting?.items.composter)return;this.garden.snapshot.travel.crafting.items.composter--;this.garden.snapshot.travel.crafting.machines.push({kind:'composter',...point,started:null,ready:0});}
  else if(this.tool==='chest'){const chests=this.garden.snapshot.skill.chests;if(!chests?.packed||!this.decorationFree(point,18,15))return;chests.packed--;chests.placed.push({...point,items:{}});}
  this.tool='harvest';this.host.equip('harvest');this.paint();this.render();
 }
 private extendPath(point:GardenPoint){const before=this.stroke.length;this.stroke=extendGardenPath(this.stroke,point,pathMaterials[this.pathMaterial].spacing);if(before&&!this.stroke.length)this.drawing=false;}
 private draftPath(){return makeGardenPath(this.stroke,this.pathMaterial,this.garden.paths,farmLayout.paths);}
 private pathValid(){return this.draftPath().every(piece=>{
  const poly=pathFootprint(piece),xs=poly.map(p=>p.x),ys=poly.map(p=>p.y),x=(Math.min(...xs)+Math.max(...xs))/2,y=(Math.min(...ys)+Math.max(...ys))/2,rx=(Math.max(...xs)-Math.min(...xs))/2,ry=(Math.max(...ys)-Math.min(...ys))/2;
  if(!gardenDecorationFits({x,y},rx,ry,true)||this.committed().some(b=>polygonsOverlap(poly,roundedBedPolygon(b.area))))return false;
  for(const item of this.runtimeItems().items){if(item.kind==='gardenPath')continue;const box=item.kind==='bedMarker'?{x:item.x-34,y:item.y-31,w:68,h:36}:item.kind==='bedIrrigation'?{x:item.x-9,y:item.y-19,w:18,h:23}:null;if(box&&polygonsOverlap(poly,rectanglePolygon(box)))return false;}
  for(const m of this.garden.snapshot.travel.crafting?.machines??[])if(polygonsOverlap(poly,rectanglePolygon({x:m.x-17,y:m.y-25,w:34,h:30})))return false;
  for(const c of this.garden.snapshot.skill.chests?.placed??[])if(polygonsOverlap(poly,rectanglePolygon({x:c.x-17,y:c.y-19,w:34,h:23})))return false;
  return !this.garden.paths.some(q=>q.material!==piece.material&&polygonsOverlap(poly,pathFootprint(q)));
 });}

 endPointer(){if(!this.drawing)return;this.drawing=false;this.paintPreview();}
 endPath(){this.stroke=[];this.drawing=false;this.tool='harvest';this.host.equip('harvest');this.paintPreview();this.renderToolbar();}
 private confirmPath(){const pieces=this.draftPath(),supplies=pathSupplies[this.pathMaterial],cost=gardenPathCost(this.pathMaterial,pieces.length,this.pathCredits[this.pathMaterial]);if(!pieces.length||!this.pathValid()||this.garden.snapshot.clearing[supplies.material]<cost)return;this.garden.snapshot.clearing[supplies.material]-=cost;this.pathCredits[this.pathMaterial]+=cost*supplies.batch-pieces.length;this.garden.paths.push(...pieces);this.stroke=[];this.paint();this.renderToolbar();}
 private paintPreview(){this.preview.clear();if(this.tool==='path'&&!this.placing){
   const pieces=this.draftPath(),supplies=pathSupplies[this.pathMaterial],cost=gardenPathCost(this.pathMaterial,pieces.length,this.pathCredits[this.pathMaterial]),held=this.garden.snapshot.clearing[supplies.material],valid=this.pathValid()&&cost<=held;
   paintGardenPaths(this.preview,pieces,valid?0xdad2a8:0xc16e60,this.garden.paths);this.placementUI.hidden=false;this.placementUI.replaceChildren();this.placementUI.dataset.mode='path';
   const title=document.createElement('strong');title.textContent=`Ösvényépítés · ${pathMaterials[this.pathMaterial].name}`;this.placementUI.append(title);this.text(this.placementUI,'Húzd a vonalat; visszafelé haladva javíthatsz rajta.');
   this.button(this.placementUI,`Lerakom · ${cost} ${supplies.material==='stone'?'kő':'fa'} (${pieces.length} útelem)`,'confirm-path',()=>this.confirmPath(),false,!valid||!pieces.length||this.drawing);
   this.button(this.placementUI,'Utolsó elem visszavonása','undo-path',()=>{this.stroke.pop();this.paintPreview();},false,!this.stroke.length||this.drawing);
   this.button(this.placementUI,'Rajz törlése','cancel-path',()=>{this.stroke=[];this.drawing=false;this.paintPreview();},false,!this.stroke.length);
   this.button(this.placementUI,'Befejezem','finish-path',()=>this.endPath(),false);return;
  }delete this.placementUI.dataset.mode;
  if(!this.placing&&['marker','irrigation','composter','chest'].includes(this.tool)){const marker=this.tool==='marker',valid=this.canPlaceItem(this.point);this.preview.lineStyle(1,valid?0xe6d8a3:0xc17a69).strokeEllipse(this.point.x,this.point.y,marker?68:32,marker?36:25);if(this.tool==='irrigation'){const target=this.committed().find(b=>nearBedSide(this.point,b.area)&&!b.irrigation);if(target)this.preview.lineStyle(2,0xa7d7d0,.9).strokeRoundedRect(target.area.x-4,target.area.y-4,target.area.w+8,target.area.h+8,12);}}
 }
 private paint(){
  for(const b of this.garden.beds){let art=this.bedsArt.get(b.id);if(!art){art=this.scene.add.graphics().setDepth(1);this.bedsArt.set(b.id,art);}paintLivingBed(art,this.paintState(b),b===this.active?this.selected:-1,b.area,b===this.active&&this.placing?this.fits():true,b===this.active&&this.placing,false);let sign=this.signs.get(b.id);if(!sign){sign=worldText(this.scene,0,0,'Vegyes ágyás',{fontFamily:'Kerti Ceruza',fontSize:'11px',color:'#f2dfb5'}).setOrigin(.5).setRotation(-.055).setDepth(6);this.signs.set(b.id,sign);}sign.setVisible(!!b.marker);if(b.marker)sign.setPosition(b.marker.x,b.marker.y-8).setText(b.state.mix?bedMixes[b.state.mix].name.replace(' ','\n'):'').setFontSize(8);}
  this.decorations.clear();for(const b of this.committed()){if(b.marker)paintMarker(this.decorations,{x:b.marker.x-35,y:b.marker.y-17,w:0,h:0});if(b.irrigation){const p=b.irrigation;this.decorations.fillStyle(0x547e77).fillRect(p.x-4,p.y-15,8,19);this.decorations.fillStyle(0xa7c8b7).fillEllipse(p.x,p.y-16,18,6);}}
  for(const pile of this.garden.snapshot.travel.fallenFruit??[]){for(let i=0;i<Math.min(6,pile.count);i++)this.decorations.fillStyle(i%2?0x9a6951:0xb17a5b).fillEllipse(pile.x+(i%3-1)*5,pile.y+Math.floor(i/3)*3,5,3);}
  this.pathsArt.clear();paintGardenPaths(this.pathsArt,this.garden.paths,undefined,[],farmLayout.paths);
  for(const m of this.garden.snapshot.travel.crafting?.machines??[]){this.decorations.fillStyle(0x795c3b).fillRoundedRect(m.x-17,m.y-25,34,30,3);for(let y=0;y<3;y++)this.decorations.lineStyle(2,0xaf925d).lineBetween(m.x-16,m.y-22+y*10,m.x+16,m.y-22+y*10);if(m.ready)this.decorations.fillStyle(0xc8ad64).fillCircle(m.x+14,m.y-26,4);}
  for(const c of this.garden.snapshot.skill.chests?.placed??[]){this.decorations.fillStyle(0x8b6c44).fillRoundedRect(c.x-17,c.y-19,34,23,3);this.decorations.lineStyle(2,0xc1a76c).strokeRect(c.x-17,c.y-19,34,23);this.decorations.fillStyle(0xd3b77d).fillRect(c.x-2,c.y-9,4,5);}
  this.paintPreview();
 }
 private paintState(bed:TrialBed):LivingBed{return (this.sprayRemaining.get(bed.id)??0)>0?{...bed.state,moisture:2,unwateredDays:1}:bed.state;}
 private gain(kind:BedKind|'stone'|'wood'|'mulch',count:number,point:GardenPoint,label:string,seed=false){if(count<=0)return;if(this.modal?.isOpen)this.gains.push({kind,count,point:{...point},label,seed});else this.host.gain(kind,count,point,label,seed);}
 private showProgress(previous:number){const xp=this.garden.snapshot.skill.xp;if(xp<=previous)return;const p=this.garden.progress;this.progressUntil=this.scene.time.now+5000;this.progressUI.replaceChildren();const title=document.createElement('strong');title.textContent=`Kertészkedés · ${p.level}. szint`;const bar=document.createElement('progress');bar.max=p.required;bar.value=p.current;bar.setAttribute('aria-label','Haladás a következő kertészkedési szint felé');const count=document.createElement('span');count.textContent=p.level>=2?'A 2. szint elérve':`${p.current} / ${p.required} pont`;const gain=document.createElement('b');gain.textContent=`+${xp-previous}`;this.progressUI.append(title,bar,count,gain);if(!matchMedia('(prefers-reduced-motion: reduce)').matches)gain.animate([{opacity:1,transform:'translateY(4px)'},{opacity:0,transform:'translateY(-15px)'}],{duration:1400,fill:'forwards'});}
 private button(parent:HTMLElement,label:string,id:string,run:()=>void,care=true,disabled=false){const b=document.createElement('button');b.type='button';b.textContent=label;b.dataset.bedAction=id;b.dataset.bedCare=String(care);b.dataset.bedUnavailable=String(disabled);b.disabled=disabled;b.onclick=()=>{if(!this.canUse())return;run();};parent.append(b);return b;}
 private text(parent:HTMLElement,text:string){const p=document.createElement('p');p.textContent=text;parent.append(p);return p;}
 private renderToolbar(){
  for(const {button}of this.toolbarState){button.disabled=this.markerBed!==null;button.setAttribute('aria-pressed',String(button.dataset.tool===this.tool));}
  this.seedControl?.remove();this.seedControl=null;
  if(!this.isOpen||this.mode!=='bed'||!this.state.mix)return;
  const wrapper=document.createElement('label');wrapper.id='living-garden-seeds';const icon=seedIcon(this.tool in bedKinds?this.tool as BedKind:'wildflower'),label=document.createElement('span');label.textContent='Vetőmag';wrapper.append(icon,label);wrapper.dataset.active=String(this.tool in bedKinds);const select=document.createElement('select');select.setAttribute('aria-label','A kezelt társítás vetőmagjai');select.add(new Option('Válassz vetőmagot',''));
  for(const kind of bedMixes[this.state.mix].members){const option=new Option(`${bedKinds[kind].name} · ${this.garden.seeds[kind]}`,kind);option.disabled=this.garden.seeds[kind]<1;select.add(option);}if(this.tool in bedKinds)select.value=this.tool;
  select.addEventListener('keydown',e=>e.stopPropagation());select.onchange=()=>{if(select.value)this.setTool(select.value as BedKind);};wrapper.append(select);this.toolbar.append(wrapper);this.seedControl=wrapper;
 }

 private render(){
  this.renderToolbar();this.panel.replaceChildren();this.panel.dataset.mix=this.state.mix??'';this.panel.dataset.mode='bed';
  const titles:Record<PanelMode,string>={bed:this.state.mix?bedMixes[this.state.mix].name:this.state.prepared?'Növénytársítás választása':'Ágyás kialakítása',catalog:'Magkatalógus',mail:'Nézzük a postát.',composter:'Komposztáló',inventory:'Készlet',plans:'Tervrajzok',simon:'Műhelybolt',notebook:'Kerti megfigyelések',people:'Ismerősök',skills:'Jártasságok',goals:'Célok',rest:'Otthon'};
  let content:HTMLElement;
  if(this.mode==='bed'){const header=document.createElement('header'),title=document.createElement('h2');title.textContent=titles.bed;header.append(title);this.panel.append(header);content=document.createElement('div');content.className='bed-content';this.panel.append(content);}else content=this.modal.open(this.mode,titles[this.mode]);
  if(this.message)this.text(content,this.message);
  if(this.mode==='bed')this.renderBed(content);
  if(this.mode==='catalog'){this.renderCatalog(content);document.querySelector('#dialogue-close')!.textContent=this.orderedInCatalog?'Tovább':'Vissza';}
  if(this.mode==='rest'){this.text(content,'Lepihensz reggelig?');this.button(content,'Pihenés reggelig','rest',()=>this.host.rest(),false);}
  if(this.mode==='mail'){
   const waiting=Object.entries(this.garden.mailbox).filter(([,n])=>n>0);
   for(const [kind,count]of waiting){const card=document.createElement('span');card.className='mail-seed-card';card.dataset.mailCrop=kind;const label=document.createElement('span');label.textContent=`${bedKinds[kind as BedKind].name} · ${kind==='strawberry'?'palánta':'mag'}: ${count} db`;card.append(seedIcon(kind as BedKind),label);content.append(card);}
   if(!waiting.length)this.text(content,Object.values(this.garden.pending).some(n=>n>0)?'A rendelésed úton van, holnap reggel érkezik.':'Most nincs csomag a postaládában.');
   if(waiting.length)this.button(content,'Átveszem a csomagot','collect-mail',()=>{if(this.garden.collectMail())this.message='A csomag átvéve.';this.render();},false);
  }
  if(this.mode==='composter')this.renderComposter(content);
  if(this.mode==='notebook'){if(!this.garden.observations.length)this.text(content,'Még nincs feljegyzett felismerés.');for(const note of this.garden.observations){const card=document.createElement('article');card.className='garden-observation';card.dataset.observation=note.id;const title=document.createElement('h3');title.textContent=note.title;card.append(observationSketch(note.id),title);this.text(card,`${note.earlierDay}. nap → ${note.day}. nap`);this.text(card,note.text);content.append(card);}}
  if(this.mode==='inventory')this.renderInventory(content);
  if(this.mode==='plans'||this.mode==='simon')this.renderPlans(content,this.mode==='simon');
  if(this.mode==='skills'){const p=this.garden.progress,card=document.createElement('article');card.className='skill-card';const heading=document.createElement('h3');heading.textContent=`Kertészkedés · ${p.level}. szint`;card.append(heading);const bar=document.createElement('progress');bar.max=p.required;bar.value=p.current;bar.setAttribute('aria-label','Kertészkedési jártasság');card.append(bar);this.text(card,p.level>=2?'A 2. szint elérve':`${p.current} / ${p.required} pont a következő szintig`);for(const mix of Object.values(bedMixes)){if(mix.level>p.level)continue;const name=document.createElement('strong');name.textContent=mix.name;card.append(name);this.text(card,mix.members.map(k=>bedKinds[k].name).join(' · '));}content.append(card);}

  if(this.mode==='goals'){const goals=this.host.goals();if(!goals.length)this.text(content,'Jelenleg nincs történeti cél.');for(const goal of goals){const entry=document.createElement('article');entry.className='quest-card';this.text(entry,`${goal.done?'✓ ':''}${goal.title}`);if(goal.detail)this.text(entry,goal.detail);content.append(entry);}}
  if(this.mode==='people'){for(const [known,name]of [[this.garden.snapshot.travel.metAnnie,'Annie'],[this.garden.snapshot.travel.metLeo,'Leo'],[this.garden.snapshot.travel.metSimon,'Simon']] as const)if(known){const card=document.createElement('article');card.className='person-card';this.text(card,name);content.append(card);}}
  if(this.mode==='bed'){const footer=document.createElement('footer');footer.className='bed-time';if(this.mixDraft&&!this.state.mix)this.button(footer,'Vissza','change-mix',()=>{this.mixDraft=null;this.render();},false);this.button(footer,'Tovább','close',()=>this.closePanel(),false);this.panel.append(footer);}
  this.renderLearningHelp(content);
 }
 private renderLearningHelp(content:HTMLElement){
  this.learningHelp.element.remove();
  if(this.placing||this.markerBed!==null){this.learningHelp.show(this.placementUI,this.placing?'placement':'marker');this.placementUI.prepend(this.learningHelp.element);return;}
  if(this.mode!=='bed'||!this.isOpen)return;
  const topic:GardenHelpTopic=!this.state.prepared?'prepare':!this.state.mix?'sow':this.state.plants.some(p=>p.removed)?'replant':this.state.plants.some(p=>bedPlantStage(p)==='ready'||bedPlantStage(p)==='seed')?'harvest':'care';
  this.learningHelp.show(content,topic);
 }
 private renderComposter(content:HTMLElement){if(this.message==='A mulcs a Készletbe került.')this.button(content,'Megnyitom a Készletet','compost-inventory',()=>this.open('inventory'),false);const machine=this.garden.snapshot.travel.crafting?.machines[this.machineIndex];if(machine?.kind!=='composter')return;if(machine.ready||machine.started!==null){this.text(content,machine.ready?`Átvehető: ${machine.ready} mulcs`:'Készül…');this.button(content,'Átveszem','compost',()=>{const before=this.garden.mulch;if(this.garden.compost(this.machineIndex)){const gained=this.garden.mulch-before;if(gained>0){this.gain('mulch',gained,machine,'Mulcs');this.message='A mulcs a Készletbe került.';}}this.paint();this.render();},false,!machine.ready);}else for(const input of ['weed','fallenFruit'] as const){const held=input==='weed'?this.garden.snapshot.clearing.weed:this.garden.snapshot.travel.crafting?.items.fallenFruit??0;this.text(content,`${input==='weed'?'Gaz':'Túlérett gyümölcs'}: ${held} / 10 → 4 mulcs`);this.button(content,'Elindítom',input==='weed'?'compost':'compost-fruit',()=>{this.garden.compost(this.machineIndex,input);this.paint();this.render();},false,held<10);}}

 private renderCatalog(content:HTMLElement){
  this.text(content,`${this.garden.snapshot.economy.gold} gold`);
  for(const id of Object.keys(bedMixes) as BedMix[]){const mix=bedMixes[id];if(mix.level>this.garden.level)continue;
   const detail=document.createElement('details');detail.className='garden-catalog-mixture';detail.dataset.catalogMix=id;detail.open=this.catalogMix===id;detail.setAttribute('name','garden-seed-mixtures');
   const summary=document.createElement('summary'),name=document.createElement('strong'),members=document.createElement('span');name.textContent=mix.name;members.textContent=mix.members.map(k=>bedKinds[k].name).join(' · ');summary.append(name,members);detail.append(summary);this.text(detail,`Ajánlott arány: ${recommendedComposition(id)}. A kilenc hely a társítás növényei között szabadon felosztható.`);detail.addEventListener('toggle',()=>{if(detail.open)this.catalogMix=id;});
   const inputs=new Map<BedKind,HTMLInputElement>();
   for(const kind of mix.members){const row=document.createElement('div');row.className='catalog-row';this.text(row,`${bedKinds[kind].name} · ${trialSeedPrices[kind]} gold / mag`);const input=document.createElement('input');input.type='number';input.min='0';input.max='999';input.value='0';input.dataset.catalogSeed=kind;input.setAttribute('aria-label',`${bedKinds[kind].name} rendelési mennyisége`);row.append(input);inputs.set(kind,input);this.text(row,`Nálad: ${this.garden.seeds[kind]} · Úton: ${this.garden.pending[kind]} · Postán: ${this.garden.mailbox[kind]}`);detail.append(row);}
   const cart=()=>{const result=emptyBedSeeds();for(const [kind,input]of inputs)result[kind]=input.valueAsNumber;return result;};
   const buy=this.button(detail,'Megrendelem',`order-mixture-${id}`,()=>{if(this.garden.orderMany(cart())){this.orderedInCatalog=true;this.catalogMix=id;this.message='A rendelés másnap a postaládába érkezik.';this.render();}},false,true);
   const update=()=>{const quantities=cart(),cost=Object.entries(quantities).reduce((sum,[kind,n])=>sum+n*trialSeedPrices[kind as BedKind],0),invalid=Object.values(quantities).some(n=>!Number.isSafeInteger(n)||n<0||n>999);buy.textContent=`${Number.isFinite(cost)?cost:'—'} gold · Megrendelem`;buy.dataset.bedUnavailable=String(invalid||cost<=0||cost>this.garden.snapshot.economy.gold);buy.disabled=buy.dataset.bedUnavailable==='true';};
   for(const input of inputs.values())input.addEventListener('input',update);update();content.append(detail);
  }
 }
 private renderBed(content:HTMLElement){
  const s=this.state;this.text(content,`${s.moisture} / 3 nedvesség${s.mulched?' · Mulccsal takarva':''}${this.active.irrigation?' · Öntözőrendszerrel':''}`);
  if(!s.prepared){this.button(content,'Ágyás kialakítása','prepare',()=>this.apply(prepareLivingBed(this.state),'hoe','prepare'));return;}
  if(!s.mix){this.renderComposition(content);return;}
  if(!s.mulched)this.button(content,`Mulcsozás · ${this.garden.mulch} / 1`,'mulch',()=>this.mulch(),true,!this.garden.mulch);
  const planted=s.plants.map((p,i)=>({p,i})).filter(({p})=>!p.removed);
  if(planted.length){const select=document.createElement('select');select.id='bed-plant-select';select.setAttribute('aria-label','Beültetett növény');select.add(new Option('Növény kiválasztása',''));for(const {i,p}of planted)select.add(new Option(`${i+1} · ${bedKinds[p.kind].name}`,String(i)));select.value=s.plants[this.selected]?.removed?'':String(this.selected);select.addEventListener('keydown',e=>e.stopPropagation());select.onchange=()=>{this.selected=select.value===''?-1:Number(select.value);this.paint();this.render();};content.append(select);}
  const p=s.plants[this.selected];if(!p||p.removed)return;const stage=bedPlantStage(p);
  this.text(content,stage==='empty'?'A virágokból most nem fejlődött gyümölcs.':stage==='overripe'?'A leszedetlen eper túlérett.':stage==='ready'?'Szedhető':stage==='seed'?'Magot érlelt':stage==='flowering'?'Virágzik':'Növekszik');
  if(stage==='ready'&&bedSeedMethod(p.kind)!=='none')this.button(content,p.kind==='pea'?'Hüvelyeket szárítok':'Magot érlelni hagyom','flower',()=>this.apply(flowerLivingPlant(this.state,this.selected),'hand','flower'));
 }
 private renderComposition(content:HTMLElement){
  if(!this.mixDraft){for(const id of Object.keys(bedMixes) as BedMix[]){const mix=bedMixes[id];if(mix.level>this.garden.level)continue;this.button(content,mix.name,`choose-${id}`,()=>{this.mixDraft=id;this.draftCounts=recommendedBedCounts(id);this.render();},true,mix.level>this.garden.level);}return;}
  const mix=this.mixDraft,inputs=new Map<BedKind,HTMLInputElement>();this.text(content,bedMixes[mix].name);this.text(content,`Ajánlott arány: ${recommendedComposition(mix)}. A kilenc hely a társítás növényei között szabadon felosztható.`);
  for(const kind of bedMixes[mix].members){const label=document.createElement('label');label.className='bed-composition-row';label.append(document.createTextNode(`${bedKinds[kind].name} · nálad ${this.garden.seeds[kind]}`));const input=document.createElement('input');input.type='number';input.min='0';input.max='9';input.value=String(this.draftCounts[kind]);input.dataset.bedCount=kind;input.setAttribute('aria-label',`${bedKinds[kind].name} választott darabszáma`);label.append(input);inputs.set(kind,input);content.append(label);}
  const total=this.text(content,''),plant=this.button(content,'Beültetem',`plant-${mix}`,()=>{const plants=composeLivingBed(mix,this.draftCounts);if(plants)this.apply(plantLivingBed(this.state,mix,plants),'hand','plant');});
  const update=()=>{for(const [kind,input]of inputs)this.draftCounts[kind]=input.valueAsNumber;const plants=composeLivingBed(mix,this.draftCounts);const sum=Object.values(this.draftCounts).reduce((a,b)=>a+b,0);total.textContent=`${Number.isFinite(sum)?sum:'—'} / 9 hely`;plant.dataset.bedUnavailable=String(!plants||!plantLivingBed(this.state,mix,plants));plant.disabled=plant.dataset.bedUnavailable==='true';};
  for(const input of inputs.values())input.addEventListener('input',update);update();
 }

 private renderInventory(content:HTMLElement){
  const grid=document.createElement('div');grid.className='backpack-grid';
  const card=(name:string,count:number,icon:Parameters<typeof itemIcon>[0],action?:{label:string;run:()=>void;id:string},seed?:BedKind)=>{if(!count)return;const node=document.createElement('div');node.className='inventory-card backpack-slot';node.dataset.item=name;const label=document.createElement('span');label.className='backpack-item-name';label.textContent=name;const amount=document.createElement('strong');amount.className='stack-count';amount.textContent=String(count);const glyph=seed?seedIcon(seed):itemIcon(icon);node.append(glyph,label,amount);if(action)this.button(node,action.label,action.id,action.run,false);grid.append(node);};
  for(const kind of Object.keys(bedKinds) as BedKind[])card(bedKinds[kind].name,this.garden.seeds[kind],'thyme',undefined,kind);
  for(const kind of Object.keys(bedKinds) as BedKind[])card(bedKinds[kind].name,this.garden.basket[kind],kind,(isFood(kind)&&(this.garden.snapshot.travel.forest?.health??5)<5)?{label:'Eszem',id:`eat-${kind}`,run:()=>{this.garden.eat(kind);this.render();}}:undefined);
  const items=this.garden.snapshot.travel.crafting!.items;for(const kind of ['composter','irrigation'] as const)card(blueprintNames[kind],items[kind],kind,{label:'Elhelyezem',id:`place-${kind}`,run:()=>this.setTool(kind)});
  card('Tárolóláda',this.garden.snapshot.skill.chests?.packed??0,'chest',{label:'Elhelyezem',id:'place-chest',run:()=>this.setTool('chest')});
  card('Mulcs',this.garden.mulch,'mulch');card('Kő',this.garden.stone,'stone');card('Fa',this.garden.snapshot.clearing.wood,'wood');card('Gaz',this.garden.snapshot.clearing.weed,'weed');card('Ócskavas',this.garden.snapshot.travel.research.materials.scrap,'scrap');card('Rézcső',this.garden.snapshot.travel.research.materials.copper,'copperPipe');card('Fogaskerék',items.gear,'gear');
  content.append(grid);this.button(content,'Kerti megfigyelések','notebook',()=>this.open('notebook'),false);this.button(content,'Simon · Vásárlás','simon',()=>this.open('simon'),false);
 }

 private renderPathPlan(content:HTMLElement){
  const card=document.createElement('article');card.className='inventory-card craft-recipe garden-path-card';card.dataset.blueprint='paths';
  const title=document.createElement('strong');title.textContent='Ösvény';let icon=gardenPathIcon(this.pathMaterial);card.append(icon,title);
  const label=document.createElement('label');label.textContent='Burkolat';const select=document.createElement('select');select.setAttribute('aria-label','Ösvény burkolata');for(const [id,material]of Object.entries(pathMaterials))select.add(new Option(material.name,id));select.value=this.pathMaterial;
  const cost=document.createElement('p');const update=()=>{this.pathMaterial=select.value as PathMaterial;const nextIcon=gardenPathIcon(this.pathMaterial);icon.replaceWith(nextIcon);icon=nextIcon;const supplies=pathSupplies[this.pathMaterial];cost.textContent=`1 ${supplies.material==='stone'?'kő':'fa'} → ${supplies.batch} ${this.pathMaterial==='stone'?'lépőkő':this.pathMaterial==='wood'?'járódeszka':'rövid útszakasz'}${this.pathCredits[this.pathMaterial]?` · Előkészítve: ${this.pathCredits[this.pathMaterial]}`:''}`;};select.onchange=update;update();label.append(select);card.append(label,cost);
  this.button(card,'Ösvény kialakítása','draw-path',()=>{this.closePanel();this.setTool('path');this.paintPreview();},false,this.placing||this.markerBed!==null);content.append(card);
 }
 private renderPlans(content:HTMLElement,buy:boolean){
  const snapshot=this.garden.snapshot;if(!buy)this.renderPathPlan(content);if(buy)this.text(content,`${snapshot.economy.gold} gold`);
  for(const id of ['composter','basketMaker','beeHabitat','irrigation','chest'] as const){
   const chest=id==='chest',owned=chest?!!snapshot.skill.chestBlueprint:!!snapshot.travel.crafting?.blueprints.includes(id as Blueprint),name=chest?'Tárolóláda':blueprintNames[id];if(!buy&&!owned)continue;
   const card=document.createElement('article');card.className=buy?'shop-card':'inventory-card craft-recipe';const heading=document.createElement('strong');heading.textContent=buy?`${name} tervrajza`:name;const description=document.createElement('div');description.append(heading);card.append(itemIcon(chest?'chest':id),description);
   if(id==='irrigation')this.text(description,'Egy teljes ágyást öntöz meg minden reggel.');
   if(buy){const price=chest?160:recipes[id].price;this.button(card,id==='beeHabitat'?'Nem kapható':owned?'Megvásárolva':`${price} gold · Megveszem`,`buy-${id}`,()=>{const next=chest?null:buyBlueprint(snapshot,id);if(chest){if(snapshot.economy.gold<160||snapshot.skill.chestBlueprint)return;snapshot.economy.gold-=160;snapshot.skill.chestBlueprint=true;}else if(next)this.garden.snapshot=next;this.message='A tervrajz a Tervrajzok fülre került.';this.render();},false,id==='beeHabitat'||owned||snapshot.economy.gold<price);if(owned)this.button(description,'Megnyitom a Tervrajzokat',`view-plan-${id}`,()=>this.open('plans'),false);
   }else{
    const costs=document.createElement('div');costs.className='recipe-costs';if(chest)this.text(costs,`Fa: ${snapshot.clearing.wood} / 20 · Ócskavas: ${snapshot.travel.research.materials.scrap} / 5`);else for(const key of materialKeys)if(recipes[id][key])this.text(costs,`${materialNames[key]}: ${heldMaterial(snapshot,key)} / ${recipes[id][key]}`);card.append(costs);
    this.button(card,'Elkészítem',`craft-${id}`,()=>{const next=chest?craftChest(snapshot):craftMachine(snapshot,id);if(next){this.garden.snapshot=next;this.message='Az elkészült tárgy a Készletbe került.';}this.render();},false,chest?!(snapshot.clearing.wood>=20&&snapshot.travel.research.materials.scrap>=5):!canCraft(snapshot,id));
    this.button(card,'Megnyitom a Készletet',`view-item-${id}`,()=>this.open('inventory'),false);
   }
   content.append(card);
  }
 }

 update(time:number,dialogueOpen:boolean){
  if(this.closed)return;this.progressUI.hidden=dialogueOpen||time>=this.progressUntil;if(!dialogueOpen&&this.gains.length){for(const g of this.gains.splice(0))this.host.gain(g.kind,g.count,g.point,g.label,g.seed);}this.addBedButton.hidden=dialogueOpen;this.addBedButton.disabled=this.placing||this.markerBed!==null||!this.host.ready();this.modal.sync();if(this.isOpen&&!this.near())this.closePanel();const height=this.toolbar.getBoundingClientRect().height;if(height!==this.lastToolbarHeight){this.lastToolbarHeight=height;document.documentElement.style.setProperty('--garden-panel-bottom',`${Math.ceil(height+24)}px`);}
  this.panel.hidden=dialogueOpen||!this.isOpen;const space=this.panel.hidden?0:this.panel.getBoundingClientRect().height+height;if(Math.abs(space-this.lastPanelSpace)>1){this.lastPanelSpace=space;this.host.panelChanged();}
  this.placementUI.hidden=dialogueOpen||(!this.placing&&this.markerBed===null&&this.tool!=='path');
  const button=this.placementUI.querySelector<HTMLButtonElement>('#confirm-living-bed-place');if(button){const valid=this.placing?this.fits():this.markerBed!==null&&this.canPlaceItem(this.point);button.disabled=!valid||!this.host.ready();button.textContent=this.placing?(valid?'Itt jelölöm ki az ágyást':'Itt nem fér el az ágyás'):'Ágyásjelölő lehelyezése';}
  for(const b of Array.from(document.querySelectorAll<HTMLButtonElement>('#living-bed-panel button,#living-garden-window button')))b.disabled=b.dataset.bedUnavailable==='true'||!this.canUse()||(this.mode==='bed'&&b.dataset.bedCare==='true'&&!this.near());
  const seedTool=this.seedControl,base=this.toolbarState[0]?.button.getBoundingClientRect();if(seedTool&&base?.width){seedTool.style.width=`${base.width}px`;seedTool.style.height=`${base.height}px`;}
  const dt=Math.min(100,Math.max(0,time-this.lastSprayTime));this.lastSprayTime=time;this.sprayArt.clear();
  if(!dialogueOpen)for(const bed of this.garden.beds){const remaining=this.sprayRemaining.get(bed.id)??0,p=bed.irrigation,a=bed.area,view=this.scene.cameras.main.worldView;if(!p||remaining<=0||a.x+a.w<view.x||a.x>view.right||a.y+a.h<view.y||a.y>view.bottom)continue;this.sprayRemaining.set(bed.id,Math.max(0,remaining-dt));if(remaining-dt<=0)this.paint();if(remaining>1750)continue;for(let i=0;i<16;i++){const t=(time/950+i/16)%1,end={x:a.x+12+(i*37%(a.w-24)),y:a.y+10+(i*23%(a.h-20))},x=p.x+(end.x-p.x)*t,y=p.y-16+(end.y-p.y+16)*t-Math.sin(t*Math.PI)*28;this.sprayArt.fillStyle(i%2?0xb5e2df:0x77c3d3,.8).fillEllipse(x,y,1.5,3);if(t>.84)this.sprayArt.lineStyle(1,0xaad8d6,.6).strokeEllipse(end.x,end.y,6*t,3*t);}}
  this.visitors.clear();for(const bed of this.committed())if(livingFlowers(bed.state))paintBedVisitors(this.visitors,bed.state,time,bed.area,false);
 }

 destroy(){if(this.closed)return;this.closed=true;window.removeEventListener('keydown',this.onKey,true);this.scene.events.off('shutdown',this.destroy,this);for(const art of this.bedsArt.values())art.destroy();for(const sign of this.signs.values())sign.destroy();this.sprayArt.destroy();this.pathsArt.destroy();this.decorations.destroy();this.visitors.destroy();this.preview.destroy();this.panel.remove();this.progressUI.remove();this.learningHelp.destroy();this.addBedButton.remove();this.modal.destroy();this.seedControl?.remove();for(const {button,hidden,disabled,pressed}of this.toolbarState){button.hidden=hidden;button.disabled=disabled;if(pressed===null)button.removeAttribute('aria-pressed');else button.setAttribute('aria-pressed',pressed);}this.placementUI.remove();document.documentElement.style.removeProperty('--garden-panel-bottom');}
}
