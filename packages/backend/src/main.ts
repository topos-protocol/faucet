import { ValidationPipe } from '@nestjs/common'
import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'

import { AppModule } from './app/app.module'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  // See https://docs.nestjs.com/security/rate-limiting#proxies
  app.set('trust proxy', true)

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
