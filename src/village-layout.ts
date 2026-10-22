import {blocked,type Box} from './movement';
export const WORLD_HEIGHT=1420;
export const villageLayout={
 nursery:{x:510,y:840,w:165,h:106,door:{x:591,y:954}},
 fishShop:{x:570,y:1130,w:155,h:105,door:{x:642,y:1244}},
 cottage:{x:315,y:1230,w:146,h:104},
 square:{x:475,y:1080,rx:181,ry:115},
 bench:{x:369,y:1018},
 bushes:[{id:'fern',x:100,y:736},{id:'birch',x:238,y:821},{id:'moss',x:93,y:939},{id:'brook',x:215,y:1040}],
 trees:[{x:44,y:670,kind:0},{x:103,y:650,kind:1},{x:254,y:685,kind:2},{x:53,y:799,kind:2},{x:169,y:777,kind:0},{x:286,y:769,kind:1},{x:51,y:889,kind:1},{x:278,y:934,kind:0},{x:146,y:1000,kind:2},{x:40,y:1059,kind:0},{x:311,y:1120,kind:1},{x:100,y:1165,kind:2},{x:250,y:1184,kind:0}],
} as const;
const buildings:Box[]=[villageLayout.nursery,villageLayout.fishShop,villageLayout.cottage];
export function villageBlocked(x:number,y:number){
 if(x<22||x>778||y<600||y>1394)return true;
 if(buildings.some(b=>x+7>b.x&&x-7<b.x+b.w&&y+3>b.y&&y-4<b.y+b.h))return true;
 if(villageLayout.trees.some(t=>Math.hypot((x-t.x)/12,(y-t.y)/9)<1))return true;
 // The basin and benches are solid; the surrounding cobbles remain walkable.
 if([{x:342,y:1007,w:55,h:20},{x:515,y:1167,w:55,h:20}].some(b=>x+7>b.x&&x-7<b.x+b.w&&y+3>b.y&&y-4<b.y+b.h))return true;
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
