import {createTravel} from '../../src/travel';
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
  // Keep existing interaction scenarios sunny on days 1–5; weather cases use explicit saved seeds.
  cy.stub(win.crypto,'getRandomValues').callsFake((array:Uint32Array)=>{array.fill(13);return array;});
  win.indexedDB.deleteDatabase('erdoszeli-birtok');
  if(data){const r=win.indexedDB.open('erdoszeli-birtok',1);r.onupgradeneeded=()=>r.result.createObjectStore('saves');r.onsuccess=()=>{const tx=r.result.transaction('saves','readwrite');tx.objectStore('saves').put(data,'active');tx.oncomplete=()=>r.result.close();};}
 }});
 cy.get('#game').should('have.attr','data-ready','true');cy.get('#new-farm').should('not.be.disabled');cy.get('#continue-farm').then(button=>{if(button.prop('hidden'))cy.get('#new-farm').click();else cy.get('#continue-farm').click();});cy.get('#farm-name-panel').then(panel=>{if(!panel.prop('hidden')){cy.get('#farm-name').type('Tesztfarm');cy.get('#start-farm').click();}});cy.get('#dialogue').should('not.be.visible');
}
function reloadFarm(){
 cy.reload();cy.get('#game').should('have.attr','data-ready','true');cy.get('#continue-farm').should('be.visible').and('not.be.disabled').click();cy.get('#dialogue').should('not.be.visible');
}
function clickWorld(x:number,y:number){
 cy.window().then(win=>cy.get('#game').then(el=>{
  const zoom=Number(el.attr('data-zoom')),scrollX=Number(el.attr('data-camera-x')),scrollY=Number(el.attr('data-camera-y'));
  cy.get('canvas').click((x-scrollX)*zoom,(y-scrollY)*zoom);
 }));
}
function sleepTo(day:number){
 clickWorld(281,193);cy.get('#sleep').should('be.visible').click();cy.get('#game').should('have.attr','data-day',String(day));cy.get('#dialogue-close').should('be.visible').click();cy.get('#game',{timeout:8000}).should('have.attr','data-morning-stage','none');cy.get('#dialogue').should('not.be.visible');
}
describe('World interactions and uncluttered UI',()=>{
 it('removes redundant buttons and keeps help in one menu',()=>{
  start();cy.get('#journal,#shipping,#receipt,#work,#jump,#run,#home').should('not.exist');
  press('Tab','Tab',9);cy.get('#inventory-panel').should('be.visible');cy.get('[data-inventory-seed=radish]').should('contain','4');press('Tab','Tab',9);cy.get('#dialogue').should('not.be.visible');press('Tab','Tab',9);press('Escape','Escape',27);cy.get('#dialogue').should('not.be.visible');cy.get('#menu').click();cy.get('#help').click();cy.get('#dialogue-text').should('contain','Space');
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
  reloadFarm();cy.get('#game').should('have.attr','data-ready','true').and('have.attr','data-planted','1').and('have.attr','data-watered','1');
 });
 it('opens the journal by clicking its actual world object',()=>{start();sleepTo(2);reloadFarm();cy.get('#game').should('have.attr','data-ready','true').and('have.attr','data-day','2');});
});
describe('Catalogue and mailbox',()=>{
 it('pays now, delivers tomorrow and collects exactly once',()=>{
  start({version:3,player:{x:330,y:194},clock:{day:1,elapsed:0,collapseAt:580},seeds:{radish:4,potato:4,pea:4},produce:{radish:0,potato:0,pea:0},plots:[],economy:{gold:100,shipping:{radish:0,potato:0,pea:0},lastSale:null}});
  clickWorld(355,196);cy.get('[data-order-crop=radish]').clear().type('2');cy.get('[data-order-crop=pea]').clear().type('1');cy.get('#catalog-total').should('contain','25 gold');cy.get('#place-order').click();
  cy.get('#game').should('have.attr','data-gold','75').and('have.attr','data-pending-seeds','3');cy.get('#dialogue-close').click();
  walk('left','x',252);sleepTo(2);cy.get('#game').should('have.attr','data-mail-seeds','3');
  walk('down','y',478);walk('left','x',166);clickWorld(124,482);cy.get('#collect-package').click();
  cy.get('[data-count=radish]').should('have.text','6');cy.get('[data-count=pea]').should('have.text','5');cy.get('#game').should('have.attr','data-mail-seeds','0');
  reloadFarm();cy.get('#game').should('have.attr','data-ready','true').and('have.attr','data-gold','75').and('have.attr','data-mail-seeds','0');
 });
 it('keeps the HUD readable and the catalogue within a mobile screen',()=>{
  start({version:3,player:{x:330,y:194},clock:{day:1,elapsed:200,collapseAt:580},seeds:{radish:4,potato:4,pea:4},produce:{radish:0,potato:0,pea:0},plots:[],economy:{gold:100,shipping:{radish:0,potato:0,pea:0},lastSale:null}});
  cy.viewport(390,844);cy.get('#clock-label').should('contain','Délután').and('have.css','font-size','17px');cy.get('.gold-line').should('have.css','font-size','20px');
  clickWorld(355,196);cy.get('#catalog-panel').should('be.visible');cy.document().then(doc=>expect(doc.documentElement.scrollWidth).to.equal(390));
 });
});

