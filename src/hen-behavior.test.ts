import {describe,it,expect} from 'vitest';
import {updateHenBehavior,type HenMotion} from './hen-behavior';
import type {AnimalPen,Hen} from './livestock';
const pen:AnimalPen={id:1,name:'Ól',coop:{x:0,y:0},boundary:[{x:-200,y:-100},{x:220,y:-100},{x:220,y:200},{x:-200,y:200}],gate:2,fixtures:{feeder:{x:-150,y:10},drinker:{x:170,y:10},dustBath:{x:-130,y:150},shade:{x:160,y:140},perch:{x:0,y:140}},feed:12,wateredDay:1,cleanedDay:1,eggs:0};
const hen:Hen={id:5,penId:1,variety:'cream',name:'Pihe',arrivedDay:1,lastLayDay:1,careDays:0,personality:'shy'};
const motion=():HenMotion=>({p:{x:0,y:30},route:[],activity:'stand',choice:-1,look:1,dwell:0});
describe('hens finish walks and use their equipment',()=>{
 it('does not abandon a long walk when eleven seconds elapse',()=>{const m=motion();m.p={x:180,y:30};for(let i=0;i<110;i++)updateHenBehavior(pen,hen,m,.1,false,{x:500,y:500},1);expect(m.choice).toBe(0);expect(m.activity).toBe('eat');while(m.route.length)updateHenBehavior(pen,hen,m,.1,false,{x:500,y:500},1);const at={...m.p};for(let i=0;i<60;i++)updateHenBehavior(pen,hen,m,.1,false,{x:500,y:500},1);expect(m.choice).toBe(0);expect(m.p).toEqual(at);});
 it('visibly eats, drinks, bathes and rests during a complete day, for both perch rotations',()=>{for(const rotation of [0,1] as const){const p={...pen,rotations:{perch:rotation}},m=motion(),used=new Map<string,number>();for(let i=0;i<3600;i++){const walking=updateHenBehavior(p,hen,m,.1,false,{x:500,y:500},1);if(!walking&&!m.route.length)used.set(m.activity,(used.get(m.activity)??0)+.1);}for(const activity of ['eat','drink','dust','rest'])expect(used.get(activity),activity).toBeGreaterThan(6);for(let i=0;i<1200;i++)updateHenBehavior(p,hen,m,.1,true,{x:500,y:500},1);expect(m.choice).toBe(-2);expect(m.activity).toBe('rest');expect(m.route).toHaveLength(0);}});
 it('pauses in place with the game and avoids pretending to eat or drink from empty fixtures',()=>{const m=motion();updateHenBehavior({...pen,feed:0,wateredDay:null},hen,m,0,false,{x:500,y:500},1);const before=structuredClone(m);updateHenBehavior(pen,hen,m,0,false,{x:500,y:500},1);expect(m).toEqual(before);expect(m.activity).toBe('stand');});
});
