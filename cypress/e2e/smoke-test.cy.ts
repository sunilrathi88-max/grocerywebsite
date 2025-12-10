describe('Smoke Test - Route Verification', () => {
  const routes = [
    { path: '/', confirmSelector: 'nav' }, // Home
    { path: '#/offers', confirmText: 'Special Offers' },
    // Recipes might be lazy loaded or have different title
    { path: '#/recipes', confirmSelector: '.grid' },
    { path: '#/blog', confirmSelector: 'article' },
    { path: '#/about', confirmText: 'About' },
    { path: '#/contact', confirmText: 'Contact' },
    { path: '#/faqs', confirmText: 'Questions' },
    // Legal pages
    { path: '#/privacy-policy', confirmText: 'Privacy' },
  ];

  routes.forEach((route) => {
    it(`should successfully load ${route.path}`, () => {
      cy.visit(`http://localhost:5173/${route.path}`);
      if (route.confirmText) {
        cy.contains(route.confirmText, { timeout: 15000 }).should('be.visible');
      }
      if (route.confirmSelector) {
        cy.get(route.confirmSelector, { timeout: 15000 }).should('exist');
      }
    });
  });

  it('should navigate to products from home', () => {
    cy.visit('http://localhost:5173/');
    // Products link might be 'Shop Now' or nav item scrolling to #products-section
    cy.get('a[href*="products"]').first().click({ force: true });
    // Just verify we don't crash and elements exist
    cy.get('.product-card').should('exist');
  });
});
