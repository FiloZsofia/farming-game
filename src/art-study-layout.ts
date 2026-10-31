import {farmLayout as layout} from './layout';
export type StudyPlant={x:number;y:number;size:number;kind:'shrub'|'hazel'|'fern'|'spike'|'sedge'|'rock'};
// Preserve every original route, veranda fixture, growing bed and the pond approach.
export function studyPlantClear(x:number,y:number,radius:number){
 const boxes=[layout.houseBounds,layout.shedBounds,layout.porchBounds,layout.porchSteps,layout.shipping,layout.catalog,layout.journal,layout.mailbox,layout.dock,...layout.beds];
 if(boxes.some(b=>x+radius>b.x-12&&x-radius<b.x+b.w+12&&y+radius>b.y-16&&y-radius<b.y+b.h+16))return false;
 if(Math.hypot((x-layout.pond.x)/(layout.pond.rx+radius+18),(y-layout.pond.y)/(layout.pond.ry+radius+18))<1)return false;
 return !layout.paths.some(p=>p.points.slice(1).some((b,i)=>{const a=p.points[i],dx=b[0]-a[0],dy=b[1]-a[1],t=Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/(dx*dx+dy*dy)));return Math.hypot(x-a[0]-dx*t,y-a[1]-dy*t)<p.width/2+radius+14;}));
}
// Curated groups rather than an even scatter of interchangeable bushes.
const islands=[{x:20,y:260},{x:-35,y:390},{x:15,y:510},{x:440,y:110},{x:800,y:155},{x:835,y:315},{x:790,y:570},{x:560,y:95},{x:565,y:295}];
export const studyPlants:StudyPlant[]=[];
let seed=835;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
for(let i=0;i<430;i++){
 const island=islands[i%islands.length],x=Math.round(island.x+(random()-.5)*130),y=Math.round(island.y+(random()-.5)*105),size=10+Math.floor(random()*13);
 const kind:StudyPlant['kind']=i%29===0?'spike':i%13===0?'rock':i%5===0?'sedge':i%3===0?'fern':i%2?'hazel':'shrub';
 if(!studyPlantClear(x,y,size)||studyPlants.some(p=>Math.hypot(p.x-x,p.y-y)<(p.size+size)*.72))continue;
 studyPlants.push({x,y,size,kind});
}

export const studyTrees=[{x:32,y:155,size:1.1},{x:-65,y:305,size:1.2},{x:458,y:150,size:.95},{x:795,y:230,size:1.15},{x:-32,y:500,size:1.2},{x:850,y:440,size:1.1}];
export const studyTrunkBlocked=(x:number,y:number)=>studyTrees.some(t=>Math.hypot(x-t.x,y-t.y)<11*t.size);
