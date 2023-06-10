import { ThemeProvider } from '@emotion/react'
import styled from '@emotion/styled'
import { Alert, Layout as AntdLayout } from 'antd'
import React, { useEffect, useMemo } from 'react'

import { ErrorsContext } from './contexts/errors'
import Footer from './components/Footer'
import Header from './components/Header'

import 'antd/dist/reset.css'
import useTheme from './hooks/useTheme'
import FaucetForm from './components/FaucetForm'
import Content from './components/Content'
import { SERVICE_NAME } from './tracing'
import { trace } from '@opentelemetry/api'
import { TracingContext } from './contexts/tracing'

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
  const [errors, setErrors] = React.useState<string[]>([])

  const rootSpan = useMemo(() => {
    const tracer = trace.getTracer(SERVICE_NAME)
    return tracer.startSpan('root')
  }, [])

  useEffect(function init() {
    return function onPageClosed() {
      rootSpan.end()
    }
  })

  return (
    <ThemeProvider theme={theme}>
      <TracingContext.Provider value={{ rootSpan }}>
        <ErrorsContext.Provider value={{ setErrors }}>
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
        </ErrorsContext.Provider>
      </TracingContext.Provider>
    </ThemeProvider>
  )
}

export default App
