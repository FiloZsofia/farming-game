import type {Snapshot} from './storage';
import type {Estate} from './estate';
import {treeKinds} from './estate';
import {creditGardenPoint} from './garden-progression';
/** One successful planting or collection action, irrespective of its fruit count. */
export function creditOrchardWork(before:Estate,next:Snapshot){
 const garden=next.travel.homestead?.garden;if(!garden)return false;const after=next.travel.estate;
 const planted=after.trees.find(t=>!before.trees.some(old=>old.x===t.x&&old.y===t.y&&old.kind===t.kind));
 if(planted)return creditGardenPoint(garden,`orchard:plant:${planted.kind}:${planted.x}:${planted.y}:${next.clock.day}`);
 const harvested=treeKinds.find(kind=>after.produce[kind]>before.produce[kind]);
 if(harvested){const tree=before.trees.find((t,i)=>t.kind===harvested&&t.fruit>0&&after.trees[i]?.fruit===0);if(tree)return creditGardenPoint(garden,`orchard:harvest:${tree.kind}:${tree.x}:${tree.y}:${next.clock.day}`);}
 return false;
}
