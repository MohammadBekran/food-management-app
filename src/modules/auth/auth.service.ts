import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { randomInt } from 'crypto';
import { Repository } from 'typeorm';

import {
  ENotAuthMessages,
  ENotBadRequestMessages,
  EPublicMessages,
} from 'src/common/enums/message.enum';

import { OtpEntity } from '../user/entities/otp.entity';
import { UserEntity } from '../user/entities/user.entity';
import { CheckOtpDto, SendOtpDto } from './dto/otp.dto';
import type { TTokenPayload } from './types/payload.type';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,

    @InjectRepository(OtpEntity) private otpRepository: Repository<OtpEntity>,
    private jwtService: JwtService,
  ) {}

  async sendOtp(otpDto: SendOtpDto) {
    const { phone } = otpDto;
    let user = await this.userRepository.findOneBy({ phone });

    if (!user) {
      user = this.userRepository.create({
        phone,
      });

      user = await this.userRepository.save(user);
    }

    await this.sendOtpToUser(user);

    return {
      message: EPublicMessages.OtpSentSuccessfully,
    };
  }

  async checkOtp(otpDto: CheckOtpDto) {
    const { phone, code } = otpDto;

    const user = await this.userRepository.findOne({
      where: { phone },
      relations: {
        otp: true,
      },
    });
    if (!user) {
      throw new UnauthorizedException(ENotAuthMessages.AccountNotFound);
    }

    const otp = user?.otp;

    if (otp?.code !== code) {
      throw new UnauthorizedException(ENotAuthMessages.InvalidCode);
    }
    if (otp?.expires_in < new Date()) {
      throw new UnauthorizedException(ENotAuthMessages.CodeExpired);
    }
    if (!user?.is_mobile_verified) {
      await this.userRepository.update(
        { id: user.id },
        {
          is_mobile_verified: true,
        },
      );
    }

    const { accessToken, refreshToken } = this.generateTokens({
      userId: user.id,
    });

    return {
      message: EPublicMessages.LoggedInSuccessfully,
      accessToken,
      refreshToken,
    };
  }

  async sendOtpToUser(user: UserEntity) {
    let otp = await this.otpRepository.findOneBy({ userId: user.id });

    const { code, expires_in } = {
      code: randomInt(100000, 1000000).toString(),
      expires_in: new Date(new Date().getTime() + 1000 * 60 * 2),
    };

    if (otp) {
      if (otp.expires_in > new Date()) {
        throw new BadRequestException(ENotBadRequestMessages.OtpCodeNotExpired);
      }

      otp.code = code;
      otp.expires_in = expires_in;
    } else {
      otp = this.otpRepository.create({
        code,
        expires_in,
        userId: user.id,
      });
    }

    otp = await this.otpRepository.save(otp);
    user.otpId = otp.id;
    await this.userRepository.save(user);
  }

  async validateAccessToken(token: string) {
    try {
      const payload = this.jwtService.verify<TTokenPayload>(token, {
        secret: process.env.ACCESS_TOKEN_SECRET,
      });
      const userId = payload?.userId;

      if (typeof payload === 'object' && userId) {
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user) {
          throw new UnauthorizedException(ENotAuthMessages.AccountNotFound);
        }

        return user;
      }

      throw new UnauthorizedException(ENotAuthMessages.LoginToAccount);
    } catch (error) {
      throw new UnauthorizedException(ENotAuthMessages.LoginToAccount);
    }
  }

  generateTokens(payload: TTokenPayload) {
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: '7d',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: '1y',
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
