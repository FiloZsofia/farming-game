import type Phaser from 'phaser';
export class VillageAmbience{
 private lamps:Phaser.GameObjects.Graphics;private birds:Phaser.GameObjects.Graphics;private time=0;private layer:HTMLDivElement;private lights:{element:HTMLDivElement;x:number;y:number;scale:number}[]=[];
 constructor(private scene:Phaser.Scene){
  const layer=this.layer=document.createElement('div');layer.className='village-light-layer';layer.setAttribute('aria-hidden','true');document.querySelector('#game')!.append(layer);
  for(const [x,y]of [[418,936],[520,1194],[577,1297],[748,1297]]){const element=document.createElement('div');element.className='workshop-lamp-light village-street-light';element.setAttribute('aria-hidden','true');for(const name of ['halo','pool','core']){const part=document.createElement('i');part.className=name;element.append(part);}layer.append(element);this.lights.push({element,x,y,scale:1});}
  for(const [x,y,w,h]of [[528,873,28,29],[627,873,28,29],[753,1009,41,43],[825,1009,41,43],[578,1253,28,29],[712,1253,28,29]]){const element=document.createElement('div');element.className='village-window-light';element.style.width=`${w-4}px`;element.style.height=`${h-4}px`;element.setAttribute('aria-hidden','true');layer.append(element);this.lights.push({element,x:x+2,y:y+2,scale:1});}
  scene.events.once('shutdown',()=>this.destroy());
  this.lamps=scene.add.graphics().setDepth(2);this.birds=scene.add.graphics().setDepth(3);
  for(const [x,y]of [[418,936],[520,1194],[577,1297],[748,1297]]){for(const [r,a]of [[46,.035],[30,.06],[17,.12]])this.lamps.fillStyle(0xffd887,a).fillCircle(x,y,r);this.lamps.fillStyle(0xffe6a8,.9).fillRoundedRect(x-5,y-7,10,12,2);this.lamps.fillStyle(0xf8d88a,.09).fillEllipse(x,y+30,78,31);}
  for(const [x,y,w,h]of [[528,873,28,29],[627,873,28,29],[753,1009,41,43],[825,1009,41,43],[578,1253,28,29],[712,1253,28,29]]){this.lamps.fillStyle(0xffd991,.35).fillRect(x+2,y+2,w-4,h-4);this.lamps.lineStyle(2,0xe8d6aa).lineBetween(x+w/2,y,x+w/2,y+h).lineBetween(x,y+h/2,x+w,y+h/2);}
 }
 update(dt:number,darkness:number,visible:boolean,player:{x:number;y:number},rain:boolean){
  const camera=this.scene.cameras.main,z=camera.zoom,opacity=Math.min(1,Math.max(0,darkness/.55));for(const light of this.lights){light.element.hidden=!visible||opacity===0||!(light.x>=camera.worldView.left-100&&light.x<=camera.worldView.right+100&&light.y>=camera.worldView.top-100&&light.y<=camera.worldView.bottom+100);light.element.style.opacity=String(opacity);light.element.style.transform=`translate(${(light.x-camera.worldView.x)*z}px,${(light.y-camera.worldView.y)*z}px) scale(${z*light.scale})`;}
  this.time+=dt;this.lamps.setVisible(visible).setAlpha(Math.min(1,darkness/.55));const g=this.birds;g.clear();g.setVisible(visible);if(!g.visible)return;for(let i=0;i<3;i++){const t=(this.time*.35+i/3)%1;g.lineStyle(.7,0xd6e1c2,(1-t)*.65).strokeEllipse(476,1076,5+t*34,3+t*15);}if(darkness>=.25||rain)return;
  for(let i=0;i<3;i++){const phase=(this.time+i*4)%18,t=Math.min(1,Math.max(0,(phase-11)/4)),sx=450+i*24,sy=1112+(i%2)*17,scared=Math.hypot(player.x-sx,player.y-sy)<34;const flying=t>0&&t<1||scared,x=sx+Math.sin(t*Math.PI*2)*32,y=sy-Math.sin(t*Math.PI)*40-(scared?20:0),hop=phase<7?Math.max(0,Math.sin(phase*5))*2:0;
   g.fillStyle(0x3c4e3b,.2).fillEllipse(x,y+3,9,3);g.fillStyle(i===1?0x9a795c:0x687164).fillEllipse(x,y-3-hop,7,5);g.fillStyle(0xc9bda0).fillEllipse(x-2,y-2-hop,3,3);g.fillStyle(0x5c6256).fillCircle(x+3,y-5-hop,2.5);g.fillStyle(0xd5ae70).fillTriangle(x+5,y-5-hop,x+8,y-4-hop,x+5,y-3-hop);g.fillStyle(0x333f34).fillCircle(x+3.5,y-5.5-hop,.6);g.lineStyle(1.5,0x51594e);if(flying){const flap=Math.sin(this.time*17+i)*5;g.lineBetween(x,y-3,x-5,y-6-flap).lineBetween(x,y-3,x+4,y-7-flap);}else{g.lineBetween(x-3,y-2-hop,x-7,y-5-hop);g.lineStyle(.7,0x8a7654).lineBetween(x-1,y,x-1,y+2).lineBetween(x+2,y,x+3,y+2);}
  }
 }
 destroy(){for(const light of this.lights)light.element.remove();this.lights=[];this.layer.remove();this.lamps.destroy();this.birds.destroy();}
}