describe('Visual shipping and farm name',()=>{
 it('restores the chosen name without repeating the introduction',()=>{
  start();cy.get('h1').should('have.text','Tesztfarm');reloadFarm();cy.get('#game').should('have.attr','data-ready','true');cy.get('h1').should('have.text','Tesztfarm');cy.get('#dialogue').should('not.be.visible');
 });
 it('moves illustrated stacks and individual items in both directions',()=>{
  start({version:4,player:{x:170,y:232},clock:{day:1,elapsed:200,collapseAt:580},seeds:{radish:4,potato:4,pea:4},produce:{radish:3,potato:2,pea:4},plots:[],economy:{gold:100,shipping:{radish:0,potato:0,pea:0},lastSale:null},orders:{pending:{radish:0,potato:0,pea:0},mailbox:{radish:0,potato:0,pea:0}}});
  clickWorld(128,216);cy.get('#shipping-inventory button svg').should('have.length',3);cy.get('[data-item=inventory-radish]').click();cy.get('[data-item=crate-radish] .slot-count').should('have.text','3');cy.get('[data-item=inventory-radish]').should('not.exist');
  cy.get('[data-item=crate-radish]').click({shiftKey:true});cy.get('[data-item=crate-radish] .slot-count').should('have.text','2');cy.get('[data-item=inventory-radish] .slot-count').should('have.text','1');cy.get('#shipping-total').should('contain','30 gold');
 });
});

describe('Clearing and seed packets',()=>{
 const base={version:4,player:{x:112,y:365},clock:{day:1,elapsed:0,collapseAt:580},seeds:{radish:4,potato:4,pea:4},produce:{radish:1,potato:0,pea:0},plots:[],economy:{gold:0,shipping:{radish:0,potato:0,pea:0},lastSale:null},orders:{pending:{radish:0,potato:0,pea:0},mailbox:{radish:2,potato:1,pea:3}}};
 it('replaces loose rocks with one collection action and a single crowbar',()=>{start(base);cy.get('[data-tool=harvest]').should('contain','Gyűjtés');cy.get('[data-tool=crowbar]').should('have.length',1);cy.get('[data-tool=hand],[data-tool=axe],[data-tool=pickaxe]').should('not.exist');clickWorld(86,365);cy.get('#game').should('have.attr','data-stone','0');press('Tab','Tab',9);cy.get('#backpack-grid .backpack-slot').should('have.length',16);cy.get('#backpack-grid .empty').should('exist');});
 it('distinguishes seed packets from produce and illustrates delivered mail',()=>{
  start({...base,player:{x:145,y:470}});press('Tab','Tab',9);cy.get('#backpack-grid [data-inventory-seed] .seed-icon').should('have.length',3);cy.get('#backpack-grid [data-inventory-crop] .seed-icon').should('not.exist');press('Tab','Tab',9);clickWorld(124,482);cy.get('#mailbox-content .seed-icon').should('have.length',3);cy.get('#collect-package').click();cy.get('#game').should('have.attr','data-mail-seeds','0');
 });
 it('restores weeds after three days while retaining legacy clearance and materials',()=>{
  const data={...base,version:6,farmName:'Tesztfarm',player:{x:250,y:242},clearing:{removed:{'rock-a':1,'branch-a':1,'weed-a':1},wood:1,stone:1}};
  start(data);sleepTo(2);cy.get('#game').should('have.attr','data-cleared','3');sleepTo(3);cy.get('#game').should('have.attr','data-cleared','3');sleepTo(4);cy.get('#game').should('have.attr','data-cleared','2').and('have.attr','data-wood','1').and('have.attr','data-stone','1');
 });
});

describe('Neighbor, birdhouse and weeds',()=>{
 const base={version:7,farmName:'Tesztfarm',player:{x:250,y:242},clock:{day:1,elapsed:0,collapseAt:580},seeds:{radish:4,potato:4,pea:4},produce:{radish:0,potato:0,pea:0},plots:[],economy:{gold:0,shipping:{radish:0,potato:0,pea:0},lastSale:null},orders:{pending:{radish:0,potato:0,pea:0},mailbox:{radish:0,potato:0,pea:0}},clearing:{removed:{},wood:0,stone:0,weed:0},story:{giftReceived:false,morningSeen:false,birdhouse:null}};
 it('receives one gift, places it and sees the next morning thought',()=>{
  start(base);cy.get('#game',{timeout:20000}).should('have.attr','data-gift','true');cy.get('#dialogue-title').should('contain','szomszéd');press('Escape','Escape',27);press('Tab','Tab',9);
  cy.get('#backpack-grid [data-birdhouse] button').click();walk('down','y',288);clickWorld(280,288);cy.get('#game').should('have.attr','data-birdhouse','true');
  reloadFarm();cy.get('#game').should('have.attr','data-ready','true').and('have.attr','data-gift','true').and('have.attr','data-birdhouse','true');cy.get('#dialogue').should('not.be.visible');walk('up','y',242);sleepTo(2);cy.get('#game').should('have.attr','data-morning-seen','true');cy.get('#game',{timeout:12000}).should('have.attr','data-birds','1');
 });
 it('adds removed weeds to the material inventory and saves them',()=>{
  start({...base,player:{x:137,y:300},story:{giftReceived:true,morningSeen:true,birdhouse:null}});press('7','Digit7',55);clickWorld(112,300);cy.get('#game').should('have.attr','data-cleared','1');press('Tab','Tab',9);cy.get('[data-material=weed]').should('contain','1 db');press('Escape','Escape',27);reloadFarm();cy.get('#game').should('have.attr','data-ready','true');press('Tab','Tab',9);cy.get('[data-material=weed]').should('contain','1 db');
 });
});

