export type ExtractionPhase='prepare'|'load'|'extract'|'filter'|'cool'|'dose'|'bottle'|'done';
export type Extraction={phase:ExtractionPhase;resin:boolean;aid:boolean;carrierMix:number;carrierReady:boolean;loaded:string[];heat:number;temperature:number;progress:number;coolant:number;fill:number};
export const createExtraction=():Extraction=>({phase:'prepare',resin:false,aid:false,carrierMix:0,carrierReady:false,loaded:[],heat:0,temperature:.12,progress:0,coolant:0,fill:0});
export function canLoadExtraction(s:Extraction){return ['thyme','plantain','carrier'].every(id=>s.loaded.includes(id));}
export function dropExtraction(s:Extraction,id:string,target:string){
 if(target==='carrier'&&s.phase==='prepare'&&(id==='resin'&&!s.resin||id==='aid'&&!s.aid)){if(id==='resin')s.resin=true;else s.aid=true;return true;}
 if(target==='vat'&&s.phase==='load'&&['thyme','plantain','carrier'].includes(id)&&!s.loaded.includes(id)&&(id!=='carrier'||s.carrierReady)){s.loaded.push(id);return true;}
 if(target==='dose'&&s.phase==='dose'&&id==='concentrate'){s.phase='bottle';return true;}return false;
}
export function stepExtraction(s:Extraction,dt:number,action:string|null){
 dt=Math.min(.1,Math.max(0,dt));
 if(s.phase==='prepare'&&s.resin&&s.aid&&action==='carrier'){s.carrierMix=Math.min(1,s.carrierMix+dt/2.5);if(s.carrierMix===1){s.carrierReady=true;s.phase='load';}}
 else if(s.phase==='extract'){
  s.temperature=Math.max(0,Math.min(1,s.temperature+dt*(s.heat-s.temperature)*.35));
  if(action==='stir'&&s.temperature>=.4&&s.temperature<=.72)s.progress=Math.min(1,s.progress+dt/5);
  if(s.progress===1){s.phase='filter';s.progress=0;s.heat=0;}
 }else if(s.phase==='filter'&&action==='filter'){s.progress=Math.min(1,s.progress+dt/3);if(s.progress===1){s.phase='cool';s.progress=0;}}
 else if(s.phase==='cool'){s.temperature=Math.max(.08,s.temperature-dt*s.coolant*.13);if(s.temperature<=.12)s.phase='dose';}
 else if(s.phase==='bottle'&&action==='bottle'){s.fill=Math.min(1,s.fill+dt/3);if(s.fill===1)s.phase='done';}
}
