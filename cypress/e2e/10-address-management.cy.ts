/// <reference types="cypress" />

describe('Address Management', () => {
    const testUser = {
        name: 'Test User',
        email: `testuser_${Date.now()}@example.com`,
        password: 'Password123!',
    };

    const testAddress = {
        type: 'Home',
        street: '123 Test St',
        city: 'Test City',
        state: 'Test State',
        zip: '123456',
        country: 'India',
    };

    beforeEach(() => {
        // Mock Supabase Auth Endpoints
        cy.intercept('POST', '**/auth/v1/signup', {
            statusCode: 200,
            body: {
                access_token: 'fake-access-token',
                token_type: 'bearer',
                expires_in: 3600,
                refresh_token: 'fake-refresh-token',
                user: {
                    id: 'fake-user-id',
                    aud: 'authenticated',
                    role: 'authenticated',
                    email: 'test@example.com',
                    email_confirmed_at: new Date().toISOString(),
                    phone: '',
                    user_metadata: {
                        name: 'Test User',
                        addresses: []
                    },
                    app_metadata: {
                        provider: 'email',
                        providers: ['email']
                    },
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                }
            }
        }).as('signup');

        cy.intercept('GET', '**/auth/v1/user', {
            statusCode: 200,
            body: {
                id: 'fake-user-id',
                aud: 'authenticated',
                role: 'authenticated',
                email: 'test@example.com',
                email_confirmed_at: new Date().toISOString(),
                phone: '',
                user_metadata: {
                    name: 'Test User',
                    addresses: []
                },
                app_metadata: {
                    provider: 'email',
                    providers: ['email']
                },
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            }
        }).as('getUser');

        cy.intercept('PUT', '**/auth/v1/user', (req) => {
            const { data } = req.body;
            req.reply({
                statusCode: 200,
                body: {
                    id: 'fake-user-id',
                    aud: 'authenticated',
                    role: 'authenticated',
                    email: 'test@example.com',
                    email_confirmed_at: new Date().toISOString(),
                    phone: '',
                    user_metadata: {
                        name: 'Test User',
                        addresses: data.addresses || []
                    },
                    app_metadata: {
                        provider: 'email',
                        providers: ['email']
                    },
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                }
            });
        }).as('updateUser');

        cy.visit('/');
    });

    it('should allow a user to register, add, edit, and delete an address', () => {
        // 1. Register a new user
        cy.contains('button', /login|sign in/i).click();
        cy.contains('button', /sign up|create account/i).click();

        cy.get('input[type="text"]').first().type(testUser.name);
        cy.get('input[type="email"]').type(testUser.email);
        cy.get('input[type="password"]').first().type(testUser.password);
        cy.get('input[id="confirm-password"]').type(testUser.password);
        cy.get('input[id="accept-terms"]').check();
        cy.get('form').submit();

        // Wait for signup to complete
        cy.wait('@signup');

        // Wait for login to complete (check for user menu or logout button)
        cy.contains(/welcome|account|logout/i, { timeout: 10000 }).should('be.visible');

        // 2. Navigate to Profile -> Addresses
        cy.get('a[href="#/profile"]').click({ force: true });

        // Switch to Addresses tab
        cy.contains('button', /addresses/i).click();

        // 3. Add New Address
        cy.contains('button', /add new address/i).click();

        // Fill form
        cy.get('select').select(testAddress.type);
        cy.contains('label', /street/i).next('input').type(testAddress.street);
        cy.contains('label', /city/i).next('input').type(testAddress.city);
        cy.contains('label', /state/i).next('input').type(testAddress.state);
        cy.contains('label', /pin code|zip/i).next('input').type(testAddress.zip);
        cy.contains('label', /country/i).next('input').clear().type(testAddress.country);

        cy.contains('button', /save address/i).click();

        // Wait for update
        cy.wait('@updateUser');

        // 4. Verify Address Added
        cy.contains(testAddress.street).should('be.visible');
        cy.contains(testAddress.city).should('be.visible');
        cy.contains(testAddress.zip).should('be.visible');

        // 5. Edit Address
        cy.contains('button', /edit/i).click();

        const updatedStreet = '456 Updated St';
        cy.contains('label', /street/i).next('input').clear().type(updatedStreet);
        cy.contains('button', /save address/i).click();

        // Wait for update
        cy.wait('@updateUser');

        // 6. Verify Update
        cy.contains(updatedStreet).should('be.visible');
        cy.contains(testAddress.street).should('not.exist');

        // 7. Delete Address
        cy.contains('button', /delete/i).click();
        // Confirm dialog
        cy.on('window:confirm', () => true);

        // Wait for update
        cy.wait('@updateUser');

        // 8. Verify Deletion
        cy.contains(updatedStreet).should('not.exist');
        cy.contains(/no addresses/i).should('be.visible');
    });
});
