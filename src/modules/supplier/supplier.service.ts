import type { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomInt } from 'crypto';
import { JwtService } from '@nestjs/jwt';

import {
  EConflictMessages,
  EAuthMessages,
  ENotFoundMessages,
  EPublicMessages,
  ENotBadRequestMessages,
} from 'src/common/enums/message.enum';
import type { TTokenPayload } from 'src/common/types/payload.type';
import { generateOtpData, generateTokens } from 'src/common/utils/auth.util';
import { CheckOtpDto, SendOtpDto } from 'src/common/dto/otp.dto';

import {
  SupplementaryInformationDto,
  SupplierSignupDto,
} from './dto/supplier.dto';
import { SupplierEntity } from './entities/supplier.entity';
import { CategoryService } from '../category/category.service';
import { SupplierOtpEntity } from './entities/otp.entity';
import { ESupplierStatus } from './enums/status.enum';

@Injectable({ scope: Scope.REQUEST })
export class SupplierService {
  constructor(
    @InjectRepository(SupplierEntity)
    private supplierRepository: Repository<SupplierEntity>,
    @InjectRepository(SupplierOtpEntity)
    private supplierOtpRepository: Repository<SupplierOtpEntity>,

    @Inject(REQUEST) private request: Request,

    private categoryService: CategoryService,
    private jwtService: JwtService,
  ) {}

  async signup(signupDto: SupplierSignupDto) {
    const { first_name, last_name, phone, city, invite_code, categoryId } =
      signupDto;

    const supplier = await this.supplierRepository.findOneBy({ phone });
    if (supplier) {
      throw new ConflictException(EConflictMessages.SupplierAlreadyExists);
    }

    const category = await this.categoryService.findOneById(categoryId);
    let agent: SupplierEntity | null = null;
    if (invite_code) {
      agent = await this.supplierRepository.findOneBy({ invite_code });
      if (!agent) {
        throw new NotFoundException(ENotFoundMessages.AgentNotFound);
      }
    }

    const supplierAccount = this.supplierRepository.create({
      first_name,
      last_name,
      phone,
      city,
      invite_code: randomInt(100000, 1000000).toString(),
      categoryId: category.id,
      agentId: agent?.id,
    });

    await this.supplierRepository.save(supplierAccount);
    await this.sendOtpToSupplier(supplierAccount);

    return {
      message: EPublicMessages.OtpSentSuccessfully,
    };
  }

  async sendOtp(otpDto: SendOtpDto) {
    const { phone } = otpDto;

    let supplier = await this.supplierRepository.findOneBy({ phone });
    if (!supplier) {
      supplier = await this.supplierRepository.create({
        phone,
      });

      supplier = await this.supplierRepository.save(supplier);
    }

    await this.sendOtpToSupplier(supplier);

    return {
      message: EPublicMessages.OtpSentSuccessfully,
    };
  }

  async checkOtp(otpDto: CheckOtpDto) {
    const { phone, code } = otpDto;

    const supplier = await this.supplierRepository.findOneBy({ phone });
    if (!supplier) {
      throw new UnauthorizedException(EAuthMessages.AccountNotFound);
    }

    const otp = supplier?.otp;

    if (otp?.code !== code) {
      throw new UnauthorizedException(EAuthMessages.InvalidCode);
    }
    if (otp?.expires_in < new Date()) {
      throw new UnauthorizedException(EAuthMessages.CodeExpired);
    }
    if (!supplier.is_mobile_verified) {
      await this.supplierRepository.update(
        {
          phone,
        },
        {
          is_mobile_verified: true,
        },
      );
    }

    const { accessToken, refreshToken } = generateTokens(
      { id: supplier.id },
      process.env.JWT_SUPPLIER_ACCESS_TOKEN_SECRET,
      process.env.JWT_SUPPLIER_REFRESH_TOKEN_SECRET,
    );

    return {
      message: EPublicMessages.LoggedInSuccessfully,
      accessToken,
      refreshToken,
    };
  }

  async saveSupplementaryInformation(
    supplementaryInformationDto: SupplementaryInformationDto,
  ) {
    const { id: userId } = this.request.user!;

    const { email, national_code } = supplementaryInformationDto;

    let supplier = await this.supplierRepository.findOneBy({
      national_code,
    });
    if (supplier && supplier?.id !== userId) {
      throw new ConflictException(EConflictMessages.NationalCodeAlreadyUsed);
    }

    supplier = await this.supplierRepository.findOneBy({
      email,
    });
    if (supplier && supplier?.id !== userId) {
      throw new ConflictException(EConflictMessages.EmailAlreadyUsed);
    }

    await this.supplierRepository.update(
      { id: userId },
      {
        national_code,
        email,
        status: ESupplierStatus.SupplementaryInformation,
      },
    );

    return {
      message: '',
    };
  }

  async sendOtpToSupplier(supplier: SupplierEntity) {
    let otp = await this.supplierOtpRepository.findOneBy({
      supplierId: supplier.id,
    });

    const { code, expires_in } = generateOtpData();

    if (otp) {
      if (otp.expires_in > new Date()) {
        throw new BadRequestException(ENotBadRequestMessages.OtpCodeNotExpired);
      }

      otp.code = code;
      otp.expires_in = expires_in;
    } else {
      otp = this.supplierOtpRepository.create({
        code,
        expires_in,
        supplierId: supplier.id,
      });
    }

    otp = await this.supplierOtpRepository.save(otp);
    supplier.otpId = otp.id;
    await this.supplierRepository.save(supplier);
  }

  async validateAccessToken(token: string) {
    try {
      const payload = this.jwtService.verify<TTokenPayload>(token, {
        secret: process.env.JWT_SUPPLIER_ACCESS_TOKEN_SECRET,
      });
      const supplierId = payload.id;

      if (typeof payload === 'object' || supplierId) {
        const supplier = await this.supplierRepository.findOneBy({
          id: supplierId,
        });
        if (!supplier) {
          throw new UnauthorizedException(EAuthMessages.AccountNotFound);
        }

        return supplier;
      }

      throw new UnauthorizedException(EAuthMessages.LoginToAccount);
    } catch (error) {
      throw new UnauthorizedException(EAuthMessages.LoginToAccount);
    }
  }
}
