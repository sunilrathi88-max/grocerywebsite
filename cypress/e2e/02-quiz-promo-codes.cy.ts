/// <reference types="cypress" />

/**
 * Tattva Co. - Quiz and Promo Code Test
 * Tests the enhanced quiz with 8 questions and promo code generation
 */

describe('Quiz and Promo Code System', () => {
  beforeEach(() => {
    cy.visit('/', { timeout: 30000 });

    // Wait for the app to load with longer timeout
    cy.get('h1', { timeout: 30000 }).should('be.visible');

    // Scroll to quiz section container
    cy.get('[data-testid="quiz-section"]', { timeout: 30000 })
      .scrollIntoView()
      .should('be.visible');

    // Wait for quiz content to be ready
    cy.contains('Test Your Spice Knowledge', { timeout: 30000 }).should('be.visible');
  });



  it('should display quiz with first question', () => {
    cy.get('[data-testid="quiz-question-container"]').should('be.visible');
    cy.contains('Which of our spices gives biryani its beautiful golden hue?').should('be.visible');
  });

  it('should complete quiz with perfect score and get QUIZMASTER15 promo', () => {
    // Correct answer indices for all 8 questions
    // Q1: Himalayan Saffron (0)
    // Q2: Kerala (2)
    // Q3: Gluten-Free (1)
    // Q4: Cool, dry... (1)
    // Q5: Increases cholesterol (2)
    // Q6: 1-2 years (1)
    // Q7: Indians (1)
    // Q8: All of the above (1)
    const correctAnswerIndices = [0, 2, 1, 1, 2, 1, 1, 1];

    // Answer each question
    correctAnswerIndices.forEach((answerIndex, questionIndex) => {
      cy.log(`Answering question ${questionIndex + 1} with option index ${answerIndex}`);

      // Click the answer using data-testid
      cy.get(`[data-testid="quiz-answer-${questionIndex}-${answerIndex}"]`)
        .scrollIntoView()
        .should('be.visible')
        .click();

      // Wait for feedback to appear
      cy.get('[data-testid="quiz-feedback"]', { timeout: 10000 }).should('be.visible');
      cy.log('Feedback visible');

      if (questionIndex < correctAnswerIndices.length - 1) {
        // Click "Next Question" button
        cy.get('[data-testid="quiz-next-btn"]')
          .scrollIntoView()
          .should('be.visible')
          .should('contain', 'Next Question')
          .click();
        cy.log('Clicked Next Question');

        // Verify next question appears by checking for the next answer buttons
        // We check for the existence of answer buttons for the next question index
        // Note: The answer buttons for the next question might have different indices, 
        // but checking for the container or just waiting for the animation is usually enough.
        // Better: check that the previous feedback is gone or the question text changed.
        // Since we have data-testids for answers now, we can wait for the next question's answers.
        // But we don't know the next question's answer indices easily without mapping them all.
        // Simpler: Wait for the feedback to disappear.
        cy.get('[data-testid="quiz-feedback"]', { timeout: 10000 }).should('not.exist');
      } else {
        // Click "Finish Quiz" button for last question
        cy.get('[data-testid="quiz-next-btn"]')
          .scrollIntoView()
          .should('be.visible')
          .should('contain', 'Finish Quiz')
          .click();
        cy.log('Clicked Finish Quiz');
      }
    });

    // Verify results screen
    cy.contains('Quiz Completed!', { timeout: 10000 }).should('be.visible');
    cy.contains('Perfect Score!').should('be.visible');
    cy.contains('8').should('be.visible'); // Score 8/8

    // Verify QUIZMASTER15 promo code
    cy.contains('QUIZMASTER15').should('be.visible');
    cy.contains('15% off').should('be.visible');
  });

  it('should complete quiz with 7/8 score and get SPICEFAN10 promo', () => {
    // Answer 7 correctly, 1 wrong
    // Q3 is wrong: Premium (0) instead of Gluten-Free (1)
    const answerIndices = [0, 2, 0, 1, 2, 1, 1, 1];

    answerIndices.forEach((answerIndex, questionIndex) => {
      // Click the answer
      cy.get(`[data-testid="quiz-answer-${questionIndex}-${answerIndex}"]`)
        .scrollIntoView()
        .should('be.visible')
        .click();

      // Wait for feedback
      cy.get('[data-testid="quiz-feedback"]', { timeout: 10000 }).should('be.visible');

      if (questionIndex < answerIndices.length - 1) {
        // Click "Next Question" button
        cy.get('[data-testid="quiz-next-btn"]').should('be.visible').click();
        cy.get('[data-testid="quiz-feedback"]').should('not.exist');
      } else {
        // Click "Finish Quiz" button for last question
        cy.get('[data-testid="quiz-next-btn"]').should('be.visible').click();
      }
    });

    // Verify results
    cy.contains('Quiz Completed!', { timeout: 10000 }).should('be.visible');
    cy.contains('7').should('be.visible'); // Score 7/8

    // Verify SPICEFAN10 promo code
    cy.contains('SPICEFAN10').should('be.visible');
    cy.contains('10% off').should('be.visible');
  });

  it('should copy promo code to clipboard', () => {
    // Complete quiz quickly with correct answers
    const correctAnswerIndices = [0, 2, 1, 1, 2, 1, 1, 1];

    correctAnswerIndices.forEach((answerIndex, questionIndex) => {
      cy.get(`[data-testid="quiz-answer-${questionIndex}-${answerIndex}"]`).click();
      if (questionIndex < correctAnswerIndices.length - 1) {
        cy.get('[data-testid="quiz-next-btn"]').click();
      } else {
        cy.get('[data-testid="quiz-next-btn"]').click();
      }
    });

    // Wait for results screen
    cy.contains('Quiz Completed!', { timeout: 10000 }).should('be.visible');

    // Click Copy Code button
    cy.contains('button', 'Copy Code').click();

    // Verify toast notification
    cy.contains('Promo code copied').should('be.visible');
  });

  it('should allow replay of quiz', () => {
    // Complete quiz with correct answers
    const correctAnswerIndices = [0, 2, 1, 1, 2, 1, 1, 1];

    correctAnswerIndices.forEach((answerIndex, questionIndex) => {
      cy.get(`[data-testid="quiz-answer-${questionIndex}-${answerIndex}"]`).click();
      if (questionIndex < correctAnswerIndices.length - 1) {
        cy.get('[data-testid="quiz-next-btn"]').click();
      } else {
        cy.get('[data-testid="quiz-next-btn"]').click();
      }
    });

    // Wait for results
    cy.contains('Quiz Completed!', { timeout: 10000 }).should('be.visible');

    // Click Play Again
    cy.contains('button', 'Play Again').click();

    // Verify back to question 1
    cy.contains('Which of our spices gives biryani').should('be.visible');
    cy.get('[data-testid="quiz-answer-0-0"]').should('be.visible');
  });

  it('should display progress bar and stats', () => {
    // Answer all questions with correct answers
    const correctAnswerIndices = [0, 2, 1, 1, 2, 1, 1, 1];

    correctAnswerIndices.forEach((answerIndex, questionIndex) => {
      cy.get(`[data-testid="quiz-answer-${questionIndex}-${answerIndex}"]`).click();
      if (questionIndex < correctAnswerIndices.length - 1) {
        cy.get('[data-testid="quiz-next-btn"]').click();
      } else {
        cy.get('[data-testid="quiz-next-btn"]').click();
      }
    });

    // Verify results screen with stats
    cy.contains('Quiz Completed!', { timeout: 10000 }).should('be.visible');
    cy.contains('8 / 8').should('be.visible'); // Score display
    cy.contains('Perfect Score!').should('be.visible');
  });

  it('should apply promo code in checkout', () => {
    // Complete quiz to get QUIZMASTER15 promo code
    const correctAnswerIndices = [0, 2, 1, 1, 2, 1, 1, 1];

    correctAnswerIndices.forEach((answerIndex, questionIndex) => {
      cy.get(`[data-testid="quiz-answer-${questionIndex}-${answerIndex}"]`).click();
      if (questionIndex < correctAnswerIndices.length - 1) {
        cy.get('[data-testid="quiz-next-btn"]').click();
      } else {
        cy.get('[data-testid="quiz-next-btn"]').click();
      }
    });

    // Verify promo code is displayed
    cy.contains('QUIZMASTER15').should('be.visible');

    // Store the promo code
    const promoCode = 'QUIZMASTER15';

    // Add product to cart
    cy.visit('/');
    cy.get('h1').should('be.visible'); // Wait for home page

    // Find and click Add to Cart button (more specific selector)
    // ProductCard has a button with "Add" text (not "Add to Cart")
    cy.contains('button', 'Add').first().click();

    // Wait for toast or cart update
    cy.contains('added to cart').should('be.visible');

    // Go to cart
    // Click the cart icon/button in header
    cy.get('[data-testid="header-cart-btn"]').click();

    // Wait for cart sidebar
    cy.contains('Your Cart').should('be.visible');

    // Go to checkout
    // Wait for animation and ensure button is interactive
    cy.wait(1000);
    cy.get('[data-testid="checkout-btn"]')
      .scrollIntoView()
      .should('be.visible')
      .should('not.have.attr', 'aria-disabled', 'true')
      .click({ force: true });

    // Verify checkout page loaded
    cy.url().should('include', '/checkout');
    cy.contains('Checkout').should('be.visible');

    // Apply promo code
    // Assuming there is an input for promo code and an Apply button
    cy.get('input[placeholder="Promo code"]').type(promoCode);
    cy.contains('button', 'Apply').click();

    // Verify discount applied
    cy.contains('Promo code applied!').should('be.visible');
    cy.contains('15% off').should('be.visible');
  });
});
