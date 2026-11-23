export const FULL_SHOP_NOTICE='Megtelt a Készleted. A vásárlás nem történt meg, goldot nem vontunk le.';
/** Shop feedback belongs to the modal top layer, never the covered game HUD. */
export function showShopNotice(message:string){
 const dialog=document.querySelector<HTMLDialogElement>('#dialogue'),shop=document.querySelector<HTMLElement>('#shop-panel');if(!dialog?.open||!shop||shop.hidden)return false;
 let notice=document.querySelector<HTMLElement>('#shop-feedback');if(!notice){notice=document.createElement('p');notice.id='shop-feedback';notice.className='shop-feedback';notice.setAttribute('role','alert');notice.setAttribute('aria-live','assertive');shop.before(notice);}notice.textContent=message;notice.hidden=false;return true;
}
export function clearShopNotice(){const notice=document.querySelector<HTMLElement>('#shop-feedback');if(notice){notice.hidden=true;notice.textContent='';}}
