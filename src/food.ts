import type {Snapshot} from './storage';
import {createForest} from './forest';
export const berryFoods=['strawberry','honeyberry','blueberry'] as const;
export type BerryFood=typeof berryFoods[number];
export function consumeBerry(state:Snapshot,crop:BerryFood):Snapshot|null{
 const health=state.travel.forest?.health??5;if(health>=5||state.produce[crop]<1)return null;
 const next=structuredClone(state);next.produce[crop]--;next.travel.forest??=createForest();next.travel.forest.health=Math.min(5,health+1);return next;
}
