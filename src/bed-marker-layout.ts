// The board and its native HTML lettering share one centre, angle and safe area.
// The rotated 66 × 32 board fits the existing 68 × 36 placement footprint.
export const bedMarkerLayout={width:66,height:32,angle:-.055,centerOffsetY:-13,textWidth:52,textHeight:24,fontSize:8,lineHeight:10};
export function bedMarkerCenter(anchor:{x:number;y:number}){return{x:anchor.x,y:anchor.y+bedMarkerLayout.centerOffsetY};}
export function bedMarkerLines(name:string){const words=name.trim().split(/\s+/);if(words.length<2)return name;let split=1,balance=Infinity;for(let i=1;i<words.length;i++){const score=Math.abs(words.slice(0,i).join(' ').length-words.slice(i).join(' ').length);if(score<balance){balance=score;split=i;}}return words.slice(0,split).join(' ')+'\n'+words.slice(split).join(' ');}
