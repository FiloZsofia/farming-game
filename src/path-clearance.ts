import type {PaintedPath} from './path-art';
export type PathBounds={left:number;right:number;top:number;bottom:number};
// Check the whole visible object against the painted network, including its edging.
export function boundsOffPaths(box:PathBounds,paths:readonly PaintedPath[],gap=4){
 return paths.every(path=>path.points.slice(1).every((end,i)=>{const start=path.points[i],steps=Math.max(1,Math.ceil(Math.hypot(end[0]-start[0],end[1]-start[1])/2));for(let j=0;j<=steps;j++){const x=start[0]+(end[0]-start[0])*j/steps,y=start[1]+(end[1]-start[1])*j/steps;if(Math.hypot(x-Math.max(box.left,Math.min(box.right,x)),y-Math.max(box.top,Math.min(box.bottom,y)))<path.width/2+gap)return false;}return true;}));
}
export const herbBounds=(p:{x:number;y:number;kind:string}):PathBounds=>({left:p.x-(p.kind==='thyme'?10:23),right:p.x+(p.kind==='thyme'?10:23),top:p.y-(p.kind==='thyme'?18:44),bottom:p.y+5});
