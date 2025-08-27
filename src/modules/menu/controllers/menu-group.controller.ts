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

import { SupplierAuth } from 'src/common/decorators/auth.decorator';
import { EApiEndpointNames } from 'src/common/enums/api-endpoint.enum';
import { EApiTagNames } from 'src/common/enums/api-tag-name.enum';
import { EControllerNames } from 'src/common/enums/controller-name.enum';
import { ESwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';

import { CreateMenuGroupDto, UpdateMenuGroupDto } from '../dto/menu-group.dto';
import { MenuGroupService } from '../services/menu-group.service';

@Controller(EControllerNames.MenuGroup)
@ApiTags(EApiTagNames.MenuGroup)
@SupplierAuth()
export class MenuGroupController {
  constructor(private readonly menuGroupService: MenuGroupService) {}

  @Post(EApiEndpointNames.POSTCreateMenu)
  @ApiConsumes(ESwaggerConsumes.URLEncoded, ESwaggerConsumes.JSON)
  create(@Body() createMenuGroupDto: CreateMenuGroupDto) {
    return this.menuGroupService.create(createMenuGroupDto);
  }

  @Get(EApiEndpointNames.GETMenuGroups)
  findAll() {
    return this.menuGroupService.findAll();
  }

  @Get(EApiEndpointNames.GETMenuGroup)
  findOne(@Param('id') id: string) {
    return this.menuGroupService.findOneById(id);
  }

  @Put(EApiEndpointNames.PUTUpdateMenuGroup)
  @ApiConsumes(ESwaggerConsumes.URLEncoded, ESwaggerConsumes.JSON)
  update(
    @Param('id') id: string,
    @Body() updateMeuGroupDto: UpdateMenuGroupDto,
  ) {
    return this.menuGroupService.update(id, updateMeuGroupDto);
  }

  @Delete(EApiEndpointNames.DELETEMenuGroup)
  delete(@Param('id') id: string) {
    return this.menuGroupService.delete(id);
  }
}
