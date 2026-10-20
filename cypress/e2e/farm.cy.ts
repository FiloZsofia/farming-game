describe('Full-screen farm',()=>{
 beforeEach(()=>{cy.visit('/',{onBeforeLoad(win){win.indexedDB.deleteDatabase('erdoszeli-birtok');}});cy.get('canvas').should('be.visible');cy.get('#dialogue').should('be.visible').and('contain','kutatólaborban');cy.get('#game').should('have.attr','data-ready','true');cy.get('#dialogue-close').click();cy.get('#status').should('contain','Veranda');});
 it('walks into the yard and returns to the door',()=>{
  cy.get('[data-dir="down"]').trigger('pointerdown',{pointerId:1});
  cy.get('#status',{timeout:10000}).should('be.empty');
  cy.get('[data-dir="down"]').trigger('pointerup',{pointerId:1});
  cy.get('#home').click();cy.get('#status').should('contain','Veranda');
 });
 it('shows story inside the game and suspends movement during dialogue',()=>{
  cy.get('#story').click();cy.get('#dialogue').should('be.visible');
  cy.get('body').trigger('keydown',{key:'s',code:'KeyS',keyCode:83});
  cy.get('body').trigger('keyup',{key:'s',code:'KeyS',keyCode:83});
  cy.get('#game').should('have.attr','data-ready','true');cy.get('#dialogue-close').click();cy.get('#status').should('contain','Veranda');
 });
 it('fills a mobile screen without document scrolling',()=>{
  cy.viewport(390,844);cy.get('canvas').should('be.visible');
  cy.document().then(doc=>{expect(doc.documentElement.scrollWidth).to.equal(390);expect(doc.documentElement.scrollHeight).to.equal(844);});
  cy.get('[data-dir="down"]').should('be.visible').trigger('pointerdown',{pointerId:2});
  cy.get('#status',{timeout:10000}).should('be.empty');
  cy.get('[data-dir="down"]').trigger('pointercancel',{pointerId:2});
  cy.get('#home').click();cy.get('#status').should('contain','Veranda');
 });
});

describe('Gardening',()=>{
 it('tills, plants and waters with the screen action button',()=>{
  cy.visit('/',{onBeforeLoad(win){win.indexedDB.deleteDatabase('erdoszeli-birtok');}});cy.get('#game').should('have.attr','data-ready','true');cy.get('#dialogue-close').click();
  const walk=(dir:string,axis:string,minimum:number)=>{
   cy.get(`[data-dir="${dir}"]`).trigger('pointerdown',{pointerId:1});
   cy.get('#game',{timeout:15000}).should(el=>expect(Number(el.attr(`data-player-${axis}`))).to.be.at.least(minimum));
   cy.get(`[data-dir="${dir}"]`).trigger('pointerup',{pointerId:1});
  };
  walk('down','y',287);walk('right','x',334);
  cy.get('[data-tool="hoe"]').click();cy.get('#work').click();cy.get('#game').should('have.attr','data-plots','1');
  cy.get('[data-tool="radish"]').click();cy.get('#work').click();cy.get('[data-count="radish"]').should('have.text','3');
  cy.get('[data-tool="water"]').click();cy.get('#work').click();cy.get('#game').should('have.attr','data-watered','1');
  cy.get('#save-state').should('contain','Mentve');cy.reload();cy.get('#game').should('have.attr','data-ready','true').and('have.attr','data-planted','1').and('have.attr','data-watered','1');cy.get('[data-count=radish]').should('have.text','3');
 });
 it('does not spend seeds for an invalid or distant plot',()=>{
  cy.visit('/',{onBeforeLoad(win){win.indexedDB.deleteDatabase('erdoszeli-birtok');}});cy.get('#game').should('have.attr','data-ready','true');cy.get('#dialogue-close').click();cy.get('[data-tool="radish"]').click();cy.get('#work').click();
  cy.get('[data-count="radish"]').should('have.text','4');cy.get('#game').should('have.attr','data-planted','0');
 });
});


describe('Rest and persistence',()=>{
 it('saves a new morning atomically and restores it on reload',()=>{
  cy.visit('/',{onBeforeLoad(win){win.indexedDB.deleteDatabase('erdoszeli-birtok');}});
  cy.get('#game').should('have.attr','data-ready','true');cy.get('#dialogue-close').click();
  cy.get('#journal').click();cy.get('#sleep').click();
  cy.get('#game').should('have.attr','data-day','2');cy.get('#save-state').should('contain','Mentve');
  cy.reload();cy.get('#game').should('have.attr','data-ready','true').and('have.attr','data-day','2');
 });
 it('can jump without consuming seeds or moving while standing still',()=>{
  cy.visit('/',{onBeforeLoad(win){win.indexedDB.deleteDatabase('erdoszeli-birtok');}});
  cy.get('#game').should('have.attr','data-ready','true');cy.get('#dialogue-close').click();
  cy.get('#jump').click();cy.get('#game').should('have.attr','data-jumping','true');
  cy.get('#game').should('have.attr','data-jumping','false').and('have.attr','data-player-x','250');
  cy.get('[data-count=radish]').should('have.text','4');
 });
});
