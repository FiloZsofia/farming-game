import {it,expect} from 'vitest';
import {catalogBedGaps} from './catalog-bed-gaps';
import {createLivingBed,plantLivingBed,harvestLivingPlant,replantLivingSpot,emptyBedSeeds} from './living-bed';
it('tracks the actual cleared crops and forgets a spot even when replanted with another allowed member',()=>{
 const initial=createLivingBed();initial.prepared=true;initial.seedStock=Object.fromEntries(Object.keys(emptyBedSeeds()).map(k=>[k,20])) as typeof initial.seedStock;
 let state=plantLivingBed(initial,'pepperKitchen')!;state.plants.forEach(p=>p.growth=9);
 state=harvestLivingPlant(state,3)!;state=harvestLivingPlant(state,4)!;
 expect(catalogBedGaps([{id:7,state}])[0]).toMatchObject({id:7,empty:2,counts:{onion:2}});
 state=replantLivingSpot(state,3,'pepper')!;
 expect(catalogBedGaps([{id:7,state}])[0]).toMatchObject({empty:1,counts:{onion:1}});
 state=replantLivingSpot(state,4,'basil')!;
 expect(catalogBedGaps([{id:7,state}])).toEqual([]);
});
it('does not count unplanted beds or regrowing fruit as vacant and survives serialized old bed data',()=>{
 const state=createLivingBed();expect(catalogBedGaps([{id:1,state}])).toEqual([]);
 state.mix='pepperKitchen';state.plants=[{kind:'pepper',growth:0,flowering:false,flowerDays:0,removed:false,seedTaken:false,regrowing:true},{kind:'onion',growth:2,flowering:false,flowerDays:0,removed:true,seedTaken:false}];
 const beds=JSON.parse(JSON.stringify([{id:1,state},{id:2,state}]));const rows=catalogBedGaps(beds);expect(rows.map(r=>[r.id,r.empty,r.counts])).toEqual([[1,1,{onion:1}],[2,1,{onion:1}]]);
});
