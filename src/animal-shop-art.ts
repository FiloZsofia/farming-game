import Phaser from 'phaser';
import {worldText} from './world-text';
import {drawModernVillager,VILLAGER_SCALE} from './modern-npc-art';
import {drawAnimalItem,drawHen} from './livestock-art';
export function drawAnimalShop(scene:Phaser.Scene){
 const y0=5100,g=scene.add.graphics().setDepth(-1),rect=(x:number,y:number,w:number,h:number,c:number)=>g.fillStyle(c).fillRect(x,y+y0,w,h),line=(x:number,y:number,x2:number,y2:number,c:number,w=1)=>g.lineStyle(w,c).lineBetween(x,y+y0,x2,y2+y0);
 rect(0,0,800,600,0x263b31);rect(92,100,616,425,0x68563f);rect(100,108,600,404,0xcbb995);rect(100,110,600,90,0xc6ceaf);rect(100,195,600,8,0x7c7250);rect(100,203,600,309,0xb49165);
 for(let y=205;y<510;y+=15){line(101,y,698,y,0x806743);line(101,y+1,698,y+1,0xcfb081,.5);for(let x=110+(y%4)*21;x<690;x+=84)line(x,y,x,y+14,0x92764f,.6);}
 for(const x of [130,555]){rect(x-5,119,115,58,0x8a7959);rect(x,124,105,48,0xaec9b3);line(x+52,124,x+52,172,0xf0e0b7,3);line(x,148,x+105,148,0xf0e0b7,3);line(x+5,129,x+35,151,0xd6e0be,1.3);rect(x-9,176,123,5,0x9a7c54);}
 rect(300,326,220,103,0x788c68);for(let i=0;i<29;i++)line(305+i*7,330,305+i*7,425,0xa9b38b,.7);
 rect(112,275,81,10,0xae8a58);rect(118,285,5,122,0x735b40);rect(184,285,5,122,0x735b40);rect(113,374,80,6,0x9c7c4e);
 for(let i=0;i<3;i++){rect(120+i*22,247,18,27,0xb79e70);rect(120+i*22,246,18,4,0xd8bd87);line(125+i*22,254,125+i*22,266,0xe4d1a0,.8);rect(124+i*22,262,10,6,0x77916b);}
 drawAnimalItem(g,'feeder',153,y0+352);drawAnimalItem(g,'drinker',150,y0+454);
 rect(604,266,80,7,0xa27f50);rect(610,273,5,160,0x735c40);rect(674,273,5,160,0x735c40);rect(606,351,75,6,0x9d7e54);
 for(let i=0;i<3;i++){g.fillStyle(0xc5ac7d).fillEllipse(618+i*25,y0+248,22,26);line(608+i*25,239,628+i*25,239,0x9b7a4e);line(616+i*25,236,618+i*25,262,0xe1c895,.7);}
 drawAnimalItem(g,'perch',646,y0+339);drawAnimalItem(g,'dustBath',646,y0+417);
 rect(338,235,224,53,0x7b6042);rect(333,227,234,14,0xc0a377);for(let x=346;x<560;x+=24)line(x,244,x,283,0xa2865c);rect(456,216,29,12,0x7f7656);rect(459,216,11,8,0xf1dfb8);rect(472,216,11,8,0xd7c39a);
 rect(373,494,54,19,0x675c41);line(376,499,424,499,0xc0a575);line(376,505,424,505,0xc0a575);
 const title=worldText(scene,400,y0+145,'Állatosbolt',{fontFamily:'Georgia',fontSize:'17px',color:'#fff0c6'}).setOrigin(.5).setDepth(3);const sign=worldText(scene,400,y0+168,'Otthon, gondozás, apró lakók',{fontFamily:'Georgia',fontSize:'9px',color:'#625c41'}).setOrigin(.5).setDepth(3);
 const art=scene.add.container(0,0).setScale(VILLAGER_SCALE);drawModernVillager(scene,art,'roza');const person=scene.add.container(423,y0+235,[art]).setDepth(0).setName('shop-roza');
 const front=scene.add.graphics().setDepth(1);front.fillStyle(0x7b6042).fillRect(338,y0+235,224,53);front.fillStyle(0xc0a377).fillRect(333,y0+227,234,14);front.lineStyle(1,0xe4c997).lineBetween(337,y0+230,561,y0+230);for(let x=346;x<560;x+=24)front.lineStyle(1,0xa2865c).lineBetween(x,y0+244,x,y0+284);
 const background=scene.add.renderTexture(0,y0,800,600).setOrigin(0).setDepth(-1);background.draw(g,0,-y0);g.destroy();background.once('destroy',()=>{title.destroy();sign.destroy();});return{person,background,front};
}
