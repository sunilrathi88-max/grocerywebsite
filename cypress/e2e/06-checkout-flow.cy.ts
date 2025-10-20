/// <reference types="cypress" />

/**
 * Tattva Co. - Complete Checkout Flow Test
 * Tests end-to-end purchase journey with promo codes
 */

describe('Complete Checkout Flow', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should add product to cart and navigate to checkout', () => {
    // Add product using custom command
    cy.addProductToCart();
    
    // Navigate to checkout
    cy.get('[href*="checkout"], [href="#/checkout"]').first().click({ force: true });
    cy.wait(1000);
    
    // Verify on checkout page
    cy.url().should('include', 'checkout');
    cy.contains(/checkout|order summary|payment/i).should('be.visible');
  });

  it('should display cart items in checkout', () => {
    // Add multiple products
    cy.get('.product-card').first().within(() => {
      cy.contains('button', /add to cart/i).click({ force: true });
    });
    cy.wait(500);
    
    cy.get('.product-card').eq(1).within(() => {
      cy.contains('button', /add to cart/i).click({ force: true });
    });
    cy.wait(500);
    
    // Go to checkout
    cy.get('[href*="checkout"]').first().click({ force: true });
    cy.wait(1000);
    
    // Should show cart items
    cy.get('[class*="cart"], [class*="item"]').should('have.length.greaterThan', 0);
  });

  it('should calculate subtotal correctly', () => {
    // Add product
    cy.addProductToCart();
    
    // Go to checkout
    cy.get('[href*="checkout"]').first().click({ force: true });
    cy.wait(1000);
    
    // Check for price display
    cy.contains(/subtotal|total|₹/i).should('be.visible');
  });

  it('should apply QUIZMASTER15 promo code (15% off)', () => {
    // Add product to cart
    cy.addProductToCart();
    
    // Navigate to checkout
    cy.get('[href*="checkout"]').first().click({ force: true });
    cy.wait(1000);
    
    // Apply promo code using custom command
    cy.applyPromoCode('QUIZMASTER15');
    
    // Verify discount applied
    cy.contains(/discount|15%|promo applied/i, { timeout: 5000 }).should('be.visible');
  });

  it('should apply SPICEFAN10 promo code (10% off)', () => {
    cy.addProductToCart();
    
    cy.get('[href*="checkout"]').first().click({ force: true });
    cy.wait(1000);
    
    cy.applyPromoCode('SPICEFAN10');
    
    cy.contains(/discount|10%|promo applied/i, { timeout: 5000 }).should('be.visible');
  });

  it('should validate promo code and show error for invalid codes', () => {
    cy.addProductToCart();
    
    cy.get('[href*="checkout"]').first().click({ force: true });
    cy.wait(1000);
    
    // Try invalid code
    cy.applyPromoCode('INVALID123');
    
    // Should show error
    cy.contains(/invalid|not valid|incorrect/i, { timeout: 5000 }).should('be.visible');
  });

  it('should calculate final price with discount', () => {
    cy.addProductToCart();
    
    cy.get('[href*="checkout"]').first().click({ force: true });
    cy.wait(1000);
    
    // Get original price
    cy.contains(/subtotal|₹/i).invoke('text').then((subtotalText) => {
      const subtotal = parseFloat(subtotalText.replace(/[^\d.]/g, ''));
      
      // Apply discount
      cy.applyPromoCode('QUIZMASTER15');
      cy.wait(1000);
      
      // Get discounted price
      cy.contains(/total|₹/i).invoke('text').then((totalText) => {
        const total = parseFloat(totalText.replace(/[^\d.]/g, ''));
        
        // Should be 15% less
        const expectedTotal = subtotal * 0.85;
        expect(total).to.be.closeTo(expectedTotal, 5);
      });
    });
  });

  it('should fill in customer information', () => {
    cy.addProductToCart();
    
    cy.get('[href*="checkout"]').first().click({ force: true });
    cy.wait(1000);
    
    // Fill form fields
    cy.get('input[name*="name"], input[placeholder*="name" i]').first().type('John Doe');
    cy.get('input[name*="email"], input[placeholder*="email" i]').first().type('john@example.com');
    cy.get('input[name*="phone"], input[placeholder*="phone" i]').first().type('9876543210');
    cy.get('input[name*="address"], textarea[name*="address"]').first().type('123 Test Street, Mumbai');
    
    // Verify entered
    cy.get('input[name*="name"]').should('have.value', 'John Doe');
  });

  it('should validate required fields', () => {
    cy.addProductToCart();
    
    cy.get('[href*="checkout"]').first().click({ force: true });
    cy.wait(1000);
    
    // Try to submit without filling
    cy.contains('button', /place order|confirm|checkout/i).click({ force: true });
    
    // Should show validation errors
    cy.contains(/required|please fill/i).should('be.visible');
  });

  it('should select payment method', () => {
    cy.addProductToCart();
    
    cy.get('[href*="checkout"]').first().click({ force: true });
    cy.wait(1000);
    
    // Look for payment method options
    cy.get('input[type="radio"], [role="radio"]').first().check({ force: true });
  });

  it('should complete full checkout flow', () => {
    // Add product
    cy.addProductToCart();
    
    // Go to checkout
    cy.get('[href*="checkout"]').first().click({ force: true });
    cy.wait(1000);
    
    // Apply promo code
    cy.applyPromoCode('QUIZMASTER15');
    cy.wait(500);
    
    // Fill customer info
    cy.get('input[name*="name"], input[placeholder*="name" i]').first().type('Jane Smith');
    cy.get('input[name*="email"], input[placeholder*="email" i]').first().type('jane@example.com');
    cy.get('input[name*="phone"], input[placeholder*="phone" i]').first().type('9876543210');
    cy.get('input[name*="address"], textarea').first().type('456 Test Road, Delhi');
    
    // Place order
    cy.contains('button', /place order|confirm|submit/i).click({ force: true });
    cy.wait(2000);
    
    // Verify order confirmation
    cy.contains(/success|confirmed|thank you/i, { timeout: 10000 }).should('be.visible');
  });

  it('should update cart quantity in checkout', () => {
    cy.addProductToCart();
    
    cy.get('[href*="checkout"]').first().click({ force: true });
    cy.wait(1000);
    
    // Look for quantity controls
    cy.get('button, input[type="number"]').then(($controls) => {
      if ($controls.length > 0) {
        // Try to increase quantity
        cy.get('button').contains('+').first().click({ force: true });
        cy.wait(500);
        
        // Price should update
        cy.contains(/₹|total/i).should('be.visible');
      }
    });
  });

  it('should remove item from cart in checkout', () => {
    cy.addProductToCart();
    
    cy.get('[href*="checkout"]').first().click({ force: true });
    cy.wait(1000);
    
    // Look for remove button
    cy.get('button').contains(/remove|delete|✕/i).first().click({ force: true });
    cy.wait(500);
    
    // Cart should be empty or show message
    cy.contains(/empty|no items/i).should('be.visible');
  });

  it('should save customer info to localStorage', () => {
    cy.addProductToCart();
    
    cy.get('[href*="checkout"]').first().click({ force: true });
    cy.wait(1000);
    
    // Fill info
    cy.get('input[name*="name"]').first().type('Test User');
    
    cy.window().then((win) => {
      // Check if data is saved
      const savedData = win.localStorage.getItem('checkoutInfo');
      expect(savedData).to.exist;
    });
  });

  it('should show order summary before confirmation', () => {
    cy.addProductToCart();
    
    cy.get('[href*="checkout"]').first().click({ force: true });
    cy.wait(1000);
    
    // Should display summary
    cy.contains(/summary|items|subtotal/i).should('be.visible');
  });

  it('should handle empty cart gracefully', () => {
    cy.visit('/');
    
    // Go directly to checkout without adding items
    cy.get('[href*="checkout"]').first().click({ force: true });
    cy.wait(1000);
    
    // Should show empty cart message
    cy.contains(/empty|no items|add products/i).should('be.visible');
  });
});
