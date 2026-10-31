import {snapshot,type Snapshot} from './storage';
import {createClock} from './clock';
import {createGarden} from './gardening';
import {debris} from './cleanup';
import {weatherOnDay} from './weather';
export function prepareArtStudy(source:Snapshot){
 const next=snapshot({x:300,y:260},createClock(9),createGarden());
 next.farmName='Erdőszéli látványteszt';next.farmerName=source.farmerName;next.clock.elapsed=180;
 next.story={giftReceived:true,morningSeen:true,birdhouse:null,journalHelpConfirmed:true,flowerHoeDone:true,flowerWaterDone:true};
 next.travel.metAnnie=true;next.travel.metLeo=true;next.travel.research.gifted=true;next.travel.research.seeds=6;
 for(let seed=0;seed<1000;seed++)if(weatherOnDay(seed,9)==='cloudy'){next.travel.weatherSeed=seed;break;}
 for(const d of debris)next.clearing.removed[d.id]=9;
 return next;
}
