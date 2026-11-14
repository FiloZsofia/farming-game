import type Phaser from 'phaser';
export type Villager='annie'|'leo'|'simon'|'mara'|'noah';
// One scale and face language for the village; outfits and silhouettes remain individual.
export const VILLAGER_SCALE=1.26;
export function drawModernVillager(scene:Phaser.Scene,root:Phaser.GameObjects.Container,who:Villager){
 const female=who==='annie'||who==='mara',annie=who==='annie',mara=who==='mara',leo=who==='leo',simon=who==='simon';
 // Local limb pivots also support walking, carrying and pruning.
 const g=(p=root)=>{const a=scene.add.graphics();p.add(a);return a;};
 const path=(a:Phaser.GameObjects.Graphics,c:number,points:number[])=>{a.fillStyle(c).fillPoints(Array.from({length:points.length/2},(_,i)=>({x:points[i*2],y:points[i*2+1]})),true);};
 const round=(a:Phaser.GameObjects.Graphics,c:number,x:number,y:number,w:number,h:number,r=1)=>a.fillStyle(c).fillRoundedRect(x,y,w,h,r);
 const line=(a:Phaser.GameObjects.Graphics,c:number,w:number,pts:number[])=>a.lineStyle(w,c).strokePoints(Array.from({length:pts.length/2},(_,i)=>({x:pts[i*2],y:pts[i*2+1]})));
 const curve=(a:Phaser.GameObjects.Graphics,color:number,start:number[],segments:number[][],alpha=1)=>{const pts=[{x:start[0],y:start[1]}];let [x,y]=start;for(const [ax,ay,bx,by,cx,cy]of segments){for(let i=1;i<=10;i++){const t=i/10,u=1-t;pts.push({x:u*u*u*x+3*u*u*t*ax+3*u*t*t*bx+t*t*t*cx,y:u*u*u*y+3*u*u*t*ay+3*u*t*t*by+t*t*t*cy});}x=cx;y=cy;}a.fillStyle(color,alpha).fillPoints(pts,true);};
 const shirt=annie?0xc8ad86:mara?0xd8cdb2:leo?0xc4b08b:simon?0x7999a8:0x7d9aa1;
 const trousers=annie?0x536c80:mara?0x56685e:leo?0x5b7055:0x4e5960;
 const hair=annie?0xe8cd91:mara?0x65452f:leo?0x67452f:simon?0x49382e:0xb79453;
 const lightHair=annie?0xe8cd91:mara?0x997047:leo?0x92704d:simon?0x73594a:0xe1c17e;
 const skin=0xf0bf99,shade=0xd59c78,skinLight=0xffd7b3;
 // Mara's loose shoulder-length hair sits behind the shoulders and arms.
 if(mara){const back=g();curve(back,hair,[-6,-44],[[-9,-40,-7,-35,-8,-31],[-6,-32,-6,-30,-4.8,-30.5],[-4,-34,4,-34,5,-30.3],[6,-31,7,-30.5,8.3,-32],[6.7,-34,8.4,-42,5.7,-45], [2,-50,-4,-49,-6,-44]]);for(const side of [-1,1])line(back,lightHair,.55,[side*6,-41,side*6.6,-37,side*6.1,-33]);}
 // Annie's hair is one loose, continuous shape, with no separate plaits or streaks.
 if(annie){const back=g();curve(back,hair,[-6,-45],[[-9,-40,-7.6,-34,-8,-29],[-8.4,-25,-7,-23,-5.3,-23.4],[-2.6,-22.3,2.4,-22.5,5.7,-23.5],[8,-23,8.6,-26,7.8,-30],[7,-35,9,-42,5.5,-46],[2,-50,-3.8,-50,-6,-45]]);
 // Highlights are painted into the back-hair graphic, behind the face and clothes.
 curve(back,0xf9e9bf,[-6.3,-43],[[-7.4,-39,-6.7,-35,-7,-31],[-7.4,-28,-7,-25.7,-6,-24.8],[-5.3,-27,-5.6,-29.3,-5.3,-32],[-5,-36,-5.8,-39,-5.2,-42],[-5.4,-43,-5.8,-43.5,-6.3,-43]],.7);
 curve(back,0xf6e4b5,[6.4,-41],[[6,-37,6.7,-34,6.5,-30],[6.5,-27.8,5.8,-25.4,5.4,-24.3],[7.2,-25.4,7.6,-28,7.2,-31],[6.8,-35,7.5,-39,6.4,-41]],.55);
 }
 const leg=(x:number)=>{const c=scene.add.container(x,-16);root.add(c);const a=g(c);
 curve(a,trousers,[-2.5,-2],[[-1,-2.5,1.6,-2.5,2.6,-2],[2.6,2,1.7,7,2.2,11],[1,11.5,-1,11.5,-2.1,11],[-2.5,6,-2.9,1,-2.5,-2]]);
 path(a,0x82959a,[-2,-1,-.8,-1,-1.1,10,-1.8,10]);line(a,0x354b52,.4,[1.7,0,1.5,10]);line(a,0xa6b0ae,.35,[-1.5,5,-.3,5.5,1,5.2]);line(a,0x3a4e55,.4,[-1.8,8,-.2,8.4,1.7,8]);
 if(annie){
 // The boot shaft overlaps the trouser hem: no exposed ankle.
 round(a,0x725646,-2.2,9.8,4.4,4.8,.8);round(a,0x91705a,-1.7,10.1,1.1,3.8,.35);
 curve(a,0x725646,[-2.1,13.1],[[-.9,13.5,1.1,13,2,13.5],[3.3,14.4,2.8,15.5,1.3,15.7],[-.2,15.8,-2.7,15.5,-2.4,14.7],[-2.5,14.1,-2.2,13.5,-2.1,13.1]]);
 line(a,0xb79879,.4,[-1.8,10.3,1.7,10.3]);for(const y of [11.5,12.3,13.1])line(a,0xd1b999,.3,[-.6,y,.7,y+.1]);line(a,0xb79879,.4,[-1.6,14.5,0,14.9,2.1,14.6]);line(a,0x40362f,.65,[-2.1,15.4,.2,15.8,2.5,15.4]);}

 else{const boot=mara?0x494b43:leo?0x7b6245:simon?0x604e40:0x586779,highlight=mara?0x7c806c:leo?0xa68b63:simon?0x8b735b:0x8b9ba7;round(a,boot,-2.4,mara?9.2:11,4.6,mara?5.6:3.8,.9);curve(a,boot,[-2.2,13],[[-.6,13,1.4,12.8,2.3,13.6],[4,14.6,3.4,15.6,1.6,15.7],[-.2,15.8,-2.9,15.7,-2.5,14.8],[-2.5,14,-2.3,13.4,-2.2,13]]);line(a,highlight,.6,[-1.8,14.1,-.1,14.5,2.5,14.4]);line(a,0x322f2a,.65,[-2.4,15.6,2.9,15.6]);for(const y of [12,12.8,13.6])line(a,0xc0b39a,.3,[-.7,y,.7,y+.15]);line(a,highlight,.35,[-1.7,11.3,1.6,11.3]);}return c;};
 g().fillStyle(0x35442e,.2).fillEllipse(0,0,18,5);
 const leftLeg=leg(-2.8),rightLeg=leg(2.8),body=g();
 round(body,skin,-1.8,-35,3.6,5,1);
 if(!annie)path(body,shirt,[-1.8,-33,-5,-31.5,-6.4,-29,-5,-21,-5.6,-16,5.6,-16,5,-21,6.4,-29,5,-31.5,1.8,-33,0,-30]);
 if(!annie)path(body,0x425343,[-5.5,-28,-4,-26,-3.6,-17,-5.5,-17]);
 path(body,0xe7ddc4,[-2,-33,-3.5,-31,-1,-28,0,-30]);path(body,0xb6bba9,[2,-33,3.5,-31,1,-28,0,-30]);
 line(body,0x666a5a,.4,[0,-29,0,-17]);for(const y of [-27,-24,-21])body.fillStyle(0xc6b58d).fillCircle(.6,y,.35);
 round(body,trousers,-5.3,-17,10.6,3,1);line(body,0x344c52,.5,[0,-16,0,-13.5]);
 if(mara){for(const sign of [-1,1]){path(body,0x426c63,[sign*1.5,-32.5,sign*5,-31,sign*5.7,-17,sign*.8,-17]);round(body,0x72958a,sign<0?-4.8:1.7,-23,3,3.8,.4);line(body,0xb8c2a0,.4,[sign*1.5,-31,sign*.8,-18]);}}
 if(leo||simon){const apron=leo?0x668257:0x98734f;path(body,apron,[-3.5,-29,3.5,-29,5.4,-12,-5.4,-12]);line(body,0xc1b28b,.9,[-3,-32,-3,-28]);line(body,0xc1b28b,.9,[3,-32,3,-28]);round(body,leo?0x879869:0xad895f,-3.8,-21,7.6,5,.6);line(body,0xd4c09a,.4,[-3.2,-20.3,3.2,-20.3]);if(simon){round(body,0xe1b36b,1.5,-24,.7,7,.2);round(body,0xc8c5ac,-1.5,-22,1.4,5,.2);line(body,0x716a58,.35,[-1.5,-20,-.1,-20,-.1,-18]);}}
 if(annie){
 // A blouse tucked into a high waistband, rather than a straight jacket hem.
 curve(body,shirt,[-1.8,-33],[[-3,-32.5,-4.8,-31.8,-5.4,-30],[-6,-27,-4,-24,-3.4,-22],[-1.2,-21.5,1.2,-21.5,3.4,-22],[4,-24,6,-27,5.4,-30],[4.8,-31.8,3,-32.5,1.8,-33],[1,-31,-1,-31,-1.8,-33]]);
 curve(body,0xe7cfaa,[-3.8,-29.7],[[-2,-30.5,2,-30.5,3.8,-29.7],[4.3,-27.7,1.5,-26,-.1,-26.7],[-2,-26,-4.4,-27.7,-3.8,-29.7]]);
 path(body,0xf0dfc2,[-1.8,-33,-3.1,-31,-.5,-29,0,-30.5]);path(body,0xa88b67,[1.8,-33,3.1,-31,.5,-29,0,-30.5]);line(body,0x9a7e60,.35,[.3,-29,.3,-22.5]);for(const y of [-27.7,-25.7,-23.7])body.fillStyle(0xf9ead0).fillCircle(.7,y,.35);
 curve(body,trousers,[-3.4,-22.2],[[-1.5,-21.7,1.5,-21.7,3.4,-22.2],[3.8,-20,5.3,-18,5.3,-16], [2,-14.8,-2,-14.8,-5.3,-16],[-5.3,-18,-3.8,-20,-3.4,-22.2]]);
 line(body,0x344c52,.6,[-3.4,-21.8,0,-21.4,3.4,-21.8]);line(body,0x9eafba,.4,[-3,-20.8,0,-20.4,3,-20.8]);round(body,0x8a6950,-3.4,-21.9,6.8,.8,.25);round(body,0xc5b58a,-.8,-22,1.6,1.2,.25);line(body,0x344c52,.45,[.2,-20,.2,-16]);for(const sign of [-1,1])line(body,0x91a5b0,.4,[sign*3.8,-19.7,sign*2.5,-18.2,sign*2,-18]);
 }
 // Seams, cuffs, pocket edges and fabric folds are visible at game scale.
 for(const sign of [-1,1]){line(body,0xe5d5b8,.35,[sign*4.4,-30,sign*4.7,-28.3]);if(!annie)line(body,0x5a6559,.35,[sign*4.8,-19,sign*3.7,-18]);}
 if(leo||simon){line(body,0xd6c198,.35,[-4.6,-14,0,-13.5,4.6,-14]);for(const sign of [-1,1]){body.fillStyle(0xd4b27c).fillCircle(sign*2.9,-28,.45);line(body,0x6c624a,.4,[sign*3.6,-22,sign*3.6,-17]);}line(body,0xbaa382,.35,[-2.5,-15,-1.8,-13.7]);}
 const armX=annie?4.6:mara?5.2:6.2,armY=-30;
 const arm=(x:number)=>{const c=scene.add.container(x,armY);root.add(c);const a=g(c);round(a,shirt,-1.6,-.5,3.2,8,1.5);line(a,0xe5d8bf,.4,[-1,1,-.6,4]);line(a,0x8f9588,.35,[1.1,2,1,5]);round(a,0xb9bba9,-1.8,6,3.6,1.8,.5);line(a,0xf0e7d0,.4,[-1.5,6.3,1.5,6.3]);round(a,skin,-1.15,7.5,2.7,7.3,1.2);line(a,0xffd9b7,.4,[-.5,8,-.5,12]);round(a,mara?0xab916b:skin,-1.4,12.5,3,2.8,1);return c;};
 const leftArm=arm(-armX),rightArm=arm(armX),pony=scene.add.container(0,-39);root.add(pony);
 const head=scene.add.container(0,-40);root.add(head);const face=g(head);
 // Soft jaw, individual hair and readable eyes at actual game size.
 round(face,hair,-6.6,-8.9,13.2,14,4.5);
 face.fillStyle(shade).fillEllipse(-6,1,2,3.5).fillEllipse(6,1,2,3.5);
 if(!simon&&!annie)path(face,skin,[-5.4,-4.5,-3.5,-6.8,2.8,-6.8,5.3,-4,5.5,1.7,3.8,5.5,1.4,7,-1.6,7,-4,5,-5.7,1]);
 if(simon)path(face,skin,[-5.8,-4.5,-3.7,-6.8,3.4,-6.8,5.7,-4,5.9,1.8,4.8,5.6,2.7,7,-2.7,7,-5,5.1,-6,1]);
 if(annie)curve(face,skin,[-5,-4], [[-3.6,-7,2.7,-7,4.9,-4],[6.3,-1,4.8,3.8,2.8,5.8],[1,7.5,-1.1,7.5,-3,5.5],[-5.4,3,-6,-1,-5,-4]]);
 face.fillStyle(skinLight,.65).fillEllipse(-1.5,-.2,7.6,11);
 for(const x of [-2.65,2.65]){face.fillStyle(0xfff5e3).fillEllipse(x,.2,annie?3:2.8,annie?2.5:2.6);face.fillStyle(annie||who==='noah'?0x587f8d:0x756044).fillEllipse(x+.1,.35,1.55,2.1);face.fillStyle(0x343730).fillEllipse(x+.2,.5,.85,1.4);face.fillStyle(0xffffff).fillCircle(x-.25,-.25,.3);line(face,hair,.45,[x-1.4,-.7,x-.7,-1,x+.7,-1,x+1.3,-.5]);line(face,annie?0xb79453:hair,annie?.6:simon?.75:.45,[x-1.2,-2.4,x,simon?-2.55:-2.9,x+1.2,-2.3]);if(annie){const side=x<0?-1:1;line(face,0x67513e,.35,[x+side*1.25,-.6,x+side*1.65,-1]);}}
 line(face,0xc18d70,.45,[-.2,1,-.7,2.5,.5,2.9]);
 if(leo||simon){path(face,hair,[-5.3,2,-3.9,3.4,-2,3.5,0,3,2,3.5,4,3.2,5.3,1.8,4.7,5.8,2.5,7.7,0,8.1,-2.5,7.5,-4.6,5.6]);face.fillStyle(skin).fillEllipse(0,4.4,5.8,2);}
 line(face,0xa76957,.55,[-1.9,4.4,-.8,4.9,.7,4.9,1.9,4.2]);line(face,0xf4c8a5,.3,[-.8,5.6,.8,5.6]);
 path(face,hair,[-6.3,-2,-6.9,-6,-4.4,-9.2,-1.3,-10,2.4,-9.5,5.7,-7.3,6.6,-3,5.2,-.8,4.2,-4.5,1,-5.5,-.8,-5.8,-3,-3.4,-5.5,-2.8]);
 line(face,lightHair,.8,[-5.3,-5.4,-3.5,-7.3,-1.2,-7.8,1,-7.3]);line(face,lightHair,.45,[2,-7.3,4,-6.1,4.8,-4.3]);
 if(annie){
 // Side-swept honey-blond fringe and a crown seated directly on the hair.
 curve(face,hair,[-6,-4], [[-6,-9,1,-10,5,-6],[2,-6,0,-3,-3.9,-3],[-4.8,-2.8,-5.4,-2,-5.8,-1.7],[-6,-2.4,-6,-3,-6,-4]]);line(face,lightHair,.7,[-5,-5.6,-3.2,-6.6,-.8,-6.3,-2.2,-4.9]);
 face.fillStyle(0x846b48).fillEllipse(0,-6.4,21,3.8);curve(face,0xd0b68c,[-6.4,-7.3],[[-6,-9,-5.6,-11.8,-3.3,-12.4],[-1.4,-13,2.9,-12.6,4.3,-11.7],[5.5,-10.6,5.9,-8.8,6.3,-7.3],[2.4,-6.2,-2.4,-6.2,-6.4,-7.3]]);line(face,0x745843,1.3,[-5.8,-8.4,0,-7.8,5.8,-8.4]);line(face,0xead5b4,.5,[-4.5,-10.9,-2.6,-11.7,1.5,-11.6,3.8,-10.9]);face.fillStyle(0xb38a6c).fillEllipse(4.8,-8.2,1.6,1.2);
 }
 const tool=g(rightArm);
 return {leftLeg,rightLeg,leftArm,rightArm,head,pony,tool,armX,armY};
}
