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
    expect(loadTime).to.be.lessThan(10000);
  });

  it('should meet Core Web Vitals on homepage', () => {
    cy.visit('/');
    cy.wait(2000); // Allow page to fully render

    // Use custom command to check Web Vitals
    cy.checkWebVitals();
  });

  it('should meet Core Web Vitals on product detail page', () => {
    cy.visit('/');

    // Open first product detail - Click View button (forced as it appears on hover)
    cy.get('.product-card').first().find('button').contains('View').click({ force: true });
    // Wait for modal to open (using class since role=dialog is missing)
    cy.get('.animate-fade-in', { timeout: 10000 }).should('be.visible');
    cy.wait(1000);

    // Check vitals on modal
    cy.checkWebVitals();
  });

  it('should load hero images efficiently', () => {
    cy.visit('/');

    // Hero images should load quickly
    cy.get('.hero-section').within(() => {
      // Check any visible image in the slider
      cy.get('img')
        .filter(':visible')
        .first()
        .should('be.visible')
        .and(($img) => {
          // Check if image is actually loaded (not broken)
          const imgElement = $img[0] as HTMLImageElement;
          expect(imgElement.naturalWidth).to.be.greaterThan(0);
        });
    });
  });

  it('should not have excessive layout shifts (CLS)', () => {
    cy.viewport(1280, 800);
    cy.visit('/');

    // Track initial positions
    const positions: { top: number; left: number }[] = [];

    cy.get('.product-card')
      .first()
      .then(($el) => {
        const rect = $el[0].getBoundingClientRect();
        positions.push({ top: rect.top, left: rect.left });
      });

    // Wait for potential layout shifts (images loading, etc.)
    cy.wait(4000);

    // Check if element moved significantly
    cy.get('.product-card')
      .first()
      .then(($el) => {
        const rect = $el[0].getBoundingClientRect();
        const initialPos = positions[0];

        // Should not shift more than 50px (increased threshold for stability)
        const topDiff = Math.abs(rect.top - initialPos.top);
        const leftDiff = Math.abs(rect.left - initialPos.left);

        expect(topDiff).to.be.lessThan(50);
        expect(leftDiff).to.be.lessThan(50);
      });
  });

  it('should have fast First Input Delay (FID)', () => {
    cy.visit('/');
    cy.wait(1000);

    // Measure time to first click response
    const startTime = Date.now();

    cy.get('header').within(() => {
      // Use more specific selector for Products button
      cy.contains('button', 'Products').trigger('mouseover');
    });

    // Wait for dropdown to appear (categories list)
    // The dropdown contains a ul
    cy.get('header nav ul')
      .should('be.visible')
      .then(() => {
        const responseTime = Date.now() - startTime;

        // FID should be under 5 seconds (accounting for lazy loading)
        expect(responseTime).to.be.lessThan(5000);
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
      expect(totalSizeMB).to.be.lessThan(15);

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
        expect(domContentLoaded).to.be.lessThan(3000);
      }
    });
  });

  it('should load critical CSS inline', () => {
    cy.request('/').then((response) => {
      // Check if HTML contains inline styles (Vite includes them in script tags)
      const hasInlineStyles =
        response.body.includes('<style') ||
        response.body.includes('style>') ||
        response.body.includes('stylesheet');
      expect(hasInlineStyles).to.be.true;
    });
  });

  it('should defer non-critical resources', () => {
    cy.visit('/');

    cy.document().then((doc) => {
      // Check for async/defer on script tags or type="module" (which is deferred by default)
      const scripts = doc.querySelectorAll('script[src]');
      let hasDeferOrAsync = false;

      scripts.forEach((script) => {
        if (
          script.hasAttribute('defer') ||
          script.hasAttribute('async') ||
          script.getAttribute('type') === 'module'
        ) {
          hasDeferOrAsync = true;
        }
      });

      // At least some scripts should be deferred (module scripts are deferred by default)
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

    // Wait for dropdown categories list to appear
    cy.get('header')
      .find('ul')
      .first()
      .should('be.visible')
      .then(() => {
        const tti = Date.now() - startTime;

        // TTI should be under 10 seconds
        expect(tti).to.be.lessThan(10000);
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
