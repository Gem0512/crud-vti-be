import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class IpWhitelistInterceptor implements NestInterceptor {
  private allowedIps = ['127.0.0.1', '192.168.1.110'];

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: Request = context.switchToHttp().getRequest();
    const requestIp = request.ip || request.socket.remoteAddress;

    if (!this.allowedIps.includes(requestIp)) {
      throw new ForbiddenException('Access denied from your IP address');
    }

    return next.handle();
  }
}
