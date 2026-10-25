import {junkAt} from './junk-sites';
import {TILE} from './gardening';
import {farmLayout,farmBounds} from './layout';
import {blocked} from './movement';
import {HOME_ORIGIN,inHome,homeBlocked,homeObjects} from './home';
import {debrisAt,type Clearing} from './cleanup';
import {salvageSites} from './research';
import type {Garden} from './gardening';
import type {GardenSkill} from './gardening-skill';
import type {FarmStory} from './story-events';
import type {Travel} from './travel';
type Point={x:number;y:number};
export function canPlaceChestAt(p:Point,s:{player:Point;garden:Garden;clearing:Clearing;skill:GardenSkill;story:FarmStory;travel:Travel}){
 if(junkAt(s.clearing,p.x,p.y))return false;
 const {player,garden,clearing,skill,story,travel}=s,distance=Math.hypot(p.x-player.x,p.y-player.y);
 if(!skill.chests?.packed||distance>80||distance<28||skill.chests.placed.some(c=>Math.hypot(c.x-p.x,c.y-p.y)<38))return false;
 if(inHome(p.y))return p.y>=HOME_ORIGIN+230&&Math.hypot(p.x-400,p.y-HOME_ORIGIN-500)>35&&homeObjects.every(o=>Math.hypot(o.x-p.x,o.y-p.y)>27)&&[[-17,-10],[17,-10],[-17,9],[17,9]].every(([dx,dy])=>!homeBlocked(p.x+dx,p.y+dy));
 if(p.x<farmBounds.left+24||p.x>farmBounds.right-24||p.y<farmBounds.top+48||p.y>550||blocked(p.x,p.y)||debrisAt(clearing,garden,p.x,p.y))return false;
 const footprint={x:p.x-17,y:p.y-12,w:34,h:21};
 const overlaps=(b:{x:number;y:number;w:number;h:number},pad=3)=>footprint.x<b.x+b.w+pad&&footprint.x+footprint.w>b.x-pad&&footprint.y<b.y+b.h+pad&&footprint.y+footprint.h>b.y-pad;
 // Reserve actual footprints and entrance lanes, rather than broad distance circles or entire paths.
 if([farmLayout.houseBounds,farmLayout.shedBounds,farmLayout.journal,farmLayout.catalog,farmLayout.mailbox,farmLayout.shipping,{x:170,y:174,w:12,h:44},{x:300,y:174,w:12,h:44},{x:215,y:177,w:48,h:68},{x:610,y:173,w:44,h:57}].some(b=>overlaps(b)))return false;
 if([...garden.plots.keys()].some(k=>{const[x,y]=k.split(',').map(Number);return overlaps({x,y,w:TILE,h:TILE},1);}))return false;
 if(travel.estate.trees.some(t=>Math.hypot(t.x-p.x,t.y-p.y)<27)||travel.estate.pond.some(t=>Math.hypot(t.x-p.x,t.y-p.y)<25)||salvageSites.some(t=>Math.hypot(t.x-p.x,t.y-p.y)<27)||story.birdhouse&&Math.hypot(story.birdhouse.x-p.x,story.birdhouse.y-p.y)<25)return false;
 return [[-17,-10],[17,-10],[-17,9],[17,9]].every(([dx,dy])=>!blocked(p.x+dx,p.y+dy));
}
