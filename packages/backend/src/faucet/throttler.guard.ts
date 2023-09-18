import { ThrottlerGuard } from '@nestjs/throttler'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ThrottlerBehindProxyGuard extends ThrottlerGuard {
  protected getTracker(req: Record<string, any>) {
    console.log('IPs from request headers', req.ips)
    console.log('IP from request', req.ip)
    return req.ips.length ? req.ips[0] : req.ip
  }
}
