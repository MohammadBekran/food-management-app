import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UserAuth } from 'src/common/decorators/auth.decorator';
import { EApiTagNames } from 'src/common/enums/api-tag-name.enum';
import { EControllerNames } from 'src/common/enums/controller-name.enum';
import { EApiEndpointNames } from 'src/common/enums/api-endpoint.enum';

import { UserService } from '../services/user.service';

@Controller(EControllerNames.User)
@ApiTags(EApiTagNames.User)
@UserAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(EApiEndpointNames.GETUserProfile)
  getUserProfile() {
    return this.userService.getProfile();
  }
}
