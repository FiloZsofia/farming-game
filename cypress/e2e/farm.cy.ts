const press=(key:string,code:string,keyCode:number)=>{
 cy.get('body').trigger('keydown',{key,code,keyCode,which:keyCode});
 cy.get('body').trigger('keyup',{key,code,keyCode,which:keyCode});
};
const directions={right:['d','KeyD',68],left:['a','KeyA',65],down:['s','KeyS',83],up:['w','KeyW',87]} as const;
function walk(direction:keyof typeof directions,axis:'x'|'y',target:number){
 const [key,code,keyCode]=directions[direction];cy.get('body').trigger('keydown',{key,code,keyCode,which:keyCode});
 cy.get('#game',{timeout:15000}).should(el=>{const position=Number(el.attr(`data-player-${axis}`));if(direction==='left'||direction==='up')expect(position).to.be.at.most(target);else expect(position).to.be.at.least(target);});
 cy.get('body').trigger('keyup',{key,code,keyCode,which:keyCode});
}
function start(data?:object){
 cy.visit('/',{onBeforeLoad(win){
  win.indexedDB.deleteDatabase('erdoszeli-birtok');
  if(data){const r=win.indexedDB.open('erdoszeli-birtok',1);r.onupgradeneeded=()=>r.result.createObjectStore('saves');r.onsuccess=()=>{const tx=r.result.transaction('saves','readwrite');tx.objectStore('saves').put(data,'active');tx.oncomplete=()=>r.result.close();};}
 }});
 cy.get('#game').should('have.attr','data-ready','true');cy.get('#farm-name').type('Tesztfarm');cy.get('#start-farm').click();cy.get('#dialogue').should('not.be.visible');
}
function clickWorld(x:number,y:number){
 cy.window().then(win=>cy.get('#game').then(el=>{
  const zoom=Math.max(win.innerWidth/800,win.innerHeight/600),px=Number(el.attr('data-player-x')),py=Number(el.attr('data-player-y'));
  const scrollX=Math.max(0,Math.min(800-win.innerWidth/zoom,px-win.innerWidth/zoom/2));
  const scrollY=Math.max(0,Math.min(600-win.innerHeight/zoom,py-win.innerHeight/zoom/2));
  cy.get('canvas').click((x-scrollX)*zoom,(y-scrollY)*zoom);
 }));
}
function sleepTo(day:number){
 clickWorld(268,232);cy.get('#sleep').should('be.visible').click();cy.get('#game').should('have.attr','data-day',String(day));cy.get('#dialogue-close').click();
}
describe('World interactions and uncluttered UI',()=>{
 it('removes redundant buttons and keeps help in one menu',()=>{
  start();cy.get('#journal,#shipping,#receipt,#work,#jump,#run,#home').should('not.exist');
  press('Tab','Tab',9);cy.get('#inventory-panel').should('be.visible');cy.get('[data-inventory-seed=radish]').should('contain','4 db');press('Tab','Tab',9);cy.get('#dialogue').should('not.be.visible');press('Tab','Tab',9);press('Escape','Escape',27);cy.get('#dialogue').should('not.be.visible');cy.get('#menu').click();cy.get('#help').click();cy.get('#dialogue-text').should('contain','Space');
 });
 it('uses Space to jump and Shift to run',()=>{
  start();press(' ','Space',32);cy.get('#game').should('have.attr','data-jumping','true');cy.get('#game').should('have.attr','data-jumping','false');
  cy.get('body').trigger('keydown',{key:'Shift',code:'ShiftLeft',keyCode:16,which:16});cy.get('#game').should('have.attr','data-running','true').and('have.attr','data-jumping','false');cy.get('body').trigger('keyup',{key:'Shift',code:'ShiftLeft',keyCode:16,which:16});
 });
 it('tills, plants, waters and restores the garden through F',()=>{
  start();walk('down','y',287);walk('right','x',334);
  press('f','KeyF',70);cy.get('#game').should('have.attr','data-plots','1');
  press('3','Digit3',51);press('f','KeyF',70);press('2','Digit2',50);press('f','KeyF',70);
  cy.get('#game').should('have.attr','data-planted','1').and('have.attr','data-watered','1');cy.get('#save-state').should('contain','Mentve');
  cy.reload();cy.get('#game').should('have.attr','data-ready','true').and('have.attr','data-planted','1').and('have.attr','data-watered','1');
 });
 it('opens the journal by clicking its actual world object',()=>{start();sleepTo(2);cy.reload();cy.get('#game').should('have.attr','data-ready','true').and('have.attr','data-day','2');});
});
describe('Catalogue and mailbox',()=>{
 it('pays now, delivers tomorrow and collects exactly once',()=>{
  start({version:3,player:{x:285,y:242},clock:{day:1,elapsed:0,collapseAt:580},seeds:{radish:4,potato:4,pea:4},produce:{radish:0,potato:0,pea:0},plots:[],economy:{gold:100,shipping:{radish:0,potato:0,pea:0},lastSale:null}});
  clickWorld(306,220);cy.get('[data-order-crop=radish]').clear().type('2');cy.get('[data-order-crop=pea]').clear().type('1');cy.get('#catalog-total').should('contain','25 gold');cy.get('#place-order').click();
  cy.get('#game').should('have.attr','data-gold','75').and('have.attr','data-pending-seeds','3');cy.get('#dialogue-close').click();
  walk('left','x',252);sleepTo(2);cy.get('#game').should('have.attr','data-mail-seeds','3');
  walk('down','y',478);walk('left','x',166);clickWorld(124,482);cy.get('#collect-package').click();
  cy.get('[data-count=radish]').should('have.text','6');cy.get('[data-count=pea]').should('have.text','5');cy.get('#game').should('have.attr','data-mail-seeds','0');
  cy.reload();cy.get('#game').should('have.attr','data-ready','true').and('have.attr','data-gold','75').and('have.attr','data-mail-seeds','0');
 });
 it('keeps the HUD readable and the catalogue within a mobile screen',()=>{
  start({version:3,player:{x:285,y:242},clock:{day:1,elapsed:200,collapseAt:580},seeds:{radish:4,potato:4,pea:4},produce:{radish:0,potato:0,pea:0},plots:[],economy:{gold:100,shipping:{radish:0,potato:0,pea:0},lastSale:null}});
  cy.viewport(390,844);cy.get('#clock-label').should('contain','Délután').and('have.css','font-size','17px');cy.get('.gold-line').should('have.css','font-size','20px');
  clickWorld(306,220);cy.get('#catalog-panel').should('be.visible');cy.document().then(doc=>expect(doc.documentElement.scrollWidth).to.equal(390));
 });
});

