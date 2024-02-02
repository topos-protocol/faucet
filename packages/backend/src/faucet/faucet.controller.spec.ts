import { Test, TestingModule } from '@nestjs/testing'

import { FaucetController } from './faucet.controller'
import { GetSubnetAssetsDto } from './faucet.dto'
import {} from './faucet.errors'
import { FaucetService } from './faucet.service'

const validGetSubnetAssetDto: GetSubnetAssetsDto = {
  address: '',
  subnetEndpoints: ['', ''],
}

describe('FaucetController', () => {
  let app: TestingModule
  let faucetController: FaucetController
  let faucetService: FaucetService

  beforeEach(async () => {
    app = await Test.createTestingModule({
      controllers: [FaucetController],
    })
      .useMocker((token) => {
        if (token === FaucetService) {
          return {
            getSubnetAssets: jest.fn().mockResolvedValue({}),
          }
        }
      })
      .compile()

    faucetController = app.get(FaucetController)
    faucetService = app.get(FaucetService)
  })

  describe('getSubnetAssets', () => {
    it('should complete', async () => {
      expect(
        await faucetController.getSubnetAssets(validGetSubnetAssetDto)
      ).toEqual({})
    })

    it('should call faucetService.getSubnetAssets', async () => {
      await faucetController.getSubnetAssets(validGetSubnetAssetDto)
      expect(faucetService.getSubnetAssets).toHaveBeenCalled()
    })
  })
})
