import type Phaser from 'phaser';
import {bedKinds,bedPlantStage,type BedPlant} from './living-bed';
// Each plant has its own juvenile silhouette; growth scales its actual leaves, not a generic bush.
export function paintLivingPlant(g:Phaser.GameObjects.Graphics,p:BedPlant,x:number,y:number,moisture:number,selected:boolean){
 if(p.removed){g.lineStyle(1,0x695133,.6).strokeEllipse(x,y,10,5);return;}
 const stage=bedPlantStage(p),s=p.regrowing?1:.38+Math.min(1,p.growth/bedKinds[p.kind].days)*.62,dry=moisture===0?3:0,ready=stage==='ready',leaf=(xx:number,yy:number,angle:number,length:number,width:number,color:number,serrated=false)=>{const ux=Math.cos(angle),uy=Math.sin(angle),vx=-uy,vy=ux,points=(serrated?[[0,0],[.24,-.47],[.38,-.34],[.50,-.56],[.66,-.35],[1,0],[.66,.35],[.50,.56],[.38,.34],[.24,.47]]:[[0,0],[.25,-.38],[.60,-.5],[1,0],[.60,.5],[.25,.38]]).map(([a,b])=>({x:x+(xx+ux*a*length+vx*b*width)*s,y:y+(yy+uy*a*length+vy*b*width+dry)*s}));g.fillStyle(color).fillPoints(points,true);g.lineStyle(.5,0xc2ce95,.4).lineBetween(x+xx*s,y+(yy+dry)*s,x+(xx+ux*length*.85)*s,y+(yy+uy*length*.85+dry)*s);},stem=(xx:number,yy:number,xx2:number,yy2:number,color=0x65884b,w=1)=>g.lineStyle(w,color).lineBetween(x+xx*s,y+yy*s,x+xx2*s,y+yy2*s),flower=(xx:number,yy:number,color:number,petals=6,r=3)=>{const fx=x+xx*s,fy=y+yy*s;g.fillStyle(color);for(let i=0;i<petals;i++){const a=i*Math.PI*2/petals;g.fillEllipse(fx+Math.cos(a)*r*s,fy+Math.sin(a)*r*s,r*1.3*s,r*.85*s);}g.fillStyle(0xd4af54).fillCircle(fx,fy,1.4*s);};
 g.fillStyle(0x2b3929,.18).fillEllipse(x+2,y+3,25*s,8*s);if(selected)g.lineStyle(1,0xf0d68f,.9).strokeEllipse(x,y+2,30,14);
 switch(p.kind){
 case 'onion':
  if(ready){g.fillStyle(0x9c7448).fillEllipse(x,y-1,13,10);g.fillStyle(0xc7a366).fillEllipse(x-1,y-2,10,8);g.lineStyle(.6,0xead6a4).lineBetween(x-3,y-5,x-3,y+1);}
  for(let i=0;i<7;i++){const dx=(i-3)*3,tip=-25-(i%3)*4;stem(0,-2,dx*.5,tip*.55,0x547c50,1.7);stem(dx*.5,tip*.55,dx,tip,0x7c9b6b,1.2);}break;
 case 'potato':
  for(let i=0;i<3;i++){const dx=(i-1)*9;stem(0,0,dx,-26-i%2*5,0x5f7f45,1.4);for(let j=0;j<3;j++){const yy=-7-j*7;leaf(dx*.6,yy,-2.8,10,7,0x628749);leaf(dx*.6,yy,-.35,10,7,0x83a05a);}}
  if(ready){flower(-9,-25,0xdac6d6,5,2.8);flower(7,-28,0xe8dfcf,5,2.8);g.fillStyle(0xa4875d).fillEllipse(x-6,y+1,8,5);g.fillStyle(0xbda174).fillEllipse(x+5,y+2,9,6);g.fillStyle(0x7b6749).fillCircle(x+6,y+1,.7);}break;
 case 'basil': for(let i=0;i<3;i++){const dx=(i-1)*7;stem(0,0,dx,-18-i%2*4,0x688246,1.4);for(let j=1;j<3;j++){const yy=-j*8;leaf(dx,yy,-2.6,12,10,0x7b9b46);leaf(dx,yy,-.5,12,10,0x9ab55a);}leaf(dx,-17,-1.5,9,7,0xa9bf6b);}break;
 case 'mint': for(let i=0;i<3;i++){const dx=(i-1)*6,top=-26-i%2*4;stem(dx*.4,0,dx,top,0x697964,1.2);for(let j=1;j<4;j++){leaf(dx,-j*8,-2.7,10,7,0x628f70,true);leaf(dx,-j*8,-.45,10,7,0x8cb390,true);}}break;
 case 'raspberry':case 'blackberry':{
  const black=p.kind==='blackberry';
  for(let i=0;i<3;i++){const dx=(i-1)*11,tip=-39-i%2*7;stem(0,1,dx*.4,-22,black?0x765b46:0x947052,1.8);stem(dx*.4,-22,dx,tip,black?0x765b46:0x947052,1.4);
   if(black){stem(dx*.4,-21,dx*.4+3,-23,0x6d5843);stem(dx*.7,-30,dx*.7-3,-32,0x6d5843);}
   for(let j=0;j<2;j++){const yy=-15-j*12,lx=dx*(.4+j*.3);leaf(lx,yy,-2.5,12,8,black?0x527747:0x7b9b68,true);leaf(lx,yy,-1.4,11,7,black?0x72974f:0x96b17c,true);leaf(lx,yy,-.35,12,8,black?0x64884b:0x87a66d,true);}
   if(ready){const bx=x+(dx+5)*s,by=y+(tip+10)*s;g.fillStyle(black?0x3f3a58:0xa84c5b).fillEllipse(bx,by,7*s,10*s);for(let j=0;j<7;j++){const yy=by+(-3+j%3*2.8)*s,xx=bx+(j%2?-1.5:1.2)*s;g.fillStyle(black?(j%2?0x686482:0x524d6b):(j%2?0xd77b7e:0xc15b6c)).fillCircle(xx,yy,1.6*s);}g.fillStyle(black?0xa2a0ac:0xeab1a2).fillCircle(bx-s,by-3*s,.8*s);}
   else if(p.growth>=2)flower(dx+3,tip+7,0xe9dfcf,5,2.5);
  }break;}
 case 'marigold':
  for(let i=0;i<3;i++){const dx=(i-1)*9;stem(0,0,dx,-25-i%2*7,0x65884a,1.4);for(let j=1;j<4;j++){const yy=-j*6;for(let n=0;n<3;n++){leaf(dx*.5-n*2,yy-n,-2.7,5,2.5,0x668c48);leaf(dx*.5+n*2,yy-n,-.45,5,2.5,0x86a454);}}if(ready){flower(dx,-25-i%2*7,0xb67636,10,4.5);flower(dx,-25-i%2*7,0xe5b451,9,3.1);flower(dx,-25-i%2*7,0xd89035,7,1.8);}}break;
 case 'radish': if(ready)g.fillStyle(0xc16c83).fillEllipse(x,y-2,10,9);for(let i=0;i<5;i++)leaf(0,-2,-2.7+i*.57,15+i%2*2,8,i%2?0x8ca658:0x62874d);break;
 case 'carrot': if(ready)g.fillStyle(0xcf8c48).fillTriangle(x-4,y-3,x+4,y-3,x,y+6);for(let i=0;i<5;i++){const dx=(i-2)*5,dy=-22-Math.abs(i-2)*-3;stem(0,0,dx,dy);for(let j=1;j<5;j++){const xx=dx*j/5,yy=dy*j/5;leaf(xx,yy,-2.8,6,2,0x7ba157);leaf(xx,yy,-.6,6,2,0x93b467);}}break;
 case 'lettuce': for(let i=0;i<10;i++){const a=i*2.4;leaf(Math.cos(a)*2,-3+Math.sin(a)*2,a,13-i*.55,13-i*.5,[0x73974e,0x92af60,0xb4c57c][i%3]);}break;
 case 'pea': stem(-8,1,-5,-34,0xa48c61);stem(0,0,-2,-30,0x729353,1.5);for(let i=0;i<4;i++){leaf(-1,-8-i*5,Math.PI+(i%2?-.4:.3),11,6,0x7d9e5a);leaf(-1,-8-i*5,-.4,10,5,0x91ae64);}if(ready||p.flowering)for(let i=0;i<3;i++){
  const xx=x+(-5+i*6)*s,yy=y+(-16-i%2*7)*s,dried=p.flowering,body=dried?0xb49b64:0xacc767,shade=dried?0x8b774f:0x729748;
  g.lineStyle(.7,0x6b8a4c).lineBetween(xx,yy-8*s,xx+2*s,yy-11*s);
  g.fillStyle(shade).fillPoints([[-2,-7],[1,-8],[3,-4],[3,4],[0,8],[-2,4]].map(([a,b])=>({x:xx+a*s,y:yy+b*s})),true);
  g.fillStyle(body).fillEllipse(xx,yy,4.4*s,13*s);g.lineStyle(.6,dried?0xddc997:0xe0e8a3).lineBetween(xx-s,yy-5*s,xx-s,yy+5*s);
  for(let j=0;j<3;j++){g.fillStyle(dried?0xc9b17a:0xc6d987).fillCircle(xx+.4*s,yy+(-4+j*4)*s,1.5*s);g.lineStyle(.4,shade,.65).lineBetween(xx+1.7*s,yy+(-5+j*4)*s,xx+2*s,yy+(-3+j*4)*s);}
 }break;
 case 'thyme': for(let i=0;i<6;i++){const dx=(i-2.5)*4;stem(0,0,dx,-10-Math.abs(dx)*.3,0x8c8052);for(let j=1;j<4;j++){leaf(dx*j/4,-j*3,Math.PI+.2,4,3,0x91a578);leaf(dx*j/4,-j*3,-.3,4,3,0x748f67);}}break;
 case 'oregano': for(let i=0;i<3;i++){const dx=(i-1)*7;stem(dx,0,dx,-24);for(let j=1;j<4;j++){leaf(dx,-j*6,Math.PI+.2,8,6,0x789657);leaf(dx,-j*6,-.3,8,6,0x91ac68);}}break;
 case 'sage': for(let i=0;i<7;i++)leaf((i%2?1:-1)*2,-i%3*4,-2.8+i*.43,20,8,i%2?0x93a58e:0xaab69e);break;
 case 'lemonBalm': for(let i=0;i<4;i++){const dx=(i-1.5)*5,yy=-8-i%2*7;stem(0,0,dx,yy,0x778c4a);leaf(dx,yy,dx<0?-2.6:-.5,14,14,i%2?0xacba62:0x96a752,true);leaf(dx,yy,-1.5,10,10,0xc0cb7a,true);}break;
 case 'calendula': for(let i=0;i<7;i++)leaf(0,-i%2*4,-2.8+i*.44,21,5,i%2?0x8ea65d:0x6b8d48);for(let i=0;i<3;i++){const dx=(i-1)*9;stem(0,-4,dx,-25-i%2*7);if(ready)flower(dx,-25-i%2*7,0xdba047,12,4);}break;
 case 'chamomile': for(let i=0;i<4;i++){const dx=(i-1.5)*7;stem(0,0,dx,-27-i%2*5);for(let j=1;j<4;j++){const xx=dx*j/4,yy=-j*6;stem(xx,yy,xx-6,yy-3,0x8da966);stem(xx,yy,xx+6,yy-3,0x8da966);}if(ready)flower(dx,-27-i%2*5,0xeee5ca,10,3.3);}break;
 case 'borage': for(let i=0;i<6;i++)leaf(0,-i%2*3,-2.9+i*.56,21,11,i%2?0x849b7c:0x9aab8c);for(let i=0;i<3;i++){const dx=(i-1)*10;stem(0,-5,dx,-28-i%2*5,0x8c9c7a,1.4);if(ready)flower(dx,-28-i%2*5,0x899dcc,5,4);}break;
 case 'wildflower': for(let i=0;i<3;i++){const dx=(i-1)*9;stem(dx*.3,0,dx,-25-i%2*6);leaf(dx*.6,-10,-2.4,8,4,0x8aab63);leaf(dx*.6,-15,-.7,7,4,0x749850);}break;
 case 'strawberry': for(let i=0;i<3;i++){const dx=(i-1)*10,dy=-12-i%2*6;stem(0,0,dx,dy);leaf(dx,dy,-2.7,9,8,0x789f57,true);leaf(dx,dy,-1.5,10,8,0x92b269,true);leaf(dx,dy,-.3,9,8,0x85a65e,true);}if(ready)for(let i=0;i<3;i++){const xx=x+(-8+i*8)*s,yy=y-3*s;g.fillStyle(0xc75e55).fillTriangle(xx-3*s,yy-5*s,xx+3*s,yy-5*s,xx,yy+1*s);g.fillStyle(0xe6c57c).fillCircle(xx,yy-3*s,.5);}else if(p.growth>=2||p.aftermath==='empty'){flower(-5,-14,p.aftermath?0xb4a58a:0xf2e7ca,5,2.5);flower(7,-18,p.aftermath?0xb4a58a:0xf2e7ca,5,2.5);}break;
 case 'tomato':case 'pepper':case 'cucumber':{const vine=p.kind==='cucumber';if(p.kind!=='tomato'||p.supported){stem(-8,1,-8,-40,0x8b6d49,2);stem(-8,-22,-1,-22,0xb4a27a,.8);}stem(0,0,-2,-32,0x62854a,1.7);for(let i=0;i<4;i++){const yy=-9-i*7,dx=i%2?8:-9;leaf(-1,yy,dx<0?-2.5:-.5,vine?16:12,vine?14:p.kind==='pepper'?5:8,0x7a9d53,vine||p.kind==='tomato');if(ready){const xx=x+dx*s,fy=y+(yy+4)*s;g.fillStyle(p.kind==='tomato'?0xc65d48:p.kind==='pepper'?0xbf4b3c:0x547b43);if(p.kind==='tomato'){g.fillCircle(xx,fy,3.8*s);g.fillStyle(0xe49b6c).fillEllipse(xx-1.3*s,fy-1.4*s,2.1*s,1.4*s);g.lineStyle(.65,0x638343).lineBetween(xx-2*s,fy-3*s,xx+2*s,fy-3*s);}else if(p.kind==='pepper'){g.fillPoints([[-3,-4],[0,-5],[3,-3],[4,1],[3,6],[-1,11],[0,5],[-2,1]].map(([a,b])=>({x:xx+a*s,y:fy+b*s})),true);g.lineStyle(.7,0xe58e68).lineBetween(xx-s,fy-2*s,xx-s,fy+4*s);g.lineStyle(.8,0x608345).lineBetween(xx,fy-4*s,xx+s,fy-7*s);}else g.fillEllipse(xx,fy,4*s,12*s);}}break;}
 }
 if(p.flowering&&p.kind!=='pea')for(let i=0;i<3;i++){const dx=(i-1)*8,dy=-29-i%2*8;stem(0,-4,dx,dy);if(stage==='seed'){g.fillStyle(0xb09a63).fillCircle(x+dx*s,y+dy*s,2.5*s);g.lineStyle(.6,0x685f3e).lineBetween(x+(dx-2)*s,y+(dy-1)*s,x+(dx+2)*s,y+(dy+1)*s);}else flower(dx,dy,p.kind==='thyme'||p.kind==='oregano'?0xb59bc2:p.kind==='borage'?0x899dcc:0xe6d9b3,p.kind==='borage'?5:6,3);}
}
