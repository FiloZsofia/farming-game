export const animalShopSite={x:810,y:1150,w:190,h:140,door:{x:902,y:1299},entrance:{x:886,y:1226,w:34,h:76}};
const door=animalShopSite.door;
// All parts of the frontage move together with the entrance.
export const animalShopYard={boundary:[{x:door.x+19,y:door.y+19},{x:door.x+93,y:door.y+19},{x:door.x+93,y:door.y+132},{x:door.x+19,y:door.y+132}],gate:3};
export const animalShopDisplays=[{kind:'straw',x:door.x-47,y:door.y+86,scale:1}] as const;
const bale=animalShopDisplays[0],yard=animalShopYard.boundary;
export const animalShopDisplayBounds=[{left:bale.x-32,right:bale.x+33,top:bale.y-43,bottom:bale.y+12},{left:yard[0].x-3,right:yard[1].x+3,top:yard[0].y-27,bottom:yard[2].y+3}];
export function animalShopSolid(x:number,y:number){
 if(Math.abs(x-bale.x)<31&&Math.abs(y-bale.y)<13)return true;
 return yard.some((a,i)=>{const b=yard[(i+1)%4],dx=b.x-a.x,dy=b.y-a.y,t=Math.max(0,Math.min(1,((x-a.x)*dx+(y-a.y)*dy)/(dx*dx+dy*dy)));if(i===animalShopYard.gate&&Math.abs(t-.5)*Math.hypot(dx,dy)<18)return false;return Math.hypot(x-a.x-t*dx,y-a.y-t*dy)<5;});
}
