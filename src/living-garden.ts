import {addFruitFall,pickFallenFruit} from './fallen-fruit';
import {consumeFood,isFood} from './food';
import type {Crop} from './gardening';
// Disposable garden session. Never serialize these fields into a production save.
import type {Snapshot} from './storage';
import {createCrafting,compostAction,advanceCrafting} from './crafting';
import {gainGardening,createGardenSkill} from './gardening-skill';
import {purchaseSeedOrder} from './orders';
import {bedKinds,bedMixes,emptyBedSeeds,createLivingBed,advanceLivingBed,waterLivingBed,type BedKind,type LivingBed} from './living-bed';
import {livingBedArea,livingPlantPoint,type LivingBedArea} from './living-bed-layout';
export type GardenPoint={x:number;y:number};
export type GardenObservation={id:'water-recovery'|'fruit-set';title:string;text:string;day:number;earlierDay:number;bedId:number};
export type TrialBed={id:number;area:LivingBedArea;state:LivingBed;marker:GardenPoint|null;irrigation:GardenPoint|null;completed:number[];watered:boolean};
export const trialSeedPrices:Record<BedKind,number>={radish:5,lettuce:5,pea:15,thyme:5,wildflower:5,oregano:5,sage:5,tomato:15,pepper:15,cucumber:15,strawberry:20,carrot:10,calendula:5,borage:5,chamomile:5,lemonBalm:5};
export class LivingGarden{
 snapshot:Snapshot;seeds=emptyBedSeeds();pending=emptyBedSeeds();mailbox=emptyBedSeeds();basket=emptyBedSeeds();beds:TrialBed[]=[];stones:GardenPoint[]=[];packedMarkers:number[]=[];nextId=1;completedCycles=0;weather:'sunny'|'rain'='sunny';observations:GardenObservation[]=[];observationMemory=new Map<number,{dryDay?:number;waterDay?:number;blossoms:Record<number,{day:number;cycle:number}>}>();
 constructor(snapshot:Snapshot){this.snapshot=structuredClone(snapshot);this.snapshot.skill=createGardenSkill();this.snapshot.travel.crafting??=createCrafting();}
 get level(){return !this.completedCycles?0:this.snapshot.skill.xp>=40?2:this.snapshot.skill.xp>=20?1:0;}
 availableSeeds(){return [...new Set(Object.values(bedMixes).filter(m=>m.level<=this.level).flatMap(m=>m.plants))];}
 addBed(area:LivingBedArea={...livingBedArea}){const bed:TrialBed={id:this.nextId++,area:{...area},state:createLivingBed(this.snapshot.clock.day),marker:null,irrigation:null,completed:[],watered:false};bed.state.seedStock=this.seeds;bed.state.weather=this.weather;this.beds.push(bed);return bed;}
 sync(bed:TrialBed){bed.state.seedStock=this.seeds;return bed.state;}
 credit(keys:string[]){for(const key of keys)this.snapshot.skill=gainGardening(this.snapshot.skill,key,false)??this.snapshot.skill;}
 accept(bed:TrialBed,next:LivingBed,action:string,index=0){
  const old=bed.state;this.seeds={...next.seedStock};
  for(const kind of Object.keys(bedKinds) as BedKind[]){const count=Math.max(0,(next.basket[kind]??0)-(old.basket[kind]??0));this.basket[kind]+=count;if(isFood(kind)&&kind in this.snapshot.produce)this.snapshot.produce[kind as Crop]+=count;}
  bed.state=next;
  const stamp=`trial:${bed.id}:${next.day}:${action}`;
  if(action==='plant')this.credit(next.plants.map((_,i)=>`${stamp}:${i}`));
  else if(action==='refill')this.credit(old.plants.flatMap((p,i)=>p.removed&&!next.plants[i].removed?[`${stamp}:${i}`]:[]));
  else this.credit([`${stamp}:${action==='harvest'||action==='seeds'||action==='replant'?index:''}`]);
  if(action==='water'){bed.watered=true;const memory=this.memory(bed);if(old.moisture===0&&memory.dryDay!==undefined)memory.waterDay=next.day;}
  if((action==='harvest'||action==='seeds')&&!bed.completed.includes(index))bed.completed.push(index);
  // A complete first cycle is the trial pacing target, independent of click count.
  if(bed.watered&&bed.completed.length===9){this.completedCycles++;bed.completed=[];bed.watered=false;}
 }
 orderMany(cart:Record<BedKind,number>){const available=this.availableSeeds();if((Object.keys(cart) as BedKind[]).some(k=>cart[k]>0&&!available.includes(k)))return false;const next=purchaseSeedOrder(this.snapshot.economy.gold,this.seeds,this.pending,this.mailbox,cart,trialSeedPrices);if(!next)return false;this.snapshot.economy.gold=next.gold;this.pending=next.pending;return true;}
 order(kind:BedKind,amount:number){if(!Number.isSafeInteger(amount)||amount<1)return false;const cart=emptyBedSeeds();cart[kind]=amount;return this.orderMany(cart);}
 collectMail(){if(!Object.values(this.mailbox).some(n=>n>0))return false;if((Object.keys(this.seeds) as BedKind[]).some(k=>this.seeds[k]+this.mailbox[k]>999999))return false;for(const k of Object.keys(this.seeds) as BedKind[])this.seeds[k]+=this.mailbox[k];this.mailbox=emptyBedSeeds();return true;}
 nextDay(weather:'sunny'|'rain'){
  this.snapshot.clock.day++;this.weather=weather;this.snapshot.travel.crafting=advanceCrafting(this.snapshot.travel.crafting,this.snapshot.clock.day);
  for(const k of Object.keys(this.pending) as BedKind[]){this.mailbox[k]+=this.pending[k];this.pending[k]=0;}
  for(const bed of this.beds){if(weather==='rain'&&bed.state.mix)bed.watered=true;if(bed.irrigation){bed.state=waterLivingBed(bed.state)??bed.state;bed.watered=true;}bed.state=advanceLivingBed(this.sync(bed),weather,{seed:this.snapshot.travel.weatherSeed??0},`bed:${bed.area.x},${bed.area.y}`);for(const [i,p]of bed.state.plants.entries())if(p.aftermath==='overripe'){const point=livingPlantPoint(i,bed.area);addFruitFall(this.snapshot.travel,point.x,point.y,1);}}
 }
 compost(index:number,input:'weed'|'fallenFruit'='weed'){const next=compostAction(this.snapshot,index,input);if(!next)return false;this.snapshot=next;return true;}
 collectOverripe(index:number,actor:GardenPoint){const pile=this.snapshot.travel.fallenFruit?.[index];if(!pile||Math.hypot(pile.x-actor.x,pile.y-actor.y)>48)return false;const next=pickFallenFruit(this.snapshot,index);if(!next)return false;this.snapshot=next;return true;}
 eat(kind:BedKind){if(!this.basket[kind])return false;const next=consumeFood(this.snapshot,kind);if(!next)return false;this.snapshot=next;this.basket[kind]--;return true;}
 private memory(bed:TrialBed){let memory=this.observationMemory.get(bed.id);if(!memory){memory={blossoms:{}};this.observationMemory.set(bed.id,memory);}return memory;}
 observe(bed:TrialBed):{text:string;discovery:GardenObservation|null}{
  const s=bed.state,memory=this.memory(bed);let discovery:GardenObservation|null=null,text='';
  if(s.plants.length&&s.moisture===0){memory.dryDay??=s.day;text='A levelek lankadnak, a föld felszíne kivilágosodott.';}
  if(memory.waterDay!==undefined&&s.day>memory.waterDay&&s.moisture>0&&!this.observations.some(o=>o.id==='water-recovery'))discovery={id:'water-recovery',title:'A levelek újra feszesek',text:'Öntözés után újra feszesek a korábban lankadt levelek.',day:s.day,earlierDay:memory.dryDay!,bedId:bed.id};
  for(const [i,p]of s.plants.entries())if(p.kind==='strawberry'){
   const seen=memory.blossoms[i];if(!discovery&&!this.observations.some(o=>o.id==='fruit-set')&&p.aftermath==='empty'&&seen&&seen.cycle===(p.cycle??0)-1)discovery={id:'fruit-set',title:'Virágok gyümölcs nélkül',text:'A korábban megfigyelt virágok egy részéből nem fejlődött gyümölcs.',day:s.day,earlierDay:seen.day,bedId:bed.id};
   if(p.growth>=2&&p.growth<bedKinds.strawberry.days){memory.blossoms[i]={day:s.day,cycle:p.cycle??0};text||='Az eper virágai már kinyíltak.';}
  }
  if(discovery){text=discovery.text;if(this.observations.some(o=>o.id===discovery!.id))discovery=null;else{this.observations.push(discovery);this.credit([`observation:${discovery.id}`]);}}
  return {text,discovery};
 }
 get mulch(){return this.snapshot.travel.crafting?.items.mulch??0;}
 useMulch(){if(!this.mulch)return false;this.snapshot.travel.crafting!.items.mulch--;return true;}
 get stone(){return this.snapshot.clearing.stone;}
}
