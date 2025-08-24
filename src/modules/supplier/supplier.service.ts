import type { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
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
import type { TUploadedDocument } from './types/uploaded-document.type';
import { S3Service } from '../s3/s3.service';
import { SupplierImageEntity } from './entities/supplier-image.entity';
import { SupplierDocumentEntity } from './entities/supplier-document.entity';

@Injectable({ scope: Scope.REQUEST })
export class SupplierService {
  constructor(
    @InjectRepository(SupplierEntity)
    private supplierRepository: Repository<SupplierEntity>,
    @InjectRepository(SupplierOtpEntity)
    private supplierOtpRepository: Repository<SupplierOtpEntity>,
    @InjectRepository(SupplierImageEntity)
    private supplierImageRepository: Repository<SupplierImageEntity>,
    @InjectRepository(SupplierDocumentEntity)
    private supplierDocumentRepository: Repository<SupplierDocumentEntity>,

    @Inject(REQUEST) private request: Request,

    private categoryService: CategoryService,
    private jwtService: JwtService,
    private s3Service: S3Service,
  ) {}

  async signup(signupDto: SupplierSignupDto) {
    const {
      first_name,
      last_name,
      phone,
      city,
      store_name,
      invite_code,
      categoryId,
    } = signupDto;

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
      store_name,
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

    const supplier = await this.supplierRepository.findOneBy({ phone });
    if (!supplier)
      throw new UnauthorizedException(EAuthMessages.AccountNotFound);

    await this.sendOtpToSupplier(supplier);

    return {
      message: EPublicMessages.OtpSentSuccessfully,
    };
  }

  async checkOtp(otpDto: CheckOtpDto) {
    const { phone, code } = otpDto;

    console.log(phone);
    const supplier = await this.supplierRepository.findOne({
      where: { phone },
      relations: ['otp'],
    });
    console.log(supplier);
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
      this.jwtService,
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
      message: EPublicMessages.SupplementaryInformationSavedSuccessfully,
    };
  }

  async uploadDocuments(files: TUploadedDocument) {
    const { id: userId } = this.request.user!;
    const { acceptedDocument, image } = files;

    const uploadedAcceptedDocument = await this.s3Service.uploadFile(
      acceptedDocument[0],
      'accepted-documents',
    );
    const uploadedImage = await this.s3Service.uploadFile(image[0], 'images');

    let supplierImage: SupplierImageEntity | null = null;
    let supplierDocument: SupplierDocumentEntity | null = null;

    if (uploadedImage) {
      supplierImage = this.supplierImageRepository.create({
        supplierId: userId,
        image: uploadedImage.Location,
      });

      supplierImage = await this.supplierImageRepository.save(supplierImage);
    }
    if (uploadedAcceptedDocument) {
      supplierDocument = this.supplierDocumentRepository.create({
        supplierId: userId,
        document: uploadedAcceptedDocument.Location,
      });

      supplierDocument =
        await this.supplierDocumentRepository.save(supplierDocument);
    }

    if (supplierImage?.image && supplierDocument?.document) {
      await this.supplierRepository.update(
        { id: userId },
        { status: ESupplierStatus.UploadDocument },
      );
    }

    return {
      message: EPublicMessages.DocumentUploadedSuccessfully,
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
      const supplierId = payload?.id;

      if (typeof payload === 'object' && supplierId) {
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
