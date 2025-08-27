import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';

import { SupplierAuth } from 'src/common/decorators/auth.decorator';
import { SkipAuth } from 'src/common/decorators/skip-auth.decorator';
import { EApiEndpointNames } from 'src/common/enums/api-endpoint.enum';
import { EApiTagNames } from 'src/common/enums/api-tag-name.enum';
import { EControllerNames } from 'src/common/enums/controller-name.enum';
import { ESwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import { UploadFileS3 } from 'src/common/interceptors/upload-file.interceptor';

import {
  CreateMenuDto,
  FindMenuParamDto,
  FindMenusParamDto,
} from '../dto/menu.dto';
import { MenuService } from '../services/menu.service';

@Controller(EControllerNames.Menu)
@ApiTags(EApiTagNames.Menu)
@SupplierAuth()
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post(EApiEndpointNames.POSTCreateMenu)
  @ApiConsumes(ESwaggerConsumes.FormData)
  @UseInterceptors(UploadFileS3('image'))
  create(
    @Body() createMenuDto: CreateMenuDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.menuService.create(createMenuDto, image);
  }

  @Get(EApiEndpointNames.GETMenusBySupplierId)
  @SkipAuth()
  findAll(@Param() findMenusParamDto: FindMenusParamDto) {
    return this.menuService.findAll(findMenusParamDto);
  }

  @Get(EApiEndpointNames.GETMenu)
  @SkipAuth()
  find(@Param() findMenuParamDto: FindMenuParamDto) {
    return this.menuService.findOne(findMenuParamDto);
  }
}
