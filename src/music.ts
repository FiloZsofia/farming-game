// Original procedural instrumental scores: no external recordings or assets.
export const musicTracks={original:'Eredeti dallam',meadow:'Réti séta',sunny:'Napsütötte reggel'} as const;
export type MusicTrack=keyof typeof musicTracks;
const chords=[[48,55,59,64],[45,52,55,60],[41,48,52,57],[43,50,57,62]];
const melody=[64,67,69,67,64,null,62,null,60,64,67,null,64,62,60,null,65,69,67,64,65,null,64,null,62,67,69,67,62,null,59,null];
// A separate acoustic indie theme in D major: strummed strings, warm keys,
// a walking bass and a quiet brushed rhythm, with a longer melodic phrase.
const meadowChords=[[50,57,61,66],[47,54,57,62],[43,50,54,59],[45,52,59,64],[50,57,62,66],[42,49,54,57],[43,50,57,62],[45,52,57,61]];
const meadowMelody=[66,null,69,66,64,null,62,64,66,69,71,null,69,66,64,null,62,66,69,66,64,62,59,null,61,64,66,null,64,null,61,null,66,69,74,null,73,71,69,66,64,null,66,69,66,64,62,null,59,62,66,null,69,67,66,62,61,null,64,66,64,61,62,null];
const sunnyChords=[[48,55,60,64],[53,57,60,65],[55,59,62,67],[48,55,60,64],[57,60,64,69],[53,57,60,65],[55,59,62,67],[48,55,60,64]];
const sunnyMelody=[72,76,79,76,74,72,69,72,74,77,79,81,79,null,76,74,76,79,84,83,81,79,77,76,74,77,79,74,76,74,72,null];
const hz=(note:number)=>440*2**((note-69)/12);
export class FarmMusic{
 private context:AudioContext|null=null;private output:GainNode|null=null;private timer:ReturnType<typeof setInterval>|null=null;private next=0;private beat=0;
 private sources=new Set<AudioScheduledSourceNode>();private brushBuffer:AudioBuffer|null=null;
 private enabled=true;private track:MusicTrack='original';
 constructor(){try{this.enabled=localStorage.getItem('farm-music')!=='off';const saved=localStorage.getItem('farm-music-track');if(saved&&Object.hasOwn(musicTracks,saved))this.track=saved as MusicTrack;}catch{/* Preferences are optional. */}
  document.addEventListener('visibilitychange',()=>{if(document.hidden)void this.context?.suspend();else if(this.enabled)void this.activate();});
 }
 isEnabled(){return this.enabled;}
 getTrack(){return this.track;}
 async activate(){if(!this.enabled)return;try{await this.resume();}catch{/* Audio is optional when the browser cannot start it. */}}
 async toggle(){this.enabled=!this.enabled;try{localStorage.setItem('farm-music',this.enabled?'on':'off');}catch{}if(this.enabled)await this.activate();else{this.stopNotes();await this.context?.suspend();document.querySelector<HTMLElement>('#app')!.dataset.music='off';}}
 async setTrack(track:MusicTrack){
  if(!Object.hasOwn(musicTracks,track)||track===this.track)return;
  this.track=track;try{localStorage.setItem('farm-music-track',track);}catch{}
  this.stopNotes();this.beat=0;this.next=(this.context?.currentTime??0)+.08;
  document.querySelector<HTMLElement>('#app')!.dataset.musicTrack=track;
  if(this.enabled)await this.activate();
 }
 async playHarvest(){if(!this.enabled)return;await this.activate();if(this.context?.state!=='running')return;const t=this.context.currentTime+.01;this.acoustic(76,t,'guitar',.17,.16);this.acoustic(83,t+.055,'keys',.12,.22);}
 async playSurprise(){if(!this.enabled)return;await this.activate();if(this.context?.state!=='running')return;const time=this.context.currentTime+.02;this.acoustic(79,time,'keys',.2,.13);this.acoustic(72,time+.12,'keys',.17,.3);}
 private stopNotes(){for(const source of this.sources){try{source.stop((this.context?.currentTime??0)+.025);}catch{}}this.sources.clear();}
 private async resume(){
  if(!this.context){this.context=new AudioContext();this.output=this.context.createGain();this.output.gain.value=.21;const compressor=this.context.createDynamicsCompressor();this.output.connect(compressor);compressor.connect(this.context.destination);}
  if(this.context.state!=='running'||!this.timer){await this.context.resume();this.next=this.context.currentTime+.08;}
  const app=document.querySelector<HTMLElement>('#app')!;app.dataset.music=this.context.state;app.dataset.musicTrack=this.track;
  if(!this.timer)this.timer=setInterval(()=>this.schedule(),100);
 }
 private note(note:number,time:number,pluck:boolean,length:number){
  const ctx=this.context!,gain=ctx.createGain(),filter=ctx.createBiquadFilter();filter.type='lowpass';filter.frequency.setValueAtTime(pluck?1900:950,time);filter.frequency.exponentialRampToValueAtTime(400,time+length);gain.connect(filter);filter.connect(this.output!);
  gain.gain.setValueAtTime(.0001,time);gain.gain.exponentialRampToValueAtTime(pluck?.2:.11,time+.015);gain.gain.exponentialRampToValueAtTime(.0001,time+length);
  for(const [ratio,level]of [[1,1],[2,pluck?.2:.08],[3,.035]]){const oscillator=ctx.createOscillator(),partial=ctx.createGain();oscillator.type='sine';oscillator.frequency.value=hz(note)*ratio;partial.gain.value=level;oscillator.connect(partial);partial.connect(gain);this.sources.add(oscillator);oscillator.start(time);oscillator.stop(time+length+.03);oscillator.onended=()=>{this.sources.delete(oscillator);oscillator.disconnect();partial.disconnect();if(ratio===3){gain.disconnect();filter.disconnect();}};}
 }
 private acoustic(note:number,time:number,voice:'guitar'|'keys'|'bass',volume:number,length:number){
  const ctx=this.context!,gain=ctx.createGain(),filter=ctx.createBiquadFilter();filter.type='lowpass';filter.frequency.setValueAtTime(voice==='guitar'?2300:voice==='bass'?450:1500,time);filter.frequency.exponentialRampToValueAtTime(voice==='bass'?180:500,time+length);gain.connect(filter);filter.connect(this.output!);
  gain.gain.setValueAtTime(.0001,time);gain.gain.exponentialRampToValueAtTime(volume,time+(voice==='keys'?.035:.008));gain.gain.exponentialRampToValueAtTime(.0001,time+length);
  const oscillator=ctx.createOscillator();oscillator.type=voice==='keys'?'sine':'triangle';oscillator.frequency.value=hz(note);oscillator.connect(gain);this.sources.add(oscillator);oscillator.start(time);oscillator.stop(time+length+.03);oscillator.onended=()=>{this.sources.delete(oscillator);oscillator.disconnect();gain.disconnect();filter.disconnect();};
 }
 private brush(time:number){
  const ctx=this.context!;
  if(!this.brushBuffer){this.brushBuffer=ctx.createBuffer(1,Math.ceil(ctx.sampleRate*.07),ctx.sampleRate);const data=this.brushBuffer.getChannelData(0);let seed=127;for(let i=0;i<data.length;i++){seed=(seed*1664525+1013904223)>>>0;data[i]=(seed/4294967296*2-1)*(1-i/data.length);}}
  const source=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),gain=ctx.createGain();source.buffer=this.brushBuffer;filter.type='bandpass';filter.frequency.value=4700;filter.Q.value=.65;gain.gain.setValueAtTime(.009,time);gain.gain.exponentialRampToValueAtTime(.0001,time+.07);source.connect(filter);filter.connect(gain);gain.connect(this.output!);this.sources.add(source);source.start(time);source.stop(time+.08);source.onended=()=>{this.sources.delete(source);source.disconnect();filter.disconnect();gain.disconnect();};
 }
 private schedule(){
  const ctx=this.context;if(!ctx||ctx.state!=='running'||!this.enabled||document.hidden)return;
  if(this.next<ctx.currentTime)this.next=ctx.currentTime+.03;
  const step=60/(this.track==='original'?72:this.track==='sunny'?106:84)/2;
  while(this.next<ctx.currentTime+.24){
   if(this.track==='original'){
    const n=this.beat%64,chord=chords[Math.floor(n/16)],tone=chord[[0,2,1,3,2,1,3,1][n%8]];this.note(tone,this.next,true,1.5);if(n%4===0)this.note(chord[0]-12,this.next,false,2.4);if(n%2===0){const lead=melody[Math.floor(n/2)];if(lead!==null)this.note(lead,this.next+.025,false,1.8);}
   }else if(this.track==='sunny'){
    const n=this.beat%64,chord=sunnyChords[Math.floor(n/8)],time=this.next;
    if(n%2===0){for(const [index,tone]of chord.entries())this.acoustic(tone+12,time+index*.012,'guitar',n%4===0?.045:.03,.27);}
    if(n%4===0)this.acoustic(chord[n%8===4?1:0]-12,time,'bass',.12,.52);
    if(n%2===0){const lead=sunnyMelody[Math.floor(n/2)];if(lead!==null)this.acoustic(lead,time+.025,'keys',.14,.43);}
    if(n%4===2)this.brush(time);
   }else{
    const n=this.beat%128,chord=meadowChords[Math.floor(n/8)%8],swing=n%2?.025:0,time=this.next+swing;
    if(n%8===0){for(const [index,tone]of chord.entries())this.acoustic(tone,time+index*.018,'guitar',.07,1.35);}
    if(n%8===3||n%8===6)this.acoustic(chord[n%8===3?2:3],time,'guitar',.1,.85);
    if(n%4===0)this.acoustic(chord[0]-12,time,'bass',.13,1.3);
    if(n%2===0){const lead=meadowMelody[Math.floor(n/2)];if(lead!==null)this.acoustic(lead,time+.035,'keys',.15,1.65);}
    if(n%4===1)this.brush(time);
   }
   this.next+=step;this.beat++;
  }
 }
}
