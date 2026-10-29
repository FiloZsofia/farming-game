import {farmBounds,farmLayout} from './layout';
import {villageLayout,villagePaths,shopAt} from './village-layout';
import {inWorkshop} from './research';
import {inHome} from './home';
import {southPath,swampStones} from './south-forest-layout';
export const mapNames={north:'Öregfák ligete',south:'Déli erdő',marsh:'Mocsár'};
export function mapWorldPosition(p:{x:number;y:number}){
 if(p.x>=0){if(inWorkshop(p.y))return {x:632,y:120};if(inHome(p.y))return {...farmLayout.houseDoor};const shop=shopAt(p.y);if(shop)return {...villageLayout[shop].door};}return {x:p.x,y:p.y};
}
export const mapPoint=(p:{x:number;y:number})=>({x:52+(p.x+1120)*.34,y:45+(p.y+360)*.24});
export function createTestMap(player:{x:number;y:number},unlocked:boolean,farmName:string){
 const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 900 900');svg.classList.add('test-world-map');svg.setAttribute('role','img');svg.setAttribute('aria-label','A farm, a falu és az erdők térképe, Sam helyével');
 const element=(tag:string,attrs:Record<string,string|number>,parent:Element=svg)=>{const e=document.createElementNS(ns,tag);for(const[k,v]of Object.entries(attrs))e.setAttribute(k,String(v));parent.append(e);return e;};
 const defs=element('defs',{}),paper=element('pattern',{id:'map-paper',width:17,height:19,patternUnits:'userSpaceOnUse'},defs);
 element('rect',{width:17,height:19,fill:'#e4d7ad'},paper);element('path',{d:'M2 4h2m7 9h1m-6 4h2',stroke:'#ad9461','stroke-width':.6,opacity:.25},paper);
 element('rect',{x:0,y:0,width:900,height:900,rx:10,fill:'url(#map-paper)'});
 for(const inset of [12,19])element('rect',{x:inset,y:inset,width:900-inset*2,height:900-inset*2,rx:4,fill:'none',stroke:'#8b744e','stroke-width':inset===12?2:1});
 const tree=(x:number,y:number,scale=1)=>{const g=element('g',{transform:`translate(${x} ${y}) scale(${scale})`});element('ellipse',{cx:2,cy:6,rx:11,ry:4,fill:'#776e48',opacity:.2},g);element('path',{d:'M0 5v-17m0 13-6-8m6 5 5-9',fill:'none',stroke:'#715b3c','stroke-width':2},g);for(const [xx,yy,r,c]of [[-6,-11,8,'#657a49'],[6,-14,9,'#78884f'],[-1,-21,8,'#8c985a'],[0,-10,9,'#6a804b']])element('circle',{cx:xx,cy:yy,r,fill:c,stroke:'#526540','stroke-width':.6},g);element('path',{d:'M-8-13l4-2m3-9 4-1m1 12 4-2',stroke:'#b3b673','stroke-width':1.4},g);};
 // Region silhouettes summarize existing terrain; decorative symbols add no new locations.
 element('path',{d:'M55 303Q138 280 230 300T436 300L440 455Q396 492 306 484L240 863Q142 881 58 832Z',fill:'#9da575',stroke:'#849262','stroke-width':2});
 const f=mapPoint({x:farmBounds.left,y:farmBounds.top});element('rect',{x:f.x,y:f.y,width:544,height:230,rx:25,fill:'#c2c38a',stroke:'#aaa777','stroke-width':2});
 element('path',{d:'M435 290Q608 273 785 309L808 469Q735 524 570 510L439 459Z',fill:'#c6bd8c',stroke:'#b0a779','stroke-width':2});
 let seed=7531;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 const mappedRoutes=[...farmLayout.paths,...villagePaths].map(r=>r.points.map(([x,y])=>mapPoint({x,y})));mappedRoutes.push([mapPoint({x:-440,y:995}),mapPoint({x:-444,y:1231})]);if(unlocked)mappedRoutes.push(southPath.map(mapPoint));
 const onTrail=(x:number,y:number)=>mappedRoutes.some(points=>points.slice(1).some((b,i)=>{const a=points[i],dx=b.x-a.x,dy=b.y-a.y,t=Math.max(0,Math.min(1,((x-a.x)*dx+(y-a.y)*dy)/(dx*dx+dy*dy||1)));return Math.hypot(x-a.x-t*dx,y-a.y-t*dy)<12;}));
 for(let i=0;i<650;i++){const south=i>=270,x=62+random()*(south?238:365),y=south?485+random()*342:328+random()*140;if(south&&!unlocked||south&&x>250-(y-620)*.2||south&&Math.hypot((x-270)/70,(y-650)/43)<1||onTrail(x,y))continue;tree(x,y,.64+random()*.45);}
 for(let i=0;i<150;i++){const x=f.x+17+random()*505,y=f.y+28+random()*180;element('path',{d:`M${x} ${y}l2-3m-2 3-2-2`,stroke:'#9ba770','stroke-width':.7,opacity:.45});}

 const paths=[...farmLayout.paths,...villagePaths].map(p=>({points:p.points.map(([x,y])=>({x,y})),width:Math.max(3,p.width*.17)}));paths.push({points:[{x:-440,y:995},{x:-444,y:1231}],width:4});if(unlocked)paths.push({points:southPath,width:5});
 // Shared network passes prevent inner outlines at intersections.
 for(const outer of [true,false])for(const route of paths){const d=route.points.map((p,i)=>{const m=mapPoint(p);return`${i?'L':'M'}${m.x},${m.y}`;}).join(' ');element('path',{d,fill:'none',stroke:outer?'#a08b60':'#efdfb4','stroke-width':route.width+(outer?2:0),'stroke-linecap':'round','stroke-linejoin':'round'});}
 const label=(name:string,x:number,y:number,size=24,boxed=false)=>{const g=element('g',{});if(boxed)element('rect',{x:x-name.length*size*.27-11,y:y-size-2,width:name.length*size*.54+22,height:size+13,rx:4,fill:'#eadbb4',stroke:'#9a8056','stroke-width':1.2},g);const e=element('text',{x,y,fill:'#394b36','font-size':size,'font-weight':600,'text-anchor':'middle','font-family':'Georgia, serif','paint-order':'stroke',stroke:'#e7dbb7','stroke-width':2.2,'stroke-linejoin':'round'},g);e.textContent=name;};
 const building=(x:number,y:number,name:string,lx:number,ly:number)=>{const p=mapPoint({x,y});element('rect',{x:p.x-14,y:p.y-7,width:28,height:22,fill:'#d5c59a',stroke:'#776246','stroke-width':1.2});element('path',{d:`M${p.x-18} ${p.y-7}L${p.x} ${p.y-22}L${p.x+18} ${p.y-7}Z`,fill:'#a47450',stroke:'#75513c','stroke-width':1.2});for(let i=0;i<3;i++)element('path',{d:`M${p.x-11+i*8} ${p.y-7}l6-10`,stroke:'#c59463','stroke-width':1});element('rect',{x:p.x-3,y:p.y+3,width:6,height:12,fill:'#725f44'});for(const dx of [-9,7])element('rect',{x:p.x+dx,y:p.y-1,width:5,height:6,fill:'#81978a',stroke:'#e8d7ae','stroke-width':1});element('path',{d:`M${p.x} ${p.y+18}L${lx} ${ly-19}`,fill:'none',stroke:'#a18c61','stroke-width':1});label(name,lx,ly,21);};
 building(239,100,'Otthon',490,203);building(632,105,'Műhely',668,203);
 for(const bed of farmLayout.beds){const p=mapPoint(bed);element('rect',{x:p.x,y:p.y,width:bed.w*.34,height:bed.h*.24,fill:'#958359',stroke:'#6f6b44'});for(let i=0;i<3;i++)element('path',{d:`M${p.x+4+i*8} ${p.y+3}v7`,stroke:'#697c47','stroke-width':2});}
 const pond=mapPoint(farmLayout.pond);element('path',{d:`M${pond.x-42} ${pond.y-10}q10-20 40-16t48 23q-6 23-43 18t-45-25Z`,fill:'#8da69a',stroke:'#6e8c7b','stroke-width':2});for(let i=0;i<4;i++)element('path',{d:`M${pond.x-25+i*15} ${pond.y+i%2*9}h9`,stroke:'#d1d9bd','stroke-width':1});
 const square=mapPoint(villageLayout.square);element('ellipse',{cx:square.x,cy:square.y,rx:62,ry:29,fill:'#decea3',stroke:'#b09c74','stroke-width':3});
 building(villageLayout.nursery.x+villageLayout.nursery.w/2,villageLayout.nursery.y+35,'Faiskola',660,361);building(villageLayout.fishShop.x+villageLayout.fishShop.w/2,villageLayout.fishShop.y+40,'Kertitó Szaküzlet',714,420);building(villageLayout.craftShop.x+villageLayout.craftShop.w/2,villageLayout.craftShop.y+40,'Műhelybolt',694,491);
 label(farmName.length>27?farmName.slice(0,26)+'…':farmName,570,82,27,true);label('Falu',522,344,29,true);label(mapNames.north,235,307,27,true);
 const brook=mapPoint({x:-444,y:1231});element('path',{d:`M75 ${brook.y+5}Q190 ${brook.y-7} ${brook.x} ${brook.y}T426 ${brook.y-8}`,stroke:'#8ba79b','stroke-width':9,fill:'none'});element('path',{d:`M75 ${brook.y+3}Q190 ${brook.y-9} ${brook.x} ${brook.y-2}T426 ${brook.y-10}`,stroke:'#c5d2b6','stroke-width':1.5,fill:'none'});element('rect',{x:brook.x-7,y:brook.y-12,width:14,height:23,fill:'#a28b59',stroke:'#66553d'});for(let i=0;i<5;i++)element('path',{d:`M${brook.x-7} ${brook.y-9+i*4}h14`,stroke:'#dbc08b','stroke-width':1});
 if(unlocked){label(mapNames.south,240,533,29,true);const m=mapPoint({x:-480,y:2160});element('ellipse',{cx:m.x,cy:m.y,rx:58,ry:33,fill:'#829477',stroke:'#607958','stroke-width':2});for(let i=0;i<17;i++){const x=m.x-47+i*19%95,y=m.y-18+i*11%35;element('path',{d:`M${x} ${y+4}v-8m0 6-3-5m3 4 3-6`,stroke:'#576b48','stroke-width':1});}for(const stone of swampStones){const p=mapPoint(stone);element('ellipse',{cx:p.x,cy:p.y,rx:5,ry:3,fill:'#d0c6a2',stroke:'#8b9277'});}label(mapNames.marsh,m.x-85,m.y-17,25,true);}
 else{element('path',{d:'M57 480L436 480L420 860H57Z',fill:'#d1c7a2',opacity:.96});label('Lezárt terület',240,605,26,true);}
 const p=mapPoint(mapWorldPosition(player));element('circle',{cx:p.x,cy:p.y,r:12,fill:'#fff4c9',stroke:'#876739','stroke-width':2});element('circle',{cx:p.x,cy:p.y,r:6,fill:'#bf7945'}).classList.add('map-player');label('Sam',p.x,p.y-20,23);
 // A small compass and plant-like ink flourishes echo Sam’s field notebook.
 for(const [x,y,sx,sy]of [[33,33,1,1],[867,33,-1,1],[33,867,1,-1],[867,867,-1,-1]]){const g=element('g',{transform:`translate(${x} ${y}) scale(${sx} ${sy})`});element('path',{d:'M0 65Q4 22 65 0M7 45Q-3 28 3 16Q18 26 14 35M26 16Q24 2 39 1Q42 13 33 14',fill:'none',stroke:'#6c7c4e','stroke-width':1.5},g);}
 element('circle',{cx:770,cy:710,r:40,fill:'none',stroke:'#9a8357'});element('path',{d:'M770 671l8 39-8 39-8-39ZM731 710l39-8 39 8-39 8Z',fill:'#b09b69',stroke:'#6e7550','stroke-width':1});element('path',{d:'M770 671v39h39',fill:'none',stroke:'#46583b','stroke-width':2});label('É',770,658,22);
 return svg;
}
