// ***********************************************************
// Tattva Co. - Cypress Support File
// ***********************************************************

import './commands';
import '@testing-library/cypress/add-commands';

// Hide fetch/XHR requests from command log for cleaner output
const app = window.top;
if (app && !app.document.head.querySelector('[data-hide-command-log-request]')) {
  const style = app.document.createElement('style');
  style.innerHTML = '.command-name-request, .command-name-xhr { display: none }';
  style.setAttribute('data-hide-command-log-request', '');
  app.document.head.appendChild(style);
}

// Prevent Cypress from failing tests on uncaught exceptions
// (useful for third-party scripts)
Cypress.on('uncaught:exception', (err, runnable) => {
  // Return false to prevent the test from failing
  if (err.message.includes('ResizeObserver loop')) {
    return false;
  }
  return true;
});

// Global before hook - runs once before all tests
before(() => {
  cy.log('🚀 Starting Tattva Co. Test Suite');
});

// Global beforeEach hook - runs before each test
beforeEach(() => {
  // Clear cookies and local storage before each test
  cy.clearCookies();
  cy.clearLocalStorage();
  
  // Set viewport to desktop by default
  cy.viewport(1280, 720);
});

// Global afterEach hook - runs after each test
afterEach(function() {
  // Take screenshot on test failure
  if (this.currentTest && this.currentTest.state === 'failed') {
    cy.screenshot(`FAILED-${this.currentTest.title}`, { capture: 'fullPage' });
  }
});
