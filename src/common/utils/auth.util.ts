import { randomInt } from 'crypto';
import { JwtService } from '@nestjs/jwt';

import type { TTokenPayload } from '../types/payload.type';

export function generateTokens(
  payload: TTokenPayload,
  accessTokenSecret: string,
  refreshTokenSecret: string,
  jwtService: JwtService,
) {
  const accessToken = jwtService.sign(payload, {
    secret: accessTokenSecret,
    expiresIn: '7d',
  });
  const refreshToken = jwtService.sign(payload, {
    secret: refreshTokenSecret,
    expiresIn: '1y',
  });

  return {
    accessToken,
    refreshToken,
  };
}

export function generateOtpData() {
  return {
    code: randomInt(100000, 1000000).toString(),
    expires_in: new Date(new Date().getTime() + 1000 * 60 * 2),
  };
}
