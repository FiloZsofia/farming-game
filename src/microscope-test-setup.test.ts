import {expect,it} from 'vitest';
import {snapshot,validSnapshot,decodeSnapshot} from './storage';
import {createGarden} from './gardening';
import {createClock} from './clock';
import {createResearch,startResearch,advanceResearch,observeBee,grantKey,inspectWorkshop,repairMachine} from './research';
import {createForest,collectForestSample} from './forest';
import {createMicroscopy} from './microscopy';
import {prepareMicroscopeTest,isMicroscopeTestFarm} from './microscope-test-setup';
function completed(){
 const g=createGarden();let r=startResearch(createResearch(),4)!;
 const points=Array.from({length:6},(_,i)=>({x:-168+i*24,y:-96}));r.seeds=0;r.flowers=points.map(p=>({...p,growth:4}));for(const p of points)g.plots.set(`${p.x},${p.y}`,{crop:null,growth:0,watered:true,regrowing:false});r=advanceResearch(r,g,8);r=observeBee(r,9,10,r.flowers[0],9)!;r=grantKey(r)!;for(const id of ['shutter','entrance-shutter','vat','pipes','filter','coil'])r=inspectWorkshop(r,id)!;r.materials={scrap:18,copper:1,glass:1,linen:1};r=repairMachine(r,{wood:35,stone:30})!.research;r.microscopeDelivered=true;
 const s=snapshot({x:400,y:3400},createClock(12),g);s.farmName='Teszt farm';s.travel.research=r;s.travel.forest={...createForest(),sample:true,examined:true,sent:true,defeated:['vine','spore-a','spore-b','vine-inner'],microscopy:createMicroscopy(['nest','pond'],72,true)};s.economy.gold=347;s.clearing.wood=40;return s;
}
it('prepares only the requested test farm and leaves other farms untouched',()=>{const s=completed();expect(isMicroscopeTestFarm(' TESZT FARM ')).toBe(true);expect(prepareMicroscopeTest({...s,farmName:'Erdőszéli birtok'})).toBeNull();expect(prepareMicroscopeTest({...s,travel:{...s.travel,research:createResearch()}})).toBeNull();});
it('restores the sample encounter without changing money, inventory, garden, orders or day',()=>{
 const s=completed(),original=structuredClone(s),next=prepareMicroscopeTest(s)!;expect(validSnapshot(next)).toBe(true);expect(decodeSnapshot(next)).toEqual(next);expect(next.travel.research.microscopeDelivered).toBe(false);expect(next.travel.forest).toMatchObject({sample:false,examined:false,sent:false,health:5});expect(collectForestSample(next.travel.forest!,true)?.sample).toBe(true);expect(next.player).toEqual({x:-910,y:990});expect(next.clock.day).toBe(s.clock.day);expect(next.clock.elapsed).toBe(30);
 for(const k of ['economy','seeds','produce','plots','clearing','orders','skill','story'] as const)expect(next[k]).toEqual(s[k]);expect(next.travel.crafting).toEqual(s.travel.crafting);expect(next.travel.estate).toEqual(s.travel.estate);expect(next.travel.forest?.microscopy?.slides).toEqual(['pond']);expect(s).toEqual(original);
});
