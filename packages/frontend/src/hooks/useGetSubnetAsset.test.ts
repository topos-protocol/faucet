import { renderHook } from '@testing-library/react'
import axios from 'axios'
import { createContext } from 'react'
import { vi } from 'vitest'

import * as ErrorsContextExports from '../contexts/errors'
import * as SuccessesContextExports from '../contexts/successes'
import { TracingOptions } from '../types'
import useGetSubnetAsset from './useGetSubnetAsset'

const addressMock = ''
const subnetEndpointsMock = ['endpoint1', 'endpoint2']
const tracingOptionsMock: TracingOptions = { traceparent: '', tracestate: '' }

const setErrorsMock = vi.fn().mockReturnValue({})
vi.spyOn(ErrorsContextExports, 'ErrorsContext', 'get').mockReturnValue(
  createContext<ErrorsContextExports.ErrorsContext>({
    setErrors: setErrorsMock,
  })
)

const setSuccessesMock = vi.fn().mockReturnValue({})
vi.spyOn(SuccessesContextExports, 'SuccessesContext', 'get').mockReturnValue(
  createContext<SuccessesContextExports.SuccessesContext>({
    setSuccesses: setSuccessesMock,
  })
)

const axiosPostSpy = vi.spyOn(axios, 'post')

describe('useGetSubnetAsset', () => {
  it('should set success message if http request succeeds', async () => {
    axiosPostSpy.mockResolvedValueOnce({})
    const { result } = renderHook(() => useGetSubnetAsset())

    await result.current.getSubnetAsset(
      addressMock,
      subnetEndpointsMock,
      tracingOptionsMock
    )

    expect(setSuccessesMock).toHaveBeenCalled()
    expect(setErrorsMock).toHaveBeenCalledWith([])
  })

  it('should set rate limiting error message if http request fails with HTTP 429 code', async () => {
    const retryAfterMock = 10
    const errorMock = {
      response: { headers: { 'retry-after': retryAfterMock }, status: 429 },
    }
    axiosPostSpy.mockRejectedValueOnce(errorMock)

    const { result } = renderHook(() => useGetSubnetAsset())

    const promise = result.current.getSubnetAsset(
      addressMock,
      subnetEndpointsMock,
      tracingOptionsMock
    )

    expect(promise).rejects.toBeTruthy()

    promise.catch(() => {
      expect(setErrorsMock).toHaveBeenCalledWith([
        `You cannot use the faucet again before ${retryAfterMock}s`,
      ])
      expect(setSuccessesMock).toHaveBeenCalledWith([])
    })
  })

  it('should set default error message if http request fails with other HTTP code', async () => {
    const errorMessageMock = 'test error message'
    const errorMock = {
      message: errorMessageMock,
      response: { status: 400 },
    }
    axiosPostSpy.mockRejectedValueOnce(errorMock)

    const { result } = renderHook(() => useGetSubnetAsset())

    const promise = result.current.getSubnetAsset(
      addressMock,
      subnetEndpointsMock,
      tracingOptionsMock
    )

    expect(promise).rejects.toBeTruthy()

    promise.catch(() => {
      expect(setErrorsMock).toHaveBeenCalledWith([
        `Error when requesting assets to ${addressMock}: ${errorMessageMock}`,
      ])
      expect(setSuccessesMock).toHaveBeenCalledWith([])
    })
  })
})
