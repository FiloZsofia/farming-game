import {bedMixes,type LivingBed,type BedKind} from './living-bed';
/** Removed plants retain their actual kind until that particular spot is replanted. */
export function catalogBedGaps(beds:readonly {id:number;state:LivingBed}[]){
 return beds.flatMap(b=>{if(!b.state.mix)return [];const counts:Partial<Record<BedKind,number>>={};for(const p of b.state.plants)if(p.removed)counts[p.kind]=(counts[p.kind]??0)+1;const empty=Object.values(counts).reduce((a,n)=>a+n,0);return empty?[{id:b.id,mix:b.state.mix,name:bedMixes[b.state.mix].name,empty,counts,members:bedMixes[b.state.mix].members}]:[];});
}
