import {natureSites,natureTreeClear} from './nature-resources';
import {forestBlocked,forestPlants} from './forest';
import {farmLayout} from './layout';
import {inHome,homeBlocked} from './home';
import {inWorkshop,WORKSHOP_ORIGIN} from './research';
import {blocked,type Box} from './movement';
export const WORLD_HEIGHT=1420;
export const WORLD_WIDTH=1000;
export const villageLayout={
 nursery:{x:510,y:840,w:165,h:106,door:{x:591,y:954},entrance:{x:580,y:898,w:29,h:65}},
 fishShop:{x:665,y:960,w:230,h:128,door:{x:708,y:1100},entrance:{x:690,y:1030,w:35,h:76}},
 square:{x:475,y:1080,rx:181,ry:115},
 nurserySaplings:[{x:518,y:958},{x:542,y:958},{x:646,y:958},{x:670,y:958}],
 benches:[{id:'west',angle:-2.35},{id:'east',angle:-.55}],
 bushes:[{id:'fern',x:100,y:736},{id:'birch',x:238,y:821},{id:'moss',x:70,y:980},{id:'brook',x:191,y:1090}],
 trees:[{x:44,y:670,kind:0},{x:103,y:650,kind:1},{x:254,y:685,kind:2},{x:53,y:799,kind:2},{x:169,y:777,kind:0},{x:286,y:769,kind:1},{x:51,y:889,kind:1},{x:278,y:934,kind:0},{x:146,y:1000,kind:2},{x:40,y:1059,kind:0},{x:311,y:1120,kind:1},{x:100,y:1165,kind:2},{x:250,y:1184,kind:0}],
} as const;
// Drawing and canopy clearance use the same full routes.
export const villagePaths=[
 {width:32,points:[[170,600],[174,672],[305,784],[393,909],[476,1030],[493,1320],[493,1414]]},
 {width:17,points:[[278,760],[150,813],[107,930],[211,1040],[356,1080]]},
 {width:28,points:[[474,1016],[586,978],[591,940]]},
 {width:25,points:[[606,1097],[660,1100],[708,1100]]},
 {width:20,points:[[107,930],[40,930],[-120,938],[-270,1000],[-450,995],[-570,962],[-660,978],[-780,984],[-940,1010]]},
];
// Match the crown silhouette, leaving room under/along its tapered edges.
export function woodlandTreeClear(x:number,y:number,scale=1,kind=0){
 if(!natureTreeClear(x,y,scale))return false;
 const crowns=kind===2?Array.from({length:4},(_,i)=>({x:0,y:-90+i*19+22,rx:15+i*8,ry:24})):[{x:-18,y:-48,rx:22.5,ry:19.5},{x:12,y:-56,rx:25.5,ry:23.5},{x:-3,y:-76,rx:24.5,ry:19.5},{x:0,y:-38,rx:28,ry:16}];
 return villagePaths.every(path=>path.points.slice(1).every((b,i)=>{const a=path.points[i],steps=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/3),margin=path.width/2+4;for(let j=0;j<=steps;j++){const xx=a[0]+(b[0]-a[0])*j/steps,yy=a[1]+(b[1]-a[1])*j/steps;if(Math.hypot(xx-Math.max(x-5*scale,Math.min(x+6*scale,xx)),yy-Math.max(y-44*scale,Math.min(y+7*scale,yy)))<margin)return false;if(crowns.some(c=>((xx-x-c.x*scale)/(c.rx*scale+margin))**2+((yy-y-c.y*scale)/(c.ry*scale+margin))**2<1))return false;}return true;}));
}
export const villageTrees=villageLayout.trees.filter(t=>woodlandTreeClear(t.x,t.y,1,t.kind));
// Reposition crowded trees beside the paths instead of removing the woodland.
const candidates=Array.from({length:72},(_,i)=>({x:28+i%8*37+(i%3)*6,y:675+Math.floor(i/8)*61,kind:i%3}));
export const forestTrees:{x:number;y:number;kind:number}[]=[];
for(const original of candidates){
 const offsets=[[0,0],...Array.from({length:8},(_,i)=>{const d=(i+1)*8;return [[-d,0],[d,0],[0,-d],[0,d],[-d,-d],[d,-d],[-d,d],[d,d]];}).flat()];
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
const buildings:Box[]=[villageLayout.nursery,villageLayout.fishShop];
export function villageBlocked(x:number,y:number){
 if(forestTrees.some(t=>Math.hypot((x-t.x)/12,(y-t.y)/9)<1))return true;
 if(x<22&&y>=695&&y<=1340)return forestBlocked(x,y);
 if(x<22||x>WORLD_WIDTH-22||y<600||y>1394)return true;
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

export type Shop='nursery'|'fishShop';
export const shopOrigins:Record<Shop,number>={nursery:1600,fishShop:2300};
export function shopAt(y:number):Shop|null{return y>=1600&&y<2200?'nursery':y>=2300&&y<2900?'fishShop':null;}
export function shopBlocked(x:number,y:number){
 const shop=shopAt(y);if(!shop)return true;const yy=y-shopOrigins[shop];
 if(x<108||x>692||yy<198||yy>510)return true;
 // Counter, side displays and shelving leave a broad central aisle.
 if(x>337&&x<563&&yy>230&&yy<291)return true;
 if((x<201||x>600)&&yy<425)return true;
 return false;
}

export const shopNames={nursery:'Faiskola',fishShop:'Kertitó Szaküzlet'} as const;
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
 const changed=[...villageTrees,...forestTrees].some(t=>Math.hypot((x-t.x)/12,(y-t.y)/9)<1)||(x+7>b.x&&x-7<b.x+b.w&&y+3>b.y&&y-4<b.y+b.h)||villageLayout.benches.some(p=>benchContains(benchPose(p.angle),x,y));
 if(!changed||!worldBlocked(x,y))return player;
 for(let distance=8;distance<=160;distance+=8)for(let angle=0;angle<Math.PI*2;angle+=Math.PI/8){const point={x:x+Math.cos(angle)*distance,y:y+Math.sin(angle)*distance};if(!worldBlocked(point.x,point.y))return point;}
 return {x:560,y:1100};
}

export function merchantNearby(shop:Shop,x:number,y:number){const yy=y-shopOrigins[shop];return Math.hypot(x-423,yy-235)<112&&(yy<230||x<337)&&yy<290;}
