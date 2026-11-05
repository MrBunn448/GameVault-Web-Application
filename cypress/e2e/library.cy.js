describe('GameVault Library E2E Tests', () => {
  beforeEach(() => {
    // Intercept initial library fetch
    cy.intercept('GET', '/api/library', {
      statusCode: 200,
      body: [
        {
          id: 1,
          steamAppId: 620,
          title: 'Portal 2',
          status: 'COMPLETED',
          playtimeMinutes: 300,
          headerImageUrl: null,
        },
        {
          id: 2,
          steamAppId: 105600,
          title: 'Terraria',
          status: 'PLAYING',
          playtimeMinutes: 120,
          headerImageUrl: null,
        },
        {
          id: 3,
          steamAppId: null,
          title: 'Hollow Knight',
          status: 'BACKLOG',
          playtimeMinutes: 0,
          headerImageUrl: null,
        },
      ],
    }).as('getLibrary');
  });

  it('US-10: displays game library list with cards, badges, and stats', () => {
    cy.visit('/');
    cy.wait('@getLibrary');

    // Check heading and navigation
    cy.contains('h1', 'Your library').should('be.visible');
    cy.contains('GameVault').should('be.visible');

    // Verify all 3 game cards are visible
    cy.contains('Portal 2').should('be.visible');
    cy.contains('Terraria').should('be.visible');
    cy.contains('Hollow Knight').should('be.visible');

    // Verify badges
    cy.contains('Completed').should('be.visible');
    cy.contains('Playing').should('be.visible');
    cy.contains('Backlog').should('be.visible');

    // Verify footer summary count
    cy.contains('Showing all 3 games').should('be.visible');
  });

  it('displays empty state when library has no games', () => {
    cy.intercept('GET', '/api/library', {
      statusCode: 200,
      body: [],
    }).as('getEmptyLibrary');

    cy.visit('/');
    cy.wait('@getEmptyLibrary');

    cy.contains('h2', 'Your library is empty').should('be.visible');
    cy.contains('Add a game manually or import your owned games from Steam to get started.').should('be.visible');
  });

  it('US-09: opens modal and manually adds a game to the library', () => {
    cy.intercept('POST', '/api/library', {
      statusCode: 201,
      body: {
        id: 99,
        steamAppId: null,
        title: 'Elden Ring',
        status: 'PLAYING',
        playtimeMinutes: 3600,
        headerImageUrl: null,
      },
    }).as('addGame');

    cy.visit('/');
    cy.wait('@getLibrary');

    // Click Add Game button in navbar
    cy.contains('button', 'Add Game').click();

    // Verify modal is displayed
    cy.contains('h2', 'Add a game').should('be.visible');

    // Fill form
    cy.get('input[placeholder*="Baldur’s Gate 3"]').type('Elden Ring');
    cy.get('input[type="number"]').type('60');

    // Submit modal form
    cy.get('button[type="submit"]').click();
    cy.wait('@addGame');

    // Check success toast and new card rendered
    cy.contains('Added "Elden Ring" to your library!').should('be.visible');
    cy.contains('Elden Ring').should('be.visible');
  });

  it('filters games by status and searches by title', () => {
    cy.visit('/');
    cy.wait('@getLibrary');

    // Filter by "Playing"
    cy.contains('button', 'Playing').click();
    cy.contains('Terraria').should('be.visible');
    cy.contains('Portal 2').should('not.exist');
    cy.contains('Hollow Knight').should('not.exist');

    // Switch back to "All"
    cy.contains('button', 'All').click();
    cy.contains('Portal 2').should('be.visible');
    cy.contains('Terraria').should('be.visible');

    // Search for "Portal"
    cy.get('input[placeholder="Search your games..."]').type('Portal');
    cy.contains('Portal 2').should('be.visible');
    cy.contains('Terraria').should('not.exist');
    cy.contains('Hollow Knight').should('not.exist');
  });

  it('US-11: deletes a game from library with confirmation', () => {
    cy.intercept('DELETE', '/api/library/1', {
      statusCode: 204,
      body: {},
    }).as('deleteGame');

    cy.visit('/');
    cy.wait('@getLibrary');

    // Find Portal 2 card and click its delete button
    cy.get('article').filter(':contains("Portal 2")').within(() => {
      cy.get('button[aria-label="Delete Portal 2"]').click();
      // Click confirm "Yes"
      cy.contains('button', 'Yes').click();
    });

    cy.wait('@deleteGame');

    // Toast notification and card removal
    cy.contains('Game removed from library').should('be.visible');
    cy.contains('Portal 2').should('not.exist');
  });
});
