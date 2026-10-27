import type {Snapshot} from './storage';
import {createForest,forestEnemies} from './forest';

export const isMicroscopeTestFarm=(name:string|null)=>name?.normalize('NFC').trim().toLocaleLowerCase('hu-HU')==='teszt farm';
export function prepareMicroscopeTest(s:Snapshot):Snapshot|null{
 if(!isMicroscopeTestFarm(s.farmName)||!s.travel.research.repaired)return null;
 const next=structuredClone(s),f=next.travel.forest??=createForest();
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
