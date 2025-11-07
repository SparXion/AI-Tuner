describe('Elite Tier', () => {
  beforeEach(() => {
    // Enable Elite mode for testing
    cy.window().then((win) => {
      win.localStorage.setItem('ai_tuner_elite', 'true');
    });
    
    cy.visit('/');
    cy.wait(500);
  });

  it('allows unlimited blends', () => {
    // Load a model first
    cy.get('#modelSelect').select('Claude 4 Opus');
    cy.get('button[onclick="loadModelPersona()"]').click();
    cy.wait(300);
    
    // Perform more than 3 blends
    cy.get('#blendSelect').select('Grok 4');
    cy.get('#blendSlider').invoke('val', 50).trigger('input');
    
    for (let i = 0; i < 5; i++) {
      cy.get('button[onclick="blendWithModel()"]').click();
      cy.wait(200);
    }
    
    // No upgrade message should appear
    cy.get('body').should('not.contain', 'Upgrade to Elite');
  });

  it('shows Elite badge in UI', () => {
    // TODO: Add badge element when implemented
    // cy.get('[data-elite-badge]').should('be.visible');
  });

  it('has access to Cursor sidebar features', () => {
    // TODO: Test Cursor extension features when implemented
    // This would require testing the VS Code extension, not just web app
  });
});

describe('Elite Upgrade Flow', () => {
  it('shows upgrade CTA when limit reached', () => {
    localStorage.setItem('ai_tuner_blend_count', '3');
    
    cy.visit('/');
    cy.wait(500);
    
    cy.get('#blendSelect').select('Grok 4');
    cy.get('button[onclick="blendWithModel()"]').click();
    
    cy.on('window:alert', (str) => {
      expect(str).to.include('Upgrade to Elite');
      expect(str).to.include('https://app.aituner.com');
    });
  });

  it('upgrade link works correctly', () => {
    cy.visit('/');
    
    // TODO: Add upgrade button when implemented
    // cy.get('[data-upgrade-link]').should('have.attr', 'href', 'https://app.aituner.com');
  });
});

