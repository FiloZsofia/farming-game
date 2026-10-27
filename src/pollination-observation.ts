import type {Garden} from './gardening';
import type {Estate} from './estate';
export const POLLINATION_OBSERVATION_TITLE='Üres terméshelyek';
export const POLLINATION_OBSERVATION_TEXT='A levelek egészségesek, mégis sok virág elnyílt termés nélkül. Az öntözés önmagában nem elég… Talán túl kevés beporzó jár erre.';
export function nearEmptyBlossoms(garden:Garden,estate:Estate,actor:{x:number;y:number}){
 if(actor.y>=600)return false;
 return [...garden.plots].some(([key,p])=>{const[x,y]=key.split(',').map(Number);return (p.fruitSet===false||p.fruitAftermath==='empty')&&Math.hypot(actor.x-x-12,actor.y-y-12)<=58;})||estate.trees.some(t=>t.bloomState==='empty'&&Math.hypot(actor.x-t.x,actor.y-t.y)<=75);
}
