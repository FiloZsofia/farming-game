import {describe,it,expect} from 'vitest';
import {createStory,validStory} from './story-events';
describe('neighbor story validation',()=>{
 it('starts without a gift or claimed morning',()=>expect(validStory(createStory())).toBe(true));
 it('requires the gift before placing an odú or recording its morning',()=>{
  expect(validStory({giftReceived:false,morningSeen:true,birdhouse:null})).toBe(false);
  expect(validStory({giftReceived:false,morningSeen:false,birdhouse:{x:280,y:400}})).toBe(false);
 });
 it('rejects water and building positions and accepts a free spot',()=>{
  const state={giftReceived:true,morningSeen:false};
  expect(validStory({...state,birdhouse:{x:638,y:464}})).toBe(false);expect(validStory({...state,birdhouse:{x:200,y:160}})).toBe(false);
  expect(validStory({...state,birdhouse:{x:280,y:400}})).toBe(true);expect(validStory({...state,birdhouse:{x:NaN,y:400}})).toBe(false);
 });
});
