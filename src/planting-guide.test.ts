import {it,expect} from 'vitest';
import {plantingGuideTool} from './planting-guide';
import {createStory} from './story-events';
import {createResearch} from './research';
import {createGarden} from './gardening';
it('guides hoeing only after the gift, then watering a planted wildflower',()=>{
 const story=createStory(),research=createResearch(),garden=createGarden();
 expect(plantingGuideTool(story,research,garden)).toBeNull();research.gifted=true;research.seeds=6;
 expect(plantingGuideTool(story,research,garden)).toBe('hoe');story.flowerHoeDone=true;expect(plantingGuideTool(story,research,garden)).toBeNull();
 research.flowers=[{x:341,y:272,growth:0}];garden.plots.set('341,272',{crop:null,growth:0,regrowing:false,watered:false});
 expect(plantingGuideTool(story,research,garden)).toBe('water');story.flowerWaterDone=true;expect(plantingGuideTool(story,research,garden)).toBeNull();
});
it('avoids redundant watering on rain-soaked soil and does not restart for established flowers',()=>{
 const story=createStory(),research=createResearch(),garden=createGarden();research.gifted=true;research.seeds=5;research.flowers=[{x:341,y:272,growth:0}];garden.plots.set('341,272',{crop:null,growth:0,regrowing:false,watered:true});expect(plantingGuideTool(story,research,garden)).toBeNull();research.flowers[0].growth=1;garden.plots.get('341,272')!.watered=false;expect(plantingGuideTool(story,research,garden)).toBeNull();
});
