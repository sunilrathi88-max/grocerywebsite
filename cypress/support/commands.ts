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

    expect(pageLoadTime).to.be.lessThan(5000, 'Page should load in less than 5 seconds');
  });
});

// Custom command for waiting for lazy-loaded images
Cypress.Commands.add('waitForLazyImages', () => {
  cy.get('img[loading="lazy"]', { timeout: 10000 }).should('be.visible');
});

// Custom command for checking social proof notifications
Cypress.Commands.add('waitForSocialProofNotification', () => {
  cy.get('[class*="fixed"][class*="bottom"]', { timeout: 20000 })
    .should('be.visible')
    .and('contain.text', 'just purchased');
});

// Custom command for adding product to cart
Cypress.Commands.add('addProductToCart', (productName?: string) => {
  if (productName) {
    cy.contains('.product-card', productName).within(() => {
      // Find button with text exactly "Add" (not "Adding..." or "Added")
      cy.contains('button', /^Add$/).click({ force: true });
      // Wait for button state to change to "Adding..." then "Added"
      cy.contains('button', 'Adding...', { timeout: 2000 }).should('exist');
      cy.contains('button', 'Added', { timeout: 3000 }).should('exist');
    });
  } else {
    cy.get('.product-card')
      .first()
      .within(() => {
        // Find button with text exactly "Add" (not "Adding..." or "Added")
        cy.contains('button', /^Add$/).click({ force: true });
        // Wait for button state to change to "Adding..." then "Added"
        cy.contains('button', 'Adding...', { timeout: 2000 }).should('exist');
        cy.contains('button', 'Added', { timeout: 3000 }).should('exist');
      });
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

// Custom command for completing quiz
Cypress.Commands.add('completeQuiz', (correctAnswers: boolean = true) => {
  // Answer all 8 questions
  const answers = correctAnswers
    ? [0, 2, 1, 1, 2, 1, 1, 1] // Correct answers
    : [1, 0, 0, 0, 0, 0, 0, 0]; // Wrong answers

  answers.forEach((answerIndex, questionIndex) => {
    cy.get('[class*="quiz"]').within(() => {
      cy.get('button')
        .contains(/Option|Choice/)
        .eq(answerIndex)
        .click();

      if (questionIndex < answers.length - 1) {
        cy.get('button').contains('Next').click();
      }
    });
    cy.wait(500);
  });
});

// Custom command for applying promo code
Cypress.Commands.add('applyPromoCode', (code: string) => {
  cy.get('input[placeholder*="promo" i], input[placeholder*="code" i]').clear().type(code);
  cy.get('button').contains(/apply/i).click();
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
      completeQuiz(correctAnswers?: boolean): Chainable<void>;
      applyPromoCode(code: string): Chainable<void>;
    }
  }
}

export {};
