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
 rect(-38,25,76,49,0x735335);rect(-34,29,68,41,0xad8956);rect(-31,32,62,35,0x826b45);
 for(const x of [-18,0,18])rect(x,32,1,35,0x9b7c4d);
 rect(-41,73,82,6,0x765035);rect(-40,78,81,2,0xc19c62);
 // The large signed notice is distinguishable from the smaller village scraps.
 rect(-11,36,28,29,0xe9dfbd);rect(-8,60,20,2,0x6a7054);
 for(let i=0;i<4;i++)rect(-8,55-i*4,17-(i%2)*4,1,0xa39772);
 const seal=p(10,40);g.fillStyle(0xad6650).fillCircle(seal.x,seal.y,2.5);
 rect(-28,42,13,16,0xc7c49a);rect(21,47,10,12,0xd2b991);
 for(const x of [-31,31]){const nail=p(x,68);g.fillStyle(0xd2bd84).fillCircle(nail.x,nail.y,1);}
 return g;
}
