// ***********************************************************
// Tattva Co. - Custom Cypress Commands
// ***********************************************************

// Import Percy for visual regression testing
import '@percy/cypress';

// Add custom command for checking Web Vitals
Cypress.Commands.add('checkWebVitals', () => {
  cy.window().then((win) => {
    // Check for performance entries
    const perfEntries = win.performance.getEntries();
    cy.log(`Performance Entries: ${perfEntries.length}`);

    // Log navigation timing
    const navTiming = win.performance.timing;
    const pageLoadTime = navTiming.loadEventEnd - navTiming.navigationStart;
    cy.log(`Page Load Time: ${pageLoadTime}ms`);

    expect(pageLoadTime).to.be.lessThan(10000, 'Page should load in less than 10 seconds');
  });
});

// Custom command for waiting for lazy-loaded images
Cypress.Commands.add('waitForLazyImages', () => {
  cy.get('img[loading="lazy"]', { timeout: 10000 }).should('be.visible');
});

// Custom command for checking social proof notifications
Cypress.Commands.add('waitForSocialProofNotification', () => {
  cy.get('[data-testid="social-proof-notification"]', { timeout: 20000 })
    .should('be.visible')
    .and('contain.text', 'purchased');
});

// Custom command for adding product to cart
Cypress.Commands.add('addProductToCart', (productName?: string) => {
  // Ensure products are loaded first
  cy.get('.product-card', { timeout: 10000 }).should('have.length.gt', 0);

  if (productName) {
    cy.contains('.product-card', productName).within(() => {
      // Find button with text containing "Add"
      cy.contains('button', 'Add').click({ force: true });
      // Wait for button state to change to "Adding..." then "Added"
      cy.contains('button', 'Adding...', { timeout: 2000 }).should('exist');
      cy.contains('button', 'Added', { timeout: 3000 }).should('exist');
    });
  } else {
    // Find first product card that has an "Add" button (skip out of stock)
    // Use filter to ensure we get exactly the button we want
    cy.get('.product-card button')
      .filter(':contains("Add")')
      .first()
      .click({ force: true })
      .parents('.product-card')
      .within(() => {
        // Wait for button state change
        // Removing "Adding..." check as it is transient (600ms) and can be missed
        cy.contains('button', 'Added', { timeout: 4000 }).should('exist');
      });
    // Safety wait for state update
    cy.wait(500);
  }
  // Optional: check toast if needed, but button state is enough for action verification
  // cy.contains(/Added/i).should('be.visible');
});

// Custom command for navigating to page
Cypress.Commands.add('navigateTo', (page: string) => {
  cy.get('header').within(() => {
    cy.contains('a', page, { matchCase: false }).click();
  });
});

// Custom command to go to checkout (opens cart first)
Cypress.Commands.add('goToCheckout', () => {
  cy.get('[data-testid="header-cart-btn"]').click({ force: true });
  // Wait for cart to open/animate
  cy.wait(500);
  // Click checkout link/button - ensure we click the visible one (e.g. inside the open cart side modal)
  // The MiniCart might be present but covered by the main Cart, so filter by visibility.
  cy.get('a[href*="checkout"], button:contains("Checkout")').filter(':visible').first().click();
});

// Custom command for completing quiz
Cypress.Commands.add('completeQuiz', (correctAnswers: boolean = true) => {
  // Answer all 8 questions
  const answers = correctAnswers
    ? [0, 2, 1, 1, 2, 1, 1, 1] // Correct answers
    : [1, 0, 0, 0, 0, 0, 0, 0]; // Wrong answers

  answers.forEach((answerIndex, questionIndex) => {
    cy.get('[data-testid="quiz-question-container"]').within(() => {
      // Click the answer option
      cy.get(`[data-testid="quiz-answer-${questionIndex}-${answerIndex}"]`).click();

      // Wait for feedback/button to appear
      cy.get('[data-testid="quiz-next-btn"]').should('be.visible').click();
    });
    // Small wait for animation/state update
    cy.wait(500);
  });
});

// Custom command for applying promo code
Cypress.Commands.add('applyPromoCode', (code: string) => {
  cy.get('input[placeholder*="promo" i]').clear({ force: true }).type(code, { force: true });
  cy.get('button').contains(/apply/i).click({ force: true });
});

// TypeScript declarations for custom commands
declare global {
  namespace Cypress {
    interface Chainable {
      checkWebVitals(): Chainable<void>;
      waitForLazyImages(): Chainable<void>;
      waitForSocialProofNotification(): Chainable<void>;
      addProductToCart(productName?: string): Chainable<void>;
      navigateTo(page: string): Chainable<void>;
      goToCheckout(): Chainable<void>;
      completeQuiz(correctAnswers?: boolean): Chainable<void>;
      applyPromoCode(code: string): Chainable<void>;
    }
  }
}

export {};
