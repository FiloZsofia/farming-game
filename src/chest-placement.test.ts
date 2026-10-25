import {it,expect} from 'vitest';
import {canPlaceChestAt} from './chest-placement';
import {snapshot} from './storage';
import {createClock} from './clock';
import {createGarden} from './gardening';
function state(){const save=snapshot({x:392,y:229},createClock(),createGarden());save.skill.chests={packed:1,placed:[]};return {...save,garden:{seeds:save.seeds,produce:save.produce,plots:new Map(save.plots)}};}
it('allows a chest close to the house wall and beside a path while preserving entrance access',()=>{const s=state();expect(canPlaceChestAt({x:392,y:192},s)).toBe(true);expect(canPlaceChestAt({x:392,y:224},s)).toBe(false);s.player={x:275,y:250};expect(canPlaceChestAt({x:280,y:216},s)).toBe(false);s.player={x:390,y:250};expect(canPlaceChestAt({x:392,y:216},s)).toBe(true);});
it('rejects building and fixture overlaps instead of blanket distance limits',()=>{const s=state();expect(canPlaceChestAt({x:312,y:176},s)).toBe(false);expect(canPlaceChestAt({x:352,y:200},s)).toBe(false);s.player={x:312,y:229};expect(canPlaceChestAt({x:312,y:192},s)).toBe(false);s.player={x:207,y:218};expect(canPlaceChestAt({x:239,y:214},s)).toBe(false);});
