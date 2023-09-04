import axios from 'axios'
import React, { useCallback } from 'react'

import { ErrorsContext } from '../contexts/errors'
import { apm } from '@elastic/apm-rum'

export default function useGetSubnetAsset() {
  const { setErrors } = React.useContext(ErrorsContext)
  const [loading, setLoading] = React.useState(false)

  const getSubnetAsset = useCallback(
    (address: string, subnetEndpoints: string[], traceparent: string) => {
      setLoading(true)

      return new Promise((resolve, reject) => {
        axios
          .post(
            'api/faucet/getSubnetAssets',
            {
              address,
              subnetEndpoints,
            },
            {
              headers: {
                traceparent,
              },
            }
          )
          .then(resolve)
          .catch((error) => {
            apm.captureError(error)

            let _error: string
            switch (error?.response?.status) {
              case 429: // Too many requests
                _error = `Too many requests, try after ${error?.response?.headers['retry-after']}s`
                break
              default:
                _error = `Error when requesting assets to ${address}: ${error.message}`
            }
            setErrors((e) => [...e, _error])
            reject(error)
          })
          .finally(() => {
            setLoading(false)
          })
      })
    },
    []
  )

  return { loading, getSubnetAsset }
}
