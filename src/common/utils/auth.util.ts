import { randomInt } from 'crypto';

import type { TTokenPayload } from '../types/payload.type';

export function generateTokens(
  payload: TTokenPayload,
  accessTokenSecret: string,
  refreshTokenSecret: string,
) {
  const accessToken = this.jwtService.sign(payload, {
    secret: accessTokenSecret,
    expiresIn: '7d',
  });
  const refreshToken = this.jwtService.sign(payload, {
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