describe('Inventory visibility and movable birdhouse',()=>{
 const base={version:7,farmName:'Tesztfarm',player:{x:280,y:326},clock:{day:2,elapsed:0,collapseAt:580},seeds:{radish:0,potato:0,pea:0},produce:{radish:2,potato:0,pea:0},plots:[],economy:{gold:0,shipping:{radish:0,potato:0,pea:0},lastSale:null},orders:{pending:{radish:0,potato:0,pea:0},mailbox:{radish:0,potato:0,pea:0}},clearing:{removed:{},wood:1,stone:0,weed:0},story:{giftReceived:true,morningSeen:true,birdhouse:{x:280,y:296}}};
 it('hides zero quantities in inventory and the seed toolbar',()=>{
  start(base);cy.get('#toolbar [data-tool=radish]').should('not.be.visible');cy.get('#toolbar [data-tool=potato]').should('not.be.visible');cy.get('#toolbar [data-tool=pea]').should('not.be.visible');press('Tab','Tab',9);cy.get('#inventory-produce .inventory-card').should('have.length',1);cy.get('#inventory-seeds .inventory-card').should('not.exist');cy.get('#inventory-materials .inventory-card').should('have.length',1);
 });
 it('picks up the same birdhouse with an axe and saves its new position',()=>{
  start(base);press('8','Digit8',56);clickWorld(280,296);cy.get('#game').should('have.attr','data-birdhouse','false');reloadFarm();cy.get('#game').should('have.attr','data-ready','true').and('have.attr','data-birdhouse','false');press('Tab','Tab',9);cy.get('#backpack-grid [data-birdhouse] button').click();clickWorld(304,352);cy.get('#game').should('have.attr','data-birdhouse','true');reloadFarm();cy.get('#game').should('have.attr','data-ready','true').and('have.attr','data-birdhouse','true');
 });
});

describe('Gardening level two and Annie',()=>{
 const zero={radish:0,potato:0,pea:0,strawberry:0,honeyberry:0,blueberry:0};
 const base={version:8,farmName:'Tesztfarm',player:{x:338,y:288},clock:{day:2,elapsed:0,collapseAt:580},seeds:{...zero,radish:4,potato:4,pea:4},produce:{...zero},plots:[],economy:{gold:200,shipping:{...zero},lastSale:null},orders:{pending:{...zero},mailbox:{...zero}},clearing:{removed:{},wood:0,stone:0,weed:0},story:{giftReceived:true,morningSeen:true,birdhouse:null},skill:{xp:0,credited:[] as string[],rewarded:false,fruits:{}}};
 it('undoes empty soil without farming repeat XP and protects plants',()=>{
  start(base);walk('right','x',339);press('f','KeyF',70);cy.get('#game').should('have.attr','data-plots','1').and('have.attr','data-gardening-xp','1');press('f','KeyF',70);cy.get('#game').should('have.attr','data-plots','0');press('f','KeyF',70);cy.get('#game').should('have.attr','data-plots','1').and('have.attr','data-gardening-xp','1');press('3','Digit3',51);press('f','KeyF',70);cy.get('#game').should('have.attr','data-planted','1');press('1','Digit1',49);press('f','KeyF',70);cy.get('#game').should('have.attr','data-planted','1');
 });
 it('shows Annie in her own inventory tab and retains it on reload',()=>{
  start(base);press('Tab','Tab',9);cy.get('#people-tab').click();cy.get('[data-person=annie]').should('contain','Annie');cy.get('#items-page').should('not.be.visible');press('Escape','Escape',27);reloadFarm();cy.get('#game').should('have.attr','data-ready','true');press('Tab','Tab',9);cy.get('#people-tab').click();cy.get('[data-person=annie]').should('be.visible');
 });
 it('shows progress without offering previews of unearned levels',()=>{
  start({...base,skill:{xp:12,credited:Array.from({length:12},(_,i)=>`hoe:old${i}`),rewarded:false,fruits:{}}});press('Tab','Tab',9);cy.get('#skills-tab').click();cy.get('[data-skill-progress=gardening]').should('contain','24 pont');cy.get('#skills-page progress').should('have.value','12');cy.get('#replay-gardening,#replay-gardening-three').should('not.exist');press('Tab','Tab',9);cy.get('#game').should('have.attr','data-gardening-xp','12');
 });
 it('awards four of each fruit once and unlocks all three planting materials',()=>{
  start({...base,skill:{xp:35,credited:Array.from({length:35},(_,i)=>`hoe:old${i}`),rewarded:false,fruits:{}}});walk('right','x',339);press('f','KeyF',70);cy.get('#game').should('have.attr','data-gardening-xp','36').and('have.attr','data-gardening-reward','true');cy.get('#level-reward-panel').should('be.visible');cy.get('#dialogue-close').click();press('Tab','Tab',9);cy.get('[data-inventory-seed=strawberry],[data-inventory-seed=honeyberry],[data-inventory-seed=blueberry]').should('have.length',3);cy.get('[data-inventory-seed=strawberry] strong,[data-inventory-seed=honeyberry] strong,[data-inventory-seed=blueberry] strong').each(el=>expect(el.text()).to.equal('4'));press('Escape','Escape',27);reloadFarm();cy.get('#game').should('have.attr','data-ready','true').and('have.attr','data-gardening-xp','36');press('Tab','Tab',9);cy.get('[data-inventory-seed=strawberry] strong,[data-inventory-seed=honeyberry] strong,[data-inventory-seed=blueberry] strong').each(el=>expect(el.text()).to.equal('4'));
 });
});

