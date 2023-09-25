import { Body, Controller, Headers, Post } from '@nestjs/common'

import { GetSubnetAssetsDto } from './faucet.dto'
import { FaucetService } from './faucet.service'

@Controller('faucet')
export class FaucetController {
  constructor(private faucetService: FaucetService) {}

  @Post('getSubnetAssets')
  async getSubnetAssets(
    @Body() getSubnetAssetsDto: GetSubnetAssetsDto,
    @Headers('traceparent') traceparent: string
  ) {
    return this.faucetService.getSubnetAssets(getSubnetAssetsDto, traceparent)
  }
}
