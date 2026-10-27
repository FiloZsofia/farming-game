export const forestWarningTitle='AZ ERDŐBEN VESZÉLYES LÉNYEK JELENTEK MEG.';
export const forestWarningText='Megtámadják az embert. Ha meglátjátok őket, forduljatok vissza. Ne próbáljatok közelebb menni.';
// Original pencil gestures: no external illustrations or character labels.
function sketches(){
 const strokes:string[]=[];
 const path=(d:string,w=1.5,opacity=.8)=>strokes.push(`<path d="${d}" stroke-width="${w}" opacity="${opacity}"/>`);
 for(let i=0;i<36;i++){
  const a=i*2.399,r=36+i%5*6,x=147+Math.cos(a)*r,y=140+Math.sin(a)*r*.76;
  path(`M ${x.toFixed(1)} ${y.toFixed(1)} q ${Math.cos(a)*18} ${Math.sin(a)*18} ${Math.cos(a)*37} ${Math.sin(a)*29} l ${-Math.sin(a)*7} ${Math.cos(a)*8}`,i%3?1:2,.4+i%3*.15);
 }
 path('M99 160q-25-27-6-47l-4-24 24 8q13-30 34-19l26-16 5 25q31-1 32 29l18 14-20 15q-7 32-39 39l-21 18-17-17q-28 5-32-25Z',2.6,.85);
 path('M119 95q-12 37 6 60m9-61q-12 27 3 69m13-72q24 30 5 79m15-72q23 29 6 58m-60-28q34 23 70-1m-78 14q31 25 70 15',1.3,.65);
 path('M136 102l8 18-8 19 13 17 10-22-7-15 8-19',2.2,.9);
 for(let i=0;i<50;i++){const x=64+(i*47%179),y=26+(i*31%91);path(`M${x} ${y}l${i%3+1} -${i%2+1}`,i%4===0?2:1,.25+i%4*.15);}
 // Dense knotted core, with whip-like branches breaking away from it.
 for(let i=0;i<18;i++){
  const x=429+(i%4)*8,y=117+(i%3)*9;
  path(`M${x-30} ${y+35} C${x-65} ${y-36} ${x+48} ${y-65} ${x+51} ${y} S${x-41} ${y+62} ${x-40} ${y-6} Q${x-3} ${y-59} ${x+27} ${y+26}`,i%3===0?3:1,.25+i%4*.15);
 }
 for(const d of ['M430 146C378 115 371 57 329 48q20-7 35 10','M449 121C428 81 468 22 505 28q-28 16-25 34','M481 143C524 90 574 84 591 108l-25-5','M467 163C521 161 539 204 586 190l-13 17','M425 160C395 182 383 216 343 215l15-17','M437 118C385 107 363 132 325 120','M465 162Q475 211 447 222']){path(d,3,.85);path(d,1,.5);}
 path('M382 92l-5-14 14 3m81-5 13-8-2 16m55 25 9-12 2 13m-35 80 16-3-6 13m-102-4-13 3 6-13',1.7,.8);
 for(let i=0;i<32;i++){const x=393+i%8*13,y=94+Math.floor(i/8)*24;path(`M${x} ${y}l15 12m-13-7 11 13`,.8,.3);}
 return `<svg viewBox="0 0 640 252" role="img" aria-label="Két fenyegető erdei alak sötét ceruzarajza" xmlns="http://www.w3.org/2000/svg"><defs><filter id="pencil-grain"><feTurbulence type="fractalNoise" baseFrequency=".65" numOctaves="2" seed="8" result="noise"/><feComposite in="SourceGraphic" in2="noise" operator="arithmetic" k1="0" k2=".85" k3="-.15" k4="0"/></filter></defs><g fill="none" stroke="#343331" stroke-linecap="round" stroke-linejoin="round" filter="url(#pencil-grain)">${strokes.join('')}</g></svg>`;
}
export function forestWarningPaper(){
 const paper=document.createElement('article');paper.className='forest-warning-paper';paper.dataset.forestWarning='';
 const heading=document.createElement('h2');heading.textContent=forestWarningTitle;
 const text=document.createElement('p');text.textContent=forestWarningText;
 const art=document.createElement('div');art.className='forest-warning-sketches';art.innerHTML=sketches();
 paper.append(heading,text,art);return paper;
}
