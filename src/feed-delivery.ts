import Phaser from 'phaser';
import type {Snapshot} from './storage';
import {deliverFeed,feedSackPosition,type AnimalPoint as P} from './livestock';
import {MaraArt} from './mara-art';
import {drawFeedSack} from './feed-sack-art';
import {farmAnimalWalk,inAnimalPolygon} from './livestock-geometry';
import {farmLayout} from './layout';
import {nearestBasePath} from './garden-path';
import {worldBlocked} from './village-layout';
type Host={read:()=>Snapshot;commit:(s:Snapshot)=>Promise<boolean>;notice:(text:string)=>void;blocked?:(p:P)=>boolean};
export class FeedDelivery{
 private ids:number[]=[];private route:P[]=[];private back:P[]=[];private returning=false;private sack:Phaser.GameObjects.Graphics|null=null;private lowering=0;private saving=false;private drop:P|null=null;
 constructor(private scene:Phaser.Scene,private host:Host){}
 get carrying(){return !!this.sack&&!this.returning;}
 pending(){const s=this.host.read();return !!s.travel.livestock?.feedOrders?.some(o=>o.deliveredDay===undefined&&o.dueDay<=s.clock.day);}
 step(mara:MaraArt,dt:number){if(this.saving)return false;
  if(!this.ids.length){const s=this.host.read(),orders=s.travel.livestock?.feedOrders?.filter(o=>o.deliveredDay===undefined&&o.dueDay<=s.clock.day)??[];if(!orders.length)return true;
   const m=farmLayout.mailbox,spots=[[-30,30],[-30,0],[2,54],[-60,30],[-60,0],[-30,60]].map(([dx,dy])=>({x:m.x+dx,y:m.y+dy}));let route:P[]|null=null;
   for(const p of spots){if(s.travel.livestock?.feedOrders?.some(o=>{const q=o.deliveredDay!==undefined?feedSackPosition(o,s.travel.livestock!.feedOrders!):undefined;return q&&Math.hypot(q.x-p.x,q.y-p.y)<28;}))continue;const base=nearestBasePath(p,farmLayout.paths);if(base&&base.distance<base.width/2+15||worldBlocked(p.x,p.y,s.travel.estate.pondExpansion)||s.travel.homestead?.garden.paths.some(q=>Math.hypot(q.x-p.x,q.y-p.y)<25)||s.travel.homestead?.garden.beds.some(b=>p.x>b.area.x-14&&p.x<b.area.x+b.area.w+14&&p.y>b.area.y-20&&p.y<b.area.y+b.area.h+14)||s.skill.chests?.placed.some(q=>Math.hypot(q.x-p.x,q.y-p.y)<32)||s.travel.estate.trees.some(q=>Math.hypot(q.x-p.x,q.y-p.y)<32)||s.travel.crafting?.machines.some(q=>Math.hypot(q.x-p.x,q.y-p.y)<30)||s.travel.livestock?.pens.some(q=>inAnimalPolygon(p,q.boundary)))continue;route=farmAnimalWalk(s,mara.root,p,(x,y)=>worldBlocked(x,y,s.travel.estate.pondExpansion)||(this.host.blocked?.({x,y})??false));if(route){this.drop=p;break;}}
   if(!route){this.host.notice('Mara nem fér a postaláda melletti lerakóhelyhez. A takarmány a következő fuvarig nála marad.');return true;}this.ids=[orders[0].id];this.route=route;this.back=[...route].reverse();this.returning=false;this.lowering=0;this.sack=this.scene.add.graphics().setPosition(0,-12);drawFeedSack(this.sack);mara.root.add(this.sack);
  }
  let remaining=dt*48;while(this.route.length&&remaining>0){const p=this.route[0],d=Math.hypot(p.x-mara.root.x,p.y-mara.root.y);if(d<=remaining){mara.root.setPosition(p.x,p.y);this.route.shift();remaining-=d;}else{mara.root.x+=(p.x-mara.root.x)*remaining/d;mara.root.y+=(p.y-mara.root.y)*remaining/d;remaining=0;}}
  if(this.route.length)return false;if(this.returning){this.reset(mara);return !this.pending();}
  this.lowering=Math.min(1,this.lowering+dt/.8);mara.deliveryLowering=this.lowering;if(this.sack)this.sack.y=-12+this.lowering*12;if(this.lowering<1)return false;
  const next=deliverFeed(this.host.read(),this.ids,this.drop!);if(!next){this.reset(mara);return true;}this.saving=true;void this.host.commit(next).then(ok=>{this.saving=false;if(!ok)return;this.sack?.destroy();this.sack=null;mara.deliveryLowering=0;this.returning=true;this.route=this.back;this.host.notice('Mara a postaláda mellé tette a takarmányt. A zsákot felveheted a Készletedbe.');}).catch(()=>{this.saving=false;});return false;
 }
 reset(mara:MaraArt){mara.deliveryLowering=0;this.sack?.destroy();this.sack=null;this.ids=[];this.route=[];this.back=[];this.returning=false;this.drop=null;}
 destroy(){this.sack?.destroy();this.sack=null;}
}
