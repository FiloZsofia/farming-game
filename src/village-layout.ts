import {brookClearForTree} from './brook-layout';
import {nurseryTreeClear,nurserySolid,nurseryDoor} from './nursery-grounds';
import {boundsOffPaths} from './path-clearance';
import {quadraticPath} from './path-curves';
import {marketRoads,marketRoadContains,marketTreeManeuverClear} from './market-trial-route';
import {noticeBoardBlocked} from './village-notice';
import {natureSites,natureTreeClear} from './nature-resources';
import {FOREST_LEFT,forestBlocked,forestPlants} from './forest';
import {farmLayout} from './layout';
import {inHome,homeBlocked} from './home';
import {inWorkshop,WORKSHOP_ORIGIN} from './research';
import {blocked,type Box} from './movement';
export const WORLD_HEIGHT=1520;
export const WORLD_WIDTH=1000;
export const villageLayout={
 craftShop:{x:560,y:1220,w:200,h:112,door:{x:660,y:1341},entrance:{x:645,y:1290,w:34,h:57}},
 nursery:{x:510,y:840,w:165,h:106,door:nurseryDoor,entrance:{x:580,y:898,w:29,h:65}},
 fishShop:{x:665,y:960,w:230,h:128,door:{x:708,y:1100},entrance:{x:690,y:1030,w:35,h:76}},
 square:{x:475,y:1080,rx:181,ry:115},
 nurserySaplings:[{x:518,y:946},{x:542,y:946},{x:627,y:942},{x:649,y:942}],
 benches:[{id:'west',angle:-1.88},{id:'east',angle:-.55}],
 bushes:[{id:'fern',x:105,y:895},{id:'birch',x:95,y:845},{id:'moss',x:70,y:980},{id:'brook',x:191,y:1090}],
 trees:[{x:44,y:670,kind:0},{x:103,y:650,kind:1},{x:254,y:685,kind:2},{x:53,y:799,kind:2},{x:169,y:777,kind:0},{x:286,y:769,kind:1},{x:51,y:889,kind:1},{x:278,y:934,kind:0},{x:146,y:1000,kind:2},{x:40,y:1059,kind:0},{x:311,y:1120,kind:1},{x:100,y:1165,kind:2},{x:250,y:1184,kind:0}],
} as const;
export const nurseryDisplays=[{left:501,width:54,plants:villageLayout.nurserySaplings.slice(0,2)},{left:611,width:44,plants:villageLayout.nurserySaplings.slice(2)}];
export const nurseryDisplayBounds=(d:typeof nurseryDisplays[number])=>({left:d.left,right:d.left+d.width+4,top:Math.min(...d.plants.map(p=>p.y))-53,bottom:Math.max(...d.plants.map(p=>p.y))+16});
// Drawing and canopy clearance use the same full routes.
export const villagePaths=[
 {width:32,points:[farmLayout.paths[0].points[0],[170,740]]},
 {width:20,points:[[170,930],[107,930]]},
 {width:28,points:[[474,1016],[586,978],[591,940]]},
 {width:25,points:[[606,1097],[660,1100],[708,1100]]},
 {width:23,points:[[493,1320],[493,1364],[660,1364],[660,1341]]},
 {width:20,points:[[107,930],[40,930],[-120,938],[-270,1000],[-450,995],[-570,962],[-660,978],[-780,984],[-940,1010]]},
 {width:32,points:[[170,740],[170,860],[170,930],...quadraticPath([170,930],[265,945],[350,1000]).slice(1),[476,1060],[493,1320],[493,WORLD_HEIGHT-6]]},
];
// The whole harvestable crown stays off paving, with a clear margin around its leaves.
export const forageBushBounds=(b:{x:number;y:number})=>({left:b.x-20,right:b.x+20,top:b.y-22,bottom:b.y+8});
export function forageBushOffPaths(b:{x:number;y:number}){
 return boundsOffPaths(forageBushBounds(b),[...villagePaths,...marketRoads]);
}
export function woodlandTreeCoversBush(x:number,y:number,scale=1){return villageLayout.bushes.some(b=>{const box=forageBushBounds(b);return x+42*scale>box.left-5&&x-42*scale<box.right+5&&y+7*scale>box.top-5&&y-105*scale<box.bottom+5;});}
// Match the crown silhouette, leaving room under/along its tapered edges.
export function woodlandTreeClear(x:number,y:number,scale=1,kind=0){
 if(!nurseryTreeClear(x,y,scale)||!brookClearForTree(x,y,scale))return false;
 if(villageLayout.benches.some(b=>{const p=benchPose(b.angle);return x+42*scale>p.x-40&&x-42*scale<p.x+40&&y+7*scale>p.y-43&&y-105*scale<p.y+12;}))return false;
 if([villageLayout.craftShop,villageLayout.nursery,villageLayout.fishShop].some(building=>x+42*scale>building.x-12&&x-42*scale<building.x+building.w+12&&y+12*scale>building.y-40&&y-110*scale<building.y+building.h+12))return false;
 const pot=villageEntrancePot;if(x+42*scale>pot.x-16&&x-42*scale<pot.x+17&&y+7*scale>pot.y-28&&y-105*scale<pot.y+14)return false;
 if(!natureTreeClear(x,y,scale)||woodlandTreeCoversBush(x,y,scale)||!marketTreeManeuverClear(x,y,scale))return false;
 const crowns=kind===2?Array.from({length:4},(_,i)=>({x:0,y:-90+i*19+22,rx:15+i*8,ry:24})):[{x:-18,y:-48,rx:22.5,ry:19.5},{x:12,y:-56,rx:25.5,ry:23.5},{x:-3,y:-76,rx:24.5,ry:19.5},{x:0,y:-38,rx:28,ry:16}];
 return [...villagePaths,...marketRoads].every(path=>path.points.slice(1).every((b,i)=>{const a=path.points[i],steps=Math.max(1,Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/3)),margin=path.width/2+4;for(let j=0;j<=steps;j++){const xx=a[0]+(b[0]-a[0])*j/steps,yy=a[1]+(b[1]-a[1])*j/steps;if(Math.hypot(xx-Math.max(x-5*scale,Math.min(x+6*scale,xx)),yy-Math.max(y-44*scale,Math.min(y+7*scale,yy)))<margin)return false;if(crowns.some(c=>((xx-x-c.x*scale)/(c.rx*scale+margin))**2+((yy-y-c.y*scale)/(c.ry*scale+margin))**2<1))return false;}return true;}));
}
export const villageEntrancePot={x:225,y:1000};
export const villageLamps=[{id:'fork',x:460,y:942},{id:'square',x:450,y:1240}] as const;
export const workshopWallLamps=[{x:577,y:1297},{x:748,y:1297}] as const;
export const villageLampLights=[...villageLamps.map(p=>({x:p.x,y:p.y-38,scale:1})),...workshopWallLamps.map(p=>({...p,scale:.6}))];
export const villageWindows=[[528,873,28,29],[627,873,28,29],[753,1009,41,43],[825,1009,41,43],[578,1253,28,29],[712,1253,28,29]] as const;
export const lampBounds=(p:{x:number;y:number})=>({left:p.x-12,right:p.x+12,top:p.y-59,bottom:p.y+3});
export type WoodlandTree={x:number;y:number;kind:number;scale?:number};
// Preserve the actual trees affected by the new eastern road and the grass pull-off.
export const marketTreeOrigins:WoodlandTree[]=[{x:286,y:769,kind:1},{x:246,y:739,kind:1},{x:302,y:736,kind:2},{x:327,y:776,kind:0},{x:252,y:797,kind:2},{x:280,y:821,kind:1},{x:315,y:813,kind:2},{x:306,y:858,kind:0},{x:341,y:858,kind:1},{x:410,y:750,kind:0,scale:.9},{x:746,y:766,kind:1,scale:.9},{x:-398,y:679,kind:0},{x:-350,y:669,kind:1},{x:-302,y:674,kind:2}];
export const villageTrees:WoodlandTree[]=villageLayout.trees.filter(t=>!marketTreeOrigins.some(o=>o.x===t.x&&o.y===t.y)).filter(t=>woodlandTreeClear(t.x,t.y,1,t.kind));
// Reposition crowded trees beside the paths instead of removing the woodland.
const candidates=Array.from({length:72},(_,i)=>({x:28+i%8*37+(i%3)*6,y:675+Math.floor(i/8)*61,kind:i%3}));
export const forestTrees:WoodlandTree[]=[];
export const relocatedMarketTrees:{from:WoodlandTree;to:WoodlandTree}[]=[];
for(const origin of marketTreeOrigins){
 const offsets=[[0,0],...Array.from({length:28},(_,i)=>{const d=(i+1)*8;return [[0,-d],[0,d],[-d,0],[d,0],[-d,-d],[d,-d],[-d,d],[d,d]];}).flat()];
 const point=offsets.map(([dx,dy])=>({...origin,x:origin.x+dx,y:origin.y+dy})).find(t=>t.y>=610&&t.y<=1030&&(origin.x<0?t.x<0:t.x>=200)&&woodlandTreeClear(t.x,t.y,t.scale??1,t.kind)&&[...villageTrees,...forestTrees].every(p=>Math.hypot(p.x-t.x,p.y-t.y)>=34));
 if(!point)throw Error('A fa nem maradhat ki az új út miatt.');forestTrees.push(point);relocatedMarketTrees.push({from:origin,to:point});
}
for(const original of candidates){
 const offsets=[[0,0],...Array.from({length:16},(_,i)=>{const d=(i+1)*8;return [[-d,0],[d,0],[0,-d],[0,d],[-d,-d],[d,-d],[-d,d],[d,d]];}).flat()];
 for(const [dx,dy]of offsets){const t={...original,x:original.x+dx,y:original.y+dy};if(t.x<10||t.x>390||t.y<635||t.y>1235||!woodlandTreeClear(t.x,t.y,1,t.kind)||villageLayout.bushes.some(b=>Math.hypot(t.x-b.x,t.y-b.y)<38)||[...villageTrees,...forestTrees].some(b=>Math.hypot(t.x-b.x,t.y-b.y)<34))continue;
 // Keep the village sign and the square's furniture readable.
 if(t.x>175&&t.x<285&&t.y>620&&t.y<735||t.x>260&&t.y>1010)continue;
 forestTrees.push(t);break;}
}
// The western entrance grows denser toward the woodland, on both sides of its narrow trail.
for(let row=0;row<7;row++)for(let column=0;column<10;column++){
 const t={x:-365+column*47+(row%2)*16,y:835+row*55,kind:(row+column)%3};
 if(woodlandTreeClear(t.x,t.y,1,t.kind)&&natureSites.every(p=>Math.hypot(p.x-t.x,p.y-t.y)>35)&&forestPlants.every(p=>Math.hypot(p.x-t.x,p.y-t.y)>42)&&villageLayout.bushes.every(p=>Math.hypot(p.x-t.x,p.y-t.y)>38)&&[...villageTrees,...forestTrees].every(p=>Math.hypot(p.x-t.x,p.y-t.y)>34))forestTrees.push(t);
}
// Restore a dense woodland shoulder along both sides of the narrow delivery road.
export const marketRoadsideTrees:WoodlandTree[]=[];
for(let row=0;row<4;row++)for(let column=0;column<17;column++){
 const t={x:FOREST_LEFT+28+column*48+(row%2)*22,y:[626,674,899,941][row]+(column%3-1)*5,kind:(row+column)%3};
 if(t.x> -280||!woodlandTreeClear(t.x,t.y,1,t.kind)||natureSites.some(p=>Math.hypot(p.x-t.x,p.y-t.y)<38)||forestPlants.some(p=>Math.hypot(p.x-t.x,p.y-t.y)<42)||[...villageTrees,...forestTrees].some(p=>Math.hypot(p.x-t.x,p.y-t.y)<34))continue;
 forestTrees.push(t);marketRoadsideTrees.push(t);
}
// Continue the woodland on both sides of Mara's eastern exit, preserving crossings.
export const marketEasternTrees:WoodlandTree[]=[];
for(let row=0;row<4;row++)for(let col=0;col<16;col++){
 const t={x:340+col*43+(row%2)*14,y:[650,680,900,935][row]+(col%3-1)*4,kind:(row+col)%3,scale:.8+((row+col)%3)*.08};
 if(!woodlandTreeClear(t.x,t.y,t.scale,t.kind)||[...villageTrees,...forestTrees].some(p=>Math.hypot(p.x-t.x,p.y-t.y)<32)||natureSites.some(p=>Math.hypot(p.x-t.x,p.y-t.y)<38)||forestPlants.some(p=>Math.hypot(p.x-t.x,p.y-t.y)<42))continue;
 forestTrees.push(t);marketEasternTrees.push(t);
}
// Younger trees fill the narrow pocket below the pickup bay without covering either path.
export const marketPocketTrees:WoodlandTree[]=[];
for(let row=0;row<2;row++)for(let column=0;column<11;column++){
 const t={x:-336+column*43+row*16,y:887+row*25+(column%3)*3,kind:(row+column)%3,scale:.68+((row+column)%3)*.06};
 if(!woodlandTreeClear(t.x,t.y,t.scale,t.kind)||natureSites.some(p=>Math.hypot(p.x-t.x,p.y-t.y)<38)||forestPlants.some(p=>Math.hypot(p.x-t.x,p.y-t.y)<40)||villageLayout.bushes.some(p=>Math.hypot(p.x-t.x,p.y-t.y)<38)||[...villageTrees,...forestTrees].some(p=>Math.hypot(p.x-t.x,p.y-t.y)<30))continue;
 forestTrees.push(t);marketPocketTrees.push(t);
}
// Restore the wooded shoulder in the direction of the forest sign; keep berry crowns free.
export const forestEdgeTrees:WoodlandTree[]=[];
for(let row=0;row<9;row++)for(let col=0;col<19;col++){
 const t={x:-390+col*28+(row%2)*11,y:786+row*16,kind:(row+col)%3,scale:.65+((row+col)%4)*.1};
 if(!woodlandTreeClear(t.x,t.y,t.scale,t.kind)||[...villageTrees,...forestTrees].some(p=>Math.hypot(p.x-t.x,p.y-t.y)<29)||forestPlants.some(p=>Math.hypot(p.x-t.x,p.y-t.y)<42)||natureSites.some(p=>Math.hypot(p.x-t.x,p.y-t.y)<38))continue;
 forestTrees.push(t);forestEdgeTrees.push(t);
}
// Preserve the eight established trees displaced by the nursery bay, with their species and size.
export const nurseryTreeOrigins:WoodlandTree[]=[{x:770,y:900,kind:0,scale:.8},{x:813,y:904,kind:1,scale:.88},{x:856,y:896,kind:2,scale:.96},{x:899,y:900,kind:0,scale:.8},{x:942,y:904,kind:1,scale:.88},{x:985,y:896,kind:2,scale:.96},{x:956,y:939,kind:2,scale:.96},{x:999,y:931,kind:0,scale:.8}];
export const relocatedNurseryTrees:{from:WoodlandTree;to:WoodlandTree}[]=[];
for(const origin of nurseryTreeOrigins){
 const offsets=Array.from({length:32},(_,i)=>{const d=(i+1)*8;return [[d,0],[0,d],[-d,0],[0,-d],[d,d],[-d,d],[d,-d],[-d,-d]];}).flat();
 const point=offsets.map(([dx,dy])=>({...origin,x:origin.x+dx,y:origin.y+dy})).find(t=>t.x>=300&&t.x<=1160&&t.y>=610&&t.y<=1300&&woodlandTreeClear(t.x,t.y,t.scale,t.kind)&&[...villageTrees,...forestTrees].every(p=>Math.hypot(p.x-t.x,p.y-t.y)>=32));
 if(!point)throw Error('A Faiskola beállója mellől áthelyezett fa nem maradhat ki.');forestTrees.push(point);marketEasternTrees.push(point);relocatedNurseryTrees.push({from:origin,to:point});
}
const buildings:Box[]=[villageLayout.nursery,villageLayout.fishShop,villageLayout.craftShop];
export function villageBlocked(x:number,y:number){
 if(nurserySolid(x,y)||noticeBoardBlocked(x,y))return true;
 if([...villageTrees,...forestTrees].some(t=>Math.hypot((x-t.x)/12,(y-t.y)/9)<1))return true;
 if(villageLamps.some(p=>Math.abs(x-p.x)<8&&Math.abs(y-p.y)<5))return true;
 if(x>=-300&&x<=150&&y>=600&&y<=708)return false;
 if(x>=FOREST_LEFT+24&&x<22&&marketRoadContains(x,y,-8))return false;
 if(x<22&&y>=695&&y<=1340)return forestBlocked(x,y);
 if(x<22||x>WORLD_WIDTH-22||y<600||y>WORLD_HEIGHT-26)return true;
 if(buildings.some(b=>x+7>b.x&&x-7<b.x+b.w&&y+3>b.y&&y-4<b.y+b.h))return true;
 if([...villageTrees,...forestTrees].some(t=>Math.hypot((x-t.x)/12,(y-t.y)/9)<1))return true;
 // The basin and benches are solid; the surrounding cobbles remain walkable.
 if(villageLayout.benches.some(b=>benchContains(benchPose(b.angle),x,y)))return true;
 if(((x-476)/28)**2+((y-1081)/19)**2<1)return true;
 return false;
}
export const outsideFarm=(y:number)=>y>=600&&!inWorkshop(y)&&!inHome(y);

