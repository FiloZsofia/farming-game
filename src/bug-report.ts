import {GAME_VERSION} from './version';

export const BUILD_ID=__BUILD_ID__;
export function browserDetails(ua:string,touchPoints=0,brave=false){
 const browsers:[string,RegExp][]=[['Edge',/(?:Edg|EdgiOS|EdgA)\/([\d.]+)/],['Opera',/(?:OPR|OPiOS)\/([\d.]+)/],['Firefox',/(?:Firefox|FxiOS)\/([\d.]+)/],['Chrome',/(?:Chrome|CriOS)\/([\d.]+)/],['Safari',/Version\/([\d.]+).*Safari/]];
 const found=browsers.map(([name,re])=>({name,version:ua.match(re)?.[1]})).find(b=>b.version);
 const browser=brave?'Brave':found?`${found.name} ${found.version}`:'Ismeretlen';
 const os=/Android/.test(ua)?'Android':/iPhone|iPad|iPod/.test(ua)||/Macintosh/.test(ua)&&touchPoints>1?'iOS / iPadOS':/Windows/.test(ua)?'Windows':/CrOS/.test(ua)?'ChromeOS':/Macintosh|Mac OS X/.test(ua)?'macOS':/Linux/.test(ua)?'Linux':'Ismeretlen';
 return {browser,os};
}
export function bugReportUrl(){
 const {browser,os}=browserDetails(navigator.userAgent,navigator.maxTouchPoints,'brave' in navigator);
 const url=new URL('https://github.com/FiloZsofia/farming-game/issues/new');
 url.searchParams.set('body',`**Mi történt?**\n\n\n**Hogyan lehet előidézni?**\n\n\n---\n**Technikai adatok**\nJátékverzió: ${GAME_VERSION}\nBuild: ${BUILD_ID}\nBöngésző: ${browser}\nOperációs rendszer: ${os}`);
 return url.href;
}
export function bugReportLink(id:string){
 const link=document.createElement('a');link.id=id;link.className='bug-report-link';link.textContent='Hibabejelentés';link.href=bugReportUrl();link.target='_blank';link.rel='noopener noreferrer';return link;
}
