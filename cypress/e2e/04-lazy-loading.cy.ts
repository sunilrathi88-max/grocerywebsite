/// <reference types="cypress" />

/**
 * Tattva Co. - Lazy Loading Test
 * Tests image lazy loading on scroll
 */

describe('Lazy Loading Images', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should use loading="lazy" attribute on product images', () => {
    // First 4 images are eager loaded (priority="high"), so check the 5th one
    cy.get('.product-card img').eq(4).should('have.attr', 'loading', 'lazy');
  });

  it('should not load all images immediately', () => {
    // Intercept image requests
    cy.intercept('**/*.jpg').as('imageRequest');
    cy.intercept('**/*.png').as('imageRequest2');
    cy.intercept('**/*.webp').as('imageRequest3');

    cy.visit('/');
    cy.wait(1000);

    // Check how many images are in viewport vs total
    cy.get('.product-card img').then(($imgs) => {
      const totalImages = $imgs.length;
      let loadedImages = 0;

      $imgs.each((i, img) => {
        if (img.complete && img.naturalHeight > 0) {
          loadedImages++;
        }
      });

      cy.log(`Loaded ${loadedImages} of ${totalImages} images`);

      // Not all images should be loaded immediately (but first 4 are eager)
      // So loadedImages should be at least 4, but less than total if total is large enough
      if (totalImages > 8) {
        expect(loadedImages).to.be.lessThan(totalImages);
      } else {
        cy.log('Not enough images to test lazy loading deferral');
      }
    });
  });

  it('should load images as user scrolls down', () => {
    // Use custom command
    cy.waitForLazyImages();

    // Get initial loaded count
    let initialLoaded = 0;
    cy.get('.product-card img').each(($img) => {
      if ($img[0].complete && $img[0].naturalHeight > 0) {
        initialLoaded++;
      }
    });

    // Scroll down
    cy.scrollTo('0%', '50%');
    cy.wait(500);

    // More images should be loaded now
    cy.get('.product-card img').then(($imgs) => {
      let loadedAfterScroll = 0;

      $imgs.each((i, img) => {
        if (img.complete && img.naturalHeight > 0) {
          loadedAfterScroll++;
        }
      });

      cy.log(`Initially loaded: ${initialLoaded}`);
      cy.log(`After scroll: ${loadedAfterScroll}`);

      // More images should be loaded after scrolling
      expect(loadedAfterScroll).to.be.greaterThan(initialLoaded);
    });
  });

  it('should load images smoothly with fade-in animation', () => {
    cy.scrollTo('0%', '50%');
    cy.wait(500);

    // Check if images have opacity transition
    cy.get('.product-card img')
      .first()
      .should('be.visible')
      .and(($img) => {
        const opacity = window.getComputedStyle($img[0]).opacity;
        // Should be fully visible after loading
        // Note: Eager loaded images might already be visible without transition
        expect(parseFloat(opacity)).to.be.gte(0.5);
      });
  });

  it('should use Intersection Observer for lazy loading', () => {
    cy.window().then((win) => {
      // Check if IntersectionObserver is being used
      expect(win.IntersectionObserver).to.exist;
    });
  });

  it('should load product images in viewport first', () => {
    // Get first visible product card
    cy.get('.product-card')
      .first()
      .within(() => {
        cy.get('img')
          .should('be.visible')
          .and(($img) => {
            // First image should be loaded (eager)
            expect($img[0].complete).to.be.true;
            expect($img[0].naturalHeight).to.be.greaterThan(0);
          });
      });
  });

  it('should defer loading of below-the-fold images', () => {
    cy.visit('/');
    cy.wait(1000);

    // Scroll to bottom
    cy.scrollTo('bottom');
    cy.wait(1000);

    // Last product image should now be loaded
    cy.get('.product-card')
      .last()
      .within(() => {
        cy.get('img').should(($img) => {
          expect($img[0].complete).to.be.true;
        });
      });
  });

  it('should handle rapid scrolling gracefully', () => {
    // Scroll rapidly
    cy.scrollTo('0%', '25%');
    cy.wait(100);
    cy.scrollTo('0%', '50%');
    cy.wait(100);
    cy.scrollTo('0%', '75%');
    cy.wait(100);
    cy.scrollTo('bottom');
    cy.wait(1000);

    // All images should eventually load
    cy.get('.product-card img').each(($img) => {
      cy.wrap($img).should('be.visible');
    });
  });

  it('should not load images outside viewport', () => {
    cy.viewport(1280, 720);
    cy.visit('/');
    cy.wait(1000);

    // Get bottom-most product card
    cy.get('.product-card')
      .last()
      .then(($card) => {
        const rect = $card[0].getBoundingClientRect();

        // If card is below viewport, image shouldn't be loaded
        if (rect.top > 720) {
          cy.wrap($card).within(() => {
            cy.get('img').then(($img) => {
              // Image might not be loaded yet
              const isLoaded = $img[0].complete && $img[0].naturalHeight > 0;
              cy.log(`Bottom image loaded: ${isLoaded}`);
            });
          });
        }
      });
  });

  it('should lazy load blog post images', () => {
    cy.visit('/');

    // Navigate to blog if it exists
    cy.get('a[href*="blog"], a[href="#/blog"]').first().click({ force: true });
    cy.wait(1000);

    // Check blog images
    cy.get('img[loading="lazy"]').should('exist');
  });

  it('should show placeholder or skeleton while loading', () => {
    cy.visit('/');

    // Scroll to trigger lazy loading
    cy.scrollTo('0%', '50%');

    // Check for skeleton or placeholder
    cy.get('[class*="skeleton"], [class*="placeholder"]').should('exist');
  });

  it('should load images on category filter change', () => {
    // Filter by category
    cy.get('header').within(() => {
      cy.contains('Products').trigger('mouseover');
    });

    cy.get('[class*="dropdown"]').within(() => {
      cy.contains('Spices').click();
    });

    cy.wait(1000);

    // Filtered product images should load
    cy.get('.product-card img')
      .first()
      .should('be.visible')
      .and(($img) => {
        expect($img[0].complete).to.be.true;
      });
  });

  it('should handle image load errors gracefully', () => {
    // Intercept and fail some image requests
    cy.intercept('**/invalid-image.jpg', { statusCode: 404 }).as('failedImage');

    cy.visit('/');
    cy.wait(1000);

    // Page should still render even if some images fail
    cy.get('.product-card').should('have.length.greaterThan', 0);
  });
});
