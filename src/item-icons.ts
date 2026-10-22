import {goods,extras,type Good,type Extra} from './estate';
import type {Crop} from './gardening';
export type IconName=Good|Extra|Crop|'hoe'|'water'|'harvest'|'axe'|'pickaxe'|'hand'|'wood'|'stone'|'weed'|'birdhouse'|'annie'|'strawberry'|'honeyberry'|'blueberry';
// Original, locally drawn interface icons; no external asset dependency.
const artwork:Partial<Record<IconName,string>>={
 carrot:'<path fill="#4d8547" d="m17 13-9-9 5-2 7 8 1-10 5 2-3 11 9-6 3 4-12 7z"/><path fill="#c46530" d="M10 13q10-7 17 4L12 34 5 36z"/><path fill="#ed9b47" d="M12 14q6-4 11 2L8 31z"/><path stroke="#aa512c" stroke-width="2" d="m9 22 5 2m2-7 5 2"/>',
 lettuce:'<path fill="#437943" d="M5 25Q-2 14 7 10 5 2 16 5 23-3 28 7 38 9 31 20 36 29 24 32 11 38 5 25z"/><path fill="#87b75b" d="M8 24Q2 16 12 14 7 5 18 9 27 3 27 15 36 20 26 25L18 31z"/><path fill="#b4d27a" d="M13 22Q8 15 17 16 20 8 24 18L22 26l-5 4z"/><path stroke="#deeaab" fill="none" stroke-width="2" d="m17 30 1-10m-1 7-7-5m8 2 7-4"/>',
 onion:'<path fill="#689247" d="m15 17-5-15 4-2 5 15L20 1l4 1-2 14 7-11 3 3-10 14z"/><path fill="#a87947" d="M15 14q-13 7-10 17 12 10 24 0 4-10-9-17z"/><path fill="#dab078" d="M16 15Q7 23 9 30q8 8 16-1 1-8-6-14z"/><path fill="#f1d29d" d="M17 17q-6 12-1 15 6-4 3-15z"/><path stroke="#795936" fill="none" d="m14 34-2 2m5-2v2m4-3 2 3"/>',
 strawberry:'<path fill="#ad4442" d="M6 12Q18 3 30 12 32 23 18 34 4 23 6 12z"/><path fill="#e96d66" d="M8 13Q16 8 24 13 25 23 18 30 8 23 8 13z"/><path fill="#57884a" d="m18 12-11-6 8 1 4-7 2 8 9-1-9 7z"/><path fill="#f2ce8a" d="m11 17 1 3m6-4v3m6-1-1 3m-8 2 1 3m5-2-1 3" stroke="#f2ce8a" stroke-width="1.5"/>',
 honeyberry:'<ellipse fill="#3a436c" cx="13" cy="22" rx="6" ry="13" transform="rotate(-25 13 22)"/><ellipse fill="#6878a2" cx="12" cy="20" rx="3" ry="9" transform="rotate(-25 12 20)"/><ellipse fill="#4b527d" cx="24" cy="19" rx="6" ry="12" transform="rotate(15 24 19)"/><ellipse fill="#8090b8" cx="22" cy="17" rx="2" ry="8"/><path fill="#648b4a" d="M18 10Q10 0 6 3q0 8 12 7zm0-2Q23-1 30 2q-1 9-12 8z"/>',
 blueberry:'<path stroke="#648b4a" stroke-width="2" d="M18 15V3"/><path fill="#719354" d="M18 9Q4-2 5 6q3 7 13 3z"/><circle fill="#475178" cx="11" cy="24" r="9"/><circle fill="#657baa" cx="23" cy="22" r="10"/><circle fill="#8498bb" cx="20" cy="19" r="5"/><path fill="#3c4b72" d="m23 15 2 3 4-1-2 4 1 3-4-1-3 2v-4l-3-2 4-1z"/>',
 annie:'<ellipse cx="18" cy="28" rx="11" ry="9" fill="#9b7654"/><ellipse cx="18" cy="15" rx="9" ry="10" fill="#e9bd93"/><path d="M9 12Q18 2 27 12V8Q18-1 9 8z" fill="#75543a"/><path d="M8 7Q18 1 28 7v3H8z" fill="#bba171"/><path d="M4 10h28v3H4z" fill="#827450"/><ellipse cx="14" cy="16" rx="1" ry="1.5" fill="#414536"/><ellipse cx="22" cy="16" rx="1" ry="1.5" fill="#414536"/><path d="M15 21q3 3 6 0" fill="none" stroke="#a56455" stroke-width="1"/>',
 weed:'<path fill="#557a3a" d="m14 29-9-8-3-9 8 3 3 8-2-19 7 4 1 16 8-16 5 1-5 16-8 7z"/><path fill="#92ae57" d="m14 28-7-8-2-5 7 4zm4 0-3-17 3 4zm3-1 7-13-1 8z"/><path fill="#9d824d" d="m13 30 9-2 5 3-8 3-8-1z"/>',
 birdhouse:'<path fill="#886440" d="M16 25h4v10h-4z"/><path fill="#cba26b" d="M7 12h23v17H7z"/><path fill="#71513b" d="m3 14 15-13 16 13-3 3-13-10L6 17z"/><circle cx="18" cy="18" r="5" fill="#354d3d"/><path fill="#efce8f" d="M17 25h3v4h-3z"/>',
 hand:'<path fill="#d9af82" d="m8 20-3-6 3-2 4 5V6l3-1 1 11V3l4 1v12l2-10 3 1-1 11 4-6 3 2-5 15-6 5-10-5z"/><path fill="#f0c99b" d="m10 21 7-2 6 3-4 8-7-3z"/>',
 wood:'<path fill="#624b34" d="m3 22 20-17 11 9-20 18z"/><path fill="#9e784e" d="M5 21 24 7l6 6-19 15z"/><path fill="#d3b37c" d="m3 22 6-1 6 6-1 5-7-2z"/><path stroke="#8b6d47" fill="none" d="m6 24 5 4m0-9 15-11m-12 17L29 14"/>',
 stone:'<path fill="#52665e" d="m3 23 4-14 12-6 12 8 3 14-14 8-14-3z"/><path fill="#adb9aa" d="M7 9 19 3l12 8-11 6-12 2z"/><path fill="#7f958a" d="m8 19 12-2 11-6 3 14-14 5-14-2z"/>',
 hoe:'<path stroke="#5e432e" stroke-width="6" d="m9 30 16-22"/><path stroke="#bc9964" stroke-width="3" d="m9 29 16-22"/><path fill="#4d6261" d="m17 4 13 8-2 10-7-3 1-6-8-5z"/><path fill="#a2b4ad" d="m17 4 13 8-2 3-14-7z"/>',
 water:'<path fill="#445f58" d="M8 15C-1 1 21-1 24 14l-4 2C17 4 6 5 12 14z"/><path fill="#789b8b" d="m7 12 17 1 1 17-17 1z"/><path fill="#adc3a1" d="m9 13 13 1-1 4-12-1z"/><path fill="#597e72" d="m23 19 7-9 4 2-8 14-4 1z"/><path fill="#b5c9b4" d="m29 8 6 3-2 5-6-4z"/><path stroke="#a8cdd2" d="m30 19-1 4m5-4-1 5"/>',
 harvest:'<path fill="none" stroke="#c7ad74" stroke-width="3" d="M8 18C6 1 30 1 28 18"/><path fill="#527948" d="m10 18 2-9 5 6 6-6 3 10z"/><path fill="#d68b82" d="M10 16h9v8h-9z"/><path fill="#9f794b" d="m4 18 28 1-4 14H8z"/><path stroke="#d2b17a" stroke-width="2" d="m6 21 24 1M8 26h21M12 20l1 11m7-11v11m7-11-2 11"/>',
 axe:'<path stroke="#614631" stroke-width="6" d="m8 32 16-25"/><path stroke="#bd9a66" stroke-width="3" d="m8 31 16-25"/><path fill="#667b77" d="m18 4 6-2 10 7-4 13-11-9-5-2z"/><path fill="#c3cec0" d="m30 7 4 2-4 13-4-4z"/>',
 pickaxe:'<path stroke="#614631" stroke-width="6" d="m10 32 13-24"/><path stroke="#bd9a66" stroke-width="3" d="m10 31 13-24"/><path fill="#718683" d="M3 13 12 3l10-2 9 6 4 10-7-7-7-3-8 1z"/><path fill="#c3cec0" d="m3 13 9-10 10-2-2 3-7 2z"/>',
 radish:'<path fill="#43854d" d="M13 14 6 6l5-2 5 8 1-11 5 2-3 10 8-6 3 5-11 5z"/><path fill="#e37b8e" d="M9 14h14l4 6-3 7-8 3-8-5-2-6z"/><path fill="#f7dec9" d="m11 25 5 5 3-1-1 5-4-3-5-5z"/><path fill="#f5b3ad" d="M10 15h5v4h-5z"/>',
 potato:'<path fill="#9c7044" d="m9 7 12-2 7 7 2 12-9 8-13-2-6-10z"/><path fill="#cba46b" d="m10 8 10-1 6 6 1 10-7 6-10-2-5-8z"/><path fill="#8e643f" d="M10 12h3v3h-3zm10 5h3v3h-3zm-8 6h3v2h-3z"/><path fill="#e2c68d" d="M15 9h5v3h-5z"/>',
 pea:'<path fill="#3b6b39" d="m2 25 4-10L25 3l6-2-2 12L14 29l-9 2z"/><path fill="#6ea456" d="m5 25 5-9L27 5l-2 8-13 14z"/><circle fill="#bdd982" cx="12" cy="22" r="4"/><circle fill="#b0d575" cx="19" cy="15" r="4"/><circle fill="#c4dc8b" cx="25" cy="8" r="3"/>'
};
export function itemIcon(crop:IconName){
 const icon=document.createElementNS('http://www.w3.org/2000/svg','svg');icon.setAttribute('viewBox','0 0 36 36');icon.setAttribute('aria-hidden','true');icon.classList.add('item-icon');icon.innerHTML=artwork[crop]??estateIcon(crop);return icon;
}

