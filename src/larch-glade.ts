import type Phaser from 'phaser';
export const resinTree={x:-905,y:2800};
export const larchGlade={x:-820,y:2780,rx:185,ry:126};
export const gladePool={x:-708,y:2823,rx:43,ry:15};
export const inLarchGlade=(x:number,y:number)=>((x-larchGlade.x)/larchGlade.rx)**2+((y-larchGlade.y)/larchGlade.ry)**2<1;
export const larchTrunkBlocked=(x:number,y:number)=>((x-resinTree.x)/16)**2+((y-resinTree.y)/12)**2<1;
export function larchGroundDrop(x:number,y:number){
 const r=Math.hypot((x-larchGlade.x)/larchGlade.rx,(y-larchGlade.y-18)/larchGlade.ry);
 const t=Math.max(0,Math.min(1,(1-r)/.55));return 16*t*t*(3-2*t);
}
export function drawLarchHollow(g:Phaser.GameObjects.Graphics){
 const {x,y}=larchGlade,t=resinTree;
 // A broad clearing: broken edges blend into the forest, with the middle left open.
 for(let i=6;i>=0;i--)g.fillStyle(i%2?0x859b56:0x929d5c,.12).fillEllipse(x+Math.sin(i*2)*8,y+i*2,360-i*13,244-i*11);
 for(let i=0;i<240;i++){const xx=x-180+i*67%360,yy=y-118+i*43%238;if(!inLarchGlade(xx,yy))continue;g.fillStyle(i%3?0x9dad67:0xb4b57a,.3).fillRect(xx,yy,2+i%3,1);}
 // A sunken floor and exposed bank make the descent visible, with an open entrance.
 const bx=x,by=y+18;
 g.fillStyle(0x69794a,.55).fillEllipse(bx,by+13,330,211);g.fillStyle(0x8a9158,.26).fillEllipse(bx+15,by+22,287,173);
 for(let i=0;i<36;i++){const a=Math.PI+i*Math.PI*2/36,b=a+Math.PI*2/36;
  if(a>4.42&&a<4.91||a>6.75&&a<8.7)continue;
  const top=(q:number)=>({x:bx+Math.cos(q)*(182+Math.sin(q*5)*5),y:by+Math.sin(q)*118-5});
  const low=(q:number)=>{const fade=Math.max(0,Math.min(1,(Math.abs(q-4.67)-.23)/.25));return{x:bx+Math.cos(q)*(182-18*fade),y:by+Math.sin(q)*(118-16*fade)-5+22*fade};};
  const u=top(a),v=top(b),w=low(b),z=low(a);
  g.fillStyle(i%3?0x776a47:0x817550,.85).fillPoints([u,v,w,z],true);g.lineStyle(4,0x849953,.9).lineBetween(u.x,u.y,v.x,v.y);g.lineStyle(2,0x425a37,.65).lineBetween(z.x,z.y,w.x,w.y);
  if(i%3===0){const xx=(u.x+v.x)/2,yy=(u.y+v.y)/2;g.lineStyle(2,0x4e4931,.6).lineBetween(xx,yy+4,xx+3,yy+12);}
 }
 // Exposed old roots follow the side of the bank, not the radial base of the tree.
 for(const [dx,dy,side]of [[-142,-46,-1],[99,-63,1],[-164,20,-1]]){const xx=x+dx,yy=y+dy;g.lineStyle(4,0x604d34).strokePoints([{x:xx,y:yy-8},{x:xx+side*11,y:yy+3},{x:xx+side*9,y:yy+14},{x:xx+side*24,y:yy+24}]);g.lineStyle(1,0xb49965).lineBetween(xx,yy-6,xx+side*10,yy+5);g.lineStyle(2,0x6b5638).lineBetween(xx+side*9,yy+13,xx-side*7,yy+19);}
 // Fallen needles soften the ground at the old trunk; no pedestal or exposed root stand.
 for(let i=4;i>=0;i--)g.fillStyle(i%2?0x9e8053:0x9a905d,.17).fillEllipse(t.x+12+i*4,t.y+13,164-i*18,82-i*9);
 for(let i=0;i<180;i++){const xx=t.x-71+i*47%164,yy=t.y-24+i*31%81;if(((xx-t.x-10)/86)**2+((yy-t.y-12)/43)**2>1)continue;g.lineStyle(.8,i%3?0xb9a06b:0x726343,.6).lineBetween(xx,yy,xx+3+i%4,yy+(i%3-1)*2);}
 // An irregular, shallow rainwater hollow on the edge, away from the approach.
 const p=gladePool,outline=[[-45,-1],[-35,-12],[-13,-17],[9,-14],[30,-11],[44,-1],[37,10],[12,14],[-8,11],[-31,12]].map(([dx,dy])=>({x:p.x+dx,y:p.y+dy}));
 g.fillStyle(0x6b7350).fillPoints(outline,true);g.lineStyle(5,0x9a9d6b,.6).strokePoints(outline,true);g.fillStyle(0x4b6860).fillPoints(outline.map(v=>({x:p.x+(v.x-p.x)*.88,y:p.y+(v.y-p.y)*.72})),true);
 g.fillStyle(0x9bad91,.25).fillPoints([{x:p.x-28,y:p.y-7},{x:p.x+12,y:p.y-9},{x:p.x+28,y:p.y-3},{x:p.x-7,y:p.y+1}],true);
 g.lineStyle(1,0x354f44,.6).strokePoints([{x:p.x-11,y:p.y-9},{x:p.x-8,y:p.y+6},{x:p.x-1,y:p.y+9}]);g.lineBetween(p.x-9,p.y-2,p.x-23,p.y-6);
 // A fallen tree is slowly returning to the soil. Its broken end and moss stay recognisable.
 const lx=x+4,ly=y+107;
 g.fillStyle(0x374d35,.28).fillEllipse(lx+4,ly+10,128,22);
 g.fillStyle(0x5b4731).fillPoints([{x:lx-61,y:ly-9},{x:lx-27,y:ly-14},{x:lx+28,y:ly-8},{x:lx+58,y:ly+4},{x:lx+48,y:ly+15},{x:lx-17,y:ly+8},{x:lx-59,y:ly+13}],true);
 g.fillStyle(0x8b6a43).fillPoints([{x:lx-55,y:ly-8},{x:lx-25,y:ly-11},{x:lx+23,y:ly-6},{x:lx+47,y:ly+1},{x:lx-11,y:ly+1}],true);
 for(let i=0;i<5;i++)g.lineStyle(1,0x3e3829,.7).strokePoints([{x:lx-51+i*4,y:ly-4+i*3},{x:lx-3,y:ly+i*2},{x:lx+36,y:ly+4+i*2}]);
 g.fillStyle(0xb49a68).fillPoints([{x:lx-61,y:ly-9},{x:lx-51,y:ly-7},{x:lx-54,y:ly+1},{x:lx-44,y:ly+6},{x:lx-59,y:ly+13},{x:lx-65,y:ly+6}],true);g.lineStyle(1,0x665239).lineBetween(lx-59,ly-4,lx-54,ly+5);
 for(const [dx,dy,w]of [[-25,-10,33],[3,-5,27],[31,1,21]]){g.fillStyle(0x526d40).fillEllipse(lx+dx,ly+dy,w,10);g.fillStyle(0x879b55,.8).fillEllipse(lx+dx-3,ly+dy-2,w*.7,5);}
 // Sunken stones and ferns sit at the margins rather than forming a decorative ring.
 for(const [dx,dy]of [[-156,59],[139,-24],[99,96]]){const xx=x+dx,yy=y+dy;g.fillStyle(0x66705b).fillPoints([{x:xx-12,y:yy},{x:xx-8,y:yy-9},{x:xx+4,y:yy-10},{x:xx+13,y:yy-1},{x:xx+8,y:yy+4}],true);g.fillStyle(0x84935b).fillEllipse(xx-4,yy+1,23,7);}
 for(const [dx,dy]of [[-148,-11],[-47,107],[115,76],[144,-38]]){const xx=x+dx,yy=y+dy;for(let i=-2;i<=2;i++){g.lineStyle(1,0x47683a).strokePoints([{x:xx,y:yy},{x:xx+i*5,y:yy-15-Math.abs(i)*2},{x:xx+i*10,y:yy-12}]);for(let j=1;j<4;j++){const fx=xx+i*j*2.4,fy=yy-j*4;g.lineStyle(1,0x91a86b).lineBetween(fx-3,fy-2,fx+3,fy+1);}}}
}
export function drawOldLarch(g:Phaser.GameObjects.Graphics){
 const {x,y}=resinTree;
 g.fillStyle(0x304734,.18).fillPoints([{x:x-19,y:y-5},{x:x+24,y:y-12},{x:x+94,y:y+22},{x:x+45,y:y+30},{x:x-26,y:y+13}],true);
 // Only short, broken sections of roots emerge from the soil, then vanish under moss.
 g.fillStyle(0x715139).fillPoints([{x:x-11,y:y-10},{x:x-23,y:y+1},{x:x-31,y:y+4},{x:x-38,y:y+12},{x:x-27,y:y+9},{x:x-17,y:y+8},{x:x-6,y:y+2}],true);
 g.fillStyle(0x786040).fillPoints([{x:x+11,y:y-8},{x:x+25,y:y+2},{x:x+39,y:y+3},{x:x+44,y:y+8},{x:x+27,y:y+7},{x:x+9,y:y+3}],true);
 g.fillStyle(0x8c9357).fillEllipse(x-34,y+10,21,7).fillEllipse(x+36,y+7,22,6);
 // A tall, weathered bole with an uneven upper fork and a long visible bare section.
 g.fillStyle(0x644a34).fillPoints([{x:x-17,y:y+5},{x:x-12,y:y-51},{x:x-15,y:y-99},{x:x-10,y:y-153},{x:x-13,y:y-184},{x:x-26,y:y-208},{x:x-22,y:y-214},{x:x-4,y:y-194},{x:x+7,y:y-226},{x:x+13,y:y-225},{x:x+3,y:y-179},{x:x+8,y:y-141},{x:x+8,y:y-91},{x:x+15,y:y-42},{x:x+17,y:y+5},{x:x+2,y:y-2}],true);
 g.fillStyle(0x9a724b).fillPoints([{x:x-10,y:y-3},{x:x-4,y:y-47},{x:x-8,y:y-93},{x:x-4,y:y-149},{x:x-6,y:y-177},{x:x-2,y:y-188},{x:x+2,y:y-154},{x:x+1,y:y-96},{x:x+8,y:y-41},{x:x+8,y:y+1}],true);
 for(let i=0;i<37;i++){const xx=x-10+i*17%21,yy=y-12-i*31%177;g.fillStyle(i%3?0x4c3d2e:0xbc9160,.65).fillRect(xx,yy,1+i%2,3+i%4);}
 // Broad, irregular side branches: no evenly stacked tiers or triangular fir silhouette.
 const branches=[[-4,-127,-43,-159,-92,-150],[3,-153,43,-184,81,-174],[-7,-176,-32,-207,-67,-204],[2,-192,23,-229,44,-221],[4,-132,59,-143,97,-127],[-8,-153,-64,-183,-104,-172],[1,-209,-10,-241,-27,-239]];
 for(const [sx,sy,mx,my,ex,ey]of branches){g.lineStyle(4,0x614b35).strokePoints([{x:x+sx,y:y+sy},{x:x+mx,y:y+my},{x:x+ex,y:y+ey}]);g.lineStyle(1.2,0xa48653).lineBetween(x+mx,y+my-1,x+ex,y+ey-1);
  for(let j=1;j<=8;j++){const t=j/8,xx=x+mx+(ex-mx)*t,yy=y+my+(ey-my)*t,drop=10+(j*7%17);g.lineStyle(1,0x576b3e).strokePoints([{x:xx,y:yy},{x:xx+3,y:yy+drop*.6},{x:xx+1,y:yy+drop}]);for(let n=0;n<4;n++){const nx=xx+Math.sin(j+n)*2,ny=yy+n*drop/4;g.lineStyle(1.4,0x48683e,.85).strokePoints([{x:nx-5,y:ny},{x:nx-2,y:ny-3},{x:nx+3,y:ny-1},{x:nx+6,y:ny+3},{x:nx+1,y:ny+5},{x:nx-4,y:ny+3}],true);g.fillStyle([0xa9c582,0xc0d698,0x91b477][(j+n)%3],1).fillPoints([{x:nx-5,y:ny},{x:nx-2,y:ny-3},{x:nx+3,y:ny-1},{x:nx+6,y:ny+3},{x:nx+1,y:ny+5},{x:nx-4,y:ny+3}],true);g.lineStyle(.8,0xe4e6b9,.45).lineBetween(nx-3,ny-1,nx+1,ny+1);}}
 }
 // A broken old branch and amber trails identify the reachable resin-bearing face.
 g.fillStyle(0x5a432e).fillPoints([{x:x+4,y:y-84},{x:x+23,y:y-94},{x:x+27,y:y-89},{x:x+17,y:y-78},{x:x+7,y:y-76}],true);g.fillStyle(0xb29669).fillEllipse(x+24,y-91,7,5);
 g.lineStyle(9,0x443527,.9).strokePoints([{x:x+4,y:y-68},{x:x-1,y:y-45},{x:x+4,y:y-24}]);
 g.lineStyle(3,0x4b3928).strokePoints([{x:x+4,y:y-68},{x:x-1,y:y-45},{x:x+4,y:y-24}]);
 for(let i=0;i<4;i++){g.lineStyle(1.5,0xb87a32,.8).strokePoints([{x:x+4+i%2*4,y:y-75},{x:x-1+i*2,y:y-56+i*2},{x:x+1+i*2,y:y-27+i*3}]);}
}
