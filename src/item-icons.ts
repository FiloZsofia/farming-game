import type {Crop} from './gardening';
export type IconName=Crop|'hoe'|'water'|'harvest'|'axe'|'pickaxe';
// Original, locally drawn interface icons; no external asset dependency.
const artwork:Record<IconName,string>={
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
 const icon=document.createElementNS('http://www.w3.org/2000/svg','svg');icon.setAttribute('viewBox','0 0 36 36');icon.setAttribute('aria-hidden','true');icon.classList.add('item-icon');icon.innerHTML=artwork[crop];return icon;
}
