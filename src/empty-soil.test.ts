import {expect,it} from 'vitest';
import {createGarden,nextDayGarden,work} from './gardening';
import {createClock} from './clock';
import {snapshot,decodeSnapshot,validSnapshot} from './storage';
import {villageNotice,noticeBoardBlocked} from './village-notice';
import {villageLayout,villageBlocked,relocateVillagePlayer} from './village-layout';
it('keeps Monday soil on Tuesday and Wednesday, removes it on Thursday even if watered',()=>{
 let g=createGarden();g.plots.set('288,432',{crop:null,growth:0,regrowing:false,watered:true});
 for(let day=1;day<=2;day++){g=nextDayGarden(g);expect(g.plots.get('288,432')?.emptyDays).toBe(day);g.plots.get('288,432')!.watered=true;const s=snapshot({x:300,y:420},createClock(day+1),g);expect(decodeSnapshot(s)).toEqual(s);}
 expect(nextDayGarden(g).plots.has('288,432')).toBe(false);
});
it('resets empty days when planted, starts again after harvest, and protects occupied wildflower soil',()=>{
 let g=createGarden();g.plots.set('288,432',{crop:null,growth:0,regrowing:false,watered:false,emptyDays:2});
 expect(work(g,'radish',{x:288,y:432},{x:300,y:420}).ok).toBe(true);expect(g.plots.get('288,432')?.emptyDays).toBeUndefined();g=nextDayGarden(g);expect(g.plots.get('288,432')?.crop).toBe('radish');
 g.plots.get('288,432')!.growth=3;expect(work(g,'harvest',{x:288,y:432},{x:300,y:420}).ok).toBe(true);expect(nextDayGarden(g).plots.get('288,432')?.emptyDays).toBe(1);
 const protectedPlot=new Set(['288,432']);for(let i=0;i<6;i++)g=nextDayGarden(g,undefined,undefined,protectedPlot);expect(g.plots.has('288,432')).toBe(true);
});
it('accepts legacy unaged soil and rejects invalid empty-day metadata',()=>{
 const g=createGarden();g.plots.set('288,432',{crop:null,growth:0,regrowing:false,watered:false});const s=snapshot({x:300,y:420},createClock(10),g);expect(decodeSnapshot(s)).toEqual(s);s.plots[0][1].emptyDays=3;expect(validSnapshot(s)).toBe(false);s.plots[0][1].emptyDays=1;s.plots[0][1].crop='radish';expect(validSnapshot(s)).toBe(false);
});
it('places an upright board at the southwest rim with an unobstructed front approach',()=>{
 const n=villageNotice,s=villageLayout.square;expect(n.x).toBeLessThan(s.x);expect(n.y).toBeGreaterThan(s.y);const edge=((n.x-s.x)/s.rx)**2+((n.y-s.y)/s.ry)**2;expect(edge).toBeGreaterThan(.9);expect(edge).toBeLessThan(1.2);expect(noticeBoardBlocked(n.x,n.y)).toBe(true);expect(villageBlocked(n.x+25,n.y-30)).toBe(false);const old={x:n.x,y:n.y};expect(villageBlocked(...Object.values(relocateVillagePlayer(old)) as [number,number])).toBe(false);
});
