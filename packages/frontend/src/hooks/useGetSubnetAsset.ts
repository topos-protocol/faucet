import axios from 'axios'
import { useCallback, useContext, useState } from 'react'

import { SUCCESS } from '../constants/wordings'
import { ErrorsContext } from '../contexts/errors'
import { SuccessesContext } from '../contexts/successes'
import { TracingOptions } from '../types'

export default function useGetSubnetAsset() {
  const { setErrors } = useContext(ErrorsContext)
  const { setSuccesses } = useContext(SuccessesContext)
  const [loading, setLoading] = useState(false)

  const getSubnetAsset = useCallback(
    (
      address: string,
      subnetEndpoints: string[],
      { traceparent, tracestate }: TracingOptions
    ) => {
      setLoading(true)

      return new Promise<void>((resolve, reject) => {
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
                tracestate,
              },
            }
          )
          .then(() => {
            setErrors([])
            setSuccesses((s) => [...s, SUCCESS.GET_SUBNET_ASSET])
            resolve()
          })
          .catch((error) => {
            let _error: string
            console.log(error)
            switch (error?.response?.status) {
              case 429: // Too many requests
                _error = `You cannot use the faucet again before ${error?.response?.headers['retry-after']}s`
                break
              default:
                _error = `Error when requesting assets to ${address}: ${error.message}`
            }
            setSuccesses([])
            setErrors([_error])
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
