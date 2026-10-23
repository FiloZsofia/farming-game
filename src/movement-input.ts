// Physical state survives Phaser key resets during dialogs and scene transitions.
export class MovementInput {
 private codes=new Set<string>();
 private modifier=false;
 keyDown(e:{code:string;shiftKey:boolean}){this.codes.add(e.code);this.modifier=e.shiftKey;}
 keyUp(e:{code:string;shiftKey:boolean}){this.codes.delete(e.code);this.modifier=e.shiftKey;}
 clear(){this.codes.clear();this.modifier=false;}
 get running(){return this.modifier||this.codes.has('ShiftLeft')||this.codes.has('ShiftRight');}
 down(...codes:string[]){return codes.some(code=>this.codes.has(code));}
}
