export const marketStandOffset=-65;
export const marketStand={left:-170+marketStandOffset,right:98+marketStandOffset,top:469,bottom:598};
export const marketFenceGap={from:-190+marketStandOffset,to:128+marketStandOffset};
export function overlapsMarket(p:{x:number;y:number},rx=8,ry=8){return p.x+rx>marketStand.left&&p.x-rx<marketStand.right&&p.y+ry>marketStand.top&&p.y-ry<marketStand.bottom;}

export const marketCratePoint=(i:number)=>({x:-125+(i%3)*83,y:486+Math.floor(i/3)*36});
