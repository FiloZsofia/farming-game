import {describe,it,expect} from 'vitest';
import {move,blocked} from './movement';
import {worldBlocked,villageLayout,shopOrigins,shopAt,benchPose,benchPoint,shopsOpen} from './village-layout';
import {snapshot,decodeSnapshot,validSnapshot} from './storage';
import {createGarden} from './gardening';
import {createClock} from './clock';
import {createTravel,forageReady,storyEndPending} from './travel';
describe('Southbound village route',()=>{
 it('opens only the south gate and allows walking both ways across the farm boundary',()=>{
  expect(blocked(170,595)).toBe(true);expect(worldBlocked(170,595)).toBe(false);expect(worldBlocked(400,595)).toBe(true);
  let p={x:170,y:580};for(let i=0;i<15;i++)p=move(p.x,p.y,0,1,.05,1,()=>false,worldBlocked);expect(p.y).toBeGreaterThan(630);
  for(let i=0;i<15;i++)p=move(p.x,p.y,0,-1,.05,1,()=>false,worldBlocked);expect(p.y).toBeCloseTo(580);
 });
 it('keeps buildings solid and all entrances reachable',()=>{
  for(const b of [villageLayout.nursery,villageLayout.fishShop]){expect(worldBlocked(b.x+b.w/2,b.y+30)).toBe(true);expect(worldBlocked(b.door.x,b.door.y+5)).toBe(false);}
  expect(worldBlocked(10,900)).toBe(false);expect(worldBlocked(-1120,900)).toBe(true);expect(worldBlocked(476,1081)).toBe(true);
 });
 it('roundtrips a village position and validates collected-bush dates',()=>{
  const data=snapshot({x:450,y:1050},createClock(3),createGarden());data.travel.picked.fern=1;expect(validSnapshot(data)).toBe(true);expect(decodeSnapshot(data)).toEqual(data);
  data.travel.picked.fern=4;expect(validSnapshot(data)).toBe(false);data.travel.picked={unknown:1};expect(validSnapshot(data)).toBe(false);
 });
 it('migrates v12 without moving the farmer or changing possessions',()=>{
  const current=snapshot({x:250,y:242},createClock(),createGarden());const {travel,...rest}=current;const legacy={...rest,version:12};expect(decodeSnapshot(legacy)).toEqual({...current,travel:createTravel()});expect(legacy).not.toHaveProperty('travel');
 });
 it('keeps both shop interiors walkable and saves their locations safely',()=>{
  for(const shop of ['nursery','fishShop'] as const){const y=shopOrigins[shop];expect(shopAt(y+467)).toBe(shop);expect(worldBlocked(400,y+467)).toBe(false);expect(worldBlocked(400,y+250)).toBe(true);expect(worldBlocked(95,y+470)).toBe(true);expect(worldBlocked(400,y+520)).toBe(true);const data=snapshot({x:400,y:y+467},createClock(),createGarden());expect(decodeSnapshot(data)).toEqual(data);}
 });
 it('rejects newer unknown saves',()=>{
  expect(decodeSnapshot({...snapshot({x:250,y:242},createClock(),createGarden()),version:18})).toBeNull();
 });
 it('allows collecting again after two days, preserving each bush independently',()=>{
  const travel=createTravel();expect(forageReady(travel,'fern',1)).toBe(true);travel.picked.fern=1;expect(forageReady(travel,'fern',2)).toBe(false);expect(forageReady(travel,'birch',2)).toBe(true);expect(forageReady(travel,'fern',3)).toBe(true);
 });
});

describe('Square furnishings and opening hours',()=>{
 it('places both benches at the rim with backs facing out and clear space in front',()=>{
  for(const bench of villageLayout.benches){const pose=benchPose(bench.angle),square=villageLayout.square;const radius=(p:{x:number;y:number})=>((p.x-square.x)/square.rx)**2+((p.y-square.y)/square.ry)**2;expect(radius(pose)).toBeCloseTo(.94**2);expect(radius(benchPoint(pose,0,-12))).toBeGreaterThan(radius(benchPoint(pose,0,8)));const front=benchPoint(pose,0,42);expect(worldBlocked(front.x,front.y)).toBe(false);expect(worldBlocked(pose.x,pose.y)).toBe(true);}
 });
 it('keeps every point of the direct approach to the relocated door walkable',()=>{
  for(let t=0;t<=1;t+=.05){expect(worldBlocked(606+(650-606)*t,1097+(1069-1097)*t)).toBe(false);}
 });
 it('closes at the beginning of night and reopens with the next morning clock',()=>{
  expect(shopsOpen(0)).toBe(true);expect(shopsOpen(359.99)).toBe(true);expect(shopsOpen(360)).toBe(false);expect(shopsOpen(590)).toBe(false);expect(shopsOpen(createClock(4).elapsed)).toBe(true);
 });
 it('migrates a v13 player out of a newly occupied position without losing their farm state',()=>{
  for(const player of [{x:700,y:1020},benchPose(villageLayout.benches[0].angle)]){
   const current=snapshot(player,createClock(3),createGarden());current.travel.picked.fern=1;current.travel.morning='Megmaradó reggeli üzenet';current.economy.gold=47;
   const {metAnnie,metLeo,...travel}=current.travel,legacy={...current,version:13,travel};const decoded=decodeSnapshot(legacy)!;
   expect(decoded).not.toBeNull();expect(worldBlocked(decoded.player.x,decoded.player.y)).toBe(false);expect(decoded.player).not.toMatchObject({x:player.x,y:player.y});expect(decoded.travel).toEqual({...travel,metAnnie:false,metLeo:false,sale:null});expect(decoded.seeds).toEqual(current.seeds);expect(decoded.economy).toEqual(current.economy);expect(decoded.clock).toEqual(current.clock);expect(legacy.player).toEqual({x:player.x,y:player.y});
  }
 });
});

