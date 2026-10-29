import type {Travel} from './travel';
import {POLLINATION_OBSERVATION_TEXT,POLLINATION_OBSERVATION_TITLE} from './pollination-observation';
export const storyIds=['leo','bee','empty-blossoms','workshop','nest','sent','noah','result'] as const;
export type StoryId=typeof storyIds[number];
export type StoryEvent={id:StoryId;day?:number};
export const SAM_LETTER='Találtam egy szokatlan bevonatot egy elhagyott faliméhfészekben. A mikroszkóp alatt gombafonalakat látok. Segítenél azonosítani? Egyelőre nem tudom, van-e köze a méhek megfogyatkozásához. — Sam';
export const NEST_FINDING='Vajon ezek okozták a bajt, vagy csak később telepedtek meg az elhagyott fészekben? Ennyiből még a fajt sem tudom biztosan megállapítani. Elküldök egy mintát a korábbi kollégámnak, Noah-nak.';
export const MACHINE_REVEAL='A tartály stabil, a csövek ismét zárnak, a szűrő és a hűtőspirál is a helyére került. Most már felismerem: növényi kivonatok készítésére használták.\n\nTalán az erdőben találok valami hasznosat, amivel elkezdhetem a kísérletezést.';
const titles:Record<StoryId,string>={leo:'A faliméhek nyomában',bee:'Az első szarvas faliméh','empty-blossoms':POLLINATION_OBSERVATION_TITLE,workshop:'A Műhely újra életre kel',nest:'Gombafonalak',sent:'Levél Noah-nak',noah:'Noah válasza',result:'Az első kísérlet eredménye'};
export const EXPERIMENT_FINDING='A kezelt mintán lassabban terjednek a gombafonalak, de ez még nem bizonyítja, hogy a keveréket biztonságosan használhatom a méhek közelében. Meg kell osztanom az eredményt Noah-val.';
const texts:Record<StoryId,string>={leo:'Tavaly ilyenkor sok szarvas faliméh járt a csemeték virágaira. Idén eddig alig láttam belőlük. Nálad megfordultak?\n\nHoztam hat tasak vadvirágmagot. Ültesd el őket, és nézzük meg, kik látogatják a virágokat! A szarvas faliméh sötét fejű, rozsdabarna potrohú, tavasszal a gyümölcsfák fontos beporzója.',bee:'Sötét fej, rozsdabarna potroh… Igen, ő az. Egy példány már rátalált a virágokra. Ez még nem mondja meg, miért láttak belőlük olyan keveset.','empty-blossoms':POLLINATION_OBSERVATION_TEXT,workshop:MACHINE_REVEAL,nest:NEST_FINDING,sent:SAM_LETTER,noah:'',result:EXPERIMENT_FINDING};
function reached(t:Travel,id:StoryId){return id==='leo'?t.research.gifted:id==='bee'?!!t.research.observation:id==='empty-blossoms'?!!t.pollinationObservation:id==='workshop'?t.research.repaired:id==='nest'?!!t.forest?.examined:id==='sent'?!!t.forest?.sent:false;}
// Legacy saves have no discovery timestamps: preserve narrative order without inventing dates.
export function storyHistory(t:Travel):StoryEvent[]{return t.storyEvents??storyIds.filter(id=>reached(t,id)).map(id=>({id}));}
export function recordStoryEvent(t:Travel,id:StoryId,day:number){t.storyEvents??=storyHistory(t);if(!t.storyEvents.some(e=>e.id===id))t.storyEvents.push({id,day});}
export function recordStoryProgress(t:Travel,day:number){t.storyEvents??=storyHistory(t);for(const id of storyIds)if(reached(t,id))recordStoryEvent(t,id,day);}
export function archiveEntries(t:Travel,noah?:{letter:string|null;complete:boolean}){
 const history=storyHistory(t).filter(e=>e.id==='noah'?!!noah?.letter:e.id==='result'?!!noah?.complete:reached(t,e.id));
 // Older in-memory checkpoints may predate the archive recording hooks.
 for(const id of ['noah','result'] as const)if((id==='noah'?noah?.letter:noah?.complete)&&!history.some(e=>e.id===id)){const before=id==='noah'?history.findIndex(e=>e.id==='result'):-1;if(before>=0)history.splice(before,0,{id});else history.push({id});}
 return history.map(e=>({id:e.id,title:titles[e.id]+(e.day?` · ${e.day}. nap`:''),text:e.id==='noah'?noah!.letter!:texts[e.id]}));
}
export function validStoryEvents(value:unknown,day:number){return value===undefined||Array.isArray(value)&&value.length<=storyIds.length&&new Set(value.map(e=>e?.id)).size===value.length&&value.every(e=>e&&storyIds.includes(e.id)&&(e.day===undefined||Number.isSafeInteger(e.day)&&e.day>=1&&e.day<=day));}
