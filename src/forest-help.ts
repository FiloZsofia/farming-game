import {itemIcon} from './item-icons';
import type {Forest} from './forest';
export const FOREST_HELP_TITLE='Életerő az erdőben';
export const FOREST_HELP_TEXT='Az erdőben az ellenségek megsebezhetnek. Ha csökken az életerőd, nyisd meg a Készletet (Tab), válassz egy nálad lévő zöldséget vagy gyümölcsöt, majd kattints az Eszem gombra. Egy darab elfogyasztása egy szívet tölt vissza.';
export const forestHelpPending=(f:Forest)=>!f.healthHelpSeen;
export function appendForestHealthDemo(panel:HTMLElement){
 const demo=document.createElement('div');demo.className='forest-health-demo';demo.setAttribute('role','img');demo.setAttribute('aria-label','Öt szívből kettő kiürül sérüléskor, majd evéssel egy szív visszatöltődik.');
 for(let i=0;i<5;i++){const heart=document.createElement('span');heart.className=`health-demo-heart heart-${i+1}`;heart.setAttribute('aria-hidden','true');const empty=document.createElement('span');empty.className='health-demo-empty';empty.textContent='♥';const full=document.createElement('span');full.className='health-demo-full';full.textContent='♥';heart.append(empty,full);if(i===3){const halo=document.createElement('span');halo.className='health-demo-halo';heart.append(halo);for(let j=0;j<5;j++){const mote=document.createElement('span');mote.className='health-demo-mote';mote.style.setProperty('--mote-delay',`${j*130}ms`);mote.style.setProperty('--mote-drift',`${(j%3-1)*8}px`);heart.append(mote);}}demo.append(heart);}const food=document.createElement('span');food.className='health-demo-food';food.setAttribute('aria-hidden','true');food.append(itemIcon('apple'));demo.append(food);panel.replaceChildren(demo);panel.hidden=false;
}
