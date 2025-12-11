describe('Mobile Interaction Experience', () => {
    beforeEach(() => {
        // Set viewport to iPhone X dimensions
        cy.viewport('iphone-x');
        cy.visit('/');
    });

    it('should display accordions instead of tabs on mobile', () => {
        // Open Product Modal
        cy.get('[data-testid="product-card"]').first().click();
        cy.get('.fixed.inset-0').should('be.visible');

        // Tabs should be hidden
        cy.get('[aria-label="Tabs"]').should('not.be.visible');

        // Accordion headers should be visible
        cy.contains('button', 'Description').should('be.visible');
        cy.contains('button', 'Reviews').should('be.visible');

        // Open Reviews Accordion
        cy.contains('button', 'Reviews').click();
        cy.contains('Leave a Review').should('be.visible');
    });

    it('should show sticky add-to-cart bar with quantity controls on scroll', () => {
        // Open Product Modal
        cy.get('[data-testid="product-card"]').first().click();

        // Scroll down to trigger sticky bar (sticky logic uses IntersectionObserver on main button)
        cy.get('.fixed.inset-0 .overflow-y-auto').scrollTo('bottom');

        // Check for sticky bar visibility
        cy.get('.sticky.bottom-0').should('be.visible');

        // Check Quantity Controls exist
        cy.get('.sticky.bottom-0 button[aria-label="Increase quantity"]').should('be.visible');
        cy.get('.sticky.bottom-0 button[aria-label="Decrease quantity"]').should('be.visible');

        // Test Quantity Interaction
        cy.get('.sticky.bottom-0 button[aria-label="Increase quantity"]').click();
        cy.contains('.sticky.bottom-0', '2').should('exist'); // Assuming span shows quantity

        // Test Add to Cart
        cy.contains('.sticky.bottom-0 button', 'Add to Cart').click();
        cy.contains('added to cart').should('be.visible');
    });
});
