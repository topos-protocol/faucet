import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ethers, providers } from 'ethers'

import { GetSubnetAssetsDto } from './faucet.dto'
import { apm } from '../main'
import { sanitizeURLProtocol } from '../utils'
import { PROVIDER_ERRORS, WALLET_ERRORS } from './faucet.errors'
import { Transaction } from 'elastic-apm-node'

@Injectable()
export class FaucetService {
  constructor(private configService: ConfigService) {}

  async getSubnetAssets(
    { address, subnetEndpoints }: GetSubnetAssetsDto,
    traceparent?: string
  ) {
    const apmTransaction = apm.startTransaction('root-server', {
      childOf: traceparent,
    })

    return Promise.all(
      subnetEndpoints.map((endpoint, index) =>
        this._sendTransaction(address, endpoint, {
          apmSpanIndex: index,
          apmTransaction,
        })
      )
    ).finally(() => {
      apmTransaction.end()
    })
  }

  private async _sendTransaction(
    address: string,
    subnetEndpoint: string,
    {
      apmSpanIndex,
      apmTransaction,
    }: { apmSpanIndex: number; apmTransaction: Transaction }
  ) {
    return new Promise<providers.TransactionReceipt>(
      async (resolve, reject) => {
        try {
          const span = apmTransaction.startSpan(
            `get-subnet-asset-${apmSpanIndex}`
          )
          span.addLabels({ address, subnetEndpoint })

          const provider = await this._createProvider(subnetEndpoint)

          const wallet = this._createWallet(provider)

          const tx = await wallet.sendTransaction({
            to: address,
            value: ethers.utils.parseUnits('1.0'),
          })

          const receipt = await tx.wait()

          span.end()

          resolve(receipt)
        } catch (error) {
          reject(error)
        }
      }
    )
  }

  private _createProvider(endpoint: string) {
    return new Promise<providers.WebSocketProvider>((resolve, reject) => {
      const provider = new ethers.providers.WebSocketProvider(
        sanitizeURLProtocol('ws', `${endpoint}/ws`)
      )

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

  private _createWallet(provider: providers.WebSocketProvider) {
    try {
      return new ethers.Wallet(
        this.configService.get<string>('PRIVATE_KEY'),
        provider
      )
    } catch (error) {
      throw new Error(WALLET_ERRORS.INVALID_PRIVATE_KEY)
    }
  }
}
