describe('GameVault Library E2E Tests (Cypress Best Practices - data-cy selectors)', () => {
  beforeEach(() => {
    // Intercept initial library fetch (matches both /api/libraries and /api/library)
    cy.intercept('GET', '**/api/librar*', {
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

  it('US-10: displays game library list with cards, badges, and stats via data-cy attributes', () => {
    cy.visit('/');
    cy.wait('@getLibrary');

    // Check heading and app title using resilient data-cy attributes
    cy.get('[data-cy="app-title"]').should('be.visible').and('contain.text', 'GameVault');
    cy.get('[data-cy="library-heading"]').should('be.visible');

    // Verify all 3 game cards rendered
    cy.get('[data-cy="game-card"]').should('have.length', 3);
    cy.get('[data-cy="game-card"]').contains('Portal 2').should('be.visible');
    cy.get('[data-cy="game-card"]').contains('Terraria').should('be.visible');
    cy.get('[data-cy="game-card"]').contains('Hollow Knight').should('be.visible');

    // Verify footer summary count
    cy.get('[data-cy="footer-count"]').should('be.visible').and('contain.text', '3 games');
  });

  it('displays empty state when library has no games', () => {
    cy.intercept('GET', '**/api/librar*', {
      statusCode: 200,
      body: [],
    }).as('getEmptyLibrary');

    cy.visit('/');
    cy.wait('@getEmptyLibrary');

    cy.get('[data-cy="empty-state"]').should('be.visible');
    cy.get('[data-cy="empty-state-title"]').should('be.visible');
    cy.get('[data-cy="empty-add-game-btn"]').should('be.visible');
  });

  it('US-09: opens modal and manually adds a game to the library using data-cy selectors', () => {
    cy.intercept('POST', '**/api/librar*', {
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

    // Click Add Game button via dedicated test attribute
    cy.get('[data-cy="add-game-btn"]').click();

    // Verify modal is displayed
    cy.get('[data-cy="add-game-modal"]').should('be.visible');
    cy.get('[data-cy="modal-heading"]').should('be.visible');

    // Fill form using decoupled input selectors
    cy.get('[data-cy="game-title-input"]').type('Elden Ring');
    cy.get('[data-cy="game-hours-input"]').type('60');

    // Submit modal form
    cy.get('[data-cy="submit-game-btn"]').click();
    cy.wait('@addGame');

    // Check success toast and new card rendered
    cy.get('[data-cy="toast-notification"]').should('be.visible').and('contain.text', 'Elden Ring');
    cy.get('[data-cy="game-card"]').contains('Elden Ring').should('be.visible');
  });

  it('filters games by status and searches by title', () => {
    cy.visit('/');
    cy.wait('@getLibrary');

    // Filter by "Playing" via data-cy
    cy.get('[data-cy="filter-playing"]').click();
    cy.get('[data-cy="game-card"]').should('have.length', 1);
    cy.get('[data-cy="game-card"]').contains('Terraria').should('be.visible');

    // Switch back to "All" via data-cy
    cy.get('[data-cy="filter-all"]').click();
    cy.get('[data-cy="game-card"]').should('have.length', 3);

    // Search for "Portal" via data-cy
    cy.get('[data-cy="search-input"]').type('Portal');
    cy.get('[data-cy="game-card"]').should('have.length', 1);
    cy.get('[data-cy="game-card"]').contains('Portal 2').should('be.visible');
  });

  it('US-11: deletes a game from library with confirmation', () => {
    cy.intercept('DELETE', '**/api/librar*/1', {
      statusCode: 204,
      body: {},
    }).as('deleteGame');

    cy.visit('/');
    cy.wait('@getLibrary');

    // Find Portal 2 card and click its delete button via data-cy
    cy.get('[data-cy="game-card"]').filter(':contains("Portal 2")').within(() => {
      cy.get('[data-cy="delete-game-btn"]').click();
      cy.get('[data-cy="confirm-delete-btn"]').click();
    });

    cy.wait('@deleteGame');

    // Toast notification and card removal
    cy.get('[data-cy="toast-notification"]').should('be.visible').and('contain.text', 'removed');
    cy.get('[data-cy="game-card"]').contains('Portal 2').should('not.exist');
  });
});
