import {marketStand} from './market-site';
import type {Snapshot} from './storage';
import {activeDebris} from './cleanup';
import {farmBuildingArtwork,birdhouseBox,chestArtwork,machineArtwork,treeArtwork} from './birdhouse-placement';
import {movedAnimalBox,inAnimalPolygon,type AnimalBox} from './livestock-geometry';
import type {AnimalFixture,AnimalPoint} from './livestock';
import {pathFootprint} from './garden-path-footprint';
import {pondWaterAt} from './pond-shape';
/** Placement consumes no weeds and awards no resources; only covered weeds disappear. */
export function clearWeedsUnderPlacedObjects(s:Snapshot){
 const boxes:AnimalBox[]=[...farmBuildingArtwork,{x:marketStand.left,y:marketStand.top,w:marketStand.right-marketStand.left,h:marketStand.bottom-marketStand.top},...s.travel.estate.trees.map(treeArtwork),...(s.travel.crafting?.machines??[]).map(machineArtwork),...(s.skill.chests?.placed??[]).map(chestArtwork),...s.travel.estate.pond.map(p=>({x:p.x-18,y:p.y-22,w:36,h:30})),...s.plots.map(([key])=>{const [x,y]=key.split(',').map(Number);return{x,y,w:16,h:16}})];
 if(s.story.birdhouse)boxes.push(birdhouseBox(s.story.birdhouse));
 const paths:AnimalPoint[][]=[],fences:[AnimalPoint,AnimalPoint][]=[];
 for(const bed of s.travel.homestead?.garden.beds??[]){boxes.push({...bed.area});if(bed.marker)boxes.push({x:bed.marker.x-32,y:bed.marker.y-30,w:64,h:36});if(bed.irrigation)boxes.push({x:bed.irrigation.x-11,y:bed.irrigation.y-21,w:22,h:27});}
 for(const path of s.travel.homestead?.garden.paths??[])paths.push(pathFootprint(path));
 for(const pen of s.travel.livestock?.pens??[]){if(pen.boundary.length)paths.push(pen.boundary);boxes.push(movedAnimalBox('coop',pen.coop));for(const [kind,p]of Object.entries(pen.fixtures))boxes.push(movedAnimalBox(kind as AnimalFixture,p!,pen.rotations?.[kind as AnimalFixture]));for(let i=0;i<pen.boundary.length;i++)if(i!==pen.coopWall)fences.push([pen.boundary[i],pen.boundary[(i+1)%pen.boundary.length]]);}
 const nearLine=(p:AnimalPoint,a:AnimalPoint,b:AnimalPoint)=>{const dx=b.x-a.x,dy=b.y-a.y,t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/(dx*dx+dy*dy||1)));return Math.hypot(p.x-a.x-t*dx,p.y-a.y-t*dy)<8;};
 let changed=false;for(const p of activeDebris(s.clearing,{seeds:s.seeds,produce:s.produce,plots:new Map(s.plots)})){if(boxes.some(b=>p.x>=b.x-6&&p.x<=b.x+b.w+6&&p.y>=b.y-6&&p.y<=b.y+b.h+6)||fences.some(([a,b])=>nearLine(p,a,b))||paths.some(poly=>inAnimalPolygon(p,poly)||poly.some((a,i)=>nearLine(p,a,poly[(i+1)%poly.length])))||pondWaterAt(p.x,p.y,s.travel.estate.pondExpansion)){s.clearing.removed[p.id]=s.clock.day;changed=true;}}
 return changed;
}
