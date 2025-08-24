import {
  Injectable,
  UnauthorizedException,
  type CanActivate,
  type ExecutionContext,
} from '@nestjs/common';
import { isJWT } from 'class-validator';
import type { Request } from 'express';

import { EAuthMessages } from 'src/common/enums/message.enum';

import { SupplierService } from '../supplier.service';

@Injectable()
export class SupplierAuthGuard implements CanActivate {
  constructor(private supplierService: SupplierService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromRequest(request);

    const supplier = await this.supplierService.validateAccessToken(token);

    request.user = supplier;

    return true;
  }

  protected extractTokenFromRequest(request: Request) {
    const { authorization } = request.headers;

    if (!authorization || authorization.trim() === '') {
      throw new UnauthorizedException(EAuthMessages.LoginToAccount);
    }

    const [bearer, token] = authorization.split(' ');
    if (bearer.toLowerCase() !== 'bearer' || !token || !isJWT(token)) {
      throw new UnauthorizedException(EAuthMessages.LoginToAccount);
    }

    return token;
  }
}
