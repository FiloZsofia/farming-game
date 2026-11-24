import {describe,it,expect} from 'vitest';
import {snapshot,decodeSnapshot,validSnapshot} from './storage';
import {createClock} from './clock';
import {createGarden} from './gardening';
import {enableHomestead} from './homestead-migration';
import {debris} from './cleanup';
import {feedSackPosition,orderFeed,deliverFeed,collectFeed,feedCareHelpPending,createLivestock,animalItems,fixtureKinds,penMissing,buyAnimalItem,orderHen,deliverHen,advanceLivestock,tendPen,packAnimalItem,validLivestock,renameHen,packEmptyPaddock} from './livestock';
import {farmAnimalWalk,placeCoop,placePaddock,placeAnimalFixture,penWalkRoute,gatePoint,animalApproach,canDrawPaddock,paddockPlacementIssue} from './livestock-geometry';
import {farmProductPrice,farmProductAccount} from './farm-products';
import {transferStand} from './farm-market';
import {backpackStacks,inventoryCounts,canCarryChange} from './chests';
const polygon=[{x:-320,y:-280},{x:-20,y:-280},{x:-20,y:-80},{x:-320,y:-80}];
function fresh(){const s=enableHomestead(snapshot({x:-170,y:-50},createClock(1,()=>.5),createGarden()),true);s.economy.gold=10000;s.travel.livestock=createLivestock();for(const d of debris)s.clearing.removed[d.id]=1;return s;}
function home(){let s=fresh();for(const item of animalItems)s=buyAnimalItem(s,item)!;s=placeCoop(s,{x:-200,y:-190})!;expect(s).not.toBeNull();s=placePaddock(s,1,polygon,2)!;expect(s).not.toBeNull();const positions={feeder:{x:-280,y:-190},drinker:{x:-70,y:-190},dustBath:{x:-270,y:-125},perch:{x:-195,y:-125},shade:{x:-75,y:-115}};for(const kind of fixtureKinds){s=placeAnimalFixture(s,1,kind,positions[kind])!;expect(s,kind).not.toBeNull();}return s;}
function arrived(){let s=orderHen(home(),1,'cream')!;s.clock=createClock(2,()=>.5);s.travel.livestock=advanceLivestock(s.travel.livestock!,2);return deliverHen(s,2)!;}
describe('chicken home, orders and deliveries',()=>{
 it('keeps old saves compatible without adding or removing inventory',()=>{const s=fresh();delete s.travel.livestock;expect(validSnapshot(s)).toBe(true);expect(decodeSnapshot(s)?.travel.livestock).toBeUndefined();});
 it('counts purchased furniture as inventory, never as installed equipment',()=>{let s=fresh();for(const item of animalItems)s=buyAnimalItem(s,item)!;s=placeCoop(s,{x:-200,y:-190})!;expect(orderHen(s,1,'cream')).toBeNull();expect(inventoryCounts(s)['animal:feeder']).toBe(1);expect(s.travel.livestock?.packed.feeder).toBe(1);});
 it('requires all five reachable fixtures and an enclosed paddock',()=>{const s=home();expect(penMissing(s.travel.livestock!.pens[0])).toEqual([]);for(const kind of fixtureKinds){const n=structuredClone(s);delete n.travel.livestock!.pens[0].fixtures[kind];expect(orderHen(n,1,'cream')).toBeNull();}const n=structuredClone(s);n.travel.livestock!.pens[0].boundary=[];expect(orderHen(n,1,'cream')).toBeNull();});
 it('charges once, reserves capacity, and schedules the next day',()=>{let s=home();const gold=s.economy.gold;s=orderHen(s,1,'speckled')!;expect(s.economy.gold).toBe(gold-95);expect(s.travel.livestock!.orders[0].dueDay).toBe(2);expect(deliverHen(s,2)).toBeNull();for(let i=0;i<3;i++)s=orderHen(s,1,'cream')!;expect(orderHen(s,1,'chestnut')).toBeNull();});
 it('delivers once across save reloads without charging again',()=>{const s=arrived(),gold=s.economy.gold;expect(s.travel.livestock!.hens).toHaveLength(1);expect(s.travel.livestock!.orders).toHaveLength(0);expect(deliverHen(s,2)).toBeNull();const saved=decodeSnapshot(s)!;expect(saved).not.toBeNull();expect(saved.travel.livestock!.hens[0].variety).toBe('cream');expect(saved.economy.gold).toBe(gold);});
 it('protects inhabited and reserved homes from packing',()=>{expect(packAnimalItem(orderHen(home(),1,'cream')!,1,'feeder')).toBeNull();expect(packAnimalItem(arrived(),1,'shade')).toBeNull();});
 it('supports safe names while preserving the animal identity',()=>{const s=renameHen(arrived(),2,'  Pöttyös  ');expect(s!.travel.livestock!.hens[0].name).toBe('Pöttyös');expect(renameHen(arrived(),2,'')).toBeNull();});
 it('rejects malformed saves, duplicate IDs and foreign pen references',()=>{const s=arrived().travel.livestock!;expect(validLivestock(s,2)).toBe(true);const n=structuredClone(s);n.hens[0].penId=99;expect(validLivestock(n,2)).toBe(false);n.hens[0].penId=1;n.hens.push({...n.hens[0]});expect(validLivestock(n,2)).toBe(false);});
});
describe('care, eggs and trade',()=>{
 it('produces after two cared days and consumes one serving per hen per day',()=>{let s=buyAnimalItem(arrived(),'feed')!;s=tendPen(s,1,'feed')!;for(let day=2;day<=3;day++){s.clock=createClock(day,()=>.5);s=tendPen(s,1,'water')!;s.travel.livestock=advanceLivestock(s.travel.livestock!,day+1);}expect(s.travel.livestock!.pens[0].eggs).toBe(1);expect(s.travel.livestock!.pens[0].feed).toBe(8);});
 it('pauses production without killing animals when food or water is missing',()=>{const s=arrived();const next=advanceLivestock(s.travel.livestock!,8);expect(next.hens).toHaveLength(1);expect(next.pens[0].eggs).toBe(0);expect(next.lastDay).toBe(8);expect(advanceLivestock(next,8)).toEqual(next);});
 it('retains the last cleaning day so dirt becomes visible after three days',()=>{const s=arrived();s.clock=createClock(5,()=>.5);expect(s.clock.day-s.travel.livestock!.pens[0].cleanedDay).toBe(4);const cleaned=tendPen(s,1,'clean')!;expect(cleaned.travel.livestock!.pens[0].cleanedDay).toBe(5);expect(tendPen(cleaned,1,'clean')).toBeNull();});
 it('collects into inventory once and sells real hen eggs through Mara at the agreed price',()=>{let s=arrived();s.travel.livestock!.pens[0].eggs=2;s=tendPen(s,1,'eggs')!;expect(tendPen(s,1,'eggs')).toBeNull();expect(inventoryCounts(s)['animalEgg:egg']).toBe(2);expect(farmProductPrice('henEgg')).toBe(12);const next=transferStand(s,'henEgg',2,true)!;expect(next.travel.livestock!.eggs).toBe(0);expect(next.travel.homestead!.stand.crates[0]).toEqual({product:'henEgg',count:2});expect(farmProductAccount(next,'henEgg').counts.eggs).toBe(0);});
 it('respects the existing backpack limit for shop purchases',()=>{const s=fresh();for(const key of Object.keys(s.seeds))s.seeds[key as keyof typeof s.seeds]=0;s.seeds.carrot=99*16;const next=buyAnimalItem(s,'coop')!;expect(canCarryChange(s,next)).toBe(false);});
});
describe('custom paddock geometry',()=>{
 it('keeps a route from the selected gate to all equipment',()=>{const s=home(),pen=s.travel.livestock!.pens[0];for(const [kind,p]of Object.entries(pen.fixtures))expect(penWalkRoute(pen,gatePoint(pen)!,animalApproach(kind as typeof fixtureKinds[number],p!))).not.toBeNull();});
 it('rejects roads, buildings, water and self-crossing fences',()=>{const s=home(),pen=s.travel.livestock!.pens[0];expect(canDrawPaddock(s,pen,[{x:-320,y:-280},{x:-20,y:-80},{x:-20,y:-280},{x:-320,y:-80}])).toBe(false);expect(placeCoop(s,{x:239,y:180})).toBeNull();expect(placeCoop(s,{x:638,y:464})).toBeNull();});
 it('does not consume furniture when placement fails',()=>{const s=home();s.travel.livestock!.packed.feeder=1;const before=structuredClone(s);expect(placeAnimalFixture(s,1,'feeder',{x:100,y:100})).toBeNull();expect(s).toEqual(before);});
});

