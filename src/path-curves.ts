export function quadraticPath(start:readonly number[],control:readonly number[],end:readonly number[],steps=12):number[][]{return Array.from({length:steps+1},(_,i)=>{const t=i/steps,u=1-t;return[u*u*start[0]+2*u*t*control[0]+t*t*end[0],u*u*start[1]+2*u*t*control[1]+t*t*end[1]];});}

/** Round sharp polyline corners within the existing corridor; endpoints stay fixed. */
export function roundedPath(points:readonly (readonly number[])[],radius=24):number[][]{
 if(points.length<3)return points.map(p=>[p[0],p[1]]);
 const result:number[][]=[[...points[0]]];
 for(let i=1;i<points.length-1;i++){
  const a=points[i-1],p=points[i],b=points[i+1],before=Math.hypot(p[0]-a[0],p[1]-a[1]),after=Math.hypot(b[0]-p[0],b[1]-p[1]);
  if(!before||!after){result.push([...p]);continue;}
  const cut=Math.min(radius,before*.22,after*.22),start=[p[0]+(a[0]-p[0])*cut/before,p[1]+(a[1]-p[1])*cut/before],end=[p[0]+(b[0]-p[0])*cut/after,p[1]+(b[1]-p[1])*cut/after];
  result.push(...quadraticPath(start,p,end,8));
 }
 result.push([...points.at(-1)!]);return result;
}
