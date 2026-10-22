import Phaser from 'phaser';
import {shopOrigins,type Shop} from './village-layout';
export function drawShop(scene:Phaser.Scene,shop:Shop){
 const y0=shopOrigins[shop],g=scene.add.graphics().setDepth(-1),nursery=shop==='nursery';
 const rect=(x:number,y:number,w:number,h:number,c:number,a=1)=>g.fillStyle(c,a).fillRect(x,y+y0,w,h);
 const oval=(x:number,y:number,w:number,h:number,c:number,a=1)=>g.fillStyle(c,a).fillEllipse(x,y+y0,w,h);
 const line=(x:number,y:number,xx:number,yy:number,c:number,w=1)=>g.lineStyle(w,c).lineBetween(x,y+y0,xx,yy+y0);
 const label=(x:number,y:number,text:string,size=11)=>scene.add.text(x,y+y0,text,{fontFamily:'Georgia,serif',fontSize:`${size}px`,color:'#fff0c6',backgroundColor:'#5a523c',padding:{x:7,y:4}}).setOrigin(.5).setDepth(4);
 rect(0,0,800,600,0x263b31);rect(92,99,616,426,0x62523d);rect(100,108,600,404,0xc6b38c);rect(100,110,600,85,nursery?0xd2d0ad:0xb9c9b4);rect(100,188,600,12,0x766848);rect(100,200,600,312,0xa7865c);
 for(let y=202;y<511;y+=14){line(101,y,699,y,0x715b42);line(101,y+2,699,y+2,0xc4a06c);for(let x=110+(y%3)*45;x<690;x+=95)line(x,y,x,y+13,0x7d6748);}
 for(const x of [125,555]){rect(x-4,115,121,63,0x796c4f);rect(x,119,113,55,0xa9c5b4);for(let i=0;i<3;i++){line(x+28+i*28,119,x+28+i*28,173,0xe9ddb9,3);}line(x,146,x+113,146,0xe9ddb9,3);oval(x+30,136,29,17,0x78935e,.6);rect(x-7,175,128,6,0x9c8257);}
 // A woven runner, wood counter and small handwritten catalogues.
 rect(294,322,212,112,nursery?0x7b8e59:0x698c87);rect(300,328,200,100,nursery?0x9ca66c:0x8da99b);for(let x=302;x<500;x+=7){line(x,328,x,428,nursery?0xb8b986:0xb0bfaa);line(x,320,x,325,0xd5c79d);line(x,431,x,437,0xd5c79d);}
 rect(338,235,224,53,0x72523b);rect(333,227,234,14,0xb69a6b);line(337,230,561,230,0xe1c18a,2);for(let x=350;x<558;x+=22)line(x,244,x,284,0x94724b);rect(453,218,26,10,0x766849);rect(456,217,10,8,0xeee0b6);rect(468,217,10,8,0xdfcfa5);line(466,218,466,226,0x8c7753);
 const pot=(x:number,y:number,s=1)=>{oval(x+3,y+7*s,29*s,10*s,0x3a5036,.2);rect(x-9*s,y-8*s,18*s,20*s,0x9c7350);rect(x-11*s,y-10*s,22*s,5*s,0xc29869);line(x,y-10*s,x,y-43*s,0x6e6640,2*s);for(const [dx,dy]of [[-10,-28],[9,-38],[-4,-47]]){oval(x+dx*s,y+dy*s,19*s,12*s,0x557c49);oval(x+(dx-2)*s,y+(dy-2)*s,13*s,7*s,0x88a55e);}};
 const aquarium=(x:number,y:number)=>{rect(x-35,y-19,70,44,0x5c7161);rect(x-32,y-16,64,38,0x6ca5a0);rect(x-28,y-12,56,28,0x9ec5b5,.7);line(x-27,y+14,x-20,y-6,0x5d8658,2);line(x+21,y+14,x+24,y-7,0x638e61,2);oval(x+7,y+1,13,5,0xdcbb79);g.fillStyle(0xbe9c62).fillTriangle(x+12,y+y0+1,x+18,y+y0-3,x+18,y+y0+4);rect(x-36,y+24,72,4,0x6e5e44);line(x-29,y-12,x-29,y+13,0xd9e2c5);};
 for(const x of [146,648]){rect(x-37,257,76,166,0x6d5c41);for(let y=275;y<421;y+=65){rect(x-40,y,82,7,0xbd9c68);line(x-38,y+1,x+38,y+1,0xe1bf85);if(nursery){pot(x-18,y-15,.65);pot(x+18,y-18,.75);}else aquarium(x,y-28);}}
 if(nursery){pot(286,240,1);pot(612,475,1.2);rect(225,223,42,26,0x907b53);for(let i=0;i<4;i++)rect(229+i*9,227,6,17,0xdfcfa5);label(400,139,'Faiskola',16);label(168,231,'Csemeték',9);}
 else{rect(258,242,50,13,0x9e8057);oval(283,239,54,23,0xb5a16e);oval(283,239,37,13,0x756e4d);for(let i=0;i<9;i++)line(261+i*5,239,268+i*4,245,0xd9c18b);aquarium(613,476);label(400,139,'Tóparti bolt',16);label(164,226,'Halak és vízinövények',8);}
 rect(373,494,54,19,0x675c41);line(376,499,424,499,0xc0a575);line(376,505,424,505,0xc0a575);label(400,545,'Kijárat · E / koppintás',10);
}
