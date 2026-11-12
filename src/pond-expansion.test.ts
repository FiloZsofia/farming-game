import {afterEach,it,expect} from 'vitest';
import {snapshot,validSnapshot,decodeSnapshot} from './storage';
import {createGarden} from './gardening';
import {createClock} from './clock';
import {activeDebris} from './cleanup';
import {brushPond,bindPondExpansion,pondArea,ORIGINAL_POND_AREA,pondOutline,validPondExpansion,POND_SECTORS,pondWaterAt} from './pond-shape';
import {expandPond,pondExpansionCost,pondExpansionError} from './pond-expansion';
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
 const ten=Array.from({length:POND_SECTORS},(_,i)=>{const p=pondOutline([])[i];return Math.hypot(p.x-638,p.y-464)*(Math.sqrt(1.1)-1);});const cost=pondExpansionCost([],ten);expect(cost.percent).toBeCloseTo(10,8);expect(cost.gold).toBeLessThanOrEqual(181);expect(cost.gold).toBeGreaterThanOrEqual(180);expect(cost.stone).toBeGreaterThanOrEqual(25);expect(cost.stone).toBeLessThanOrEqual(26);
});
it('protects buildings, the player, plants and placed items, and refuses insufficient funds',()=>{
 const s=clean(),d=east();s.player={x:805,y:464};expect(pondExpansionError(s,d)).not.toBeNull();expect(expandPond(s,d)).toBeNull();s.player={x:330,y:260};s.travel.estate.trees.push({kind:'apple',x:805,y:450,planted:1,last:0,fruit:0});expect(expandPond(s,d)).toBeNull();s.travel.estate.trees=[];s.economy.gold=0;expect(expandPond(s,d)).toBeNull();
});
it('shares new water with collision and planting while validating other farms independently',()=>{
 const d=east();bindPondExpansion(()=>d);expect(waterAt(800,464)).toBe(true);expect(blocked(800,464)).toBe(true);expect(pondWaterAt(800,464,[])).toBe(false);
 const old=clean();old.player={x:806,y:464};expect(validSnapshot(old)).toBe(true);const flooded=structuredClone(old);flooded.travel.estate.pondExpansion=d;expect(validSnapshot(flooded)).toBe(false);
 const estate=clean().travel.estate;estate.pondExpansion=d;estate.goods.lily=1;expect(placeGood(estate,'lily',800,464,10,false)?.pond.at(-1)?.x).toBe(800);
});
