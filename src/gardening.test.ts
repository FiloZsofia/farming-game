import {describe,it,expect} from 'vitest';
import {createGarden,targetTile,tileKey,work,cultivable,nextDayGarden,isRipe,growthRules,type Crop} from './gardening';
const tile=targetTile(360,286),player={x:337,y:282};
describe('gardening actions',()=>{
 it('starts with four of the original crops and no fruit planting material',()=>expect(createGarden().seeds).toEqual({radish:4,potato:4,pea:4,strawberry:0,honeyberry:0,blueberry:0,carrot:0,lettuce:0,onion:0}));
 it('supports till, sow and water in the same plot',()=>{
  const g=createGarden();expect(work(g,'hoe',tile,player).ok).toBe(true);expect(work(g,'radish',tile,player).ok).toBe(true);expect(work(g,'water',tile,player).ok).toBe(true);
  expect(g.plots.get(tileKey(tile))).toEqual({crop:'radish',watered:true,growth:0,regrowing:false});expect(g.seeds.radish).toBe(3);
 });
 it('does not consume seeds when soil is untilled, occupied or out of reach',()=>{
  const g=createGarden();expect(work(g,'pea',tile,player).ok).toBe(false);
  expect(work(g,'hoe',tile,{x:250,y:242}).ok).toBe(false);
  work(g,'hoe',tile,player);work(g,'potato',tile,player);expect(work(g,'pea',tile,player).ok).toBe(false);
  expect(g.seeds).toEqual({radish:4,potato:3,pea:4,strawberry:0,honeyberry:0,blueberry:0,carrot:0,lettuce:0,onion:0});
 });
 it('does not erase crops or moisture when hoeing or watering twice',()=>{
  const g=createGarden();work(g,'hoe',tile,player);work(g,'water',tile,player);work(g,'pea',tile,player);
  expect(work(g,'hoe',tile,player).ok).toBe(false);expect(work(g,'water',tile,player).ok).toBe(false);
  expect(g.plots.get(tileKey(tile))).toEqual({crop:'pea',watered:true,growth:0,regrowing:false});
 });
 it('rejects a fifth seed without creating a crop',()=>{
  const g=createGarden();for(let i=0;i<5;i++){const t={x:341+(i%3)*24,y:272+Math.floor(i/3)*24};const p={x:t.x,y:t.y};work(g,'hoe',t,p);const result=work(g,'radish',t,p);expect(result.ok).toBe(i<4);}
  expect(g.seeds.radish).toBe(0);expect([...g.plots.values()].filter(p=>p.crop)).toHaveLength(4);
 });
 it('protects paths, pond, house and bed frames',()=>{
  for(const [x,y] of [[250,260],[638,464],[225,180],[337,270]])expect(cultivable(targetTile(x,y))).toBe(false);
 });
 it('keeps adjacent bed cells distinct and allows meadow soil',()=>{
  expect(tileKey(targetTile(360,286))).not.toBe(tileKey(targetTile(376,286)));
  expect(cultivable(targetTile(290,430))).toBe(true);
 });
});

