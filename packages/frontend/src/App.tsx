import { apm } from '@elastic/apm-rum'
import { ThemeProvider } from '@emotion/react'
import styled from '@emotion/styled'
import { Alert, Layout as AntdLayout } from 'antd'
import { useEffect, useMemo, useState } from 'react'

import { ErrorsContext } from './contexts/errors'
import Footer from './components/Footer'
import Header from './components/Header'

import 'antd/dist/reset.css'
import useTheme from './hooks/useTheme'
import FaucetForm from './components/FaucetForm'
import Content from './components/Content'
import { TracingContext } from './contexts/tracing'
import { SubnetWithId } from './types'
import useRegisteredSubnets from './hooks/useRegisteredSubnets'
import { BigNumber, ethers } from 'ethers'
import { sanitizeURLProtocol } from './utils'
import { SubnetsContext } from './contexts/subnets'
import { toposCoreContract } from './contracts'

const Errors = styled.div`
  margin: 1rem auto;
  width: 80%;
  max-width: 800px;
  z-index: 99999;
`

const Layout = styled(AntdLayout)`
  min-height: 100vh;
`

const App = () => {
  const theme = useTheme()
  const [errors, setErrors] = useState<string[]>([])
  const [subnets, setSubnets] = useState<SubnetWithId[]>()
  const { loading, registeredSubnets } = useRegisteredSubnets()

  useEffect(
    function onRegisteredSubnetsChange() {
      async function _() {
        if (registeredSubnets) {
          const toposSubnetEndpoint = import.meta.env.VITE_TOPOS_SUBNET_ENDPOINT
          let toposSubnet: SubnetWithId | undefined

          if (toposSubnetEndpoint) {
            const provider = new ethers.providers.JsonRpcProvider(
              sanitizeURLProtocol('http', toposSubnetEndpoint)
            )
            const network = await provider.getNetwork()
            const chainId = network.chainId

            const contract = toposCoreContract.connect(provider)
            const subnetId = await contract.networkSubnetId()

            toposSubnet = {
              chainId: BigNumber.from(chainId.toString()),
              endpoint: toposSubnetEndpoint,
              currencySymbol: 'TOPOS',
              id: subnetId,
              logoURL: '/logo.svg',
              name: 'Topos',
            }
          }

          setSubnets(
            toposSubnet
              ? [toposSubnet, ...(registeredSubnets || [])]
              : registeredSubnets
          )
        }
      }

      _()
    },
    [registeredSubnets]
  )

  const apmTransaction = useMemo(
    () => apm.startTransaction('root', 'app', { managed: true }),
    []
  )

  return (
    <ThemeProvider theme={theme}>
      <TracingContext.Provider value={{ transaction: apmTransaction }}>
        <ErrorsContext.Provider value={{ setErrors }}>
          <SubnetsContext.Provider
            value={{
              loading,
              data: subnets,
            }}
          >
            <Layout>
              <Header />
              {Boolean(errors.length) && (
                <Errors>
                  {errors.map((e) => (
                    <Alert type="error" showIcon closable message={e} key={e} />
                  ))}
                </Errors>
              )}
              <Content>
                <FaucetForm />
              </Content>
              <Footer />
            </Layout>
          </SubnetsContext.Provider>
        </ErrorsContext.Provider>
      </TracingContext.Provider>
    </ThemeProvider>
  )
}

export default App
