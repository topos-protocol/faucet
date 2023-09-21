import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { ServeStaticModule } from '@nestjs/serve-static'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { join } from 'path'

import { FaucetModule } from '../faucet/faucet.module'

const THROTTLER_TTL_SECONDS = process.env.THROTTLER_TTL_SECONDS
  ? parseInt(process.env.THROTTLER_TTL_SECONDS)
  : 86_400

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', '..', 'frontend', 'dist'),
    }),
    // ThrottlerModule.forRoot({
    //   ttl: THROTTLER_TTL_SECONDS,
    //   limit: 1,
    // }),
    FaucetModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
