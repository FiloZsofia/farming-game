describe('Full-screen farm',()=>{
 beforeEach(()=>{cy.visit('/');cy.get('canvas').should('be.visible');cy.get('#dialogue').should('be.visible').and('contain','kutatólaborban');cy.get('#dialogue-close').click();cy.get('#status').should('contain','Veranda');});
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
  cy.get('#dialogue-close').click();cy.get('#status').should('contain','Veranda');
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
