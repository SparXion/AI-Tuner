describe('Free Tier', () => {
  beforeEach(() => {
    // Reset blend count for each test
    localStorage.setItem('ai_tuner_blend_count', '0');
    localStorage.setItem('ai_tuner_blend_reset_date', new Date().toDateString());
    
    cy.visit('/');
    cy.wait(500); // Wait for app to initialize
  });

  it('allows 3 blends per day', () => {
    // Load a model first
    cy.get('#modelSelect').select('Claude 4 Opus');
    cy.get('button[onclick="loadModelPersona()"]').click();
    cy.wait(300);
    
    // Perform 3 blends
    cy.get('#blendSelect').select('Grok 4');
    cy.get('#blendSlider').invoke('val', 50).trigger('input');
    
    for (let i = 0; i < 3; i++) {
      cy.get('button[onclick="blendWithModel()"]').click();
      cy.wait(200);
    }
    
    // 4th blend should show upgrade message
    cy.get('button[onclick="blendWithModel()"]').click();
    cy.on('window:alert', (str) => {
      expect(str).to.include('Upgrade to Elite');
      expect(str).to.include('3 blends per day');
    });
  });

  it('resets blend count daily', () => {
    // Set blend count to 3
    localStorage.setItem('ai_tuner_blend_count', '3');
    
    // Set date to yesterday
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    localStorage.setItem('ai_tuner_blend_reset_date', yesterday.toDateString());
    
    cy.reload();
    
    // Blend count should reset to 0
    const count = localStorage.getItem('ai_tuner_blend_count');
    expect(count).to.equal('0');
  });

  it('shows blend usage indicator', () => {
    // Set blend count to 2
    localStorage.setItem('ai_tuner_blend_count', '2');
    
    cy.reload();
    
    // TODO: Add visual indicator test when implemented
    // cy.get('[data-blend-count]').should('contain', '2/3');
  });

  it('cannot exceed daily blend limit', () => {
    localStorage.setItem('ai_tuner_blend_count', '3');
    
    cy.get('#blendSelect').select('Grok 4');
    
    cy.get('button[onclick="blendWithModel()"]').click();
    
    cy.on('window:alert', (str) => {
      expect(str).to.include('limit reached');
    });
  });

  it('preserves settings after blend limit reached', () => {
    localStorage.setItem('ai_tuner_blend_count', '3');
    
    // Set some settings
    cy.get('#personality').select('analytical');
    cy.get('#bluntness').select('high');
    
    // Try to blend (should fail)
    cy.get('button[onclick="blendWithModel()"]').click();
    
    // Settings should be preserved
    cy.get('#personality').should('have.value', 'analytical');
    cy.get('#bluntness').should('have.value', 'high');
  });
});

