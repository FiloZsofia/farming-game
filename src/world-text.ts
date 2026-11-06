import Phaser from 'phaser';
// Keep Phaser positioning, bounds and input, but let the browser rasterize letters
// at the display's native density instead of magnifying the pixel-art canvas.
type Entry={text:Phaser.GameObjects.Text;label:HTMLDivElement;signature:string};
const layers=new WeakMap<Phaser.Scene,{add:(text:Phaser.GameObjects.Text)=>void}>();
function textLayer(scene:Phaser.Scene){
 const existing=layers.get(scene);if(existing)return existing;
 const layer=document.createElement('div');layer.className='world-text-layer';layer.setAttribute('aria-hidden','true');scene.game.canvas.parentElement!.insertAdjacentElement('afterend',layer);
 const entries=new Set<Entry>();
 const sync=()=>{
  const camera=scene.cameras.main,rect=scene.game.canvas.getBoundingClientRect(),sx=rect.width/scene.scale.width,sy=rect.height/scene.scale.height;
  for(const entry of entries){
   const {text,label}=entry;let visible=text.visible&&Boolean(text.text)&&camera.visible&&!(text.cameraFilter&camera.id),alpha=text.alpha*camera.alpha;
   for(let parent=text.parentContainer;parent;parent=parent.parentContainer){visible=visible&&parent.visible&&!(parent.cameraFilter&camera.id);alpha*=parent.alpha;}
   label.hidden=!visible;if(!visible)continue;
   const style=text.style,pad={top:text.padding.top??0,right:text.padding.right??0,bottom:text.padding.bottom??0,left:text.padding.left??0},lines=text.getWrappedText(),signature=JSON.stringify([text.text,text.width,text.height,pad,style.fontFamily,style.fontSize,style.fontStyle,style.color,style.backgroundColor,style.align,style.stroke,style.strokeThickness,lines]);
   if(signature!==entry.signature){
    label.textContent=lines.join('\n');Object.assign(label.style,{fontFamily:style.fontFamily,fontSize:style.fontSize,fontStyle:style.fontStyle.includes('italic')?'italic':'normal',fontWeight:style.fontStyle.includes('bold')?'bold':'normal',color:style.color,backgroundColor:style.backgroundColor||'transparent',textAlign:style.align,width:`${text.width}px`,height:`${text.height}px`,padding:`${pad.top}px ${pad.right}px ${pad.bottom}px ${pad.left}px`,lineHeight:`${(text.height-pad.top-pad.bottom)/Math.max(1,lines.length)}px`});
    label.style.setProperty('-webkit-text-stroke',style.strokeThickness?`${style.strokeThickness}px ${style.stroke}`:'0px');entry.signature=signature;
   }
   const parent=text.parentContainer?.getWorldTransformMatrix(),m=Phaser.GameObjects.GetCalcMatrix(text,camera,parent).calc;
   label.style.transform=`matrix(${m.a*sx},${m.b*sy},${m.c*sx},${m.d*sy},${rect.left+m.e*sx},${rect.top+m.f*sy}) translate(${-text.displayOriginX}px,${-text.displayOriginY}px)`;
   label.dataset.kind=String(text.getData('worldTextKind')??'label');label.style.opacity=String(alpha);label.style.zIndex=String(Math.round(text.depth*100));
  }
 };
 scene.game.events.on('postrender',sync);
 scene.events.once('shutdown',()=>{scene.game.events.off('postrender',sync);layer.remove();entries.clear();layers.delete(scene);});
 const render=(_renderer:unknown,source:Phaser.GameObjects.Text,camera:Phaser.Cameras.Scene2D.Camera)=>{camera.addToRenderList(source);};
 const api={add:(text:Phaser.GameObjects.Text)=>{const label=document.createElement('div');label.className='world-text-label';layer.append(label);const entry={text,label,signature:''};entries.add(entry);Object.assign(text,{renderWebGL:render,renderCanvas:render});text.once('destroy',()=>{label.remove();entries.delete(entry);});}};layers.set(scene,api);return api;
}
export function worldText(scene:Phaser.Scene,x:number,y:number,text:string,style:Phaser.Types.GameObjects.Text.TextStyle){
 const object=scene.add.text(x,y,text,{...style,resolution:Math.max(4,style.resolution??4)});textLayer(scene).add(object);return object;
}