describe('living paddock safeguards',()=>{
 it('allows expansion without removing the old living space',()=>{const s=arrived();const wider=[{x:-320,y:-280},{x:-10,y:-280},{x:-10,y:-70},{x:-320,y:-70}];const n=placePaddock(s,1,wider,2);expect(n).not.toBeNull();expect(n!.travel.livestock!.hens).toEqual(s.travel.livestock!.hens);expect(placePaddock(s,1,[{x:-300,y:-280},{x:-20,y:-280},{x:-20,y:-80},{x:-300,y:-80}],2)).toBeNull();});
 it('rejects a fence which folds back and touches itself',()=>{const s=home(),pen=s.travel.livestock!.pens[0];expect(canDrawPaddock(s,pen,[{x:-320,y:-280},{x:-20,y:-280},{x:-20,y:-80},{x:-200,y:-80},{x:-200,y:-280},{x:-320,y:-80}])).toBe(false);});
 it('pauses egg production in a dirty coop despite food and fresh water',()=>{let s=buyAnimalItem(arrived(),'feed')!;s=tendPen(s,1,'feed')!;const state=s.travel.livestock!;state.lastDay=4;state.pens[0].wateredDay=4;state.hens[0].careDays=1;const n=advanceLivestock(state,5);expect(n.pens[0].eggs).toBe(0);expect(n.hens[0].careDays).toBe(1);s.clock=createClock(5,()=>.5);s.travel.livestock=n;s=tendPen(s,1,'clean')!;s=tendPen(s,1,'water')!;expect(advanceLivestock(s.travel.livestock!,6).pens[0].eggs).toBe(1);});
 it('keeps a delayed order and its reserved place through save reload',()=>{const s=orderHen(home(),1,'chestnut')!;s.clock=createClock(6,()=>.5);const reloaded=decodeSnapshot(s)!;expect(reloaded).not.toBeNull();const delivered=deliverHen(reloaded,2)!;expect(delivered.travel.livestock!.hens[0].arrivedDay).toBe(6);expect(delivered.economy.gold).toBe(s.economy.gold);});
 it('rejects a save whose reserved animal no longer has a furnished home',()=>{const s=orderHen(home(),1,'cream')!;delete s.travel.livestock!.pens[0].fixtures.shade;expect(validSnapshot(s)).toBe(false);});
});


