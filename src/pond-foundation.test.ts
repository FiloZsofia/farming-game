import {it,expect,afterEach} from 'vitest';
import {DEFAULT_POND_EXPANSION,foundationOffsets} from './pond-foundation';
import {createEstate} from './estate';
import {createTravel} from './travel';
import {snapshot,decodeSnapshot,validSnapshot} from './storage';
import {createGarden} from './gardening';
import {createClock} from './clock';
import {activeDebris} from './cleanup';
import {pondArea,pondOutline,bindPondExpansion,pondWaterAt,validPondExpansion,smoothPondExpansion,brushPond} from './pond-shape';
import {pondExpansionCost,pondRefund,pondRemovalError,expandPond,removePondExpansion} from './pond-expansion';
afterEach(()=>bindPondExpansion(()=>[]));
function fresh(){const s=snapshot({x:330,y:260},createClock(10,()=>.5),createGarden());s.travel=createTravel(true);s.economy.gold=5000;s.clearing.stone=500;for(const d of activeDebris(s.clearing,createGarden()))s.clearing.removed[d.id]=1;return s;}
it('starts new estates with the approved exact shore, without copying plants or purchases',()=>{
 const e=createEstate(true);expect(e.pondExpansion).toEqual(DEFAULT_POND_EXPANSION);expect(e.pond).toEqual([]);expect(e.pondPaid).toEqual({gold:0,stone:0});expect(validPondExpansion(e.pondExpansion,foundationOffsets(e))).toBe(true);expect(validSnapshot(fresh())).toBe(true);expect(decodeSnapshot(fresh())).toEqual(fresh());expect(pondRemovalError(fresh())).not.toBeNull();expect(pondRefund(fresh())).toEqual({gold:0,stone:0});
 const original=[...DEFAULT_POND_EXPANSION];e.pondExpansion![0]=99;expect(DEFAULT_POND_EXPANSION).toEqual(original);
});
it('charges 95 gold and 16 stone for ten percent of the applicable base',()=>{
 for(const base of [[],DEFAULT_POND_EXPANSION]){const outline=pondOutline(base),ten=outline.map((p,i)=>(base[i]??0)+Math.hypot(p.x-638,p.y-464)*(Math.sqrt(1.1)-1)),cost=pondExpansionCost(base,ten,base);expect(cost.percent).toBeCloseTo(10,8);expect(cost.gold).toBe(95);expect(cost.stone).toBe(16);}
});
it('refunds only new work and restores the approved foundation, through a save round trip',()=>{
 const s=fresh(),base=foundationOffsets(s.travel.estate),raw=brushPond(base,{x:840,y:464},32)!,draft=smoothPondExpansion(raw,base,base),built=expandPond(s,draft)!;expect(built).not.toBeNull();expect(built.economy.gold).toBeLessThan(s.economy.gold);const loaded=decodeSnapshot(built)!,removed=removePondExpansion(loaded)!;expect(removed.travel.estate.pondExpansion).toEqual(DEFAULT_POND_EXPANSION);expect(removed.travel.estate.pondFoundation).toBe('estate113');expect(removed.economy.gold).toBe(s.economy.gold);expect(removed.clearing.stone).toBe(s.clearing.stone);expect(removePondExpansion(removed)).toBeNull();
});
it('keeps legacy water independent of the active new farm',()=>{
 const old=snapshot({x:800,y:464},createClock(10,()=>.5),createGarden()),before=structuredClone(old);bindPondExpansion(()=>DEFAULT_POND_EXPANSION);expect(pondWaterAt(800,464)).toBe(true);expect(validSnapshot(old)).toBe(true);expect(decodeSnapshot(old)).toEqual(before);expect(createEstate().pondExpansion).toBeUndefined();expect(pondArea(DEFAULT_POND_EXPANSION)).toBeGreaterThan(pondArea([]));
});
