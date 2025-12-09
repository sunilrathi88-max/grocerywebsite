
describe('Debug Add to Cart', () => {
    beforeEach(() => {
        cy.visit('/');
        // Clear cart before test
        cy.window().then((win) => {
            win.localStorage.removeItem('cart-storage');
        });
        cy.reload();
    });

    it('should use custom command addProductToCart', () => {
        // 1. Wait for products
        cy.get('.product-card', { timeout: 10000 }).should('have.length.gt', 0);

        // 2. Use custom command
        cy.addProductToCart();

        // 3. Verify cart count increases
        cy.get('[data-testid="cart-badge"]', { timeout: 5000 }).should('contain', '1');
    });
});
