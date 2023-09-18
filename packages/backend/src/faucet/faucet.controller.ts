import { Body, Controller, Headers, Post, UseGuards } from '@nestjs/common'

import { GetSubnetAssetsDto } from './faucet.dto'
import { FaucetService } from './faucet.service'
import { ThrottlerBehindProxyGuard } from './throttler.guard'

@Controller('faucet')
export class FaucetController {
  constructor(private faucetService: FaucetService) {}

  @Post('getSubnetAssets')
  @UseGuards(ThrottlerBehindProxyGuard)
  async getSubnetAssets(
    @Body() getSubnetAssetsDto: GetSubnetAssetsDto,
    @Headers('traceparent') traceparent: string
  ) {
    return this.faucetService.getSubnetAssets(getSubnetAssetsDto, traceparent)
  }
}
