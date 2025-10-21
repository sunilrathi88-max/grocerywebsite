/// <reference types="cypress" />

/**
 * Tattva Co. - Quiz and Promo Code Test
 * Tests the enhanced quiz with 8 questions and promo code generation
 */

describe('Quiz and Promo Code System', () => {
  beforeEach(() => {
    cy.visit('/');
    // Scroll to quiz section
    cy.contains('Test Your Spice Knowledge').scrollIntoView();
  });

  it('should display quiz with first question', () => {
    cy.contains('Test Your Spice Knowledge').should('be.visible');
    cy.contains('Which of our spices gives biryani its beautiful golden hue?').should('be.visible');
  });

  it('should complete quiz with perfect score and get QUIZMASTER15 promo', () => {
    // Correct answers for all 8 questions
    const correctAnswers = [
      'Himalayan Saffron',           // Q1
      'Kerala',                      // Q2
      'Gluten-Free',                 // Q3
      'Cool, dry, and dark place',   // Q4
      'Increases cholesterol',       // Q5
      '1-2 years',                   // Q6
      'Indians',                     // Q7
      'All of the above'             // Q8
    ];

    // Answer each question
    correctAnswers.forEach((answer, index) => {
      cy.contains('button', answer).click();
      
      if (index < correctAnswers.length - 1) {
        cy.contains('button', 'Next').click();
        cy.wait(500);
      }
    });

    // Verify results screen
    cy.contains('Quiz Completed!').should('be.visible');
    cy.contains('Perfect Score!').should('be.visible');
    cy.contains('8').should('be.visible'); // Score 8/8
    
    // Verify QUIZMASTER15 promo code
    cy.contains('QUIZMASTER15').should('be.visible');
    cy.contains('15% off').should('be.visible');
  });

  it('should complete quiz with 7/8 score and get SPICEFAN10 promo', () => {
    // Answer 7 correctly, 1 wrong
    const answers = [
      'Himalayan Saffron',           // Correct
      'Kerala',                      // Correct
      'Premium',                     // Wrong (should be Gluten-Free)
      'Cool, dry, and dark place',   // Correct
      'Increases cholesterol',       // Correct
      '1-2 years',                   // Correct
      'Indians',                     // Correct
      'All of the above'             // Correct
    ];

    answers.forEach((answer, index) => {
      cy.contains('button', answer).click();
      
      if (index < answers.length - 1) {
        cy.contains('button', 'Next').click();
        cy.wait(500);
      }
    });

    // Verify results
    cy.contains('Quiz Completed!').should('be.visible');
    cy.contains('7').should('be.visible'); // Score 7/8
    
    // Verify SPICEFAN10 promo code
    cy.contains('SPICEFAN10').should('be.visible');
    cy.contains('10% off').should('be.visible');
  });

  it('should copy promo code to clipboard', () => {
    // Complete quiz quickly
    for (let i = 0; i < 8; i++) {
      cy.get('[class*="quiz"]').within(() => {
        cy.get('button').contains(/Himalayan|Kerala|Gluten|Cool|Increases|1-2|Indians|All/).first().click();
      });
      
      if (i < 7) {
        cy.contains('button', 'Next').click();
      }
      cy.wait(300);
    }

    // Click Copy Code button
    cy.contains('button', 'Copy Code').click();
    
    // Verify toast notification
    cy.contains('Promo code copied').should('be.visible');
  });

  it('should allow replay of quiz', () => {
    // Complete quiz
    for (let i = 0; i < 8; i++) {
      cy.get('[class*="quiz"]').within(() => {
        cy.get('button').contains(/button/i).first().click();
      });
      
      if (i < 7) {
        cy.contains('button', 'Next').click();
      }
      cy.wait(300);
    }

    // Click Play Again
    cy.contains('button', 'Play Again').click();
    
    // Verify back to question 1
    cy.contains('Which of our spices gives biryani').should('be.visible');
  });

  it('should display progress bar and stats', () => {
    // Answer all questions
    for (let i = 0; i < 8; i++) {
      cy.get('[class*="quiz"]').within(() => {
        cy.get('button').first().click();
      });
      
      if (i < 7) {
        cy.contains('button', 'Next').click();
      }
      cy.wait(300);
    }

    // Check for progress bar
    cy.get('[class*="progress"]').should('exist');
    
    // Check for stats
    cy.contains(/\d+ Correct/).should('be.visible');
    cy.contains(/\d+ Wrong/).should('be.visible');
    cy.contains(/Points Earned/).should('be.visible');
  });

  it('should apply promo code in checkout', () => {
    // Complete quiz to get promo code
    for (let i = 0; i < 8; i++) {
      cy.get('[class*="quiz"]').within(() => {
        cy.get('button').contains(/Himalayan|Kerala|Gluten|Cool|Increases|1-2|Indians|All/).first().click();
      });
      
      if (i < 7) {
        cy.contains('button', 'Next').click();
      }
      cy.wait(300);
    }

    // Get the promo code text
    cy.contains(/QUIZMASTER15|SPICEFAN10/).then(($el: JQuery<HTMLElement>) => {
      const promoCode = $el && $el.length > 0 ? $el.text().trim() : '';
      
      // Add product to cart
      cy.visit('/');
      cy.get('.product-card').first().within(() => {
        cy.contains('button', /Add to Cart/i).click({ force: true });
      });
      cy.wait(1000);
      
      // Go to checkout
      cy.get('[href*="checkout"], [href="#/checkout"]').first().click({ force: true });
      cy.wait(1000);
      
      // Apply promo code
      cy.get('input[placeholder*="promo" i], input[placeholder*="code" i]')
        .clear()
        .type(promoCode);
      
      cy.get('button').contains(/apply/i).click();
      
      // Verify discount applied
      cy.contains(/Promo code applied|discount/i).should('be.visible');
    });
  });
});
