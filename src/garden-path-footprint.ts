import type {GardenPathPiece,PathPoint} from './garden-path';
export const pathNoise=(id:number,salt:number)=>{const v=Math.sin(id*91.37+salt*17.83)*43758.5453;return v-Math.floor(v);};
export function pathFootprint(p:GardenPathPiece):PathPoint[]{
 if(p.material==='stone'){const a=pathNoise(p.id,2)*.8-.4,rx=7+pathNoise(p.id,3)*3,ry=5+pathNoise(p.id,4)*2,dx=(pathNoise(p.id,5)-.5)*3,dy=(pathNoise(p.id,6)-.5)*2;return Array.from({length:7},(_,i)=>{const angle=a+i*Math.PI*2/7,r=.82+pathNoise(p.id,i+10)*.18;return {x:p.x+dx+Math.cos(angle)*rx*r,y:p.y+dy+Math.sin(angle)*ry*r};});}
 if(p.material==='wood'){const a=p.angle+Math.PI/2+(pathNoise(p.id,1)-.5)*.1,ux=Math.cos(a),uy=Math.sin(a),vx=-uy,vy=ux,w=12+pathNoise(p.id,3)*2,h=4.3;return [[-w,-h],[w,-h],[w,h],[-w,h]].map(([x,y])=>({x:p.x+ux*x+vx*y,y:p.y+uy*x+vy*y}));}
 return Array.from({length:16},(_,i)=>({x:p.x+Math.cos(i*Math.PI/8)*14.5,y:p.y+Math.sin(i*Math.PI/8)*14.5}));
}
export function polygonsOverlap(a:readonly PathPoint[],b:readonly PathPoint[]){for(const polygon of [a,b])for(let i=0;i<polygon.length;i++){const p=polygon[i],q=polygon[(i+1)%polygon.length],axis={x:-(q.y-p.y),y:q.x-p.x},aa=a.map(v=>v.x*axis.x+v.y*axis.y),bb=b.map(v=>v.x*axis.x+v.y*axis.y);if(Math.max(...aa)<=Math.min(...bb)||Math.max(...bb)<=Math.min(...aa))return false;}return true;}
export function rectanglePolygon(b:{x:number;y:number;w:number;h:number}):PathPoint[]{return [{x:b.x,y:b.y},{x:b.x+b.w,y:b.y},{x:b.x+b.w,y:b.y+b.h},{x:b.x,y:b.y+b.h}];}
export function roundedBedPolygon(b:{x:number;y:number;w:number;h:number}){const x=b.x-4,y=b.y-3,w=b.w+8,h=b.h+9,r=17,result:PathPoint[]=[];for(const [cx,cy,start]of [[x+r,y+r,Math.PI],[x+w-r,y+r,-Math.PI/2],[x+w-r,y+h-r,0],[x+r,y+h-r,Math.PI/2]])for(let i=0;i<=4;i++){const a=start+i*Math.PI/8;result.push({x:cx+Math.cos(a)*r,y:cy+Math.sin(a)*r});}return result;}
