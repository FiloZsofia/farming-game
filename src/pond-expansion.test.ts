import {IDBFactory} from 'fake-indexeddb';
import {afterEach,it,expect} from 'vitest';
import {SaveStore,snapshot,validSnapshot,decodeSnapshot} from './storage';
import {createGarden} from './gardening';
import {createClock} from './clock';
import {activeDebris} from './cleanup';
import {smoothPondExpansion,brushPond,bindPondExpansion,pondArea,ORIGINAL_POND_AREA,pondOutline,validPondExpansion,POND_SECTORS,pondWaterAt} from './pond-shape';
import {pondRefund,removePondExpansion,settlePondShore,expandPond,pondExpansionCost,pondExpansionError} from './pond-expansion';
import {placeGood,waterAt} from './estate';
import {blocked} from './movement';
function clean(){const garden=createGarden(),s=snapshot({x:330,y:260},createClock(10),garden);s.economy.gold=5000;s.clearing.stone=500;for(const d of activeDebris(s.clearing,garden))s.clearing.removed[d.id]=1;return s;}
const east=()=>brushPond([],{x:800,y:464},28)!;
afterEach(()=>bindPondExpansion(()=>[]));
it('creates connected, bounded water and rejects disconnected or oversized drafts',()=>{
 const d=east();expect(validPondExpansion(d)).toBe(true);expect(pondArea(d)).toBeGreaterThan(ORIGINAL_POND_AREA);expect(brushPond([],{x:1100,y:400},20)).toBeNull();expect(validPondExpansion(Array(64).fill(101))).toBe(false);expect(validPondExpansion(Array(64).fill(100))).toBe(false);expect(validPondExpansion(Array(63).fill(0))).toBe(false);
 for(const p of pondOutline(d))expect(p.y).toBeLessThan(576);
});
it('charges proportional agreed costs once and preserves the original state and pond items',()=>{
 const s=clean(),d=east(),price=pondExpansionCost([],d);s.travel.estate.pond.push({kind:'lily',x:630,y:465,day:1});const before=structuredClone(s),next=expandPond(s,d)!;
 expect(next).not.toBeNull();expect(next.economy.gold).toBe(s.economy.gold-price.gold);expect(next.clearing.stone).toBe(s.clearing.stone-price.stone);expect(next.travel.estate.pond).toEqual(s.travel.estate.pond);expect(s).toEqual(before);expect(expandPond(next,d)).toBeNull();expect(validSnapshot(next)).toBe(true);expect(decodeSnapshot(next)).toEqual(next);
 const ten=Array.from({length:POND_SECTORS},(_,i)=>{const p=pondOutline([])[i];return Math.hypot(p.x-638,p.y-464)*(Math.sqrt(1.1)-1);});const cost=pondExpansionCost([],ten);expect(cost.percent).toBeCloseTo(10,8);expect(cost.gold).toBeLessThanOrEqual(96);expect(cost.gold).toBeGreaterThanOrEqual(95);expect(cost.stone).toBeGreaterThanOrEqual(16);expect(cost.stone).toBeLessThanOrEqual(17);
});
it('protects buildings, the player, plants and placed items, and refuses insufficient funds',()=>{
 const s=clean(),d=east();s.player={x:805,y:464};expect(pondExpansionError(s,d)).not.toBeNull();expect(expandPond(s,d)).toBeNull();s.player={x:330,y:260};s.travel.estate.trees.push({kind:'apple',x:805,y:450,planted:1,last:0,fruit:0});expect(expandPond(s,d)).toBeNull();s.travel.estate.trees=[];s.economy.gold=0;expect(expandPond(s,d)).toBeNull();
});
it('shares new water with collision and planting while validating other farms independently',()=>{
 const d=east();bindPondExpansion(()=>d);expect(waterAt(800,464)).toBe(true);expect(blocked(800,464)).toBe(true);expect(pondWaterAt(800,464,[])).toBe(false);
 const old=clean();old.player={x:806,y:464};expect(validSnapshot(old)).toBe(true);const flooded=structuredClone(old);flooded.travel.estate.pondExpansion=d;expect(validSnapshot(flooded)).toBe(false);
 const estate=clean().travel.estate;estate.pondExpansion=d;estate.goods.lily=1;expect(placeGood(estate,'lily',800,464,10,false)?.pond.at(-1)?.x).toBe(800);
});

