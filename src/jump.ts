export const JUMP_DURATION=.42;
export const JUMP_COOLDOWN=.28;
export const JUMP_SPEED=1.4;
export function jumpHeight(remaining:number){return remaining>0?Math.sin(Math.PI*(1-Math.min(remaining,JUMP_DURATION)/JUMP_DURATION))*15:0;}
