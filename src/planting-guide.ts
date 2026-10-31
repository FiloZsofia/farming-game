import type {Research} from './research';
import type {Garden} from './gardening';
import type {FarmStory} from './story-events';
// Remember distinct prepared/watered places even after empty soil dries or disappears.
export function rememberPlantingGuide(story:FarmStory,research:Research,garden:Garden):FarmStory{
 if(!research.gifted)return story;
 const hoed=new Set(story.guideHoed??[]),watered=new Set(story.guideWatered??[]);
 for(const [key,plot]of garden.plots){hoed.add(key);if(plot.watered)watered.add(key);}
 for(const f of research.flowers)if(f.growth>0)watered.add(`${f.x},${f.y}`);
 return {...story,guideHoed:[...hoed].slice(0,6),guideWatered:[...watered].slice(0,6)};
}
export function plantingGuideTools(story:FarmStory,research:Research,garden:Garden):('hoe'|'water')[]{
 if(!research.gifted)return [];
 const progress=rememberPlantingGuide(story,research,garden),hoed=progress.guideHoed!.length,watered=progress.guideWatered!.length;
 return [...(hoed<6?['hoe' as const]:[]),...(hoed>0&&watered<6?['water' as const]:[])];
}
