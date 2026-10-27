import {snapshot,type Snapshot} from '../../src/storage';
import {createClock} from '../../src/clock';
import {createGarden} from '../../src/gardening';
function press(key:string,code:string,n:number){cy.get('body').trigger('keydown',{key,code,keyCode:n,which:n});cy.get('body').trigger('keyup',{key,code,keyCode:n,which:n});}
function start(data:Snapshot){cy.visit('/',{onBeforeLoad(win){win.indexedDB.deleteDatabase('erdoszeli-birtok');const r=win.indexedDB.open('erdoszeli-birtok',1);r.onupgradeneeded=()=>r.result.createObjectStore('saves');r.onsuccess=()=>{const tx=r.result.transaction('saves','readwrite');tx.objectStore('saves').put(data,'active');tx.oncomplete=()=>r.result.close();};}});cy.get('#game').should('have.attr','data-ready','true');cy.get('#continue-farm').should('not.be.disabled').click();}
function fresh(x=281,y=220){const s=snapshot({x,y},createClock(10),createGarden());s.farmName='Kerti megfigyelés';s.travel.weatherSeed=0;s.story={giftReceived:true,morningSeen:true,birdhouse:{x:280,y:296}};return s;}
it('explains the first observed empty fruit set once and remembers it after reload',()=>{
 const s=fresh(353,320);s.plots=[['341,272',{crop:'strawberry',growth:4,regrowing:false,watered:true,fruitSet:false}]];start(s);cy.get('#dialogue-title').should('have.text','Üres terméshelyek');cy.get('#dialogue-text').should('contain','Az öntözés önmagában nem elég');cy.get('#game').should('have.attr','data-ripe-markers','0');cy.get('#dialogue-close').click();cy.reload();cy.get('#continue-farm').should('not.be.disabled').click();cy.get('#dialogue').should('not.be.visible');
});
it('keeps the dated observation accessible in the veranda journal',()=>{
 const s=fresh();s.travel.pollinationObservation={day:9};start(s);press('e','KeyE',69);cy.get('[data-pollination-note]').should('contain','9. nap').and('contain','Talán túl kevés beporzó');cy.get('#sleep').should('be.visible');
});
it('keeps a ripe berry harvestable for three days then removes the ripe badge',()=>{
 const s=fresh();s.plots=[['341,272',{crop:'strawberry',growth:4,regrowing:false,watered:true,fruitSet:true,ripeDays:0}]];start(s);cy.get('#game').should('have.attr','data-ripe-markers','1');
 for(const day of [11,12,13]){cy.get('#game').then(el=>{const z=Number(el.attr('data-zoom'));cy.get('canvas').click((281-Number(el.attr('data-camera-x')))*z,(193-Number(el.attr('data-camera-y')))*z);});cy.get('#sleep').should('be.visible').click();cy.get('#day-number').should('have.text',`${day}.`);cy.get('#morning-sale-panel').should('be.visible');cy.get('#dialogue-close').click();cy.get('#game').should('have.attr','data-ripe-markers',day<13?'1':'0');}
});
