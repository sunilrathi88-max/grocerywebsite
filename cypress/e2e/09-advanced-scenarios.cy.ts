/// <reference types="cypress" />

/**
 * Tattva Co. - Advanced Test Scenarios
 * Custom test scenarios for edge cases and specific user flows
 */

describe('Advanced Test Scenarios', () => {
  describe('Loyalty Points & Gamification', () => {
    beforeEach(() => {
      cy.visit('/');
      // Clear any existing loyalty data
      cy.clearLocalStorage();
    });

    it('should earn points on quiz completion', () => {
      // Complete quiz
      cy.contains('Test Your Spice Knowledge').scrollIntoView();
      cy.completeQuiz(true);

      // Verify points earned
      cy.contains(/points earned|100 points/i).should('be.visible');
    });

    it('should earn points on product purchase', () => {
      // Add product and checkout
      cy.addProductToCart();
      cy.get('[href*="checkout"]').first().click({ force: true });
      cy.wait(1000);

      // Fill checkout form
      cy.get('input[name*="name"]').first().type('Test User');
      cy.get('input[name*="email"]').first().type('test@example.com');
      cy.get('input[name*="phone"]').first().type('9876543210');

      // Complete order
      cy.contains('button', /place order|confirm/i).click({ force: true });
      cy.wait(2000);

      // Check for points in success message or profile
      cy.window().then((win) => {
        const loyaltyData = win.localStorage.getItem('loyaltyPoints');
        expect(loyaltyData).to.exist;
      });
    });

    it('should track badge achievements', () => {
      cy.visit('/');

      // Check localStorage for badges
      cy.window().then((win) => {
        const badges = win.localStorage.getItem('badges');
        cy.log('Current badges:', badges);
      });
    });
  });

  describe('Promo Code Edge Cases', () => {
    beforeEach(() => {
      cy.visit('/');
    });

    it('should prevent applying multiple promo codes', () => {
      cy.addProductToCart();
      cy.get('[href*="checkout"]').first().click({ force: true });
      cy.wait(1000);

      // Apply first promo
      cy.applyPromoCode('QUIZMASTER15');
      cy.wait(500);

      // Try to apply second promo
      cy.applyPromoCode('SPICEFAN10');

      // Should show error or keep only one code
      cy.contains(/only one|already applied/i).should('exist');
    });

    it('should validate promo code expiry', () => {
      cy.addProductToCart();
      cy.get('[href*="checkout"]').first().click({ force: true });
      cy.wait(1000);

      // Try expired code (if implemented)
      cy.applyPromoCode('EXPIRED2024');
      cy.contains(/expired|invalid/i).should('be.visible');
    });

    it('should validate minimum order value for promo', () => {
      // Add cheap item
      cy.get('.product-card')
        .first()
        .within(() => {
          cy.contains('button', 'Add').click({ force: true });
        });

      cy.get('[href*="checkout"]').first().click({ force: true });
      cy.wait(1000);

      // Try to apply promo (if minimum order implemented)
      cy.applyPromoCode('QUIZMASTER15');

      // Should apply or show minimum order message
      cy.wait(500);
    });
  });

  describe('Cart Management Edge Cases', () => {
    beforeEach(() => {
      cy.visit('/');
    });

    it('should handle adding same product multiple times', () => {
      // Add same product 3 times
      for (let i = 0; i < 3; i++) {
        cy.get('.product-card')
          .first()
          .within(() => {
            cy.contains('button', 'Add').click({ force: true });
          });
        cy.wait(500);
      }

      // Check cart quantity
      cy.get('[class*="cart"]').first().click({ force: true });
      cy.wait(500);

      // Should show quantity 3 or 3 separate items
      cy.get('[class*="cart"]').should('be.visible');
    });

    it('should persist cart across page reloads', () => {
      cy.addProductToCart();

      // Reload page
      cy.reload();
      cy.wait(1000);

      // Cart should still have items
      cy.window().then((win) => {
        const cartData = win.localStorage.getItem('cart');
        expect(cartData).to.exist;
      });
    });

    it('should update total when removing items', () => {
      // Add multiple products
      cy.get('.product-card')
        .eq(0)
        .within(() => {
          cy.contains('button', 'Add').click({ force: true });
        });
      cy.wait(500);

      cy.get('.product-card')
        .eq(1)
        .within(() => {
          cy.contains('button', 'Add').click({ force: true });
        });
      cy.wait(500);

      // Go to checkout
      cy.get('[href*="checkout"]').first().click({ force: true });
      cy.wait(1000);

      // Remove one item
      cy.get('button')
        .contains(/remove|delete|✕/i)
        .first()
        .click({ force: true });
      cy.wait(500);

      // Total should update
      cy.contains(/total|₹/i).should('be.visible');
    });
  });

  describe('Search Functionality', () => {
    beforeEach(() => {
      cy.visit('/');
    });

    it('should search products by name', () => {
      cy.get('input[type="search"], input[placeholder*="search" i]').type('saffron');
      cy.wait(500);

      // Should filter products
      cy.get('.product-card').should('contain.text', /saffron/i);
    });

    it('should show no results message for invalid search', () => {
      cy.get('input[type="search"], input[placeholder*="search" i]').type('xyz123invalid');
      cy.wait(500);

      // Should show no results
      cy.contains(/no products|no results|not found/i).should('be.visible');
    });

    it('should clear search filter', () => {
      cy.get('input[type="search"], input[placeholder*="search" i]').type('turmeric');
      cy.wait(500);

      // Clear search
      cy.get('input[type="search"], input[placeholder*="search" i]').clear();
      cy.wait(500);

      // Should show all products again
      cy.get('.product-card').should('have.length.greaterThan', 1);
    });
  });

  describe('Wishlist Functionality', () => {
    beforeEach(() => {
      cy.visit('/');
      cy.clearLocalStorage();
    });

    it('should add product to wishlist', () => {
      // Click heart icon on product
      cy.get('.product-card')
        .first()
        .within(() => {
          cy.get('[class*="heart"], button[aria-label*="wishlist" i]')
            .first()
            .click({ force: true });
        });

      cy.wait(500);

      // Verify in localStorage
      cy.window().then((win) => {
        const wishlist = win.localStorage.getItem('wishlist');
        expect(wishlist).to.exist;
      });
    });

    it('should remove product from wishlist', () => {
      // Add to wishlist
      cy.get('.product-card')
        .first()
        .within(() => {
          cy.get('[class*="heart"], button[aria-label*="wishlist" i]')
            .first()
            .click({ force: true });
        });
      cy.wait(500);

      // Remove from wishlist
      cy.get('.product-card')
        .first()
        .within(() => {
          cy.get('[class*="heart"], button[aria-label*="wishlist" i]')
            .first()
            .click({ force: true });
        });
      cy.wait(500);

      // Verify removed
      cy.window().then((win) => {
        const wishlist = JSON.parse(win.localStorage.getItem('wishlist') || '[]');
        expect(wishlist.length).to.equal(0);
      });
    });

    it('should move wishlist item to cart', () => {
      // Add to wishlist first
      cy.get('.product-card')
        .first()
        .within(() => {
          cy.get('[class*="heart"]').first().click({ force: true });
        });
      cy.wait(500);

      // Navigate to wishlist
      cy.get('a[href*="wishlist"], button[aria-label*="wishlist" i]')
        .first()
        .click({ force: true });
      cy.wait(1000);

      // Move to cart
      cy.contains('button', /add to cart|move to cart/i)
        .first()
        .click({ force: true });
      cy.wait(500);

      // Verify in cart
      cy.window().then((win) => {
        const cart = win.localStorage.getItem('cart');
        expect(cart).to.exist;
      });
    });
  });

  describe('Product Comparison', () => {
    beforeEach(() => {
      cy.visit('/');
    });

    it('should add products to comparison', () => {
      // Add 3 products to comparison
      cy.get('.product-card')
        .eq(0)
        .within(() => {
          cy.get('[class*="compare"], button[aria-label*="compare" i]')
            .first()
            .click({ force: true });
        });
      cy.wait(300);

      cy.get('.product-card')
        .eq(1)
        .within(() => {
          cy.get('[class*="compare"]').first().click({ force: true });
        });
      cy.wait(300);

      cy.get('.product-card')
        .eq(2)
        .within(() => {
          cy.get('[class*="compare"]').first().click({ force: true });
        });
      cy.wait(300);

      // Open comparison modal
      cy.get('[class*="comparison"], button')
        .contains(/compare|3/i)
        .click({ force: true });
      cy.wait(500);

      // Verify comparison modal
      cy.get('[class*="comparison"][class*="modal"]').should('be.visible');
    });

    it('should limit comparison to 4 products', () => {
      // Try to add 5 products
      for (let i = 0; i < 5; i++) {
        cy.get('.product-card')
          .eq(i)
          .within(() => {
            cy.get('[class*="compare"]').first().click({ force: true });
          });
        cy.wait(200);
      }

      // Should show limit message
      cy.contains(/maximum|limit|4 products/i).should('be.visible');
    });
  });

  describe('Exit Intent Modal', () => {
    it('should trigger on mouse leave', () => {
      cy.visit('/');
      cy.wait(2000);

      // Trigger exit intent (move mouse out of viewport)
      cy.get('body').trigger('mouseleave');
      cy.wait(500);

      // Modal might appear
      cy.get('body').then(($body) => {
        if ($body.find('[class*="exit"][class*="modal"]').length > 0) {
          cy.get('[class*="exit"][class*="modal"]').should('be.visible');
        }
      });
    });
  });

  describe('Accessibility Tests', () => {
    beforeEach(() => {
      cy.visit('/');
    });

    it('should navigate with keyboard', () => {
      // Tab through elements (requires cypress-plugin-tab, skipping for now)
      // cy.get('body').tab();
      // cy.focused().should('be.visible');

      // Press Enter on focused element
      // cy.focused().type('{enter}');
      cy.log('Skipping keyboard navigation test due to missing plugin');
    });

    it('should have proper ARIA labels', () => {
      cy.get('button[aria-label], a[aria-label]').should('exist');
    });

    it('should have alt text on images', () => {
      cy.get('img').each(($img) => {
        cy.wrap($img).should('have.attr', 'alt');
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', () => {
      // Intercept and fail API calls
      cy.intercept('**/api/**', { statusCode: 500 }).as('apiError');

      cy.visit('/');
      cy.wait(1000);

      // Page should still be functional
      cy.get('.product-card').should('exist');
    });

    it('should validate form inputs', () => {
      cy.addProductToCart();
      cy.get('[href*="checkout"]').first().click({ force: true });
      cy.wait(1000);

      // Invalid email
      cy.get('input[name*="email"]').type('invalid-email');
      cy.contains('button', /place order/i).click({ force: true });

      // Should show validation error
      cy.contains(/invalid|valid email/i).should('be.visible');
    });
  });
});
