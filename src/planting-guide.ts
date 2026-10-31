import type {FarmStory} from './story-events';
import type {Research} from './research';
import type {Garden} from './gardening';
// Old saves with established flowers do not restart the basic tool guidance.
export function plantingGuideTool(story:FarmStory,research:Research,garden:Garden):'hoe'|'water'|null{
 if(!research.gifted)return null;
 if(!research.flowers.length)return research.seeds>0&&!story.flowerHoeDone?'hoe':null;
 if(story.flowerWaterDone||research.flowers.some(f=>f.growth>0))return null;
 return research.flowers.some(f=>!garden.plots.get(`${f.x},${f.y}`)?.watered)?'water':null;
}
