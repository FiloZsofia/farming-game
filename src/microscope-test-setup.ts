import type {Snapshot} from './storage';
import {createForest,forestEnemies} from './forest';
import {createResearch} from './research';

export function prepareMicroscopeTest(s:Snapshot):Snapshot|null{
 const next=structuredClone(s),f=next.travel.forest??=createForest();
 if(!next.travel.research.repaired){
  next.clock.day=Math.max(9,next.clock.day);
  const r=createResearch();r.gifted=true;r.flowers=Array.from({length:6},(_,i)=>({x:-168+i*24,y:-96,growth:4}));r.beeDay=9;r.observation={day:9,seasonDay:9,plant:'Tavaszi vadvirágkeverék'};r.key=true;r.shutter=true;r.entranceShutter=true;r.discovered=true;r.repaired=true;r.workshopEntered=true;r.examined=['vat','pipes','filter','coil'];
  next.travel.research=r;
  for(const f of r.flowers){next.plots=next.plots.filter(([key])=>key!==`${f.x},${f.y}`);next.plots.push([`${f.x},${f.y}`,{crop:null,growth:0,watered:false,regrowing:false}]);}
 }
 next.player={x:-910,y:990};next.clock.elapsed=30;
 next.travel.research.microscopeDelivered=false;
 f.sample=false;f.examined=false;f.sent=false;f.focus=0;f.stick=true;f.health=5;f.enemyIntroSeen=true;
 f.defeated=[...new Set([...f.defeated,...forestEnemies.map(e=>e.id)])];f.visitDefeated=forestEnemies.map(e=>e.id);
 if(f.microscopy){
  const m=f.microscopy;m.slides=m.slides.filter(id=>id!=='nest');m.observations=m.observations.filter(o=>o.sample!=='nest');m.photos=m.photos.filter(p=>p.view.sample!=='nest');
  if(m.view.sample==='nest')m.view={sample:m.slides[0]??null,zoom:0,focus:0,x:500,y:350};
 }
 return next;
}
