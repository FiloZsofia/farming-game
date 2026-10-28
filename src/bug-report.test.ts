import {expect,it} from 'vitest';
import {browserDetails} from './bug-report';
it('distinguishes browsers sharing Chrome tokens and identifies their operating system',()=>{
 expect(browserDetails('Mozilla/5.0 (Windows NT 10.0) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.1')).toEqual({browser:'Edge 142.0.1',os:'Windows'});
 expect(browserDetails('Mozilla/5.0 (Linux; Android 14) Chrome/142.0.0.0 Safari/537.36')).toEqual({browser:'Chrome 142.0.0.0',os:'Android'});
 expect(browserDetails('Mozilla/5.0 (Macintosh) Version/18.1 Safari/605.1',5)).toEqual({browser:'Safari 18.1',os:'iOS / iPadOS'});
 expect(browserDetails('Mozilla/5.0 (X11; Linux) Firefox/144.0')).toEqual({browser:'Firefox 144.0',os:'Linux'});
 expect(browserDetails('Chrome/142.0.0.0',0,true).browser).toBe('Brave');
 expect(browserDetails('Unknown')).toEqual({browser:'Ismeretlen',os:'Ismeretlen'});
});