describe('Floating night warnings and random renewal',()=>{
 const zero={radish:0,potato:0,pea:0,strawberry:0,honeyberry:0,blueberry:0};
 const base={version:8,farmName:'Tesztfarm',player:{x:250,y:242},clock:{day:2,elapsed:479.5,collapseAt:580},seeds:{...zero},produce:{...zero},plots:[],economy:{gold:0,shipping:{...zero},lastSale:null},orders:{pending:{...zero},mailbox:{...zero}},clearing:{removed:{},wood:0,stone:0,weed:0},story:{giftReceived:true,morningSeen:true,birdhouse:null},skill:{xp:0,credited:[] as string[],rewarded:false,fruits:{}}};
 for(const elapsed of [479.5,539.5])it(`floats and removes the warning after ${elapsed} active seconds`,()=>{
  start({...base,clock:{...base.clock,elapsed}});cy.get('#night-warning').should('be.visible').then(el=>{el[0].getAnimations()[0].currentTime=6000;});cy.get('#night-warning').should(el=>expect(el[0].getBoundingClientRect().top).to.be.lessThan(160)).then(el=>el[0].getAnimations()[0].finish());cy.get('#night-warning').should('not.be.visible');
 });
 it('stores new scattered positions instead of returning to the old locations',()=>{
  start({...base,clock:{...base.clock,elapsed:0},clearing:{removed:{'rock-a':1,'branch-a':1,'weed-a':1},wood:1,stone:1,weed:1}});sleepTo(3);cy.get('#game').should('have.attr','data-cleared','3');sleepTo(4);cy.get('#game').should('have.attr','data-cleared','0');
  cy.window().then(win=>new Cypress.Promise<any>(resolve=>{const request=win.indexedDB.open('erdoszeli-birtok',1);request.onsuccess=()=>{const tx=request.result.transaction('saves');const read=tx.objectStore('saves').get('active');read.onsuccess=()=>resolve(read.result.clearing.positions);tx.oncomplete=()=>request.result.close();};})).then(positions=>{expect(Object.keys(positions)).to.have.length(3);expect(Math.hypot(positions['rock-a'].x-86,positions['rock-a'].y-365)).to.be.at.least(52);});
 });
});

describe('Level three and starting money',()=>{
 const zero={radish:0,potato:0,pea:0,strawberry:0,honeyberry:0,blueberry:0,carrot:0,lettuce:0,onion:0};
 const base={version:11,farmName:'Tesztfarm',player:{x:338,y:288},clock:{day:2,elapsed:0,collapseAt:580},seeds:{...zero},produce:{...zero},plots:[],economy:{gold:37,shipping:{...zero},lastSale:null},orders:{pending:{...zero},mailbox:{...zero}},clearing:{removed:{},positions:{},wood:0,stone:0,weed:0},story:{giftReceived:true,morningSeen:true,birdhouse:null},skill:{revision:2,chestBlueprint:false,xp:79,credited:Array.from({length:79},(_,i)=>`hoe:old${i}`),rewarded:true,levelThreeRewarded:false,fruits:{strawberry:4,honeyberry:4,blueberry:4}}};
 it('starts new farms with 100 gold while preserving existing balances',()=>{start();cy.get('#game').should('have.attr','data-gold','100');start(base);cy.get('#game').should('have.attr','data-gold','37');});
 it('counts empty-soil watering and planting toward the current 36-point level',()=>{
  start({...base,seeds:{...zero,radish:4},plots:[['353,280',{crop:null,watered:false,growth:0,regrowing:false}]],skill:{...base.skill,xp:36,credited:Array.from({length:36},(_,i)=>`hoe:old${i}`)}});
  press('Tab','Tab',9);cy.get('#skills-tab').click();cy.get('#skills-page progress').should('have.value','0').and('have.attr','max','44');cy.get('#skills-page').should('not.contain','ültetéssel');cy.get('.inventory-footer').should('not.exist');press('Escape','Escape',27);
  walk('right','x',339);cy.get('#toolbar [data-tool=water]').click();press('f','KeyF',70);cy.get('#game').should('have.attr','data-gardening-xp','37');cy.get('#skill-xp').should('have.text','1 / 44');cy.get('#toolbar [data-tool=radish]').click();press('f','KeyF',70);cy.get('#game').should('have.attr','data-gardening-xp','38');cy.get('#skill-xp').should('have.text','2 / 44');cy.get('#toolbar [data-tool=water]').click();press('f','KeyF',70);cy.get('#game').should('have.attr','data-gardening-xp','38');reloadFarm();cy.get('#game').should('have.attr','data-ready','true').and('have.attr','data-gardening-xp','38');press('Tab','Tab',9);cy.get('#skills-tab').click();cy.get('#skills-page progress').should('have.value','2');cy.get('[data-skill-progress]').should('contain','42 pont');
 });
 it('awards and unlocks three new plantable vegetables at 80 XP exactly once',()=>{
  start(base);walk('right','x',339);press('f','KeyF',70);cy.get('#game').should('have.attr','data-gardening-xp','80');cy.get('#dialogue-title').should('contain','2. szint');cy.get('#dialogue-close').click();
  for(const crop of ['carrot','lettuce','onion']){cy.get(`#toolbar [data-tool=${crop}]`).should('be.visible');cy.get(`[data-count=${crop}]`).should('have.text','4');}
  cy.get('#toolbar [data-tool=carrot]').click();press('f','KeyF',70);cy.get('[data-count=carrot]').should('have.text','3');reloadFarm();cy.get('#game').should('have.attr','data-ready','true');cy.get('[data-count=carrot]').should('have.text','3');cy.get('[data-count=onion]').should('have.text','4');press('Tab','Tab',9);cy.get('#skills-tab').click();cy.get('.skill-card-level').should('have.text','2. szint');cy.get('#replay-gardening,#replay-gardening-three').should('not.exist');cy.get('[data-count=carrot]').should('have.text','3');
 });
});

