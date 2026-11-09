import {expect,it} from 'vitest';
import {maraVillageReturn,maraVillageParking,maraVillageWalk,greenhouse,ornamentalShrubs,nurserySolid} from './nursery-grounds';
import {marketExitX,marketTruckContains} from './market-trial-route';
import {decodeSnapshot,snapshot} from './storage';
import {createClock} from './clock';
import {createGarden} from './gardening';
import {worldBlocked} from './village-layout';
it('returns from outside the eastern boundary and parks clear of glasshouse and shrubs',()=>{
 expect(maraVillageReturn(0).x-126).toBeGreaterThan(1200);expect(maraVillageReturn(0).x).toBe(marketExitX);expect(maraVillageReturn(1)).toEqual(maraVillageParking);
 for(let i=0;i<=100;i++){const p=maraVillageReturn(i/100);expect(p.heading).toBeGreaterThanOrEqual(Math.PI/2);expect(p.heading).toBeLessThanOrEqual(Math.PI);for(let x=greenhouse.x;x<=greenhouse.x+greenhouse.w;x+=5)for(let y=greenhouse.y;y<=greenhouse.y+greenhouse.h;y+=5)expect(marketTruckContains(p,{x,y},3)).toBe(false);for(const shrub of ornamentalShrubs)expect(marketTruckContains(p,shrub,17)).toBe(false);}
});
it('lets Mara walk around her parked truck to the decorative bushes without crossing solids',()=>{
 for(let i=1;i<maraVillageWalk.length;i++){const a=maraVillageWalk[i-1],b=maraVillageWalk[i];for(let j=0;j<=30;j++){const p={x:a.x+(b.x-a.x)*j/30,y:a.y+(b.y-a.y)*j/30};expect(worldBlocked(p.x,p.y),JSON.stringify(p)).toBe(false);expect(marketTruckContains(maraVillageParking,p),JSON.stringify(p)).toBe(false);}}
});
it('recovers saved positions newly covered by a greenhouse or decorative shrub without losing possessions',()=>{
 for(const point of [{x:greenhouse.x+10,y:greenhouse.y+20},ornamentalShrubs[0]]){const s=snapshot(point,createClock(4),createGarden());s.economy.gold=321;const n=decodeSnapshot(s)!;expect(n).not.toBeNull();expect(nurserySolid(n.player.x,n.player.y)).toBe(false);expect(n.economy).toEqual(s.economy);expect(n.seeds).toEqual(s.seeds);}
});

it('keeps both benches readable instead of placing foliage in front of their boards',async()=>{const {villageLayout,benchPose,villageTrees,forestTrees}=await import('./village-layout');for(const b of villageLayout.benches){const p=benchPose(b.angle);for(const t of [...villageTrees,...forestTrees]){const s=t.scale??1;expect(t.x+42*s>p.x-40&&t.x-42*s<p.x+40&&t.y+7*s>p.y-43&&t.y-105*s<p.y+12).toBe(false);}}});

it('relocates all eight bay trees while preserving their species and size',async()=>{const {nurseryTreeOrigins,relocatedNurseryTrees,forestTrees,woodlandTreeClear}=await import('./village-layout');expect(relocatedNurseryTrees).toHaveLength(nurseryTreeOrigins.length);for(const {from,to}of relocatedNurseryTrees){expect(to.kind).toBe(from.kind);expect(to.scale).toBe(from.scale);expect(Math.hypot(to.x-from.x,to.y-from.y)).toBeLessThan(363);expect(woodlandTreeClear(to.x,to.y,to.scale,to.kind)).toBe(true);expect(forestTrees).toContainEqual(to);}});
