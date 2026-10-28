import {GAME_VERSION} from './version';
const menuLogo=new URL('./assets/silent-pollen-logo.webp',import.meta.url).href;
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
   const dot=document.createElement('i');dot.className='menu-dust';dot.style.cssText=`left:${13+(i*37%74)}%;top:${9+(i*23%83)}%;--size:${i%5===0?3:2}px;--drift:${i%2?48:-56}px;--duration:${14+i%9*2}s;--delay:-${i*1.7}s`;this.scene.append(dot);
  }
  for(let i=0;i<4;i++){
   const pollen=document.createElement('div');pollen.className='menu-pollen';pollen.dataset.grain=String(i);pollen.style.cssText=`left:${[23,77,71,18][i]}%;top:${[47,24,75,77][i]}%;--size:${[108,145,84,73][i]}px;--duration:${[19,23,17,26][i]}s;--delay:-${i*4}s;--tilt:${[-32,-40,22,-18][i]}deg;--drift:${i%2?-54:62}px;--pulse:${6+i*.8}s`;
   let hairs='',pattern='';
   for(let j=0;j<76;j++){const a=j*Math.PI*2/76,x=70+Math.cos(a)*43,y=85+Math.sin(a)*59,length=3+j%4;hairs+=`<path d="M${x.toFixed(1)} ${y.toFixed(1)}l${(Math.cos(a)*length).toFixed(1)} ${(Math.sin(a)*length).toFixed(1)}" stroke-width="${j%3?1:1.6}"/>`;}
   for(let row=0;row<10;row++)for(let col=0;col<7;col++){const x=35+col*12+(row%2)*6,y=37+row*10;if(((x-70)/36)**2+((y-85)/51)**2<.95)pattern+=`<path d="m${x} ${y} 6-3 5 4-1 7-6 3-5-4z"/><circle cx="${x+4}" cy="${y+3}" r="1"/>`;}
   pollen.innerHTML=`<svg viewBox="0 0 140 170" xmlns="http://www.w3.org/2000/svg"><g stroke="#f2e9b9" stroke-linecap="round" opacity=".9">${hairs}</g><ellipse cx="70" cy="85" rx="43" ry="59" fill="#e1d9a2" fill-opacity=".2" stroke="#eee8b8" stroke-width="2.5"/><ellipse cx="70" cy="85" rx="37" ry="52" fill="none" stroke="#c8bd7d" stroke-width="1.5"/><g fill="none" stroke="#e5dc9f" stroke-width="1.3" opacity=".85">${pattern}</g><path d="M37 62q10-27 36-30" fill="none" stroke="#fff6d4" stroke-width="3" opacity=".85"/></svg>`;this.scene.append(pollen);
  }
  for(let i=0;i<3;i++){const bubble=document.createElement('i');bubble.className='menu-bubble';bubble.style.cssText=`left:${[24,78,66][i]}%;top:${[27,62,86][i]}%;--size:${[24,37,15][i]}px;--duration:${18+i*4}s;--delay:-${i*5}s`;this.scene.append(bubble);}
  this.dialog.prepend(this.scene);
  this.brand=document.createElement('div');this.brand.className='menu-brand';this.brand.setAttribute('aria-hidden','true');
  const logo=document.createElement('img');logo.className='menu-logo';logo.src=menuLogo;logo.alt='';logo.width=2170;logo.height=725;logo.draggable=false;this.brand.append(logo);
  const credits=document.createElement('footer');credits.className='menu-credits';credits.append(document.createTextNode('2026 · Harsányi Zsófia'));const version=document.createElement('span');version.id='menu-version';version.textContent=`v${GAME_VERSION}`;version.setAttribute('aria-label',`Játékverzió: ${GAME_VERSION}`);credits.append(version);this.dialog.append(credits);
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
  if(mode){if(mode!=='settings')this.dialog.dataset.menuOrigin=mode==='pause'?'pause':'start';if(this.dialog.dataset.menu!==mode)this.dialog.dataset.menu=mode;this.dialog.removeAttribute('aria-labelledby');this.dialog.setAttribute('aria-label',`Silent Pollen — ${mode==='start'?'Főmenü':mode==='pause'?'Menü':mode==='settings'?'Beállítások':'Új játék'}`);}
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
 destroy(){this.observer.disconnect();document.removeEventListener('click',this.click,true);document.removeEventListener('visibilitychange',this.visibility);void this.context?.close();this.scene.remove();this.brand.remove();this.dialog.querySelector('.menu-credits')?.remove();}
}
