describe('Mega Menu Navigation', () => {
  beforeEach(() => {
    cy.visit('/');
    // Wait for hydration
    cy.get('nav').should('be.visible');
  });

  it('should open Mega Menu on hover over "Shop"', () => {
    // Determine if we are on desktop
    cy.viewport(1280, 720);

    // Trigger hover
    cy.contains('nav a, nav button', 'Shop').trigger('mouseover');

    // Check if menu opens
    cy.get('[role="menu"]').should('be.visible');

    // Check for the 3 columns + featured
    cy.contains('Shop by Intent').should('be.visible');
    cy.contains('Shop by Needs').should('be.visible');
    cy.contains('Shop by Category').should('be.visible');
    cy.contains('Featured Collection').should('be.visible');
  });

  it('should display correct items in "Shop by Intent"', () => {
    cy.viewport(1280, 720);
    cy.contains('nav a, nav button', 'Shop').trigger('mouseover');

    cy.contains('Making Dal?').should('be.visible');
    cy.contains('Making Chai?').should('be.visible');
    cy.contains('Making Curry?').should('be.visible');
  });

  it('should navigate to category when clicked', () => {
    cy.viewport(1280, 720);
    cy.contains('nav a, nav button', 'Shop').trigger('mouseover');

    // Click on an item
    cy.contains('Making Dal?').click();

    // Should navigate to category (or search results, depending on implementation)
    // The current implementation navigates to /category/:id or similar
    // Check URL or Page Title
    cy.url().should('include', 'Dal'); // ID is "Dal Essentials"
  });
});
