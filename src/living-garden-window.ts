export type GardenWindowMode='inventory'|'plans'|'people'|'skills'|'goals'|'catalog'|'mail'|'composter'|'simon'|'notebook';
// Reuse the real dialog, inventory tabs and catalog frame; never replace permanent nodes.
export class LivingGardenWindow{
 private root:HTMLElement|null=null;
 private restored:{node:HTMLElement;hidden:boolean}[]=[];
 private dialog=document.querySelector<HTMLDialogElement>('#dialogue')!;
 private closed=()=>{if(this.root){this.cleanup();this.onClose();}};
 constructor(private show:(title:string,label:string)=>void,private onClose:()=>void){this.dialog.addEventListener('close',this.closed);}
 get isOpen(){return !!this.root&&this.dialog.open&&!!this.dialog.dataset.livingGardenWindow;}
 open(mode:GardenWindowMode,title:string){
  this.cleanup();const inventory=['inventory','plans','people','skills','goals'].includes(mode);
  this.show(title,inventory?'NÁLAD VAN':mode==='simon'?'SIMON':mode==='mail'?'POSTALÁDA':'');this.dialog.dataset.livingGardenWindow=mode;
  const panel=document.querySelector<HTMLElement>(inventory?'#inventory-panel':mode==='catalog'?'#catalog-panel':mode==='simon'?'#shop-panel':'#research-panel')!;
  let target=panel;
  if(inventory){const selected=mode==='inventory'?'items':mode==='plans'?'blueprints':mode;for(const id of ['items','people','skills','goals','blueprints']){const page=document.querySelector<HTMLElement>(`#${id}-page`)!;this.restored.push({node:page,hidden:page.hidden});page.hidden=id!==selected;const tab=document.querySelector<HTMLButtonElement>(`#${id}-tab`)!;tab.setAttribute('aria-selected',String(id===selected));tab.tabIndex=id===selected?0:-1;}target=document.querySelector<HTMLElement>(`#${selected}-page`)!;}
  for(const node of Array.from(target.children) as HTMLElement[]){this.restored.push({node,hidden:node.hidden});node.hidden=true;}
  panel.hidden=false;this.root=document.createElement('div');this.root.id='living-garden-window';this.root.dataset.mode=mode;target.append(this.root);return this.root;
 }

 close(){if(!this.isOpen)return;this.cleanup();this.onClose();this.dialog.close();}
 sync(){if(this.root&&!this.isOpen){this.cleanup();this.onClose();}}
 private cleanup(){this.root?.remove();this.root=null;for(const {node,hidden}of this.restored)node.hidden=hidden;this.restored=[];delete this.dialog.dataset.livingGardenWindow;}
 destroy(){this.dialog.removeEventListener('close',this.closed);if(this.isOpen)this.dialog.close();this.cleanup();}
}
