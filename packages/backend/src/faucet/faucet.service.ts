import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { providers, utils, Wallet } from 'ethers'

import { GetSubnetAssetsDto } from './faucet.dto'
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
            value: utils.parseUnits('1.0'),
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
    return new Promise<providers.WebSocketProvider | providers.JsonRpcProvider>(
      (resolve, reject) => {
        const url = new URL(endpoint)
        const provider = url.protocol.startsWith('ws')
          ? new providers.WebSocketProvider(endpoint)
          : new providers.JsonRpcProvider(endpoint)

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
      }
    )
  }

  private _createWallet(
    provider: providers.WebSocketProvider | providers.JsonRpcProvider
  ) {
    try {
      return new Wallet(this.configService.get<string>('PRIVATE_KEY'), provider)
    } catch (error) {
      this.apmService.captureError(error)
      throw new Error(WALLET_ERRORS.INVALID_PRIVATE_KEY)
    }
  }
}
