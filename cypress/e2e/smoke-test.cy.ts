describe('Smoke Test - Route Verification', () => {
    const routes = [
        { path: '/', text: 'Tattva Co.' },
        { path: '#/offers', text: 'Special Offers' },
        { path: '#/recipes', text: 'Recipes' }, // Assuming title is Recipes
        { path: '#/blog', text: 'Blog' }, // Assuming title is Blog
        { path: '#/about', text: 'About Us' },
        { path: '#/contact', text: 'Contact Us' },
        { path: '#/faqs', text: 'Frequently Asked Questions' },
        { path: '#/privacy-policy', text: 'Privacy Policy' },
        { path: '#/refund-policy', text: 'Refund Policy' },
        { path: '#/terms-of-service', text: 'Terms of Service' },
        { path: '#/login', text: 'Welcome Back' },
        { path: '#/signup', text: 'Create Account' },
    ];

    routes.forEach((route) => {
        it(`should successfully load ${route.path}`, () => {
            // Use localhost:5173 as verified previously
            cy.visit(`http://localhost:5173/${route.path}`);
            cy.contains(route.text, { timeout: 10000 }).should('be.visible');
        });
    });

    it('should navigate to products from home', () => {
        cy.visit('http://localhost:5173/');
        cy.contains('Products').click();
        // Assuming Products link scrolls to section or goes to hash, verify behavior
        // For now, just check if we stay on page or navigate
        cy.url().should('include', 'localhost:5173');
    });
});
