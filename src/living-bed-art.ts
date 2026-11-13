import {bedMarkerLayout,bedMarkerCenter} from './bed-marker-layout';
import {paintLivingPlant} from './living-plant-art';
import Phaser from 'phaser';
import {livingFlowers,bedShowsDryCracks,hasBerrySupport,type LivingBed} from './living-bed';
import {livingBedArea,livingPlantPoint,type LivingBedArea} from './living-bed-layout';
export {livingBedArea,livingPlantPoint} from './living-bed-layout';
export function paintMarker(g:Phaser.GameObjects.Graphics,b:LivingBedArea){paintBedMarker(g,{x:b.x+35,y:b.y+b.h+17});}
export function paintBedMarker(g:Phaser.GameObjects.Graphics,anchor:{x:number;y:number}){
 const {x,y}=bedMarkerCenter(anchor),{width,height,angle}=bedMarkerLayout,c=Math.cos(angle),s=Math.sin(angle);
 const point=(dx:number,dy:number)=>({x:x+dx*c-dy*s,y:y+dx*s+dy*c});
 g.fillStyle(0x705137).fillRect(x-2,y-1,4,24);
 g.fillStyle(0x906b42).fillPoints([point(-width/2,-height/2),point(width/2,-height/2),point(width/2,height/2),point(-width/2,height/2)],true);
 const a=point(-28,-13),z=point(27,-13);g.lineStyle(1,0xc4a069).lineBetween(a.x,a.y,z.x,z.y);
 const e=point(-27,13),f=point(25,13);g.lineStyle(1,0x775236).lineBetween(e.x,e.y,f.x,f.y);
 for(const dx of [-29,29]){const p=point(dx,0);g.fillStyle(0xd2b67d).fillCircle(p.x,p.y,1);}
}

