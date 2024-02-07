import { ERROR } from '../../src/constants/wordings'
import TestId from '../../src/utils/testId'

describe('Home', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.get(`[data-testid="${TestId.FAUCET_FORM_FIELD_SUBNETS}"]`).as(
      'subnetIds'
    )
    cy.get(`[data-testid="${TestId.FAUCET_FORM_FIELD_ADDRESS}"]`).as('address')
    cy.get(`[data-testid="${TestId.FAUCET_FORM_ACTION_SUBMIT}"]`).as('submit')
  })

  it('should have visible subnets form field', function () {
    cy.get(this.subnetIds).should('be.visible')
  })

  it('should have visible and enabled address form field', function () {
    cy.get(this.address).should('be.visible')
  })

  describe('SubnetIds', function () {
    it('should have Topos and Incal pre-selected', function () {
      cy.get(this.subnetIds).within(() => {
        cy.contains('Topos').should('be.visible')
        cy.contains('Incal').should('be.visible')
      })
    })
  })

  describe('Address', function () {
    it('should have an enabled input', function () {
      cy.get(this.address).within(() => {
        cy.get('input').should('be.visible').and('be.enabled')
      })
    })
  })

  it('should have visible and enabled submit button', function () {
    cy.get(this.submit).should('be.visible').and('be.enabled')
  })

  describe('Form submission', function () {
    it('should fail if no address', function () {
      cy.get(this.submit).click()
      cy.get(this.address)
        .parents('.ant-form-item')
        .should('have.class', 'ant-form-item-has-error')
      cy.get('#faucet_address_help').should('have.text', ERROR.MISSING_ADDRESS)
    })

    it('should fail if invalid address', function () {
      cy.get(this.address).type('invalidaddress')
      cy.get(this.submit).click()
      cy.get(this.address)
        .parents('.ant-form-item')
        .should('have.class', 'ant-form-item-has-error')
      cy.get('#faucet_address_help').should('have.text', ERROR.INVALID_ADDRESS)
    })

    it('should succeed if valid address', function () {
      cy.get(this.address).type('0x178A3b1584Fd4E616d887F614eDb378A41A621B7')
      cy.get(this.submit).click()
    })
  })
})
