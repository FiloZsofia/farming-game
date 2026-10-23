export const DAY_SECONDS=360;
export const WARNING_TIMES=[480,540] as const;
export type Clock={day:number;elapsed:number;collapseAt:number};
export const createClock=(day=1,random=Math.random):Clock=>({day,elapsed:0,collapseAt:570+Math.min(.999999999,Math.max(0,random()))*30});
export function advanceClock(clock:Clock,seconds:number){
 const previous=clock.elapsed;
 clock.elapsed=Math.min(clock.collapseAt,previous+Math.max(0,seconds));
 return {warnings:WARNING_TIMES.filter(t=>previous<t&&clock.elapsed>=t),collapse:clock.elapsed>=clock.collapseAt};
}
export const nightOpacity=(clock:Clock)=>Math.min(.55,Math.max(0,(clock.elapsed-315)/90)*.55);
export function clockLabel(clock:Clock){
 const night=clock.elapsed>=DAY_SECONDS;
 const seconds=Math.floor(night?clock.elapsed-DAY_SECONDS:clock.elapsed);
 return `${night?'Éjszaka':clock.elapsed<180?'Délelőtt':'Délután'} · ${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`;
}

// Keep the prototype at the end of its first spring; later saves stay intact.
export const SPRING_PREVIEW_LAST_DAY=15;
export const isTestingFarm=(name?:string|null)=>name?.normalize('NFC').trim().toLocaleLowerCase('hu-HU')==='erdőszéli birtok';
export const springPreviewComplete=(clock:Clock,farmName?:string|null)=>!isTestingFarm(farmName)&&(clock.day>SPRING_PREVIEW_LAST_DAY||clock.day===SPRING_PREVIEW_LAST_DAY&&clock.elapsed>=clock.collapseAt);
