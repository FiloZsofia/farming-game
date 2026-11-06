import type {Forest} from './forest';
export const FOREST_HELP_TITLE='Életerő az erdőben';
export const FOREST_HELP_TEXT='Az erdőben az ellenségek megsebezhetnek. Ha csökken az életerőd, nyisd meg a Készletet (Tab), válassz egy zöldséget vagy gyümölcsöt, majd kattints az Eszem gombra. Egy darab elfogyasztása 1 szívet tölt vissza.';
export const forestHelpPending=(f:Forest)=>!f.healthHelpSeen;
export function appendForestHealthDemo(panel:HTMLElement){
 const demo=document.createElement('div');demo.className='forest-health-demo';demo.setAttribute('role','img');demo.setAttribute('aria-label','Öt szívből kettő kiürül sérüléskor, majd evéssel egy szív visszatöltődik.');
 for(let i=0;i<5;i++){const heart=document.createElement('span');heart.className=`health-demo-heart heart-${i+1}`;heart.setAttribute('aria-hidden','true');const empty=document.createElement('span');empty.className='health-demo-empty';empty.textContent='♥';const full=document.createElement('span');full.className='health-demo-full';full.textContent='♥';heart.append(empty,full);demo.append(heart);}panel.replaceChildren(demo);panel.hidden=false;
}
