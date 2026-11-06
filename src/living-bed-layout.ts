export const livingBedArea={x:300,y:408,w:160,h:88};
export const livingBedCenter={x:livingBedArea.x+livingBedArea.w/2,y:livingBedArea.y+livingBedArea.h/2};
export const livingBedSpawn={x:livingBedCenter.x,y:livingBedArea.y+livingBedArea.h+36};
export const livingPlantOffsets=[[-57,-20],[-13,-26],[39,-21],[-43,6],[9,-2],[55,10],[-61,29],[-7,27],[34,31]];
export const livingPlantPoint=(i:number)=>({x:livingBedCenter.x+livingPlantOffsets[i][0],y:livingBedCenter.y+livingPlantOffsets[i][1]});