export function paintLivingBed(g:Phaser.GameObjects.Graphics,s:LivingBed,selected:number,area:LivingBedArea=livingBedArea,valid=true,placing=false,marker=true){
 const {x,y,w,h}=area;g.clear();g.fillStyle(0x304734,.18).fillEllipse(x+w/2,y+h/2+7,w+22,h+14);

 if(!s.prepared){g.lineStyle(1,valid?0xc4b480:0xc57662,.85);for(const [a,b]of [[x,y+4],[x+w-5,y],[x+w,y+h],[x+4,y+h-2]]){g.fillStyle(0x755839).fillRect(a-2,b-8,4,13);g.fillStyle(0xc5a777).fillRect(a-2,b-8,4,3);}g.lineStyle(1,valid?0xc7b989:0xd5836b,.8).strokePoints([{x,y:y+4},{x:x+w-5,y},{x:x+w,y:y+h},{x:x+4,y:y+h-2}],true);if(!placing&&marker)paintMarker(g,area);return;}
 g.fillStyle(0x60472f).fillRoundedRect(x-4,y-3,w+8,h+9,17);g.fillStyle([0xb29466,0x9a794f,0x80603f,0x584330][s.moisture]).fillRoundedRect(x,y,w,h,14);
 for(let i=0;i<42;i++){const xx=x+9+(i*43%(w-18)),yy=y+7+(i*29%(h-14));g.fillStyle(s.moisture?0x3d3426:0x6d5337,.28).fillEllipse(xx,yy,3+i%3,1.5);}
 if(bedShowsDryCracks(s)){
  const cracks=[[[.025,.31],[.061,.27],[.086,.32],[.139,.28],[.17,.35]],[[.086,.32],[.10,.42],[.14,.45]],[[.97,.24],[.93,.30],[.90,.26],[.86,.34],[.82,.33]],[[.90,.26],[.88,.18],[.84,.16]],[[.045,.75],[.09,.69],[.125,.73],[.16,.66],[.21,.68]],[[.125,.73],[.13,.84],[.17,.89]],[[.95,.78],[.91,.72],[.88,.76],[.84,.68],[.80,.70]],[[.88,.76],[.87,.87],[.82,.91]],[[.30,.04],[.32,.12],[.29,.18],[.34,.23]],[[.32,.12],[.37,.10],[.40,.15]],[[.68,.96],[.65,.87],[.69,.79],[.65,.73]],[[.65,.87],[.60,.84],[.57,.87]]];
  for(const points of cracks){g.lineStyle(1.25,0x5f4933,.8).beginPath();points.forEach(([xx,yy],i)=>i?g.lineTo(x+xx*w,y+yy*h):g.moveTo(x+xx*w,y+yy*h));g.strokePath();g.lineStyle(.45,0xd0b184,.55).beginPath();points.forEach(([xx,yy],i)=>i?g.lineTo(x+xx*w+.8,y+yy*h+.8):g.moveTo(x+xx*w+.8,y+yy*h+.8));g.strokePath();}
 }

 if(s.mulched)for(let i=0;i<80;i++){const xx=x+7+i*47%(w-14),yy=y+6+i*31%(h-12);g.lineStyle(1,i%3?0xb79a61:0xd0b87d,.8).lineBetween(xx,yy,xx+4+i%4,yy+(i%3-1)*2);}
 if(s.cover==='gravel')for(let i=0;i<140;i++){const xx=x+7+(i*47%(w-14)),yy=y+6+(i*31%(h-12));g.fillStyle([0xb4ac93,0x8e9580,0xc8bda3][i%3]).fillEllipse(xx,yy,3+i%3,2+i%2);}
 for(const kind of ['raspberry','blackberry'] as const)if(hasBerrySupport(s,kind))for(let row=0;row<3;row++){const points=s.plants.flatMap((p,i)=>!p.removed&&Math.floor(i/3)===row&&p.kind===kind?[livingPlantPoint(i,area)]:[]);if(!points.length)continue;const left=Math.min(...points.map(p=>p.x))-17,right=Math.max(...points.map(p=>p.x))+17,base=Math.max(...points.map(p=>p.y))+3;for(const xx of [left,right]){g.lineStyle(3,0x735738).lineBetween(xx,base,xx,base-59);g.lineStyle(1,0xc3a170).lineBetween(xx-.8,base-2,xx-.8,base-58);g.lineStyle(3.5,0xb89968).lineBetween(xx-2,base-59,xx+2,base-59);}for(const dy of [-20,-40]){g.lineStyle(1,0x777e69).lineBetween(left,base+dy,right,base+dy);g.lineStyle(.45,0xd4ceb1).lineBetween(left,base+dy-.8,right,base+dy-.8);}}

 for(let i=0;i<s.plants.length;i++){const point=livingPlantPoint(i,area);paintLivingPlant(g,s.plants[i],point.x,point.y,s.moisture,i===selected);}
 for(const [i,p]of s.plants.entries())if(!p.removed&&hasBerrySupport(s,p.kind)){const point=livingPlantPoint(i,area);for(const dy of [-17,-31]){g.lineStyle(.85,0xd5bf8b,.95).strokeEllipse(point.x,point.y+dy,5,2.5);g.lineStyle(.65,0x836949).lineBetween(point.x+2,point.y+dy,point.x+4,point.y+dy+3);}}
 if(marker)paintMarker(g,area);
}
export function paintBedVisitors(g:Phaser.GameObjects.Graphics,s:LivingBed,time:number,area:LivingBedArea=livingBedArea,clear=true){if(clear)g.clear();const flowers=livingFlowers(s);if(!flowers||s.weather==='rain')return;for(let i=0;i<Math.min(3,flowers);i++){const point=livingPlantPoint((i*3+2)%9,area),t=time*.001+i*2.4,x=point.x+Math.cos(t)*14,y=point.y-22+Math.sin(t*1.6)*8;g.fillStyle(0xe9e2be,.8).fillEllipse(x-1,y-3,5,3).fillEllipse(x+3,y-3,5,3);g.fillStyle(0xc7a45e).fillEllipse(x,y,6,3);g.lineStyle(1,0x4e5037).lineBetween(x,y-1,x,y+1);}}
