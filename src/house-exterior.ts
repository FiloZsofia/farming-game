import Phaser from 'phaser';
import {farmLayout} from './layout';
export class HouseExterior {
 private art:Phaser.GameObjects.Graphics;
 private lights:HTMLDivElement[]=[];
 constructor(private scene:Phaser.Scene){
 const g=this.art=scene.add.graphics().setDepth(-.9).setScale(1.35,1.25).setPosition(239*(1-1.35),223*(1-1.25)+farmLayout.houseOffset.y);
 let seed=37;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 const rect=(x:number,y:number,w:number,h:number,c:number,a=1)=>{g.fillStyle(c,a).fillRect(x,y,w,h);};
 const oval=(x:number,y:number,w:number,h:number,c:number,a=1)=>{g.fillStyle(c,a).fillEllipse(x,y,w,h);};
 const poly=(p:number[],c:number,a=1)=>{g.fillStyle(c,a).fillPoints(p.reduce<Phaser.Types.Math.Vector2Like[]>((v,_,i)=>{if(i%2===0)v.push({x:p[i],y:p[i+1]});return v;},[]),true);};
 const line=(x:number,y:number,xx:number,yy:number,c:number,w=1,a=1)=>{g.lineStyle(w,c,a).lineBetween(x,y,xx,yy);};
 // Cottage: plaster, stone foundation, tiled roof, mullioned windows and porch.
 poly([132,204,347,204,375,243,159,248],0x284936,.28);oval(246,231,234,36,0x2e4333,.24);rect(132,128,215,95,0xe1d6ba);rect(132,138,215,8,0xb6a88a);rect(132,211,215,12,0x817b68);
 for(let x=134;x<345;x+=17){rect(x,213,15,7,x%2?0xaaa18a:0x99947e);line(x+1,220,x+14,220,0x656d5c);}
 for(let i=0;i<100;i++)rect(135+random()*208,148+random()*60,2,1,0xb3ac92,.45);
 poly([116,138,154,83,325,83,365,138],0x604e3d);poly([120,134,156,85,323,85,359,134],0x9b654b);
 for(let row=0;row<6;row++){const y=88+row*8,left=154-row*5.8,right=325+row*5.6;line(left,y+6,right,y+6,0x704937,2);for(let x=left+row%2*8;x<right-4;x+=16){line(x,y,x-2,y+6,0x704937);line(x+2,y+1,x+12,y+1,0xb37e58);}}
 rect(116,136,249,4,0x554b3b);rect(173,75,18,32,0xaca591);for(let y=78;y<107;y+=7){line(173,y,191,y,0x827f70);line(y%2?178:185,y,y%2?178:185,y+7,0x827f70);}rect(170,72,24,6,0x6c7166);
 rect(222,166,35,57,0x8c7c5d);rect(226,170,27,53,0x66503c);for(let x=230;x<253;x+=6)line(x,172,x,221,0x8e7150);rect(246,196,3,4,0xd7ba70);
 for(const x of [145,306]){rect(x-3,158,33,35,0xede1bf);rect(x,161,27,28,0x5a665f);rect(x+3,164,21,22,0x8eaaa4);poly([x+3,164,x+24,164,x+3,185],0xbaccc0,.6);line(x+13,164,x+13,186,0xe7ddc0,2);line(x+3,175,x+24,175,0xe7ddc0,2);rect(x-4,190,35,4,0x8d7958);}
 rect(175,222,130,35,0x635140);rect(178,223,124,32,0xa0825a);for(let y=225;y<257;y+=5){line(178,y,302,y,0x6c5942);line(181,y+1,299,y+1,0xb99b70);}
 rect(207,257,67,7,0x927858);rect(215,264,51,6,0xae9771);line(207,257,274,257,0xcabb92);
 for(const x of [190,286]){rect(x,156,5,99,0x65513c);rect(x,157,2,96,0xb29467);rect(x-2,253,9,5,0x70664f);}
 // Raised lean-to roof, tall posts and a separate low deck leave the doorway readable.
 poly([185,158,195,144,281,144,292,158],0x5e4934);poly([189,155,197,146,279,146,288,155],0x9b6e4b);
 for(let x=198;x<278;x+=12)line(x,147,x+7,154,0x6c4b37);line(186,158,291,158,0xbd9666,2);
 // Moss-green shutters, small flowers and timber window boxes.
 for(const x of [145,306]){for(const dx of [-12,30]){rect(x+dx,159,8,30,0x566c48);for(let y=164;y<186;y+=5)line(x+dx+1,y,x+dx+6,y,0x8c9a67);line(x+dx,159,x+dx,189,0x354d3b);}
 rect(x-2,193,31,7,0x8b6545);line(x-1,194,x+28,194,0xc29b66);for(let i=0;i<5;i++){const fx=x+2+i*5;line(fx,193,fx-1,188-i%2*3,0x4f7544);oval(fx-1,187-i%2*3,4,3,i%2?0xe2c67b:0xc89397);}}
 // Brick chimney, gutter, a worn doormat and muddy work boots.
 rect(173,75,18,30,0xa07d60);for(let y=77;y<103;y+=6){line(173,y,191,y,0xc1aa85);line(y%2?179:185,y,y%2?179:185,y+6,0x725d48);}rect(170,72,24,5,0x717363);
 line(116,138,365,138,0x535e50,3);line(345,140,345,209,0x697260,2);line(346,141,346,208,0xa7a68a);
 // Bright woven doormat, with individual fringe threads; clear of the side-wall boots.
 g.fillStyle(0xd67b36).fillRoundedRect(218,235,36,14,2);g.lineStyle(1,0x9d482a).strokeRoundedRect(220,237,32,10,1);line(223,242,249,242,0xf2c78b,1.5);
 for(let y=237;y<249;y+=2){line(215,y,218,y,0xf4d6a0);line(254,y,257,y,0xf4d6a0);}
 for(const x of [206,213]){g.fillStyle(0x4e5a40).fillRoundedRect(x,220,5,9,1).fillRoundedRect(x-2,226,7,4,2);line(x+1,221,x+3,221,0xa09168);oval(x,229,3,1,0x8b704d);}
 // Two wall-mounted lamps sit outside the veranda roof and window boxes.
 for(const x of [134,344]){line(x-3,185,x+2,185,0x3d493c,2);rect(x-3,188,8,12,0x46503f);rect(x-1,190,4,8,0xc3b17b);poly([x-5,188,x+1,183,x+7,188],0x4e5845);rect(x-4,200,10,2,0x3d493c);
 const light=document.createElement('div');light.className='workshop-lamp-light';light.setAttribute('aria-hidden','true');for(const name of ['halo','pool','core']){const el=document.createElement('i');el.className=name;light.append(el);}document.querySelector('#game')!.append(light);this.lights.push(light);}
 }
 update(darkness:number){const c=this.scene.cameras.main,z=c.zoom;this.lights.forEach((light,i)=>{const x=239+([135,345][i]-239)*1.35,y=223+(194-223)*1.25+farmLayout.houseOffset.y;light.hidden=!c.worldView.contains(x,y);light.style.transform=`translate(${(x-c.worldView.x)*z}px,${(y-c.worldView.y)*z}px) scale(${z*1.25})`;light.style.opacity=String(Math.min(1,Math.max(0,darkness/.55)));});}
 destroy(){this.art.destroy();this.lights.forEach(light=>light.remove());}
}
