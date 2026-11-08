import {farmBounds,farmLayout} from './layout';
import {junkSites,junkPoint} from './junk-sites';
import type {Snapshot} from './storage';
type Point={x:number;y:number};
export type VisualBox={x:number;y:number;w:number;h:number};
type World=Pick<Snapshot,'travel'|'skill'|'clearing'>;
export const birdhouseBox=(p:Point):VisualBox=>({x:p.x-13,y:p.y-45,w:26,h:48});
export const birdhouseOverlaps=(p:Point,box:VisualBox)=>{const a=birdhouseBox(p),pad=3;return a.x<box.x+box.w+pad&&a.x+a.w>box.x-pad&&a.y<box.y+box.h+pad&&a.y+a.h>box.y-pad;};
// Includes the roofs and porch, not just the building's ground collision rectangle.
export const farmBuildingArtwork:VisualBox[]=[{x:72,y:-14,w:338,h:249},{x:528,y:14,w:221,h:181}];
export const treeArtwork=(p:Point):VisualBox=>({x:p.x-38,y:p.y-84,w:76,h:91});
export const machineArtwork=(p:Point):VisualBox=>({x:p.x-25,y:p.y-69,w:50,h:78});
export const chestArtwork=(p:Point):VisualBox=>({x:p.x-20,y:p.y-28,w:40,h:36});
export function birdhouseVisible(p:Point,s:World){
 // The farm's permanent border crowns and south fence must not cover the sprite.
 if(p.x<farmBounds.left+100||p.x>farmBounds.right-100||p.y<farmBounds.top+110||p.y>550)return false;
 const f=farmLayout;
 // In front of a building, the birdhouse is drawn over its wall. Behind it,
 // overlapping roof artwork would hide it and remains an invalid placement.
 const fronts=[f.houseBounds.y+f.houseBounds.h,f.shedBounds.y+f.shedBounds.h];
 if(farmBuildingArtwork.some((box,i)=>birdhouseOverlaps(p,box)&&p.y-4<fronts[i]))return false;
 const foot={x:p.x-7,y:p.y-4,w:14,h:8};
 const entrances=[f.porchBounds,f.porchSteps,{x:215,y:177,w:48,h:88},{x:610,y:173,w:44,h:65}];
 if(entrances.some(b=>foot.x<b.x+b.w+2&&foot.x+foot.w>b.x-2&&foot.y<b.y+b.h+2&&foot.y+foot.h>b.y-2))return false;
 const boxes:VisualBox[]=[{x:f.journal.x-5,y:f.journal.y-3,w:31,h:25},{x:f.catalog.x-5,y:f.catalog.y-6,w:31,h:27},{x:f.mailbox.x,y:f.mailbox.y,w:f.mailbox.w,h:f.mailbox.h+20}];
 boxes.push(...s.travel.estate.trees.map(treeArtwork),...(s.travel.crafting?.machines??[]).map(machineArtwork),...(s.skill.chests?.placed??[]).map(chestArtwork));
 for(const site of junkSites){const q=junkPoint(s.clearing,site.id);boxes.push({x:q.x-103,y:q.y-88,w:206,h:126});}
 for(const q of s.travel.estate.pond)boxes.push({x:q.x-32,y:q.y-(q.kind==='reed'?65:28),w:64,h:q.kind==='reed'?70:44});
 return !boxes.some(box=>birdhouseOverlaps(p,box));
}
