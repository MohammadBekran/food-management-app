import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CheckOtpDto, SendOtpDto } from 'src/common/dto/otp.dto';
import {
  EAuthMessages,
  ENotBadRequestMessages,
  EPublicMessages,
} from 'src/common/enums/message.enum';
import type { TTokenPayload } from 'src/common/types/payload.type';
import { generateOtpData, generateTokens } from 'src/common/utils/auth.util';

import { OtpEntity } from '../user/entities/otp.entity';
import { UserEntity } from '../user/entities/user.entity';

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
      throw new UnauthorizedException(EAuthMessages.AccountNotFound);
    }

    const otp = user?.otp;

    if (otp?.code !== code) {
      throw new UnauthorizedException(EAuthMessages.InvalidCode);
    }
    if (otp?.expires_in < new Date()) {
      throw new UnauthorizedException(EAuthMessages.CodeExpired);
    }
    if (!user?.is_mobile_verified) {
      await this.userRepository.update(
        { id: user.id },
        {
          is_mobile_verified: true,
        },
      );
    }

    const { accessToken, refreshToken } = generateTokens(
      {
        id: user.id,
      },
      process.env.JWT_USER_ACCESS_TOKEN_SECRET,
      process.env.JWT_USER_REFRESH_TOKEN_SECRET,
    );

    return {
      message: EPublicMessages.LoggedInSuccessfully,
      accessToken,
      refreshToken,
    };
  }

  async sendOtpToUser(user: UserEntity) {
    let otp = await this.otpRepository.findOneBy({ userId: user.id });

    const { code, expires_in } = generateOtpData();

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
        secret: process.env.JWT_USER_ACCESS_TOKEN_SECRET,
      });
      const userId = payload?.id;

      if (typeof payload === 'object' && userId) {
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user) {
          throw new UnauthorizedException(EAuthMessages.AccountNotFound);
        }

        return user;
      }

      throw new UnauthorizedException(EAuthMessages.LoginToAccount);
    } catch (error) {
      throw new UnauthorizedException(EAuthMessages.LoginToAccount);
    }
  }
}
