import {snapshot,type Snapshot} from './storage';
import {createClock} from './clock';
import {createGarden} from './gardening';
import {prepareMicroscopeTest} from './microscope-test-setup';
import {createForest} from './forest';
export type MaterialCheckpoint='workshop'|'annie'|'leo';
export function prepareMaterialConversationTest(source:Snapshot,checkpoint:MaterialCheckpoint):Snapshot{
 const base=snapshot({x:300,y:260},createClock(9),createGarden());base.farmName=source.farmName;base.farmerName=source.farmerName;
 const next=prepareMicroscopeTest(base)!;
 const r=next.travel.research;r.repaired=false;r.discovered=checkpoint!=='workshop';r.examined=checkpoint==='workshop'?[]:['vat','pipes','filter','coil'];r.materials={scrap:0,copper:0,glass:0,linen:0};r.supplied=[];delete r.microscopeDelivered;delete r.materialHelpSeen;
 next.travel.forest=createForest();next.story={giftReceived:true,morningSeen:true,birdhouse:null};
 next.player=checkpoint==='workshop'?{x:337,y:3415}:checkpoint==='annie'?{x:450,y:2620}:{x:450,y:1920};
 return next;
}