describe('Visual shipping and farm name',()=>{
 it('restores the chosen name without repeating the introduction',()=>{
  start();cy.get('h1').should('have.text','Tesztfarm');cy.reload();cy.get('#game').should('have.attr','data-ready','true');cy.get('h1').should('have.text','Tesztfarm');cy.get('#dialogue').should('not.be.visible');
 });
 it('moves illustrated stacks and individual items in both directions',()=>{
  start({version:4,player:{x:210,y:280},clock:{day:1,elapsed:200,collapseAt:580},seeds:{radish:4,potato:4,pea:4},produce:{radish:3,potato:2,pea:4},plots:[],economy:{gold:100,shipping:{radish:0,potato:0,pea:0},lastSale:null},orders:{pending:{radish:0,potato:0,pea:0},mailbox:{radish:0,potato:0,pea:0}}});
  clickWorld(174,256);cy.get('#shipping-inventory button svg').should('have.length',3);cy.get('[data-item=inventory-radish]').click();cy.get('[data-item=crate-radish] .slot-count').should('have.text','3');cy.get('[data-item=inventory-radish]').should('not.exist');
  cy.get('[data-item=crate-radish]').click({shiftKey:true});cy.get('[data-item=crate-radish] .slot-count').should('have.text','2');cy.get('[data-item=inventory-radish] .slot-count').should('have.text','1');cy.get('#shipping-total').should('contain','30 gold');
 });
});