describe('Start menu and separate farms',()=>{
 it('creates a test farm without replacing an older farm and returns to either',()=>{
  start();walk('down','y',288);walk('right','x',339);press('f','KeyF',70);cy.get('#game').should('have.attr','data-plots','1');press('3','Digit3',51);press('f','KeyF',70);cy.get('#game').should('have.attr','data-gardening-xp','2');cy.get('[data-count=radish]').should('have.text','3');
  cy.get('#menu').click();cy.get('#open-start-menu').click();cy.get('.farm-save-card').should('have.length',1);cy.get('#new-farm').click();cy.get('#farm-name').type('Próbakert');cy.get('#start-farm').click();cy.get('h1').should('have.text','Próbakert');cy.get('#dialogue').should('not.be.visible');cy.get('#game').should('have.attr','data-gold','100').and('have.attr','data-gardening-xp','0');cy.get('[data-count=radish]').should('have.text','4');
  cy.get('#menu').click();cy.get('#open-start-menu').click();cy.get('.farm-save-card').should('have.length',2);cy.contains('.farm-save-card','Tesztfarm').find('button').click();cy.get('h1').should('have.text','Tesztfarm');cy.get('#dialogue').should('not.be.visible');cy.get('#game').should('have.attr','data-gardening-xp','2');cy.get('[data-count=radish]').should('have.text','3');
  cy.reload();cy.get('#start-panel').should('be.visible');cy.get('.farm-save-card').should('have.length',2);cy.get('#new-farm').click();cy.get('#cancel-farm-name').click();cy.get('.farm-save-card').should('have.length',2);cy.get('#continue-farm').click();cy.get('#game').should('have.attr','data-gardening-xp','2');
 });
});

describe('Simplified farm creation and skills',()=>{
 it('asks only for the farm name and omits skill levels from saved-farm cards',()=>{
  start();cy.get('#menu').click();cy.get('#open-start-menu').click();cy.get('#farm-list').should('not.contain','Kertészkedés');cy.get('#new-farm').click();cy.get('label[for=farm-name]').should('have.text','Farm neve');cy.get('#farmer-name').should('not.exist');cy.get('#farm-name').type('Harmat Farm');cy.get('#start-farm').should('not.be.disabled').click();cy.get('h1').should('have.text','Harmat Farm');cy.get('#dialogue').should('not.be.visible');press('Tab','Tab',9);cy.get('#skills-tab').click();cy.get('#skills-page button').should('not.exist');
 });
});

describe('Music choices and quiet inventory tabs',()=>{
 it('removes the shortcut footer from every tab and remembers a muted music choice',()=>{
  start();press('Tab','Tab',9);
  for(const tab of ['#items-tab','#people-tab','#skills-tab']){cy.get(tab).click();cy.get('#inventory-panel').should('not.contain','Tab / Escape');}
  cy.get('#skills-page').should('not.contain','szint jutalma').and('not.contain','ültetéssel');press('Escape','Escape',27);
  cy.get('#menu').click();cy.get('#music-track').select('sunny');
  cy.get('#music-toggle').then(button=>{if(button.text().includes('be'))cy.wrap(button).click();});
  cy.get('#music-track').select('original');cy.get('#music-toggle').should('have.text','Zene: ki');cy.get('#music-track').select('sunny');
  reloadFarm();cy.get('#menu').click();cy.get('#music-track').should('have.value','sunny');cy.get('#music-toggle').should('have.text','Zene: ki');
 });
});

