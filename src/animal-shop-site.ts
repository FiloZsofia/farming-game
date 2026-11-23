export const animalShopSite={x:790,y:1175,w:190,h:140,door:{x:882,y:1324},entrance:{x:866,y:1251,w:34,h:76}};
export const animalShopDisplays=[{kind:'coop',x:946,y:1365,scale:.62},{kind:'feeder',x:915,y:1395,scale:.9},{kind:'drinker',x:964,y:1407,scale:.85},{kind:'feed',x:942,y:1429,scale:1}] as const;
export const animalShopDisplayBounds=animalShopDisplays.map(p=>({left:p.x-(p.kind==='coop'?29:18),right:p.x+(p.kind==='coop'?29:18),top:p.y-(p.kind==='coop'?43:25),bottom:p.y+8}));
export const animalShopSolid=(x:number,y:number)=>animalShopDisplays.some(p=>Math.abs(x-p.x)<(p.kind==='coop'?25:14)&&Math.abs(y-p.y)<8);
