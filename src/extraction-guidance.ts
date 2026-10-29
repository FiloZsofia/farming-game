import type {Extraction} from './extraction';
export function extractionGuide(s:Extraction,carrying:string|null){
 if(carrying)return carrying==='resin'||carrying==='aid'?{target:'carrier',text:'Tedd az előkészítő edénybe.'}:carrying==='concentrate'?{target:'dose',text:'Add a koncentrátumot a lehűlt keverékhez.'}:{target:'vat',text:'Tedd az üstbe.'};
 if(s.phase==='prepare')return !s.resin?{target:'resin',text:'Vedd fel a gyantát.'}:!s.aid?{target:'aid',text:'Vedd fel Noah előkészítő anyagát.'}:{target:'carrier',text:'Keverd össze az edényben. Tartsd nyomva az E-t vagy az egérgombot.'};
 if(s.phase==='load'){for(const id of ['carrier','thyme','plantain'])if(!s.loaded.includes(id))return {target:id,text:`Vedd fel ${id==='carrier'?'a kész gyantás hordozót':id==='thyme'?'a vadkakukkfüvet':'a lándzsás útifüvet'}.`};return {target:'vat',text:'Indítsd el a kivonást az üstnél.'};}
 if(s.phase==='extract')return s.heat<.5||s.heat>.7||s.temperature>.72?{target:'heat',text:s.heat<.5?'Nyisd a fűtést: kattintással, húzással vagy Q / R-rel állítható.':'Vedd lejjebb a fűtést.'}:{target:'stir',text:s.temperature<.4?'Az üst melegszik. A keverőkarnál tartsd nyomva az E-t vagy az egérgombot.':'Keverd egyenletesen: tartsd nyomva az E-t vagy az egérgombot.'};
 if(s.phase==='filter')return {target:'filter',text:'Működtesd a szűrőt: tartsd nyomva az E-t vagy az egérgombot.'};
 if(s.phase==='cool')return {target:'cooler',text:s.coolant===0?'Nyisd ki a hűtővíz szelepét.':'A kivonat hűl. A koncentrátumot még ne add hozzá.'};
 if(s.phase==='dose')return {target:'concentrate',text:'Vedd fel a koncentrátumot.'};
 if(s.phase==='bottle')return {target:'bottle',text:'Töltsd meg az üveget: tartsd nyomva az E-t vagy az egérgombot.'};
 return {target:'bottle',text:'Elkészült.'};
}
