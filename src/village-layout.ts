import {blocked,type Box} from './movement';
export const WORLD_HEIGHT=1420;
export const WORLD_WIDTH=1000;
export const villageLayout={
 nursery:{x:510,y:840,w:165,h:106,door:{x:591,y:954},entrance:{x:580,y:898,w:29,h:65}},
 fishShop:{x:665,y:960,w:230,h:128,door:{x:708,y:1100},entrance:{x:690,y:1030,w:35,h:76}},
 cottage:{x:315,y:1230,w:146,h:104},
 square:{x:475,y:1080,rx:181,ry:115},
 nurserySaplings:[{x:518,y:958},{x:542,y:958},{x:646,y:958},{x:670,y:958}],
 benches:[{id:'west',angle:-2.35},{id:'east',angle:-.55}],
 bushes:[{id:'fern',x:100,y:736},{id:'birch',x:238,y:821},{id:'moss',x:70,y:939},{id:'brook',x:191,y:1090}],
 trees:[{x:44,y:670,kind:0},{x:103,y:650,kind:1},{x:254,y:685,kind:2},{x:53,y:799,kind:2},{x:169,y:777,kind:0},{x:286,y:769,kind:1},{x:51,y:889,kind:1},{x:278,y:934,kind:0},{x:146,y:1000,kind:2},{x:40,y:1059,kind:0},{x:311,y:1120,kind:1},{x:100,y:1165,kind:2},{x:250,y:1184,kind:0}],
} as const;
const buildings:Box[]=[villageLayout.nursery,villageLayout.fishShop,villageLayout.cottage];
export function villageBlocked(x:number,y:number){
 if(x<22||x>WORLD_WIDTH-22||y<600||y>1394)return true;
 if(buildings.some(b=>x+7>b.x&&x-7<b.x+b.w&&y+3>b.y&&y-4<b.y+b.h))return true;
 if(villageLayout.trees.some(t=>Math.hypot((x-t.x)/12,(y-t.y)/9)<1))return true;
 // The basin and benches are solid; the surrounding cobbles remain walkable.
 if(villageLayout.benches.some(b=>benchContains(benchPose(b.angle),x,y)))return true;
 if(((x-476)/28)**2+((y-1081)/19)**2<1)return true;
 return false;
}
export const outsideFarm=(y:number)=>y>=600;

export function worldBlocked(x:number,y:number){
 if(y>=1600)return shopBlocked(x,y);
 if(y>=600)return villageBlocked(x,y);
 if(y>=560&&x>=146&&x<=196)return false;
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
 const changed=(x+7>b.x&&x-7<b.x+b.w&&y+3>b.y&&y-4<b.y+b.h)||villageLayout.benches.some(p=>benchContains(benchPose(p.angle),x,y));
 if(!changed||!worldBlocked(x,y))return player;
 for(let distance=8;distance<=160;distance+=8)for(let angle=0;angle<Math.PI*2;angle+=Math.PI/8){const point={x:x+Math.cos(angle)*distance,y:y+Math.sin(angle)*distance};if(!worldBlocked(point.x,point.y))return point;}
 return {x:560,y:1100};
}

export function merchantNearby(shop:Shop,x:number,y:number){const yy=y-shopOrigins[shop];return Math.hypot(x-423,yy-235)<112&&(yy<230||x<337)&&yy<290;}
