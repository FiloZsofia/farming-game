/** Remove a small, guaranteed quota from every tree, retaining spatial order. */
export function thinTreeLeaves<T extends {rank:number}>(leaves:readonly T[],fraction=.08):T[]{
 if(leaves.length<2)return [...leaves];
 const count=Math.min(leaves.length-1,Math.max(1,Math.ceil(leaves.length*fraction)));
 const removed=new Set(leaves.map((leaf,index)=>({leaf,index})).sort((a,b)=>a.leaf.rank-b.leaf.rank||a.index-b.index).slice(0,count).map(p=>p.index));
 return leaves.filter((_,index)=>!removed.has(index));
}
