import {recordStoryProgress,recordStoryEvent} from './story-archive';
import type {Snapshot} from './storage';
import {prepareMicroscopeTest} from './microscope-test-setup';
import type {NoahTestConfig,NoahTestState,NoahCheckpoint} from './noah-story';
export * from './noah-story';
export function prepareNoahTest(source:Snapshot,config:NoahTestConfig,checkpoint:NoahCheckpoint){
 const snapshot=prepareMicroscopeTest(source)!;
 snapshot.player={x:132,y:482};snapshot.travel.research.microscopeDelivered=true;
 snapshot.travel.forest!.sample=true;snapshot.travel.forest!.examined=true;snapshot.travel.forest!.sent=true;
 snapshot.travel.storyEndSeen=true;
 snapshot.travel.estate.produce.thyme=Math.max(snapshot.travel.estate.produce.thyme,config.thyme);
 snapshot.travel.estate.produce.plantain=Math.max(snapshot.travel.estate.produce.plantain,config.plantain);
 snapshot.clearing.wood=Math.max(snapshot.clearing.wood,config.wood);
 snapshot.travel.research.materials.scrap=Math.max(snapshot.travel.research.materials.scrap,config.scrap);
 snapshot.economy.gold=Math.max(snapshot.economy.gold,config.gold);
 const state:NoahTestState={herbsPicked:{},sentDay:snapshot.clock.day-(checkpoint==='waiting'?0:3),mixtureMade:false,endSeen:false,letter:checkpoint!=='letter'&&checkpoint!=='waiting',simonAsked:checkpoint==='log'||checkpoint==='forest'||checkpoint==='marsh'||checkpoint==='root'||checkpoint==='spores'||checkpoint==='resin'||checkpoint==='mix',upgraded:checkpoint==='log'||checkpoint==='forest'||checkpoint==='marsh'||checkpoint==='root'||checkpoint==='spores'||checkpoint==='resin'||checkpoint==='mix',complete:false,concentrate:checkpoint==='letter'||checkpoint==='waiting'?0:config.shipment,ingredient:checkpoint==='mix'?config.ingredient:0,rootDefeated:checkpoint==='mix'||checkpoint==='resin',ingredientGathered:checkpoint==='mix'};
 if(checkpoint==='simon')snapshot.player={x:320,y:4635};
 if(checkpoint==='mix')snapshot.player={x:337,y:3415};
 if(checkpoint==='log')snapshot.player={x:-350,y:1540};
 if(checkpoint==='forest')snapshot.player={x:-444,y:1140};
 if(checkpoint==='marsh')snapshot.player={x:-430,y:2000};
 if(checkpoint==='resin')snapshot.player={x:-867,y:2828};
 if(checkpoint==='spores')snapshot.player={x:-690,y:1750};
 if(checkpoint==='root'){snapshot.player={x:-665,y:2450};snapshot.clock.elapsed=390;}
 recordStoryProgress(snapshot.travel,snapshot.clock.day);if(state.letter)recordStoryEvent(snapshot.travel,'noah',state.sentDay+3);
 snapshot.travel.noah=structuredClone(state);return {snapshot,state};
}
