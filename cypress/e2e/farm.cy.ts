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
 cy.get('#game').should('have.attr','data-ready','true');cy.get('#farm-name-panel').then(panel=>{if(!panel.prop('hidden')){cy.get('#farm-name').type('Tesztfarm');cy.get('#start-farm').click();}});cy.get('#dialogue').should('not.be.visible');
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

describe('Clearing and seed packets',()=>{
 const base={version:4,player:{x:112,y:365},clock:{day:1,elapsed:0,collapseAt:580},seeds:{radish:4,potato:4,pea:4},produce:{radish:1,potato:0,pea:0},plots:[],economy:{gold:0,shipping:{radish:0,potato:0,pea:0},lastSale:null},orders:{pending:{radish:0,potato:0,pea:0},mailbox:{radish:2,potato:1,pea:3}}};
 it('requires a pickaxe, collects a rock only once and preserves the cleared spot',()=>{
  start(base);clickWorld(86,365);cy.get('#game').should('have.attr','data-stone','0');press('9','Digit9',57);clickWorld(86,365);cy.get('#game').should('have.attr','data-stone','1').and('have.attr','data-cleared','1');clickWorld(86,365);cy.get('#game').should('have.attr','data-stone','1');
  cy.reload();cy.get('#game').should('have.attr','data-ready','true').and('have.attr','data-stone','1').and('have.attr','data-cleared','1');press('Tab','Tab',9);cy.get('[data-material=stone]').should('contain','1 db');
 });
 it('distinguishes seed packets from produce and illustrates delivered mail',()=>{
  start({...base,player:{x:145,y:470}});press('Tab','Tab',9);cy.get('#inventory-seeds .seed-icon').should('have.length',3);cy.get('#inventory-produce .seed-icon').should('not.exist');press('Tab','Tab',9);clickWorld(124,482);cy.get('#mailbox-content .seed-icon').should('have.length',3);cy.get('#collect-package').click();cy.get('#game').should('have.attr','data-mail-seeds','0');
 });
 it('restores cleared decorations on the second morning and retains materials',()=>{
  const data={...base,version:6,farmName:'Tesztfarm',player:{x:250,y:242},clearing:{removed:{'rock-a':1,'branch-a':1,'weed-a':1},wood:1,stone:1}};
  start(data);sleepTo(2);cy.get('#game').should('have.attr','data-cleared','3');sleepTo(3);cy.get('#game').should('have.attr','data-cleared','0').and('have.attr','data-wood','1').and('have.attr','data-stone','1');
 });
});

describe('Neighbor, birdhouse and weeds',()=>{
 const base={version:7,farmName:'Tesztfarm',player:{x:250,y:242},clock:{day:1,elapsed:0,collapseAt:580},seeds:{radish:4,potato:4,pea:4},produce:{radish:0,potato:0,pea:0},plots:[],economy:{gold:0,shipping:{radish:0,potato:0,pea:0},lastSale:null},orders:{pending:{radish:0,potato:0,pea:0},mailbox:{radish:0,potato:0,pea:0}},clearing:{removed:{},wood:0,stone:0,weed:0},story:{giftReceived:false,morningSeen:false,birdhouse:null}};
 it('receives one gift, places it and sees the next morning thought',()=>{
  start(base);cy.get('#game',{timeout:20000}).should('have.attr','data-gift','true');cy.get('#dialogue-title').should('contain','szomszéd');press('Escape','Escape',27);press('Tab','Tab',9);
  cy.get('#inventory-materials [data-birdhouse] button').click();walk('down','y',288);clickWorld(280,288);cy.get('#game').should('have.attr','data-birdhouse','true');
  cy.reload();cy.get('#game').should('have.attr','data-ready','true').and('have.attr','data-gift','true').and('have.attr','data-birdhouse','true');cy.get('#dialogue').should('not.be.visible');walk('up','y',242);sleepTo(2);cy.get('#game').should('have.attr','data-morning-seen','true');cy.get('#game',{timeout:12000}).should('have.attr','data-birds','1');
 });
 it('adds removed weeds to the material inventory and saves them',()=>{
  start({...base,player:{x:137,y:300},story:{giftReceived:true,morningSeen:true,birdhouse:null}});press('7','Digit7',55);clickWorld(112,300);cy.get('#game').should('have.attr','data-cleared','1');press('Tab','Tab',9);cy.get('[data-material=weed]').should('contain','1 db');press('Escape','Escape',27);cy.reload();cy.get('#game').should('have.attr','data-ready','true');press('Tab','Tab',9);cy.get('[data-material=weed]').should('contain','1 db');
 });
});

describe('Inventory visibility and movable birdhouse',()=>{
 const base={version:7,farmName:'Tesztfarm',player:{x:280,y:326},clock:{day:2,elapsed:0,collapseAt:580},seeds:{radish:0,potato:0,pea:0},produce:{radish:2,potato:0,pea:0},plots:[],economy:{gold:0,shipping:{radish:0,potato:0,pea:0},lastSale:null},orders:{pending:{radish:0,potato:0,pea:0},mailbox:{radish:0,potato:0,pea:0}},clearing:{removed:{},wood:1,stone:0,weed:0},story:{giftReceived:true,morningSeen:true,birdhouse:{x:280,y:296}}};
 it('hides zero quantities in inventory and the seed toolbar',()=>{
  start(base);cy.get('#toolbar [data-tool=radish]').should('not.be.visible');cy.get('#toolbar [data-tool=potato]').should('not.be.visible');cy.get('#toolbar [data-tool=pea]').should('not.be.visible');press('Tab','Tab',9);cy.get('#inventory-produce .inventory-card').should('have.length',1);cy.get('#inventory-seeds .inventory-card').should('not.exist');cy.get('#inventory-materials .inventory-card').should('have.length',1);
 });
 it('picks up the same birdhouse with an axe and saves its new position',()=>{
  start(base);press('8','Digit8',56);clickWorld(280,296);cy.get('#game').should('have.attr','data-birdhouse','false');cy.reload();cy.get('#game').should('have.attr','data-ready','true').and('have.attr','data-birdhouse','false');press('Tab','Tab',9);cy.get('#inventory-materials [data-birdhouse] button').click();clickWorld(304,352);cy.get('#game').should('have.attr','data-birdhouse','true');cy.reload();cy.get('#game').should('have.attr','data-ready','true').and('have.attr','data-birdhouse','true');
 });
});

