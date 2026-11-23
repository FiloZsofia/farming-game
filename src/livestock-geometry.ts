import {worldBlocked} from './village-layout';
import {farmBounds,farmLayout} from './layout';
import {farmBuildingArtwork} from './birdhouse-placement';
import {pondOutline} from './pond-shape';
import {placementDebris} from './cleanup';
import {junkSites,junkPoint,junkPlacementRadius} from './junk-sites';
import {marketStand} from './market-site';
import {nearestBasePath} from './garden-path';
import {pathFootprint} from './garden-path-footprint';
import type {Snapshot} from './storage';
import {createLivestock,animalItems,coopWallForBoundary,type AnimalPoint as P,type AnimalItem,type AnimalPen,type AnimalFixture} from './livestock';
export type AnimalBox={x:number;y:number;w:number;h:number};
export const animalFootprints:Record<Exclude<AnimalItem,'paddock'>,AnimalBox>={coop:{x:-44,y:-66,w:88,h:74},feeder:{x:-17,y:-12,w:34,h:22},drinker:{x:-13,y:-20,w:26,h:30},dustBath:{x:-24,y:-9,w:48,h:25},perch:{x:-24,y:-28,w:48,h:36},shade:{x:-34,y:-45,w:68,h:54}};
export const movedAnimalBox=(kind:Exclude<AnimalItem,'paddock'>,p:P,rotation=0):AnimalBox=>{const b=rotation&&kind==='perch'?{x:-14,y:-40,w:28,h:58}:rotation&&kind==='dustBath'?{x:-15,y:-19,w:30,h:48}:animalFootprints[kind];return {...b,x:b.x+p.x,y:b.y+p.y};};
export const boxCorners=(b:AnimalBox):P[]=>[{x:b.x,y:b.y},{x:b.x+b.w,y:b.y},{x:b.x+b.w,y:b.y+b.h},{x:b.x,y:b.y+b.h}];
export function inAnimalPolygon(p:P,poly:readonly P[]){let inside=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const a=poly[i],b=poly[j];if((a.y>p.y)!==(b.y>p.y)&&p.x<(b.x-a.x)*(p.y-a.y)/(b.y-a.y)+a.x)inside=!inside;}return inside;}
const turn=(a:P,b:P,c:P)=>(b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x);
const onSegment=(p:P,a:P,b:P)=>Math.abs(turn(a,b,p))<.001&&p.x>=Math.min(a.x,b.x)-.001&&p.x<=Math.max(a.x,b.x)+.001&&p.y>=Math.min(a.y,b.y)-.001&&p.y<=Math.max(a.y,b.y)+.001;
const inOrOn=(p:P,poly:P[])=>inAnimalPolygon(p,poly)||poly.some((a,i)=>onSegment(p,a,poly[(i+1)%poly.length]));
export function segmentsCross(a:P,b:P,c:P,d:P){const t1=turn(a,b,c),t2=turn(a,b,d),t3=turn(c,d,a),t4=turn(c,d,b);return t1*t2<0&&t3*t4<0;}
export function animalPolygonsOverlap(a:readonly P[],b:readonly P[]){return a.some(p=>inAnimalPolygon(p,b))||b.some(p=>inAnimalPolygon(p,a))||a.some((p,i)=>b.some((q,j)=>segmentsCross(p,a[(i+1)%a.length],q,b[(j+1)%b.length])));}
export function animalBoxOverlap(a:AnimalBox,b:AnimalBox,pad=3){return a.x<b.x+b.w+pad&&a.x+a.w>b.x-pad&&a.y<b.y+b.h+pad&&a.y+a.h>b.y-pad;}
export function gatePoint(pen:Pick<AnimalPen,'boundary'|'gate'>){const a=pen.boundary[pen.gate],b=pen.boundary[(pen.gate+1)%pen.boundary.length];return a&&b?{x:(a.x+b.x)/2,y:(a.y+b.y)/2}:null;}
export function animalPolygonArea(p:readonly P[]){return Math.abs(p.reduce((n,a,i)=>{const b=p[(i+1)%p.length];return n+a.x*b.y-b.x*a.y;},0))/2;}
function obstacles(s:Snapshot):AnimalBox[]{return [...farmBuildingArtwork,{x:marketStand.left,y:marketStand.top,w:marketStand.right-marketStand.left,h:marketStand.bottom-marketStand.top},farmLayout.dock,farmLayout.catalog,farmLayout.mailbox,...s.travel.estate.trees.map(p=>({x:p.x-15,y:p.y-18,w:30,h:30})),...s.travel.estate.pond.map(p=>({x:p.x-27,y:p.y-40,w:54,h:48})),...s.travel.crafting?.machines.map(p=>({x:p.x-25,y:p.y-55,w:50,h:65}))??[],...s.skill.chests?.placed.map(p=>({x:p.x-22,y:p.y-28,w:44,h:36}))??[],...placementDebris(s.clearing,{seeds:s.seeds,produce:s.produce,plots:new Map(s.plots)}).map(p=>({x:p.x-12,y:p.y-14,w:24,h:25})),...s.travel.homestead?.garden.beds.map(b=>({x:b.area.x-5,y:b.area.y-4,w:b.area.w+10,h:b.area.h+12}))??[],...junkSites.map(j=>{const p=junkPoint(s.clearing,j.id),r=junkPlacementRadius(j.id);return{x:p.x-r,y:p.y-r*.8,w:r*2,h:r*1.2};}),...(s.story.birdhouse?[{x:s.story.birdhouse.x-15,y:s.story.birdhouse.y-45,w:30,h:52}]:[])];}
function offStatic(s:Snapshot,poly:P[]){if(poly.some(p=>p.x<farmBounds.left+60||p.x>farmBounds.right-60||p.y<farmBounds.top+70||p.y>540))return false;if(obstacles(s).some(b=>animalPolygonsOverlap(poly,boxCorners(b))))return false;if(animalPolygonsOverlap(poly,pondOutline(s.travel.estate.pondExpansion,12)))return false;
 for(const path of farmLayout.paths)for(let i=1;i<path.points.length;i++){const a=path.points[i-1],b=path.points[i],dx=b[0]-a[0],dy=b[1]-a[1],length=Math.hypot(dx,dy),nx=-dy/length*(path.width/2+4),ny=dx/length*(path.width/2+4);if(animalPolygonsOverlap(poly,[{x:a[0]+nx,y:a[1]+ny},{x:b[0]+nx,y:b[1]+ny},{x:b[0]-nx,y:b[1]-ny},{x:a[0]-nx,y:a[1]-ny}]))return false;}
 return !(s.travel.homestead?.garden.paths??[]).some(p=>animalPolygonsOverlap(poly,pathFootprint(p)));
}
export function canPlaceCoop(s:Snapshot,p:P){const poly=boxCorners(movedAnimalBox('coop',p));return offStatic(s,poly)&&!(s.travel.livestock?.pens??[]).some(pen=>animalBoxOverlap(movedAnimalBox('coop',p),movedAnimalBox('coop',pen.coop),12)||pen.boundary.length&&animalPolygonsOverlap(poly,pen.boundary));}
export function paddockShapeIssue(s:Snapshot,pen:AnimalPen,poly:P[]):string|null{
 if(poly.length<3)return 'Legalább három sarkot jelölj ki.';
 if(poly.length>16)return 'Legfeljebb 16 sarka lehet a kifutónak.';
 for(let i=0;i<poly.length;i++)for(let j=i+2;j<poly.length;j++){if(i===0&&j===poly.length-1)continue;if(segmentsCross(poly[i],poly[(i+1)%poly.length],poly[j],poly[(j+1)%poly.length])||onSegment(poly[i],poly[j],poly[(j+1)%poly.length])||onSegment(poly[j],poly[i],poly[(i+1)%poly.length]))return 'A kerítésvonal keresztezi vagy visszahajtja önmagát.';}
 const area=animalPolygonArea(poly);if(area<1)return 'A kerítés még nem határol körbe területet.';
 if(coopWallForBoundary(pen.coop,poly)===null&&!boxCorners(movedAnimalBox('coop',pen.coop)).every(p=>inAnimalPolygon(p,poly)))return 'Az ól kívül maradna. Csatlakoztasd a kerítést az ól két első sarkához, vagy vedd teljesen körbe az ólat.';
 if(!offStatic(s,poly))return 'A kifutó útba, vízbe vagy egy meglévő tárgy helyére ér. Válassz szabad területet.';
 if((s.travel.livestock?.pens??[]).some(other=>other.id!==pen.id&&(other.boundary.length?animalPolygonsOverlap(poly,other.boundary):animalPolygonsOverlap(poly,boxCorners(movedAnimalBox('coop',other.coop))))))return 'A kifutó egy másik ól vagy kifutó helyére ér.';
 if(pen.boundary.length&&pen.boundary.some((a,i)=>{const b=pen.boundary[(i+1)%pen.boundary.length];return !inOrOn(a,poly)||!inOrOn({x:(a.x+b.x)/2,y:(a.y+b.y)/2},poly)||poly.some((c,j)=>segmentsCross(a,b,c,poly[(j+1)%poly.length]));}))return 'Bővítéskor a régi kifutó teljes területének bent kell maradnia.';
 if(!Object.entries(pen.fixtures).every(([k,p])=>boxCorners(movedAnimalBox(k as AnimalFixture,p!,pen.rotations?.[k as AnimalFixture])).every(q=>inAnimalPolygon(q,poly))))return 'Egy berendezés kívül maradna a kifutón.';
 return null;
}
export function canDrawPaddock(s:Snapshot,pen:AnimalPen,poly:P[]){return paddockShapeIssue(s,pen,poly)===null;}
export function animalApproach(kind:Exclude<AnimalItem,'paddock'>,p:P,rotation=0){const b=movedAnimalBox(kind,p,rotation);return {x:p.x,y:b.y+b.h+10};}
export function canPlaceAnimalFixture(s:Snapshot,pen:AnimalPen,kind:AnimalFixture,p:P,rotation=0){
 const box=movedAnimalBox(kind,p,rotation);if(!pen.boundary.length||!boxCorners(box).every(q=>inAnimalPolygon(q,pen.boundary))||!inAnimalPolygon(animalApproach(kind,p,rotation),pen.boundary)||animalBoxOverlap(box,movedAnimalBox('coop',pen.coop),8))return false;
 if(Object.entries(pen.fixtures).some(([k,q])=>animalBoxOverlap(box,movedAnimalBox(k as AnimalFixture,q!,pen.rotations?.[k as AnimalFixture]),7)))return false;
 const next={...pen,fixtures:{...pen.fixtures,[kind]:p},rotations:{...pen.rotations,...(rotation?{[kind]:rotation as 1}:{})}};const gate=gatePoint(next);return !!gate&&[animalApproach('coop',pen.coop),...Object.entries(next.fixtures).map(([k,q])=>animalApproach(k as AnimalFixture,q!,next.rotations?.[k as AnimalFixture]))].every(q=>!!penWalkRoute(next,gate,q));
}
export function penWalkRoute(pen:AnimalPen,start:P,end:P):P[]|null{
 const step=8,minX=Math.floor(Math.min(...pen.boundary.map(p=>p.x))/step)*step,minY=Math.floor(Math.min(...pen.boundary.map(p=>p.y))/step)*step;
 const boxes=[movedAnimalBox('coop',pen.coop),...Object.entries(pen.fixtures).filter(([k])=>k!=='dustBath'&&k!=='shade').map(([k,p])=>movedAnimalBox(k as AnimalFixture,p!,pen.rotations?.[k as AnimalFixture]))];
 const free=(p:P)=>inAnimalPolygon(p,pen.boundary)&&!boxes.some(b=>p.x>b.x-3&&p.x<b.x+b.w+3&&p.y>b.y-3&&p.y<b.y+b.h+3);
 const snap=(p:P)=>{const points:P[]=[];for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){const q={x:minX+Math.round((p.x-minX)/step)*step+dx*step,y:minY+Math.round((p.y-minY)/step)*step+dy*step};if(free(q))points.push(q);}return points.sort((a,b)=>Math.hypot(a.x-p.x,a.y-p.y)-Math.hypot(b.x-p.x,b.y-p.y))[0];};
 if(!free(end))return null;const a=snap(start),b=snap(end);if(!a||!b)return null;const key=(p:P)=>`${p.x},${p.y}`,queue=[a],seen=new Map<string,P|null>([[key(a),null]]);let found:P|null=null;
 for(let i=0;i<queue.length&&i<24000;i++){const p=queue[i];if(key(p)===key(b)){found=p;break;}for(const [dx,dy]of [[step,0],[-step,0],[0,step],[0,-step]]){const q={x:p.x+dx,y:p.y+dy};if(!seen.has(key(q))&&free(q)){seen.set(key(q),p);queue.push(q);}}}
 if(!found)return null;const route=[end];let p:P|null=found;while(p){route.unshift(p);p=seen.get(key(p))??null;}route.unshift(start);return route;
}
export function placeCoop(source:Snapshot,p:P):Snapshot|null{if(!source.travel.livestock?.packed.coop||!canPlaceCoop(source,p))return null;const next=structuredClone(source),s=next.travel.livestock!;if(s.pens.length>=20)return null;s.packed.coop--;s.pens.push({id:s.nextId++,name:`Tyúkól ${s.pens.length+1}`,coop:{...p},boundary:[],gate:0,fixtures:{},feed:0,wateredDay:null,cleanedDay:source.clock.day,eggs:0});return next;}
export function paddockPlacementIssue(source:Snapshot,id:number,poly:P[],gate:number):string|null{
 const old=source.travel.livestock?.pens.find(p=>p.id===id);if(!old)return 'Válaszd ki a kifutóhoz tartozó ólat.';
 if(!old.boundary.length&&!source.travel.livestock?.packed.paddock)return 'Előbb vegyél kifutócsomagot a Gazdaudvarban.';
 const shape=paddockShapeIssue(source,old,poly);if(shape)return shape;
 if(!Number.isInteger(gate)||gate<0||gate>=poly.length||Math.hypot(poly[gate].x-poly[(gate+1)%poly.length].x,poly[gate].y-poly[(gate+1)%poly.length].y)<42)return 'Válassz hosszabb oldalt, hogy elférjen a kapu.';
 const coopWall=coopWallForBoundary(old.coop,poly);if(gate===coopWall)return 'A kaput egy szabad kerítésszakaszra tedd, az ól fala mellé.';
 const pen={...old,boundary:poly,gate,coopWall:coopWall??undefined},livestock=source.travel.livestock!,next={...source,travel:{...source.travel,livestock:{...livestock,pens:livestock.pens.map(p=>p.id===id?pen:p)}}};
 if(!penWalkRoute(pen,gatePoint(pen)!,animalApproach('coop',pen.coop)))return 'A kaputól nem lehet eljutni az ólhoz. Válassz másik kapuoldalt.';
 if(!farmAnimalWalk(next,{x:170,y:620},gatePoint(pen)!,(x,y)=>worldBlocked(x,y,next.travel.estate.pondExpansion),pen))return 'A kapu kívülről nem közelíthető meg. Hagyj szabad átjárót a farm felől.';
 return null;
}
export function placePaddock(source:Snapshot,id:number,poly:P[],gate:number):Snapshot|null{if(paddockPlacementIssue(source,id,poly,gate))return null;const next=structuredClone(source),s=next.travel.livestock!,pen=s.pens.find(p=>p.id===id)!;if(!pen.boundary.length)s.packed.paddock--;pen.boundary=structuredClone(poly);pen.gate=gate;const wall=coopWallForBoundary(pen.coop,poly);if(wall===null)delete pen.coopWall;else pen.coopWall=wall;return next;}
export function placeAnimalFixture(source:Snapshot,id:number,kind:AnimalFixture,p:P,rotation=0):Snapshot|null{const old=source.travel.livestock?.pens.find(p=>p.id===id);if(!old||old.fixtures[kind]||!source.travel.livestock?.packed[kind]||(rotation!==0&&rotation!==1)||rotation===1&&!['dustBath','perch'].includes(kind)||!canPlaceAnimalFixture(source,old,kind,p,rotation))return null;const next=structuredClone(source),s=next.travel.livestock!,pen=s.pens.find(p=>p.id===id)!;s.packed[kind]--;pen.fixtures[kind]={...p};if(rotation)pen.rotations={...pen.rotations,[kind]:1};return next;}
export function animalAreaOccupied(s:Snapshot,box:AnimalBox){const poly=boxCorners(box);return (s.travel.livestock?.pens??[]).some(pen=>animalBoxOverlap(box,movedAnimalBox('coop',pen.coop))||pen.boundary.length&&animalPolygonsOverlap(poly,pen.boundary));}
// A real route through the farm gate, around existing beds and furniture.
export function farmAnimalWalk(s:Snapshot,start:P,end:P,blockedWorld:(x:number,y:number)=>boolean,targetPen?:AnimalPen):P[]|null{
 const step=12,minX=-384,minY=-336,maxX=1188,maxY=708;
 const pens=s.travel.livestock?.pens??[];
 const free=(p:P)=>{
  if(p.x<minX||p.x>maxX||p.y<minY||p.y>maxY||blockedWorld(p.x,p.y))return false;
  if(pens.some(pen=>{const b=movedAnimalBox('coop',pen.coop);return p.x>b.x-3&&p.x<b.x+b.w+3&&p.y>b.y-3&&p.y<b.y+b.h+3;}))return false;
  if(p.x>marketStand.left-8&&p.x<marketStand.right+8&&p.y>marketStand.top-5&&p.y<marketStand.bottom+5)return false;
  if(s.travel.estate.trees.some(t=>Math.hypot(t.x-p.x,t.y-p.y)<14)||s.travel.crafting?.machines.some(m=>Math.hypot(m.x-p.x,m.y-p.y)<18)||s.skill.chests?.placed.some(c=>Math.hypot(c.x-p.x,c.y-p.y)<22))return false;
  if(s.travel.homestead?.garden.beds.some(b=>b.state.prepared&&p.x>b.area.x-3&&p.x<b.area.x+b.area.w+3&&p.y>b.area.y-3&&p.y<b.area.y+b.area.h+3))return false;
  return !pens.some(old=>{const pen=targetPen?.id===old.id?targetPen:old;if(!pen.boundary.length)return false;const gate=gatePoint(pen);if(gate&&Math.hypot(p.x-gate.x,p.y-gate.y)<20&&pen.id===targetPen?.id)return false;return inAnimalPolygon(p,pen.boundary);});
 };
 const nearest=(p:P)=>{const list:P[]=[];for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){const q={x:minX+Math.round((p.x-minX)/step)*step+dx*step,y:minY+Math.round((p.y-minY)/step)*step+dy*step};if(free(q))list.push(q);}return list.sort((a,b)=>Math.hypot(a.x-p.x,a.y-p.y)-Math.hypot(b.x-p.x,b.y-p.y))[0];};
 const a=nearest(start),b=nearest(end);if(!a||!b)return null;
 const key=(p:P)=>`${p.x},${p.y}`,paths=s.travel.homestead?.garden.paths??[],costCache=new Map<string,number>();
 const cost=(p:P)=>{const k=key(p),known=costCache.get(k);if(known!==undefined)return known;const base=nearestBasePath(p,farmLayout.paths),onPath=!!base&&base.distance<=base.width/2||paths.some(q=>Math.hypot(p.x-q.x,p.y-q.y)<13),value=onPath?1:5;costCache.set(k,value);return value;};
 type Node={p:P;score:number;cost:number};const heap:Node[]=[];
 const push=(n:Node)=>{heap.push(n);let i=heap.length-1;while(i){const j=(i-1)>>1;if(heap[j].score<=n.score)break;heap[i]=heap[j];i=j;}heap[i]=n;};
 const pop=()=>{const first=heap[0],last=heap.pop()!;if(heap.length){let i=0;while(i*2+1<heap.length){let j=i*2+1;if(j+1<heap.length&&heap[j+1].score<heap[j].score)j++;if(heap[j].score>=last.score)break;heap[i]=heap[j];i=j;}heap[i]=last;}return first;};
 const seen=new Map<string,P|null>([[key(a),null]]),dist=new Map<string,number>([[key(a),0]]);push({p:a,score:0,cost:0});let found:P|null=null;
 for(let i=0;heap.length&&i<40000;i++){const n=pop(),p=n.p;if(n.cost!==dist.get(key(p)))continue;if(key(p)===key(b)){found=p;break;}for(const [dx,dy]of [[step,0],[-step,0],[0,step],[0,-step]]){const q={x:p.x+dx,y:p.y+dy};if(!free(q)||!free({x:(p.x+q.x)/2,y:(p.y+q.y)/2}))continue;const next=n.cost+cost(q);if(next<(dist.get(key(q))??Infinity)){dist.set(key(q),next);seen.set(key(q),p);push({p:q,cost:next,score:next+(Math.abs(q.x-b.x)+Math.abs(q.y-b.y))/step});}}}
 if(!found)return null;const result=[end];let p:P|null=found;while(p){result.unshift(p);p=seen.get(key(p))??null;}result.unshift(start);return result;
}
