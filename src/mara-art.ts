import Phaser from 'phaser';
// Original sprite and portrait: rolled sleeves, work vest, gloves, one long braid.
export class MaraArt{
 readonly root:Phaser.GameObjects.Container;private g:Phaser.GameObjects.Graphics;
 constructor(scene:Phaser.Scene){this.root=scene.add.container(0,0);this.g=scene.add.graphics();this.root.add(this.g);this.paint(0,false,false);}
 paint(time:number,walking:boolean,carrying:boolean,pruning=false){const g=this.g;g.clear();const stride=walking?Math.sin(time*11)*3:0,r=(x:number,y:number,w:number,h:number,c:number)=>g.fillStyle(c).fillRoundedRect(x,y,w,h,Math.min(2,w/3));
  g.fillStyle(0x253c30,.25).fillEllipse(1,0,23,7);for(const [x,step]of [[-6,stride],[1,-stride]]){r(x,-17+step,5,15,0x54625c);r(x-1,-4+step,8,5,0x644a34);r(x-1,-1+step,8,2,0x383c32);}
  r(-8,-34,16,19,0xd4c6a0);g.fillStyle(0x3f655f).fillPoints([{x:-9,y:-34},{x:-2,y:-36},{x:-1,y:-17},{x:-8,y:-16},{x:-10,y:-28}],true).fillPoints([{x:2,y:-36},{x:9,y:-33},{x:10,y:-17},{x:1,y:-17}],true);r(-7,-24,5,4,0x6e8980);r(3,-24,5,4,0x6e8980);g.lineStyle(.7,0x9bad8e).lineBetween(-1,-33,-1,-18);r(-7,-17,14,2,0x6e5841);
  for(const x of pruning?[]:[-11,8]){r(x,-31,4,8,0xdacda9);r(x-.5,-25,5,2,0xb8ab88);r(x,-23,4,carrying?5:8,0xd9aa83);r(carrying?x*.6:x,-18,5,6,0x9f8458);g.lineStyle(.6,0xd0b985).lineBetween(x+1,-16,x+3,-16);}
  if(pruning){const snip=Math.max(0,Math.sin(time*4)),lift=Math.sin(time*1.4)*2;g.lineStyle(4,0xdacda9).lineBetween(-9,-30,-15,-25+lift).lineBetween(8,-30,-9,-22+lift);g.lineStyle(3,0x9f8458).lineBetween(-15,-25+lift,-21,-24+lift).lineBetween(-9,-22+lift,-17,-22+lift);g.lineStyle(1.8,0x394b40).strokeCircle(-21,-25+lift,2).strokeCircle(-18,-22+lift,2);g.lineStyle(1.2,0xc9d0b7).lineBetween(-20,-24+lift,-28,-28+lift-snip*3).lineBetween(-20,-24+lift,-29,-25+lift+snip*2);g.fillStyle(0xe0ca8f).fillCircle(-20,-24+lift,1);}
  r(-2.5,-39,5,7,0xd3a17d);
  g.fillStyle(0x513c2d).fillEllipse(0,-43,15,19);
  g.fillStyle(0xe3b18a).fillPoints([{x:-5.2,y:-47},{x:3.8,y:-47.5},{x:6,y:-44},{x:5.5,y:-39},{x:3.4,y:-35.2},{x:.8,y:-33.6},{x:-2,y:-34.2},{x:-4.8,y:-38},{x:-5.8,y:-42}],true);
  g.fillStyle(0xf0c69e).fillEllipse(-1.2,-40.6,8.5,12);
  g.fillStyle(0x634b35).fillEllipse(-.4,-49,14.5,7).fillEllipse(5.5,-45,3.2,9);
  g.fillStyle(0x8f6c46).fillPoints([{x:-6.2,y:-49},{x:-2,y:-51.5},{x:4,y:-50.5},{x:1,y:-49.8}],true);
  for(const x of [-2.8,2.8]){g.lineStyle(.65,0x6b4f37).lineBetween(x-1,-44.1,x+.8,-44.3);g.fillStyle(0x3c473b).fillEllipse(x,-41.6,1.45,2.1);g.fillStyle(0xf4e4bc).fillCircle(x-.2,-42,.35);}
  g.lineStyle(.55,0xc08a6c).lineBetween(.3,-40,.9,-38.7);g.lineStyle(.65,0xa76855).lineBetween(-1.5,-37,0,-36.5).lineBetween(0,-36.5,1.9,-37.3);
  // Two interlocking strands form a tapered plait instead of a chain of beads.
  g.lineStyle(3.6,0x49392c).lineBetween(6.4,-39,7.3,-20);
  for(let i=0;i<8;i++){const x=6.6+i*.11,y=-37+i*2.55,w=1.8-i*.09;g.fillStyle(i%2?0x745234:0x93704a).fillPoints([{x:x-w,y:y-1.3},{x:x+.25,y:y-2},{x:x+w,y:y+.15},{x:x-.25,y:y+1.7}],true);g.lineStyle(.5,0xb18a59,.65).lineBetween(x-w+.3,y-.9,x+.4,y+.5);}
  r(5.8,-17.8,3.8,1.6,0xb99c61);g.fillStyle(0x795638).fillPoints([{x:6,y:-16},{x:9,y:-16},{x:8.2,y:-12.5},{x:6.4,y:-13.4}],true);

 }
}
export function maraPortrait(){
 const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.classList.add('item-icon','mara-portrait');svg.setAttribute('viewBox','0 0 96 96');svg.setAttribute('aria-hidden','true');
 svg.innerHTML='<path d="M17 96V72q4-14 29-15 28 0 33 16v23" fill="#d9cba9"/><path d="m17 96 2-26 19-8 8 34m5 0 2-34 22 8 6 26" fill="#41675f"/><path d="M40 61V49h16v14l-8 9z" fill="#d8a47d"/><ellipse cx="48" cy="32" rx="22" ry="29" fill="#513b2c"/><path d="M30 25Q34 12 48 12q17 1 18 17l-2 18q-5 15-16 17-11-3-16-17z" fill="#e5b58b"/><path d="M33 28q2-12 14-12l-2 44q-10-5-12-16z" fill="#f0c69e"/><path d="M27 29Q22-1 49 1 74 0 69 34L59 20Q39 20 27 29" fill="#654b33"/><path d="M32 12q11-10 25-5" fill="none" stroke="#977247" stroke-width="2.3"/><path d="m35 33 8-1m10 0 8 1" stroke="#77533a" stroke-width="1.5"/><g fill="#3c493b"><ellipse cx="39" cy="38" rx="1.9" ry="2.7"/><ellipse cx="57" cy="38" rx="1.9" ry="2.7"/></g><path d="m43 50 5 1 6-2" fill="none" stroke="#a66350" stroke-width="1.6"/><path d="m47 39-1 6 3 1" fill="none" stroke="#c28a6b" stroke-width="1"/><path d="M65 38q4 16 2 42" fill="none" stroke="#49392c" stroke-width="8"/>'+Array.from({length:9},(_,i)=>{const x=65+i*.22,y=42+i*4.3,w=4-i*.2;return `<path d="m${x-w} ${y-2} ${w-1} -2 ${w+1} 3 -${w-1} 3z" fill="${i%2?'#745234':'#93704a'}"/><path d="m${x-w+.7} ${y-1} ${w} 2" stroke="#b18a59" stroke-width=".7" fill="none"/>`;}).join('')+'<path d="M63 81h8v3h-8" fill="#c4a565"/><path d="m64 84 5 0-1 7-4-2" fill="#795638"/><path d="m24 80 13 1v9H23m35-9 12-1v10H58" fill="#6e8b7d"/>';return svg;
}
