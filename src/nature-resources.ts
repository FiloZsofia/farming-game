import type {Forest} from './forest';
import {weatherOnDay} from './weather';
export const natureSites=[
 {id:'branch-edge',kind:'wood',x:-115,y:897},{id:'branch-birch',kind:'wood',x:-240,y:880},{id:'branch-slope',kind:'wood',x:-370,y:925},{id:'branch-rest',kind:'wood',x:-520,y:1095},{id:'branch-brook',kind:'wood',x:-170,y:1118},{id:'branch-hollow',kind:'wood',x:-775,y:1170},
 {id:'stone-east',kind:'stone',x:-195,y:1250},{id:'stone-reeds',kind:'stone',x:-290,y:1245},{id:'stone-bridge',kind:'stone',x:-390,y:1227},{id:'stone-west',kind:'stone',x:-530,y:1235},{id:'stone-fern',kind:'stone',x:-725,y:1260},{id:'stone-bank',kind:'stone',x:-825,y:1282},
] as const;
export type NatureSite=typeof natureSites[number];
// Rain and the breezy cloudy days replenish fallen wood; sunny days do not.
export function natureReady(f:Forest,site:NatureSite,day:number,seed:number){const last=f.gathered?.[site.id];if(last===undefined)return true;if(day-last<3)return false;if(site.kind==='stone'||day-last>=15)return true;for(let d=last+1;d<=day;d++)if(weatherOnDay(seed,d)!=='sunny')return true;return false;}
export const validGathered=(v:unknown,day:number)=>v===undefined||!!v&&typeof v==='object'&&!Array.isArray(v)&&Object.entries(v).every(([id,n])=>natureSites.some(s=>s.id===id)&&Number.isSafeInteger(n)&&n>=1&&n<=day);

// A pickup lies on the ground, never pasted onto a baked tree crown.
export const natureTreeClear=(x:number,y:number,scale=1)=>natureSites.every(p=>Math.abs(p.x-x)>=42*scale+18||p.y<y-98*scale-18||p.y>y+12*scale+18);