export function worldBlocked(x:number,y:number){
 if(inHome(y))return homeBlocked(x,y);
 if(inWorkshop(y))return x<108||x>692||y<WORKSHOP_ORIGIN+198||y>WORKSHOP_ORIGIN+510||(x>282&&x<567&&y>WORKSHOP_ORIGIN+250&&y<WORKSHOP_ORIGIN+357);
 if(y>=1600)return shopBlocked(x,y);
 if(y>=600)return villageBlocked(x,y);
 if(y>=farmLayout.southGate.y&&x>=farmLayout.southGate.x&&x<=farmLayout.southGate.x+farmLayout.southGate.w)return false;
 return blocked(x,y);
}

export type Shop='nursery'|'fishShop'|'craftShop';
export const shopOrigins:Record<Shop,number>={nursery:1600,fishShop:2300,craftShop:4400};
export function shopAt(y:number):Shop|null{return y>=1600&&y<2200?'nursery':y>=2300&&y<2900?'fishShop':y>=4400&&y<5000?'craftShop':null;}
export function shopBlocked(x:number,y:number){
 const shop=shopAt(y);if(!shop)return true;const yy=y-shopOrigins[shop];
 if(x<108||x>692||yy<198||yy>510)return true;
 // Counter, side displays and shelving leave a broad central aisle.
 if(x>337&&x<563&&yy>230&&yy<291)return true;
 if((x<201||x>600)&&yy<425)return true;
 return false;
}

