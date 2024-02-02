import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { SpanStatusCode, trace } from '@opentelemetry/api'
import {
  Provider,
  getDefaultProvider,
  parseUnits,
  TransactionReceipt,
  Wallet,
} from 'ethers'

import { getErrorMessage } from '../utils'
import { TRANSACTION_AMOUNT } from './faucet.constants'
import { GetSubnetAssetsDto } from './faucet.dto'
import { PROVIDER_ERRORS, WALLET_ERRORS } from './faucet.errors'

@Injectable()
export class FaucetService {
  private _tracer = trace.getTracer('FaucetService')
  constructor(private configService: ConfigService) {}

  async getSubnetAssets({ address, subnetEndpoints }: GetSubnetAssetsDto) {
    return this._tracer.startActiveSpan('getSubnetAssets', async (span) => {
      span.setAttributes({
        address,
        subnetEndpoints,
      })
      const promises: Array<Promise<Partial<TransactionReceipt>>> = []

      for (const endpoint of subnetEndpoints) {
        promises.push(
          new Promise<Partial<TransactionReceipt>>(async (resolve, reject) => {
            try {
              const { logsBloom, ...receipt } = await this._sendTransaction(
                address,
                endpoint
              )
              span.setAttribute(
                `receipt-${endpoint.replace('.', '-')}`,
                JSON.stringify(receipt)
              )
              resolve(receipt)
            } catch (error) {
              const message = getErrorMessage(error)
              span.setAttribute(`error-${endpoint.replace('.', '-')}`, message)
              reject(error)
            }
          })
        )
      }

      return Promise.all(promises)
        .then((receipts) => {
          span.setStatus({ code: SpanStatusCode.OK })
          return receipts
        })
        .catch((error) => {
          const message = getErrorMessage(error)
          span.setStatus({ code: SpanStatusCode.ERROR, message })
        })
        .finally(() => {
          span.end()
        })
    })
  }

  private async _sendTransaction(address: string, subnetEndpoint: string) {
    return new Promise<TransactionReceipt>(async (resolve, reject) => {
      try {
        const provider = await this._createProvider(subnetEndpoint)

        const wallet = this._createWallet(provider)

        const tx = await wallet.sendTransaction({
          to: address,
          value: parseUnits(TRANSACTION_AMOUNT),
        })

        const receipt = await tx.wait()
        resolve(receipt)
      } catch (error) {
        reject(error)
      }
    })
  }

  private _createProvider(endpoint: string) {
    return new Promise<Provider>((resolve, reject) => {
      const provider = getDefaultProvider(endpoint)

      // Fix: Timeout to leave time to errors to be asynchronously caught
      const timeoutId = setTimeout(() => {
        resolve(provider)
      }, 1000)

      provider.on('debug', (data) => {
        if (data.error) {
          clearTimeout(timeoutId)
          reject(new Error(PROVIDER_ERRORS.INVALID_ENDPOINT))
        }
      })
    })
  }

  private _createWallet(provider: Provider) {
    try {
      return new Wallet(this.configService.get('PRIVATE_KEY') || '', provider)
    } catch (error) {
      throw new Error(WALLET_ERRORS.INVALID_PRIVATE_KEY)
    }
  }
}