describe('growth and harvest',()=>{
 const planted=(crop:Crop)=>{const g=createGarden();work(g,'hoe',tile,player);work(g,crop,tile,player);return g;};
 it('advances only on watered days and keeps dry crops alive',()=>{
  let g=planted('radish');g=nextDayGarden(g);expect(g.plots.get(tileKey(tile))?.growth).toBe(0);
  work(g,'water',tile,player);g=nextDayGarden(g);expect(g.plots.get(tileKey(tile))).toMatchObject({crop:'radish',growth:1,watered:false});
  g=nextDayGarden(g);expect(g.plots.get(tileKey(tile))?.growth).toBe(1);
 });
 it.each([['radish',3],['potato',5],['pea',6]] as const)('ripens %s after %i watered days', (crop,days)=>{
  let g=planted(crop);
  for(let i=0;i<days;i++){expect(isRipe(g.plots.get(tileKey(tile))!)).toBe(false);work(g,'water',tile,player);g=nextDayGarden(g);}
  expect(isRipe(g.plots.get(tileKey(tile))!)).toBe(true);
  expect(growthRules[crop]).toBe(days);
 });
 it('harvests a root crop exactly once and leaves reusable soil',()=>{
  let g=planted('radish');for(let i=0;i<3;i++){work(g,'water',tile,player);g=nextDayGarden(g);}
  expect(work(g,'harvest',tile,player).ok).toBe(true);expect(work(g,'harvest',tile,player).ok).toBe(false);
  expect(g.produce.radish).toBe(1);expect(g.plots.get(tileKey(tile))).toMatchObject({crop:null,growth:0});expect(work(g,'potato',tile,player).ok).toBe(true);
 });
 it('keeps peas planted and regrows in three watered days without spending seeds',()=>{
  let g=planted('pea');for(let i=0;i<6;i++){work(g,'water',tile,player);g=nextDayGarden(g);}
  work(g,'harvest',tile,player);expect(g.produce.pea).toBe(1);expect(g.plots.get(tileKey(tile))).toMatchObject({crop:'pea',regrowing:true,growth:0});
  for(let i=0;i<3;i++){expect(work(g,'harvest',tile,player).ok).toBe(false);work(g,'water',tile,player);g=nextDayGarden(g);}
  expect(work(g,'harvest',tile,player).ok).toBe(true);expect(g.produce.pea).toBe(2);expect(g.seeds.pea).toBe(3);
 });
 it('does not mutate the original garden before the new morning is saved',()=>{
  const g=planted('potato');work(g,'water',tile,player);const next=nextDayGarden(g);expect(g.plots.get(tileKey(tile))?.growth).toBe(0);expect(g.plots.get(tileKey(tile))?.watered).toBe(true);expect(next.plots.get(tileKey(tile))?.growth).toBe(1);next.produce.pea=2;expect(g.produce.pea).toBe(0);
 });
 it('cannot harvest immature or remote plants and does not rot a ripe plant',()=>{
  let g=planted('radish');expect(work(g,'harvest',tile,player).ok).toBe(false);
  for(let i=0;i<3;i++){work(g,'water',tile,player);g=nextDayGarden(g);}
  for(let i=0;i<10;i++)g=nextDayGarden(g);
  expect(isRipe(g.plots.get(tileKey(tile))!)).toBe(true);expect(work(g,'harvest',tile,{x:250,y:242}).ok).toBe(false);expect(g.produce.radish).toBe(0);
 });
});
describe('undo empty tilled ground',()=>{
 it('restores empty soil, including watered empty soil, without returning seeds',()=>{
  const g=createGarden(),tile={x:353,y:280},player={x:337,y:282};const seeds={...g.seeds};
  work(g,'hoe',tile,player);work(g,'water',tile,player);expect(work(g,'hoe',tile,player).ok).toBe(true);expect(g.plots.size).toBe(0);expect(g.seeds).toEqual(seeds);
  expect(work(g,'hoe',tile,player).ok).toBe(true);expect(g.plots.get('353,280')).toEqual({crop:null,watered:false,growth:0,regrowing:false});
 });
});
describe('unlocked spring berries',()=>{
 for(const [crop,days]of [['strawberry',4],['honeyberry',5],['blueberry',6]] as const)it(`${crop} first harvest and two-day repeat`,()=>{
  let garden=createGarden();garden.seeds[crop]=1;work(garden,'hoe',tile,player);expect(work(garden,crop,tile,player).ok).toBe(true);
  for(let day=0;day<days;day++){expect(isRipe(garden.plots.get(tileKey(tile))!)).toBe(false);work(garden,'water',tile,player);garden=nextDayGarden(garden);}
  expect(work(garden,'harvest',tile,player).ok).toBe(true);expect(garden.produce[crop]).toBe(1);expect(garden.plots.get(tileKey(tile))!.regrowing).toBe(true);expect(garden.seeds[crop]).toBe(0);
  for(let day=0;day<2;day++){work(garden,'water',tile,player);garden=nextDayGarden(garden);}expect(work(garden,'harvest',tile,player).ok).toBe(true);expect(garden.produce[crop]).toBe(2);
 });
});

describe('level-three single-harvest vegetables',()=>{
 for(const [crop,days]of [['carrot',4],['lettuce',2],['onion',5]] as const)it(`${crop} needs ${days} watered days and must be replanted`,()=>{
  let garden=createGarden();const tile={x:353,y:280},player={x:353,y:280};garden.seeds[crop]=4;
  expect(work(garden,'hoe',tile,player).ok).toBe(true);expect(work(garden,crop,tile,player).ok).toBe(true);expect(garden.seeds[crop]).toBe(3);
  for(let day=0;day<days;day++){expect(isRipe(garden.plots.get('353,280')!)).toBe(false);expect(work(garden,'water',tile,player).ok).toBe(true);garden=nextDayGarden(garden);}
  expect(isRipe(garden.plots.get('353,280')!)).toBe(true);expect(work(garden,'harvest',tile,player).ok).toBe(true);expect(garden.produce[crop]).toBe(1);expect(garden.plots.get('353,280')!.crop).toBeNull();expect(work(garden,'harvest',tile,player).ok).toBe(false);
 });
});
