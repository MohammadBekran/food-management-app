import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiConsumes } from '@nestjs/swagger';

import { ValidatedImageFile } from 'src/common/decorators/upload-file.decorator';
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

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
