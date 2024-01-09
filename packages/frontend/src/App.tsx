import { ThemeProvider } from '@emotion/react'
import styled from '@emotion/styled'
import { ToposCore__factory } from '@topos-protocol/topos-smart-contracts/typechain-types/factories/contracts/topos-core/ToposCore__factory'
import { Alert, Layout as AntdLayout } from 'antd'
import { getDefaultProvider } from 'ethers'
import { useEffect, useState } from 'react'

import { ErrorsContext } from './contexts/errors'
import Footer from './components/Footer'
import Header from './components/Header'

import 'antd/dist/reset.css'
import useTheme from './hooks/useTheme'
import FaucetForm from './components/FaucetForm'
import Content from './components/Content'
import { SubnetWithId } from './types'
import useRegisteredSubnets from './hooks/useRegisteredSubnets'
import { SubnetsContext } from './contexts/subnets'
import { SuccessesContext } from './contexts/successes'

const Errors = styled.div`
  margin: 1rem auto;
  width: 80%;
  max-width: 800px;
  z-index: 99999;
`

const Successes = styled.div`
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
  const [successes, setSuccesses] = useState<string[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [subnets, setSubnets] = useState<SubnetWithId[]>()
  const { registeredSubnets } = useRegisteredSubnets()

  useEffect(
    function onRegisteredSubnetsChange() {
      async function _() {
        if (registeredSubnets) {
          const toposSubnetEndpointHttp = import.meta.env
            .VITE_TOPOS_SUBNET_ENDPOINT_HTTP
          const toposSubnetEndpointWs = import.meta.env
            .VITE_TOPOS_SUBNET_ENDPOINT_WS
          let toposSubnet: SubnetWithId | undefined

          if (toposSubnetEndpointHttp && toposSubnetEndpointWs) {
            const provider = getDefaultProvider(toposSubnetEndpointHttp)
            const network = await provider.getNetwork()
            const chainId = network.chainId

            const toposCore = ToposCore__factory.connect(
              import.meta.env.VITE_TOPOS_CORE_PROXY_CONTRACT_ADDRESS,
              provider
            )
            const subnetId = await toposCore.networkSubnetId()

            toposSubnet = {
              chainId: BigInt(chainId.toString()),
              endpointHttp: toposSubnetEndpointHttp,
              endpointWs: toposSubnetEndpointWs,
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

  return (
    <ThemeProvider theme={theme}>
      <ErrorsContext.Provider value={{ setErrors }}>
        <SuccessesContext.Provider value={{ setSuccesses }}>
          <SubnetsContext.Provider
            value={{
              loading: !Boolean(subnets),
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
              {Boolean(successes.length) && (
                <Successes>
                  {successes.map((e) => (
                    <Alert
                      type="success"
                      showIcon
                      closable
                      message={e}
                      key={e}
                    />
                  ))}
                </Successes>
              )}
              <Content>
                <FaucetForm />
              </Content>
              <Footer />
            </Layout>
          </SubnetsContext.Provider>
        </SuccessesContext.Provider>
      </ErrorsContext.Provider>
    </ThemeProvider>
  )
}

export default App
