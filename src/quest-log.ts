import {forestQuest,type Forest} from './forest';
import {FLOWER_DAYS,workshopEntered,workshopText,type Research} from './research';
import {tileKey,type Garden} from './gardening';
export type QuestEntry={id:string;title:string;detail:string;done:boolean};
export function questEntries(r:Research,garden:Garden,_day:number,_elapsed:number,forest?:Forest):QuestEntry[]{
 const entries:QuestEntry[]=[{id:'locked-building',title:r.discovered?'Fedezd fel, mit rejt a lezárt melléképület':workshopText('Fedezd fel, mit rejt a lezárt melléképület',workshopEntered(r)),detail:'',done:r.discovered}];
 if(!r.gifted)return entries;
 entries.push({id:'plant-flowers',title:'Ültess el 6 tasak vadvirágmagot',detail:`Elültetve: ${r.flowers.length} / 6.`,done:r.flowers.length===6});
 if(r.flowers.length===6){
  const progress=Math.min(...r.flowers.map(f=>Math.min(FLOWER_DAYS,f.growth+(garden.plots.get(tileKey(f))?.watered?1:0))));
  const bloomed=r.flowers.every(f=>f.growth===FLOWER_DAYS);
  entries.push({id:'grow-flowers',title:'Gondozd a vadvirágokat',detail:bloomed?'Mind a hat vadvirág kivirágzott.':`${progress} / 4 megöntözött nap`,done:bloomed});
  if(bloomed)entries.push({id:'observe-bee',title:'Figyeld meg a virágokhoz látogató szarvas faliméhet',detail:'',done:!!r.observation});
 }
 if(r.observation)entries.push({id:'report-bee',title:'Meséld el Leonak a megfigyelésedet',detail:r.key?'Beszámoltál a látottakról.':'',done:r.key});
 if(r.discovered)entries.push({id:'repair-machine',title:'Javítsd meg a régi berendezést',detail:r.repaired?'A növényi kivonatkészítő ismét egyben van.':'',done:r.repaired});
 if(r.repaired)entries.push({id:'forest-research',title:forest?.sent?'A minta úton van a laborba':forestQuest(forest??{sample:false,examined:false} as Forest),detail:'',done:!!forest?.sent});
 return entries;
}
