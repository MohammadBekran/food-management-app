import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { EApiTagNames } from 'src/common/enums/api-tag-name.enum';
import { EControllerNames } from 'src/common/enums/controller-name.enum';
import { UserAuth } from 'src/common/decorators/auth.decorator';

import { UserAddressService } from '../services/user-address.service';
import { EApiEndpointNames } from 'src/common/enums/api-endpoint.enum';

@Controller(EControllerNames.UserAddress)
@ApiTags(EApiTagNames.UserAddress)
@UserAuth()
export class UserAddressController {
  constructor(private readonly userAddressService: UserAddressService) {}

  @Get(EApiEndpointNames.GETUserAddresses)
  findAll() {
    return this.userAddressService.find();
  }
}
