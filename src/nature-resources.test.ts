import {it,expect} from 'vitest';
import {natureSites,natureReady,validGathered} from './nature-resources';
import {createForest} from './forest';
import {weatherOnDay} from './weather';
import {debris} from './cleanup';
import {repairNeeds} from './research';
it('renews hand-collected stones after three days and branches after subsequent rain or cloudy-day wind',()=>{const stone=natureSites.find(s=>s.kind==='stone')!,wood=natureSites.find(s=>s.kind==='wood')!,f={...createForest(),gathered:{[stone.id]:1,[wood.id]:1}};expect(natureReady(f,stone,3,0)).toBe(false);expect(natureReady(f,stone,4,0)).toBe(true);const seed=Array.from({length:100},(_,i)=>i).find(seed=>[2,3,4].every(d=>weatherOnDay(seed,d)==='sunny'))!;expect(natureReady(f,wood,4,seed)).toBe(false);expect(natureReady(f,wood,16,seed)).toBe(true);expect(validGathered(f.gathered,1)).toBe(true);expect(validGathered({unknown:1},1)).toBe(false);expect(validGathered({[wood.id]:2},1)).toBe(false);});
it('leaves enough newly introduced permanent restoration material for the workshop and a chest even in previously cleared saves',()=>{const projects=debris.filter(d=>d.id.startsWith('restoration-')),wood=projects.filter(d=>d.kind==='branch').length,stone=projects.filter(d=>d.kind==='rock').length;expect(wood*6).toBeGreaterThanOrEqual(repairNeeds.wood+20);expect(wood*2).toBeGreaterThanOrEqual(repairNeeds.scrap+5);expect(stone*6).toBeGreaterThanOrEqual(repairNeeds.stone);});

it('keeps every nature pickup on reachable ground, outside permanent forest barriers',async()=>{const {worldBlocked}=await import('./village-layout');for(const site of natureSites)expect(worldBlocked(site.x,site.y),site.id).toBe(false);});
