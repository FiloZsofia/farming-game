import {grantKey,supplyMaterial,type Research} from './research';
import type {Shop} from './village-layout';
import type {NoahTestState} from './noah-story';
export const shopkeepers:Record<Shop,{name:string;met:'metLeo'|'metAnnie'|'metSimon';material?:'leo'|'annie'}>={nursery:{name:'Leo',met:'metLeo',material:'leo'},fishShop:{name:'Annie',met:'metAnnie',material:'annie'},craftShop:{name:'Simon',met:'metSimon'}};
export function merchantTopics(shop:Shop,research:Research,noah?:NoahTestState){
 const topics:{id:'bee'|'material'|'binder';label:string}[]=[];
 if(shop==='nursery'&&research.observation&&!research.key&&grantKey(research))topics.push({id:'bee',label:'Mesélek a szarvas faliméhről'});
 const material=shopkeepers[shop].material;
 if(material&&supplyMaterial(research,material))topics.push({id:'material',label:shop==='nursery'?'A szűrőhöz szükséges anyagról kérdezek':'Az üvegedényről kérdezek'});
 if(shop==='craftShop'&&noah?.letter&&!noah.upgraded)topics.push({id:'binder',label:'A kísérleti kötőanyagról kérdezek'});
 return topics;
}
// The same action layout is used by every current and future shop conversation.
export function appendMerchantActions(panel:HTMLElement,topics:ReturnType<typeof merchantTopics>,talk:(id:'bee'|'material'|'binder')=>Promise<boolean>,buy:()=>void,back:()=>void){
 panel.replaceChildren();panel.classList.add('merchant-actions');panel.hidden=false;
 for(const topic of topics){const b=document.createElement('button');b.type='button';b.dataset.merchantTopic=topic.id;b.textContent=topic.label;b.onclick=async()=>{for(const el of Array.from(panel.querySelectorAll('button')))el.disabled=true;try{await talk(topic.id);}finally{for(const el of Array.from(panel.querySelectorAll('button')))el.disabled=false;}};panel.append(b);}
 const purchase=document.createElement('button');purchase.type='button';purchase.dataset.merchantPurchase='true';purchase.textContent='Vásárlás';purchase.onclick=buy;panel.append(purchase);
 const close=document.createElement('button');close.type='button';close.dataset.merchantBack='true';close.textContent='Vissza';close.onclick=back;panel.append(close);
}

export const WORKSHOP_PEOPLE_HINT='Talán érdemes lehet másokat is megkérdeznem az alkatrészekről.';
export const workshopPeopleHintPending=(r:Research)=>r.discovered&&!r.repaired&&!r.materialHelpSeen&&(r.materials.glass<1||r.materials.linen<1);
