import Phaser from 'phaser';
import {MaraArt} from './mara-art';
import {drawHen} from './livestock-art';
import {deliverHen,type AnimalOrder,type AnimalPoint as P} from './livestock';
import {gatePoint,animalApproach,penWalkRoute,farmAnimalWalk} from './livestock-geometry';
import {worldBlocked} from './village-layout';
import type {Snapshot} from './storage';
type Host={read:()=>Snapshot;commit:(s:Snapshot)=>Promise<boolean>;notice:(text:string)=>void;blocked?:(p:P)=>boolean};
export class AnimalDelivery{
 private order:AnimalOrder|null=null;private route:P[]=[];private returnRoute:P[]=[];private returning=false;private carried:Phaser.GameObjects.Container|null=null;private bird:Phaser.GameObjects.Graphics|null=null;private saving=false;private wait=0;private previousOrder=0;private animation=0;private lowering=0;
 constructor(private scene:Phaser.Scene,private host:Host){}
 get carrying(){return !!this.order&&!this.returning;}
 pending(){const s=this.host.read();return !!s.travel.livestock?.orders.some(o=>o.dueDay<=s.clock.day);}
 step(mara:MaraArt,dt:number):boolean{
  this.animation+=dt;this.wait=Math.max(0,this.wait-dt);if(this.saving||this.wait>0)return false;
  if(!this.order){const s=this.host.read(),order=s.travel.livestock?.orders.find(o=>o.dueDay<=s.clock.day);if(!order){this.clear();return true;}const pen=s.travel.livestock!.pens.find(p=>p.id===order.penId),gate=pen&&gatePoint(pen);if(!pen||!gate)return true;
   const start={x:mara.root.x,y:mara.root.y},outside=farmAnimalWalk(s,start,gate,(x,y)=>worldBlocked(x,y,s.travel.estate.pondExpansion)||(this.host.blocked?.({x,y})??false),pen),inside=penWalkRoute(pen,gate,animalApproach('coop',pen.coop));
   if(!outside||!inside){if(this.previousOrder!==order.id){this.previousOrder=order.id;this.host.notice('Mara nem fér a kifutó kapujához. A megrendelt tyúk biztonságban vár a következő fuvarig.');}return true;}
   this.order=order;this.route=[...outside,...inside.slice(1)];this.returnRoute=[...this.route].reverse();this.returning=false;this.lowering=0;this.previousOrder=order.id;
   this.carried=this.scene.add.container(0,-25);this.bird=this.scene.add.graphics();this.carried.add(this.bird);mara.root.add(this.carried);drawHen(this.bird,order.variety,0,'rest');
  }
  if(this.bird&&this.order)drawHen(this.bird,this.order.variety,this.animation,'rest');
  let step=dt*48;while(this.route.length&&step>0){const p=this.route[0],distance=Math.hypot(p.x-mara.root.x,p.y-mara.root.y);if(distance<=step){mara.root.setPosition(p.x,p.y);this.route.shift();step-=distance;}else{mara.root.x+=(p.x-mara.root.x)/distance*step;mara.root.y+=(p.y-mara.root.y)/distance*step;step=0;}}
  if(this.route.length)return false;
  if(this.returning){mara.deliveryLowering=0;this.clear();return !this.pending();}
  this.lowering=Math.min(1,this.lowering+dt/.65);mara.deliveryLowering=this.lowering;if(this.carried)this.carried.y=-25+this.lowering*19;if(this.lowering<1)return false;
  const next=deliverHen(this.host.read(),this.order!.id);if(!next){this.wait=1;return false;}
  this.saving=true;void this.host.commit(next).then(ok=>{this.saving=false;if(!ok){this.wait=1;return;}this.carried?.destroy(true);this.carried=null;this.bird=null;mara.deliveryLowering=0;this.returning=true;this.route=this.returnRoute;this.host.notice('Mara megérkezett az új tyúkkal. Az ólnál nevet adhatsz neki.');}).catch(()=>{this.saving=false;this.wait=2;});return false;
 }
 private clear(){this.carried?.destroy(true);this.carried=null;this.bird=null;this.order=null;this.route=[];this.returnRoute=[];this.returning=false;}
 reset(mara:MaraArt){mara.deliveryLowering=0;this.clear();}
 destroy(){this.clear();}
}
