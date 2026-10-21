import type {Crop} from './gardening';
// Original, locally drawn interface icons; no external asset dependency.
const artwork:Record<Crop,string>={
 radish:'<path fill="#43854d" d="M13 14 6 6l5-2 5 8 1-11 5 2-3 10 8-6 3 5-11 5z"/><path fill="#e37b8e" d="M9 14h14l4 6-3 7-8 3-8-5-2-6z"/><path fill="#f7dec9" d="m11 25 5 5 3-1-1 5-4-3-5-5z"/><path fill="#f5b3ad" d="M10 15h5v4h-5z"/>',
 potato:'<path fill="#9c7044" d="m9 7 12-2 7 7 2 12-9 8-13-2-6-10z"/><path fill="#cba46b" d="m10 8 10-1 6 6 1 10-7 6-10-2-5-8z"/><path fill="#8e643f" d="M10 12h3v3h-3zm10 5h3v3h-3zm-8 6h3v2h-3z"/><path fill="#e2c68d" d="M15 9h5v3h-5z"/>',
 pea:'<path fill="#3b6b39" d="m2 25 4-10L25 3l6-2-2 12L14 29l-9 2z"/><path fill="#6ea456" d="m5 25 5-9L27 5l-2 8-13 14z"/><circle fill="#bdd982" cx="12" cy="22" r="4"/><circle fill="#b0d575" cx="19" cy="15" r="4"/><circle fill="#c4dc8b" cx="25" cy="8" r="3"/>'
};
export function itemIcon(crop:Crop){
 const icon=document.createElementNS('http://www.w3.org/2000/svg','svg');icon.setAttribute('viewBox','0 0 36 36');icon.setAttribute('aria-hidden','true');icon.classList.add('item-icon');icon.innerHTML=artwork[crop];return icon;
}
