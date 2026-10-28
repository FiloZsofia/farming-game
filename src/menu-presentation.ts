// Menu-only decoration and sound; no game or save state lives here.
export class MenuPresentation{
 private observer:MutationObserver;private context:AudioContext|null=null;private noise:AudioBuffer|null=null;private sound=true;
 private scene:HTMLElement;private brand:HTMLElement;
 constructor(private dialog:HTMLDialogElement){
  try{this.sound=localStorage.getItem('silent-pollen-menu-sound')!=='off';}catch{}
  this.scene=document.createElement('div');this.scene.className='menu-microscope';this.scene.setAttribute('aria-hidden','true');
  const specimen=document.createElement('div');specimen.className='menu-specimen';this.scene.append(specimen);
  const light=document.createElement('div');light.className='menu-lens-light';this.scene.append(light);
  for(let i=0;i<34;i++){
   const dot=document.createElement('i');dot.className='menu-dust';dot.style.cssText=`left:${13+(i*37%74)}%;top:${9+(i*23%83)}%;--size:${i%5===0?3:2}px;--drift:${i%2?14:-17}px;--duration:${18+i%9*3}s;--delay:-${i*1.7}s`;this.scene.append(dot);
  }
  for(let i=0;i<4;i++){
   const pollen=document.createElement('div');pollen.className='menu-pollen';pollen.style.cssText=`left:${[25,78,72,20][i]}%;top:${[49,27,77,80][i]}%;--size:${[66,88,52,40][i]}px;--duration:${[29,36,31,40][i]}s;--delay:-${i*6}s;--tilt:${[-30,-42,23,-17][i]}deg`;
   let pattern='';for(let j=0;j<19;j++){const x=22+j*23%54,y=20+j*17%62;pattern+=`<path d="m${x} ${y} 5-3 5 4-2 6-6 1z"/>`;}
   pollen.innerHTML=`<svg viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="55" rx="36" ry="46" fill="#bca04b" fill-opacity=".16" stroke="#e3d283" stroke-width="2"/><ellipse cx="50" cy="55" rx="30" ry="40" fill="none" stroke="#a6934c" stroke-width="1.5"/><g fill="none" stroke="#d6c977" stroke-width="1.1" opacity=".8">${pattern}</g><path d="M23 37q9-22 31-23" fill="none" stroke="#f7e7a5" stroke-width="3" opacity=".8"/></svg>`;this.scene.append(pollen);
  }
  for(let i=0;i<3;i++){const bubble=document.createElement('i');bubble.className='menu-bubble';bubble.style.cssText=`left:${[24,78,66][i]}%;top:${[27,62,86][i]}%;--size:${[24,37,15][i]}px;--duration:${26+i*7}s;--delay:-${i*5}s`;this.scene.append(bubble);}
  this.dialog.prepend(this.scene);
  this.brand=document.createElement('div');this.brand.className='menu-brand';this.brand.setAttribute('aria-hidden','true');
  this.brand.innerHTML=`<span class="menu-wordmark">Silent Pollen</span><svg class="menu-botanical" viewBox="0 0 290 58" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"><path d="M16 44q96-37 250-18M71 29 62 9m59 10L115 3m56 16 14-16m31 17 13-12"/><path d="M58 30q-16-17-27-13 1 11 27 13zm39-8q-10 21-27 19 7-15 27-19zm51-3q-9 21-24 19 4-13 24-19zm43 0q8 19 27 20-7-14-27-20zm50 5q5-12 20-12-2 9-20 12z"/></g><g fill="currentColor">${[[61,7],[115,4],[185,5],[230,8]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="2"/><circle cx="${x-3}" cy="${y+2}" r="1.7"/><circle cx="${x+3}" cy="${y+2}" r="1.7"/>`).join('')}</g></svg>`;
  this.dialog.querySelector('form')!.prepend(this.brand);
  this.dialog.dataset.menuSection='home';
  document.querySelector('#open-farms')!.addEventListener('click',()=>{this.dialog.dataset.menuSection='farms';document.querySelector<HTMLButtonElement>('#back-from-farms')!.focus();});
  document.querySelector('#back-from-farms')!.addEventListener('click',()=>{this.dialog.dataset.menuSection='home';document.querySelector<HTMLButtonElement>('#open-farms')!.focus();});
  const toggle=document.querySelector<HTMLButtonElement>('#menu-sound-toggle')!;
  const label=()=>{toggle.textContent=`Menühangok: ${this.sound?'be':'ki'}`;toggle.setAttribute('aria-pressed',String(this.sound));};label();
  toggle.addEventListener('click',()=>{this.sound=!this.sound;try{localStorage.setItem('silent-pollen-menu-sound',this.sound?'on':'off');}catch{}label();});
  document.addEventListener('click',this.click,true);document.addEventListener('visibilitychange',this.visibility);
  this.observer=new MutationObserver(()=>this.refresh());this.observer.observe(this.dialog,{attributes:true,subtree:true,attributeFilter:['open','hidden']});this.refresh();
 }
 home(){this.dialog.dataset.menuSection='home';}
 private refresh(){
  const visible=(id:string)=>!document.querySelector<HTMLElement>(id)!.hidden;
  const mode=!this.dialog.open?'':visible('#settings-panel')?'settings':visible('#start-panel')?'start':visible('#menu-panel')?'pause':visible('#farm-name-panel')?'naming':'';
  if(mode){if(this.dialog.dataset.menu!==mode)this.dialog.dataset.menu=mode;this.dialog.removeAttribute('aria-labelledby');this.dialog.setAttribute('aria-label',`Silent Pollen — ${mode==='start'?'Főmenü':mode==='pause'?'Menü':mode==='settings'?'Beállítások':'Új játék'}`);}
  else delete this.dialog.dataset.menu;
 }
 private click=(event:MouseEvent)=>{const button=event.target instanceof Element?event.target.closest<HTMLButtonElement>('button'):null;if(button&&!button.disabled&&(this.dialog.dataset.menu||button.id==='menu'))void this.woodClick();};
 private visibility=()=>{this.dialog.dataset.menuPaused=String(document.hidden);if(document.hidden)void this.context?.suspend();};
 private async woodClick(){
  if(!this.sound||document.hidden||typeof AudioContext==='undefined')return;
  try{
   this.context??=new AudioContext();const ctx=this.context;if(ctx.state!=='running')await ctx.resume();if(ctx.state!=='running'||document.hidden)return;
   if(!this.noise){this.noise=ctx.createBuffer(1,Math.ceil(ctx.sampleRate*.065),ctx.sampleRate);const data=this.noise.getChannelData(0);let seed=73;for(let i=0;i<data.length;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;data[i]=(seed/4294967296*2-1)*Math.exp(-i/data.length*6);}}
   const source=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),gain=ctx.createGain();source.buffer=this.noise;filter.type='bandpass';filter.frequency.value=760;filter.Q.value=2.3;
   const t=ctx.currentTime;gain.gain.setValueAtTime(.19,t);gain.gain.exponentialRampToValueAtTime(.0001,t+.065);source.connect(filter);filter.connect(gain);gain.connect(ctx.destination);source.start(t);source.onended=()=>{source.disconnect();filter.disconnect();gain.disconnect();};
  }catch{/* Silent fallback on devices where optional UI audio is unavailable. */}
 }
 destroy(){this.observer.disconnect();document.removeEventListener('click',this.click,true);document.removeEventListener('visibilitychange',this.visibility);void this.context?.close();this.scene.remove();this.brand.remove();}
}
