export type PersonEntry={id:string;name:string;description:string;portrait:HTMLElement};
export function renderPeopleGallery(host:HTMLElement,entries:PersonEntry[]){
 host.replaceChildren();
 if(!entries.length){host.textContent='Hamarosan megismered a szomszédaidat.';return;}
 const row=document.createElement('div');row.className='people-portraits';
 const description=document.createElement('p');description.className='people-description';description.id='person-description';description.setAttribute('aria-live','polite');
 const buttons:HTMLButtonElement[]=[];
 const select=(index:number)=>{buttons.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));description.textContent=entries[index].description;};
 for(const [index,entry]of entries.entries()){
  const button=document.createElement('button');button.type='button';button.className='person-portrait';button.dataset.person=entry.id;button.setAttribute('aria-pressed','false');button.setAttribute('aria-describedby',description.id);
  const name=document.createElement('span');name.textContent=entry.name;button.append(entry.portrait,name);row.append(button);buttons.push(button);
  button.addEventListener('pointerenter',()=>select(index));button.addEventListener('focus',()=>select(index));button.addEventListener('click',()=>select(index));
 }
 host.append(row,description);select(0);
}
