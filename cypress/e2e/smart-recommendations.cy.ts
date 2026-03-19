describe('Smart Recommendations (Cooking Context)', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display the "Cook What You\'re Craving" widget', () => {
    cy.contains("Cook What You're Craving Today").scrollIntoView().should('be.visible');
  });

  it('should show cooking options chips', () => {
    cy.contains("Cook What You're Craving Today").scrollIntoView();
    cy.contains('button', 'Making Dal?').should('be.visible');
    cy.contains('button', 'Making Chai?').should('be.visible');
    cy.contains('button', 'Making Curry?').should('be.visible');
  });

  it('should show product bundle when a chip is selected', () => {
    cy.contains("Cook What You're Craving Today").scrollIntoView();

    // Click "Making Dal?"
    cy.contains('button', 'Making Dal?').click();

    // Check for bundle display
    cy.contains('Complete Dal Tadka Kit').should('be.visible');
    cy.contains('Turmeric Powder').should('be.visible');
    cy.contains('Add Complete Kit to Cart').should('be.visible');
  });

  it('should allow adding the bundle to cart', () => {
    cy.contains("Cook What You're Craving Today").scrollIntoView();
    cy.contains('button', 'Making Dal?').click();

    // Add to cart
    cy.contains('button', 'Add Complete Kit to Cart').click();

    // Verification (toast or cart badge)
    cy.contains('Added Complete Dal Tadka Kit to cart!').should('be.visible');
    // Or check cart count if toast is flaky
    // cy.get('.cart-badge').should('contain', '4'); // Assuming 4 items in dal kit
  });
});
