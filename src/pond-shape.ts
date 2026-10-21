// One shared, gently indented shoreline for both artwork and water collision.
export const pondRadius=(angle:number)=>Math.min(.99,.91+.065*Math.sin(angle*3+.6)+.028*Math.cos(angle*5-1));
