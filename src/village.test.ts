import {describe,it,expect} from 'vitest';
import {move,blocked} from './movement';
import {worldBlocked,villageLayout,shopOrigins,shopAt} from './village-layout';
import {snapshot,decodeSnapshot,validSnapshot} from './storage';
import {createGarden} from './gardening';
import {createClock} from './clock';
import {createTravel,forageReady} from './travel';
describe('Southbound village route',()=>{
 it('opens only the south gate and allows walking both ways across the farm boundary',()=>{
  expect(blocked(170,595)).toBe(true);expect(worldBlocked(170,595)).toBe(false);expect(worldBlocked(400,595)).toBe(true);
  let p={x:170,y:580};for(let i=0;i<15;i++)p=move(p.x,p.y,0,1,.05,1,()=>false,worldBlocked);expect(p.y).toBeGreaterThan(630);
  for(let i=0;i<15;i++)p=move(p.x,p.y,0,-1,.05,1,()=>false,worldBlocked);expect(p.y).toBeCloseTo(580);
 });
 it('keeps buildings solid and all entrances reachable',()=>{
  for(const b of [villageLayout.nursery,villageLayout.fishShop]){expect(worldBlocked(b.x+b.w/2,b.y+30)).toBe(true);expect(worldBlocked(b.door.x,b.door.y+5)).toBe(false);}
  expect(worldBlocked(10,900)).toBe(true);expect(worldBlocked(476,1081)).toBe(true);
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
  expect(decodeSnapshot({...snapshot({x:250,y:242},createClock(),createGarden()),version:14})).toBeNull();
 });
 it('allows collecting again after two days, preserving each bush independently',()=>{
  const travel=createTravel();expect(forageReady(travel,'fern',1)).toBe(true);travel.picked.fern=1;expect(forageReady(travel,'fern',2)).toBe(false);expect(forageReady(travel,'birch',2)).toBe(true);expect(forageReady(travel,'fern',3)).toBe(true);
 });
});
