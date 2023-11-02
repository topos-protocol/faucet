import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { ServeStaticModule } from '@nestjs/serve-static'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { join } from 'path'

import { TelemetryModule } from '../telemetry/telemetry.module'
import { FaucetModule } from '../faucet/faucet.module'

@Module({
  imports: [
    TelemetryModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', '..', 'frontend', 'dist'),
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ttl: config.get('THROTTLER_TTL_SECONDS') || 86_400,
        limit: 1,
      }),
    }),
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
