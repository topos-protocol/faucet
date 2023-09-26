import { Module } from '@nestjs/common'

import { ApmModule } from '../apm/apm.module'
import { FaucetController } from './faucet.controller'
import { FaucetService } from './faucet.service'

@Module({
  controllers: [FaucetController],
  imports: [ApmModule],
  providers: [FaucetService],
})
export class FaucetModule {}
