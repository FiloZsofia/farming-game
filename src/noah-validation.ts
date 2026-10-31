import type {NoahTestState} from './noah-story';
import {southHerbs} from './south-forest-layout';
export function validNoahChapter(value:unknown,day:number):value is NoahTestState{
 if(!value||typeof value!=='object')return false;const s=value as NoahTestState;
 const count=(v:unknown)=>Number.isSafeInteger(v)&&Number(v)>=0&&Number(v)<=999999;
 if(!Number.isSafeInteger(s.sentDay)||s.sentDay<1||s.sentDay>day||!['mixtureMade','endSeen','letter','simonAsked','upgraded','complete','rootDefeated','ingredientGathered'].every(k=>typeof s[k as keyof NoahTestState]==='boolean')||!count(s.concentrate)||!count(s.ingredient))return false;
 if(s.simonAsked&&!s.letter||s.upgraded&&!s.simonAsked||s.complete&&!s.mixtureMade||s.endSeen&&!s.complete)return false;
 if(!s.herbsPicked||typeof s.herbsPicked!=='object'||Array.isArray(s.herbsPicked)||!Object.entries(s.herbsPicked).every(([id,d])=>southHerbs.some(p=>p.id===id)&&Number.isSafeInteger(d)&&d>=1&&d<=day))return false;
 if(s.pendingResult!==undefined&&typeof s.pendingResult!=='boolean'||s.carrying!==undefined&&s.carrying!==null&&!['resin','aid','carrier','thyme','plantain','concentrate'].includes(s.carrying))return false;
 if(s.conePickedDay!==undefined&&(!Number.isSafeInteger(s.conePickedDay)||s.conePickedDay<1||s.conePickedDay>day))return false;
 const patch=s.conePatch;if(patch!==undefined&&(!patch||!Array.isArray(patch.cones)||patch.cones.length>3||new Set(patch.cones.map(c=>c?.id)).size!==patch.cones.length||patch.cones.some(c=>!c||!Number.isSafeInteger(c.id)||c.id<0||!Number.isFinite(c.x)||!Number.isFinite(c.y)||c.x< -1040||c.x> -600||c.y<2650||c.y>2920||!Number.isFinite(c.angle)||typeof c.picked!=='boolean')||patch.readyDay!==null&&(!Number.isSafeInteger(patch.readyDay)||patch.readyDay<1||patch.readyDay>day+3)))return false;
 const e=s.extraction;if(e!==undefined&&(!e||!['prepare','load','extract','filter','cool','dose','bottle','done'].includes(e.phase)||!['resin','aid','carrierReady'].every(k=>typeof e[k as keyof typeof e]==='boolean')||!['carrierMix','heat','temperature','progress','coolant','fill'].every(k=>Number.isFinite(e[k as keyof typeof e])&&Number(e[k as keyof typeof e])>=0&&Number(e[k as keyof typeof e])<=1)||!Array.isArray(e.loaded)||new Set(e.loaded).size!==e.loaded.length||e.loaded.some(id=>!['thyme','plantain','carrier'].includes(id))))return false;
 return true;
}
