/// <reference types="cypress" />

import { NAVIGATION_SELECTOR } from '../support/constants';

describe('Navigation', () => {
  it('finds the navigation element', () => {
    cy.setupApp();
    const StoneNav = cy.getTestElement(NAVIGATION_SELECTOR);
    StoneNav.should('have.length', 1);
  });
});