describe('paddock placement explanations',()=>{
 it('explains why drawing the front fence in front of the coop does not enclose it',()=>{const s=home();s.travel.livestock!.pens[0].boundary=[];s.travel.livestock!.packed.paddock=1;const poly=[{x:-320,y:-180},{x:-20,y:-180},{x:-20,y:20},{x:-320,y:20}];expect(paddockPlacementIssue(s,1,poly,2)).toContain('Az ól kívül maradna');expect(placePaddock(s,1,poly,2)).toBeNull();});
 it('allows short sections beside a coop without imposing a corner spacing limit',()=>{const s=home();expect(paddockPlacementIssue(s,1,[{x:-320,y:-280},{x:-310,y:-280},{x:-20,y:-280},{x:-20,y:-80},{x:-320,y:-80}],2)).toBeNull();});
 it('identifies a crossing fence before reporting its collapsed area',()=>{const s=home();expect(paddockPlacementIssue(s,1,[{x:-320,y:-280},{x:-20,y:-80},{x:-20,y:-280},{x:-320,y:-80}],2)).toContain('keresztezi');});
 it('uses the same result for valid construction and its feedback',()=>{const s=home();expect(paddockPlacementIssue(s,1,polygon,2)).toBeNull();expect(placePaddock(s,1,polygon,2)).not.toBeNull();});
});


