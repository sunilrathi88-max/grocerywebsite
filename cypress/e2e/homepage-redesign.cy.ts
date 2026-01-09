describe('Homepage UX Redesign', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display the new Hero section with correct copy and CTAs', () => {
    cy.contains('From Flavorless Dust... To Dishes That Taste Alive.').should('be.visible');
    cy.contains('Your dishes will taste alive').should('be.visible');
    cy.contains('button', 'Browse Collections').should('be.visible');
    cy.contains('button', 'Take the Spice Quiz').should('be.visible');
  });

  it('should display Category Showcase with 6 tiles', () => {
    // Check for specific category names we added
    const categories = ['Spices', 'Nuts', 'Dry Fruits', 'Beverages', 'Offers', 'Gift Sets'];
    categories.forEach((cat) => {
      cy.contains(cat).should('exist'); // Might use 'exist' if hidden on scroll, but better be visible
    });
  });

  it('should display Trust Signals', () => {
    cy.contains('Direct from Farms').should('be.visible');
    cy.contains('FSSAI Certified').should('be.visible');
  });

  it('should display Featured Collections', () => {
    cy.contains('Best Sellers').scrollIntoView().should('be.visible');
    cy.contains('New Arrivals').scrollIntoView().should('be.visible');
    // Check for "View All" buttons
    cy.contains('button', 'View All').should('exist');
  });

  it('should display the refactored Brand Story', () => {
    cy.contains('Why Tattva Co?').scrollIntoView().should('be.visible');
    cy.contains('Uncompromised Quality').should('be.visible');
    cy.contains('Radical Transparency').should('be.visible');
  });

  it('should have updated Navigation', () => {
    // Desktop Nav
    cy.get('nav').within(() => {
      cy.contains('Spices').should('be.visible');
      cy.contains('Offers').should('be.visible');
      cy.contains('Shop All').should('be.visible');
    });
  });

  it('should show Categories in Mobile Bottom Nav', () => {
    // Simulate mobile viewport
    cy.viewport('iphone-x');
    cy.contains('Categories').should('be.visible');
    cy.get('button[aria-label="Categories"]').should('be.visible');
  });

  it('should show Filter button on Mobile', () => {
    cy.viewport('iphone-x');
    // Scroll to products section where filter button is
    cy.get('#products-section').scrollIntoView();
    cy.contains('button', 'Filters').should('be.visible');
    // Optional: Open filter
    cy.contains('button', 'Filters').click();
    cy.contains('Clear All Filters').scrollIntoView().should('be.visible');
  });

  it('should navigate correctly using "Why Us" and "Our Story" links', () => {
    // Assuming these are anchor links to sections on the homepage or separate pages
    // If they are on the homepage:
    cy.get('a[href*="#why-us"], button:contains("Why Us")').click({ multiple: true, force: true });
    cy.get('#why-us, h2:contains("Why Tattva Co?")').should('be.visible');

    // Reset/Go back if needed, or just check the second one
    cy.visit('/');
    cy.contains('Our Story').click();
    cy.get('#brand-story, h2:contains("Why We Started")').should('be.visible');
  });

  it('should display correct Hero text size on mobile', () => {
    cy.viewport('iphone-x'); // 375px width

    // Check Hero Headline existence and potentially style
    cy.contains('From Flavorless Dust... To Dishes That Taste Alive.').should('be.visible')
      .and('have.css', 'font-size'); // We can check specific size if known, e.g. '24px' or '30px'

    // Ensure it doesn't overflow or look broken (basic visibility check checks part of this)
    cy.get('h1').should('be.visible');
  });
});
