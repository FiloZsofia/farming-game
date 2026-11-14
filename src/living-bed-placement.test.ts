import {afterEach,expect,it} from 'vitest';
import {livingBedFits,bedMarkerFits,markerOverlapsBed,orchardTreeBlocksBed} from './living-bed-placement';
import {bindPondExpansion} from './pond-shape';
afterEach(()=>bindPondExpansion(()=>[]));
it('allows the reported second bed near the apple trunk, but never on the trunk',()=>{
 const tree={x:-132,y:-108},bed={x:-275,y:-98,w:160,h:88};
 expect(orchardTreeBlocksBed(tree,bed)).toBe(false);
 expect(livingBedFits(bed,{x:-60,y:-40})).toBe(true);
 expect(orchardTreeBlocksBed(tree,{...bed,y:-110})).toBe(true);
});
it('allows a clear marker position just beyond the former narrow side band',()=>{
 const bed={x:-180,y:50,w:160,h:88};
 expect(bedMarkerFits({x:-100,y:190},bed)).toBe(true);
 expect(bedMarkerFits({x:-100,y:201},bed)).toBe(false);
 expect(bedMarkerFits({x:-100,y:149},bed)).toBe(false);
});
it('tests the full shallow marker footprint against other beds rather than a wide circle',()=>{
 const point={x:-100,y:190};
 expect(markerOverlapsBed(point,{x:-180,y:210,w:160,h:88})).toBe(false);
 expect(markerOverlapsBed(point,{x:-180,y:192,w:160,h:88})).toBe(true);
});
it('permits dry ground outside the actual shore, while protecting water and pond extensions',()=>{
 const bed={x:310,y:420,w:160,h:88};
 expect(livingBedFits(bed)).toBe(true);
 expect(livingBedFits({...bed,x:550})).toBe(false);
 bindPondExpansion(()=>Array(64).fill(65));
 expect(livingBedFits(bed)).toBe(false);
});
it('retains protection for paths, buildings and Sam inside a draft bed',()=>{
 expect(livingBedFits({x:180,y:350,w:160,h:88})).toBe(false);
 expect(livingBedFits({x:110,y:50,w:160,h:88})).toBe(false);
 expect(livingBedFits({x:-275,y:-98,w:160,h:88},{x:-200,y:-40})).toBe(false);
});