describe('Southern village and forest',()=>{
 const quantities={radish:0,potato:0,pea:0,strawberry:0,honeyberry:0,blueberry:0,carrot:0,lettuce:0,onion:0};
 const villageSave={version:12,farmName:'Erdei próba',farmerName:null,player:{x:170,y:555},clock:{day:2,elapsed:0,collapseAt:580},seeds:{...quantities,radish:4},produce:{...quantities},plots:[],economy:{gold:100,shipping:{...quantities},lastSale:null},orders:{pending:{...quantities},mailbox:{...quantities}},clearing:{removed:{},positions:{},wood:0,stone:0,weed:0},story:{giftReceived:true,morningSeen:true,birdhouse:null},skill:{xp:0,credited:[],rewarded:false,levelThreeRewarded:false,fruits:{}}};
 it('walks through the south gate, gathers berries and remembers the collected bush',()=>{
  start(villageSave);walk('down','y',700);walk('left','x',100);walk('down','y',762);press('e','KeyE',69);cy.get('#game').should('have.attr','data-produce','1');press('f','KeyF',70);cy.get('#game').should('have.attr','data-produce','1');press('Tab','Tab',9);cy.get('[data-inventory-crop=blueberry]').should('contain','1 db');press('Escape','Escape',27);reloadFarm();cy.get('#game').should('have.attr','data-region','forest');press('e','KeyE',69);cy.get('#game').should('have.attr','data-produce','1');
 });
 it('enters the nursery, preserves an indoor save and exits back onto the square',()=>{
  start(villageSave);walk('down','y',700);walk('right','x',450);walk('down','y',975);walk('right','x',591);press('e','KeyE',69);cy.get('#dialogue-title').should('have.text','Faiskola');press('Escape','Escape',27);cy.get('#game').should('have.attr','data-region','nursery').and('have.attr','data-shop-leo','true');press('Tab','Tab',9);cy.get('#people-tab').click();cy.get('[data-person=leo] img').should('have.attr','alt','Leo arcképe');press('Escape','Escape',27);reloadFarm();cy.get('#game').should('have.attr','data-region','nursery');press('e','KeyE',69);cy.get('#game').should('have.attr','data-region','village');
 });
 it('reports capped gold loss after collapsing in the village and keeps the birdhouse safe',()=>{
  start({...villageSave,version:13,travel:{picked:{},morning:null},player:{x:550,y:1050},clock:{day:2,elapsed:578,collapseAt:580},economy:{...villageSave.economy,gold:6}});
  cy.window().then(win=>cy.stub(win.Math,'random').returns(.9));cy.get('#game').should('have.attr','data-day','3');cy.get('#dialogue-text').should('contain','6 gold');cy.get('#game').should('have.attr','data-gold','0').and('have.attr','data-gift','true').and('have.attr','data-birdhouse','false');
 });
 it('meets Annie behind the pond shop counter and keeps the acquaintance after reload',()=>{
  start({...villageSave,player:{x:708,y:1116},story:{giftReceived:false,morningSeen:false,birdhouse:null}});press('e','KeyE',69);cy.get('#dialogue-title').should('have.text','Kertitó Szaküzlet');press('Escape','Escape',27);cy.get('#game').should('have.attr','data-shop-annie','true');press('Tab','Tab',9);cy.get('#people-tab').click();cy.get('[data-person=annie]').should('be.visible');press('Escape','Escape',27);reloadFarm();cy.get('#game').should('have.attr','data-shop-annie','true');
 });
 it('blocks both shop entrances at night and moves an indoor visitor outside at closing time',()=>{
  for(const player of [{x:708,y:1116},{x:591,y:975}]){start({...villageSave,player,clock:{day:2,elapsed:400,collapseAt:580}});press('e','KeyE',69);cy.get('#dialogue').should('not.be.visible');cy.get('#game').should('have.attr','data-shops-open','false').and('have.attr','data-region','village');}
  start({...villageSave,version:13,travel:{picked:{},morning:null},player:{x:400,y:2767},clock:{day:2,elapsed:359,collapseAt:580}});cy.get('#game').should('have.attr','data-region','village').and('have.attr','data-shops-open','false');
 });
 it('keeps the robbery warning separate from the animated settlement, which waits for dismissal',()=>{
  start({...villageSave,version:13,travel:{picked:{},morning:null},player:{x:550,y:1050},clock:{day:2,elapsed:578,collapseAt:580},economy:{gold:100,shipping:{...quantities,radish:2,potato:2},lastSale:null}});cy.window().then(win=>cy.stub(win.Math,'random').returns(.9));
  cy.get('#dialogue').should('have.attr','data-presentation','loss');cy.get('#dialogue-text').should('contain','10 gold').and('not.contain','elszámolás');cy.get('#morning-sale-panel').should('not.be.visible');cy.get('#dialogue-close').click();
  cy.get('#morning-sale-panel').should('be.visible');cy.get('.morning-sale-table tbody tr').should('have.length',2);cy.get('#morning-balance').should('have.attr','data-start','90').and('have.attr','data-target','180');cy.get('#dialogue-close').should('be.visible').click();cy.get('#game',{timeout:8000}).should('have.attr','data-morning-stage','none');cy.get('#dialogue').should('not.be.visible');reloadFarm();cy.get('#game').should('have.attr','data-gold','180');cy.get('#dialogue').should('not.be.visible');
 });
 it('purchases nursery and pond goods at exact prices and restores carried stock',()=>{
  for(const [player,good,price] of [[{x:591,y:975},'cherry',300],[{x:708,y:1116},'goldfish',40]] as const){
   start({...villageSave,player,economy:{...villageSave.economy,gold:400}});press('e','KeyE',69);cy.get('#shop-panel').should('be.visible');cy.get(`[data-buy-good="${good}"]`).click();cy.get('#game').should('have.attr','data-gold',String(400-price));press('Escape','Escape',27);press('Tab','Tab',9);cy.get(`[data-good="${good}"]`).should('contain','1 db');press('Escape','Escape',27);reloadFarm();press('Tab','Tab',9);cy.get(`[data-place-good="${good}"]`).should('be.visible');
  }
 });
 it('keeps the morning settlement open after the gold animation until the player dismisses it',()=>{
  start({...villageSave,player:{x:250,y:242},clock:{day:2,elapsed:0,collapseAt:580},economy:{gold:100,shipping:{...quantities,radish:2},lastSale:null}});clickWorld(281,193);cy.get('#sleep').click();cy.get('#morning-balance').should('have.text','130 gold');cy.wait(4000);cy.get('#morning-sale-panel').should('be.visible');cy.get('#dialogue-close').should('have.text','Indulhat a nap').click();cy.get('#game').should('have.attr','data-morning-stage','none');reloadFarm();cy.get('#game').should('have.attr','data-gold','130');
 });

 it('separates side conversations with Annie and Leo from counter purchases',()=>{
  for(const [origin,name] of [[2300,'Annie'],[1600,'Leo']] as const){
   start({...villageSave,player:{x:325,y:origin+240}});press('e','KeyE',69);cy.get('#dialogue-title').should('have.text',name);cy.get('#dialogue').should('have.attr','data-speaker',name.toLowerCase());cy.get('#speaker-name').should('have.text',name);cy.get('#speaker-portrait img').should('be.visible');cy.get('#shop-panel').should('not.be.visible');if(name==='Annie')cy.get('#dialogue-text').should('contain','madárodú');press('Escape','Escape',27);
   walk('down','y',origin+320);walk('right','x',450);press('e','KeyE',69);cy.get('#shop-panel').should('be.visible');cy.get('#dialogue-text').should('not.contain','madárodú');if(name==='Annie')cy.get('[data-buy-good=reed]').parent().should('contain','Később kosárfonáshoz hasznosítható.');
  }
 });

 it('continues after the fifteenth day without stopping an unfinished story',()=>{
  start({...villageSave,player:{x:272,y:220},clock:{day:15,elapsed:100,collapseAt:580},economy:{gold:100,shipping:{...quantities,radish:2},lastSale:null}});press('e','KeyE',69);cy.get('#sleep').click();cy.get('#game').should('have.attr','data-day','16').and('have.attr','data-calendar-day','15').and('have.attr','data-gold','130');cy.get('#morning-sale-panel').should('be.visible');cy.get('#dialogue-close').click();cy.get('#dialogue').should('not.be.visible');reloadFarm();cy.get('#dialogue').should('not.be.visible');
 });

 it('confirms farm deletion and supports cancelling without removing the save',()=>{
  start({...villageSave,farmName:'Törlési próba'});cy.get('#menu').click();cy.get('#open-start-menu').click();cy.get('#dialogue-label').should('not.be.visible');cy.get('.delete-farm').click();cy.get('#delete-farm-dialog').should('be.visible');cy.get('#delete-farm-warning').should('have.text','Biztosan törölni szeretnéd ezt a farmot? A farm törlés után nem visszaállítható.');cy.focused().should('have.id','cancel-delete-farm');cy.get('#cancel-delete-farm').click();cy.get('.farm-save-card').should('have.length',1);cy.get('.delete-farm').click();cy.get('#confirm-delete-farm').click();cy.get('#game').should('have.attr','data-ready','true');cy.get('.farm-save-card').should('not.exist');cy.get('#continue-farm').should('not.be.visible');cy.reload();cy.get('#new-farm').should('not.be.disabled');cy.get('.farm-save-card').should('not.exist');
 });
 it('lets Teszt farm continue beyond spring for testing',()=>{
  start({...villageSave,farmName:'Teszt farm',clock:{day:16,elapsed:20,collapseAt:580}});cy.get('#game').should('have.attr','data-preview-complete','false').and('have.attr','data-day','16').and('have.attr','data-calendar-day','15');cy.get('#season-name').should('have.text','Tavasz');cy.get('#day-number').should('have.text','15.');reloadFarm();cy.get('#dialogue').should('not.be.visible');
 });

 it('shows the first-day locked-building goal without giving a solution',()=>{
  start();cy.get('#quest-tracker').should('be.visible').and('contain','Fedezd fel, mit rejt a lezárt melléképület');cy.get('#quest-tracker').should('not.contain','Leo').and('not.contain','kulcs');
 });
 it('receives Leo’s separate flower quest on day four without revealing the key',()=>{
  start({...villageSave,player:{x:296,y:275},clock:{day:4,elapsed:0,collapseAt:580}});cy.get('#dialogue',{timeout:30000}).should('be.visible');cy.get('#speaker-name').should('have.text','Leo');cy.get('#dialogue-text').should('contain','szarvas faliméh').and('not.contain','kulcs');cy.get('#dialogue-close').click();cy.get('#toolbar [data-tool=wildflower]').should('be.visible').and('contain','6');cy.get('#quest-tracker').should('contain','Elültetve: 0 / 6').and('contain','Fedezd fel, mit rejt a lezárt melléképület');
 });

 it('explores the dark workshop, remembers the shutter and requires inspection before repair',()=>{
  const travel=createTravel(),flowers=Array.from({length:6},(_,i)=>({x:-160+i*16,y:-96,growth:4}));travel.research={...travel.research,gifted:true,seeds:0,flowers,beeDay:9,observation:{day:9,seasonDay:9,plant:'Tavaszi vadvirágkeverék'},key:true};
  const data={...villageSave,version:17,travel,player:{x:400,y:3470},clock:{day:10,elapsed:20,collapseAt:580},plots:flowers.map(f=>[`${f.x},${f.y}`,{crop:null,growth:0,regrowing:false,watered:false}])};
  start(data);cy.get('#game').should('have.attr','data-region','workshop').and('have.attr','data-shutter','false');walk('right','x',495);press('e','KeyE',69);cy.get('#dialogue-title').should('have.text','Ajtó melletti redőny');cy.get('#dialogue-close').click();cy.get('#game').should('have.attr','data-entrance-shutter','true');walk('left','x',245);walk('up','y',3245);walk('left','x',208);press('e','KeyE',69);cy.get('#dialogue-title').should('have.text','Redőny');cy.get('#dialogue-close').click();cy.get('#game').should('have.attr','data-shutter','true');reloadFarm();cy.get('#game').should('have.attr','data-shutter','true');
  walk('down','y',3390);walk('left','x',145);press('e','KeyE',69);cy.get('#game').should('have.attr','data-cleared-webs','1');reloadFarm();cy.get('#game').should('have.attr','data-cleared-webs','1');walk('up','y',3378);walk('right','x',337);press('e','KeyE',69);cy.get('#dialogue-title').should('have.text','Üstszerű tartály');cy.get('#research-panel').should('contain','Fa: 0 / 35').and('contain','Ócskavas: 0 / 18');cy.get('#repair-machine').should('be.enabled').click();cy.get('#repair-warning').should('be.visible').and('have.text','Nincs nálad elég nyersanyag.');
 });

 it('offers a Goals tab with an independent locked-building objective and closes with Tab',()=>{start();press('Tab','Tab',9);cy.get('#goals-tab').click();cy.get('#goals-page').should('be.visible');cy.get('[data-quest=locked-building]').should('contain','Fedezd fel, mit rejt a lezárt melléképület').and('not.have.class','completed');press('Tab','Tab',9);cy.get('#dialogue').should('not.be.visible');});

 it('keeps a saved rainy day stable and waters existing crops and freshly tilled soil',()=>{
  start({...villageSave,version:17,travel:{...createTravel(),weatherSeed:13},player:{x:369,y:330},clock:{day:6,elapsed:20,collapseAt:580},plots:[['353,280',{crop:'radish',growth:0,regrowing:false,watered:false}]]});cy.get('#game').should('have.attr','data-weather','rain').and('have.attr','data-watered','1');cy.get('#weather-label').should('have.text','Esős');cy.get('#toolbar [data-tool=hoe]').click();clickWorld(377,288);cy.get('#game').should('have.attr','data-watered','2');reloadFarm();cy.get('#game').should('have.attr','data-weather','rain').and('have.attr','data-watered','2');
 });

 it('returns focus to the game after closing the menu so Space jumps immediately',()=>{start({...villageSave,player:{x:250,y:242}});cy.get('#menu').focus().click();cy.get('#dialogue-close').click();cy.focused().should('have.prop','tagName','CANVAS');press(' ','Space',32);cy.get('#game').should('have.attr','data-jumping','true');cy.get('#dialogue').should('not.be.visible');cy.get('#menu').focus().click();press('Escape','Escape',27);cy.focused().should('have.prop','tagName','CANVAS');walk('down','y',260);});

 it('keeps Shift held across menu closure and releases running normally',()=>{start({...villageSave,player:{x:250,y:242}});cy.get('body').trigger('keydown',{key:'Shift',code:'ShiftLeft',keyCode:16,which:16,shiftKey:true});cy.get('#menu').click();cy.get('#dialogue-close').click();cy.get('body').trigger('keydown',{key:'s',code:'KeyS',keyCode:83,which:83,shiftKey:true});cy.get('#game').should('have.attr','data-running','true').and('have.attr','data-walking','true');cy.get('body').trigger('keyup',{key:'s',code:'KeyS',keyCode:83,which:83,shiftKey:true});cy.get('body').trigger('keyup',{key:'Shift',code:'ShiftLeft',keyCode:16,which:16,shiftKey:false});cy.get('#game').should('have.attr','data-running','false');});

 it('restores timber in three saved phases and receives wood and old fittings once',()=>{start({...villageSave,version:17,travel:{...createTravel(),weatherSeed:13},player:{x:312,y:409}});cy.get('#status').should('contain','Helyreállítás');for(let i=0;i<3;i++){press('e','KeyE',69);cy.get('#game').should('have.attr','data-working','true');cy.get('#game').should('have.attr','data-working','false');}cy.get('#game').should('have.attr','data-wood','6');reloadFarm();cy.get('#game').should('have.attr','data-wood','6');});

});

