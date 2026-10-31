import {it,expect} from 'vitest';
import {plantingGuideTools} from './planting-guide';
import {createResearch} from './research';
import {createGarden} from './gardening';
it('keeps hoeing highlighted through five flowers and watering highlighted until all six are watered',()=>{
 const research=createResearch(),garden=createGarden();expect(plantingGuideTools(research,garden)).toEqual([]);
 research.gifted=true;research.seeds=6;expect(plantingGuideTools(research,garden)).toEqual(['hoe']);
 for(let i=0;i<6;i++){
  const f={x:341+i*24,y:272,growth:0};research.flowers.push(f);research.seeds--;garden.plots.set(`${f.x},${f.y}`,{crop:null,growth:0,regrowing:false,watered:false});
  expect(plantingGuideTools(research,garden)).toEqual(i<5?['hoe','water']:['water']);
  garden.plots.get(`${f.x},${f.y}`)!.watered=true;
  expect(plantingGuideTools(research,garden)).toEqual(i<5?['hoe','water']:[]);
 }
});
it('remembers earlier watering through saved growth, and rain can complete the six flowers',()=>{
 const research=createResearch(),garden=createGarden();research.gifted=true;research.seeds=0;
 for(let i=0;i<6;i++){const f={x:341+i*24,y:272,growth:i<5?1:0};research.flowers.push(f);garden.plots.set(`${f.x},${f.y}`,{crop:null,growth:0,regrowing:false,watered:false});}
 expect(plantingGuideTools(research,garden)).toEqual(['water']);garden.plots.get('461,272')!.watered=true;
 expect(plantingGuideTools(research,garden)).toEqual([]);
 const loaded=structuredClone({research,garden});expect(plantingGuideTools(loaded.research,loaded.garden)).toEqual([]);
 loaded.research.flowers[5].growth=1;loaded.garden.plots.get('461,272')!.watered=false;expect(plantingGuideTools(loaded.research,loaded.garden)).toEqual([]);
});
