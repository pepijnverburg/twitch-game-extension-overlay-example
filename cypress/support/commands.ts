import { NAVIGATION_INVENTORY_SELECTOR } from '../support/constants';

Cypress.Commands.add('setupApp', () => {
  cy.visit('/');
  cy.waitFor(NAVIGATION_INVENTORY_SELECTOR);
  return cy.wait(500);
});

Cypress.Commands.add('getTestElement', (selector) => {
  return cy.get(`[data-testid="${selector}"]`);
});
