export const TREE_GROWTH_DAYS=15;
// Visual development only: the planting date remains the sole maturity clock.
export function orchardGrowth(planted:number,day:number){
 const age=Math.max(0,day-planted),progress=Math.min(1,age/TREE_GROWTH_DAYS);
 return {age,progress,mature:age>=TREE_GROWTH_DAYS,scale:.22+.78*progress,canopies:progress<1/3?1:progress<2/3?2:3};
}
