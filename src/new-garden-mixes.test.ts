import {weatherOnDay} from './weather';
import {it,expect} from 'vitest';
import {IDBFactory} from 'fake-indexeddb';
import {snapshot,validSnapshot,decodeSnapshot,SaveStore} from './storage';
import {createGarden} from './gardening';
import {createClock} from './clock';
import {enableHomestead} from './homestead-migration';
import {LivingGarden} from './living-garden';
import {MAX_GARDEN_LEVEL,normalizeGardenProgress} from './garden-progression';
import {bedMixes,bedKinds,emptyBedSeeds,prepareLivingBed,plantLivingBed,waterLivingBed,harvestLivingPlant,flowerLivingPlant} from './living-bed';
import {farmProductPrice,farmProductAccount} from './farm-products';
import {transferStand} from './farm-market';
import {consumeFood} from './food';
import {createForest} from './forest';
const fresh=()=>{const s=enableHomestead(snapshot({x:300,y:300},createClock(1,()=>.5),createGarden()),true);s.travel.weatherSeed=Array.from({length:100},(_,i)=>i).find(seed=>weatherOnDay(seed,1)==='sunny')!;return s;};
it('awards one point for a whole bed action and each individual plant operation',()=>{
 const g=new LivingGarden(fresh(),true),b=g.addBed();g.seeds={...emptyBedSeeds(),pepper:3,onion:3,basil:3};
 g.accept(b,prepareLivingBed(g.sync(b))!,'prepare');expect(g.xp).toBe(1);
 g.accept(b,plantLivingBed(g.sync(b),'pepperKitchen')!,'plant');expect(g.xp).toBe(2);
 g.accept(b,waterLivingBed(g.sync(b))!,'water');expect(g.xp).toBe(3);expect(waterLivingBed(g.sync(b))).toBeNull();
 for(const p of b.state.plants)p.growth=4;g.accept(b,harvestLivingPlant(g.sync(b),3)!,'harvest',3);expect(g.xp).toBe(4);g.accept(b,flowerLivingPlant(g.sync(b),6)!,'flower',6);expect(g.xp).toBe(5);
});
it('unlocks exactly one new association per thirty successful operations',()=>{
 const g=new LivingGarden(fresh(),true);for(let level=1;level<=MAX_GARDEN_LEVEL;level++){const before=g.availableSeeds();g.credit(Array.from({length:29},(_,i)=>`${level}:work:${i}`));expect(g.level).toBe(level-1);g.credit([`${level}:last`]);expect(g.level).toBe(level);expect(Object.values(bedMixes).filter(m=>m.level===level)).toHaveLength(1);expect(g.availableSeeds().length).toBeGreaterThanOrEqual(before.length);}
 expect([bedMixes.pepperKitchen.level,bedMixes.berryRefuge.level,bedMixes.redGarden.level]).toEqual([3,4,5]);const count=g.writePersistent().travel.homestead!.garden.credited.length;g.credit(Array.from({length:1000},(_,i)=>`beyond:${i}`));expect(g.xp).toBe(150);expect(g.writePersistent().travel.homestead!.garden.credited).toHaveLength(count);
});
it('preserves the old level while dropping hidden surplus, without granting new rewards',()=>{
 const s=fresh(),p=s.travel.homestead!.garden;p.progressionVersion=1;p.points=5000;p.levelFloor=2;p.rewardedLevel=2;const migrated=enableHomestead(s),g=new LivingGarden(migrated,true);expect(g.level).toBe(2);expect(g.progress.current).toBe(0);expect(g.availableSeeds()).not.toContain('pepper');g.credit(Array.from({length:29},(_,i)=>`new:${i}`));expect(g.level).toBe(2);g.credit(['last']);expect(g.level).toBe(3);expect(g.availableSeeds()).toContain('pepper');expect(s.travel.homestead!.garden.points).toBe(5000);
 const future={...migrated.travel.homestead!.garden,progressionVersion:2 as const,contentLevel:2,points:999};normalizeGardenProgress(future);expect(future.points).toBe(60);expect(future.contentLevel).toBe(MAX_GARDEN_LEVEL);
});
it('accepts old stock records without new species and preserves their existing seeds',()=>{
 const s=fresh(),p=s.travel.homestead!.garden;for(const k of ['basil','raspberry','mint','blackberry','marigold'] as const)for(const counts of [p.extraSeeds,p.extraProduce,p.pending,p.mailbox])delete counts[k];p.extraSeeds.thyme=7;expect(validSnapshot(s)).toBe(true);const g=new LivingGarden(decodeSnapshot(s)!,true);expect(g.seeds.thyme).toBe(7);expect(g.seeds.blackberry).toBe(0);expect(validSnapshot(g.writePersistent())).toBe(true);
});
it('orders, receives, plants and persists every new association through the real database',async()=>{
 const s=fresh();s.economy.gold=5000;const g=new LivingGarden(s,true);g.credit(Array.from({length:150},(_,i)=>`unlock:${i}`));
 for(const mix of ['pepperKitchen','berryRefuge','redGarden'] as const){const cart=emptyBedSeeds();for(const k of bedMixes[mix].plants)cart[k]++;expect(g.orderMany(cart)).toBe(true);}g.nextDay('rain');expect(g.collectMail()).toBe(true);for(const [i,mix]of (['pepperKitchen','berryRefuge','redGarden'] as const).entries()){const b=g.addBed({x:-250+i*180,y:200,w:160,h:88});g.accept(b,prepareLivingBed(g.sync(b))!,'prepare');g.accept(b,plantLivingBed(g.sync(b),mix)!,'plant');expect(b.state.plants).toHaveLength(9);}const saved=g.writePersistent();expect(validSnapshot(saved)).toBe(true);
 const factory=new IDBFactory(),store=new SaveStore(factory);await store.load();await store.save(saved);store.close();const read=new SaveStore(factory);expect((await read.load()).data).toEqual(saved);read.close();
});
it('sells and consumes newly harvested vegetables and berries through shared accounts',()=>{
 const s=fresh();s.travel.forest={...createForest(),health:3};for(const kind of ['raspberry','blackberry','pepper','tomato'] as const){s.travel.homestead!.garden.extraProduce[kind]=2;const eaten=consumeFood(s,kind)!;expect(eaten.travel.forest!.health).toBe(4);expect(eaten.travel.homestead!.garden.extraProduce[kind]).toBe(1);const sold=transferStand(s,`garden:${kind}`,1,true)!;expect(sold).not.toBeNull();expect(farmProductAccount(sold,`garden:${kind}`).counts[kind]).toBe(1);}expect(farmProductPrice('garden:raspberry')).toBe(25);expect(farmProductPrice('garden:mint')).toBe(16);expect(farmProductPrice('garden:pepper')).toBe(28);expect(Object.values(bedKinds).every(k=>k.days<=4)).toBe(true);
});
