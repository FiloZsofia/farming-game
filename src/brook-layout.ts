export type BrookPoint={x:number;y:number};
export const brookSource={x:385,y:1294};
// Ordered downstream: the source feeds the established forest bed and its existing bridge.
export const brookControls:readonly BrookPoint[]=[brookSource,{x:350,y:1312},{x:260,y:1335},{x:125,y:1342},{x:-30,y:1320},{x:-260,y:1240},{x:-440,y:1195},{x:-600,y:1207},{x:-780,y:1250},{x:-1060,y:1285},{x:-1180,y:1290}];
const catmull=(a:number,b:number,c:number,d:number,t:number)=>b+.5*t*(c-a+t*(2*a-5*b+4*c-d+t*(3*(b-c)+d-a)));
export const brookSamples:(BrookPoint&{distance:number})[]=[];
for(let i=0;i<brookControls.length-1;i++)for(let j=0;j<32;j++){const a=brookControls[Math.max(0,i-1)],b=brookControls[i],c=brookControls[i+1],d=brookControls[Math.min(brookControls.length-1,i+2)],t=j/32,p={x:catmull(a.x,b.x,c.x,d.x,t),y:catmull(a.y,b.y,c.y,d.y,t)},previous=brookSamples.at(-1);brookSamples.push({...p,distance:previous?previous.distance+Math.hypot(p.x-previous.x,p.y-previous.y):0});}
const last=brookControls.at(-1)!,previous=brookSamples.at(-1)!;brookSamples.push({...last,distance:previous.distance+Math.hypot(last.x-previous.x,last.y-previous.y)});
export const brookLength=brookSamples.at(-1)!.distance;
export function brookAt(distance:number,offset=0){const d=Math.max(0,Math.min(brookLength,distance));let lo=1,hi=brookSamples.length-1;while(lo<hi){const mid=(lo+hi)>>1;if(brookSamples[mid].distance<d)lo=mid+1;else hi=mid;}const a=brookSamples[lo-1],b=brookSamples[lo],length=Math.hypot(b.x-a.x,b.y-a.y)||1,k=(d-a.distance)/(b.distance-a.distance||1),tx=(b.x-a.x)/length,ty=(b.y-a.y)/length;return{x:a.x+(b.x-a.x)*k-ty*offset,y:a.y+(b.y-a.y)*k+tx*offset,tx,ty,width:12+13*Math.min(1,d/380)};}
export const brookBridge={left:-469,right:-418,top:1163,bottom:1232};
export const underBrookBridge=(p:BrookPoint)=>p.x>brookBridge.left&&p.x<brookBridge.right&&p.y>brookBridge.top&&p.y<brookBridge.bottom;
export const brookStones=[.12,.25,.39,.57,.72,.86].map((fraction,i)=>({distance:brookLength*fraction,...brookAt(brookLength*fraction,(i%2?1:-1)*(i%3?6:12)),radius:i%2?5:7}));
export function brookClearForTree(x:number,y:number,scale=1){if(x+42*scale>brookSource.x-48&&x-42*scale<brookSource.x+48&&y+7*scale>brookSource.y-44&&y-105*scale<brookSource.y+18)return false;return brookSamples.every(p=>Math.hypot(x-p.x,y-p.y)>17+8*scale)&&Math.hypot(x-brookSource.x,y-brookSource.y)>48+20*scale;}
