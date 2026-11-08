import Phaser from 'phaser';
import {itemIcon} from './item-icons';
import {marketProducts,type MarketCrate} from './market-trial';
export const marketStand={left:-55,right:96,top:523,bottom:596};
export const marketCratePoint=(i:number)=>({x:-23+(i%3)*43,y:536+Math.floor(i/3)*19});
export async function loadMarketIcons(scene:Phaser.Scene){await Promise.all(marketProducts.map(async kind=>{const key=`market-product-${kind}`;if(scene.textures.exists(key))return;const svg=itemIcon(kind);svg.setAttribute('width','36');svg.setAttribute('height','36');const source='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(new XMLSerializer().serializeToString(svg)),img=new Image();await new Promise<void>((resolve,reject)=>{img.onload=()=>resolve();img.onerror=()=>reject(new Error('A terményikon nem tölthető be.'));img.src=source;});scene.textures.addImage(key,img);}));}
export class MarketStandArt{
 readonly root:Phaser.GameObjects.Container;private contents:Phaser.GameObjects.Container;
 constructor(private scene:Phaser.Scene){this.root=scene.add.container(0,0).setDepth(50);const g=scene.add.graphics();this.root.add(g);
  g.fillStyle(0x2b3d2d,.25).fillEllipse(23,582,187,55);g.fillStyle(0x6a5034).fillRoundedRect(-58,538,157,57,3);for(const x of [-56,94]){g.fillStyle(0x5a4230).fillRect(x,489,5,108);g.fillStyle(0xa78350).fillRect(x,489,2,108);}
  g.fillStyle(0x4d6a5b).fillPoints([{x:-65,y:493},{x:99,y:484},{x:111,y:511},{x:-70,y:521}],true);for(let i=0;i<6;i++)g.fillStyle(i%2?0xc0b48c:0x728a6c).fillPoints([{x:-64+i*28,y:493-i*1.5},{x:-43+i*28,y:492-i*1.5},{x:-40+i*28,y:519-i*1.6},{x:-63+i*28,y:520-i*1.6}],true);g.lineStyle(2,0x425c4a).lineBetween(-70,521,111,511);for(let i=0;i<12;i++)g.fillStyle(i%2?0x728a6c:0xb7ab82).fillRoundedRect(-69+i*15,517-i*.8,15,7,2);
  for(let i=8;i>=0;i--){const p=marketCratePoint(i);g.fillStyle(0x513b28).fillPoints([{x:p.x-19,y:p.y-10},{x:p.x+18,y:p.y-13},{x:p.x+20,y:p.y+6},{x:p.x-18,y:p.y+9}],true);g.fillStyle(0x80603d).fillPoints([{x:p.x-17,y:p.y-8},{x:p.x+16,y:p.y-11},{x:p.x+17,y:p.y+2},{x:p.x-16,y:p.y+5}],true);g.fillStyle(0xb08a55).fillPoints([{x:p.x-19,y:p.y+1},{x:p.x+20,y:p.y-2},{x:p.x+20,y:p.y+6},{x:p.x-18,y:p.y+9}],true);g.lineStyle(1,0xd0af76).lineBetween(p.x-18,p.y+1,p.x+19,p.y-2);g.lineStyle(1,0x755035).lineBetween(p.x-16,p.y+6,p.x+16,p.y+3);for(const dx of [-14,13])g.fillStyle(0x63452d).fillCircle(p.x+dx,p.y+4,1);}
  this.contents=scene.add.container(0,0);this.root.add(this.contents);
 }
 update(crates:readonly (MarketCrate|null)[]){this.contents.removeAll(true);for(const [i,c]of crates.entries()){if(!c)continue;const p=marketCratePoint(i),count=Math.min(12,c.count);for(let j=0;j<count;j++){const image=this.scene.add.image(p.x-11+(j%4)*7+(j%2)*1.2,p.y-5-Math.floor(j/4)*3,`market-product-${c.product}`).setDisplaySize(9,9);this.contents.add(image);}}}
 destroy(){this.root.destroy(true);}
}
export class MarketTruckArt{
 readonly root:Phaser.GameObjects.Container;private g:Phaser.GameObjects.Graphics;private cargo:Phaser.GameObjects.Container;
 constructor(private scene:Phaser.Scene){this.root=scene.add.container(-350,656).setDepth(70);this.g=scene.add.graphics();this.cargo=scene.add.container(0,0);this.root.add([this.g,this.cargo]);this.paint(false,0);}
 paint(door:boolean,wheel:number){const g=this.g;g.clear();g.fillStyle(0x293b2d,.28).fillEllipse(4,5,141,17);g.fillStyle(0x394a3b).fillRoundedRect(-66,-8,134,9,3);
  for(const x of [-44,44]){g.fillStyle(0x303b34).fillCircle(x,0,11);g.fillStyle(0x728578).fillCircle(x,0,6);g.lineStyle(1.5,0xc4c8ac).lineBetween(x-Math.cos(wheel)*4,-Math.sin(wheel)*4,x+Math.cos(wheel)*4,Math.sin(wheel)*4);}
  g.fillStyle(0x6c897a).fillRoundedRect(-66,-35,88,28,3);g.fillStyle(0xa5ad8b).fillRect(-65,-34,87,4);for(let i=0;i<4;i++)g.lineStyle(1,0x3d5d50).lineBetween(-63,-26+i*5,20,-26+i*5);g.fillStyle(0x637f70).fillPoints([{x:22,y:-9},{x:22,y:-49},{x:48,y:-49},{x:60,y:-34},{x:70,y:-30},{x:70,y:-9}],true);g.fillStyle(0xc1bb95).fillRoundedRect(21,-51,29,5,2);g.fillStyle(0x93bab3).fillPoints([{x:29,y:-44},{x:46,y:-44},{x:56,y:-32},{x:29,y:-32}],true);g.lineStyle(1,0xd2dcc2).lineBetween(31,-43,44,-43);g.fillStyle(0x475e50).fillRect(29,-28,23,18);g.fillStyle(0xb9c3a3).fillRect(45,-25,5,2);g.fillStyle(0xe7ce8d).fillRect(66,-24,5,6);g.fillStyle(0x9da38a).fillRect(65,-9,10,4);if(door){g.fillStyle(0x728e7b).fillPoints([{x:27,y:-29},{x:8,y:-19},{x:8,y:2},{x:27,y:-9}],true);g.lineStyle(1,0xb8bea0).lineBetween(9,-19,26,-28);}
 }
 setCargo(crates:readonly MarketCrate[]){this.cargo.removeAll(true);for(const [i,c]of crates.entries()){const x=-55+i%3*24,y=-18-Math.floor(i/3)*12,g=this.scene.add.graphics();g.fillStyle(0xb18a55).fillRoundedRect(x,y,22,12,1);g.lineStyle(1,0x725034).strokeRect(x,y,22,12);g.lineStyle(1,0xd9ba80).lineBetween(x+1,y+3,x+20,y+3);this.cargo.add(g);this.cargo.add(this.scene.add.image(x+11,y+4,`market-product-${c.product}`).setDisplaySize(10,10));}}
 destroy(){this.root.destroy(true);}
}
