import { Body, Controller, Headers, Post } from '@nestjs/common'
import { context, metrics, propagation, trace } from '@opentelemetry/api'

import { GetSubnetAssetsDto } from './faucet.dto'
import { FaucetService } from './faucet.service'

@Controller('faucet')
export class FaucetController {
  private _tracer = trace.getTracer('FaucetController')
  private _meter = metrics.getMeter('FaucetController')
  private _counter = this._meter.createCounter('get_subnet_assets.counter')

  constructor(private faucetService: FaucetService) {}

  @Post('getSubnetAssets')
  async getSubnetAssets(
    @Body() getSubnetAssetsDto: GetSubnetAssetsDto,
    @Headers('traceparent') traceparent?: string,
    @Headers('tracestate') tracestate?: string
  ) {
    this._counter.add(1)

    const activeContext = propagation.extract(context.active(), {
      traceparent,
      tracestate,
    })

    return context.with(activeContext, async () => {
      return this._tracer.startActiveSpan('getSubnetAssets', async (span) => {
        const receipts = await this.faucetService.getSubnetAssets(
          getSubnetAssetsDto
        )
        span.end()
        return receipts
      })
    })
  }
}
