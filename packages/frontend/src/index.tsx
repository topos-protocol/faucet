import { ConfigProvider, theme } from 'antd'
import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'
import reportWebVitals from './reportWebVitals'
import './telemetry'

// Allow for JSON.stringify for objects containing bigints
Object.defineProperty(BigInt.prototype, 'toJSON', {
  get() {
    'use strict'
    return () => String(this)
  },
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
