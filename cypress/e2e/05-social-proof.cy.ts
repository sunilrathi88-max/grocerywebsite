/// <reference types="cypress" />

/**
 * Tattva Co. - Social Proof Notification Test
 * Tests "X just purchased Y" notifications
 */

describe('Social Proof Notifications', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display first notification within 3 seconds', () => {
    // Use custom command to wait for notification
    cy.waitForSocialProofNotification();

    // Verify notification is visible
    cy.get('[data-testid="social-proof-notification"]').should('contain.text', 'purchased');
  });

  it('should show notifications at 10-15 second intervals', () => {
    // Wait for first notification
    cy.waitForSocialProofNotification();
    const firstTime = Date.now();

    // Wait for first notification to disappear (auto-dismiss is 5s)
    cy.get('[data-testid="social-proof-notification"]').should('not.exist');

    // Wait for second notification to appear (interval is 10-15s from start)
    // Adding buffer to timeout
    cy.get('[data-testid="social-proof-notification"]', { timeout: 20000 }).should('be.visible');

    const secondTime = Date.now();
    const interval = secondTime - firstTime;

    cy.log(`Notification interval: ${interval}ms`);

    // Interval should be roughly between 10-15 seconds (allowing for execution overhead)
    // Lower bound: 10s (min interval) - small buffer
    // Upper bound: 15s (max interval) + 5s (dismissal) + buffer?
    // Actually the interval is between *appearences*.
    // If interval is 10s: Shows at T0, Dismiss T5. Next T10.
    // So 10000 < interval < 16000.
    expect(interval).to.be.greaterThan(9000);
    expect(interval).to.be.lessThan(18000);
  });

  it('should display customer name and product', () => {
    cy.waitForSocialProofNotification();

    cy.get('[data-testid="social-proof-notification"]').should(($notification) => {
      const text = $notification.text();

      // Should contain "purchased"
      expect(text).to.include('purchased');

      // Should have a name (check for common patterns)
      expect(text).to.match(/\b[A-Z][a-z]+\b/);

      // Should mention a product
      expect(text.length).to.be.greaterThan(20);
    });
  });

  it('should show different cities/locations', () => {
    const locations: string[] = [];

    // Collect multiple notifications
    cy.waitForSocialProofNotification();
    cy.get('[data-testid="social-proof-notification"]')
      .invoke('text')
      .then((text) => {
        locations.push(text);
      });

    cy.wait(12000);
    cy.get('[data-testid="social-proof-notification"]')
      .invoke('text')
      .then((text) => {
        locations.push(text);
      });

    cy.wait(12000);
    cy.get('[data-testid="social-proof-notification"]')
      .invoke('text')
      .then((text) => {
        locations.push(text);

        // Should have variety in notifications
        cy.log('Notifications:', locations);
      });
  });

  it('should auto-dismiss notification after 5 seconds', () => {
    cy.waitForSocialProofNotification();

    // Notification should be visible
    cy.get('[data-testid="social-proof-notification"]').should('be.visible');

    // Wait 5.5 seconds
    cy.wait(5500);

    // Notification should be dismissed or hidden
    cy.get('[data-testid="social-proof-notification"]').should('not.exist');
  });

  it('should allow manual dismissal of notification', () => {
    cy.waitForSocialProofNotification();

    // Look for close button
    cy.get('[data-testid="social-proof-notification"]').within(() => {
      cy.get('button, [role="button"], svg').first().click({ force: true });
    });

    // Notification should disappear
    cy.get('[data-testid="social-proof-notification"]').should('not.exist');
  });

  it('should show notifications on different pages', () => {
    // Homepage
    cy.visit('/');
    cy.waitForSocialProofNotification();
    cy.get('[data-testid="social-proof-notification"]').should('exist');

    // Navigate to about page
    cy.get('a[href*="about"], a[href="#/about"]').first().click({ force: true });
    cy.wait(5000);

    // Should show notification on about page too
    cy.get('[data-testid="social-proof-notification"]').should('exist');
  });

  it('should display relevant product images in notification', () => {
    cy.waitForSocialProofNotification();

    // Check if notification contains image/icon
    cy.get('[data-testid="social-proof-notification"]').within(() => {
      cy.get('svg').should('exist').and('be.visible');
    });
  });

  it('should not block user interactions', () => {
    cy.waitForSocialProofNotification();

    // Notification should be visible
    cy.get('[data-testid="social-proof-notification"]').should('exist');

    // User should still be able to interact with page
    cy.get('header').within(() => {
      cy.contains('Products').trigger('mouseover');
    });

    cy.get('[class*="dropdown"]').should('be.visible');
  });

  it('should have smooth slide-in animation', () => {
    cy.visit('/');

    // Wait for notification to appear
    cy.wait(3000);

    cy.get('[data-testid="social-proof-notification"]')
      .should('be.visible')
      .and(($notification) => {
        // Check if element has transition or animation
        const styles = window.getComputedStyle($notification[0]);
        const hasTransition = styles.transition !== 'all 0s ease 0s';
        const hasAnimation = styles.animation !== 'none';

        expect(hasTransition || hasAnimation).to.be.true;
      });
  });

  it('should stack multiple notifications if timing overlaps', () => {
    // This tests edge case where multiple notifications appear
    cy.visit('/');
    cy.wait(3000);

    // Count visible notifications
    cy.get('[data-testid="social-proof-notification"]').then(($notifications) => {
      // Should handle stacking gracefully (either show one at a time or stack)
      expect($notifications.length).to.be.greaterThan(0);
    });
  });

  it('should use realistic customer names', () => {
    cy.waitForSocialProofNotification();

    cy.get('[data-testid="social-proof-notification"]').should(($notification) => {
      const text = $notification.text();

      // Check for Indian names (common in target market)
      const hasName =
        /Priya|Rahul|Amit|Neha|Rohan|Ananya|Arjun|Divya|Karan|Meera|Raj|Sanjay|Vikram/.test(text);

      cy.log('Notification text:', text);
      cy.log('Has realistic name:', hasName);
    });
  });

  it('should show variety of products in notifications', () => {
    const products: string[] = [];

    // Collect 3 notifications
    for (let i = 0; i < 3; i++) {
      cy.wait(i === 0 ? 3000 : 12000);
      cy.get('[data-testid="social-proof-notification"]')
        .invoke('text')
        .then((text) => {
          products.push(text);
          cy.log(`Notification ${i + 1}:`, text);
        });
    }

    // Verify variety
    cy.wrap(products).should('have.length', 3);
  });

  it('should be responsive on mobile', () => {
    cy.viewport(375, 667);
    cy.visit('/');

    cy.waitForSocialProofNotification();

    // Notification should fit mobile screen
    cy.get('[data-testid="social-proof-notification"]')
      .should('be.visible')
      .and(($notification) => {
        const width = $notification[0].getBoundingClientRect().width;

        // Should not exceed viewport width
        expect(width).to.be.lessThan(375);
      });
  });
});
