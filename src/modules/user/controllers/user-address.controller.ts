import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';

import { UserAuth } from 'src/common/decorators/auth.decorator';
import { EApiTagNames } from 'src/common/enums/api-tag-name.enum';
import { EControllerNames } from 'src/common/enums/controller-name.enum';

import { EApiEndpointNames } from 'src/common/enums/api-endpoint.enum';
import { ESwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import { UserAddressService } from '../services/user-address.service';

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
  @ApiConsumes(ESwaggerConsumes.URLEncoded, ESwaggerConsumes.JSON)
  create(@Body() createUserAddressDto: CreateUserAddressDto) {
    return this.userAddressService.create(createUserAddressDto);
  }

  @Put(EApiEndpointNames.PUTUpdateUserAddress)
  @ApiConsumes(ESwaggerConsumes.URLEncoded, ESwaggerConsumes.JSON)
  update(
    @Param('id') id: string,
    @Body() updateUserAddressDto: UpdateUserAddressDto,
  ) {
    return this.userAddressService.update(id, updateUserAddressDto);
  }

  @Delete(EApiEndpointNames.DELETEUserAddress)
  remove(@Param('id') id: string) {
    return this.userAddressService.remove(id);
  }
}
