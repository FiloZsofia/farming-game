import {snapshot,type Snapshot} from '../../src/storage';
import {createClock} from '../../src/clock';
import {createGarden} from '../../src/gardening';
import {enableHomestead} from '../../src/homestead-migration';
import {LivingGarden} from '../../src/living-garden';
import {prepareLivingBed,plantLivingBed} from '../../src/living-bed';
import {startResearch} from '../../src/research';

function press(key:string,code:string,n:number){cy.get('body').trigger('keydown',{key,code,keyCode:n,which:n});cy.get('body').trigger('keyup',{key,code,keyCode:n,which:n});}
function start(data:Snapshot){
 cy.visit('/',{onBeforeLoad(win){win.indexedDB.deleteDatabase('erdoszeli-birtok');const request=win.indexedDB.open('erdoszeli-birtok',1);request.onupgradeneeded=()=>request.result.createObjectStore('saves');request.onsuccess=()=>{const tx=request.result.transaction('saves','readwrite');tx.objectStore('saves').put(data,'active');tx.oncomplete=()=>request.result.close();};}});
 cy.get('#game').should('have.attr','data-ready','true');cy.get('#continue-farm').should('not.be.disabled').click();
}
function saved(){return cy.window().then(win=>new Cypress.Promise<Snapshot>((resolve,reject)=>{const request=win.indexedDB.open('erdoszeli-birtok',1);request.onsuccess=()=>{const tx=request.result.transaction('saves','readonly'),read=tx.objectStore('saves').get('active');read.onsuccess=()=>resolve(read.result);read.onerror=()=>reject(read.error);tx.oncomplete=()=>request.result.close();};request.onerror=()=>reject(request.error);}));}
function fresh(){const s=enableHomestead(snapshot({x:750,y:334},createClock(1),createGarden()),true);s.farmName='Ágyásteszt';s.travel.weatherSeed=99;s.story.giftReceived=true;s.story.morningSeen=true;return s;}
function clickWorld(x:number,y:number){cy.get('#game').then(el=>{const z=Number(el.attr('data-zoom'));cy.get('canvas').click((x-Number(el.attr('data-camera-x')))*z,(y-Number(el.attr('data-camera-y')))*z);});}

describe('0.3.0 production gardening and shipping',()=>{
 it('migrates a legacy garden once, returns its stock and keeps the notice acknowledged',()=>{
  const legacy=snapshot({x:250,y:194},createClock(9),createGarden());legacy.farmName='Régi kert';legacy.plots=[['341,272',{crop:'radish',growth:3,watered:false,regrowing:false}]];legacy.economy.shipping.pea=2;
  start(legacy);cy.get('#dialogue-title').should('have.text','Megújult a kerted!');cy.get('#dialogue-close').click();
  saved().then(s=>{expect(s.version).to.eq(19);expect(s.plots).to.deep.eq([]);expect(s.seeds.radish).to.eq(legacy.seeds.radish+1);expect(s.produce.radish).to.eq(1);expect(s.produce.pea).to.eq(2);expect(s.travel.homestead?.updateSeen).to.eq(true);});
  cy.reload();cy.get('#continue-farm').click();cy.get('#dialogue-title').should('not.have.text','Megújult a kerted!');
 });
 it('uses the real inventory and persistent whole-bed watering with contextual seeds',()=>{
  const s=fresh();s.travel.research=startResearch(s.travel.research,1)!;s.travel.homestead!.garden.extraSeeds.wildflower=6;const g=new LivingGarden(s,true),bed=g.addBed({x:670,y:216,w:160,h:88});g.accept(bed,prepareLivingBed(g.sync(bed))!,'prepare');g.accept(bed,plantLivingBed(g.sync(bed),'pollinator')!,'plant');start(g.writePersistent());
  clickWorld(750,290);cy.get('#living-bed-panel').should('be.visible').and('contain','Virágos retekágyás');cy.get('#living-garden-seeds option').should('have.length',3);
  cy.get('#toolbar [data-tool=water]').click();clickWorld(750,290);saved().then(s=>expect(s.travel.homestead!.garden.beds[0].state.moisture).to.eq(3));
  press('Tab','Tab',9);cy.get('#inventory-panel').should('be.visible');cy.get('#inventory-panel #living-garden-window').should('not.exist');cy.get('[data-stack-key="seed:carrot"]').should('contain','3');
 });
 it('accepts baskets, roe and eggs in the real stand and retains them across reload',()=>{
  const s=fresh();s.player={x:70,y:450};s.travel.estate.produce.basket=2;s.travel.estate.produce.roe8=3;s.travel.estate.produce.duckEgg=4;start(s);cy.get('#game').should('have.attr','data-market-ready','true');
  press('e','KeyE',69);cy.get('#dialogue-title').should('have.text','Terményátadó');
  for(const p of ['basket','roe8','duckEgg'])cy.get(`[data-stand-product="${p}"]`).click();
  saved().then(s=>{expect(s.travel.homestead!.stand.crates.filter(Boolean)).to.have.length(3);expect(s.travel.estate.produce.basket).to.eq(0);});
  cy.reload();cy.get('#continue-farm').click();press('e','KeyE',69);cy.get('[data-stand-crate] .item-icon').should('have.length',3);
 });
});
