import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { Repository } from 'typeorm';

import { EFileFolderNames } from 'src/common/enums/file-folder-name.enum';
import {
  EConflictMessages,
  ENotFoundMessages,
  EPublicMessages,
} from 'src/common/enums/message.enum';
import { toBoolean } from 'src/common/utils/helpers.util';

import { S3Service } from '../s3/s3.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CategoryEntity } from './entities/category.entity';
import {
  paginationData,
  paginationGenerator,
} from 'src/common/utils/pagination.util';

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

    const uploadedImageUrl = await this.s3Service.uploadFile(
      image,
      EFileFolderNames.Categories,
    );

    let parent: CategoryEntity | null = null;
    if (show) toBoolean(show);
    if (parentId) {
      parent = await this.categoryRepository.findOneBy({ id: parentId });
    }

    await this.categoryRepository.insert({
      title,
      slug: slug ?? slugify(title),
      image: uploadedImageUrl,
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

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
