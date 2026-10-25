import {it,expect} from 'vitest';
import {snapshot,decodeSnapshot,validSnapshot} from './storage';
import {createGarden} from './gardening';
import {createClock} from './clock';
import {legacyBeds} from './legacy-garden-grid';
import {farmLayout} from './layout';
it('enlarges a populated v17 farm once, preserving every plant, wildflower, timer and possession',()=>{
 const old={...snapshot({x:330,y:260},createClock(10),createGarden()),version:17};old.economy.gold=163;old.clearing.wood=35;old.clearing.stone=30;
 old.plots=[];legacyBeds.forEach((b,bi)=>{for(let i=0;i<6;i++)old.plots.push([`${b.x+4+i%3*16},${b.y+2+Math.floor(i/3)*16}`,{crop:bi===0?null:bi===1?'pea':'blueberry',growth:bi===0?0:i%3,watered:i%2===0,regrowing:bi!==0}]);});
 old.travel.research={...old.travel.research,gifted:true,seeds:0,flowers:old.plots.slice(0,6).map(([key])=>{const[x,y]=key.split(',').map(Number);return{x,y,growth:4};}),beeDay:9};old.travel.research.materials.scrap=18;
 const source=structuredClone(old),next=decodeSnapshot(old)!;expect(next).not.toBeNull();expect(next.version).toBe(18);expect(validSnapshot(next)).toBe(true);expect(next.plots).toHaveLength(18);expect(next.plots.map(p=>p[1])).toEqual(old.plots.map(p=>p[1]));expect(next.plots[0][0]).toBe(`${farmLayout.beds[0].x+4},${farmLayout.beds[0].y+2}`);for(const f of next.travel.research.flowers)expect(next.plots.some(([k])=>k===`${f.x},${f.y}`)).toBe(true);expect(next.economy).toEqual(old.economy);expect(next.clearing).toEqual(old.clearing);expect(next.seeds).toEqual(old.seeds);expect(next.clock).toEqual(old.clock);expect(next.travel.research.materials).toEqual(old.travel.research.materials);expect(old).toEqual(source);expect(decodeSnapshot(next)).toEqual(next);
});
it('relocates adjacent old meadow cells without merging or dropping them',()=>{const old={...snapshot({x:330,y:260},createClock(),createGarden()),version:17};old.plots=Array.from({length:6},(_,i)=>[`${272+i%3*16},${400+Math.floor(i/3)*16}`,{crop:'radish',growth:i%3,watered:true,regrowing:false}] as const) as typeof old.plots;const next=decodeSnapshot(old)!;expect(next).not.toBeNull();expect(next.plots).toHaveLength(6);expect(new Set(next.plots.map(p=>p[0])).size).toBe(6);expect(next.plots.map(p=>p[1])).toEqual(old.plots.map(p=>p[1]));});