describe('coop wall as a paddock boundary',()=>{
 const attached=[{x:-236,y:-186},{x:-320,y:-186},{x:-320,y:14},{x:-20,y:14},{x:-20,y:-186},{x:-164,y:-186}];
 function plot(){let s=fresh();s=buyAnimalItem(s,'coop')!;s=buyAnimalItem(s,'paddock')!;return placeCoop(s,{x:-200,y:-190})!;}
 it('lets the coop close the back of the living space without fencing across its door',()=>{const s=plot(),n=placePaddock(s,1,attached,2);expect(n).not.toBeNull();expect(n!.travel.livestock!.pens[0].coopWall).toBe(5);expect(validSnapshot(n)).toBe(true);expect(decodeSnapshot(n)?.travel.livestock!.pens[0].coopWall).toBe(5);});
 it('clears the wall marker when an empty attached enclosure is packed',()=>{const s=placePaddock(plot(),1,attached,2)!;const n=packEmptyPaddock(s,1)!;expect(n.travel.livestock!.pens[0].coopWall).toBeUndefined();expect(validSnapshot(n)).toBe(true);});
 it('does not allow a gate through the coop wall',()=>{expect(paddockPlacementIssue(plot(),1,attached,5)).toContain('szabad kerítésszakaszra');});
 it('rejects an imported wall marker on another edge',()=>{const s=placePaddock(plot(),1,attached,2)!;s.travel.livestock!.pens[0].coopWall=2;expect(validSnapshot(s)).toBe(false);});
});

describe('Mara follows farm paths',()=>{
 it('prefers a player-built detour over cutting across the grass',()=>{const s=fresh();s.travel.estate.trees=[];s.travel.homestead!.garden.beds=[];const points=[];for(let y=-300;y<=-216;y+=12)points.push({x:-336,y});for(let x=-324;x<=-96;x+=12)points.push({x,y:-216});for(let y=-228;y>=-300;y-=12)points.push({x:-96,y});s.travel.homestead!.garden.paths=points.map((p,i)=>({...p,id:i+1,material:'wood' as const,angle:0,previous:i||null}));const route=farmAnimalWalk(s,points[0],points.at(-1)!,()=>false);expect(route).not.toBeNull();expect(route!.some(p=>p.y>=-228)).toBe(true);});
 it('uses the original farm entrance path',()=>{const s=fresh();const route=farmAnimalWalk(s,{x:170,y:620},{x:249,y:328},()=>false);expect(route).not.toBeNull();expect(route!.some(p=>Math.hypot(p.x-168,p.y-500)<24)).toBe(true);});
});

