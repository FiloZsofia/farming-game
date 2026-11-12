import {bedKinds,type BedKind} from './living-bed';
import type {Snapshot} from './storage';
import type {Crop} from './gardening';
import {crops} from './economy';
import {treeKinds,type TreeKind} from './estate';
import {createForest} from './forest';
// The crop and orchard registries are the source of truth, including future additions.
export type Food=Crop|TreeKind|BedKind;
export const isFood=(id:string):id is Food=>(crops as readonly string[]).includes(id)||(treeKinds as readonly string[]).includes(id)||(id in bedKinds&&bedKinds[id as BedKind].edible===true);
export function consumeFood(state:Snapshot,id:string):Snapshot|null{
 if(!isFood(id))return null;
 const health=state.travel.forest?.health??5;if(health>=5)return null;
 const fromGarden=(crops as readonly string[]).includes(id);
 const orchard=(treeKinds as readonly string[]).includes(id);
 const held=fromGarden?state.produce[id as Crop]:orchard?state.travel.estate.produce[id as TreeKind]:state.travel.homestead?.garden.extraProduce[id as BedKind];
 if(held===undefined||!Number.isSafeInteger(held)||held<1)return null;
 const next=structuredClone(state);if(fromGarden)next.produce[id as Crop]--;else if(orchard)next.travel.estate.produce[id as TreeKind]--;else next.travel.homestead!.garden.extraProduce[id as BedKind]!--;
 next.travel.forest??=createForest();next.travel.forest.health=Math.min(5,health+1);return next;
}