it('keeps nursery display saplings outside the entrance path',()=>{
 const distance=(p:{x:number;y:number},a:{x:number;y:number},b:{x:number;y:number})=>{const t=Math.max(0,Math.min(1,((p.x-a.x)*(b.x-a.x)+(p.y-a.y)*(b.y-a.y))/((b.x-a.x)**2+(b.y-a.y)**2)));return Math.hypot(p.x-a.x-(b.x-a.x)*t,p.y-a.y-(b.y-a.y)*t);};
 for(const p of villageLayout.nurserySaplings){expect(Math.hypot(p.x-591,p.y-954)).toBeGreaterThan(34);expect(distance(p,{x:474,y:1016},{x:586,y:978})).toBeGreaterThan(24);expect(distance(p,{x:586,y:978},{x:591,y:940})).toBeGreaterThan(24);}
});

 it('allows a walkable side approach for conversation without confusing it with the front counter',async()=>{const {merchantNearby,shopBlocked,shopOrigins}=await import('./village-layout');for(const shop of ['fishShop','nursery'] as const){const origin=shopOrigins[shop];expect(shopBlocked(325,origin+240)).toBe(false);expect(merchantNearby(shop,325,origin+240)).toBe(true);expect(merchantNearby(shop,450,origin+320)).toBe(false);expect(merchantNearby(shop,400,origin+467)).toBe(false);}});

it('keeps the full southern farm boundary closed except for the village gate',()=>{for(const x of [-376,-200,0,140,210,500,900,1176])expect(worldBlocked(x,595)).toBe(true);for(const x of [150,170,190])expect(worldBlocked(x,595)).toBe(false);});

it('notifies once after the narrative milestone, independently of day count, with save compatibility',()=>{const s=snapshot({x:330,y:260},createClock(32),createGarden());expect(storyEndPending(s.travel)).toBe(false);s.travel.forest={revision:2,stick:true,defeated:['vine','spore-a','spore-b','vine-inner'],picked:{},sample:true,examined:true,sent:true,focus:72};expect(storyEndPending(s.travel)).toBe(true);expect(decodeSnapshot(s)).toEqual(s);s.travel.storyEndSeen=true;expect(storyEndPending(s.travel)).toBe(false);expect(decodeSnapshot(s)).toEqual(s);expect(validSnapshot({...s,travel:{...s.travel,storyEndSeen:'yes'}})).toBe(false);});

it('keeps complete crowns clear of both village walking routes',async()=>{const {villageTrees,forestTrees,woodlandTreeClear,villagePaths}=await import('./village-layout');expect(villageTrees.length+forestTrees.length).toBeGreaterThan(5);for(const t of [...villageTrees,...forestTrees])expect(woodlandTreeClear(t.x,t.y,1,t.kind)).toBe(true);for(const path of villagePaths)for(let i=1;i<path.points.length;i++){const a=path.points[i-1],b=path.points[i],n=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/4);for(let j=0;j<=n;j++)expect(woodlandTreeClear(a[0]+(b[0]-a[0])*j/n,a[1]+(b[1]-a[1])*j/n+45)).toBe(false);}});

it('preserves a current save when a restored woodland trunk covers its old position',async()=>{const {forestTrees}=await import('./village-layout');const t=forestTrees[0],s=snapshot({x:t.x,y:t.y},createClock(8),createGarden());s.economy.gold=163;s.clearing.wood=35;const original=structuredClone(s),n=decodeSnapshot(s)!;expect(n).not.toBeNull();expect(worldBlocked(n.player.x,n.player.y)).toBe(false);expect(n.economy).toEqual(s.economy);expect(n.clearing).toEqual(s.clearing);expect(n.clock).toEqual(s.clock);expect(s).toEqual(original);});
