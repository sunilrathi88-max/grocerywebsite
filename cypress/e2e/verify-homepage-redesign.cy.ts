describe('Homepage Redesign Verification', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173');
  });

  it('should display the new Header with Announcement Bar', () => {
    // Announcement Bar
    cy.contains('Free shipping on all orders over ₹999', { timeout: 10000 }).should('be.visible');

    // Logo
    cy.contains('Tattva Co.').should('be.visible');

    // Navigation (Desktop)
    cy.get('nav').within(() => {
      cy.contains('Home').should('be.visible');
      cy.contains('Products').should('be.visible');
      cy.contains('Offers').should('be.visible');
      cy.contains('Recipes').should('be.visible');
      cy.contains('Blog').should('be.visible');
      cy.contains('Contact').should('be.visible');
    });

    // Icons
    cy.get('button').find('svg').should('have.length.at.least', 3); // Search, Wishlist, Cart
  });

  it('should display the Split Hero Section', () => {
    cy.contains("WORLD'S FINEST GRADE A").should('be.visible');
    cy.get('h1').should('not.be.empty'); // Hero Title
    cy.contains('Shop Now').should('be.visible');
    // Check for image or fallback
    cy.get('section').find('img').should('exist');
  });

  it('should display the Why Choose Us section', () => {
    cy.contains('Why Choose Our Spices').scrollIntoView().should('be.visible');
    cy.contains('Sourced from Best Regions').should('be.visible');
    cy.contains('Lab-Tested Purity').should('be.visible');
    cy.contains('Sealed for Freshness').should('be.visible');
  });

  it('should display Featured Products with Filter Chips', () => {
    cy.contains('Featured Products').scrollIntoView().should('be.visible');

    // Check Filter Chips
    cy.contains('button', 'All').should('be.visible');
    cy.contains('button', 'Spices').should('be.visible');
    cy.contains('button', 'Nuts').should('be.visible');

    // Check Grid
    cy.get('.product-card').should('have.length.gt', 0);
  });

  it('should display Testimonials Carousel', () => {
    cy.contains('What Our Customers Say').scrollIntoView().should('be.visible');
    cy.get('.slick-slider').should('exist'); // Slick carousel class
  });
});
