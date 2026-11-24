import {COOP_CLEAN_INTERVAL,HEN_CAPACITY,type AnimalPen,type Livestock} from './livestock';
import {animalApproach,movedAnimalBox} from './livestock-geometry';
import type {IconName} from './item-icons';
import type {HenMotion} from './hen-behavior';
export const careActions=['feed','water','clean','eggs'] as const;
export type CareAction=typeof careActions[number];
export const careLabels:Record<CareAction,string>={feed:'Etetés',water:'Friss víz',clean:'Takarítás',eggs:'Tojásgyűjtés'};
export const careIcons:Record<CareAction,IconName>={feed:'animalFeed',water:'water',clean:'animalBroom',eggs:'henEgg'};
export function careActionState(s:Livestock,pen:AnimalPen,day:number,action:CareAction){
 const kind=action==='feed'?'feeder':action==='water'?'drinker':'coop';
 const fixture=kind==='coop'?pen.coop:pen.fixtures[kind];
 const reason=!fixture?'Előbb helyezd le a berendezést.':action==='feed'?pen.feed>=HEN_CAPACITY*3?'Az etető tele van.':!s.feed?'Nincs nálad takarmány.':null:action==='water'?pen.wateredDay===day?'Az itatóban ma már friss víz van.':null:action==='clean'?day-pen.cleanedDay<COOP_CLEAN_INTERVAL?'Az ól még tiszta.':null:!pen.eggs?'Még nincs begyűjthető tojás.':null;
 return {kind,fixture,target:fixture?animalApproach(kind,fixture,kind==='coop'?0:pen.rotations?.[kind]):null,reason};
}
export function henActivity(m:HenMotion|undefined){if(!m)return 'Ismerkedik az otthonával';if(m.route.length)return 'Sétál';return ({eat:'Eszik',drink:'Iszik',dust:'Porfürdőzik',rest:'Pihen',peck:'Kapirgál',stand:'Nézelődik'} as Record<string,string>)[m.activity]??'Nézelődik';}

/** Stand beside the furniture, so Sams body does not cover its contents or the work. */
export function careApproaches(pen:AnimalPen,action:CareAction){
 const kind=action==='feed'?'feeder':action==='water'?'drinker':'coop',p=kind==='coop'?pen.coop:pen.fixtures[kind];if(!p)return [];
 const box=movedAnimalBox(kind,p,kind==='coop'?0:pen.rotations?.[kind]),y=box.y+box.h+12;
 return [{x:box.x+box.w+19,y},{x:box.x-19,y},{x:p.x,y:box.y+box.h+76}];
}
