import {
  Injectable,
  UnauthorizedException,
  type CanActivate,
  type ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { isJWT } from 'class-validator';
import type { Request } from 'express';

import { SKIP_AUTH } from 'src/common/decorators/skip-auth.decorator';
import { EAuthMessages } from 'src/common/enums/message.enum';

import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isSkippedAuth = this.reflector.get<boolean>(
      SKIP_AUTH,
      context.getHandler(),
    );
    if (isSkippedAuth) return true;
    const request = context.switchToHttp().getRequest<Request>();

    const token = this.extractTokenFromRequest(request);
    const user = await this.authService.validateAccessToken(token);

    request.user = user;

    return true;
  }

  protected extractTokenFromRequest(request: Request) {
    const { authorization } = request.headers;
    if (!authorization || authorization.trim() === '') {
      throw new UnauthorizedException(EAuthMessages.LoginToAccount);
    }

    const [bearer, token] = authorization.split(' ');
    if (bearer?.toLowerCase() !== 'bearer' || !token || !isJWT(token)) {
      throw new UnauthorizedException(EAuthMessages.LoginToAccount);
    }

    return token;
  }
}
