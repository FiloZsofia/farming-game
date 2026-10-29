import {itemIcon} from './item-icons';
export type LabPhase='load'|'extract'|'filter'|'cool'|'done';
export type LabPosition={x:number;y:number;carrying:string|null};
type Options={position:LabPosition;phase:()=>LabPhase;added:Set<string>;available:(id:string)=>boolean;add:(id:string)=>void;start:()=>void;advance:()=>void;ingredientName:string;counts:{thyme:number;plantain:number;ingredient:number};avatars?:HTMLImageElement[]};
const stations=[{id:'thyme',name:'Vadkakukkfű',x:105,y:145},{id:'plantain',name:'Lándzsás útifű',x:200,y:145},{id:'ingredient',name:'Gyanta',x:295,y:145},{id:'vat',name:'Üst',x:465,y:230},{id:'filter',name:'Szűrő',x:590,y:145},{id:'coil',name:'Hűtőspirál',x:590,y:310},{id:'concentrate',name:'Koncentrátum',x:105,y:330}];
export function createNoahLab(options:Options){
 const canvas=document.createElement('canvas');canvas.width=700;canvas.height=430;canvas.tabIndex=0;canvas.className='noah-lab-canvas';canvas.setAttribute('aria-label','Kivonatkészítő műhely. WASD vagy nyilak: mozgás; E vagy kattintás: felvétel és használat.');
 const ctx=canvas.getContext('2d')!,keys=new Set<string>(),p=options.position;let last=performance.now(),queuedAction:string|null=null,destination:{x:number;y:number;id:string}|null=null,flight:{id:string;x:number;y:number;age:number}|null=null,frame=0,disposed=false,mounted=false;
 const images:Record<string,HTMLImageElement>={};for(const [key,icon]of [['thyme','thyme'],['plantain','plantain'],['concentrate','glassJar']] as const){const image=new Image();const svg=itemIcon(icon);svg.setAttribute('xmlns','http://www.w3.org/2000/svg');image.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg.outerHTML);images[key]=image;}
 const rect=(x:number,y:number,w:number,h:number,color:string)=>{ctx.fillStyle=color;ctx.fillRect(Math.round(x),Math.round(y),w,h);};
 const label=(text:string,x:number,y:number,color='#eee3bb',size=13)=>{ctx.font=`${size}px "Trebuchet MS",sans-serif`;ctx.fillStyle=color;ctx.textAlign='center';ctx.fillText(text,x,y);};
 function icon(id:string,x:number,y:number,size=30){if(id==='ingredient'){ctx.fillStyle='#d4a248';ctx.beginPath();ctx.moveTo(x,y-size*.48);ctx.bezierCurveTo(x-size*.7,y+size*.1,x-size*.3,y+size*.6,x,y+size*.45);ctx.bezierCurveTo(x+size*.5,y+size*.5,x+size*.6,y+size*.1,x,y-size*.48);ctx.fill();rect(x-3,y-3,3,8,'#ffe1a0');}else{const image=images[id];if(image?.complete&&image.naturalWidth)ctx.drawImage(image,x-size/2,y-size/2,size,size);}}
 function usable(id:string){const phase=options.phase();return phase==='load'?(id==='vat'?['thyme','plantain','ingredient'].every(key=>options.added.has(key)):['thyme','plantain','ingredient'].includes(id)&&!options.added.has(id)&&options.available(id)):phase==='extract'?id==='filter':phase==='filter'?id==='coil':phase==='cool'?id==='concentrate'||id==='vat':false;}
 function interact(id:string){
  if(flight){queuedAction=id;return;}
  const phase=options.phase();
  if(id==='vat'){
   if(phase==='load'&&p.carrying&&p.carrying!=='concentrate'){const ingredient=p.carrying;p.carrying=null;flight={id:ingredient,x:p.x,y:p.y-35,age:0};options.add(ingredient);return;}
   if(phase==='load'&&!p.carrying&&['thyme','plantain','ingredient'].every(key=>options.added.has(key)))options.start();
   else if(phase==='cool'&&p.carrying==='concentrate'){p.carrying=null;flight={id:'concentrate',x:p.x,y:p.y-35,age:0};options.advance();}
   return;
  }
  if(phase==='extract'&&id==='filter'||phase==='filter'&&id==='coil'){options.advance();return;}
  if(!p.carrying&&((phase==='load'&&['thyme','plantain','ingredient'].includes(id)&&!options.added.has(id)&&options.available(id))||(phase==='cool'&&id==='concentrate')))p.carrying=id;
 }
 const keydown=(event:KeyboardEvent)=>{if(['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowLeft','ArrowDown','ArrowRight','KeyE'].includes(event.code)){event.preventDefault();event.stopPropagation();}keys.add(event.code);destination=null;if(event.code==='KeyE'&&!event.repeat){const target=stations.filter(s=>Math.hypot(s.x-p.x,s.y-p.y)<92).sort((a,b)=>Math.hypot(a.x-p.x,a.y-p.y)-Math.hypot(b.x-p.x,b.y-p.y))[0];if(target)interact(target.id);}};
 const keyup=(event:KeyboardEvent)=>keys.delete(event.code);
 canvas.addEventListener('keydown',keydown);canvas.addEventListener('keyup',keyup);canvas.addEventListener('blur',()=>keys.clear());
 canvas.addEventListener('pointerdown',event=>{canvas.focus({preventScroll:true});const r=canvas.getBoundingClientRect(),x=(event.clientX-r.left)*700/r.width,y=(event.clientY-r.top)*430/r.height;const target=stations.filter(s=>Math.hypot(s.x-x,s.y-y)<55).sort((a,b)=>Math.hypot(a.x-x,a.y-y)-Math.hypot(b.x-x,b.y-y))[0];destination=target?{x:target.x,y:target.y+58,id:target.id}:{x:Math.max(30,Math.min(670,x)),y:Math.max(195,Math.min(405,y)),id:''};});
 function draw(now:number){
  if(disposed)return;if(!canvas.isConnected){if(mounted){dispose();return;}frame=requestAnimationFrame(draw);return;}mounted=true;if(!document.querySelector<HTMLDialogElement>('#dialogue')?.open){dispose();return;}
  const dt=Math.min(.04,(now-last)/1000);last=now;let dx=Number(keys.has('KeyD')||keys.has('ArrowRight'))-Number(keys.has('KeyA')||keys.has('ArrowLeft')),dy=Number(keys.has('KeyS')||keys.has('ArrowDown'))-Number(keys.has('KeyW')||keys.has('ArrowUp'));
  if(destination&&!dx&&!dy){const d=Math.hypot(destination.x-p.x,destination.y-p.y);if(d<7){const id=destination.id;destination=null;if(id)interact(id);}else{dx=(destination.x-p.x)/d;dy=(destination.y-p.y)/d;}}
  if(dx||dy){const n=Math.hypot(dx,dy);p.x=Math.max(30,Math.min(670,p.x+dx/n*dt*160));p.y=Math.max(195,Math.min(405,p.y+dy/n*dt*160));}
  ctx.clearRect(0,0,700,430);rect(0,0,700,430,'#283e30');for(let y=85;y<430;y+=28){rect(0,y,700,26,y%56?'#6b654a':'#726b4d');rect(0,y+25,700,2,'#494e39');}rect(0,0,700,100,'#43523b');for(let i=0;i<15;i++)rect(i*50,0,2,95,'#677153');rect(38,108,300,62,'#9b8054');rect(38,165,300,8,'#5b4b33');rect(62,301,90,45,'#9b8054');
  const phase=options.phase();
  for(const s of stations){const active=usable(s.id)||(s.id==='vat'&&Boolean(p.carrying));if(active){ctx.strokeStyle='#d3b66d';ctx.lineWidth=2;ctx.strokeRect(s.x-36,s.y-31,72,61);}
   if(['thyme','plantain','ingredient'].includes(s.id)){if(!options.added.has(s.id)&&p.carrying!==s.id)icon(s.id,s.x,s.y);label(s.name,s.x,102,'#eee3bb',12);label(`${options.counts[s.id as keyof typeof options.counts]}${options.added.has(s.id)?' ✓':''}`,s.x,187,'#eee3bb',12);}
   else if(s.id==='vat'){ctx.fillStyle='#ae8e53';ctx.beginPath();ctx.ellipse(s.x,s.y+10,49,50,0,0,Math.PI*2);ctx.fill();rect(s.x-48,s.y-25,96,38,'#9d804d');ctx.fillStyle=options.added.size||phase!=='load'?'#82995a':'#504f38';ctx.beginPath();ctx.ellipse(s.x,s.y-25,47,16,0,0,Math.PI*2);ctx.fill();for(let i=0;i<4&&phase!=='load';i++){const t=(now/1500+i*.23)%1;ctx.strokeStyle=`rgba(221,225,189,${1-t})`;ctx.beginPath();ctx.ellipse(s.x+Math.sin(i+now/700)*15,s.y-35-t*43,4+t*6,7+t*8,0,0,Math.PI*2);ctx.stroke();}label('Üst',s.x,s.y+80);}
   else if(s.id==='filter'){rect(s.x-25,s.y-30,50,54,'#b7bba0');for(let y=s.y-26;y<s.y+20;y+=6)rect(s.x-22,y,44,2,'#67745a');label('Szűrő',s.x,s.y+47);}
   else if(s.id==='coil'){for(let i=0;i<5;i++){rect(s.x-24,s.y-28+i*12,48,5,'#ba945a');}rect(s.x-25,s.y-28,5,55,'#b58d54');rect(s.x+20,s.y-28,5,55,'#b58d54');label('Hűtőspirál',s.x,s.y+48);}
   else{if(p.carrying!=='concentrate')icon('concentrate',s.x,s.y);label('Koncentrátum',s.x,s.y+36,'#eee3bb',12);}}
  // Sam: brown high ponytail, off-white shirt and moss-green work trousers.
  const avatar=options.avatars?.[dx||dy?1+Math.floor(now/140)%2:0];
  if(avatar?.complete&&avatar.naturalWidth)ctx.drawImage(avatar,p.x-32,p.y-82,64,96);else{
  const stride=dx||dy?Math.sin(now/85)*3:0;rect(p.x-9,p.y-25,7,23+stride,'#526c43');rect(p.x+2,p.y-25,7,23-stride,'#526c43');rect(p.x-10,p.y-2+stride,9,4,'#574a35');rect(p.x+2,p.y-2-stride,9,4,'#574a35');rect(p.x-11,p.y-48,22,24,'#e7e0c0');rect(p.x-14,p.y-45,5,18,'#c5a57c');rect(p.x+10,p.y-45,5,18,'#c5a57c');ctx.fillStyle='#c8a982';ctx.beginPath();ctx.ellipse(p.x,p.y-60,10,13,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#785338';ctx.beginPath();ctx.ellipse(p.x,p.y-68,11,7,0,0,Math.PI*2);ctx.fill();rect(p.x+6,p.y-79,6,15,'#785338');rect(p.x+10,p.y-77,5,15,'#785338');rect(p.x-5,p.y-61,2,2,'#374333');rect(p.x+4,p.y-61,2,2,'#374333');
  }
  if(p.carrying)icon(p.carrying,p.x+15,p.y-35,24);
  if(flight){flight.age+=dt;const t=Math.min(1,flight.age/.65);icon(flight.id,flight.x+(465-flight.x)*t,flight.y+(205-flight.y)*t-Math.sin(t*Math.PI)*65,24);if(t>=1){flight=null;if(queuedAction){const id=queuedAction;queuedAction=null;interact(id);}}}
  label({load:'Alapanyagok',extract:'Kivonás',filter:'Szűrés',cool:'Lehűlt kivonat',done:'Elkészült'}[phase],350,36,'#f1deb1',19);
  canvas.dataset.labThrowing=String(Boolean(flight));canvas.dataset.labAdded=[...options.added].join(',');canvas.dataset.labPhase=phase;canvas.dataset.labX=String(Math.round(p.x));canvas.dataset.labY=String(Math.round(p.y));canvas.dataset.carrying=p.carrying??'';frame=requestAnimationFrame(draw);
 }
 function dispose(){disposed=true;cancelAnimationFrame(frame);canvas.removeEventListener('keydown',keydown);canvas.removeEventListener('keyup',keyup);}
 frame=requestAnimationFrame(draw);setTimeout(()=>{if(canvas.isConnected)canvas.focus({preventScroll:true});},0);return {canvas,dispose};
}