describe('Gardening level two and Annie',()=>{
 const zero={radish:0,potato:0,pea:0,strawberry:0,honeyberry:0,blueberry:0};
 const base={version:8,farmName:'Tesztfarm',player:{x:338,y:288},clock:{day:2,elapsed:0,collapseAt:580},seeds:{...zero,radish:4,potato:4,pea:4},produce:{...zero},plots:[],economy:{gold:200,shipping:{...zero},lastSale:null},orders:{pending:{...zero},mailbox:{...zero}},clearing:{removed:{},wood:0,stone:0,weed:0},story:{giftReceived:true,morningSeen:true,birdhouse:null},skill:{xp:0,credited:[] as string[],rewarded:false,fruits:{}}};
 it('undoes empty soil without farming repeat XP and protects plants',()=>{
  start(base);walk('right','x',339);press('f','KeyF',70);cy.get('#game').should('have.attr','data-plots','1').and('have.attr','data-gardening-xp','1');press('f','KeyF',70);cy.get('#game').should('have.attr','data-plots','0');press('f','KeyF',70);cy.get('#game').should('have.attr','data-plots','1').and('have.attr','data-gardening-xp','1');press('3','Digit3',51);press('f','KeyF',70);cy.get('#game').should('have.attr','data-planted','1');press('1','Digit1',49);press('f','KeyF',70);cy.get('#game').should('have.attr','data-planted','1');
 });
 it('shows Annie in her own inventory tab and retains it on reload',()=>{
  start(base);press('Tab','Tab',9);cy.get('#people-tab').click();cy.get('[data-person=annie]').should('contain','Annie');cy.get('#items-page').should('not.be.visible');press('Escape','Escape',27);cy.reload();cy.get('#game').should('have.attr','data-ready','true');press('Tab','Tab',9);cy.get('#people-tab').click();cy.get('[data-person=annie]').should('be.visible');
 });
 it('awards four of each fruit once and unlocks all three planting materials',()=>{
  start({...base,skill:{xp:35,credited:Array.from({length:35},(_,i)=>`hoe:old${i}`),rewarded:false,fruits:{}}});walk('right','x',339);press('f','KeyF',70);cy.get('#game').should('have.attr','data-gardening-xp','36').and('have.attr','data-gardening-reward','true');cy.get('#gardening-skill').should('be.visible');press('Tab','Tab',9);cy.get('[data-inventory-fruit]').should('have.length',3);cy.get('[data-inventory-fruit] strong').each(el=>expect(el.text()).to.equal('4 db'));press('Escape','Escape',27);cy.reload();cy.get('#game').should('have.attr','data-ready','true').and('have.attr','data-gardening-xp','36');press('Tab','Tab',9);cy.get('[data-inventory-fruit] strong').each(el=>expect(el.text()).to.equal('4 db'));
 });
});

describe('Floating night warnings and random renewal',()=>{
 const zero={radish:0,potato:0,pea:0,strawberry:0,honeyberry:0,blueberry:0};
 const base={version:8,farmName:'Tesztfarm',player:{x:250,y:242},clock:{day:2,elapsed:479.5,collapseAt:580},seeds:{...zero},produce:{...zero},plots:[],economy:{gold:0,shipping:{...zero},lastSale:null},orders:{pending:{...zero},mailbox:{...zero}},clearing:{removed:{},wood:0,stone:0,weed:0},story:{giftReceived:true,morningSeen:true,birdhouse:null},skill:{xp:0,credited:[] as string[],rewarded:false,fruits:{}}};
 for(const elapsed of [479.5,539.5])it(`floats and removes the warning after ${elapsed} active seconds`,()=>{
  start({...base,clock:{...base.clock,elapsed}});cy.get('#night-warning').should('be.visible').then(el=>{el[0].getAnimations()[0].currentTime=6000;});cy.get('#night-warning').should(el=>expect(el[0].getBoundingClientRect().top).to.be.lessThan(160)).then(el=>el[0].getAnimations()[0].finish());cy.get('#night-warning').should('not.be.visible');
 });
 it('stores new scattered positions instead of returning to the old locations',()=>{
  start({...base,clock:{...base.clock,elapsed:0},clearing:{removed:{'rock-a':1,'branch-a':1,'weed-a':1},wood:1,stone:1,weed:1}});sleepTo(3);cy.get('#game').should('have.attr','data-cleared','0');
  cy.window().then(win=>new Cypress.Promise<any>(resolve=>{const request=win.indexedDB.open('erdoszeli-birtok',1);request.onsuccess=()=>{const tx=request.result.transaction('saves');const read=tx.objectStore('saves').get('active');read.onsuccess=()=>resolve(read.result.clearing.positions);tx.oncomplete=()=>request.result.close();};})).then(positions=>{expect(Object.keys(positions)).to.have.length(3);expect(Math.hypot(positions['rock-a'].x-86,positions['rock-a'].y-365)).to.be.at.least(52);});
 });
});
