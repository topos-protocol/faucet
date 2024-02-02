import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

import TestId from '../utils/testId'
import { SubnetsContext } from '../contexts/subnets'
import { SubnetWithId } from '../types'
import FaucetForm from './FaucetForm'

const subnetsMock: SubnetWithId[] = [
  {
    chainId: BigInt(1),
    currencySymbol: 'TST',
    endpointHttp: '',
    endpointWs: '',
    id: 'subnet1',
    logoURL: '',
    name: 'subnet1',
  },
  {
    chainId: BigInt(2),
    currencySymbol: 'TST2',
    endpointHttp: '',
    endpointWs: '',
    id: 'subnet2',
    logoURL: '',
    name: 'subnet2',
  },
]

vi.mock('../hooks/useGetSubnetAsset', () => ({
  default: vi.fn().mockReturnValue({
    getSubnetAsset: vi.fn().mockResolvedValue({}),
    loading: true,
  }),
}))

describe('FaucetForm', () => {
  it('should display loader if context passes loading', async () => {
    render(
      <SubnetsContext.Provider value={{ loading: true }}>
        <FaucetForm />
      </SubnetsContext.Provider>
    )
    expect(screen.queryByTestId(TestId.FAUCET_FORM_SPIN)).toBeInTheDocument()
  })

  it('should not display loader if context passes no loading', async () => {
    render(
      <SubnetsContext.Provider value={{ loading: false }}>
        <FaucetForm />
      </SubnetsContext.Provider>
    )
    expect(
      screen.queryByTestId(TestId.FAUCET_FORM_SPIN)
    ).not.toBeInTheDocument()
  })

  it('should display form fields if context passes no loading', async () => {
    render(
      <SubnetsContext.Provider value={{ loading: false }}>
        <FaucetForm />
      </SubnetsContext.Provider>
    )
    expect(
      screen.queryByTestId(TestId.FAUCET_FORM_FIELD_SUBNETS)
    ).toBeInTheDocument()
    expect(
      screen.queryByTestId(TestId.FAUCET_FORM_FIELD_ADDRESS)
    ).toBeInTheDocument()
    expect(
      screen.queryByTestId(TestId.FAUCET_FORM_RECAPTCHA)
    ).toBeInTheDocument()
    expect(
      screen.queryByTestId(TestId.FAUCET_FORM_ACTION_SUBMIT)
    ).toBeInTheDocument()
  })

  it('should prepopulate subnets field with context', async () => {
    render(
      <SubnetsContext.Provider value={{ data: subnetsMock, loading: false }}>
        <FaucetForm />
      </SubnetsContext.Provider>
    )

    const subnetsField = screen.queryByTestId(TestId.FAUCET_FORM_FIELD_SUBNETS)

    subnetsMock.forEach((subnet) => {
      expect(subnetsField).toHaveTextContent(subnet.name)
    })
  })
})
