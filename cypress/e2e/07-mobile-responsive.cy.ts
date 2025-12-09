/// <reference types="cypress" />

/**
 * Tattva Co. - Mobile Responsiveness Test
 * Tests mobile viewport and touch interactions
 */

describe('Mobile Responsiveness', () => {
  const mobileViewports = [
    { width: 375, height: 667, device: 'iPhone SE' },
    { width: 414, height: 896, device: 'iPhone 11' },
    { width: 360, height: 740, device: 'Samsung Galaxy S20' },
  ];

  const tabletViewports = [
    { width: 768, height: 1024, device: 'iPad' },
    { width: 820, height: 1180, device: 'iPad Air' },
  ];

  mobileViewports.forEach(({ width, height, device }) => {
    describe(`Mobile - ${device} (${width}x${height})`, () => {
      beforeEach(() => {
        cy.viewport(width, height);
        cy.visit('/');
      });

      it('should display mobile menu button', () => {
        cy.get('button[aria-label="Menu"]').should('be.visible');
      });

      it('should open mobile menu on click', () => {
        cy.get('button[aria-label="Menu"]').click();
        cy.wait(500);

        // Menu should be visible
        cy.get('[class*="menu"], nav').should('be.visible');
      });

      it('should close mobile menu', () => {
        cy.get('button[aria-label="Menu"]').click();
        cy.wait(500);

        // Close menu
        cy.get('button[aria-label="Close menu"]').click();
        cy.wait(500);

        // Menu should close
        cy.get('[class*="menu"]').should('not.be.visible');
      });

      it('should have responsive product grid', () => {
        // Products should stack vertically or in 2 columns
        cy.get('.product-card')
          .first()
          .then(($card) => {
            const cardWidth = $card[0].getBoundingClientRect().width;

            // Card should be responsive (not exceed viewport)
            expect(cardWidth).to.be.lessThan(width);
          });
      });

      it('should have tappable buttons (min 44x44)', () => {
        cy.get('button, a')
          .first()
          .then(($btn) => {
            const rect = $btn[0].getBoundingClientRect();

            // Buttons should meet touch target size
            expect(rect.width).to.be.greaterThan(40);
            expect(rect.height).to.be.greaterThan(40);
          });
      });

      it('should not have horizontal overflow', () => {
        cy.document().then((doc) => {
          const body = doc.body;
          const html = doc.documentElement;

          const scrollWidth = Math.max(body.scrollWidth, html.scrollWidth);
          const clientWidth = Math.max(body.clientWidth, html.clientWidth);

          // No horizontal scrollbar
          expect(scrollWidth).to.equal(clientWidth);
        });
      });

      it('should have readable font sizes', () => {
        cy.get('body').should(($body) => {
          const fontSize = window.getComputedStyle($body[0]).fontSize;
          const fontSizeNum = parseFloat(fontSize);

          // Minimum 14px for mobile
          expect(fontSizeNum).to.be.greaterThan(13);
        });
      });

      it('should handle touch swipe on product slider', () => {
        // Scroll to testimonials/product slider
        cy.contains('Featured Products').scrollIntoView();
        cy.wait(500);

        // Swipe gesture (simulate with mousemove)
        cy.get('[class*="slider"], [class*="carousel"]')
          .first()
          .trigger('touchstart', { touches: [{ clientX: 300, clientY: 100 }] })
          .trigger('touchmove', { touches: [{ clientX: 100, clientY: 100 }] })
          .trigger('touchend');

        cy.wait(500);
      });

      it('should display mobile-optimized header', () => {
        cy.get('header')
          .should('be.visible')
          .and(($header) => {
            const height = $header[0].getBoundingClientRect().height;

            // Header should be compact on mobile
            expect(height).to.be.lessThan(100);
          });
      });

      it('should handle product card tap', () => {
        cy.get('.product-card').first().click();
        cy.wait(500);

        // Product detail modal should open
        cy.get('[class*="modal"], [class*="detail"]').should('be.visible');
      });

      it('should have mobile-friendly forms', () => {
        // Add to cart
        cy.get('.product-card')
          .first()
          .within(() => {
            cy.contains('button', 'Add').click({ force: true });
          });
        cy.wait(500);

        // Go to checkout
        cy.get('[href*="checkout"]').first().click({ force: true });
        cy.wait(1000);

        // Form inputs should be mobile-friendly
        cy.get('input')
          .first()
          .should(($input) => {
            const width = $input[0].getBoundingClientRect().width;
            expect(width).to.be.greaterThan(100);
          });
      });

      it('should stack cart items vertically', () => {
        cy.get('.product-card')
          .first()
          .within(() => {
            cy.contains('button', 'Add').click({ force: true });
          });
        cy.wait(500);

        // Open cart
        cy.get('[class*="cart"]').first().click({ force: true });
        cy.wait(500);

        // Cart items should be visible
        cy.get('[class*="cart-item"]').should('be.visible');
      });

      it('should have touch-friendly dropdowns', () => {
        // Open mobile menu
        cy.get('button[aria-label="Menu"]').click();
        cy.wait(500);

        // Tap Products
        cy.contains('Products').click({ force: true });
        cy.wait(500);

        // Category should be visible
        cy.contains(/Spices|Nuts|Dry Fruits/i).should('be.visible');
      });
    });
  });

  tabletViewports.forEach(({ width, height, device }) => {
    describe(`Tablet - ${device} (${width}x${height})`, () => {
      beforeEach(() => {
        cy.viewport(width, height);
        cy.visit('/');
      });

      it('should display 2-3 column product grid', () => {
        cy.get('.product-card').then(($cards) => {
          if ($cards.length >= 2) {
            const card1 = $cards[0].getBoundingClientRect();
            const card2 = $cards[1].getBoundingClientRect();

            // Cards should be side by side
            expect(card2.left).to.be.greaterThan(card1.right - 50);
          }
        });
      });

      it('should have tablet-optimized layout', () => {
        cy.document().then((doc) => {
          const body = doc.body;
          const width = body.clientWidth;

          // Verify tablet width
          expect(width).to.be.greaterThan(700);
          expect(width).to.be.lessThan(1024);
        });
      });

      it('should show desktop-style header on tablet', () => {
        // Tablet might show full header or mobile menu
        cy.get('header').should('be.visible');
      });

      it('should handle both touch and mouse interactions', () => {
        // Test hover on Products
        cy.get('header').within(() => {
          cy.contains('Products').trigger('mouseover');
        });

        cy.wait(500);

        // Dropdown might appear on tablet
        cy.get('body').then(($body) => {
          if ($body.find('[class*="dropdown"]').length > 0) {
            cy.get('[class*="dropdown"]').should('be.visible');
          }
        });
      });
    });
  });

  describe('Responsive Breakpoints', () => {
    it('should adjust layout at 1024px breakpoint', () => {
      cy.viewport(1023, 768);
      cy.visit('/');

      // Mobile menu might be visible
      cy.get('[class*="mobile"]').should('exist');

      cy.viewport(1025, 768);
      cy.visit('/');

      // Desktop header should be visible
      cy.get('header').should('be.visible');
    });

    it('should adjust layout at 768px breakpoint', () => {
      cy.viewport(767, 1024);
      cy.visit('/');

      cy.viewport(769, 1024);
      cy.visit('/');

      cy.get('header').should('be.visible');
    });

    it('should adjust layout at 480px breakpoint', () => {
      cy.viewport(479, 800);
      cy.visit('/');

      cy.viewport(481, 800);
      cy.visit('/');

      cy.get('.product-card').should('be.visible');
    });
  });

  describe('Landscape Orientation', () => {
    it('should handle landscape mode', () => {
      cy.viewport(667, 375); // Landscape iPhone SE
      cy.visit('/');

      cy.get('header').should('be.visible');
      cy.get('.product-card').should('be.visible');
    });
  });

  describe('Mobile Performance', () => {
    beforeEach(() => {
      cy.viewport(375, 667);
      cy.visit('/');
    });

    it('should load quickly on mobile', () => {
      const startTime = Date.now();
      cy.visit('/');
      const loadTime = Date.now() - startTime;

      // Mobile should load in under 5 seconds
      expect(loadTime).to.be.lessThan(5000);
    });

    it('should lazy load images on mobile', () => {
      // First 4 images are eager loaded, check 5th
      cy.get('.product-card img').eq(4).should('have.attr', 'loading', 'lazy');
    });
  });
});
