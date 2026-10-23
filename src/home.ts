export const HOME_ORIGIN=3700;
export const inHome=(y:number)=>y>=HOME_ORIGIN&&y<HOME_ORIGIN+600;
export const homeBed={x:143,y:HOME_ORIGIN+245,w:99,h:120};
export const atHomeBedside=(x:number,y:number)=>x>254&&x<304&&y>HOME_ORIGIN+236&&y<HOME_ORIGIN+314;
export function homeBlocked(x:number,y:number){const yy=y-HOME_ORIGIN;return atHomeBedside(x,y)||x<108||x>692||yy<198||yy>510||(x>136&&x<249&&yy>238&&yy<373)||(x>543&&x<672&&yy<242);}
export const homeObjects=[{id:'books',x:603,y:HOME_ORIGIN+260,title:'Néhány ismerős könyv',text:'Kertészeti könyvek, egy régi növényhatározó és néhány kutatói jegyzet. Ezeket nem tudtam otthagyni.'},{id:'bag',x:293,y:HOME_ORIGIN+450,title:'Az utazótáskám',text:'Még nem pakoltam ki mindent. Most már nem sietek sehová.'}] as const;
