import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiConsumes, ApiParam } from '@nestjs/swagger';

import { Pagination } from 'src/common/decorators/pagination.decorator';
import { ValidatedImageFile } from 'src/common/decorators/upload-file.decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { EApiEndpointNames } from 'src/common/enums/api-endpoint.enum';
import { EControllerName } from 'src/common/enums/controller-name.enum';
import { ESwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import { UploadFileS3 } from 'src/common/interceptors/upload-file.interceptor';

import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller(EControllerName.Category)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post(EApiEndpointNames.POSTCreateCategory)
  @ApiConsumes(ESwaggerConsumes.FormData)
  @UseInterceptors(UploadFileS3('image'))
  create(
    @ValidatedImageFile()
    file: Express.Multer.File,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    return this.categoryService.create(createCategoryDto, file);
  }

  @Get(EApiEndpointNames.GETCategories)
  @Pagination()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.categoryService.findAll(paginationDto);
  }

  @Get(EApiEndpointNames.GETCategoryBySlug)
  @ApiParam({ name: 'slug', type: 'string' })
  findBySlug(@Param('slug') slug: string) {
    return this.categoryService.findBySlug(slug);
  }

  @Patch(EApiEndpointNames.PATCHUpdateCategory)
  @ApiConsumes(ESwaggerConsumes.FormData)
  @UseInterceptors(UploadFileS3('image'))
  update(
    @Param('id') id: string,
    @ValidatedImageFile()
    file: Express.Multer.File,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto, file);
  }

  @Delete(EApiEndpointNames.DELETECategory)
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
