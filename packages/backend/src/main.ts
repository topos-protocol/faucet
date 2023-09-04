import { ValidationPipe } from '@nestjs/common'
import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import * as ElasticAPM from 'elastic-apm-node'

import './tracing'
import { AppModule } from './app/app.module'

export const SERVICE_NAME = process.env.TRACING_SERVICE_NAME || 'faucet-server'
export const SERVICE_VERSION = process.env.TRACING_SERVICE_VERSION || 'unknown'
export const ELASTIC_APM_ENDPOINT = process.env.ELASTIC_APM_ENDPOINT || ''
export const ELASTIC_APM_TOKEN = process.env.ELASTIC_APM_TOKEN || ''

export const apm = ElasticAPM.start({
  serviceName: SERVICE_NAME,
  secretToken: ELASTIC_APM_TOKEN,
  serverUrl: ELASTIC_APM_ENDPOINT,
  environment: 'local',
  opentelemetryBridgeEnabled: true,
  captureBody: 'all',
})

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe())

  const globalPrefix = 'api'
  app.setGlobalPrefix(globalPrefix)

  const port = process.env.PORT || 3000

  await app.listen(port)

  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  )
}

bootstrap()
