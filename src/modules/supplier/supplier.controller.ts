import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';

import { SupplierAuth } from 'src/common/decorators/auth.decorator';
import { CheckOtpDto, SendOtpDto } from 'src/common/dto/otp.dto';
import { EApiEndpointNames } from 'src/common/enums/api-endpoint.enum';
import { EApiTagNames } from 'src/common/enums/api-tag-name.enum';
import { EControllerNames } from 'src/common/enums/controller-name.enum';
import { ESwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import {
  UploadFileFieldsS3,
  UploadFileS3,
} from 'src/common/interceptors/upload-file.interceptor';
import { ValidatedImageFile } from 'src/common/decorators/upload-file.decorator';

import {
  GetSupplierOrdersDto,
  SupplementaryInformationDto,
  SupplierSignupDto,
  UploadContractDto,
  UploadDocumentsDto,
} from './dto/supplier.dto';
import { SupplierService } from './supplier.service';
import type { TUploadedDocument } from './types/uploaded-document.type';

@Controller(EControllerNames.Supplier)
@ApiTags(EApiTagNames.Supplier)
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post(EApiEndpointNames.POSTSupplierSignup)
  @ApiConsumes(ESwaggerConsumes.URLEncoded, ESwaggerConsumes.JSON)
  signup(@Body() signupDto: SupplierSignupDto) {
    return this.supplierService.signup(signupDto);
  }

  @Post(EApiEndpointNames.POSTSupplierSendOtp)
  @ApiConsumes(ESwaggerConsumes.URLEncoded, ESwaggerConsumes.JSON)
  sendOtp(@Body() sendOtpDto: SendOtpDto) {
    return this.supplierService.sendOtp(sendOtpDto);
  }

  @Post(EApiEndpointNames.POSTSupplierCheckOtp)
  @ApiConsumes(ESwaggerConsumes.URLEncoded, ESwaggerConsumes.JSON)
  checkOtp(@Body() checkOtpDto: CheckOtpDto) {
    return this.supplierService.checkOtp(checkOtpDto);
  }

  @Post(EApiEndpointNames.POSTSupplierSupplementaryInformation)
  @ApiConsumes(ESwaggerConsumes.URLEncoded, ESwaggerConsumes.JSON)
  @SupplierAuth()
  saveSupplementaryInformation(
    @Body() supplementaryInformationDto: SupplementaryInformationDto,
  ) {
    return this.supplierService.saveSupplementaryInformation(
      supplementaryInformationDto,
    );
  }

  @Put(EApiEndpointNames.PUTSupplierUploadDocuments)
  @ApiConsumes(ESwaggerConsumes.FormData)
  @SupplierAuth()
  @UseInterceptors(
    UploadFileFieldsS3([
      { name: 'acceptedDocument', maxCount: 10 },
      { name: 'image', maxCount: 10 },
    ]),
  )
  uploadDocuments(
    @Body() uploadDocumentsDto: UploadDocumentsDto,
    @UploadedFiles() files: TUploadedDocument,
  ) {
    return this.supplierService.uploadDocuments(files);
  }

  @Put(EApiEndpointNames.PUTSupplierUploadContract)
  @ApiConsumes(ESwaggerConsumes.FormData)
  @SupplierAuth()
  @UseInterceptors(UploadFileS3('contract'))
  uploadContract(
    @Body() uploadContractDto: UploadContractDto,
    @ValidatedImageFile() file: Express.Multer.File,
  ) {
    return this.supplierService.uploadContract(file);
  }

  @Get(EApiEndpointNames.GETSupplierOrders)
  @SupplierAuth()
  getSupplierOrders(@Query() getSupplierOrdersDto: GetSupplierOrdersDto) {
    return this.supplierService.getSupplierOrders(getSupplierOrdersDto);
  }
}
