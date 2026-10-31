import {inLarchGlade,larchTrunkBlocked} from './larch-glade';
import {distanceToSouthPath,swampAt} from './south-forest-layout';
import type {NoahTestState} from './noah-story';
export const southRoot={x:-650,y:2500};
export const inNoahSouth=(x:number,y:number)=>x<0&&y>=1300&&y<2920;
export function southBlocked(x:number,y:number,state:NoahTestState){
 if(x>=0||y<1300)return null;
 if(!state.upgraded&&y>1295)return true;
 if(y>2880||x< -1040||x> -120)return true;
 if(larchTrunkBlocked(x,y))return true;
 if(y<1350)return Math.abs(x+444)>31;
 if(y>2475&&!state.rootDefeated)return true;
 if(inLarchGlade(x,y))return false;
 return distanceToSouthPath(x,y)>(swampAt(x,y)?165:94);
}
