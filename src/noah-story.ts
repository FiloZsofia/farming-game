import type {Snapshot} from './storage';
import type {ConePatch} from './larch-cones';
import {createExtraction,type Extraction} from './extraction';
export type NoahTestConfig={thyme:number;plantain:number;concentrate:number;shipment:number;ingredient:number;ingredientName:string;wood:number;scrap:number;gold:number};
export const noahTestConfig:NoahTestConfig={thyme:2,plantain:2,concentrate:1,shipment:4,ingredient:1,ingredientName:'Vörösfenyőgyanta',wood:25,scrap:14,gold:310};
export type NoahCheckpoint='waiting'|'letter'|'simon'|'forest'|'marsh'|'root'|'spores'|'resin'|'mix'|'log';
export type NoahTestState={extraction?:Extraction;pendingResult?:boolean;carrying?:string|null;conePatch?:ConePatch;conePickedDay?:number;herbsPicked:Record<string,number>;sentDay:number;mixtureMade:boolean;endSeen:boolean;letter:boolean;simonAsked:boolean;upgraded:boolean;complete:boolean;concentrate:number;ingredient:number;rootDefeated:boolean;ingredientGathered:boolean};
export const noahLetter=`Sam!

A város környéki méhészetek közül többnél gombás fertőzést találtak a fiasításban. Nagy rajtunk a nyomás, hogy a hatóanyagot minél előbb biztosra fejlesszük, mert már egész méhcsaládok pusztultak ki, és a továbbterjedés felszámolásában néhányan a megmaradt családok elpusztítását gondolják helyesnek, ez azonban még nagyobb kárt okozna a természet egyensúlyában.

Küldök négy adag kísérleti koncentrátumot. Nyugodtan végezz vele te is próbákat, de egyelőre csak a félretett mintán: a természetben még ne használd.

Önmagában még nem ad tartós eredményt. A kezelt felületen nem marad meg megfelelően, ezért kötőanyagot is tartalmazó hordozókeverékre van szükségünk. Az előre összekevert változat tárolás közben szétvált, és egyenetlen eredményt adott. A koncentrátumot ezért csak közvetlenül a kísérlet előtt adjuk a frissen elkészített, lehűlt keverékhez.

Mellékeltem egy kevés előkészítő anyagot és az eljárás leírását a gyantás hordozóhoz. A vadkakukkfű és a lándzsás útifű kivonatával együtt érdemes kipróbálni. Helyben kellene hozzá megfelelő gyantát találnod. Az eredményt hasonlítsd össze egy kezeletlen mintával is.

Vigyázz magadra!
Noah`;
// Existing saves already south of the barrier can leave; new entries are blocked.
export const closedSouthEntry=(x:number,y:number,from:{x:number;y:number})=>x<0&&y>1295&&!(from.x<0&&from.y>1295);
export const noahReplyArrived=(s:NoahTestState,day:number)=>day>=s.sentDay+3;
export function noahGoals(s:NoahTestState,day:number){
 const goals=[{id:'noah-wait',title:'Várd meg Noah válaszát',detail:'',done:noahReplyArrived(s,day)}];
 if(noahReplyArrived(s,day))goals.push({id:'noah-read',title:'Olvasd el Noah levelét',detail:'',done:s.letter});
 if(s.letter)goals.push({id:'noah-simon',title:'Kérdezd meg Simont a kötőanyagról',detail:'',done:s.simonAsked});
 if(s.simonAsked)goals.push({id:'noah-stick',title:'Erősíttesd meg a túrabotot',detail:'',done:s.upgraded});
 if(s.upgraded)goals.push({id:'noah-resin',title:'Szerezz vörösfenyő gyantát a kísérlethez',detail:'',done:s.ingredientGathered});
 if(s.ingredientGathered)goals.push({id:'noah-mix',title:'Készítsd el az első kísérleti kivonatot',detail:'',done:s.mixtureMade});
 if(s.mixtureMade)goals.push({id:'noah-observe',title:'Vizsgáld meg a kísérlet eredményét',detail:'',done:s.complete});
 return goals;
}
export function noahGoal(s:NoahTestState,day:number){return noahGoals(s,day).find(q=>!q.done)?.title??'';}
export function upgradeNoahStick(snapshot:Snapshot,state:NoahTestState,c:NoahTestConfig){
 if(!state.letter||!state.simonAsked||state.upgraded||snapshot.clearing.wood<c.wood||snapshot.travel.research.materials.scrap<c.scrap||snapshot.economy.gold<c.gold)return null;
 const next=structuredClone(snapshot);next.clearing.wood-=c.wood;next.travel.research.materials.scrap-=c.scrap;next.economy.gold-=c.gold;
 return {snapshot:next,state:{...state,upgraded:true}};
}
export function mixNoahExtract(snapshot:Snapshot,state:NoahTestState,c:NoahTestConfig){
 if(!state.letter||state.complete||state.concentrate<c.concentrate||snapshot.travel.estate.produce.thyme<c.thyme||snapshot.travel.estate.produce.plantain<c.plantain||state.ingredient<c.ingredient)return null;
 const next=structuredClone(snapshot);next.travel.estate.produce.thyme-=c.thyme;next.travel.estate.produce.plantain-=c.plantain;
 return {snapshot:next,state:{...state,concentrate:state.concentrate-c.concentrate,ingredient:state.ingredient-c.ingredient}};
}

export function createNoahChapter(sentDay:number):NoahTestState{return {sentDay,herbsPicked:{},mixtureMade:false,endSeen:false,letter:false,simonAsked:false,upgraded:false,complete:false,concentrate:0,ingredient:0,rootDefeated:false,ingredientGathered:false,extraction:createExtraction(),pendingResult:false,carrying:null};}
