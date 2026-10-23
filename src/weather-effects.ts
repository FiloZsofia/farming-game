import type {Weather} from './weather';
import {waterAt} from './estate';
export class WeatherEffects{
 private canvas=document.createElement('canvas');private context:CanvasRenderingContext2D;private time=0;
 constructor(){this.canvas.id='weather-layer';this.canvas.setAttribute('aria-hidden','true');document.querySelector('#app')!.append(this.canvas);this.context=this.canvas.getContext('2d')!;}
 draw(dt:number,weather:Weather,outdoors:boolean,night:number,view:{x:number;y:number;zoom:number}){
  this.time+=dt;const w=innerWidth,h=innerHeight,c=this.canvas,g=this.context;if(c.width!==w||c.height!==h){c.width=w;c.height=h;}g.clearRect(0,0,w,h);if(!outdoors)return;
  const t=this.time;
  if(weather==='cloudy'){
   g.fillStyle='rgba(72,88,102,.08)';g.fillRect(0,0,w,h);
   for(let i=0;i<6;i++){const x=((i*397+t*7-view.x*.15)%(w+650)+w+650)%(w+650)-280,y=(i*193-view.y*.1)%(h+250);g.save();g.translate(x,y);g.scale(1,.42);const gradient=g.createRadialGradient(0,0,35,0,0,280);gradient.addColorStop(0,'rgba(32,58,59,.13)');gradient.addColorStop(1,'rgba(32,58,59,0)');g.fillStyle=gradient;g.fillRect(-280,-280,560,560);g.restore();}
  }
  if(weather==='rain'){
   g.fillStyle='rgba(52,76,96,.13)';g.fillRect(0,0,w,h);g.lineWidth=1;g.strokeStyle=`rgba(199,225,227,${night>.2?.25:.48})`;g.beginPath();
   for(let i=0;i<130;i++){const x=((i*137.3-t*112)%(w+80)+w+80)%(w+80)-40,y=(i*89.7+t*(310+i%5*19))%(h+40)-20;g.moveTo(x,y);g.lineTo(x-4,y+10+i%4*2);}g.stroke();
   for(let i=0;i<24;i++){const x=509+(i*43)%245,y=375+(i*37)%170;if(!waterAt(x,y))continue;const phase=(t*.85+i*.37)%1;g.strokeStyle=`rgba(211,232,222,${(1-phase)*.65})`;g.beginPath();g.ellipse((x-view.x)*view.zoom,(y-view.y)*view.zoom,(2+phase*9)*view.zoom,(1+phase*4)*view.zoom,0,0,Math.PI*2);g.stroke();}
  }
 }
 destroy(){this.canvas.remove();}
}
// Soft filtered noise: locally synthesized rain, no downloaded audio.
export class RainSound{
 private onVisibility=()=>{if(document.hidden){this.update(false);void this.context?.suspend();}else if(this.context)void this.activate();};
 private onBlur=()=>this.update(false);
 constructor(){document.addEventListener('visibilitychange',this.onVisibility);window.addEventListener('blur',this.onBlur);}
 private context:AudioContext|null=null;private gain:GainNode|null=null;private wanted=false;
 async activate(){try{if(!this.context){const c=this.context=new AudioContext(),buffer=c.createBuffer(1,c.sampleRate*3,c.sampleRate),samples=buffer.getChannelData(0);for(let i=0;i<samples.length;i++)samples[i]=Math.random()*2-1;const source=c.createBufferSource(),filter=c.createBiquadFilter();source.buffer=buffer;source.loop=true;filter.type='lowpass';filter.frequency.value=1500;this.gain=c.createGain();this.gain.gain.value=0;source.connect(filter);filter.connect(this.gain);this.gain.connect(c.destination);source.start();}await this.context.resume();}catch{/* Browsers may keep audio muted until a user gesture. */}}
 update(raining:boolean){this.wanted=raining;const c=this.context;if(!c||!this.gain)return;this.gain.gain.setTargetAtTime(this.wanted?.065:0,c.currentTime,.25);}
 destroy(){document.removeEventListener('visibilitychange',this.onVisibility);window.removeEventListener('blur',this.onBlur);void this.context?.close();}
}
