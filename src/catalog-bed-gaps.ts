import {bedMixes,type LivingBed,type BedKind} from './living-bed';
/** Removed plants retain their actual kind until that particular spot is replanted. */
export function catalogBedGaps(beds:readonly {id:number;state:LivingBed}[]){
 return beds.flatMap(b=>{if(!b.state.mix)return [];const counts:Partial<Record<BedKind,number>>={};for(const p of b.state.plants)if(p.removed)counts[p.kind]=(counts[p.kind]??0)+1;const empty=Object.values(counts).reduce((a,n)=>a+n,0);return empty?[{id:b.id,mix:b.state.mix,name:bedMixes[b.state.mix].name,empty,counts,members:bedMixes[b.state.mix].members}]:[];});
}

/** Allocate shared stock once across beds, rather than promising the same seed twice. */
export function catalogGapSupply(gaps:ReturnType<typeof catalogBedGaps>,held:Partial<Record<BedKind,number>>,pending:Partial<Record<BedKind,number>>,mailbox:Partial<Record<BedKind,number>>){
 const pools={held:{...held},pending:{...pending},mailbox:{...mailbox}},result=new Map<number,Partial<Record<BedKind,{held:number;pending:number;mailbox:number;missing:number}>>>();
 for(const gap of gaps){const rows:Partial<Record<BedKind,{held:number;pending:number;mailbox:number;missing:number}>>={};for(const [key,count]of Object.entries(gap.counts)){const kind=key as BedKind,row={held:0,pending:0,mailbox:0,missing:count!};for(const source of ['held','mailbox','pending'] as const){row[source]=Math.min(row.missing,pools[source][kind]??0);pools[source][kind]=(pools[source][kind]??0)-row[source];row.missing-=row[source];}rows[kind]=row;}result.set(gap.id,rows);}return result;
}
