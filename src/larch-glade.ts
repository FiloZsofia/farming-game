import type Phaser from 'phaser';
export const resinTree={x:-905,y:2800};
export const larchGlade={x:-820,y:2780,rx:156,ry:111};
export const inLarchGlade=(x:number,y:number)=>((x-larchGlade.x)/larchGlade.rx)**2+((y-larchGlade.y)/larchGlade.ry)**2<1;
export const larchTrunkBlocked=(x:number,y:number)=>((x-resinTree.x)/16)**2+((y-resinTree.y)/12)**2<1;
export function drawLarchHollow(g:Phaser.GameObjects.Graphics){
 const {x,y}=larchGlade;
 // Overlapping contours shade the hollow without a hard, circular boundary.
 for(let i=5;i>=0;i--)g.fillStyle(i%2?0x486a43:0x608343,.13).fillEllipse(x+Math.sin(i)*9,y+i*3,298-i*14,205-i*12);
 g.fillStyle(0x89965a,.24).fillEllipse(x-26,y+10,192,112);g.fillStyle(0xa59864,.23).fillEllipse(x-35,y+20,154,79);
 // A low moss-covered bank lifts the old tree above the damp clearing floor.
 const t=resinTree;g.fillStyle(0x455b37,.5).fillEllipse(t.x+5,t.y+13,117,42);g.fillStyle(0x71854b).fillPoints([{x:t.x-65,y:t.y+5},{x:t.x-43,y:t.y-14},{x:t.x-10,y:t.y-24},{x:t.x+33,y:t.y-12},{x:t.x+61,y:t.y+9},{x:t.x+30,y:t.y+18},{x:t.x-32,y:t.y+18}],true);
 g.fillStyle(0x8e9a5b,.45).fillEllipse(t.x-15,t.y-4,81,25);
 for(let i=0;i<160;i++){const xx=x-132+i*67%260,yy=y-85+i*43%171;if(!inLarchGlade(xx,yy))continue;g.lineStyle(.8,i%3?0x9d8d58:0xb4a36a,.45).lineBetween(xx,yy,xx+3+i%4,yy+1);}
 for(const p of [{x:x-126,y:y+63},{x:x+115,y:y-14},{x:x+68,y:y+89}]){g.fillStyle(0x4c6342).fillEllipse(p.x,p.y+4,31,12);g.fillStyle(0x7d8872).fillPoints([{x:p.x-14,y:p.y+2},{x:p.x-9,y:p.y-10},{x:p.x+5,y:p.y-13},{x:p.x+15,y:p.y-2},{x:p.x+10,y:p.y+6}],true);g.fillStyle(0x7a944f).fillEllipse(p.x-5,p.y,21,8);}
}
export function drawOldLarch(g:Phaser.GameObjects.Graphics){
 const {x,y}=resinTree;
 g.fillStyle(0x263e2c,.3).fillEllipse(x+18,y+15,125,30);
 // Roots and trunk form one asymmetrical silhouette rather than a straight striped post.
 for(const [dx,dy]of [[-48,13],[-32,-7],[39,16],[52,2],[-17,26]]){g.lineStyle(7,0x654a32).strokePoints([{x:x+3,y:y-12},{x:x+dx*.45,y:y+dy*.2},{x:x+dx,y:y+dy}]);g.lineStyle(2,0xaa8550).lineBetween(x+dx*.35,y+dy*.1,x+dx,y+dy-2);}
 g.fillStyle(0x6a4c34).fillPoints([{x:x-16,y:y+4},{x:x-10,y:y-44},{x:x-17,y:y-83},{x:x-11,y:y-126},{x:x-5,y:y-164},{x:x+3,y:y-166},{x:x+9,y:y-119},{x:x+7,y:y-76},{x:x+15,y:y-35},{x:x+16,y:y+6},{x:x+3,y:y-2}],true);
 g.fillStyle(0x9b7248).fillPoints([{x:x-10,y:y-1},{x:x-4,y:y-44},{x:x-9,y:y-83},{x:x-5,y:y-137},{x:x-1,y:y-156},{x:x+3,y:y-111},{x:x+1,y:y-77},{x:x+8,y:y-30},{x:x+7,y:y+2}],true);
 for(let i=0;i<28;i++){const xx=x-10+i*17%20,yy=y-12-i*31%139;g.lineStyle(1,i%3?0x503e2c:0xbd945e,.75).strokePoints([{x:xx,y:yy},{x:xx+2,y:yy-5},{x:xx-1,y:yy-11}]);}
 // Fine, drooping sprays of larch needles leave air and trunk visible between tiers.
 for(let tier=0;tier<8;tier++){const yy=y-150+tier*14,span=12+tier*6;for(const side of [-1,1]){
  const end={x:x+side*span,y:yy+9+tier*.6};g.lineStyle(tier>4?3:2,0x72573a).strokePoints([{x:x+1,y:yy-3},{x:x+side*span*.55,y:yy+3},{x:end.x,y:end.y}]);
  for(let j=1;j<=7;j++){const t=j/7,xx=x+side*span*t,branchY=yy+3+t*8;g.lineStyle(1,0x426c42,.9).lineBetween(xx,branchY,xx+side*7,branchY+12);for(let n=0;n<4;n++){const nx=xx+side*n*1.8,ny=branchY+n*3;g.lineStyle(1,[0x91aa60,0x678c4e,0xa1b66b][(j+n+tier)%3],.9).lineBetween(nx-4,ny+1,nx+4,ny+6);}}
 }}
 // An old wound, with resin later animated at the same reachable face of the trunk.
 g.lineStyle(3,0x4b3928).strokePoints([{x:x+4,y:y-62},{x:x-1,y:y-45},{x:x+4,y:y-24}]);
}
