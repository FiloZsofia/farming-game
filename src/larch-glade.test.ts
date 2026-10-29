import {it,expect} from 'vitest';
import {resinTree,inLarchGlade,larchTrunkBlocked} from './larch-glade';
import {distanceToSouthPath} from './south-forest-layout';
it('places the resin tree off the path and keeps its trunk solid',()=>{expect(distanceToSouthPath(resinTree.x,resinTree.y)).toBeGreaterThan(80);expect(larchTrunkBlocked(resinTree.x,resinTree.y)).toBe(true);});
it('allows Sam to walk around the tree and approach resin from every side',()=>{for(let i=0;i<12;i++){const angle=i/12*Math.PI*2,p={x:resinTree.x+Math.cos(angle)*35,y:resinTree.y+Math.sin(angle)*35};expect(inLarchGlade(p.x,p.y)).toBe(true);expect(larchTrunkBlocked(p.x,p.y)).toBe(false);}});
