import {foundationOffsets} from './pond-foundation';
import Phaser from 'phaser';
import {pondOutline,pondArea,brushPond,smoothPondExpansion,POND_SECTORS} from './pond-shape';
import {expandPond,pondExpansionCost,pondExpansionError,pondRefund,pondRemovalError,removePondExpansion} from './pond-expansion';
import type {Snapshot} from './storage';
import {itemIcon} from './item-icons';
import './pond-expansion.css';
type Point={x:number;y:number};
type Host={read:()=>Snapshot;ready:()=>boolean;commit:(next:Snapshot)=>Promise<boolean>;begin:()=>void;changed:()=>void;notice:(text:string)=>void};
export class PondExpansionController{
 active=false;private removing=false;private dragging=false;private saving=false;private brush=28;private points:Point[]=[];private before:number[]=[];private draft:number[]=[];private error='';private saveMessage='';private cursor:Point|null=null;private preview:Phaser.GameObjects.Graphics;private panel:HTMLDivElement;private summary!:HTMLParagraphElement;private status!:HTMLParagraphElement;private confirm!:HTMLButtonElement;
 constructor(private scene:Phaser.Scene,private host:Host){this.preview=scene.add.graphics().setDepth(154);this.panel=document.createElement('div');this.panel.className='pond-builder-panel';this.panel.hidden=true;this.panel.setAttribute('aria-label','Tó bővítése');document.querySelector('#game')!.append(this.panel);window.addEventListener('keydown',this.key,true);scene.events.once('shutdown',()=>this.destroy());}
 appendPlan(parent:HTMLElement){
  const s=this.host.read(),card=document.createElement('article');card.className='inventory-card';card.id='pond-expansion-plan';const title=document.createElement('strong');title.textContent='Tó bővítése';card.append(itemIcon('lily'),title);
  const info=document.createElement('p');info.textContent='Rajzold meg az új partvonalat. A tó legfeljebb az eredeti méretének kétszeresére bővíthető.';
  const price=document.createElement('div');price.className='recipe-costs';const caption=document.createElement('p');caption.textContent='10% bővítés ára:';price.append(caption);for(const [icon,text]of [['gold','95 gold'],['stone','16 kő']] as const){const row=document.createElement('p');row.className='recipe-cost';row.append(itemIcon(icon),document.createTextNode(text));price.append(row);}const used=document.createElement('p');used.textContent=`A tó mérete: ${Math.round(pondArea(s.travel.estate.pondExpansion??[])/pondArea(foundationOffsets(s.travel.estate))*100)}% / 200%`;
  const b=document.createElement('button');b.type='button';b.id='start-pond-expansion';b.textContent='Partvonal kialakítása';b.disabled=pondArea(s.travel.estate.pondExpansion??[])>=pondArea(foundationOffsets(s.travel.estate))*2-1;b.onclick=()=>{this.host.begin();document.querySelector<HTMLDialogElement>('#dialogue')!.close();this.start();};card.append(info,price,used,b);
  if(pondArea(s.travel.estate.pondExpansion??[])-pondArea(foundationOffsets(s.travel.estate))>=1){const refund=pondRefund(s),remove=this.button(`Bővítés visszabontása · +${refund.gold} gold · +${refund.stone} kő`,'remove-pond-expansion',()=>{this.host.begin();document.querySelector<HTMLDialogElement>('#dialogue')!.close();this.start(true);});card.append(remove);}
  parent.append(card);
 }
 start(removing=false){this.removing=removing;this.before=[...this.host.read().travel.estate.pondExpansion??[]];this.draft=Array.from({length:POND_SECTORS},(_,i)=>this.before[i]??0);if(removing)this.draft=Array.from({length:POND_SECTORS},(_,i)=>foundationOffsets(this.host.read().travel.estate)[i]??0);this.points=[];this.error='';this.saveMessage='';this.cursor=null;this.active=true;this.panel.hidden=false;this.makePanel();this.paint();}
 cancel(){if(this.saving)return;this.active=false;this.dragging=false;this.points=[];this.preview.clear();this.panel.hidden=true;}
 private key=(e:KeyboardEvent)=>{if(this.active&&e.code==='Escape'){e.preventDefault();e.stopImmediatePropagation();this.cancel();}};
 pointer(point:Point){if(!this.active||this.removing||!this.host.ready()||this.saving)return;this.cursor={...point};this.dragging=true;this.add(point);}
 move(point:Point){if(!this.active||this.removing||this.saving)return;this.cursor={...point};if(this.dragging&&this.host.ready())this.add(point);else this.paint();}
 endPointer(){this.dragging=false;}
 private add(point:Point){
  const back=this.points.findIndex((p,i)=>i<this.points.length-1&&Math.hypot(p.x-point.x,p.y-point.y)<10);
  if(back>=0){this.points=back===0?[]:this.points.slice(0,back+1);this.rebuild();return;}
  const last=this.points.at(-1);if(last&&Math.hypot(point.x-last.x,point.y-last.y)<8)return;
  if(this.points.length>=200){this.error='A rajz elérte a méretkorlátot. Visszafelé húzva javíthatsz.';this.paint();return;}
  if(last){const distance=Math.hypot(point.x-last.x,point.y-last.y);for(let d=8;d<distance&&this.points.length<200;d+=8)this.points.push({x:last.x+(point.x-last.x)*d/distance,y:last.y+(point.y-last.y)*d/distance});}
  this.points.push({...point});this.rebuild();
 }
 private rebuild(){let draft=Array.from({length:POND_SECTORS},(_,i)=>this.before[i]??0);this.error='';this.saveMessage='';for(const p of this.points){const next=brushPond(draft,p,this.brush);if(!next){this.error='A bővítésnek a meglévő tóhoz kell csatlakoznia.';break;}draft=next;}this.draft=smoothPondExpansion(draft,this.before,foundationOffsets(this.host.read().travel.estate));this.paint();}
 private button(text:string,id:string,action:()=>void){const b=document.createElement('button');b.type='button';b.textContent=text;b.id=id;b.onclick=action;return b;}
 private makePanel(){
  this.panel.replaceChildren();if(this.removing){const title=document.createElement('strong');title.textContent='Tóbővítés visszabontása';const help=document.createElement('p');help.textContent='A tó visszaáll az eredeti méretére.';this.summary=document.createElement('p');this.status=document.createElement('p');this.status.setAttribute('role','status');this.confirm=this.button('Visszabontom','confirm-pond-expansion',()=>{void this.commit();});this.panel.append(title,help,this.summary,this.status,this.confirm,this.button('Mégsem','cancel-pond-expansion',()=>this.cancel()));return;}const title=document.createElement('strong');title.textContent='Tó bővítése';const help=document.createElement('p');help.textContent='Húzd az új partszakaszt a tó mellől. Visszafelé húzva javíthatsz.';
  const label=document.createElement('label');label.textContent='Ecset mérete';const range=document.createElement('input');range.type='range';range.min='16';range.max='40';range.step='4';range.value=String(this.brush);range.setAttribute('aria-label','Tóbővítő ecset mérete');range.oninput=()=>{this.brush=Number(range.value);this.rebuild();};label.append(range);
  this.summary=document.createElement('p');this.summary.id='pond-expansion-cost';this.status=document.createElement('p');this.status.setAttribute('role','status');this.status.id='pond-expansion-status';
  this.confirm=this.button('Elkészítem','confirm-pond-expansion',()=>{void this.commit();});const clear=this.button('Rajz törlése','clear-pond-expansion',()=>{this.points=[];this.error='';this.draft=Array.from({length:POND_SECTORS},(_,i)=>this.before[i]??0);this.paint();});const cancel=this.button('Mégsem','cancel-pond-expansion',()=>this.cancel());this.panel.append(title,help,label,this.summary,this.status,this.confirm,clear,cancel);
 }
 private paint(){
  if(!this.active)return;
  if(this.removing){const s=this.host.read(),refund=pondRefund(s),error=pondRemovalError(s);this.preview.clear().lineStyle(1.5,0xd5dfb7,.95).strokePoints(pondOutline(foundationOffsets(s.travel.estate)),true);this.summary.textContent=`Visszajár: ${refund.gold} gold · ${refund.stone} kő`;this.status.textContent=error||this.saveMessage;this.confirm.disabled=!!error||this.saving;return;}
  const s=this.host.read(),cost=pondExpansionCost(this.before,this.draft,foundationOffsets(s.travel.estate)),error=this.error||pondExpansionError(s,this.draft),afford=s.economy.gold>=cost.gold&&s.clearing.stone>=cost.stone;
  this.preview.clear();const points=pondOutline(this.draft);this.preview.fillStyle(error?0xc17868:0x7eb3a4,.25).fillPoints(points,true);this.preview.lineStyle(1.5,error?0xc67b69:0xd5dfb7,.95).strokePoints(points,true);
  this.summary.textContent=`Bővítés: +${cost.percent.toFixed(1)}% · ${cost.gold} gold · ${cost.stone} kő\nTóméret: ${Math.round(pondArea(this.draft)/pondArea(foundationOffsets(s.travel.estate))*100)}% / 200%`;
  if(this.cursor)this.preview.lineStyle(1,error?0xc67b69:0xd8e1be,.7).strokeCircle(this.cursor.x,this.cursor.y,this.brush);
  this.status.textContent=error||this.saveMessage||(cost.area>0&&!afford?'Nincs elég gold vagy kő a kijelölt bővítéshez.':'');this.confirm.disabled=!!error||cost.area<1||!afford||this.saving;
 }
 private async commit(){
  if(this.saving||!this.host.ready())return;const next=this.removing?removePondExpansion(this.host.read()):this.error?null:expandPond(this.host.read(),this.draft);if(!next){this.paint();return;}
  this.saving=true;this.confirm.disabled=true;
  try{if(await this.host.commit(next)){this.saving=false;this.cancel();this.host.changed();this.host.notice(this.removing?'A tó visszaállt az eredeti méretére. A gold és a kő visszakerült hozzád.':'A tó bővítése elkészült.');}else{this.saveMessage='Nem sikerült menteni. A gold és a kő megmaradt.';}}finally{this.saving=false;if(this.active)this.paint();}
 }
 update(){if(!this.active)return;const s=this.host.read();if(s.player.y>=600||s.player.y< -360){this.cancel();return;}this.panel.hidden=document.querySelector<HTMLDialogElement>('#dialogue')!.open;this.preview.setVisible(!this.panel.hidden);}
 destroy(){window.removeEventListener('keydown',this.key,true);this.preview.destroy();this.panel.remove();}
}