export const shopNames={nursery:'Faiskola',fishShop:'Kertitó Szaküzlet',craftShop:'Műhelybolt'} as const;
export const shopsOpen=(elapsed:number)=>elapsed<360;
export type BenchPose={x:number;y:number;inX:number;inY:number;sideX:number;sideY:number};
export function benchPose(angle:number):BenchPose{
 const s=villageLayout.square,x=s.x+s.rx*.94*Math.cos(angle),y=s.y+s.ry*.94*Math.sin(angle),length=Math.hypot(s.x-x,s.y-y),inX=(s.x-x)/length,inY=(s.y-y)/length;
 return {x,y,inX,inY,sideX:inY,sideY:-inX};
}
export function benchPoint(b:BenchPose,x:number,y:number){return {x:b.x+b.sideX*x+b.inX*y,y:b.y+b.sideY*x+b.inY*y};}
export function benchContains(b:BenchPose,x:number,y:number){const dx=x-b.x,dy=y-b.y;return Math.abs(dx*b.sideX+dy*b.sideY)<36&&dy*b.inY+dx*b.inX> -20&&dy*b.inY+dx*b.inX<20;}
// A v13 player may be standing where the relocated shop or a new bench now is.
// Move only positions affected by those changes, preserving every possession.
export function relocateVillagePlayer(player:{x:number;y:number}){
 const {x,y}=player,b=villageLayout.fishShop;
 const changed=nurserySolid(x,y)||villageLamps.some(p=>Math.abs(x-p.x)<8&&Math.abs(y-p.y)<5)||noticeBoardBlocked(x,y)||buildings.some(b=>x+7>b.x&&x-7<b.x+b.w&&y+3>b.y&&y-4<b.y+b.h)||[...villageTrees,...forestTrees].some(t=>Math.hypot((x-t.x)/12,(y-t.y)/9)<1)||(x+7>b.x&&x-7<b.x+b.w&&y+3>b.y&&y-4<b.y+b.h)||villageLayout.benches.some(p=>benchContains(benchPose(p.angle),x,y));
 if(!changed||!worldBlocked(x,y))return player;
 for(let distance=8;distance<=160;distance+=8)for(let angle=0;angle<Math.PI*2;angle+=Math.PI/8){const point={x:x+Math.cos(angle)*distance,y:y+Math.sin(angle)*distance};if(!worldBlocked(point.x,point.y))return point;}
 return {x:560,y:1100};
}

export function merchantNearby(shop:Shop,x:number,y:number){const yy=y-shopOrigins[shop];const customer=x>=322&&x<=578&&yy>=291&&yy<=350;const side=Math.hypot(x-423,yy-235)<112&&(yy<230||x<337)&&yy<290;return customer||side;}
