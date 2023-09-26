import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import apm, * as ElasticAPM from 'elastic-apm-node'

@Injectable()
export class ApmService {
  private _apm: ElasticAPM.Agent

  constructor(private configService: ConfigService) {
    this._apm = ElasticAPM.start({
      serviceName:
        this.configService.get('TRACING_SERVICE_NAME') || 'faucet-server',
      secretToken: this.configService.get('ELASTIC_APM_TOKEN') || '',
      serverUrl: this.configService.get('ELASTIC_APM_ENDPOINT') || '',
      environment:
        this.configService.get('TRACING_SERVICE_VERSION') || 'unknown',
      captureBody: 'all',
    })
  }

  startTransaction(name: string, traceparent?: string) {
    return this._apm.startTransaction(
      name,
      traceparent
        ? {
            childOf: traceparent,
          }
        : undefined
    )
  }

  startChildSpan(name: string) {
    return this._apm.startSpan(name)
  }

  captureError(error: string) {
    this._apm.captureError(error)
  }
}