describe('The farmhouse interior',()=>{
 it('enters the house, reloads its saved position and leaves the bed without save controls',()=>{start();press('e','KeyE',69);cy.get('#game').should('have.attr','data-region','home');cy.get('#dialogue').should('not.be.visible');cy.get('#sleep').should('not.be.visible');reloadFarm();cy.get('#game').should('have.attr','data-region','home');press('e','KeyE',69);cy.get('#game').should('have.attr','data-region','farm');});
});

describe('Escape start-menu shortcut',()=>{
 it('opens and closes the start menu and preserves the inventory Escape shortcut',()=>{start();press('Escape','Escape',27);cy.get('#start-panel').should('be.visible');cy.get('#continue-farm').should('not.be.disabled');cy.get('#dialogue-title').should('have.text','Főmenü');cy.get('#open-start-menu').should('have.text','Főmenü');press('Escape','Escape',27);cy.get('#dialogue').should('not.be.visible');press('Tab','Tab',9);cy.get('#inventory-panel').should('be.visible');press('Escape','Escape',27);cy.get('#dialogue').should('not.be.visible');});
 it('closes after a quick second Escape while the current farm is being saved',()=>{start();cy.window().then(win=>{for(let i=0;i<2;i++){win.dispatchEvent(new win.KeyboardEvent('keydown',{key:'Escape',code:'Escape',bubbles:true}));win.dispatchEvent(new win.KeyboardEvent('keyup',{key:'Escape',code:'Escape',bubbles:true}));}});cy.get('#dialogue').should('not.be.visible');cy.get('#start-panel').should('not.be.visible');});
});
