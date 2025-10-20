/// <reference types="cypress" />
/// <reference types="@percy/cypress" />

/**
 * Tattva Co. - Visual Regression Testing with Percy
 * Tests visual consistency across different pages and states
 */

describe('Visual Regression Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should capture homepage snapshot', () => {
    cy.wait(2000); // Allow page to fully render
    cy.percySnapshot('Homepage - Desktop', {
      widths: [1280, 1920],
    });
  });

  it('should capture homepage on mobile', () => {
    cy.viewport(375, 667);
    cy.wait(2000);
    cy.percySnapshot('Homepage - Mobile', {
      widths: [375],
    });
  });

  it('should capture product grid with filters', () => {
    cy.wait(2000);
    
    // Take snapshot of default view
    cy.percySnapshot('Product Grid - Default');
    
    // Apply category filter
    cy.get('header').within(() => {
      cy.contains('Products').trigger('mouseover');
    });
    
    cy.get('[class*="dropdown"]').within(() => {
      cy.contains('Spices').click();
    });
    
    cy.wait(1000);
    cy.percySnapshot('Product Grid - Spices Category');
  });

  it('should capture product detail modal', () => {
    cy.wait(2000);
    
    // Open product detail
    cy.get('.product-card').first().click();
    cy.wait(1000);
    
    cy.percySnapshot('Product Detail Modal', {
      widths: [1280],
    });
  });

  it('should capture shopping cart', () => {
    // Add product to cart
    cy.get('.product-card').first().within(() => {
      cy.contains('button', /add to cart/i).click({ force: true });
    });
    cy.wait(1000);
    
    // Open cart
    cy.get('[class*="cart"]').first().click({ force: true });
    cy.wait(500);
    
    cy.percySnapshot('Shopping Cart');
  });

  it('should capture checkout page', () => {
    // Add product
    cy.get('.product-card').first().within(() => {
      cy.contains('button', /add to cart/i).click({ force: true });
    });
    cy.wait(1000);
    
    // Navigate to checkout
    cy.get('[href*="checkout"]').first().click({ force: true });
    cy.wait(1000);
    
    cy.percySnapshot('Checkout Page', {
      widths: [1280, 768],
    });
  });

  it('should capture quiz module', () => {
    // Scroll to quiz
    cy.contains('Test Your Spice Knowledge').scrollIntoView();
    cy.wait(1000);
    
    cy.percySnapshot('Quiz Module - Question 1');
    
    // Answer first question
    cy.get('[class*="quiz"]').within(() => {
      cy.get('button').first().click();
    });
    
    cy.contains('button', 'Next').click();
    cy.wait(500);
    
    cy.percySnapshot('Quiz Module - Question 2');
  });

  it('should capture blog page', () => {
    cy.get('a[href*="blog"], a[href="#/blog"]').first().click({ force: true });
    cy.wait(2000);
    
    cy.percySnapshot('Blog Page', {
      widths: [1280, 768, 375],
    });
  });

  it('should capture about page', () => {
    cy.get('a[href*="about"], a[href="#/about"]').first().click({ force: true });
    cy.wait(2000);
    
    cy.percySnapshot('About Page');
  });

  it('should capture contact page', () => {
    cy.get('a[href*="contact"], a[href="#/contact"]').first().click({ force: true });
    cy.wait(2000);
    
    cy.percySnapshot('Contact Page');
  });

  it('should capture different themes/states', () => {
    cy.wait(2000);
    
    // Capture with social proof notification
    cy.waitForSocialProofNotification();
    cy.percySnapshot('Homepage - With Social Proof Notification');
    
    // Capture with mobile menu open
    cy.viewport(375, 667);
    cy.get('[class*="mobile"]').click();
    cy.wait(500);
    cy.percySnapshot('Mobile Menu - Open');
  });

  it('should capture hover states', () => {
    cy.wait(2000);
    
    // Product card hover
    cy.get('.product-card').first().trigger('mouseover');
    cy.wait(300);
    cy.percySnapshot('Product Card - Hover State');
    
    // Dropdown hover
    cy.get('header').within(() => {
      cy.contains('Products').trigger('mouseover');
    });
    cy.wait(400);
    cy.percySnapshot('Products Dropdown - Open');
  });

  it('should capture form states', () => {
    // Navigate to checkout
    cy.get('.product-card').first().within(() => {
      cy.contains('button', /add to cart/i).click({ force: true });
    });
    cy.wait(1000);
    
    cy.get('[href*="checkout"]').first().click({ force: true });
    cy.wait(1000);
    
    // Empty form
    cy.percySnapshot('Checkout Form - Empty');
    
    // Filled form
    cy.get('input[name*="name"]').first().type('John Doe');
    cy.get('input[name*="email"]').first().type('john@example.com');
    cy.wait(500);
    cy.percySnapshot('Checkout Form - Filled');
  });

  it('should capture responsive breakpoints', () => {
    const breakpoints = [
      { width: 375, name: 'Mobile' },
      { width: 768, name: 'Tablet' },
      { width: 1024, name: 'Desktop Small' },
      { width: 1440, name: 'Desktop Large' },
      { width: 1920, name: 'Desktop XL' },
    ];

    breakpoints.forEach(({ width, name }) => {
      cy.viewport(width, 800);
      cy.wait(1000);
      cy.percySnapshot(`Homepage - ${name} (${width}px)`);
    });
  });
});
