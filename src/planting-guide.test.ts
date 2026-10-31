import {it,expect} from 'vitest';
import {plantingGuideTools,rememberPlantingGuide} from './planting-guide';
import {createResearch} from './research';
import {createGarden} from './gardening';
import {createStory} from './story-events';
it('completes six hoeings and waterings before planting any seeds',()=>{
 let story=createStory();const research=createResearch(),garden=createGarden();expect(plantingGuideTools(story,research,garden)).toEqual([]);research.gifted=true;research.seeds=6;
 expect(plantingGuideTools(story,research,garden)).toEqual(['hoe']);
 for(let i=0;i<6;i++){
  const key=`${341+i*24},272`;garden.plots.set(key,{crop:null,growth:0,regrowing:false,watered:false});story=rememberPlantingGuide(story,research,garden);
  expect(plantingGuideTools(story,research,garden)).toEqual(i<5?['hoe','water']:['water']);
 }
 for(let i=0;i<6;i++){garden.plots.get(`${341+i*24},272`)!.watered=true;story=rememberPlantingGuide(story,research,garden);expect(plantingGuideTools(story,research,garden)).toEqual(i<5?['water']:[]);}
 expect(research.flowers).toEqual([]);expect(research.seeds).toBe(6);
 garden.plots.clear();expect(plantingGuideTools(structuredClone(story),research,garden)).toEqual([]);
});
it('counts each place once, accepts old progress and lets rain replace watering',()=>{
 let story=createStory();const research=createResearch(),garden=createGarden();research.gifted=true;
 garden.plots.set('341,272',{crop:null,growth:0,regrowing:false,watered:true});story=rememberPlantingGuide(story,research,garden);story=rememberPlantingGuide(story,research,garden);expect(story.guideHoed).toHaveLength(1);expect(story.guideWatered).toHaveLength(1);
 for(let i=1;i<6;i++)garden.plots.set(`${341+i*24},272`,{crop:null,growth:0,regrowing:false,watered:true});expect(plantingGuideTools(createStory(),research,garden)).toEqual([]);
});
