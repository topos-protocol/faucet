import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import * as ethers from 'ethers'
import { EventEmitter } from 'stream'

import { TRANSACTION_AMOUNT } from './faucet.constants'
import { GetSubnetAssetsDto } from './faucet.dto'
import { FaucetService } from './faucet.service'

const validGetSubnetAssetDto: GetSubnetAssetsDto = {
  address: 'address',
  subnetEndpoints: ['ws://endpoint1/ws', 'ws://endpoint2/ws'],
}

const providerMock = new EventEmitter()
const walletMock = {
  sendTransaction: jest
    .fn()
    .mockResolvedValue({ wait: jest.fn().mockResolvedValue({}) }),
}

const VALID_PRIVATE_KEY =
  '0xc6cbd7d76bc5baca530c875663711b947efa6a86a900a9e8645ce32e5821484e'

describe('FaucetService', () => {
  let app: TestingModule
  let faucetService: FaucetService

  beforeEach(async () => {
    app = await Test.createTestingModule({
      providers: [FaucetService],
    })
      .useMocker((token) => {
        if (token === ConfigService) {
          return {
            get: jest.fn().mockImplementation((key: string) => {
              switch (key) {
                case 'PRIVATE_KEY':
                  return VALID_PRIVATE_KEY
              }
            }),
          }
        }
      })
      .compile()

    faucetService = app.get(FaucetService)
  })

  describe('getSubnetAssets', () => {
    it('should go through if getSubnetAssetDto is valid', async () => {
      const ethersProviderMock = jest
        .spyOn<any, any>(ethers, 'getDefaultProvider')
        .mockReturnValue(providerMock)

      const ethersWalletMock = jest
        .spyOn<any, any>(ethers, 'Wallet')
        .mockReturnValue(walletMock)

      await faucetService.getSubnetAssets(validGetSubnetAssetDto)

      validGetSubnetAssetDto.subnetEndpoints.forEach((subnetEndpoint) => {
        expect(ethersProviderMock).toHaveBeenCalledWith(subnetEndpoint)

        expect(ethersWalletMock).toHaveBeenCalledWith(
          VALID_PRIVATE_KEY,
          providerMock
        )

        expect(walletMock.sendTransaction).toHaveBeenCalledWith({
          to: 'address',
          value: ethers.parseUnits(TRANSACTION_AMOUNT),
        })
      })
    })
  })
})
