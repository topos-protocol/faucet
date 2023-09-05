import { init as initApm, apm } from '@elastic/apm-rum'
import { ConfigProvider, theme } from 'antd'
import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'
import reportWebVitals from './reportWebVitals'

const VITE_ELASTIC_APM_ENDPOINT =
  import.meta.env.VITE_ELASTIC_APM_ENDPOINT || ''
const VITE_TRACING_SERVICE_NAME =
  import.meta.env.VITE_TRACING_SERVICE_NAME || 'faucet-web'
const VITE_TRACING_SERVICE_VERSION =
  import.meta.env.VITE_TRACING_SERVICE_VERSION || ''

initApm({
  serviceName: VITE_TRACING_SERVICE_NAME,
  serverUrl: VITE_ELASTIC_APM_ENDPOINT,
  serviceVersion: VITE_TRACING_SERVICE_VERSION,
  instrument: false,
  // environment: 'local',
  // propagateTracestate: true,
  // distributedTracingOrigins: ['http://localhost:10002'],
  // disableInstrumentations: ['page-load'],
})

apm.addFilter((payload) => {
  if (payload.transactions) {
    payload.transactions.forEach((tr: any) => {
      const filteredSpans = tr.spans.filter(
        (span: any) => span.type !== 'resource'
      )
      tr.spans = filteredSpans
    })
  }
  return payload
})

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        components: {
          Layout: {
            colorBgHeader: 'transparent',
          },
          Menu: {
            colorItemBg: 'transparent',
          },
        },
      }}
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
