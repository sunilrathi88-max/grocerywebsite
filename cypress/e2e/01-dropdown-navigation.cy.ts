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
    // Hover over the Products button
    cy.get('header nav')
      .contains('button', 'Products')
      .trigger('mouseover');
    
    // Dropdown menu should appear with categories
    cy.get('header nav div.absolute')
      .should('be.visible')
      .and('contain.text', 'Spices');
  });

  it('should keep dropdown open when moving mouse into it', () => {
    // Hover over Products button
    cy.get('header nav')
      .contains('button', 'Products')
      .trigger('mouseover');
    
    // Wait for dropdown to appear
    cy.get('header nav div.absolute').should('be.visible');
    
    // Move mouse into dropdown area
    cy.get('header nav div.absolute').trigger('mouseover');
    
    // Wait 400ms (more than the 300ms delay)
    cy.wait(400);
    
    // Dropdown should still be visible
    cy.get('header nav div.absolute').should('be.visible');
  });

  it('should navigate to category when clicked', () => {
    // Hover and click Spices category
    cy.get('header nav')
      .contains('button', 'Products')
      .trigger('mouseover');
    
    cy.get('header nav div.absolute').within(() => {
      cy.contains('button', 'Spices').click();
    });
    
    // Wait for navigation and filtering
    cy.wait(1000);
    
    // Verify products section is visible
    cy.get('#products-section').should('be.visible');
  });

  it('should test all categories', () => {
    const categories = ['Spices', 'Nuts', 'Dry Fruits', 'Beverages'];
    
    categories.forEach(category => {
      cy.get('header nav')
        .contains('button', 'Products')
        .trigger('mouseover');
      
      cy.get('header nav div.absolute').within(() => {
        cy.contains('button', category).should('be.visible');
      });
      
      // Reset for next iteration - trigger mouseleave
      cy.get('header nav > div.relative').trigger('mouseleave');
      cy.wait(500);
    });
  });
});
