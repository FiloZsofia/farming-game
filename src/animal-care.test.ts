import {describe,it,expect} from 'vitest';
import {careActionState,henActivity} from './animal-care';
import {createLivestock,type AnimalPen} from './livestock';
const pen:AnimalPen={id:1,name:'Tyúkól',coop:{x:0,y:0},boundary:[],gate:0,fixtures:{feeder:{x:40,y:50},drinker:{x:80,y:50}},feed:0,wateredDay:null,cleanedDay:1,eggs:0};
describe('animal care tools',()=>{
 it('distinguishes unavailable supplies, full equipment and completed daily tasks',()=>{const s=createLivestock(1);expect(careActionState(s,pen,1,'feed').reason).toContain('takarmány');s.feed=20;expect(careActionState(s,pen,1,'feed').reason).toBeNull();expect(careActionState(s,{...pen,feed:12},1,'feed').reason).toContain('tele');expect(careActionState(s,{...pen,wateredDay:1},1,'water').reason).toContain('friss víz');expect(careActionState(s,pen,3,'clean').reason).toContain('tiszta');expect(careActionState(s,pen,4,'clean').reason).toBeNull();expect(careActionState(s,pen,1,'eggs').reason).toContain('nincs');expect(careActionState(s,{...pen,eggs:2},1,'eggs').reason).toBeNull();});
 it('uses fixture approach points and refuses missing fixtures',()=>{const s=createLivestock();expect(careActionState(s,pen,1,'water').target!.y).toBeGreaterThan(50);expect(careActionState(s,{...pen,fixtures:{}},1,'water')).toMatchObject({target:null,reason:'Előbb helyezd le a berendezést.'});});
 it('shows a journey rather than claiming an animal already uses its destination',()=>{const motion={p:{x:0,y:0},route:[{x:10,y:0}],activity:'eat',choice:0,look:1,dwell:2};expect(henActivity(motion)).toBe('Sétál');motion.route=[];expect(henActivity(motion)).toBe('Eszik');motion.activity='dust';expect(henActivity(motion)).toBe('Porfürdőzik');});
});
