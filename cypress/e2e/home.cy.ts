import { INFO } from '../../src/constants/wordings'

describe('Home', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should have Builders Program banner', () => {
    cy.get('.ant-alert-banner')
      .as('banner')
      .find('span')
      .contains(INFO.JOIN_BUILDERS_PROGRAM)
      .should('exist')
      .and('be.visible')
    cy.get('@banner')
      .find('a')
      .as('banner-link')
      .should('have.text', INFO.BUILDERS_PROGRAM)
      .and(
        'have.attr',
        'href',
        'https://builders.toposware.com/topos-builders-program-v1-0'
      )
      .and('not.be.disabled')
  })

  it('should have disabled address input', () => {
    cy.get('#faucet_address').should('be.visible').and('be.disabled')
  })
})
