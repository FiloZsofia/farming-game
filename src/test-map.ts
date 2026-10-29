import {farmBounds,farmLayout} from './layout';
import {villageLayout,villagePaths,shopAt} from './village-layout';
import {inWorkshop} from './research';
import {inHome} from './home';
import {southPath} from './south-forest-layout';
export const mapNames={north:'Öregfák ligete',south:'Déli erdő',marsh:'Mocsár'};
export function mapWorldPosition(p:{x:number;y:number}){
 if(p.x>=0){if(inWorkshop(p.y))return {x:632,y:120};if(inHome(p.y))return {...farmLayout.houseDoor};const shop=shopAt(p.y);if(shop)return {...villageLayout[shop].door};}return {x:p.x,y:p.y};
}
export const mapPoint=(p:{x:number;y:number})=>({x:52+(p.x+1120)*.34,y:45+(p.y+360)*.24});
export function createTestMap(player:{x:number;y:number},unlocked:boolean,farmName:string){
 const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 900 900');svg.classList.add('test-world-map');svg.setAttribute('role','img');svg.setAttribute('aria-label','A farm, a falu és az erdők térképe, Sam helyével');
 const element=(tag:string,attrs:Record<string,string|number>)=>{const e=document.createElementNS(ns,tag);for(const[k,v]of Object.entries(attrs))e.setAttribute(k,String(v));svg.append(e);return e;};
 element('rect',{x:0,y:0,width:900,height:900,rx:8,fill:'#d6cb9f'});element('rect',{x:12,y:12,width:876,height:876,rx:5,fill:'none',stroke:'#9b895c','stroke-width':2});
 element('path',{d:'M55 303 Q138 280 230 300 T436 300 L440 455 Q396 492 306 484 L240 863 Q142 881 58 832 Z',fill:'#82905e',stroke:'#6a7d50','stroke-width':3});
 const f=mapPoint({x:farmBounds.left,y:farmBounds.top});element('rect',{x:f.x,y:f.y,width:544,height:230,rx:18,fill:'#b4b97c',stroke:'#9c9d63','stroke-width':2});
 element('path',{d:'M435 290 Q608 273 785 309 L808 469 Q735 524 570 510 L439 459 Z',fill:'#b9b486',stroke:'#9d9b70','stroke-width':2});
 for(let i=0;i<90;i++){const x=75+(i*73%325),y=320+(i*59%510);if(y>473&&!unlocked)continue;element('path',{d:`M${x} ${y-8}l-7 13h14z`,fill:i%2?'#596d42':'#6c8150',opacity:.58});}
 const path=(points:readonly(readonly number[])[],width:number)=>{const d=points.map(([x,y],i)=>{const p=mapPoint({x,y});return`${i?'L':'M'}${p.x},${p.y}`;}).join(' ');element('path',{d,fill:'none',stroke:'#9a8960','stroke-width':width+2,'stroke-linecap':'round','stroke-linejoin':'round'});element('path',{d,fill:'none',stroke:'#e9dcad','stroke-width':width,'stroke-linecap':'round','stroke-linejoin':'round'});};
 for(const p of [...farmLayout.paths,...villagePaths])path(p.points,Math.max(3,p.width*.17));path([[-440,995],[-444,1231]],4);
 if(unlocked)path(southPath.map(p=>[p.x,p.y]),5);
 const label=(name:string,x:number,y:number,size=19)=>{const e=element('text',{x,y,fill:'#344631','font-size':size,'text-anchor':'middle','font-family':'Trebuchet MS, sans-serif','paint-order':'stroke',stroke:'#e0d4a9','stroke-width':3,'stroke-linejoin':'round'});e.textContent=name;};
 const building=(x:number,y:number,name:string)=>{const p=mapPoint({x,y});element('rect',{x:p.x-10,y:p.y-6,width:20,height:15,rx:2,fill:'#e4d6ad',stroke:'#6b6243'});element('path',{d:`M${p.x-13} ${p.y-5}L${p.x} ${p.y-16}L${p.x+13} ${p.y-5}Z`,fill:'#95674b',stroke:'#6b5039'});label(name,p.x,p.y+29,15);};
 building(239,100,'Otthon');building(632,105,'Műhely');const pond=mapPoint(farmLayout.pond);element('ellipse',{cx:pond.x,cy:pond.y,rx:49,ry:24,fill:'#819e91',stroke:'#657f6e','stroke-width':2});
 const square=mapPoint(villageLayout.square);element('ellipse',{cx:square.x,cy:square.y,rx:62,ry:29,fill:'#ded1aa',stroke:'#b09c74','stroke-width':3});
 building(590,885,'Faiskola');building(735,1010,'Kertitó Szaküzlet');building(660,1250,'Műhelybolt');
 label(farmName.length>27?farmName.slice(0,26)+'…':farmName,570,84,22);label('Falu',550,330,23);label(mapNames.north,240,331,21);
 const brook=mapPoint({x:-444,y:1231});element('path',{d:`M75 ${brook.y+5}Q190 ${brook.y-7} ${brook.x} ${brook.y}T426 ${brook.y-8}`,stroke:'#7c9b8f','stroke-width':8,fill:'none'});element('rect',{x:brook.x-7,y:brook.y-12,width:14,height:23,fill:'#a28b59',stroke:'#66553d'});
 if(unlocked){label(mapNames.south,245,518,23);const m=mapPoint({x:-480,y:2160});element('ellipse',{cx:m.x,cy:m.y,rx:58,ry:33,fill:'#6f8269',stroke:'#566e57','stroke-width':2});label(mapNames.marsh,m.x,m.y-44,19);for(const [x,y]of [[-444,2050],[-480,2110],[-520,2170],[-475,2230],[-440,2280]]){const p=mapPoint({x,y});element('ellipse',{cx:p.x,cy:p.y,rx:5,ry:3,fill:'#c0c0a0'});}}
 else{element('path',{d:'M57 480L436 480L420 860H57Z',fill:'#c7be99',opacity:.95});label('Lezárt terület',240,605,20);}
 const p=mapPoint(mapWorldPosition(player));element('circle',{cx:p.x,cy:p.y,r:11,fill:'#fff4c9',stroke:'#4f6942','stroke-width':2});element('circle',{cx:p.x,cy:p.y,r:5,fill:'#b45c3c'}).classList.add('map-player');label('Sam',p.x,p.y-18,16);
 element('path',{d:'M813 688V632l-9 19m9-19 9 19',fill:'none',stroke:'#61704b','stroke-width':3});label('É',813,619,18);label('• Sam helye',684,745,16);label('M / Esc · Vissza',684,779,16);
 return svg;
}