describe('feed care help and grace days',()=>{
 it('allows one day to replenish food and supports topping up before empty',()=>{let s=buyAnimalItem(arrived(),'feed')!;s=tendPen(s,1,'feed')!;s=buyAnimalItem(s,'feed')!;s.travel.livestock!.pens[0].feed=2;const topped=tendPen(s,1,'feed')!;expect(topped.travel.livestock!.pens[0].feed).toBe(12);expect(topped.travel.livestock!.feed).toBe(0);const state=arrived().travel.livestock!;state.pens[0].feed=1;delete state.pens[0].emptyFeedDay;state.pens[0].cleanedDay=2;state.pens[0].wateredDay=2;const first=advanceLivestock(state,3);expect(first.pens[0].emptyFeedDay).toBe(3);expect(first.hens[0].careDays).toBe(1);const second=advanceLivestock(first,4);expect(second.hens[0].careDays).toBe(1);expect(second.pens[0].eggs).toBe(0);expect(feedCareHelpPending(first)).toBe(true);first.feedHelpSeen=true;expect(feedCareHelpPending(first)).toBe(false);expect(feedCareHelpPending(undefined)).toBe(false);});
 it('pauses on the third missed watering day and resets on fresh water',()=>{let s=buyAnimalItem(arrived(),'feed')!;s=tendPen(s,1,'feed')!;let state=s.travel.livestock!;for(let day=3;day<=5;day++){state.pens[0].cleanedDay=day-1;state=advanceLivestock(state,day);expect(state.pens[0].dryDays).toBe(day-2);}expect(state.pens[0].eggs).toBe(1);expect(state.hens[0].careDays).toBe(0);s.clock=createClock(5,()=>.5);s.travel.livestock=state;s=tendPen(s,1,'water')!;expect(s.travel.livestock!.pens[0].dryDays).toBe(0);s.travel.livestock!.pens[0].cleanedDay=5;expect(advanceLivestock(s.travel.livestock!,6).hens[0].careDays).toBe(1);});
});
describe('Mara feed orders',()=>{
 it('charges at ordering, delivers next day once, and keeps sacks through save reload',()=>{let s=fresh();const gold=s.economy.gold;s=orderFeed(s)!;const order=s.travel.livestock!.feedOrders![0],p={x:82,y:504};expect(s.economy.gold).toBe(gold-20);expect(s.travel.livestock!.feed).toBe(0);expect(deliverFeed(s,[order.id],p)).toBeNull();s.clock=createClock(2,()=>.5);s=deliverFeed(s,[order.id],p)!;expect(s.economy.gold).toBe(gold-20);expect(deliverFeed(s,[order.id],p)).toBeNull();s=decodeSnapshot(s)!;expect(s).not.toBeNull();expect(s.travel.livestock!.feedOrders![0].drop).toEqual(p);s=collectFeed(s,p)!;expect(s.travel.livestock!.feed).toBe(10);expect(s.travel.livestock!.feedOrders).toEqual([]);expect(collectFeed(s,p)).toBeNull();});
 it('keeps a paid parcel on the ground when the inventory is full',()=>{let s=orderFeed(fresh())!;s.clock=createClock(2,()=>.5);s=deliverFeed(s,[s.travel.livestock!.feedOrders![0].id],{x:82,y:504})!;for(const k of Object.keys(s.seeds))s.seeds[k as keyof typeof s.seeds]=0;s.seeds.carrot=99*16;const candidate=collectFeed(s)!;expect(canCarryChange(s,candidate)).toBe(false);expect(s.travel.livestock!.feedOrders).toHaveLength(1);expect(s.travel.livestock!.feed).toBe(0);});
 it('rejects invalid parcel data and preserves old saves without optional fields',()=>{const s=fresh();expect(decodeSnapshot(s)).not.toBeNull();const n=orderFeed(s)!;n.travel.livestock!.feedOrders![0].count=-10;expect(decodeSnapshot(n)).toBeNull();n.travel.livestock!.feedOrders![0].count=10;n.travel.livestock!.feedOrders![0].id=0;expect(decodeSnapshot(n)).toBeNull();});
});

describe('separate feed sacks share the carried feed stack',()=>{
 it('shows legacy coincident sacks separately and picks up only the selected package',()=>{let s=orderFeed(orderFeed(fresh())!)!;s.clock=createClock(2,()=>.5);const ids=s.travel.livestock!.feedOrders!.map(o=>o.id);s=deliverFeed(s,ids,{x:82,y:504})!;const orders=s.travel.livestock!.feedOrders!;expect(feedSackPosition(orders[0],orders)).not.toEqual(feedSackPosition(orders[1],orders));s=collectFeed(s,undefined,ids[0])!;expect(s.travel.livestock!.feed).toBe(10);expect(s.travel.livestock!.feedOrders).toHaveLength(1);expect(s.travel.livestock!.feedOrders![0].drop).toEqual(feedSackPosition(orders[1],orders));s=collectFeed(s,undefined,ids[1])!;expect(s.travel.livestock!.feed).toBe(20);expect(backpackStacks(s).filter(p=>p.key==='animalFeed:feed')).toEqual([{key:'animalFeed:feed',count:20}]);});
});
