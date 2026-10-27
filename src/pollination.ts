export const RIPE_FRUIT_DAYS=3;
export type PollinationContext={seed:number};
export const pollinationDependent=(crop:string|null)=>crop==='strawberry'||crop==='honeyberry'||crop==='blueberry';
// Each plant has one productive cycle in three. Persisted cycles and a stable
// farm seed prevent reloading or rewatering from rerolling a blossom.
export function setsFruit(seed:number,identity:string,cycle:number){
 let hash=(seed>>>0)^2166136261;
 for(const c of identity)hash=Math.imul(hash^c.charCodeAt(0),16777619);
 hash=Math.imul(hash^(hash>>>16),0x45d9f3b);hash^=hash>>>16;
 return ((hash>>>0)%3+cycle%3)%3===0;
}
