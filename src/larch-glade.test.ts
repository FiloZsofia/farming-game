import {it,expect} from 'vitest';
import {resinTree,inLarchGlade,larchTrunkBlocked,larchGroundDrop} from './larch-glade';
import {distanceToSouthPath} from './south-forest-layout';
it('places the resin tree off the path and keeps its trunk solid',()=>{expect(distanceToSouthPath(resinTree.x,resinTree.y)).toBeGreaterThan(80);expect(larchTrunkBlocked(resinTree.x,resinTree.y)).toBe(true);});
it('allows Sam to walk around the tree and approach resin from every side',()=>{for(let i=0;i<12;i++){const angle=i/12*Math.PI*2,p={x:resinTree.x+Math.cos(angle)*35,y:resinTree.y+Math.sin(angle)*35};expect(inLarchGlade(p.x,p.y)).toBe(true);expect(larchTrunkBlocked(p.x,p.y)).toBe(false);}});

it('smoothly lowers Sam into the clearing and leaves the approach unchanged',()=>{expect(larchGroundDrop(-795,2650)).toBe(0);expect(larchGroundDrop(-795,2710)).toBeLessThan(larchGroundDrop(-795,2770));expect(larchGroundDrop(-820,2800)).toBe(16);expect(larchGroundDrop(250,194)).toBe(0);});
