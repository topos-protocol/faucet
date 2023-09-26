import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ethers, providers } from 'ethers'

import { GetSubnetAssetsDto } from './faucet.dto'
import { sanitizeURLProtocol } from '../utils'
import { PROVIDER_ERRORS, WALLET_ERRORS } from './faucet.errors'
import { ApmService } from 'src/apm/apm.service'

@Injectable()
export class FaucetService {
  constructor(
    private configService: ConfigService,
    private apmService: ApmService
  ) {}

  async getSubnetAssets(
    { address, subnetEndpoints }: GetSubnetAssetsDto,
    traceparent?: string
  ) {
    const apmTransaction = this.apmService.startTransaction(
      'faucetService.getSubnetAssets',
      traceparent
    )

    apmTransaction.addLabels({
      address,
      subnetEndpoints: JSON.stringify(subnetEndpoints),
    })

    const promises = []

    for (const endpoint of subnetEndpoints) {
      promises.push(
        new Promise(async (resolve, reject) => {
          try {
            const { logsBloom, ...receipt } = await this._sendTransaction(
              address,
              endpoint
            )
            apmTransaction.addLabels({
              [`receipt-${endpoint.replace('.', '-')}`]:
                JSON.stringify(receipt),
            })
            resolve(receipt)
          } catch (error) {
            this.apmService.captureError(error)
            reject(error)
          }
        })
      )
    }

    const receipts = await Promise.all(promises)

    apmTransaction.end()

    return receipts
  }

  private async _sendTransaction(address: string, subnetEndpoint: string) {
    return new Promise<providers.TransactionReceipt>(
      async (resolve, reject) => {
        try {
          const provider = await this._createProvider(subnetEndpoint)

          const wallet = this._createWallet(provider)

          const tx = await wallet.sendTransaction({
            to: address,
            value: ethers.utils.parseUnits('1.0'),
          })

          const receipt = await tx.wait()
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
          this.apmService.captureError(data.error)
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
      this.apmService.captureError(error)
      throw new Error(WALLET_ERRORS.INVALID_PRIVATE_KEY)
    }
  }
}
