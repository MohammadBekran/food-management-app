import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';
import slugify from 'slugify';
import { Repository } from 'typeorm';

import { EFileFolderNames } from 'src/common/enums/file-folder-name.enum';
import {
  EConflictMessages,
  ENotFoundMessages,
  EPublicMessages,
} from 'src/common/enums/message.enum';
import { isBoolean, toBoolean } from 'src/common/utils/helpers.util';

import { PaginationDto } from 'src/common/dto/pagination.dto';
import {
  paginationData,
  paginationGenerator,
} from 'src/common/utils/pagination.util';
import { S3Service } from '../s3/s3.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryEntity } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
    private s3Service: S3Service,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
    image: Express.Multer.File,
  ) {
    const { title, slug, show, parentId } = createCategoryDto;

    const category = await this.findOneBySlug(slug);
    if (category)
      throw new ConflictException(EConflictMessages.CategoryAlreadyExists);

    const { Key, Location } = await this.s3Service.uploadFile(
      image,
      EFileFolderNames.Categories,
    );

    let parent: CategoryEntity | null = null;
    if (show) toBoolean(show);
    if (parentId && isUUID(parentId)) {
      parent = await this.categoryRepository.findOneBy({ id: parentId });
    }

    await this.categoryRepository.insert({
      title,
      slug: slug ?? slugify(title),
      show,
      imageKey: Key,
      imageUrl: Location,
      parentId: parent?.id,
    });

    return {
      message: EPublicMessages.CategoryCreatedSuccessfully,
    };
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit, skip } = paginationData(
      paginationDto.page,
      paginationDto.limit,
    );

    const [categories, count] = await this.categoryRepository.findAndCount({
      where: {},
      relations: {
        parent: true,
      },
      select: {
        parent: {
          id: true,
          title: true,
        },
      },
      skip,
      take: limit,
      order: { created_at: 'DESC' },
    });

    return {
      pagination: paginationGenerator(count, page, limit),
      categories,
    };
  }

  async findOneById(id: string) {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category)
      throw new NotFoundException(ENotFoundMessages.CategoryNotFound);

    return category;
  }

  async findOneBySlug(slug: string) {
    return await this.categoryRepository.findOneBy({ slug });
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
    image: Express.Multer.File,
  ) {
    const { title, slug, show, parentId } = updateCategoryDto;

    const category = await this.findOneById(id);

    if (image) {
      const { Key, Location } = await this.s3Service.uploadFile(
        image,
        EFileFolderNames.Categories,
      );

      if (Location) {
        if (category.imageKey) {
          console.log('Hello World');
          const result = await this.s3Service.deleteFile(category.imageKey);
          console.log(result);
        }

        category.imageKey = Key;
        category.imageUrl = Location;
      }
    }
    if (title) category.title = title;
    if (show && isBoolean(show)) category.show = toBoolean(show);
    if (slug) {
      const formattedSlug = slugify(slug);

      const existCategory = await this.findOneBySlug(formattedSlug);

      if (existCategory && existCategory.id !== category.id) {
        throw new ConflictException(EConflictMessages.CategoryAlreadyExists);
      }

      category.slug = formattedSlug;
    }
    if (parentId) {
      const parentCategory = await this.findOneById(parentId);

      category.parentId = parentCategory.id;
    }

    await this.categoryRepository.save(category);

    return {
      message: EPublicMessages.CategoryUpdatedSuccessfully,
    };
  }

  async remove(id: string) {
    const category = await this.findOneById(id);

    if (category.imageKey) await this.s3Service.deleteFile(category.imageKey);
    await this.categoryRepository.delete({ id: category.id });

    return {
      message: EPublicMessages.CategoryDeletedSuccessfully,
    };
  }
}
