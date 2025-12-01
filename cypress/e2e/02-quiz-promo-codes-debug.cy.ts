/// <reference types="cypress" />

/**
 * Debug test for quiz feedback element
 */

describe('Quiz Feedback Debug', () => {
    beforeEach(() => {
        cy.visit('/', { timeout: 30000 });
        cy.get('h1', { timeout: 30000 }).should('be.visible');
        cy.get('[data-testid="quiz-section"]', { timeout: 30000 })
            .scrollIntoView()
            .should('be.visible');
        cy.contains('Test Your Spice Knowledge', { timeout: 30000 }).should('be.visible');
    });

    it('should show feedback after answering a question', () => {
        // Find the first question
        cy.contains('Which of our spices gives biryani').should('be.visible');

        // Click the correct answer
        cy.contains('button', 'Himalayan Saffron').should('be.visible').click({ force: true });

        // Wait a moment for React to update
        cy.wait(1000);

        // Take a screenshot to see what the page looks like
        cy.screenshot('after-answer-click');

        // Try to find the feedback div in multiple ways
        cy.log('Looking for feedback with data-testid...');
        cy.get('body').then(($body) => {
            const feedbackElement = $body.find('[data-testid="quiz-feedback"]');
            cy.log(`Found ${feedbackElement.length} elements with data-testid="quiz-feedback"`);
        });

        cy.log('Looking for feedback with bg-brand-accent class...');
        cy.get('body').then(($body) => {
            const feedbackElement = $body.find('.bg-brand-accent');
            cy.log(`Found ${feedbackElement.length} elements with bg-brand-accent class`);
        });

        // Check if any buttons contain "Next Question"
        cy.log('Looking for Next Question button...');
        cy.get('body').then(($body) => {
            const nextButton = $body.find('button:contains("Next Question")');
            cy.log(`Found ${nextButton.length} Next Question buttons`);
        });

        // Log the entire HTML to see what's there
        cy.get('[data-testid="quiz-section"]').then(($section) => {
            cy.log('Quiz section HTML:', $section.html());
        });
    });
});
