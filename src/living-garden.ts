import {GARDEN_LEVEL_POINTS,MAX_GARDEN_LEVEL,normalizeGardenProgress,gardenProgress,gardenLevelTarget} from './garden-progression';
import {weatherOnDay} from './weather';
import {extraBedKinds,sharedBedCrops,savedBedCopy,type SavedGarden} from './homestead-state';
import type {GardenPathPiece} from './garden-path';
import {addFruitFall,pickFallenFruit} from './fallen-fruit';
import {consumeFood,isFood} from './food';
import type {Crop} from './gardening';
// Shared garden model. Trial budgets and real persisted inventories remain separate.
import type {Snapshot} from './storage';
import {createCrafting,compostAction,advanceCrafting} from './crafting';
import {gainGardening,createGardenSkill} from './gardening-skill';
import {purchaseSeedOrder} from './orders';
import {bedKinds,bedMixes,emptyBedSeeds,createLivingBed,advanceLivingBed,waterLivingBed,bedWaterSatisfied,type BedKind,type LivingBed} from './living-bed';
import {livingBedArea,livingPlantPoint,type LivingBedArea} from './living-bed-layout';
export type GardenPoint={x:number;y:number};
export type GardenObservation={id:'water-recovery'|'fruit-set';title:string;text:string;day:number;earlierDay:number;bedId:number};
export type TrialBed={id:number;area:LivingBedArea;state:LivingBed;marker:GardenPoint|null;irrigation:GardenPoint|null;completed:number[];watered:boolean};
export const trialSeedPrices:Record<BedKind,number>={radish:5,lettuce:5,pea:15,thyme:5,wildflower:5,oregano:5,sage:5,tomato:15,pepper:15,cucumber:15,strawberry:20,carrot:10,calendula:5,borage:5,chamomile:5,lemonBalm:5,onion:15,potato:10,basil:5,raspberry:20,mint:5,blackberry:20,marigold:5};
export const TRIAL_GARDEN_LEVEL_POINTS=GARDEN_LEVEL_POINTS;
export class LivingGarden{
 private persistent=false;private saved:SavedGarden|null=null;
 snapshot:Snapshot;seeds=emptyBedSeeds();pending=emptyBedSeeds();mailbox=emptyBedSeeds();basket=emptyBedSeeds();beds:TrialBed[]=[];paths:GardenPathPiece[]=[];packedMarkers:number[]=[];nextId=1;completedCycles=0;weather:'sunny'|'rain'='sunny';observations:GardenObservation[]=[];observationMemory=new Map<number,{dryDay?:number;waterDay?:number;blossoms:Record<number,{day:number;cycle:number}>}>();
 constructor(snapshot:Snapshot,persistent=false){this.snapshot=structuredClone(snapshot);this.persistent=persistent;if(persistent)this.readPersistent(snapshot);else this.snapshot.skill=createGardenSkill();this.snapshot.travel.crafting??=createCrafting();}
 get xp(){return this.persistent?this.saved!.points:this.snapshot.skill.xp;}
 get level(){return this.progress.level;}
 get progress(){return gardenProgress(this.xp,this.persistent?this.saved!.levelFloor:0);}
 availableSeeds(){return [...new Set(Object.values(bedMixes).filter(m=>m.level<=this.level).flatMap(m=>m.plants))];}
 addBed(area:LivingBedArea={...livingBedArea}){const bed:TrialBed={id:this.nextId++,area:{...area},state:createLivingBed(this.snapshot.clock.day),marker:null,irrigation:null,completed:[],watered:false};bed.state.seedStock=this.seeds;bed.state.weather=this.weather;this.beds.push(bed);return bed;}
 sync(bed:TrialBed){bed.state.seedStock=this.seeds;return bed.state;}
 credit(keys:string[]){for(const key of keys){if(this.xp>=gardenLevelTarget(MAX_GARDEN_LEVEL))break;if(this.persistent){if(!this.saved!.credited.includes(key)){this.saved!.credited.push(key);this.saved!.points++;}}else if(!this.snapshot.skill.credited.includes(key)){this.snapshot.skill.credited.push(key);this.snapshot.skill.xp++;}}}
 accept(bed:TrialBed,next:LivingBed,action:string,index=0){
  const old=bed.state;this.seeds={...next.seedStock};
  for(const kind of Object.keys(bedKinds) as BedKind[]){const count=Math.max(0,(next.basket[kind]??0)-(old.basket[kind]??0));this.basket[kind]+=count;if(isFood(kind)&&kind in this.snapshot.produce)this.snapshot.produce[kind as Crop]+=count;}
  bed.state=next;
  if(this.persistent&&action==='plant'){const r=this.snapshot.travel.research;for(const [i,p]of next.plants.entries())if(p.kind==='wildflower'&&r.gifted&&r.seeds>0){p.questFlower=true;r.seeds--;r.flowers.push({...livingPlantPoint(i,bed.area),growth:0});}}
  if(this.persistent&&weatherOnDay(this.snapshot.travel.weatherSeed??0,this.snapshot.clock.day)==='rain'&&bed.state.prepared){bed.state=waterLivingBed(bed.state)??bed.state;bed.watered=true;}
  this.syncQuestFlowers();
  const stamp=`trial:${bed.id}:${next.day}:${action}`;
  this.credit([`${stamp}:${action==='harvest'||action==='seeds'||action==='replant'||action==='flower'||action==='support'?index:''}`]);
  if(action==='water'){bed.watered=true;const memory=this.memory(bed);if(old.moisture===0&&memory.dryDay!==undefined)memory.waterDay=next.day;}
  if((action==='harvest'||action==='seeds')&&!bed.completed.includes(index))bed.completed.push(index);
  // Cycle history remains available for observations; level unlocks use points only.
  if(bed.watered&&bed.completed.length===9){this.completedCycles++;bed.completed=[];bed.watered=false;}
 }
 orderMany(cart:Record<BedKind,number>){const available=this.availableSeeds();if((Object.keys(cart) as BedKind[]).some(k=>cart[k]>0&&!available.includes(k)))return false;const next=purchaseSeedOrder(this.snapshot.economy.gold,this.seeds,this.pending,this.mailbox,cart,trialSeedPrices);if(!next)return false;this.snapshot.economy.gold=next.gold;this.pending=next.pending;return true;}
 order(kind:BedKind,amount:number){if(!Number.isSafeInteger(amount)||amount<1)return false;const cart=emptyBedSeeds();cart[kind]=amount;return this.orderMany(cart);}
 collectMail(){if(!Object.values(this.mailbox).some(n=>n>0))return false;if((Object.keys(this.seeds) as BedKind[]).some(k=>this.seeds[k]+this.mailbox[k]>999999))return false;for(const k of Object.keys(this.seeds) as BedKind[])this.seeds[k]+=this.mailbox[k];this.mailbox=emptyBedSeeds();return true;}
 nextDay(weather:'sunny'|'rain'){
  this.snapshot.clock.day++;this.weather=weather;this.snapshot.travel.crafting=advanceCrafting(this.snapshot.travel.crafting,this.snapshot.clock.day);
  for(const k of Object.keys(this.pending) as BedKind[]){this.mailbox[k]+=this.pending[k];this.pending[k]=0;}
  this.growBeds(weather);
 }
 private growBeds(weather:'sunny'|'rain'){
  for(const bed of this.beds){if(weather==='rain'&&bed.state.mix)bed.watered=true;if(bed.irrigation&&!bedWaterSatisfied(bed.state)){bed.state=waterLivingBed(bed.state)??bed.state;bed.watered=true;}bed.state=advanceLivingBed(this.sync(bed),weather,{seed:this.snapshot.travel.weatherSeed??0},`bed:${bed.area.x},${bed.area.y}`);if(bed.irrigation&&!bedWaterSatisfied(bed.state)){bed.state=waterLivingBed(bed.state)??bed.state;bed.watered=true;}for(const [i,p]of bed.state.plants.entries())if(p.aftermath==='overripe'){const point=livingPlantPoint(i,bed.area);addFruitFall(this.snapshot.travel,point.x,point.y,1);}}
  this.syncQuestFlowers();
 }
 compost(index:number,input:'weed'|'fallenFruit'='weed'){const next=compostAction(this.snapshot,index,input);if(!next)return false;this.snapshot=next;return true;}
 collectOverripe(index:number,actor:GardenPoint){const pile=this.snapshot.travel.fallenFruit?.[index];if(!pile||Math.hypot(pile.x-actor.x,pile.y-actor.y)>48)return false;const next=pickFallenFruit(this.snapshot,index);if(!next)return false;this.snapshot=next;return true;}
 eat(kind:BedKind){if(!this.basket[kind])return false;const next=consumeFood(this.persistent?this.writePersistent():this.snapshot,kind);if(!next)return false;this.snapshot=next;this.basket[kind]--;return true;}
 private memory(bed:TrialBed){let memory=this.observationMemory.get(bed.id);if(!memory){memory={blossoms:{}};this.observationMemory.set(bed.id,memory);}return memory;}
 observe(bed:TrialBed):{text:string;discovery:GardenObservation|null}{
  const s=bed.state,memory=this.memory(bed);let discovery:GardenObservation|null=null,text='';
  if(s.plants.length&&s.moisture===0){memory.dryDay??=s.day;text='A levelek lankadnak, a föld felszíne kivilágosodott.';}
  if(memory.waterDay!==undefined&&s.day>memory.waterDay&&s.moisture>0&&!this.observations.some(o=>o.id==='water-recovery'))discovery={id:'water-recovery',title:'A levelek újra feszesek',text:'Öntözés után újra feszesek a korábban lankadt levelek.',day:s.day,earlierDay:memory.dryDay!,bedId:bed.id};
  for(const [i,p]of s.plants.entries())if(['strawberry','raspberry','blackberry'].includes(p.kind)){
   const seen=memory.blossoms[i];if(!discovery&&!this.observations.some(o=>o.id==='fruit-set')&&p.aftermath==='empty'&&seen&&seen.cycle===(p.cycle??0)-1)discovery={id:'fruit-set',title:'Virágok gyümölcs nélkül',text:'A korábban megfigyelt virágok egy részéből nem fejlődött gyümölcs.',day:s.day,earlierDay:seen.day,bedId:bed.id};
   if(p.growth>=2&&p.growth<bedKinds.strawberry.days){memory.blossoms[i]={day:s.day,cycle:p.cycle??0};text||='Az eper virágai már kinyíltak.';}
  }
  if(discovery){text=discovery.text;if(this.observations.some(o=>o.id===discovery!.id))discovery=null;else{this.observations.push(discovery);this.credit([`observation:${discovery.id}`]);}}
  return {text,discovery};
 }
 readPersistent(snapshot:Snapshot){
  const data=snapshot.travel.homestead?.garden;if(!data)throw Error('Hiányzó kertállapot.');this.snapshot=structuredClone(snapshot);this.saved=normalizeGardenProgress(structuredClone(data));this.seeds=emptyBedSeeds();this.basket=emptyBedSeeds();this.pending=emptyBedSeeds();this.mailbox=emptyBedSeeds();
  for(const k of sharedBedCrops){this.seeds[k]=snapshot.seeds[k];this.basket[k]=snapshot.produce[k];this.pending[k]=snapshot.orders.pending[k];this.mailbox[k]=snapshot.orders.mailbox[k];}
  for(const k of extraBedKinds){this.seeds[k]=data.extraSeeds[k]??0;this.basket[k]=data.extraProduce[k]??0;this.pending[k]=data.pending[k]??0;this.mailbox[k]=data.mailbox[k]??0;}
  this.beds=structuredClone(data.beds);this.paths=structuredClone(data.paths);this.packedMarkers=[...data.packedMarkers];this.nextId=data.nextId;this.completedCycles=data.completedCycles;this.observations=structuredClone(data.observations);this.observationMemory=new Map(Object.entries(data.memory).map(([k,v])=>[Number(k),structuredClone(v)]));this.weather=this.beds[0]?.state.weather??'sunny';
 }
 exportPersistent(pathCredits=this.saved!.pathCredits):SavedGarden{
  return{...structuredClone(this.saved!),beds:this.beds.map(savedBedCopy),paths:structuredClone(this.paths),pathCredits:{...pathCredits},packedMarkers:[...this.packedMarkers],nextId:this.nextId,completedCycles:this.completedCycles,observations:structuredClone(this.observations),memory:structuredClone(Object.fromEntries(this.observationMemory)),extraSeeds:Object.fromEntries(extraBedKinds.map(k=>[k,this.seeds[k]])),extraProduce:Object.fromEntries(extraBedKinds.map(k=>[k,this.basket[k]])),pending:Object.fromEntries(extraBedKinds.map(k=>[k,this.pending[k]])),mailbox:Object.fromEntries(extraBedKinds.map(k=>[k,this.mailbox[k]]))};
 }
 writePersistent(pathCredits=this.saved!.pathCredits):Snapshot{
  const next=structuredClone(this.snapshot);next.travel.homestead!.garden=this.exportPersistent(pathCredits);for(const k of sharedBedCrops){next.seeds[k]=this.seeds[k];next.produce[k]=this.basket[k];next.orders.pending[k]=this.pending[k];next.orders.mailbox[k]=this.mailbox[k];}return next;
 }
 advanceMorning(weather:'sunny'|'rain'){
  this.weather=weather;for(const k of extraBedKinds){this.mailbox[k]+=this.pending[k];this.pending[k]=0;}this.growBeds(weather);
 }
 private syncQuestFlowers(){
  if(!this.persistent)return;const r=this.snapshot.travel.research;if(!r.inBeds||!r.gifted||r.observation)return;
  for(const bed of this.beds)for(const [i,p]of bed.state.plants.entries())if(p.questFlower){const point=livingPlantPoint(i,bed.area),f=r.flowers.find(f=>f.x===point.x&&f.y===point.y);if(f)f.growth=Math.max(f.growth,Math.min(3,p.growth));}
  if(r.flowers.length===6&&r.flowers.every(f=>f.growth>=3))r.beeDay??=this.snapshot.clock.day;
 }
 get mulch(){return this.snapshot.travel.crafting?.items.mulch??0;}
 useMulch(){if(!this.mulch)return false;this.snapshot.travel.crafting!.items.mulch--;return true;}
 get stone(){return this.snapshot.clearing.stone;}
}
