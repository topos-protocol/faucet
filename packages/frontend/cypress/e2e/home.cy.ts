describe('Home', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should have visible and enabled address input', () => {
    cy.get('#faucet_address').should('be.visible').and('be.enabled')
  })

  // 0x4aab25b4fad0beaac466050f3a7142a502f4cf0a
})
