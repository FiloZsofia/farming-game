import {it,expect} from 'vitest';
import {recallUnusedSeeds,unusedSeedKinds} from './unused-seed-recall';
import {snapshot,decodeSnapshot,validSnapshot} from './storage';
import {createClock} from './clock';
import {createGarden} from './gardening';
import {enableHomestead} from './homestead-migration';
const fresh=()=>enableHomestead(snapshot({x:250,y:194},createClock(10,()=>.5),createGarden()),true);
it('atomically recalls only unsupported species from inventory, every chest and outstanding supplies',()=>{
 const s=fresh();s.economy.gold=100;s.seeds.honeyberry=2;s.seeds.blueberry=1;s.produce.blueberry=5;s.orders.pending.honeyberry=1;s.orders.mailbox.honeyberry=1;
 s.skill.chests={packed:0,placed:[{x:400,y:450,items:{'seed:honeyberry':3,'seed:blueberry':2,'seed:radish':4}},{x:440,y:450,items:{'bedSeed:cucumber':5}}]};s.skill.pendingSeeds={honeyberry:1};
 const h=s.travel.homestead!;h.refunds.push({account:'seed',kind:'honeyberry',count:2});h.garden.extraSeeds.cucumber=2;h.garden.pending.cucumber=1;h.garden.extraSeeds.marigold=4;h.garden.extraSeeds.pepper=3;
 const before=structuredClone(s),n=recallUnusedSeeds(s)!;expect(s).toEqual(before);expect(n.economy.gold).toBe(605);expect(n.seeds.honeyberry).toBe(0);expect(n.seeds.blueberry).toBe(0);expect(n.orders.pending.honeyberry).toBe(0);expect(n.orders.mailbox.honeyberry).toBe(0);expect(n.skill.chests!.placed[0].items).toEqual({'seed:radish':4});expect(n.skill.chests!.placed[1].items).toEqual({});expect(n.skill.pendingSeeds).toEqual({});expect(n.travel.homestead!.refunds).toEqual([]);expect(n.travel.homestead!.garden.extraSeeds).toMatchObject({cucumber:0,marigold:4,pepper:3});expect(n.produce.blueberry).toBe(5);expect(n.travel.homestead!.seedRecall).toMatchObject({total:505,seen:false,items:expect.arrayContaining([{kind:'honeyberry',count:10,gold:250},{kind:'blueberry',count:3,gold:135},{kind:'cucumber',count:8,gold:120}])});expect(validSnapshot(n)).toBe(true);expect(decodeSnapshot(n)).not.toBeNull();
});
it('never pays twice after reload or acknowledgement, and leaves ordinary farms alone',()=>{const s=fresh();expect(recallUnusedSeeds(s)).toBeNull();s.seeds.blueberry=2;const n=recallUnusedSeeds(s)!,loaded=decodeSnapshot(n)!;expect(loaded.travel.homestead!.seedRecall!.seen).toBe(false);expect(recallUnusedSeeds(loaded)).toBeNull();loaded.travel.homestead!.seedRecall!.seen=true;expect(recallUnusedSeeds(loaded)).toBeNull();expect(loaded.economy.gold).toBe(90);expect(unusedSeedKinds).toEqual(expect.arrayContaining(['blueberry','honeyberry','cucumber']));expect(unusedSeedKinds).not.toContain('marigold');});
it('rejects damaged compensation receipts without losing the original save',()=>{const s=fresh();s.seeds.blueberry=1;const n=recallUnusedSeeds(s)!;n.travel.homestead!.seedRecall!.total++;expect(decodeSnapshot(n)).toBeNull();expect(s.seeds.blueberry).toBe(1);});