it('rounds a jagged extension without changing its paid area',()=>{
 const raw=Array.from({length:64},(_,i)=>i<5||i>59?55:0),smoothed=smoothPondExpansion(raw);
 const bend=(a:number[])=>a.reduce((n,v,i)=>n+Math.abs(a[(i+63)%64]-2*v+a[(i+1)%64]),0);
 expect(bend(smoothed)).toBeLessThan(bend(raw)*.3);expect(pondArea(smoothed)).toBeCloseTo(pondArea(raw),6);expect(validPondExpansion(smoothed)).toBe(true);
});
it('keeps existing water when rounding a new preview and prices that same area',()=>{
 const before=smoothPondExpansion(east()),raw=brushPond(before,{x:812,y:450},28)!;
 const draft=smoothPondExpansion(raw,before);expect(draft.every((n,i)=>n>=before[i])).toBe(true);expect(pondArea(draft)).toBeCloseTo(pondArea(raw),6);expect(pondExpansionCost(before,draft)).toEqual(pondExpansionCost(before,raw));
});
it('automatically settles old shorelines once, with no payment or item changes',()=>{
 const old=clean();old.travel.estate.pondExpansion=east();old.travel.estate.pond.push({kind:'lily',x:640,y:460,day:1});const copy=structuredClone(old),next=settlePondShore(old);
 expect(next.travel.estate.pondSmoothed).toBe(true);expect(next.travel.estate.pondExpansion).not.toEqual(old.travel.estate.pondExpansion);expect(pondArea(next.travel.estate.pondExpansion)).toBeCloseTo(pondArea(old.travel.estate.pondExpansion),6);
 expect(next.economy).toEqual(old.economy);expect(next.clearing).toEqual(old.clearing);expect(next.travel.estate.pond).toEqual(old.travel.estate.pond);expect(old).toEqual(copy);expect(settlePondShore(next)).toBe(next);expect(decodeSnapshot(old)).toEqual(next);expect(validSnapshot(next)).toBe(true);
});
it('never changes an unexpanded pond or allows a smoothing upgrade to cover the player',()=>{
 const old=clean();expect(settlePondShore(old)).toBe(old);old.travel.estate.pondExpansion=east();old.player={x:785,y:430};const next=settlePondShore(old);expect(pondWaterAt(next.player.x,next.player.y,next.travel.estate.pondExpansion)).toBe(false);
});

it('refunds every recorded payment exactly once and leaves the original pond',()=>{
 const old=clean(),built=expandPond(old,smoothPondExpansion(east()))!;expect(built).not.toBeNull();const after=removePondExpansion(built)!;
 expect(after.economy.gold).toBe(old.economy.gold);expect(after.clearing.stone).toBe(old.clearing.stone);expect(after.travel.estate.pondExpansion).toBeUndefined();expect(after.travel.estate.pondPaid).toBeUndefined();expect(removePondExpansion(after)).toBeNull();expect(validSnapshot(after)).toBe(true);
});
it('keeps refund totals through repeated purchases and save round trips',()=>{
 const old=clean(),first=expandPond(old,smoothPondExpansion(east()))!,second=expandPond(first,smoothPondExpansion(brushPond(first.travel.estate.pondExpansion!,{x:811,y:464},36)!,first.travel.estate.pondExpansion))!;
 expect(second).not.toBeNull();const loaded=decodeSnapshot(second)!;expect(pondRefund(loaded)).toEqual({gold:old.economy.gold-second.economy.gold,stone:old.clearing.stone-second.clearing.stone});const restored=removePondExpansion(loaded)!;expect(restored.economy.gold).toBe(old.economy.gold);expect(restored.clearing.stone).toBe(old.clearing.stone);
});
it('protects water plants on the extension and offers area refunds for pre-ledger saves',()=>{
 const old=clean();old.travel.estate.pondExpansion=east();const ratio=(pondArea(east())-ORIGINAL_POND_AREA)/ORIGINAL_POND_AREA;expect(pondRefund(old)).toEqual({gold:Math.ceil(ratio*1800-1e-8),stone:Math.ceil(ratio*250-1e-8)});old.travel.estate.pond.push({kind:'lily',x:800,y:464,day:1});const copy=structuredClone(old);expect(removePondExpansion(old)).toBeNull();expect(old).toEqual(copy);old.travel.estate.pond=[];expect(removePondExpansion(old)).not.toBeNull();
});

it('persists the free shoreline upgrade and its refund across real database reloads',async()=>{
 const factory=new IDBFactory(),store=new SaveStore(factory);await store.load();const old=clean();old.travel.estate.pondExpansion=east();await store.save(old);store.close();
 const reader=new SaveStore(factory),loaded=(await reader.load()).data!;expect(loaded.travel.estate.pondSmoothed).toBe(true);expect(loaded.economy.gold).toBe(old.economy.gold);expect(pondArea(loaded.travel.estate.pondExpansion)).toBeCloseTo(pondArea(east()),6);await reader.save(loaded);reader.close();
 const last=new SaveStore(factory),reloaded=(await last.load()).data!;expect(reloaded).toEqual(loaded);const removed=removePondExpansion(reloaded)!;await last.save(removed);last.close();const verify=new SaveStore(factory);expect((await verify.load()).data).toEqual(removed);verify.close();
});
