import {it,expect,vi,afterEach} from 'vitest';
import {FarmMusic} from './music';
afterEach(()=>vi.unstubAllGlobals());
it('temporarily overrides the score without overwriting the selected track or mute preference',async()=>{
 const saved=new Map([['farm-music','off'],['farm-music-track','meadow']]),dataset:Record<string,string>={};
 vi.stubGlobal('localStorage',{getItem:(k:string)=>saved.get(k)??null,setItem:(k:string,v:string)=>saved.set(k,v)});
 vi.stubGlobal('document',{hidden:false,addEventListener:()=>{},querySelector:()=>({dataset})});
 const music=new FarmMusic();music.setDanger(true);expect(music.isDanger()).toBe(true);expect(music.getTrack()).toBe('meadow');expect(music.isEnabled()).toBe(false);expect(dataset.musicMood).toBe('danger');
 await music.setTrack('sunny');expect(music.isDanger()).toBe(true);expect(music.getTrack()).toBe('sunny');music.setDanger(false);expect(dataset.musicMood).toBe('ambient');expect(music.getTrack()).toBe('sunny');expect(saved.get('farm-music')).toBe('off');
});
