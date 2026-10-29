// Individual ground strikes sweep across the locked-in direction, leaving time to dodge.
export const ROOT_STRIKE_COUNT=7;
export const ROOT_STRIKE_INTERVAL=.23;
export const ROOT_STRIKE_DURATION=ROOT_STRIKE_COUNT*ROOT_STRIKE_INTERVAL+.2;
export function rootStrike(index:number,aim:{x:number;y:number},origin:{x:number;y:number}){
 const angle=Math.atan2(aim.y,aim.x)+(index-3)*.19,reach=165+index%3*22;
 return {x:origin.x+Math.cos(angle)*reach,y:origin.y+Math.sin(angle)*reach};
}
export function rootStrikePose(elapsed:number,index:number){
 const t=(elapsed-index*ROOT_STRIKE_INTERVAL)/ROOT_STRIKE_INTERVAL;
 return {active:t>=0&&t<1,impact:t>=.6,drop:Math.max(0,Math.min(1,(t-.25)/.35)),dust:Math.max(0,1-Math.max(0,t-.6)*.26)};
}
