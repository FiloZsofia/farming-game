import {expect,it} from 'vitest';
import {developerToolsEnabled} from './dev-mode';
it('accepts mixed-case developer links without enabling tools on normal URLs',()=>{
 for(const search of ['?dev=1','?DEV=1','?Dev=1','?other=2&dEv=1'])expect(developerToolsEnabled(search)).toBe(true);
 for(const search of ['','?dev=0','?DEV=false','?other=1'])expect(developerToolsEnabled(search)).toBe(false);
});
