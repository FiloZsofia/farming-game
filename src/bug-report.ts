import {GAME_VERSION} from './version';

export const BUILD_ID=__BUILD_ID__;
export function bugReportUrl(){
 const url=new URL('https://github.com/FiloZsofia/farming-game/issues/new');
 url.searchParams.set('body',`**Mi történt?**\n\n\n**Hogyan lehet előidézni?**\n\n\n---\n**Technikai adatok**\nJátékverzió: ${GAME_VERSION}\nBuild: ${BUILD_ID}`);
 return url.href;
}
export function bugReportLink(id:string){
 const link=document.createElement('a');link.id=id;link.className='bug-report-link';link.textContent='Hibabejelentés';link.href=bugReportUrl();link.target='_blank';link.rel='noopener noreferrer';return link;
}
