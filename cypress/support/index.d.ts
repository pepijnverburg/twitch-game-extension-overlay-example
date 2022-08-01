/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to initialize an individual test
     * @example cy.setupApp()
    */
   setupApp(): Chainable<Element>;

    /**
     * Custom command to select DOM element by data-testid attribute.
     * @example cy.getTestElement('greeting')
    */
   getTestElement(selector: string): Chainable<Element>;
  }
}