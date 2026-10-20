describe('Farm movement prototype',()=>{
 beforeEach(()=>{cy.visit('/');cy.get('canvas').should('be.visible');cy.get('#status').should('contain','verandán');});
 it('walks into the yard and returns to the door',()=>{
  cy.get('[data-dir="down"]').trigger('pointerdown',{pointerId:1});
  cy.get('#status',{timeout:4000}).should('contain','A birtok a tiéd');
  cy.get('[data-dir="down"]').trigger('pointerup',{pointerId:1});
  cy.get('#home').click();cy.get('#status').should('contain','verandán');
 });
 it('renders at mobile width with usable movement controls',()=>{
  cy.viewport(390,844);cy.get('canvas').should('be.visible');
  cy.get('[data-dir="down"]').should('be.visible').trigger('pointerdown',{pointerId:2});
  cy.get('#status',{timeout:4000}).should('contain','A birtok a tiéd');
  cy.get('[data-dir="down"]').trigger('pointercancel',{pointerId:2});
  cy.get('#home').click();cy.get('#status').should('contain','verandán');
 });
 it('captures the actual prototype',()=>{cy.screenshot('farm-prototype',{capture:'viewport'});});
});
