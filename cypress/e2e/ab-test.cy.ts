describe('A/B Testing Framework', () => {
    const VARIANT_A = {
        key: 'A',
        title: 'From Flavorless Dust... To Dishes That Taste Alive.',
    };

    const VARIANT_B = {
        key: 'B',
        title: '100% Organic, High-Curcumin Turmeric & Premium Spices',
    };

    it('should display Variant A (Control) when assigned', () => {
        // Force Variant A
        cy.visit('/', {
            onBeforeLoad(win) {
                win.localStorage.setItem('ab_test_variant', VARIANT_A.key);
            },
        });

        // Verify Hero Title for A
        cy.contains(VARIANT_A.title).should('be.visible');

        // Verify NOT B
        cy.contains(VARIANT_B.title).should('not.exist');
    });

    it('should display Variant B (Test) when assigned', () => {
        // Force Variant B
        cy.visit('/', {
            onBeforeLoad(win) {
                win.localStorage.setItem('ab_test_variant', VARIANT_B.key);
            },
        });

        // Verify Hero Title for B
        cy.contains(VARIANT_B.title).should('be.visible');

        // Verify NOT A
        cy.contains(VARIANT_A.title).should('not.exist');
    });

    it('should persist variant across reloads', () => {
        // Set A
        cy.visit('/', {
            onBeforeLoad(win) {
                win.localStorage.setItem('ab_test_variant', VARIANT_A.key);
            },
        });
        cy.contains(VARIANT_A.title).should('be.visible');

        // Reload without setting
        cy.reload();
        cy.contains(VARIANT_A.title).should('be.visible');
    });

    it('should assign a variant if none exists', () => {
        cy.visit('/', {
            onBeforeLoad(win) {
                win.localStorage.removeItem('ab_test_variant');
            },
        });

        // Should display EITHER A or B
        cy.get('h1').should('satisfy', ($el) => {
            const text = $el.text();
            return text.includes(VARIANT_A.title) || text.includes(VARIANT_B.title);
        });

        // Should set localStorage
        cy.getAllLocalStorage().then((result) => {
            const variant = result[Cypress.config('baseUrl')]?.['ab_test_variant'];
            expect(variant).to.be.oneOf(['A', 'B']);
        });
    });
});
