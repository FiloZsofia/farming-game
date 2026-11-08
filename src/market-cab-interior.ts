import type Phaser from 'phaser';
export type CabVertex={x:number;y:number;z:number};
type Point={x:number;y:number};
type Surface={points:CabVertex[];color:number;edge?:number};
// Real cabin parts are projected with the same heading as the body. The caller
// clips them to the visible window apertures, beneath Mara and the glass.
export function paintCabInterior(g:Phaser.GameObjects.Graphics,heading:number,project:(p:CabVertex)=>Point,sway:number){
 const c=Math.cos(heading),s=Math.sin(heading),faces:Surface[]=[];
 const surface=(p:number[][],color:number,edge?:number)=>faces.push({points:p.map(([x,y,z])=>({x,y,z})),color,edge});
 const box=(x0:number,x1:number,y0:number,y1:number,z0:number,z1:number,top:number,side:number,end:number)=>{
  surface([[x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1]],top);
  const y=c>=0?y1:y0,x=s>=0?x1:x0;
  surface([[x0,y,z0],[x1,y,z0],[x1,y,z1],[x0,y,z1]],side);
  surface([[x,y0,z0],[x,y1,z0],[x,y1,z1],[x,y0,z1]],end);
 };
 g.clear();g.fillStyle(0x26382f).fillRect(-180,-135,360,160);
 // Rear bulkhead, floor mat and pale headliner give the cab depth.
 box(15,19,-31,31,33,83,0x7e806a,0x5b6858,0x68735f);
 box(19,76,-31,31,31,35,0x38483c,0x2b3a31,0x304136);
 box(21,69,-30,30,82,85,0xbdb394,0x908f76,0x9a9a7f);
 // Two upholstered seats, headrests, cushion piping and stitched back panels.
 for(const y of [-19,18]){
  box(37,43,y-11,y+11,43,68,0xb2966c,0x92704e,0x9e7e57);
  box(39,44,y-8,y+8,68,75,0xc0a47b,0xa27f59,0xb08f66);
  box(43,59,y-11,y+11,39,45,0xb19468,0x7a6045,0x8e704e);
  surface([[43.3,y-8,47],[43.3,y+8,47],[43.3,y+8,65],[43.3,y-8,65]],0xa5865f,0xc9ad7e);
  surface([[43.5,y-8,51],[43.5,y+8,51],[43.5,y+8,53],[43.5,y-8,53]],0xb37855);surface([[43.6,y-8,55],[43.6,y+8,55],[43.6,y+8,56],[43.6,y-8,56]],0x718573);
  box(40,42,y-5,y-4,65,69,0xa6ad97,0x788979,0x8b9a86);box(40,42,y+4,y+5,65,69,0xa6ad97,0x788979,0x8b9a86);
 }
 // Dashboard: warm trim, instrument hood, vents, radio and glove compartment.
 box(64,78,-30,30,51,61,0x6a705d,0x485848,0x52604d);
 box(63,67,-29,29,57,59,0xab9872,0x8b7c5c,0x927f5d);
 box(61,66,10,27,59,65,0x394b3f,0x2c3e34,0x34473b);
 surface([[61,12,60],[61,25,60],[61,25,63.5],[61,12,63.5]],0xc3b78c,0x334b3c);
 for(const y of [-23,-18,-13])box(63,64,y,y+2,59,61,0x263f33,0x263f33,0x263f33);
 box(63,64,-5,5,55,58,0x3c4c3d,0x263a30,0x304539);
 surface([[62.7,-4,55.5],[62.7,4,55.5],[62.7,4,57],[62.7,-4,57]],0xc0a25f);
 const depth=(f:Surface)=>f.points.reduce((n,v)=>n+v.x*s+v.y*c+v.z*.48,0)/f.points.length;
 faces.sort((a,b)=>depth(a)-depth(b));for(const f of faces){const points=f.points.map(project);g.fillStyle(f.color).fillPoints(points,true);if(f.edge)g.lineStyle(.65,f.edge).strokePoints(points,true);}
 // Seat stitching is an actual upholstery detail, above the cushion surfaces.
 for(const y of [-19,18])for(const dy of [-5,0,5]){const a=project({x:43.7,y:y+dy,z:48}),b=project({x:43.7,y:y+dy,z:64});g.lineStyle(.55,0xd0b78a,.7).lineBetween(a.x,a.y,b.x,b.y);}
 const hub={x:57,y:17,z:65},ring=Array.from({length:25},(_,i)=>{const a=i*Math.PI/12;return project({x:hub.x+Math.cos(a)*3,y:hub.y+Math.sin(a)*6,z:hub.z+Math.cos(a)*4});}),center=project(hub);
 g.lineStyle(1.7,0x263a31).strokePoints(ring,false);g.lineStyle(.5,0xa3ae93).strokePoints(ring,false);
 for(const i of [0,8,16])g.lineStyle(1,0x344c3c).lineBetween(center.x,center.y,ring[i].x,ring[i].y);
 g.fillStyle(0x8d947a).fillCircle(center.x,center.y,1.4);
 // The rear-view mirror is fixed to the roof; a leaf air freshener hangs below.
 const mirror=[{x:67,y:-7,z:80},{x:67,y:7,z:80},{x:67,y:7,z:83},{x:67,y:-7,z:83}].map(project);
 g.fillStyle(0x2f4438).fillPoints(mirror,true);g.lineStyle(.7,0xb1b59b).strokePoints(mirror,true);
 const hook=project({x:66,y:0,z:80}),leaf=project({x:59.5+sway,y:0,z:63.5});
 g.lineStyle(.65,0xd0c59e).lineBetween(hook.x,hook.y,leaf.x,leaf.y-3.7);for(const t of [.55,.72]){const x=hook.x+(leaf.x-hook.x)*t,y=hook.y+(leaf.y-3.7-hook.y)*t;g.fillStyle(0xb89b6a).fillCircle(x,y,.85);}
 const points=[{x:0,y:-4},{x:2.8,y:-1.5},{x:2.3,y:1.7},{x:0,y:4},{x:-2.5,y:1},{x:-2,y:-2}].map(p=>({x:leaf.x+p.x,y:leaf.y+p.y}));
 g.fillStyle(0x8dab67).fillPoints(points,true);g.lineStyle(.6,0x486444).strokePoints(points,true);g.lineStyle(.6,0xe2d29c).lineBetween(leaf.x-.4,leaf.y-2.8,leaf.x+.1,leaf.y+2.5);g.lineBetween(leaf.x,leaf.y,leaf.x+1.6,leaf.y-1);
}
