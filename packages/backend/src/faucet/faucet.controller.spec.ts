import { Test, TestingModule } from '@nestjs/testing'
import { trace } from '@opentelemetry/api'

import { FaucetController } from './faucet.controller'
import { GetSubnetAssetsDto } from './faucet.dto'
import {} from './faucet.errors'
import { FaucetService } from './faucet.service'

const validGetSubnetAssetDto: GetSubnetAssetsDto = {
  address: '',
  subnetEndpoints: ['', ''],
}

const tracerMock = { startActiveSpan: jest.fn(), startSpan: jest.fn() }
jest.spyOn(trace, 'getTracer').mockReturnValue(tracerMock)

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
    it('should call faucetService.getSubnetAssets', async () => {
      await faucetController.getSubnetAssets(validGetSubnetAssetDto)
      expect(faucetService.getSubnetAssets).toHaveBeenCalled()
      expect(tracerMock.startActiveSpan).toHaveBeenCalled()
    })
  })
})
