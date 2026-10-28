import type {Snapshot} from './storage';
import {prepareMicroscopeTest} from './microscope-test-setup';

export type NoahTestConfig={thyme:number;plantain:number;concentrate:number;shipment:number;ingredient:number;ingredientName:string;wood:number;scrap:number;gold:number};
export const noahTestConfig:NoahTestConfig={thyme:2,plantain:2,concentrate:1,shipment:4,ingredient:1,ingredientName:'Vörösfenyőgyanta',wood:25,scrap:14,gold:310};
export type NoahCheckpoint='letter'|'simon'|'forest'|'mix';
export type NoahTestState={letter:boolean;simonAsked:boolean;upgraded:boolean;complete:boolean;concentrate:number;ingredient:number;rootDefeated:boolean;ingredientGathered:boolean};
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
 const state:NoahTestState={letter:checkpoint!=='letter',simonAsked:checkpoint==='forest'||checkpoint==='mix',upgraded:checkpoint==='forest'||checkpoint==='mix',complete:false,concentrate:checkpoint==='letter'?0:config.shipment,ingredient:checkpoint==='mix'?config.ingredient:0,rootDefeated:checkpoint==='mix',ingredientGathered:checkpoint==='mix'};
 if(checkpoint==='simon')snapshot.player={x:320,y:4635};
 if(checkpoint==='mix')snapshot.player={x:337,y:3415};
 if(checkpoint==='forest')snapshot.player={x:-444,y:1140};
 return {snapshot,state};
}
// Existing saves already south of the barrier can leave; new entries are blocked.
export const closedSouthEntry=(x:number,y:number,from:{x:number;y:number})=>x<0&&y>1295&&!(from.x<0&&from.y>1295);
export function noahGoal(s:NoahTestState){return !s.letter?'Olvasd el Noah levelét':!s.simonAsked?'Kérdezd meg Simont a kötőanyagról':s.complete?'Az első eredmények biztatóak':!s.ingredientGathered?'Szerezz gyantát a kísérlethez':'Készítsd el az első kísérleti kivonatot';}
export function upgradeNoahStick(snapshot:Snapshot,state:NoahTestState,c:NoahTestConfig){
 if(!state.letter||state.upgraded||snapshot.clearing.wood<c.wood||snapshot.travel.research.materials.scrap<c.scrap||snapshot.economy.gold<c.gold)return null;
 const next=structuredClone(snapshot);next.clearing.wood-=c.wood;next.travel.research.materials.scrap-=c.scrap;next.economy.gold-=c.gold;
 return {snapshot:next,state:{...state,upgraded:true}};
}
export function mixNoahExtract(snapshot:Snapshot,state:NoahTestState,c:NoahTestConfig){
 if(!state.letter||state.complete||state.concentrate<c.concentrate||snapshot.travel.estate.produce.thyme<c.thyme||snapshot.travel.estate.produce.plantain<c.plantain||state.ingredient<c.ingredient)return null;
 const next=structuredClone(snapshot);next.travel.estate.produce.thyme-=c.thyme;next.travel.estate.produce.plantain-=c.plantain;
 return {snapshot:next,state:{...state,concentrate:state.concentrate-c.concentrate,ingredient:state.ingredient-c.ingredient}};
}