export function seedIcon(crop:Crop){
 const icon=itemIcon(crop);icon.classList.add('seed-icon');
 if(['strawberry','honeyberry','blueberry'].includes(crop)){icon.innerHTML='<path fill="#a27148" d="m7 19 23 0-4 15H11z"/><path fill="#c49b6c" d="M5 17h27v5H5z"/><path stroke="#6f944e" stroke-width="3" d="M18 18V5"/><path fill="#8ead5a" d="M18 12Q4 3 6 10q4 7 12 4zm0-4Q30-3 29 7q-3 8-11 4z"/><g transform="translate(12 20) scale(.32)">'+artwork[crop]+'</g>';return icon;}
 icon.innerHTML='<path fill="#775d3e" d="M6 2h24v32H6z"/><path fill="#ddc795" d="M7 3h22v30H7z"/><path fill="#b29a6b" d="M7 3h22v5H7z"/><path fill="#f2e5bd" d="M9 10h18v16H9z"/><g transform="translate(10 10) scale(.45)">'+artwork[crop]+'</g><path fill="#775436" d="m11 29 2-2 2 1-1 2zm6-1 2-1 2 2-2 2zm7 0 2-1 1 2-2 1z"/>';
 return icon;
}

function estateIcon(name:string){
 if(name==='cherry')return '<path d="M9 22Q10 7 24 3Q16 13 25 25" stroke="#688546" stroke-width="2" fill="none"/><path d="M24 4Q35 0 31 8q-7 4-7-4" fill="#76934f"/><circle cx="9" cy="25" r="8" fill="#bd514c"/><circle cx="25" cy="27" r="8" fill="#9f454b"/><ellipse cx="6" cy="22" rx="2" ry="3" fill="#ec9c89"/><ellipse cx="22" cy="24" rx="2" ry="3" fill="#df8b86"/>';
 if(['cherry','plum','apple','pear'].includes(name)){const c=name==='cherry'?'#bd514c':name==='plum'?'#776087':name==='apple'?'#d38d4e':'#c1b361';return `<path d="M18 15V4m0 7q12-10 13-2-5 7-13 2" fill="#72924e" stroke="#638344" stroke-width="2"/><ellipse cx="17" cy="24" rx="12" ry="${name==='pear'?12:10}" fill="${c}"/><ellipse cx="13" cy="20" rx="4" ry="5" fill="#f3d6a0" opacity=".35"/>`;}
 if(name.startsWith('roe'))return '<path d="M4 26q13-14 28-6l-2 12H6z" fill="#668b57"/>'+[8,15,22,12,19,26].map((x,i)=>`<circle cx="${x}" cy="${19+i%3*4}" r="3" fill="#e0c58d" stroke="#ae8d58"/>`).join('');
 if(name==='duckEgg')return '<ellipse cx="18" cy="20" rx="10" ry="14" fill="#dfdbb6"/><ellipse cx="14" cy="15" rx="4" ry="6" fill="#faf1d5"/>';
 if(name==='goldfish'||name==='carp')return `<path d="m24 20 10-9v18z" fill="${name==='goldfish'?'#bb8547':'#6f8c79'}"/><ellipse cx="15" cy="20" rx="13" ry="8" fill="${name==='goldfish'?'#e0ae62':'#acb7a0'}"/><circle cx="8" cy="18" r="1.7" fill="#344d42"/><path d="m12 13 8-7 4 9" fill="#c4b27e"/>`;
 if(name==='duckNest')return '<ellipse cx="18" cy="24" rx="16" ry="10" fill="#ac8958"/><ellipse cx="18" cy="21" rx="12" ry="6" fill="#736246"/><ellipse cx="15" cy="21" rx="4" ry="5" fill="#efdfb8"/><ellipse cx="23" cy="21" rx="4" ry="5" fill="#e7dbb5"/><path d="m4 25 26 3M6 30l23-7M9 32l-3-12m12 13 8-15" stroke="#d4b581" fill="none"/>';
 if(name==='reed')return '<path d="M8 34 6 10m8 24V5m7 29 4-26m-8 26 1-16m9 16 5-17" stroke="#769546" stroke-width="3"/><path d="M6 13V3m8 6V1m11 11V2" stroke="#86633d" stroke-width="4"/>';
 if(goods.includes(name as Good)||extras.includes(name as Extra))return '<ellipse cx="18" cy="24" rx="16" ry="8" fill="#779a54"/><path d="M9 17q9-20 18 0-9 16-18 0" fill="#e3b6bc"/><path d="M4 16q15-8 14 13Q5 29 4 16m28 0q-15-8-14 13 13 0 14-13" fill="#f0d4cd"/><circle cx="18" cy="21" r="3" fill="#e6ca75"/>';
 return '';
}
export function goodIcon(good:Good){const icon=itemIcon(good);if(['cherry','plum','apple','pear'].includes(good)){const fruit=icon.innerHTML;icon.innerHTML='<path d="m9 25 18 0-3 10H12z" fill="#a37b50"/><path d="M18 27V5m0 9Q4 0 5 12q5 9 13 4m0-6Q30-1 31 9q-4 8-13 5" fill="#73934e" stroke="#658347" stroke-width="2"/><g transform="translate(21 16) scale(.4)">'+fruit+'</g>';}return icon;}
