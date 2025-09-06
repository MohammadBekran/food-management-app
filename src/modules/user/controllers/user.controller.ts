import { Body, Controller, Get, Param, Put, Query } from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';

import { UserAuth } from 'src/common/decorators/auth.decorator';
import { EApiTagNames } from 'src/common/enums/api-tag-name.enum';
import { EControllerNames } from 'src/common/enums/controller-name.enum';
import { EApiEndpointNames } from 'src/common/enums/api-endpoint.enum';
import { GetUserOrdersDto } from '../dto/user.dto';

import { UserService } from '../services/user.service';
import { ESwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';

@Controller(EControllerNames.User)
@ApiTags(EApiTagNames.User)
@UserAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(EApiEndpointNames.GETUserProfile)
  getUserProfile() {
    return this.userService.getUserProfile();
  }

  @Get(EApiEndpointNames.GETUserOrders)
  getUserOrders(@Query() getUserOrdersDto: GetUserOrdersDto) {
    return this.userService.getUserOrders(getUserOrdersDto);
  }

  @Get(EApiEndpointNames.GETUserOrder)
  getUserOrder(@Param('id') id: string) {
    return this.userService.getUserOrder(id);
  }

  @Put(EApiEndpointNames.PUTUpdateProfile)
  @ApiConsumes(ESwaggerConsumes.URLEncoded, ESwaggerConsumes.JSON)
  updateProfile(@Body() updateProfileDto: UpdateProfileDto) {
    return this.userService.updateProfile(updateProfileDto);
  }
}
