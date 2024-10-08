import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class IpWhitelistGuard implements CanActivate {
  private allowedIps = ['127.0.0.1', '192.168.1.110'];

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const requestIp = request.ip || request.socket.remoteAddress;

    if (this.isIpAllowed(requestIp)) {
      console.log(`Access IP: ${requestIp}`);
      return true;
    } else {
      console.log(`Access denied from IP: ${requestIp}`);
      throw new ForbiddenException('Access denied from your IP address');
    }
  }

  private isIpAllowed(ip: string): boolean {
    return this.allowedIps.includes(ip);
  }
}
