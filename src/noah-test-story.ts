import type {Snapshot} from './storage';
import {prepareMicroscopeTest} from './microscope-test-setup';

export type NoahTestConfig={thyme:number;plantain:number;concentrate:number;shipment:number;ingredient:number;ingredientName:string;wood:number;scrap:number;gold:number};
export const noahTestConfig:NoahTestConfig={thyme:2,plantain:2,concentrate:1,shipment:4,ingredient:1,ingredientName:'Vörösfenyőgyanta',wood:25,scrap:14,gold:310};
export type NoahCheckpoint='waiting'|'letter'|'simon'|'forest'|'marsh'|'root'|'mix';
export type NoahTestState={herbsPicked:Record<string,number>;sentDay:number;mixtureMade:boolean;endSeen:boolean;letter:boolean;simonAsked:boolean;upgraded:boolean;complete:boolean;concentrate:number;ingredient:number;rootDefeated:boolean;ingredientGathered:boolean};
export const noahLetter=`Sam!

A város környéki méhészetek közül többnél gombás fertőzést találtak a fiasításban. Nagy rajtunk a nyomás, hogy a hatóanyagot minél előbb biztosra fejlesszük, mert már egész méhcsaládok pusztultak ki, és a továbbterjedés felszámolásában néhányan a megmaradt családok elpusztítását gondolják helyesnek, ez azonban még nagyobb kárt okozna a természet egyensúlyában.

Küldök négy adag kísérleti koncentrátumot. Nyugodtan végezz vele te is próbákat, de egyelőre csak a félretett mintán: a természetben még ne használd.

Önmagában még nem ad tartós eredményt. A kezelt felületen nem marad meg megfelelően, ezért kötőanyagot is tartalmazó hordozókeverékre van szükségünk. Az előre összekevert változat tárolás közben szétvált, és egyenetlen eredményt adott. A koncentrátumot ezért csak közvetlenül a kísérlet előtt adjuk a frissen elkészített, lehűlt keverékhez.

Mellékeltem egy kevés előkészítő anyagot és az eljárás leírását a gyantás hordozóhoz. A vadkakukkfű és a lándzsás útifű kivonatával együtt érdemes kipróbálni. Helyben kellene hozzá megfelelő gyantát találnod. Az eredményt hasonlítsd össze egy kezeletlen mintával is.

Vigyázz magadra!
Noah`;
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
 const state:NoahTestState={herbsPicked:{},sentDay:snapshot.clock.day-(checkpoint==='waiting'?0:3),mixtureMade:false,endSeen:false,letter:checkpoint!=='letter'&&checkpoint!=='waiting',simonAsked:checkpoint==='forest'||checkpoint==='marsh'||checkpoint==='root'||checkpoint==='mix',upgraded:checkpoint==='forest'||checkpoint==='marsh'||checkpoint==='root'||checkpoint==='mix',complete:false,concentrate:checkpoint==='letter'||checkpoint==='waiting'?0:config.shipment,ingredient:checkpoint==='mix'?config.ingredient:0,rootDefeated:checkpoint==='mix',ingredientGathered:checkpoint==='mix'};
 if(checkpoint==='simon')snapshot.player={x:320,y:4635};
 if(checkpoint==='mix')snapshot.player={x:337,y:3415};
 if(checkpoint==='forest')snapshot.player={x:-444,y:1140};
 if(checkpoint==='marsh')snapshot.player={x:-430,y:2000};
 if(checkpoint==='root'){snapshot.player={x:-665,y:2450};snapshot.clock.elapsed=390;}
 return {snapshot,state};
}
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
