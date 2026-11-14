import {paintCabInterior} from './market-cab-interior';
import Phaser from 'phaser';
import {farmProducts,farmProductIcon,type FarmProduct} from './farm-products';
import {itemIcon} from './item-icons';
import {marketProducts} from './market-trial';
export {marketStandOffset,marketStand,marketFenceGap} from './market-site';
import {marketStandOffset} from './market-site';
export {marketCratePoint} from './market-site';
import {marketCratePoint} from './market-site';
export async function loadMarketIcons(scene:Phaser.Scene,production=false){await Promise.all((production?farmProducts:marketProducts).map(async kind=>{const key=`market-product-${kind}`;if(scene.textures.exists(key))return;const svg=itemIcon(production?farmProductIcon(kind as FarmProduct):kind as Parameters<typeof itemIcon>[0]);svg.setAttribute('width','72');svg.setAttribute('height','72');const source='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(new XMLSerializer().serializeToString(svg)),img=new Image();await new Promise<void>((resolve,reject)=>{img.onload=()=>resolve();img.onerror=()=>reject(new Error('A terményikon nem tölthető be.'));img.src=source;});scene.textures.addImage(key,img);}));}
export class MarketStandArt{
 readonly root:Phaser.GameObjects.Container;private contents:Phaser.GameObjects.Container;
 constructor(private scene:Phaser.Scene,private twoSided=false){
  this.root=scene.add.container(marketStandOffset,0).setDepth(50);const g=scene.add.graphics();this.root.add(g);
  g.fillStyle(0x293d2d,.24).fillEllipse(-26,595,320,73);
  // Weathered planked counter, raised tiers, substantial posts and diagonal braces.
  if(!twoSided)g.fillStyle(0x503c2c).fillRoundedRect(-174,482,276,115,4);
  for(let i=0;i<(twoSided?0:18);i++){const x=-171+i*15;g.fillStyle(i%3===0?0x8c6b44:i%2?0x765735:0x80613e).fillRect(x,485,14,107);g.lineStyle(1,0xb08b58,.35).lineBetween(x+3,490,x+3,583);g.lineStyle(1,0x4e392a,.6).lineBetween(x+11,510,x+11,576);}
  g.fillStyle(0xb4925c).fillRect(-176,587,280,7);g.fillStyle(0x4b3a2c).fillRect(-171,594,269,5);
  for(const x of [-174,96]){
   g.fillStyle(0x513e2c).fillRect(x,405,9,196);g.fillStyle(0x9d7c4a).fillRect(x,405,5,192);g.fillStyle(0xc3a16b).fillRect(x+1,411,1,176);
   g.lineStyle(5,0x705333).lineBetween(x+4,459,x+(x<0?27:-24),434);g.lineStyle(1,0xc5a16a).lineBetween(x+4,456,x+(x<0?27:-24),432);
   g.fillStyle(0x443a2b).fillRoundedRect(x-2,592,13,9,2);
  }
  for(let row=0;row<3;row++){const y=marketCratePoint(row*3).y;g.fillStyle(0x43362a).fillRect(-169,y+18,266,5);g.fillStyle(0xb08e59).fillRect(-169,y+14,266,4);}
  // A shallow pitched canvas roof: curved panels, stitched seams and a scalloped valance.
  const roof=this.scene.add.graphics();this.root.add(roof);
  roof.fillStyle(0x283d32,.28).fillPoints([{x:-189,y:458},{x:108,y:438},{x:118,y:459},{x:-187,y:480}],true);
  for(let i=0;i<10;i++){
   const x=-188+i*30,y=425-i*1.5,color=i%2?0xd5c8a0:0x6e8871;
   roof.fillStyle(color).fillPoints([{x:x+6,y:y-9},{x:x+35,y:y-10.5},{x:x+31,y:y+12},{x:x+31,y:y+29},{x:x+1,y:y+31},{x:x-1,y:y+13}],true);
   roof.fillStyle(i%2?0xb8aa82:0x566f5b,.65).fillPoints([{x:x+1,y:y+16},{x:x+31,y:y+14},{x:x+31,y:y+29},{x:x+1,y:y+31}],true);
   roof.lineStyle(1,i%2?0xede0b9:0x9eb198,.85).lineBetween(x+7,y-6,x+2,y+27);
   for(let k=0;k<4;k++)roof.lineStyle(.6,0x455945,.5).lineBetween(x+7+k*5,y-5-k*.25,x+7+k*5,y-3-k*.25);
   roof.fillStyle(color).fillPoints([{x:x+1,y:y+30},{x:x+31,y:y+28},{x:x+31,y:y+36},{x:x+25,y:y+40},{x:x+8,y:y+41},{x:x+1,y:y+37}],true);
   roof.lineStyle(1,i%2?0xa99d76:0x4c6753).lineBetween(x+5,y+37,x+26,y+36);
  }
  roof.lineStyle(3,0x536349).lineBetween(-182,415,117,400);roof.lineStyle(1,0xe2d2a6,.7).lineBetween(-182,414,117,399);
  // Tie ropes visibly fasten the fabric to the wooden uprights.
  for(const [x,y]of [[-172,454],[99,441]]){roof.lineStyle(1.2,0xd6c398).lineBetween(x,y,x+3,y+17);roof.strokeEllipse(x+2,y+11,6,4);}
  if(twoSided){g.fillStyle(0x5f472f).fillRect(-176,466,280,4);g.fillStyle(0xb99b67).fillPoints([{x:-178,y:461},{x:103,y:461},{x:106,y:466},{x:-178,y:466}],true);g.lineStyle(1,0xd3b780).lineBetween(-175,462,101,462);}
  this.contents=scene.add.container(0,0);this.root.add(this.contents);
  // Each crate layers its fruit behind the front rim, not over the slats.
  for(let i=0;i<9;i++)this.drawCrate(i);
 }
 private drawCrate(i:number){
  const p=marketCratePoint(i),g=this.scene.add.graphics();this.contents.add(g);
  g.fillStyle(0x352e24,.5).fillPoints([{x:p.x-38,y:p.y-15},{x:p.x+36,y:p.y-21},{x:p.x+40,y:p.y+13},{x:p.x-35,y:p.y+19}],true);
  g.fillStyle(0x60442e).fillPoints([{x:p.x-35,y:p.y-13},{x:p.x+33,y:p.y-18},{x:p.x+35,y:p.y+5},{x:p.x-33,y:p.y+10}],true);
  for(let k=0;k<4;k++)g.lineStyle(1,0x8e6c44,.6).lineBetween(p.x-31,p.y-10+k*5,p.x+31,p.y-15+k*5);
  g.lineStyle(3,0xc4a06a).lineBetween(p.x-37,p.y-15,p.x+35,p.y-21);
  g.lineStyle(3,0xa47b49).lineBetween(p.x-37,p.y-15,p.x-35,p.y+18);g.lineBetween(p.x+35,p.y-21,p.x+39,p.y+12);
 }
 update(crates:readonly ({product:string;count:number}|null)[]){
  // Keep the frames; replace only produce and their foreground rims.
  this.root.getAll().filter(child=>child.name==='market-produce').forEach(child=>child.destroy());
  const layer=this.scene.add.container(0,0).setName('market-produce');this.root.add(layer);
  for(let i=0;i<9;i++){
   const p=marketCratePoint(i),c=crates[i];
   if(c){const count=Math.min(8,c.count);for(let j=0;j<count;j++){const row=Math.floor(j/4),x=p.x-25+j%4*17+(row?4:0),y=p.y-3-row*10-(j%2)*1.5;layer.add(this.scene.add.image(x,y,`market-product-${c.product}`).setDisplaySize(21,21).setRotation((j%3-1)*.06));}}
   const rim=this.scene.add.graphics();layer.add(rim);
   rim.fillStyle(0xaa7d48).fillPoints([{x:p.x-36,y:p.y+7},{x:p.x+39,y:p.y+1},{x:p.x+39,y:p.y+13},{x:p.x-35,y:p.y+19}],true);
   rim.lineStyle(2,0xd4b17b).lineBetween(p.x-36,p.y+7,p.x+39,p.y+1);rim.lineStyle(1,0x765334).lineBetween(p.x-33,p.y+13,p.x+35,p.y+7);
   rim.fillStyle(0x42352a).fillRoundedRect(p.x-9,p.y+10,18,3,1);
   for(const dx of [-30,33]){rim.fillStyle(0xd6b786).fillRect(p.x+dx,p.y+5+(dx<0?4:0),2,9);rim.fillStyle(0x5a4630).fillCircle(p.x+dx+1,p.y+9+(dx<0?4:0),.8);}
  }
 }
 destroy(){this.root.destroy(true);}
}

type Vertex={x:number;y:number;z:number};
type Face={vertices:Vertex[];color:number;edge?:number;alpha?:number};
export class MarketTruckArt{
 readonly root:Phaser.GameObjects.Container;private g:Phaser.GameObjects.Graphics;private front:Phaser.GameObjects.Graphics;private interior:Phaser.GameObjects.Graphics;private windowMask:Phaser.GameObjects.Graphics;private doorArt:Phaser.GameObjects.Graphics;private sway=0;private driver:Phaser.GameObjects.Graphics;private glass:Phaser.GameObjects.Graphics;private cargo:Phaser.GameObjects.Container;private crates:readonly {product:string;count:number}[]=[];
 constructor(private scene:Phaser.Scene){this.root=scene.add.container(-700,695).setDepth(70);this.g=scene.add.graphics();this.cargo=scene.add.container(0,0);this.front=scene.add.graphics();this.interior=scene.add.graphics();this.doorArt=scene.add.graphics();this.windowMask=scene.add.graphics().setVisible(false);this.driver=scene.add.graphics();this.glass=scene.add.graphics();this.root.add([this.g,this.cargo,this.front,this.interior,this.driver,this.doorArt,this.glass]);const mask=this.windowMask.createGeometryMask();this.interior.setMask(mask);this.driver.setMask(mask);this.root.once('destroy',()=>{this.windowMask.destroy();mask.destroy();});this.paint(false,0);}
 paint(door:boolean,wheel:number,heading=0,moving=false,time=0,occupied=!door){
  const g=this.g,c=Math.cos(heading),s=Math.sin(heading),faces:Face[]=[],frontFaces:Face[]=[],driverFaces:Face[]=[],glassFaces:Face[]=[],doorFaces:Face[]=[];let cab=false,doorLayer=false;
  const project=(v:Vertex)=>({x:v.x*c-v.y*s,y:(v.x*s+v.y*c)*.48-v.z});
  const face=(vertices:Vertex[],color:number,edge?:number,alpha=1)=>(doorLayer?doorFaces:cab?frontFaces:faces).push({vertices,color,edge,alpha});
  const quad=(coords:number[][],color:number,edge?:number,alpha=1)=>face(coords.map(([x,y,z])=>({x,y,z})),color,edge,alpha);
  const box=(x0:number,x1:number,y0:number,y1:number,z0:number,z1:number,top:number,near:number,end:number)=>{
   quad([[x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1]],top);
   const y=c>=0?y1:y0,x=s>=0?x1:x0;
   quad([[x0,y,z0],[x1,y,z0],[x1,y,z1],[x0,y,z1]],near);
   quad([[x,y0,z0],[x,y1,z0],[x,y1,z1],[x,y0,z1]],end);
  };
  const disc=(x:number,y:number,z:number,r:number,color:number)=>face(Array.from({length:20},(_,i)=>({x:x+Math.cos(i*Math.PI/10)*r,y,z:z+Math.sin(i*Math.PI/10)*r})),color);
  g.clear();this.front.clear();this.driver.clear();this.doorArt.clear();this.glass.clear();this.windowMask.clear().setPosition(this.root.x,this.root.y);g.fillStyle(0x26362d,.25).fillEllipse(0,5,Math.abs(c)*270+Math.abs(s)*96,Math.abs(s)*108+Math.abs(c)*43);
  box(-126,120,-30,30,18,29,0x4c5b4d,0x33463e,0x34453e);
  for(const x of [-82,80])for(const side of [-1,1]){
   const y=side*36;for(let i=0;i<20;i++){const a=i*Math.PI/10,b=(i+1)*Math.PI/10;quad([[x+Math.cos(a)*17,y-5,17+Math.sin(a)*17],[x+Math.cos(b)*17,y-5,17+Math.sin(b)*17],[x+Math.cos(b)*17,y+5,17+Math.sin(b)*17],[x+Math.cos(a)*17,y+5,17+Math.sin(a)*17]],i%2?0x303a33:0x394239);}disc(x,y+side*5,17,17,0x2e3832);disc(x,y+side*5.3,17,11,0x626b60);disc(x,y+side*5.6,17,7,0xb6b99f);disc(x,y+side*5.8,17,3,0x536157);
   for(let j=0;j<5;j++){const a=wheel+j*Math.PI*2/5,px=x+Math.cos(a)*6,pz=17+Math.sin(a)*6;disc(px,y+side*6,pz,1,0x414d44);}
  }
  // Timber-lined flatbed, folded metal tailgate and pressed side panels.
  box(-124,8,-34,34,29,37,0xa99466,0x6a8776,0x607c6e);
  for(let k=0;k<7;k++)box(-121,5,-31+k*9,-30+k*9,37,37.4,0x776749,0x776749,0x776749);
  for(const y of [-35,32]){box(-124,8,y,y+3,37,54,0xb6bea0,0x789280,0x5f7d6e);for(let k=0;k<4;k++)box(-120+k*31,-118+k*31,y-1,y+4,37,53,0x97aa91,0x94a58d,0x698371);}
  box(-126,-122,-35,35,31,55,0xb7b99b,0x76917e,0x6a8472);
  // Nine full-sized cargo crates sit in the bed, with the same visible produce.
  this.crates.forEach((_,i)=>{const x=-118+i%3*40,y=-30+Math.floor(i/3)*21;box(x,x+36,y,y+18,38,58,0xc7a36a,0xa27a46,0x89633c);box(x+3,x+33,y+2,y+16,58,59,0x715537,0x715537,0x715537);});
  // Sloped cab, cream roof, dark window seals, glass reflections and interior.
  cab=true;
  const side=c>=0?35:-35;
  for(const y of [-34,34])quad([[10,y,29],[82,y,29],[82,y,59],[64,y,91],[16,y,91],[10,y,66]],y*side>0?0x75917e:0x678574,0x506b5d);
  quad([[10,-34,66],[10,34,66],[16,34,91],[16,-34,91]],0x577665);
  quad([[64,-34,91],[64,34,91],[82,34,59],[82,-34,59]],0x3e594e);
  glassFaces.push({vertices:[[67,-29,86],[67,29,86],[79,29,64],[79,-29,64]].map(([x,y,z])=>({x,y,z})),color:0x9ebfb3,alpha:.27});
  glassFaces.push({vertices:[[68,-27,85],[68,-24,85],[78,-24,66],[78,-27,66]].map(([x,y,z])=>({x,y,z})),color:0xe4e8cd,alpha:.45});
  box(14,66,-37,37,90,94,0xd4c6a0,0xb7ae8b,0xada785);
  for(const y of [-30,30])box(18,62,y,y+1,94,94.3,0xb5ab87,0xb5ab87,0xb5ab87);
  for(const y of [-35,35]){
   quad([[21,y,62],[79,y,62],[63,y,88],[21,y,88]],0x344e45,0xc0c7a6);
   if(y===side&&!(door&&y>0)){
   glassFaces.push({vertices:[[24,y,65],[74,y,65],[61,y,85],[24,y,85]].map(([x,y,z])=>({x,y,z})),color:0x99b8aa,alpha:.22});
   glassFaces.push({vertices:[[26,y,67],[28,y,67],[28,y,84],[26,y,84]].map(([x,y,z])=>({x,y,z})),color:0xd3dbc0,alpha:.4});
   }
   box(24,69,y-1,y+1,32,61,0x7d9882,0x718d79,0x647f6c);
   box(58,66,y-1.3,y+1.3,59,61,0xc7cbb0,0xb5bda2,0xa0ae91);
   box(69,76,y*1.2-2,y*1.2+2,65,71,0x43594d,0x344e43,0x384f43);
  }
  // A seated Mara is drawn behind translucent panes, in the visible window plane.
  if(!door&&occupied){
   const frontView=Math.abs(s)>.55;
   const driverPoint=(u:number,z:number):Vertex=>frontView?{x:82-(z-59)*18/32,y:14+u,z}:{x:46+u,y:side,z};
   const driverShape=(points:number[][],color:number)=>driverFaces.push({vertices:points.map(([u,z])=>driverPoint(u,z)),color});
   driverShape([[-8,67],[9,67],[7,72],[2,74],[-4,73]],0x41675f);
   driverShape([[-3,72],[1,70],[4,72],[2,74],[-1,74]],0xd9cba9);
   driverShape([[-4.5,81],[-3,84],[2,84],[4.8,81],[4.1,75],[1,72],[-2,73],[-4.5,77]],0x654b33);
   driverShape([[-3.5,80],[3,81],[3.5,77],[1.5,74],[-1,74],[-3.5,77]],0xe8bb92);
   driverShape([[-3.5,81],[-2,83],[2.5,82.5],[3.8,81],[-1,80]],0x80603e);
   for(const u of frontView?[-1.8,1.2]:[.8])driverShape([[u,78.5],[u+.9,78.5],[u+.9,77.3],[u,77.3]],0x344338);
   driverShape([[-.5,75.6],[1,75.3],[2,76],[-.5,76]],0xa76855);
   driverShape([[-4.5,79],[-3.6,78],[-3.4,73.5],[-5.1,73],[-5.5,76]],0x65452f);
   driverShape([[5,70],[9.5,69.5],[10,71],[6,72]],0xd3ad83);
  }
  box(82,120,-33,33,30,57,0x92a38a,0x698571,0x587666);box(85,116,-29,29,57,59,0xa8b194,0x7e947c,0x7c927b);box(86,115,-.5,.5,59,59.4,0xc1c5a4,0xc1c5a4,0xc1c5a4);
  box(120,122,-24,24,37,48,0x485a4c,0x3d5044,0x35483e);
  for(const z of [39,42,45])box(122,123,-21,21,z,z+1,0xb9bca1,0x9da98c,0xaeb79b);
  for(const y of [-28,22])box(121,123,y,y+6,47,54,0xeee0ae,0xddd19d,0xf0dc9d);
  box(119,128,-37,37,25,30,0xc1bda0,0x8f9b85,0xa3ad94);
  box(-129,-124,-36,36,23,27,0xb1b49a,0x879681,0x96a08a);
  for(const y of [-30,24])box(-128,-126,y,y+6,33,39,0x925947,0x9c5947,0xbd7251);
  if(door){
   doorLayer=true;
   // A hinged door swings toward the viewer, with its own open window frame.
   quad([[70,35,32],[25,65,32],[25,65,64],[70,35,64]],0x77947e,0xa9b99b);
   quad([[70,35,64],[25,65,64],[25,65,83],[59,42,83]],0xabc0aa,0xd0d3b0,.2);
  }
  // Apertures reveal the cabin, while the roof, pillars and doors stay solid.
  const apertures=[[[24,side,65],[74,side,65],[61,side,85],[24,side,85]],[[67,-29,86],[67,29,86],[79,29,64],[79,-29,64]]];
  if(door)apertures.push([[24,35,33],[69,35,33],[69,35,64],[61,35,85],[24,35,85]]);
  for(const pane of apertures)this.windowMask.fillStyle(0xffffff).fillPoints(pane.map(([x,y,z])=>project({x,y,z})),true);
  this.sway+=((moving?Math.sin(time*3.5)*1.1:0)-this.sway)*.08;
  paintCabInterior(this.interior,heading,project,this.sway);
  const depth=(f:Face)=>f.vertices.reduce((n,v)=>n+v.x*s+v.y*c+v.z*.48,0)/f.vertices.length;
  for(const [target,list]of [[g,faces],[this.front,frontFaces],[this.driver,driverFaces],[this.doorArt,doorFaces],[this.glass,glassFaces]] as const){if(target!==this.driver)list.sort((a,b)=>depth(a)-depth(b));for(const f of list){const points=f.vertices.map(project);target.fillStyle(f.color,f.alpha??1).fillPoints(points,true);if(f.edge)target.lineStyle(.8,f.edge,.85).strokePoints(points,true);}}
  // Sun-faded, hand-painted details stay attached to the moving door and bed.
  if(Math.abs(c)>.15){
   const y=c>=0?36.4:-36.4,decal=this.doorArt;
   const point=(x:number,z:number)=>project({x,y:door&&c>=0?65-(x-25)*30/45:y,z});
   for(let i=0;i<6;i++){const a=i*Math.PI/3,cx=43+Math.cos(a)*3,cz=47+Math.sin(a)*3;const petal=Array.from({length:10},(_,j)=>point(cx+Math.cos(j*Math.PI/5)*1.9,cz+Math.sin(j*Math.PI/5)*1.9));decal.fillStyle(i%2?0xd6c797:0xe6d8ad,.85).fillPoints(petal,true);}
   decal.fillStyle(0xc49a58).fillPoints(Array.from({length:12},(_,i)=>point(43+Math.cos(i*Math.PI/6)*1.8,47+Math.sin(i*Math.PI/6)*1.8)),true);
   const peace=(dx:number,dz:number)=>project({x:-99+dx,y,z:45+dz}),ring=Array.from({length:25},(_,i)=>peace(Math.cos(i*Math.PI/12)*4,Math.sin(i*Math.PI/12)*4));
   decal.lineStyle(.7,0xd8cca6,.8).strokePoints(ring,false);for(const [a,b]of [[[0,4],[0,-4]],[[0,0],[-2.8,-2.8]],[[0,0],[2.8,-2.8]]]){const p=peace(a[0],a[1]),q=peace(b[0],b[1]);decal.lineBetween(p.x,p.y,q.x,q.y);}
  }
  this.crates.forEach((_,i)=>{const p=project({x:-100+i%3*40,y:-21+Math.floor(i/3)*21,z:63});for(let j=0;j<3;j++)(this.cargo.list[i*3+j] as Phaser.GameObjects.Image).setPosition(p.x+(j-1)*9*c,p.y+(j-1)*9*s*.48);});
 }
 setCargo(crates:readonly {product:string;count:number}[]){this.crates=[...crates];this.cargo.removeAll(true);for(const crate of crates)for(let j=0;j<3;j++)this.cargo.add(this.scene.add.image(0,0,`market-product-${crate.product}`).setDisplaySize(15,15));}
 destroy(){this.root.destroy(true);}
}
