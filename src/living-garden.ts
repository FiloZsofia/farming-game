import type {GardenObservationId} from './garden-observations';
import {GARDEN_LEVEL_POINTS,MAX_GARDEN_LEVEL,normalizeGardenProgress,gardenProgress,gardenLevelTarget,creditGardenPoint} from './garden-progression';
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
import {bedKinds,bedMixes,emptyBedSeeds,createLivingBed,advanceLivingBed,waterLivingBed,bedWaterSatisfied,livingFlowers,type BedKind,type LivingBed} from './living-bed';
import {livingBedArea,livingPlantPoint,type LivingBedArea} from './living-bed-layout';
export type GardenPoint={x:number;y:number};
export type GardenObservation={id:GardenObservationId;title:string;text:string;day:number;earlierDay:number;bedId:number};
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
 credit(keys:string[]){for(const key of keys){if(this.xp>=gardenLevelTarget(MAX_GARDEN_LEVEL))break;if(this.persistent){creditGardenPoint(this.saved!,key);}else if(!this.snapshot.skill.credited.includes(key)){this.snapshot.skill.credited.push(key);this.snapshot.skill.xp++;}}}
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
  for(const bed of this.beds){if(weather==='rain'&&bed.state.mix)bed.watered=true;if(weather!=='rain'&&bed.irrigation&&!bedWaterSatisfied(bed.state)){bed.state=waterLivingBed(bed.state)??bed.state;bed.watered=true;}bed.state=advanceLivingBed(this.sync(bed),weather,{seed:this.snapshot.travel.weatherSeed??0},`bed:${bed.area.x},${bed.area.y}`);if(weather!=='rain'&&bed.irrigation&&!bedWaterSatisfied(bed.state)){bed.state=waterLivingBed(bed.state)??bed.state;bed.watered=true;}for(const [i,p]of bed.state.plants.entries())if(p.aftermath==='overripe'){const point=livingPlantPoint(i,bed.area);addFruitFall(this.snapshot.travel,point.x,point.y,1);}}
  this.syncQuestFlowers();
 }
 compost(index:number,input:'weed'|'fallenFruit'='weed'){const next=compostAction(this.snapshot,index,input);if(!next)return false;this.snapshot=next;return true;}
 collectOverripe(index:number,actor:GardenPoint){const pile=this.snapshot.travel.fallenFruit?.[index];if(!pile||Math.hypot(pile.x-actor.x,pile.y-actor.y)>48)return false;const next=pickFallenFruit(this.snapshot,index);if(!next)return false;this.snapshot=next;return true;}
 eat(kind:BedKind){if(!this.basket[kind])return false;const next=consumeFood(this.persistent?this.writePersistent():this.snapshot,kind);if(!next)return false;this.snapshot=next;this.basket[kind]--;return true;}
 private memory(bed:TrialBed){let memory=this.observationMemory.get(bed.id);if(!memory){memory={blossoms:{}};this.observationMemory.set(bed.id,memory);}return memory;}
 observe(bed:TrialBed,only?:readonly GardenObservationId[]):{text:string;discovery:GardenObservation|null}{
  const s=bed.state,memory=this.memory(bed),known=(id:GardenObservationId)=>this.observations.some(o=>o.id===id);let discovery:GardenObservation|null=null;
  const note=(id:GardenObservationId,title:string,text:string,earlierDay=s.day)=>{if(!discovery&&!known(id)&&(!only||only.includes(id)))discovery={id,title,text,day:s.day,earlierDay,bedId:bed.id};};
  if(s.plants.length&&s.moisture===0)memory.dryDay??=s.day;
  if(s.coverExpired==='mulch')note('mulch-gone','Eltűnt a mulcstakarás','A mulcs már eltűnt a földről. Újra takarhatom az ágyást; addig az alap öntözési időközzel számolok.');
  if(s.coverExpired==='gravel')note('gravel-gone','Újra látszik a csupasz föld','A kavicstakarás már eltűnt. Újat teríthetek a fűszerek alá; addig ismét kétnaponta kell öntöznöm.');
  const living=s.plants.filter(p=>!p.removed),since=s.wateredDay===undefined?0:s.day-s.wateredDay;
  if(living.length&&s.mix==='herbs'&&s.weather!=='rain'&&since>=1&&bedWaterSatisfied(s)){
   if(s.mulched&&since>=2)note('herb-mulch','Egy nappal tovább őrzött víz','A mulcs alatt ma is nedves maradt a föld. Így a Száraz fűszerszegély öntözése között már három nap is eltelhet.');
   else note('herb-water','A fűszerek jól bírják','A Száraz fűszerszegély növényei ma sem száradtak ki. Ezeknek elég kétnaponta vizet adnom.');
  }

  if(memory.waterDay!==undefined&&s.day>memory.waterDay&&s.moisture>0)note('water-recovery','A levelek újra feszesek','Öntözés után újra feszesek a korábban lankadt levelek.',memory.dryDay!);
  for(const [i,p]of s.plants.entries())if(['strawberry','raspberry','blackberry'].includes(p.kind)){
   const seen=memory.blossoms[i];if(p.aftermath==='empty'&&seen&&seen.cycle===(p.cycle??0)-1)note('fruit-set','Virágok gyümölcs nélkül','A korábban megfigyelt virágok egy részéből nem fejlődött gyümölcs.',seen.day);
   if(p.growth>=2&&p.growth<bedKinds[p.kind].days){memory.blossoms[i]={day:s.day,cycle:p.cycle??0};note('berry-blossoms','Virágba borult bogyósok',`A ${bedKinds[p.kind].name.toLocaleLowerCase('hu-HU')} virágai már kinyíltak. A terméshez a beporzóknak is dolguk lesz.`);}
  }
  if(s.plants.length&&s.moisture===0)note('dry-stress','Száraz föld, lankadó levelek','A levelek lankadnak, a föld felszíne kivilágosodott.');
  if(s.plants.some(p=>p.kind==='pea'&&!p.removed&&p.growth>=bedKinds.pea.days))note('pea-pods','Kirajzolódó borsószemek','A telt hüvelyeken már a borsószemek domborulatai is látszanak.');
  if(s.plants.some(p=>p.regrowing&&p.growth>0&&!p.removed))note('regrowth','A tő tovább él','A szüret után megmaradt tövön újabb termés fejlődik.');
  if(s.trellis||s.plants.some(p=>p.supported))note('supported-stems','Támaszt kapott hajtások','A rögzített hajtások a támasz mentén fejlődhetnek tovább.');
  if((s.mulched||s.cover==='gravel')&&s.wateredDay!==undefined&&s.day>s.wateredDay&&bedWaterSatisfied(s))note('cover-water','A takarás őrzi a nedvességet','A takart föld még megfelelően nedves, pedig ma nem kellett öntözni.',s.wateredDay);
  if(livingFlowers(s)>=2&&s.weather!=='rain')note('pollinator-visits','Élet a virágok között','A nyitott virágok körül apró beporzók mozognak.');
  if(discovery){const found=discovery as GardenObservation;this.observations.push(found);this.credit([`observation:${found.id}`]);return {text:found.text,discovery:found};}
  return {text:'',discovery:null};
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
