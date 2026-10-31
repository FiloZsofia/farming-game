import type {Research} from './research';
import type {Garden} from './gardening';
// A flower's saved growth remembers watering across mornings. Rain also counts.
export function plantingGuideTools(research:Research,garden:Garden):('hoe'|'water')[]{
 if(!research.gifted)return [];
 const planted=research.flowers.length>=6;
 const watered=planted&&research.flowers.every(f=>f.growth>0||garden.plots.get(`${f.x},${f.y}`)?.watered);
 return [...(!planted?['hoe' as const]:[]),...(research.flowers.length>0&&!watered?['water' as const]:[])];
}
