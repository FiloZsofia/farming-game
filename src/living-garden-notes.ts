import {itemIcon,type IconName} from './item-icons';
import type {GardenObservation} from './living-garden';
export function observationSketch(id:GardenObservation['id']){
 const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 150 66');svg.setAttribute('aria-hidden','true');svg.classList.add('garden-observation-sketch');
 svg.innerHTML=id==='water-recovery'?'<g fill="none" stroke="#607855" stroke-width="2" stroke-linecap="round"><path d="M24 53V32q-11-14-17-2 3 11 17 2m0 4q12-11 18 4-9 6-18-4M16 54h18M111 53V22q-13-14-18-3 4 12 18 3m0 14q14-17 21-7-5 11-21 7M101 54h22"/><path d="M61 34h24m-7-5 7 5-7 5" stroke="#ad925d"/></g>':'<g fill="none" stroke="#607855" stroke-width="2" stroke-linecap="round"><path d="M24 53V28m0 10-10-8m10 15 12-10M111 53V28m0 10-10-8m10 15 12-10"/><path d="M24 25c-13-14 5-15 0 0 15-10 16 8 0 0 10 15-8 16 0 0-15 10-16-8 0 0m87-2v7m-4-3h8M61 34h24m-7-5 7 5-7 5" stroke="#ad925d"/></g>';
 if(id!=='water-recovery'&&id!=='fruit-set'){const icons:Partial<Record<GardenObservation['id'],IconName>>={'berry-blossoms':'strawberry','dry-stress':'water','pollinator-visits':'wildflower','cover-water':'mulch','regrowth':'basil','supported-stems':'wood','pea-pods':'pea'};const icon=itemIcon(icons[id]??'wildflower');svg.innerHTML='<g transform="translate(56 12)">'+icon.innerHTML+'</g>';}
 return svg;
}
