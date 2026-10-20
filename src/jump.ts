export const JUMP_DURATION=.64;
export const JUMP_COOLDOWN=.18;
export const JUMP_SPEED=1.95;
export const RUN_SPEED=1.65;
export const JUMP_HEIGHT=32;
// A ballistic arc gives a crisp takeoff and a visible moment above the ground.
export function jumpHeight(remaining:number){
 const t=1-Math.min(JUMP_DURATION,Math.max(0,remaining))/JUMP_DURATION;
 return 4*JUMP_HEIGHT*t*(1-t);
}
export const movementSpeed=(jumping:boolean,running:boolean)=>jumping?JUMP_SPEED:running?RUN_SPEED:1;
