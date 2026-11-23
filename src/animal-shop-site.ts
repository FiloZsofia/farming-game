export const animalShopSite={x:810,y:1150,w:190,h:140,door:{x:902,y:1299},entrance:{x:886,y:1226,w:34,h:76}};
const right=animalShopSite.x+animalShopSite.w,bottom=animalShopSite.y+animalShopSite.h;
// The shop's east and south walls close the L-shaped yard; only the outer edges are fenced.
export const animalShopYard={boundary:[{x:right,y:bottom-66},{x:right+58,y:bottom-66},{x:right+58,y:bottom+70},{x:right-66,y:bottom+70},{x:right-66,y:bottom},{x:right,y:bottom}],gate:3,fenceEdges:[0,1,2,3]};
export const animalShopDisplays=[{kind:'straw',x:right-11,y:bottom+50,scale:1}] as const;
const bale=animalShopDisplays[0],yard=animalShopYard.boundary;
export const animalShopDisplayBounds=[{left:bale.x-32,right:bale.x+33,top:bale.y-43,bottom:bale.y+12},{left:Math.min(...yard.map(p=>p.x))-3,right:Math.max(...yard.map(p=>p.x))+3,top:Math.min(...yard.map(p=>p.y))-27,bottom:Math.max(...yard.map(p=>p.y))+3}];
export function animalShopSolid(x:number,y:number){
 if(Math.abs(x-bale.x)<31&&Math.abs(y-bale.y)<13)return true;
 return animalShopYard.fenceEdges.some(i=>{const a=yard[i],b=yard[(i+1)%yard.length],dx=b.x-a.x,dy=b.y-a.y,t=Math.max(0,Math.min(1,((x-a.x)*dx+(y-a.y)*dy)/(dx*dx+dy*dy)));if(i===animalShopYard.gate&&Math.abs(t-.5)*Math.hypot(dx,dy)<18)return false;return Math.hypot(x-a.x-t*dx,y-a.y-t*dy)<5;});
}
