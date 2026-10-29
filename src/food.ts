import type {Snapshot} from './storage';
import type {Crop} from './gardening';
import {crops} from './economy';
import {treeKinds,type TreeKind} from './estate';
import {createForest} from './forest';
// The crop and orchard registries are the source of truth, including future additions.
export type Food=Crop|TreeKind;
export const isFood=(id:string):id is Food=>(crops as readonly string[]).includes(id)||(treeKinds as readonly string[]).includes(id);
export function consumeFood(state:Snapshot,id:string):Snapshot|null{
 if(!isFood(id))return null;
 const health=state.travel.forest?.health??5;if(health>=5)return null;
 const fromGarden=(crops as readonly string[]).includes(id);
 const held=fromGarden?state.produce[id as Crop]:state.travel.estate.produce[id as TreeKind];
 if(!Number.isSafeInteger(held)||held<1)return null;
 const next=structuredClone(state);if(fromGarden)next.produce[id as Crop]--;else next.travel.estate.produce[id as TreeKind]--;
 next.travel.forest??=createForest();next.travel.forest.health=Math.min(5,health+1);return next;
}
