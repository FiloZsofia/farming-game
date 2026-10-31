import {farmLayout as layout} from './layout';
export type StudyPlant={x:number;y:number;size:number;kind:'shrub'|'fern'|'spike'};
// Preserve every original route, veranda fixture, growing bed and the pond approach.
export function studyPlantClear(x:number,y:number,radius:number){
 const boxes=[layout.houseBounds,layout.shedBounds,layout.porchBounds,layout.porchSteps,layout.shipping,layout.catalog,layout.journal,layout.mailbox,layout.dock,...layout.beds];
 if(boxes.some(b=>x+radius>b.x-12&&x-radius<b.x+b.w+12&&y+radius>b.y-16&&y-radius<b.y+b.h+16))return false;
 if(Math.hypot((x-layout.pond.x)/(layout.pond.rx+radius+18),(y-layout.pond.y)/(layout.pond.ry+radius+18))<1)return false;
 return !layout.paths.some(p=>p.points.slice(1).some((b,i)=>{const a=p.points[i],dx=b[0]-a[0],dy=b[1]-a[1],t=Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/(dx*dx+dy*dy)));return Math.hypot(x-a[0]-dx*t,y-a[1]-dy*t)<p.width/2+radius+14;}));
}
export const studyPlants:StudyPlant[]=[];
let seed=835;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
for(let i=0;i<430;i++){
 const x=Math.round(-100+random()*970),y=Math.round(-35+random()*575),size=12+Math.floor(random()*12),kind=i%7===0?'spike':i%3===0?'fern':'shrub';
 // Plant in irregular border groups, leaving a broad, usable central lawn.
 if(x>115&&x<550&&y>235&&y<535)continue;
 if(!studyPlantClear(x,y,size)||studyPlants.some(p=>Math.hypot(p.x-x,p.y-y)<(p.size+size)*.8))continue;
 studyPlants.push({x,y,size,kind});
}

export const studyTrees=[{x:32,y:155,size:1.1},{x:-65,y:305,size:1.2},{x:458,y:150,size:.95},{x:795,y:230,size:1.15},{x:-32,y:500,size:1.2},{x:850,y:440,size:1.1}];
export const studyTrunkBlocked=(x:number,y:number)=>studyTrees.some(t=>Math.hypot(x-t.x,y-t.y)<11*t.size);
