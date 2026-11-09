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
  for(const b of [villageLayout.nursery,villageLayout.fishShop,villageLayout.craftShop]){expect(worldBlocked(b.x+b.w/2,b.y+30)).toBe(true);expect(worldBlocked(b.door.x,b.door.y+5)).toBe(false);}
  expect(worldBlocked(10,930)).toBe(false);expect(worldBlocked(-1120,900)).toBe(true);expect(worldBlocked(476,1081)).toBe(true);
 });
 it('roundtrips a village position and validates collected-bush dates',()=>{
  const data=snapshot({x:450,y:1050},createClock(3),createGarden());data.travel.picked.fern=1;expect(validSnapshot(data)).toBe(true);expect(decodeSnapshot(data)).toEqual(data);
  data.travel.picked.fern=4;expect(validSnapshot(data)).toBe(false);data.travel.picked={unknown:1};expect(validSnapshot(data)).toBe(false);
 });
 it('migrates v12 without moving the farmer or changing possessions',()=>{
  const current=snapshot({x:250,y:242},createClock(),createGarden());const {travel,...rest}=current;const legacy={...rest,version:12};expect(decodeSnapshot(legacy)).toEqual({...current,travel:createTravel()});expect(legacy).not.toHaveProperty('travel');
 });
 it('keeps all three shop interiors walkable and saves their locations safely',()=>{
  for(const shop of ['nursery','fishShop','craftShop'] as const){const y=shopOrigins[shop];expect(shopAt(y+467)).toBe(shop);expect(worldBlocked(400,y+467)).toBe(false);expect(worldBlocked(400,y+250)).toBe(true);expect(worldBlocked(95,y+470)).toBe(true);expect(worldBlocked(400,y+520)).toBe(true);const data=snapshot({x:400,y:y+467},createClock(),createGarden());expect(decodeSnapshot(data)).toEqual(data);}
 });
 it('rejects newer unknown saves',()=>{
  expect(decodeSnapshot({...snapshot({x:250,y:242},createClock(),createGarden()),version:19})).toBeNull();
 });
 it('keeps wild berries for three days, permits one harvest, and skips two of three three-day cycles',()=>{
  const travel=createTravel();const ripe=[];
  for(let day=1;day<=27;day+=3)if(forageReady(travel,'fern',day))ripe.push(day);
  expect(ripe).toHaveLength(3);
  for(const day of ripe){expect(forageReady(travel,'fern',day+1)).toBe(true);expect(forageReady(travel,'fern',day+2)).toBe(true);expect(forageReady(travel,'fern',day+3)).toBe(false);travel.picked.fern=day;expect(forageReady(travel,'fern',day+1)).toBe(false);expect(forageReady(travel,'fern',day+2)).toBe(false);}
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

 it('allows a walkable side approach for conversation and a customer-side approach for conversation',async()=>{const {merchantNearby,shopBlocked,shopOrigins}=await import('./village-layout');for(const shop of ['fishShop','nursery'] as const){const origin=shopOrigins[shop];expect(shopBlocked(325,origin+240)).toBe(false);expect(merchantNearby(shop,325,origin+240)).toBe(true);expect(merchantNearby(shop,450,origin+320)).toBe(true);expect(merchantNearby(shop,400,origin+467)).toBe(false);}});

it('keeps the full southern farm boundary closed except for the village gate',()=>{for(const x of [-376,-200,0,140,210,500,900,1176])expect(worldBlocked(x,595)).toBe(true);for(const x of [150,170,190])expect(worldBlocked(x,595)).toBe(false);});

it('notifies once after the experiment result, independently of day count, with save compatibility',async()=>{const {createNoahChapter}=await import('./noah-story');const s=snapshot({x:330,y:260},createClock(32),createGarden());expect(storyEndPending(s.travel)).toBe(false);s.travel.forest={revision:2,stick:true,defeated:['vine','spore-a','spore-b','vine-inner'],picked:{},sample:true,examined:true,sent:true,focus:72};expect(storyEndPending(s.travel)).toBe(false);s.travel.noah={...createNoahChapter(29),letter:true,simonAsked:true,upgraded:true,mixtureMade:true,complete:true};expect(storyEndPending(s.travel)).toBe(true);expect(decodeSnapshot(s)).toEqual(s);s.travel.noah.endSeen=true;expect(storyEndPending(s.travel)).toBe(false);expect(decodeSnapshot(s)).toEqual(s);expect(validSnapshot({...s,travel:{...s.travel,storyEndSeen:'yes'}})).toBe(false);});

it('keeps complete crowns clear of both village walking routes',async()=>{const {villageTrees,forestTrees,woodlandTreeClear,villagePaths}=await import('./village-layout');expect(villageTrees.length+forestTrees.length).toBeGreaterThan(5);for(const t of [...villageTrees,...forestTrees])expect(woodlandTreeClear(t.x,t.y,t.scale??1,t.kind)).toBe(true);for(const path of villagePaths)for(let i=1;i<path.points.length;i++){const a=path.points[i-1],b=path.points[i],n=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/4);for(let j=0;j<=n;j++)expect(woodlandTreeClear(a[0]+(b[0]-a[0])*j/n,a[1]+(b[1]-a[1])*j/n+45)).toBe(false);}});

it('preserves a current save when a restored woodland trunk covers its old position',async()=>{const {forestTrees}=await import('./village-layout');const t=forestTrees[0],s=snapshot({x:t.x,y:t.y},createClock(8),createGarden());s.economy.gold=163;s.clearing.wood=35;const original=structuredClone(s),n=decodeSnapshot(s)!;expect(n).not.toBeNull();expect(worldBlocked(n.player.x,n.player.y)).toBe(false);expect(n.economy).toEqual(s.economy);expect(n.clearing).toEqual(s.clearing);expect(n.clock).toEqual(s.clock);expect(s).toEqual(original);});

it('moves an old saved position out of the new shop without losing money or possessions',()=>{const old=snapshot({x:660,y:1270},createClock(7),createGarden());old.economy.gold=493;old.clearing.wood=35;expect(validSnapshot(old)).toBe(false);const next=decodeSnapshot(old)!;expect(next).not.toBeNull();expect(worldBlocked(next.player.x,next.player.y)).toBe(false);expect(next.economy.gold).toBe(493);expect(next.clearing.wood).toBe(35);expect(old.player).toEqual({x:660,y:1270});});
it('restores dense woodland on both delivery-road shoulders without covering the road or berry bush',async()=>{const {marketRoadsideTrees,woodlandTreeClear,villageLayout}=await import('./village-layout'),{marketRoads}=await import('./market-trial-route');expect(marketRoadsideTrees.filter(t=>t.y<740).length).toBeGreaterThan(10);expect(marketRoadsideTrees.filter(t=>t.y>740).length).toBeGreaterThan(10);for(const t of marketRoadsideTrees)expect(woodlandTreeClear(t.x,t.y,t.scale??1,t.kind)).toBe(true);const bush=villageLayout.bushes.find(b=>b.id==='fern')!;expect(bush).toMatchObject({x:105,y:895});expect(Math.hypot(bush.x-105,bush.y-740)-20).toBeGreaterThan(marketRoads[0].width/2);});
it('keeps modern farm possessions when a restored roadside tree covers a saved player position',async()=>{const {marketRoadsideTrees}=await import('./village-layout'),{enableHomestead}=await import('./homestead-migration');const t=marketRoadsideTrees.find(t=>t.y>695)!,s=enableHomestead(snapshot({x:250,y:194},createClock(8),createGarden()));s.player={x:t.x,y:t.y};s.economy.gold=163;s.clearing.wood=35;const original=structuredClone(s),n=decodeSnapshot(s)!;expect(n).not.toBeNull();expect(worldBlocked(n.player.x,n.player.y)).toBe(false);expect(n.player).not.toEqual(s.player);expect(n.travel.homestead).toEqual(s.travel.homestead);expect(n.economy).toEqual(s.economy);expect(n.clearing).toEqual(s.clearing);expect(s).toEqual(original);});
it('allows walking the full visible delivery road without opening the forest shoulders',()=>{for(let x=-1090;x<0;x+=20)expect(worldBlocked(x,740)).toBe(false);expect(worldBlocked(-1130,740)).toBe(true);expect(worldBlocked(-665,860)).toBe(true);expect(worldBlocked(-885,860)).toBe(true);});
it('uses a straight gate-to-market T junction and a separate curved forest fork',async()=>{const {villagePaths,marketPocketTrees,woodlandTreeClear,forestTrees}=await import('./village-layout'),{farmLayout}=await import('./layout'),{marketRoads}=await import('./market-trial-route');expect(villagePaths[0].points[0]).toEqual(farmLayout.paths[0].points[0]);expect(villagePaths[0].points[1]).toEqual([170,740]);expect(villagePaths[1].points[0]).toEqual([170,930]);expect(marketRoads).toHaveLength(1);expect(marketPocketTrees.length).toBeGreaterThan(0);expect(forestTrees.filter(t=>t.x>=-360&&t.x<=150&&t.y>=800&&t.y<=940).length).toBeGreaterThan(6);for(const t of marketPocketTrees)expect(woodlandTreeClear(t.x,t.y,t.scale??1,t.kind)).toBe(true);});

it('keeps every harvestable bush completely off paths and uncovered by woodland trees',async()=>{
 const {villageLayout,forageBushOffPaths,woodlandTreeCoversBush,villageTrees,forestTrees,worldBlocked}=await import('./village-layout');
 for(const b of villageLayout.bushes){expect(forageBushOffPaths(b),b.id).toBe(true);expect([[b.x-30,b.y],[b.x+30,b.y],[b.x,b.y+25]].some(([x,y])=>!worldBlocked(x,y)),b.id+' reachable').toBe(true);}
 for(const t of [...villageTrees,...forestTrees])expect(woodlandTreeCoversBush(t.x,t.y,t.scale??1)).toBe(false);
 expect(forageBushOffPaths({x:170,y:821})).toBe(false);
});

it('relocates every established tree affected by the through road and grass pull-off',async()=>{const {marketTreeOrigins,relocatedMarketTrees,woodlandTreeClear,forestTrees,forageBushOffPaths,villageLayout}=await import('./village-layout'),{marketTreeManeuverClear}=await import('./market-trial-route');expect(relocatedMarketTrees).toHaveLength(marketTreeOrigins.length);for(const {from,to}of relocatedMarketTrees){expect(to.kind).toBe(from.kind);expect(to.scale).toBe(from.scale);expect(Math.hypot(to.x-from.x,to.y-from.y)).toBeLessThanOrEqual(230);expect(woodlandTreeClear(to.x,to.y,to.scale??1,to.kind)).toBe(true);expect(forestTrees).toContainEqual(to);}for(const b of villageLayout.bushes)expect(forageBushOffPaths(b)).toBe(true);for(const t of forestTrees)expect(marketTreeManeuverClear(t.x,t.y,t.scale??1)).toBe(true);});

it('keeps the gate-to-village walk straight across the road and the loading lawn reachable',async()=>{const {villagePaths,worldBlocked,villageLamps,lampBounds,forestEdgeTrees,forageBushOffPaths,villageLayout}=await import('./village-layout'),{marketRoads}=await import('./market-trial-route'),{boundsOffPaths}=await import('./path-clearance');expect(villagePaths[0].points.at(-1)).toEqual([170,740]);expect(villagePaths[6].points.slice(0,3)).toEqual([[170,740],[170,860],[170,930]]);for(const lamp of villageLamps)expect(boundsOffPaths(lampBounds(lamp),[...villagePaths,...marketRoads])).toBe(true);expect(forestEdgeTrees.length).toBeGreaterThan(5);for(const b of villageLayout.bushes)expect(forageBushOffPaths(b)).toBe(true);for(const p of [[-260,610],[-260,700],[-130,700],[8,620],[58,620]])expect(worldBlocked(p[0],p[1]),p.join(',')).toBe(false);});

it('keeps the visible northern herbs off the whole trail network',async()=>{const {forestPlants}=await import('./forest'),{boundsOffPaths,herbBounds}=await import('./path-clearance'),{villagePaths}=await import('./village-layout'),{marketRoads}=await import('./market-trial-route');for(const h of forestPlants)expect(boundsOffPaths(herbBounds(h),[...villagePaths,...marketRoads]),h.id).toBe(true);});
