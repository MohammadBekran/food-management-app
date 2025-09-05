import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { EApiTagNames } from 'src/common/enums/api-tag-name.enum';
import { EControllerNames } from 'src/common/enums/controller-name.enum';
import { UserAuth } from 'src/common/decorators/auth.decorator';

import { UserAddressService } from '../services/user-address.service';
import { EApiEndpointNames } from 'src/common/enums/api-endpoint.enum';

import {
  CreateUserAddressDto,
  UpdateUserAddressDto,
} from '../dto/user-address.dto';

@Controller(EControllerNames.UserAddress)
@ApiTags(EApiTagNames.UserAddress)
@UserAuth()
export class UserAddressController {
  constructor(private readonly userAddressService: UserAddressService) {}

  @Get(EApiEndpointNames.GETUserAddresses)
  findAll() {
    return this.userAddressService.find();
  }

  @Get(EApiEndpointNames.GETUserAddress)
  findOne(@Param('id') id: string) {
    return this.userAddressService.findOne(id);
  }

  @Post(EApiEndpointNames.POSTUserAddress)
  create(@Body() createUserAddressDto: CreateUserAddressDto) {
    return this.userAddressService.create(createUserAddressDto);
  }

  @Put(EApiEndpointNames.PUTUpdateUserAddress)
  update(
    @Param('id') id: string,
    @Body() updateUserAddressDto: UpdateUserAddressDto,
  ) {
    return this.userAddressService.update(id, updateUserAddressDto);
  }
}
