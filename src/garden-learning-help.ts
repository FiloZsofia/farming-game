export const gardenHelpTopics={
 placement:{title:'Az ágyás helye',text:'Mozgasd a körvonalat szabad földre, majd erősítsd meg a helyét. Később a bal oldali + gombbal jelölhetsz ki új ágyást.'},
 marker:{title:'Ágyásjelölő',text:'A kezedben lévő táblát az ágyás valamelyik szabad oldala mellé helyezheted. Bontóvassal később átteheted ugyanannak az ágyásnak másik oldalára.'},
 prepare:{title:'Az első lépések',text:'Készítsd elő az ágyás földjét, majd válassz növénytársítást. E-vel vagy közeli kattintással később is megnyithatod az ágyáskezelőt.'},
 sow:{title:'Társítás és vetés',text:'A kilenc helyet szabadon oszthatod fel a társítás növényei között. A nálad lévő magokat használod; ha továbbiakra van szükséged, a Magkatalógusból rendelhetsz, és másnap a postaládából veheted át őket.'},
 care:{title:'Gondozás és megfigyelés',text:'A növekedéshez az ágyásnak minden nap öntözésre van szüksége. Az Öntözés eszközzel az egész ágyást locsolod; esőben vagy öntözőrendszerrel ez automatikus. E-vel vagy közeli kattintással megfigyelheted a növények állapotát.'},
 harvest:{title:'Termés vagy vetőmag',text:'A szedhető növényre a Gyűjtés eszközzel kattints. Ahol elérhető, terményszedés helyett magot is érlelni hagyhatsz; az elkészült magot szintén Gyűjtéssel szedheted le.'},
 replant:{title:'Új növény a felszabadult helyre',text:'A nyitott ágyáskezelő mellett válassz vetőmagot az alsó sávban, majd kattints a felszabadult helyre. A társítás bármelyik növényét választhatod, ha van hozzá magod.'},
 irrigation:{title:'Öntözőrendszer',text:'Minden reggel automatikusan megöntözi a hozzá kapcsolt teljes ágyást, az utánvetett növényeket is. A reggeli locsolást vízpermet jelzi.'},
 mulch:{title:'Mulcs az ágyásra',text:'A Komposztálóban gazból vagy túlérett gyümölcsből készíthetsz mulcsot. Az elkészült mulcsot vedd át, majd az ágyáskezelőben használd fel: egy adag az egész ágyást takarja.'}
} as const;
export type GardenHelpTopic=keyof typeof gardenHelpTopics;

// The first bed opens guidance by default; later beds keep it opt-in.
export class GardenLearningHelp{
 readonly element=document.createElement('section');
 private context:string|null=null;
 private selected:GardenHelpTopic='placement';
 private expanded=false;
 constructor(private changed:()=>void){this.element.id='garden-learning-help';this.element.setAttribute('aria-label','Segítség');}
 show(parent:HTMLElement,topic:GardenHelpTopic,bedId?:number,openByDefault=false){
  const context=`${bedId??''}:${topic}`;
  if(this.context!==context){this.context=context;this.selected=topic;this.expanded=openByDefault;}
  parent.append(this.element);this.render();
 }
 private render(){
  this.element.replaceChildren();const header=document.createElement('header'),title=document.createElement('h3');title.textContent='Segítség';
  const toggle=document.createElement('button');toggle.type='button';toggle.className='garden-help-toggle';toggle.textContent='?';toggle.setAttribute('aria-label',this.expanded?'Segítség elrejtése':'Segítség megnyitása');toggle.setAttribute('aria-expanded',String(this.expanded));toggle.setAttribute('aria-controls','garden-learning-content');toggle.onclick=()=>{this.expanded=!this.expanded;this.render();this.element.querySelector<HTMLButtonElement>('.garden-help-toggle')!.focus();this.changed();};header.append(title,toggle);this.element.append(header);
  const content=document.createElement('div');content.id='garden-learning-content';content.hidden=!this.expanded;
  const select=document.createElement('select');select.setAttribute('aria-label','Kertészeti segítség témája');for(const [id,topic]of Object.entries(gardenHelpTopics))select.add(new Option(topic.title,id));select.value=this.selected;select.onchange=()=>{this.selected=select.value as GardenHelpTopic;this.render();this.element.querySelector('select')!.focus();this.changed();};
  const text=document.createElement('p');text.textContent=gardenHelpTopics[this.selected].text;
  const dismiss=document.createElement('button');dismiss.type='button';dismiss.textContent='Értem';dismiss.onclick=()=>{this.expanded=false;this.render();this.element.querySelector<HTMLButtonElement>('.garden-help-toggle')!.focus();this.changed();};content.append(select,text,dismiss);this.element.append(content);
 }
 collapse(){this.context=null;this.expanded=false;this.render();}
 destroy(){this.element.remove();}
}
