import { ThrottlerGuard } from '@nestjs/throttler'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ThrottlerBehindProxyGuard extends ThrottlerGuard {
  protected getTracker(req: Record<string, any>) {
    console.log('headers', req.headers)
    console.log('x-forwarded-for', req.headers['x-forwarded-for'])
    console.log('connection.remoteAddress', req.connection.remoteAddress)
    console.log('IPs from request headers', req.ips)
    console.log('IP from request', req.ip)
    return req.headers['x-forwarded-for']
      ? req.headers['x-forwarded-for']
      : req.ip
  }
}
