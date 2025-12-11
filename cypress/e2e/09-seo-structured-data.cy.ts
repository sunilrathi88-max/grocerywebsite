describe('SEO & Structured Data', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should have Organization schema on the homepage', () => {
    cy.get('script[type="application/ld+json"]')
      .should('exist')
      .then(($scripts) => {
        const schemas = Array.from($scripts).map((script) => JSON.parse(script.innerText));
        // Note: The schemas might be independent separate scripts or arrays within one.
        // We look for any schema with @type Organization
        const orgSchema = schemas.find(
          (s) =>
            s['@type'] === 'Organization' ||
            (Array.isArray(s) && s.find((i: any) => i['@type'] === 'Organization'))
        );
        expect(orgSchema).to.exist;
      });
  });

  it('should have Product, Breadcrumb, and Recipe schema on product detail', () => {
    // Click on the first product (Himalayan Saffron)
    cy.contains('Himalayan Saffron').click();

    // Wait for modal
    cy.get('.fixed.inset-0').should('be.visible');

    cy.get('script[type="application/ld+json"]')
      .should('have.length.at.least', 1)
      .then(($scripts) => {
        const schemas = Array.from($scripts).map((script) => JSON.parse(script.innerText));

        // Flatten in case some are arrays
        const flattenedSchemas = schemas.flatMap((s) => (Array.isArray(s) ? s : [s]));

        // Check Product Schema
        const productSchema = flattenedSchemas.find(
          (s) => s['@type'] === 'Product' && s.name === 'Himalayan Saffron'
        );
        expect(productSchema, 'Product Schema').to.exist;

        // Check BreadcrumbList Schema
        const breadcrumbSchema = flattenedSchemas.find((s) => s['@type'] === 'BreadcrumbList');
        expect(breadcrumbSchema, 'BreadcrumbList Schema').to.exist;

        // Check Recipe Schema (Saffron has related recipes)
        const recipeSchema = flattenedSchemas.find((s) => s['@type'] === 'Recipe');
        expect(recipeSchema, 'Recipe Schema').to.exist;
      });
  });
});
