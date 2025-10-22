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
      'Himalayan Saffron', // Q1
      'Kerala', // Q2
      'Gluten-Free', // Q3
      'Cool, dry, and dark place', // Q4
      'Increases cholesterol', // Q5
      '1-2 years', // Q6
      'Indians', // Q7
      'All of the above', // Q8
    ];

    // Answer each question
    correctAnswers.forEach((answer, index) => {
      // Click the answer
      cy.contains('button', answer).click();

      // Wait for feedback animation to complete (motion.div has 0.2s delay)
      cy.wait(600);

      if (index < correctAnswers.length - 1) {
        // Click "Next Question" button - wait for it to be visible first
        cy.contains('button', 'Next Question').should('be.visible').click();
        cy.wait(500);
      } else {
        // Click "Finish Quiz" button for last question
        cy.contains('button', 'Finish Quiz').should('be.visible').click();
        cy.wait(1000);
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
      'Himalayan Saffron', // Correct
      'Kerala', // Correct
      'Premium', // Wrong (should be Gluten-Free)
      'Cool, dry, and dark place', // Correct
      'Increases cholesterol', // Correct
      '1-2 years', // Correct
      'Indians', // Correct
      'All of the above', // Correct
    ];

    answers.forEach((answer, index) => {
      // Click the answer
      cy.contains('button', answer).click();

      // Wait for feedback animation to complete (motion.div has 0.2s delay)
      cy.wait(600);

      if (index < answers.length - 1) {
        // Click "Next Question" button - wait for it to be visible first
        cy.contains('button', 'Next Question').should('be.visible').click();
        cy.wait(500);
      } else {
        // Click "Finish Quiz" button for last question
        cy.contains('button', 'Finish Quiz').should('be.visible').click();
        cy.wait(1000);
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
    // Complete quiz quickly with correct answers
    const correctAnswers = [
      'Himalayan Saffron',
      'Kerala',
      'Gluten-Free',
      'Cool, dry, and dark place',
      'Increases cholesterol',
      '1-2 years',
      'Indians',
      'All of the above',
    ];

    correctAnswers.forEach((answer, index) => {
      cy.contains('button', answer).click();
      cy.wait(600);

      if (index < correctAnswers.length - 1) {
        cy.contains('button', 'Next Question').should('be.visible').click();
        cy.wait(500);
      } else {
        cy.contains('button', 'Finish Quiz').should('be.visible').click();
        cy.wait(1000);
      }
    });

    // Wait for results screen
    cy.contains('Quiz Completed!').should('be.visible');

    // Click Copy Code button
    cy.contains('button', 'Copy Code').click();

    // Verify toast notification
    cy.contains('Promo code copied').should('be.visible');
  });

  it('should allow replay of quiz', () => {
    // Complete quiz with correct answers
    const correctAnswers = [
      'Himalayan Saffron',
      'Kerala',
      'Gluten-Free',
      'Cool, dry, and dark place',
      'Increases cholesterol',
      '1-2 years',
      'Indians',
      'All of the above',
    ];

    correctAnswers.forEach((answer, index) => {
      cy.contains('button', answer).click();
      cy.wait(600);

      if (index < correctAnswers.length - 1) {
        cy.contains('button', 'Next Question').should('be.visible').click();
        cy.wait(500);
      } else {
        cy.contains('button', 'Finish Quiz').should('be.visible').click();
        cy.wait(1000);
      }
    });

    // Wait for results
    cy.contains('Quiz Completed!').should('be.visible');

    // Click Play Again
    cy.contains('button', 'Play Again').click();

    // Verify back to question 1
    cy.contains('Which of our spices gives biryani').should('be.visible');
  });

  it('should display progress bar and stats', () => {
    // Answer all questions with correct answers
    const correctAnswers = [
      'Himalayan Saffron',
      'Kerala',
      'Gluten-Free',
      'Cool, dry, and dark place',
      'Increases cholesterol',
      '1-2 years',
      'Indians',
      'All of the above',
    ];

    correctAnswers.forEach((answer, index) => {
      cy.contains('button', answer).click();
      cy.wait(600);

      if (index < correctAnswers.length - 1) {
        cy.contains('button', 'Next Question').should('be.visible').click();
        cy.wait(500);
      } else {
        cy.contains('button', 'Finish Quiz').should('be.visible').click();
        cy.wait(1000);
      }
    });

    // Verify results screen with stats
    cy.contains('Quiz Completed!').should('be.visible');
    cy.contains('8 / 8').should('be.visible'); // Score display
    cy.contains('Perfect Score!').should('be.visible');
  });

  it('should apply promo code in checkout', () => {
    // Complete quiz to get QUIZMASTER15 promo code
    const correctAnswers = [
      'Himalayan Saffron',
      'Kerala',
      'Gluten-Free',
      'Cool, dry, and dark place',
      'Increases cholesterol',
      '1-2 years',
      'Indians',
      'All of the above',
    ];

    correctAnswers.forEach((answer, index) => {
      cy.contains('button', answer).click();
      cy.wait(600);

      if (index < correctAnswers.length - 1) {
        cy.contains('button', 'Next Question').should('be.visible').click();
        cy.wait(500);
      } else {
        cy.contains('button', 'Finish Quiz').should('be.visible').click();
        cy.wait(1000);
      }
    });

    // Verify promo code is displayed
    cy.contains('QUIZMASTER15').should('be.visible');

    // Store the promo code
    const promoCode = 'QUIZMASTER15';

    // Add product to cart
    cy.visit('/');
    cy.wait(1000);

    // Find and click Add to Cart button
    cy.get('button')
      .contains(/Add to Cart/i)
      .first()
      .click();
    cy.wait(1000);

    // Go to cart
    cy.get('a[href="#/cart"], button').contains(/Cart/i).click();
    cy.wait(1000);

    // Go to checkout
    cy.contains('button', /Proceed to Checkout/i).click();
    cy.wait(1000);

    // Apply promo code using the custom command
    cy.applyPromoCode(promoCode);

    // Verify discount applied
    cy.contains('15% off').should('be.visible');
  });
});
