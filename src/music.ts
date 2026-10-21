// Original procedural instrumental score: no external recording or asset licence.
const chords=[[48,55,59,64],[45,52,55,60],[41,48,52,57],[43,50,57,62]];
const melody=[64,67,69,67,64,null,62,null,60,64,67,null,64,62,60,null,65,69,67,64,65,null,64,null,62,67,69,67,62,null,59,null];
const hz=(note:number)=>440*2**((note-69)/12);
export class FarmMusic{
 private context:AudioContext|null=null;private output:GainNode|null=null;private timer:ReturnType<typeof setInterval>|null=null;private next=0;private beat=0;
 private enabled=true;
 constructor(){try{this.enabled=localStorage.getItem('farm-music')!=='off';}catch{/* Preference storage can be unavailable. */}
  document.addEventListener('visibilitychange',()=>{if(document.hidden)void this.context?.suspend();else if(this.enabled)void this.resume();});
 }
 isEnabled(){return this.enabled;}
 async activate(){if(!this.enabled)return;try{await this.resume();}catch{/* Audio remains optional if this browser cannot start it. */}}
 async toggle(){this.enabled=!this.enabled;try{localStorage.setItem('farm-music',this.enabled?'on':'off');}catch{}if(this.enabled)await this.activate();else{await this.context?.suspend();document.querySelector<HTMLElement>('#app')!.dataset.music='off';}}
 private async resume(){
  if(!this.context){this.context=new AudioContext();this.output=this.context.createGain();this.output.gain.value=.21;const compressor=this.context.createDynamicsCompressor();this.output.connect(compressor);compressor.connect(this.context.destination);}
  if(this.context.state!=='running'||!this.timer){await this.context.resume();this.next=this.context.currentTime+.08;}
  document.querySelector<HTMLElement>('#app')!.dataset.music=this.context.state;
  if(!this.timer)this.timer=setInterval(()=>this.schedule(),100);
 }
 private note(note:number,time:number,pluck:boolean,length:number){
  const ctx=this.context!,gain=ctx.createGain(),filter=ctx.createBiquadFilter();filter.type='lowpass';filter.frequency.setValueAtTime(pluck?1900:950,time);filter.frequency.exponentialRampToValueAtTime(400,time+length);gain.connect(filter);filter.connect(this.output!);
  gain.gain.setValueAtTime(.0001,time);gain.gain.exponentialRampToValueAtTime(pluck?.2:.11,time+.015);gain.gain.exponentialRampToValueAtTime(.0001,time+length);
  for(const [ratio,level]of [[1,1],[2,pluck?.2:.08],[3,.035]]){const oscillator=ctx.createOscillator(),partial=ctx.createGain();oscillator.type='sine';oscillator.frequency.value=hz(note)*ratio;partial.gain.value=level;oscillator.connect(partial);partial.connect(gain);oscillator.start(time);oscillator.stop(time+length+.03);oscillator.onended=()=>{oscillator.disconnect();partial.disconnect();if(ratio===3){gain.disconnect();filter.disconnect();}};}
 }
 private schedule(){
  const ctx=this.context;if(!ctx||ctx.state!=='running'||!this.enabled||document.hidden)return;
  if(this.next<ctx.currentTime)this.next=ctx.currentTime+.03;
  const step=60/72/2;
  while(this.next<ctx.currentTime+.24){const n=this.beat%64,chord=chords[Math.floor(n/16)],tone=chord[[0,2,1,3,2,1,3,1][n%8]];this.note(tone,this.next,true,1.5);if(n%4===0)this.note(chord[0]-12,this.next,false,2.4);if(n%2===0){const lead=melody[Math.floor(n/2)];if(lead!==null)this.note(lead,this.next+.025,false,1.8);}this.next+=step;this.beat++;}
 }
}
