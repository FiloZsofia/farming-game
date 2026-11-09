import Phaser from 'phaser';
import {benchPose,benchPoint,villageLayout,nurseryDisplays,workshopWallLamps,type BenchPose} from './village-layout';
import {drawGreenhouse} from './nursery-art';
// Small scenery gets its own high-resolution cache: smooth joinery without enlarging the terrain texture.
function detail(scene:Phaser.Scene,x:number,y:number,w:number,h:number,paint:(g:Phaser.GameObjects.Graphics)=>void){
 const g=scene.add.graphics();paint(g);g.setScale(3);const image=scene.add.renderTexture(x,y,w*3,h*3).setOrigin(0).setScale(1/3).setDepth(-.25);image.draw(g,-x*3,-y*3);image.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);g.destroy();return image;
}
function brush(g:Phaser.GameObjects.Graphics){return{
 rect:(x:number,y:number,w:number,h:number,c:number,a=1)=>g.fillStyle(c,a).fillRect(x,y,w,h),
 oval:(x:number,y:number,w:number,h:number,c:number,a=1)=>g.fillStyle(c,a).fillEllipse(x,y,w,h),
 line:(x:number,y:number,xx:number,yy:number,c:number,w=1,a=1)=>g.lineStyle(w,c,a).lineBetween(x,y,xx,yy),
 poly:(p:number[][],c:number,a=1)=>g.fillStyle(c,a).fillPoints(p.map(([x,y])=>({x,y})),true)
};}
function leaf(g:Phaser.GameObjects.Graphics,x:number,y:number,length:number,angle:number,color:number){const c=Math.cos(angle),s=Math.sin(angle),points=Array.from({length:12},(_,i)=>{const a=i*Math.PI/6,u=(1+Math.cos(a))*length/2,v=Math.sin(a)*length*.28;return{x:x+u*c-v*s,y:y+u*s+v*c};});g.fillStyle(color).fillPoints(points,true);g.lineStyle(.35,0xabc08a,.55).lineBetween(x,y,x+length*c*.82,y+length*s*.82);}
function bench(g:Phaser.GameObjects.Graphics,pose:BenchPose){
 const {poly,line,oval}=brush(g),p=(x:number,y:number,z=0)=>{const q=benchPoint(pose,x,y);return{x:q.x,y:pose.y+(q.y-pose.y)*.42-z};};
 const face=(points:number[][],c:number)=>poly(points.map(([x,y,z])=>{const q=p(x,y,z);return[q.x,q.y];}),c);
 const edge=(x:number,y:number,z:number,xx:number,yy:number,zz:number,c:number,w=.65)=>{const a=p(x,y,z),b=p(xx,yy,zz);line(a.x,a.y,b.x,b.y,c,w);};
 oval(pose.x+3,pose.y+6,65,20,0x3d5039,.17);
 for(const x of [-24,24])for(const y of [-8,9]){edge(x,y,0,x,y,y<0?32:12,0x606555,2.7);edge(x-.5,y,1,x-.5,y,y<0?31:11,0x93937c,.7);}
 for(const z of [19,26]){face([[-28,-10,z-2.4],[28,-10,z-2.4],[28,-10,z+2.4],[-28,-10,z+2.4]],0xa18a69);edge(-28,-10,z+2,28,-10,z+2,0xc2af8b);edge(-28,-10,z-2.4,28,-10,z-2.4,0x7d7059,.7);edge(-25,-10,z,25,-10,z,0xb5a07b,.4);}
 for(const y of [-5,1,7]){face([[-29,y,12],[29,y,12],[29,y+4.8,12],[-29,y+4.8,12]],0xb19a76);face([[-29,y+4.8,12],[29,y+4.8,12],[29,y+4.8,10.8],[-29,y+4.8,10.8]],0x8f7e61);edge(-28,y+.8,12,28,y+.8,12,0xc6b48e,.5);}
 for(const x of [-26,26]){edge(x,-9,18,x,11,18,0x737963,2);edge(x,-8,18.5,x,10,18.5,0xa3a58c,.6);for(const z of [19,26]){const q=p(x,-10,z);oval(q.x,q.y,1.3,1.3,0x6e6a55);}}
}
function fountain(g:Phaser.GameObjects.Graphics){
 const {oval,rect,line}=brush(g);oval(479,1092,68,28,0x45533d,.19);oval(476,1089,61,32,0x8e8d78);oval(476,1085,60,35,0xa6a38a);oval(476,1081,60,32,0xc2b99c);oval(476,1080,49,25,0x8d9583);oval(476,1079,45,22,0x678f89);oval(474,1077,37,15,0x8eafa1,.72);
 for(let i=0;i<10;i++){const a=i*Math.PI/5,x=476+Math.cos(a)*27,y=1081+Math.sin(a)*14;line(x,y,x+Math.cos(a)*2,y+Math.sin(a)*2,0x9d9980,.6,.7);}
 g.lineStyle(.7,0xd5d5b4,.8).beginPath().arc(476,1080,27,Math.PI*1.1,Math.PI*1.86).strokePath();
 rect(473,1058,7,20,0x9b9d87);rect(473,1059,2,18,0xc2bda0);oval(476,1075,15,7,0xaaa98f);oval(476,1058,25,10,0xa7a58b);oval(476,1055,26,9,0xd1c7aa);oval(476,1054,20,6,0x7fa59a);oval(476,1053,14,3,0xb2cfc0);
 g.lineStyle(1.3,0xd1e4d0,.85).beginPath().moveTo(476,1053).lineTo(476,1047).strokePath();oval(476,1047,2.4,2.7,0xdbe9d3,.9);line(465,1058,466,1077,0xa9cbb8,.65,.7);line(487,1058,485,1077,0xb5d5bf,.65,.7);
 for(const [x,y]of [[463,1081],[487,1080],[474,1086]]){g.lineStyle(.65,0xc7dccc,.75).strokeEllipse(x,y,7,2.2);oval(x+2,y-.8,1.5,.65,0xe1e5ce);}
}
function saplingDisplay(g:Phaser.GameObjects.Graphics,left:number,plants:readonly {x:number;y:number}[],width=54){
 const {rect,poly,line,oval}=brush(g),y=plants[0].y-4;oval(left+width/2,y+18,width+7,10,0x3c5139,.18);
 for(const x of [left+4,left+width-6]){rect(x,y-3,3,22,0x8b7d60);rect(x,y,1,18,0xc1af89);}poly([[left,y-4],[left+width,y-4],[left+width+4,y],[left+3,y]],0xbbaa87);rect(left+2,y,width+1,4,0x9d8d6c);
 for(let i=0;i<5;i++)line(left+4,y-3+i*.7,left+width-1,y-3+i*.7,0xc3b491,.45,.75);
 plants.forEach((p,i)=>{const base=p.y-5,top=base-17,crown=base-(i%2?40:45);oval(p.x+1,base+1,15,4,0x5a5541,.2);poly([[p.x-7,top],[p.x+7,top],[p.x+5,base],[p.x-5,base]],0x9c7755);poly([[p.x+3,top],[p.x+7,top],[p.x+5,base],[p.x+2,base]],0x816446);rect(p.x-8,top,16,3,0xb6966e);oval(p.x,top,13,4,0x5b5840);line(p.x,top-1,p.x,crown+4,0x80674b,1.7);line(p.x-.4,top-2,p.x-.4,crown+5,0xb29b70,.5);
  for(let k=0;k<6;k++){const yy=crown+5+k*3,side=k%2?1:-1;line(p.x,yy+5,p.x+side*5,yy,0x7e7650,.6);leaf(g,p.x+side*2,yy+2,8+(k%3),side<0?-2.7:-.5,k%3===0?0x8da46b:k%3===1?0x6f9159:0x5e8051);}leaf(g,p.x,crown+4,9,-1.6,0x8fa873);
  rect(p.x+4,top-3,3,5,0xd5c69d);line(p.x+5,top-2,p.x+6,top-2,0x897c5b,.4);
 });
 // The front apron is last; it does not cover pot rims or trunks.
 rect(left+2,y+4,width+1,3,0x9a8b6b);line(left+3,y+4,left+width+1,y+4,0xc5b28d,.65);for(const x of [left+7,left+width-4])oval(x,y+5.5,1.1,1.1,0x706c52);
}
function nurseryDecor(g:Phaser.GameObjects.Graphics){
 const {rect,oval,line,poly}=brush(g);
 // Trellis and individual leaves are wall mounted, behind the display plants.
 for(const x of [510,519])line(x,871,x,934,0xa49770,.7,.75);for(let i=0;i<7;i++)line(509,876+i*8,522,876+i*8,0xb3a27b,.6,.7);
 for(let i=0;i<12;i++){const x=514+Math.sin(i*.65)*3,y=875+i*4.7;line(x,y,x+Math.sin((i+1)*.65)*2,y+5,0x6b7951,1.1);leaf(g,x,y,6.5,i%2?-.6:-2.8,i%3?0x79955f:0x91a76e);if(i%4===0){for(let j=0;j<5;j++)oval(x-4+Math.cos(j*1.25)*1.4,y-1+Math.sin(j*1.25)*1.3,2,2,0xd5b7ad);oval(x-4,y-1,1.4,1.4,0xd9c998);}}
 for(const x of [541,640]){poly([[x-16,907],[x+16,907],[x+13,920],[x-13,920]],0xa18060);poly([[x+10,909],[x+16,907],[x+13,920],[x+9,920]],0x876c52);rect(x-17,906,34,3,0xc1a17b);oval(x,907,29,4,0x626341);for(let i=0;i<7;i++){const px=x-12+i*4,py=896-(i%3)*2;line(px,907,px,py,0x6c8453,.7);leaf(g,px,py+5,4,i%2?-2.5:-.6,0x8ea56b);for(let j=0;j<4;j++)oval(px+Math.cos(j*1.57)*1.3,py+Math.sin(j*1.57)*1.3,2.4,2.4,i%2?0xd0b0a6:0xe0d2ac);oval(px,py,1.4,1.4,0xc9b16c);}}
 // A recognizable metal can: loop handle, open filler, tapered spout and perforated rose.
 oval(488,947,20,6,0x46583c,.18);g.lineStyle(2,0x7d927b).strokeEllipse(480,937,8,13);oval(488,939,14,16,0x819982);rect(482,935,12,8,0x819982);oval(488,945,13,5,0x6e8770);oval(488,932,12,4,0xa6b29a);oval(488,932,7,2.4,0x526e5c);poly([[493,939],[501,930],[504,931],[496,942]],0x91a38b);g.lineStyle(2,0xc3c7a6).lineBetween(494,939,502,931);oval(504,930,6,3,0xb5bda0);for(const dx of [-1,1])oval(504+dx,930,.65,.65,0x65775e);line(485,937,485,943,0xb6bda1,.6);
 // Long seedling tray with a rim, soil cells, labels and paired seed leaves.
 poly([[481,965],[504,965],[502,975],[483,975]],0x927959);rect(480,963,25,3,0xb7a17a);rect(482,964,21,2,0x55583d);for(let i=0;i<5;i++){const x=484+i*4;line(x,964,x,958-(i%2),0x718a50,.7);leaf(g,x,960,3.6,-2.5,0x8da768);leaf(g,x,960,3.6,-.65,0xa2b77b);}rect(501,956,2,7,0xd2c5a0);
 for(const d of nurseryDisplays)saplingDisplay(g,d.left,d.plants,d.width);
}
function fishBarrel(g:Phaser.GameObjects.Graphics){
 const {oval,poly,line}=brush(g);oval(867,1109,39,12,0x3e5844,.18);poly([[849,1085],[881,1085],[884,1097],[881,1108],[851,1108],[847,1097]],0x9d8965);for(let i=0;i<8;i++){const x=850+i*4;line(x,1087,x+(i<4?-1:1),1105,0x786e53,.65);line(x+1,1088,x+1,1105,0xb3a17b,.5);}oval(866,1107,30,6,0x897b5d);for(const y of [1092,1103]){g.lineStyle(2,0x6d8073).beginPath().moveTo(849,y).lineTo(854,y+1.7).lineTo(878,y+1.7).lineTo(883,y).strokePath();line(852,y-.6,879,y-.6,0xa4b09a,.65);oval(853,y,.8,.8,0x50695e);oval(879,y,.8,.8,0x50695e);}oval(865,1085,35,15,0xb7a47d);oval(865,1085,30,11,0x746f52);oval(865,1084.5,27,8.5,0x6a9d92);oval(862,1083,19,4,0xa4c1ab,.7);leaf(g,872,1085,6,-.35,0x85a475);g.lineStyle(.5,0xc5d6bc).strokeEllipse(861,1084,9,2.3);
}
function workshopDecor(g:Phaser.GameObjects.Graphics){
 const {rect,line,poly,oval}=brush(g);
 // Workbench and rack; each metal tool has a distinct head and handle.
 for(const x of [568,611]){rect(x,1302,3,30,0x85765b);line(x,1303,x,1329,0xc0ac83,.6);}poly([[563,1297],[615,1297],[621,1301],[568,1301]],0xb3a07b);rect(567,1301,53,4,0x8e7d5c);line(568,1301,618,1301,0xc8b58d,.7);
 for(let i=0;i<4;i++){const x=576+i*11;line(x,1307,x-1,1320,0x9f8762,1.6);if(i===0){rect(x-5,1319,9,3,0x8b9b8e);line(x-5,1319,x+4,1319,0xc5cbb6,.6);}else if(i===1){poly([[x-3,1318],[x+3,1318],[x+2,1325],[x-2,1325]],0x9aa99a);line(x,1319,x,1324,0xd0d5be,.6);}else if(i===2){g.lineStyle(1.2,0x8e9e91).strokeEllipse(x,1321,5,6);}else{line(x-3,1318,x-3,1324,0x9ca99b);line(x,1318,x,1324,0x9ca99b);line(x+3,1318,x+3,1324,0x9ca99b);line(x-3,1318,x+3,1318,0x9ca99b);}}
 // Stacked boards have individual end grain; a woven basket stands beside them.
 for(let i=0;i<5;i++){const y=1325-i*4;poly([[705,y],[746,y-2],[752,y+1],[710,y+3]],i%2?0xaf9870:0xbba57e);line(710,y+2,750,y,0x8f7b5b,.6);line(710,y,744,y-1.5,0xd1bd96,.45);}
 g.lineStyle(2,0x9b8961).strokeEllipse(759,1317,17,23);g.lineStyle(.6,0xc8b58b).strokeEllipse(759,1317,14,21);poly([[746,1320],[772,1320],[769,1336],[749,1336]],0xae9366);oval(759,1320,27,9,0xc5ac7b);oval(759,1320,22,5.5,0x7c6d4a);for(let i=0;i<5;i++)line(748,1323+i*2.6,771,1323+i*2.6,0xd0b98b,.65);for(let i=0;i<7;i++)line(749+i*3.2,1322,750+i*3,1334,0x8c7955,.55);
 for(const p of workshopWallLamps){line(p.x-5,p.y-8,p.x,p.y-8,0x65705a,1.5);rect(p.x-5,p.y-6,10,13,0x6b775e);rect(p.x-3,p.y-4,6,8,0xc5c5a0);line(p.x,p.y-4,p.x,p.y+4,0x8b9678,.7);poly([[p.x-7,p.y-6],[p.x,p.y-12],[p.x+7,p.y-6]],0x7b856b);line(p.x-6,p.y-6,p.x,p.y-11,0xb2b497,.7);rect(p.x-6,p.y+6,12,2,0x7b846a);}
}
export function drawVillageDetails(scene:Phaser.Scene){
 for(const b of villageLayout.benches){const p=benchPose(b.angle);detail(scene,p.x-42,p.y-43,84,60,g=>bench(g,p));}
 detail(scene,440,1039,76,69,fountain);detail(scene,474,866,218,165,nurseryDecor);detail(scene,677,798,88,121,drawGreenhouse);detail(scene,843,1075,46,42,fishBarrel);detail(scene,558,1278,223,68,workshopDecor);
}
