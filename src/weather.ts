import {waterPlot} from './gardening';
import type {Garden} from './gardening';
export type Weather='sunny'|'cloudy'|'rain';
export const weatherNames:Record<Weather,string>={sunny:'Napos',cloudy:'Felhős',rain:'Esős'};
export const randomWeatherSeed=()=>crypto.getRandomValues(new Uint32Array(1))[0];
export const validWeatherSeed=(value:unknown):value is number=>Number.isSafeInteger(value)&&Number(value)>=0&&Number(value)<=0xffffffff;
// A saved seed fixes each shuffled fifteen-day block, including after reloads.
export function weatherSchedule(seed:number,block=0):Weather[]{
 let state=(seed^Math.imul(block+1,0x9e3779b9))>>>0;
 const random=()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296;};
 const days:Weather[]=[...Array<Weather>(9).fill('sunny'),...Array<Weather>(3).fill('cloudy'),...Array<Weather>(3).fill('rain')];
 for(let i=days.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[days[i],days[j]]=[days[j],days[i]];}
 return days;
}
export const weatherOnDay=(seed:number,day:number):Weather=>weatherSchedule(seed,Math.floor((day-1)/15))[(day-1)%15];
export function waterFromRain(garden:Garden){let changed=false;for(const plot of garden.plots.values()){if(!plot.watered){waterPlot(plot);changed=true;}else if(plot.mulched)plot.moisture=3;}return changed;}
