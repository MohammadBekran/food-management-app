import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { EControllerNames } from 'src/common/enums/controller-name.enum';
import { EApiTagNames } from 'src/common/enums/api-tag-name.enum';

import { SupplierService } from './supplier.service';
import { SupplierSignupDto } from './dto/supplier.dto';

@Controller(EControllerNames.Supplier)
@ApiTags(EApiTagNames.Supplier)
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post()
  signup(@Body() signupDto: SupplierSignupDto) {
    return this.supplierService.signup(signupDto);
  }

  @Get()
  findAll() {}

  @Get(':id')
  findOne(@Param('id') id: string) {}

  @Patch(':id')
  update(
    @Param('id') id: string,
    // @Body() updateSupplierDto: UpdateSupplierDto,
  ) {}

  @Delete(':id')
  remove(@Param('id') id: string) {}
}
