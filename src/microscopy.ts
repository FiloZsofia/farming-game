export const sampleNames={nest:'Fészekminta',thyme:'Vadkakukkfű levélmintája',plantain:'Lándzsás útifű levélmintája',nettle:'Csalán levélmintája',pollen:'Vadvirág virágpora',pond:'Tóvízminta'} as const;
export type SampleId=keyof typeof sampleNames;
export type MicroscopeView={sample:SampleId|null;zoom:0|1|2;focus:number;x:number;y:number};
export type MicroFeature={id:string;x:number;y:number;zoom:0|1|2;name:string;text:string};
export type MicroRecord={sample:SampleId;feature:string;day:number};
export type MicroPhoto={view:MicroscopeView;day:number};
export type Microscopy={slides:SampleId[];view:MicroscopeView;observations:MicroRecord[];photos:MicroPhoto[]};
export const magnifications=[40,100,400] as const;
export const slideScales=[.42,.85,1.8] as const;
export const focalTargets=[72,54,36] as const;
export const isSample=(id:unknown):id is SampleId=>typeof id==='string'&&Object.hasOwn(sampleNames,id);
export const leafSample=(id:SampleId)=>['thyme','plantain','nettle'].includes(id);
export function sampleFeatures(id:SampleId):MicroFeature[]{
 if(id==='nest')return [{id:'hypha',x:500,y:350,zoom:0,name:'Elágazó gombafonalak',text:'Finom, elágazó gombafonalak látszanak. A fajuk és a fészekben betöltött szerepük ebből még nem állapítható meg.'},{id:'pollen',x:260,y:220,zoom:1,name:'Pollenszemek',text:'Szemcsés felszínű pollenszemek maradtak a mintában. A faliméhek virágport gyűjtenek az utódaiknak.'},{id:'fiber',x:735,y:485,zoom:2,name:'Növényi rost',text:'Hosszanti csíkozású növényi rost. A fészekmaradvány többféle anyagból áll.'}];
 if(id==='pond')return [{id:'algae',x:500,y:350,zoom:0,name:'Zöld algafonalak',text:'Egymáshoz kapcsolódó zöld sejtek. A tó vizében szabad szemmel alig látható élet is van.'},{id:'debris',x:260,y:220,zoom:1,name:'Növényi törmelék',text:'Egy apró növényi maradvány sejtes szerkezete rajzolódik ki.'},{id:'bubble',x:735,y:485,zoom:2,name:'Légbuborék',text:'Szabályos, fénytörő szegélyű kör. Nem minden érdekes alakzat élőlény.'}];
 if(id==='pollen')return [{id:'grains',x:500,y:350,zoom:0,name:'Pollenszemcsoport',text:'Több pollenszem tapadt egymáshoz. Alakjuk és felszínük különbözik a növényi rostokétól.'},{id:'surface',x:260,y:220,zoom:1,name:'Mintázott pollenfal',text:'A pollenszem külső falán apró felszíni mintázatok látszanak.'},{id:'fiber',x:735,y:485,zoom:2,name:'Virágrészlet',text:'A virágporral együtt egy apró növényi részlet is a tárgylemezre került.'}];
 return [{id:'cells',x:500,y:350,zoom:0,name:'Bőrszöveti sejtek',text:'Egymásba illeszkedő sejtek fedik a levél felszínét.'},{id:'fiber',x:260,y:220,zoom:1,name:'Levélér részlete',text:'Hosszanti növényi szövetek futnak a mintában.'},{id:'stoma',x:735,y:485,zoom:2,name:'Gázcserenyílás',text:'Két zárósejt között keskeny nyílás látszik. A levél ezeken keresztül is kapcsolatot tart a környezetével.'}];
}
export function createMicroscopy(slides:SampleId[]=[],focus=0,examined=false):Microscopy{return {slides:[...new Set(slides)],view:{sample:slides[0]??null,zoom:0,focus,x:500,y:350},observations:examined&&slides.includes('nest')?[{sample:'nest',feature:'hypha',day:1}]:[],photos:[]};}
export function sharpView(view:MicroscopeView){return Math.abs(view.focus-focalTargets[view.zoom])<=8;}
export function viewedFeature(view:MicroscopeView){return view.sample&&sharpView(view)?sampleFeatures(view.sample).find(f=>view.zoom>=f.zoom&&Math.hypot(f.x-view.x,f.y-view.y)*slideScales[view.zoom]<=62)??null:null;}
export function panSlide(view:MicroscopeView,dx:number,dy:number):MicroscopeView{return {...view,x:Math.max(80,Math.min(920,view.x-dx/slideScales[view.zoom])),y:Math.max(80,Math.min(620,view.y-dy/slideScales[view.zoom]))};}
export function recordMicroObservation(state:Microscopy,day:number):Microscopy|null{const feature=viewedFeature(state.view),sample=state.view.sample;if(!feature||!sample||state.observations.some(o=>o.sample===sample&&o.feature===feature.id))return null;const next=structuredClone(state);next.observations.push({sample,feature:feature.id,day});return next;}
export function captureMicroPhoto(state:Microscopy,day:number):Microscopy|null{if(!state.view.sample||state.photos.length>=128)return null;const next=structuredClone(state);next.photos.push({view:{...state.view},day});return next;}
export function validMicroscopy(value:unknown,day:number):value is Microscopy{
 if(!value||typeof value!=='object')return false;const s=value as Microscopy;
 const view=(v:MicroscopeView)=>!!v&&(v.sample===null||isSample(v.sample)&&s.slides.includes(v.sample))&&[0,1,2].includes(v.zoom)&&Number.isFinite(v.focus)&&v.focus>=0&&v.focus<=100&&Number.isFinite(v.x)&&v.x>=80&&v.x<=920&&Number.isFinite(v.y)&&v.y>=80&&v.y<=620;
 const date=(d:number)=>Number.isSafeInteger(d)&&d>=1&&d<=day;
 return Array.isArray(s.slides)&&s.slides.length<=Object.keys(sampleNames).length&&new Set(s.slides).size===s.slides.length&&s.slides.every(isSample)&&view(s.view)&&Array.isArray(s.observations)&&s.observations.length<=18&&s.observations.every(o=>o&&s.slides.includes(o.sample)&&date(o.day)&&sampleFeatures(o.sample).some(f=>f.id===o.feature))&&new Set(s.observations.map(o=>`${o.sample}:${o.feature}`)).size===s.observations.length&&Array.isArray(s.photos)&&s.photos.length<=128&&s.photos.every(p=>p&&date(p.day)&&view(p.view)&&p.view.sample!==null);
}
