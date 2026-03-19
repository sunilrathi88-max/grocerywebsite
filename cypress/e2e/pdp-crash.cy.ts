describe('Product Detail Page Stability', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should navigate to PDP when product card is clicked', () => {
    // Wait for products to load
    cy.get('a[href*="/product/"]').first().click();

    // Check if URL changed
    cy.url().should('include', '/product/');

    // Check if vital elements are present
    cy.get('h1').should('be.visible'); // Product Title
    cy.get('button').contains('Add to Cart').should('be.visible');
  });

  it('should load a specific product page directly without crashing', () => {
    // Assuming product ID 1 exists (Turmeric usually)
    cy.visit('/product/1');
    cy.get('h1').should('be.visible');
    cy.contains('Add to Cart').should('be.visible');
  });
});
