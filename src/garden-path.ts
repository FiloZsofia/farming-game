export type PathMaterial='stone'|'wood'|'dirt';
export type PathPoint={x:number;y:number};
export type GardenPathPiece=PathPoint&{id:number;material:PathMaterial;angle:number;previous:number|null;baseJoin?:PathPoint};
export const pathMaterials:Record<PathMaterial,{name:string;spacing:number}>={stone:{name:'Kőösvény',spacing:18},wood:{name:'Faösvény',spacing:12},dirt:{name:'Földút',spacing:12}};
export function extendGardenPath(stroke:readonly PathPoint[],point:PathPoint,spacing:number,limit=240):PathPoint[]{
 if(!Number.isFinite(point.x)||!Number.isFinite(point.y))return [...stroke];
 // Trim first, even when the draft is invalid or has reached the size limit.
 let nearest=-1,distance=spacing*.75;
 for(let i=0;i<stroke.length-1;i++){const d=Math.hypot(stroke[i].x-point.x,stroke[i].y-point.y);if(d<distance){nearest=i;distance=d;}}
 if(nearest>=0)return nearest===0?[]:stroke.slice(0,nearest+1);
 if(!stroke.length)return [{...point}];
 const next=[...stroke],last=next.at(-1)!,length=Math.hypot(point.x-last.x,point.y-last.y);
 for(let d=spacing;d<=length&&next.length<limit;d+=spacing)next.push({x:last.x+(point.x-last.x)*d/length,y:last.y+(point.y-last.y)*d/length});
 return next;
}
export function makeGardenPath(points:readonly PathPoint[],material:PathMaterial,existing:readonly GardenPathPiece[],basePaths:readonly {width:number;points:readonly (readonly number[])[]}[]=[]):GardenPathPiece[]{
 let id=Math.max(0,...existing.map(p=>p.id)),previous:number|null=null;
 const result:GardenPathPiece[]=[];
 for(let i=0;i<points.length;i++){
  const p=points[i],base=nearestBasePath(p,basePaths),inBase=base&&base.distance<base.width/2-(material==='dirt'?0:material==='wood'?12:8);
  if(inBase){previous=null;continue;}
  const near=existing.find(q=>q.material===material&&Math.hypot(q.x-p.x,q.y-p.y)<pathMaterials[material].spacing*.7);
  if(near){previous=near.id;continue;}
  if(previous===null){const join=existing.filter(q=>q.material===material&&Math.hypot(q.x-p.x,q.y-p.y)<pathMaterials[material].spacing*1.6).sort((a,b)=>Math.hypot(a.x-p.x,a.y-p.y)-Math.hypot(b.x-p.x,b.y-p.y))[0];previous=join?.id??null;}
  const before=points[i-1]??p,after=points[i+1]??p,angle=Math.atan2(after.y-before.y,after.x-before.x);
  const piece:GardenPathPiece={...p,id:++id,material,previous,angle};if(material==='dirt'&&base&&base.distance<=base.width/2+pathMaterials.dirt.spacing+2)piece.baseJoin={x:base.x,y:base.y};result.push(piece);previous=piece.id;
 }
 return result;
}

// Trial costs are calculated once for the whole confirmed stroke, rounded up.
export const pathSupplies:Record<PathMaterial,{material:'stone'|'wood';batch:number}>={stone:{material:'stone',batch:5},wood:{material:'wood',batch:5},dirt:{material:'stone',batch:10}};
export const gardenPathCost=(material:PathMaterial,pieces:number,prepared=0)=>Math.ceil(Math.max(0,pieces-prepared)/pathSupplies[material].batch);

export function nearestBasePath(p:PathPoint,paths:readonly {width:number;points:readonly (readonly number[])[]}[]){
 let best:{x:number;y:number;width:number;distance:number}|null=null;
 for(const path of paths)for(let i=1;i<path.points.length;i++){const a=path.points[i-1],b=path.points[i],dx=b[0]-a[0],dy=b[1]-a[1],length=dx*dx+dy*dy,t=length?Math.max(0,Math.min(1,((p.x-a[0])*dx+(p.y-a[1])*dy)/length)):0,x=a[0]+dx*t,y=a[1]+dy*t,distance=Math.hypot(x-p.x,y-p.y);if(!best||distance<best.distance)best={x,y,width:path.width,distance};}
 return best;
}
