import Phaser from 'phaser';
import {MaraArt} from './mara-art';
import {drawHen} from './livestock-art';
import {deliverHen,type AnimalOrder,type AnimalPoint as P} from './livestock';
import {gatePoint,animalApproach,penWalkRoute,farmAnimalWalk} from './livestock-geometry';
import {worldBlocked} from './village-layout';
import type {Snapshot} from './storage';
type Host={read:()=>Snapshot;commit:(s:Snapshot)=>Promise<boolean>;notice:(text:string)=>void;blocked?:(p:P)=>boolean};
export class AnimalDelivery{
 private orders:AnimalOrder[]=[];private route:P[]=[];private returnRoute:P[]=[];private inside:P[]=[];private phase:'walk'|'lower'|'release'|'return'='walk';private basket:Phaser.GameObjects.Container|null=null;private weave:Phaser.GameObjects.Graphics|null=null;private bird:Phaser.GameObjects.Graphics|null=null;private saving=false;private animation=0;private elapsed=0;private release=0;private previousOrder=0;
 constructor(private scene:Phaser.Scene,private host:Host){}
 get destinationPenId(){return this.orders[0]?.penId??null;}
 get unloadedOrderIds(){return this.orders.map(o=>o.id);}
 get carrying(){return this.orders.length>0&&(this.phase==='walk'||this.phase==='lower');}
 pending(){const s=this.host.read();return !!s.travel.livestock?.orders.some(o=>o.dueDay<=s.clock.day);}
 step(mara:MaraArt,dt:number):boolean{
  this.animation+=dt;if(this.saving)return false;
  if(!this.orders.length){const s=this.host.read(),order=s.travel.livestock?.orders.find(o=>o.dueDay<=s.clock.day);if(!order){this.clear();return true;}const pen=s.travel.livestock!.pens.find(p=>p.id===order.penId),gate=pen&&gatePoint(pen);if(!pen||!gate)return true;
   const outside=farmAnimalWalk(s,{x:mara.root.x,y:mara.root.y},gate,(x,y)=>worldBlocked(x,y,s.travel.estate.pondExpansion)||(this.host.blocked?.({x,y})??false),pen),inside=penWalkRoute(pen,gate,animalApproach('coop',pen.coop),s.travel.estate.trees);
   if(!outside||!inside){if(this.previousOrder!==order.id){this.previousOrder=order.id;this.host.notice('Mara nem fér a kifutó kapujához. A megrendelt tyúk biztonságban vár a következő fuvarig.');}return true;}
   this.orders=s.travel.livestock!.orders.filter(o=>o.penId===order.penId&&o.dueDay<=s.clock.day);this.route=outside;this.returnRoute=[...outside].reverse();this.inside=inside;this.phase='walk';this.elapsed=0;this.release=0;this.previousOrder=order.id;
   this.basket=this.scene.add.container(0,-15);this.weave=this.scene.add.graphics();this.basket.add(this.weave);mara.root.add(this.basket);this.paintBasket(false);
  }
  if(this.phase==='walk'||this.phase==='return'){
   let step=dt*48;while(this.route.length&&step>0){const p=this.route[0],d=Math.hypot(p.x-mara.root.x,p.y-mara.root.y);if(d<=step){mara.root.setPosition(p.x,p.y);this.route.shift();step-=d;}else{mara.root.x+=(p.x-mara.root.x)/d*step;mara.root.y+=(p.y-mara.root.y)/d*step;step=0;}}
   if(this.route.length)return false;if(this.phase==='return'){this.clear();return !this.pending();}this.phase='lower';this.elapsed=0;
  }
  this.elapsed+=dt;
  if(this.phase==='lower'){const t=Math.min(1,this.elapsed/.8);mara.deliveryLowering=t;if(this.basket)this.basket.y=-15+t*16;if(t<1)return false;mara.deliveryLowering=0;this.phase='release';this.elapsed=0;this.paintBasket(true);this.bird=this.scene.add.graphics().setDepth(mara.root.depth+.2);}
  if(this.phase==='release'){
   const order=this.orders[this.release];if(!order){this.basket?.destroy(true);this.basket=null;this.weave=null;this.bird?.destroy();this.bird=null;this.phase='return';this.route=this.returnRoute;this.host.notice('Mara meghozta az új lakókat. Az ólnál nevet adhatsz nekik.');return false;}
   const length=this.inside.slice(1).reduce((sum,p,i)=>sum+Math.hypot(p.x-this.inside[i].x,p.y-this.inside[i].y),0),distance=this.elapsed*24;let remaining=distance,p=this.inside[0];for(let i=1;i<this.inside.length;i++){const q=this.inside[i],d=Math.hypot(q.x-p.x,q.y-p.y);if(remaining<d){p={x:p.x+(q.x-p.x)*remaining/d,y:p.y+(q.y-p.y)*remaining/d};break;}remaining-=d;p=q;}
   if(this.bird){drawHen(this.bird,order.variety,this.animation,'walk');this.bird.setPosition(p.x,p.y).setDepth(300+p.y*.01+.02);}if(distance<length+.5)return false;
   const next=deliverHen(this.host.read(),order.id);if(!next)return false;this.saving=true;void this.host.commit(next).then(ok=>{this.saving=false;if(ok){this.release++;this.elapsed=0;this.bird?.clear();}}).catch(()=>{this.saving=false;});
  }return false;
 }
 private paintBasket(open:boolean){const g=this.weave;if(!g)return;g.clear();g.fillStyle(0x695139).fillRoundedRect(-14,-11,28,15,3);g.fillStyle(0xb49562).fillRoundedRect(-13,-10,26,13,3);for(let i=-10;i<13;i+=4)g.lineStyle(.7,0xdec395).lineBetween(i,-9,i,2);for(let y=-7;y<3;y+=3)g.lineStyle(.7,0x806440).lineBetween(-12,y,12,y);g.lineStyle(2,0xd0b27b).strokeEllipse(0,-10,27,7);if(open){g.fillStyle(0x624f37).fillEllipse(0,-10,22,5);g.lineStyle(2,0xc4a572).strokeEllipse(0,-20,26,7);g.lineStyle(1,0x907247).lineBetween(-12,-20,12,-20);}else{g.fillStyle(0xbfa16b).fillEllipse(0,-11,26,6);g.lineStyle(2,0x765c3e).beginPath().arc(0,-13,7,Math.PI,Math.PI*2).strokePath();}}
 private clear(){this.basket?.destroy(true);this.basket=null;this.weave=null;this.bird?.destroy();this.bird=null;this.orders=[];this.route=[];this.returnRoute=[];this.phase='walk';}
 reset(mara:MaraArt){mara.deliveryLowering=0;this.clear();}
 destroy(){this.clear();}
}
