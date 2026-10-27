import {isRipe,type Garden} from './gardening';
import type {Estate} from './estate';
import {pollinationDependent} from './pollination';
// Older saves have no fruit timestamps. Start their three-day window on the
// first load of this version, without guessing when those fruits originally ripened.
export function initializeFruitTimers(garden:Garden,estate:Estate,day:number){
 let changed=false;
 for(const p of garden.plots.values())if(pollinationDependent(p.crop)&&isRipe(p)&&p.ripeDays===undefined){p.fruitSet=true;p.ripeDays=0;changed=true;}
 for(const t of estate.trees)if(t.fruit>0&&t.fruitDay===undefined){t.fruitDay=day;changed=true;}
 return changed;
}
