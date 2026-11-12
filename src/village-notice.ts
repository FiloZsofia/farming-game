import type Phaser from 'phaser';
export const villageNotice={x:350,y:1165,w:76};
export const pollinatorNoticeTitle='Közlemény a gyümölcstermésről';
export const pollinatorNoticeText='A környék gazdái idén szokatlanul kevés beporzót figyeltek meg. A bogyósokon és gyümölcsfákon sok virág termés nélkül nyílik el: jelenleg nagyjából minden harmadik virágzási ciklusból várható gyümölcs. A terméskiesés a gyümölcsök eladási értékét növeli.\n\nAz öntözés továbbra is fontos, de a beporzók munkáját nem helyettesíti. Az érett gyümölcsöt érdemes három napon belül leszedni.\n\nA polgármesteri hivatal';
export function noticeBoardBlocked(x:number,y:number){const dx=x-villageNotice.x,dy=y-villageNotice.y;return Math.abs(dx)<38&&Math.abs(dy-dx*.25)<9;}
export function drawVillageNotice(scene:Phaser.Scene){
 const g=scene.add.graphics().setDepth(3),n=villageNotice;
 const p=(x:number,z:number)=>({x:n.x+x,y:n.y+x*.25-z});
 const rect=(x:number,z:number,w:number,h:number,c:number)=>g.fillStyle(c).fillPoints([p(x,z),p(x+w,z),p(x+w,z+h),p(x,z+h)],true);
 g.fillStyle(0x344831,.23).fillEllipse(n.x+7,n.y+5,88,19);
 // Upright posts and a shallow sloping top follow the square's south-west rim.
 for(const x of [-30,30]){rect(x-3,0,6,76,0x705136);rect(x-2,2,2,71,0xb18b55);}
 rect(-38,25,76,49,0x604a36);rect(-37,27,74,46,0x9c7b52);rect(-34,29,68,41,0xb39a6a);rect(-31,32,62,35,0x826b45);
 for(let i=0;i<5;i++){rect(-31,33+i*7,62,5,i%2?0x8d7650:0x927d56);rect(-31,33+i*7,62,.6,0xb29a6b);}
 for(let i=0;i<16;i++)rect(-29+(i*17)%56,34+(i*11)%29,5+i%5,.45,0x65583e);
 for(const x of [-18,0,18])rect(x,32,1,35,0x9b7c4d);
 rect(-41,73,82,6,0x765035);rect(-40,78,81,2,0xc19c62);rect(-40,73,80,1,0x4e4030);
 for(const x of [-30,30]){rect(x-3,2,1,69,0x4f4231);rect(x+1,7,.6,55,0xd0b07a);}
 rect(-33,27,66,2,0x5e4b34);
 // The large signed notice is distinguishable from the smaller village scraps.
 rect(-10,35,29,30,0x554b36);rect(-11,36,28,29,0xe9dfbd);rect(-10,37,26,27,0xf0e7ca);rect(-8,60,20,2,0x6a7054);
 for(let i=0;i<4;i++)rect(-8,55-i*4,17-(i%2)*4,1,0xa39772);
 const seal=p(10,40);g.fillStyle(0xad6650).fillCircle(seal.x,seal.y,2.5);
 rect(-29,33,18,30,0x5f533c);rect(-30,34,17,29,0xf4f3ee);rect(22,46,10,12,0x5f533c);rect(21,47,10,12,0xd2b991);
 rect(22,55,7,.7,0x8b7959);rect(22,52,6,.6,0x8b7959);
 for(const [x,z]of [[-22,61],[2,63],[26,57]]){const pin=p(x,z);g.fillStyle(0x605e49).fillCircle(pin.x+.4,pin.y+.5,1.1);g.fillStyle(0xc4b887).fillCircle(pin.x,pin.y,.8);}
 for(let i=0;i<3;i++)rect(-28,59-i*2,12-i%2*3,.6,0x77756e);
 const ink=(x:number,z:number)=>p(x,z);g.lineStyle(.7,0x555650,.9);g.strokePoints([ink(-27,43),ink(-28,47),ink(-25,51),ink(-23,48),ink(-24,43),ink(-27,43)]);
 g.strokePoints([ink(-21,42),ink(-23,46),ink(-20,49),ink(-17,46),ink(-18,42),ink(-21,42)]).lineBetween(ink(-22,47).x,ink(-22,47).y,ink(-24,51).x,ink(-24,51).y).lineBetween(ink(-18,44).x,ink(-18,44).y,ink(-15,41).x,ink(-15,41).y);
 for(const x of [-31,31]){const nail=p(x,68);g.fillStyle(0xd2bd84).fillCircle(nail.x,nail.y,1);}
 return g;
}
