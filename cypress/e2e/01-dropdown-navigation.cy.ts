/// <reference types="cypress" />

/**
 * Tattva Co. - Products Dropdown Navigation Test
 * Tests the hover delay fix and category filtering
 */

describe('Products Dropdown Navigation', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display dropdown on hover', () => {
    cy.get('header').within(() => {
      cy.contains('Products').trigger('mouseover');
    });
    
    cy.get('[class*="dropdown"]', { timeout: 5000 })
      .should('be.visible')
      .and('contain.text', 'Spices');
  });

  it('should keep dropdown open when moving mouse into it', () => {
    // Hover over Products button
    cy.get('header').within(() => {
      cy.contains('Products').trigger('mouseover');
    });
    
    // Wait for dropdown to appear
    cy.get('[class*="dropdown"]').should('be.visible');
    
    // Move mouse into dropdown area
    cy.get('[class*="dropdown"]').trigger('mouseover');
    
    // Wait 400ms (more than the 300ms delay)
    cy.wait(400);
    
    // Dropdown should still be visible
    cy.get('[class*="dropdown"]').should('be.visible');
  });

  it('should navigate to category when clicked', () => {
    // Hover and click Spices category
    cy.get('header').within(() => {
      cy.contains('Products').trigger('mouseover');
    });
    
    cy.get('[class*="dropdown"]').within(() => {
      cy.contains('Spices').click();
    });
    
    // Verify URL or page state changed
    cy.url().should('include', '#');
    
    // Verify products are filtered
    cy.get('.product-card').should('have.length.at.least', 1);
  });

  it('should test all categories', () => {
    const categories = ['Spices', 'Nuts', 'Dry Fruits', 'Beverages'];
    
    categories.forEach(category => {
      cy.get('header').within(() => {
        cy.contains('Products').trigger('mouseover');
      });
      
      cy.get('[class*="dropdown"]').within(() => {
        cy.contains(category).should('be.visible');
      });
      
      // Reset for next iteration
      cy.get('body').click(0, 0);
      cy.wait(500);
    });
  });

  it('should close dropdown when clicking outside', () => {
    cy.get('header').within(() => {
      cy.contains('Products').trigger('mouseover');
    });
    
    cy.get('[class*="dropdown"]').should('be.visible');
    
    // Click outside
    cy.get('body').click(0, 0);
    
    // Dropdown should close
    cy.get('[class*="dropdown"]').should('not.be.visible');
  });
});
