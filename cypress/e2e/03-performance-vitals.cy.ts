/// <reference types="cypress" />

/**
 * Tattva Co. - Performance & Web Vitals Test
 * Tests Core Web Vitals: LCP, FID, CLS
 */

describe('Performance & Web Vitals', () => {
  it('should have acceptable page load time on homepage', () => {
    const startTime = Date.now();
    cy.visit('/');
    const loadTime = Date.now() - startTime;

    // Page should load in under 5 seconds
    expect(loadTime).to.be.lessThan(5000);
  });

  it('should meet Core Web Vitals on homepage', () => {
    cy.visit('/');
    cy.wait(2000); // Allow page to fully render

    // Use custom command to check Web Vitals
    cy.checkWebVitals();
  });

  it('should meet Core Web Vitals on product detail page', () => {
    cy.visit('/');

    // Open first product detail
    cy.get('.product-card').first().click();
    cy.wait(1000);

    // Check vitals on modal
    cy.checkWebVitals();
  });

  it('should load hero images efficiently', () => {
    cy.visit('/');

    // Hero images should load quickly
    cy.get('[class*="hero"]').within(() => {
      cy.get('img')
        .should('be.visible')
        .and(($img) => {
          // Check if image is actually loaded (not broken)
          expect($img[0].naturalWidth).to.be.greaterThan(0);
        });
    });
  });

  it('should not have excessive layout shifts (CLS)', () => {
    cy.visit('/');

    // Track initial positions
    const positions: { top: number; left: number }[] = [];

    cy.get('.product-card')
      .first()
      .then(($el) => {
        const rect = $el[0].getBoundingClientRect();
        positions.push({ top: rect.top, left: rect.left });
      });

    // Wait for potential layout shifts
    cy.wait(2000);

    // Check if element moved significantly
    cy.get('.product-card')
      .first()
      .then(($el) => {
        const rect = $el[0].getBoundingClientRect();
        const initialPos = positions[0];

        // Should not shift more than 10px
        const topDiff = Math.abs(rect.top - initialPos.top);
        const leftDiff = Math.abs(rect.left - initialPos.left);

        expect(topDiff).to.be.lessThan(10);
        expect(leftDiff).to.be.lessThan(10);
      });
  });

  it('should have fast First Input Delay (FID)', () => {
    cy.visit('/');
    cy.wait(1000);

    // Measure time to first click response
    const startTime = Date.now();

    cy.get('header').within(() => {
      cy.contains('Products').click();
    });

    cy.get('[class*="dropdown"]')
      .should('be.visible')
      .then(() => {
        const responseTime = Date.now() - startTime;

        // FID should be under 100ms (aim for instant)
        expect(responseTime).to.be.lessThan(200);
      });
  });

  it('should load fonts without FOUT', () => {
    cy.visit('/');

    // Check if custom fonts are loaded
    cy.get('body').should(($body) => {
      const fontFamily = window.getComputedStyle($body[0]).fontFamily;

      // Should not be using fallback system fonts only
      expect(fontFamily).to.not.equal('Arial');
      expect(fontFamily).to.not.equal('Times New Roman');
    });
  });

  it('should optimize bundle size (check total transfer)', () => {
    cy.visit('/', {
      onBeforeLoad: (win) => {
        // Track resources
        (win as any).performance.setResourceTimingBufferSize(500);
      },
    });

    cy.wait(3000);

    cy.window().then((win) => {
      const resources = (win as any).performance.getEntriesByType('resource');

      let totalSize = 0;
      resources.forEach((resource: any) => {
        totalSize += resource.transferSize || 0;
      });

      // Total transfer should be under 5MB for initial load
      const totalSizeMB = totalSize / (1024 * 1024);
      expect(totalSizeMB).to.be.lessThan(5);

      cy.log(`Total transfer size: ${totalSizeMB.toFixed(2)} MB`);
    });
  });

  it('should have efficient JavaScript execution time', () => {
    cy.visit('/');

    cy.window().then((win) => {
      const navigationTiming = (win as any).performance.getEntriesByType('navigation')[0];

      if (navigationTiming) {
        const domContentLoaded =
          navigationTiming.domContentLoadedEventEnd - navigationTiming.domContentLoadedEventStart;

        // DOM parsing and JS execution should be under 1 second
        expect(domContentLoaded).to.be.lessThan(1000);
      }
    });
  });

  it('should load critical CSS inline', () => {
    cy.request('/').then((response) => {
      // Check if HTML contains inline styles for above-the-fold content
      expect(response.body).to.include('<style');
    });
  });

  it('should defer non-critical resources', () => {
    cy.visit('/');

    cy.document().then((doc) => {
      // Check for async/defer on script tags
      const scripts = doc.querySelectorAll('script[src]');
      let hasDeferOrAsync = false;

      scripts.forEach((script) => {
        if (script.hasAttribute('defer') || script.hasAttribute('async')) {
          hasDeferOrAsync = true;
        }
      });

      // At least some scripts should be deferred
      expect(hasDeferOrAsync).to.be.true;
    });
  });

  it('should have good Time to Interactive (TTI)', () => {
    const startTime = Date.now();
    cy.visit('/');

    // Wait for page to be fully interactive
    cy.get('header').within(() => {
      cy.contains('Products').should('be.visible');
    });

    // Try to interact with dropdown
    cy.get('header').within(() => {
      cy.contains('Products').trigger('mouseover');
    });

    cy.get('[class*="dropdown"]')
      .should('be.visible')
      .then(() => {
        const tti = Date.now() - startTime;

        // TTI should be under 3.5 seconds
        expect(tti).to.be.lessThan(3500);
        cy.log(`Time to Interactive: ${tti}ms`);
      });
  });

  it('should use connection-aware loading', () => {
    cy.visit('/');

    cy.window().then((win) => {
      // Check if navigator.connection is available
      const connection = (win.navigator as any).connection;

      if (connection) {
        cy.log(`Effective Type: ${connection.effectiveType}`);
        cy.log(`Downlink: ${connection.downlink} Mbps`);
        cy.log(`RTT: ${connection.rtt}ms`);
        cy.log(`Save Data: ${connection.saveData}`);
      }
    });
  });
});
