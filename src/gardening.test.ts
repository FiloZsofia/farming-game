import {describe,it,expect} from 'vitest';
import {createGarden,targetTile,tileKey,work,cultivable} from './gardening';
const tile=targetTile(360,286),player={x:337,y:282};
describe('gardening actions',()=>{
 it('starts with four of every crop',()=>expect(createGarden().seeds).toEqual({radish:4,potato:4,pea:4}));
 it('supports till, sow and water in the same plot',()=>{
  const g=createGarden();expect(work(g,'hoe',tile,player).ok).toBe(true);expect(work(g,'radish',tile,player).ok).toBe(true);expect(work(g,'water',tile,player).ok).toBe(true);
  expect(g.plots.get(tileKey(tile))).toEqual({crop:'radish',watered:true});expect(g.seeds.radish).toBe(3);
 });
 it('does not consume seeds when soil is untilled, occupied or out of reach',()=>{
  const g=createGarden();expect(work(g,'pea',tile,player).ok).toBe(false);
  expect(work(g,'hoe',tile,{x:250,y:242}).ok).toBe(false);
  work(g,'hoe',tile,player);work(g,'potato',tile,player);expect(work(g,'pea',tile,player).ok).toBe(false);
  expect(g.seeds).toEqual({radish:4,potato:3,pea:4});
 });
 it('does not erase crops or moisture when hoeing or watering twice',()=>{
  const g=createGarden();work(g,'hoe',tile,player);work(g,'water',tile,player);work(g,'pea',tile,player);
  expect(work(g,'hoe',tile,player).ok).toBe(false);expect(work(g,'water',tile,player).ok).toBe(false);
  expect(g.plots.get(tileKey(tile))).toEqual({crop:'pea',watered:true});
 });
 it('rejects a fifth seed without creating a crop',()=>{
  const g=createGarden();for(let i=0;i<5;i++){const t={x:353+(i%3)*16,y:280+Math.floor(i/3)*16};const p={x:t.x,y:t.y};work(g,'hoe',t,p);const result=work(g,'radish',t,p);expect(result.ok).toBe(i<4);}
  expect(g.seeds.radish).toBe(0);expect([...g.plots.values()].filter(p=>p.crop)).toHaveLength(4);
 });
 it('protects paths, pond, house and bed frames',()=>{
  for(const [x,y] of [[250,260],[638,464],[225,180],[349,278]])expect(cultivable(targetTile(x,y))).toBe(false);
 });
 it('keeps adjacent bed cells distinct and allows meadow soil',()=>{
  expect(tileKey(targetTile(360,286))).not.toBe(tileKey(targetTile(376,286)));
  expect(cultivable(targetTile(290,430))).toBe(true);
 });
});
