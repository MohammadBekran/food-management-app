import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { Request } from 'express';

import { S3Service } from 'src/modules/s3/s3.service';
import { EFileFolderNames } from 'src/common/enums/file-folder-name.enum';
import {
  EInternalServerErrorException,
  ENotFoundMessages,
  EPublicMessages,
} from 'src/common/enums/message.enum';

import { MenuEntity } from '../entities/menu.entity';
import {
  CreateMenuDto,
  FindMenuParamDto,
  FindMenusParamDto,
  UpdateMenuDto,
} from '../dto/menu.dto';
import { MenuGroupService } from './menu-group.service';
import { MenuGroupEntity } from '../entities/menu-group.entity';

@Injectable({ scope: Scope.REQUEST })
export class MenuService {
  constructor(
    @Inject(REQUEST) private req: Request,

    @InjectRepository(MenuEntity)
    private menuRepository: Repository<MenuEntity>,
    @InjectRepository(MenuGroupEntity)
    private menuGroupRepository: Repository<MenuGroupEntity>,

    private menuGroupService: MenuGroupService,
    private s3Service: S3Service,
  ) {}

  async create(createMenuDto: CreateMenuDto, image: Express.Multer.File) {
    const { id: supplierId } = this.req.user!;
    const { name, price, discount, description, score, groupId } =
      createMenuDto;

    const group = await this.menuGroupService.findOneById(groupId);

    const uploadedImage = await this.s3Service.uploadFile(
      image,
      EFileFolderNames.MenuImages,
    );
    if (!uploadedImage.Location) {
      throw new InternalServerErrorException(
        EInternalServerErrorException.UploadFileFailed,
      );
    }

    await this.menuRepository.insert({
      supplierId,
      name,
      price,
      discount,
      description,
      score,
      image: uploadedImage.Location,
      imageKey: uploadedImage.Key,
      menuGroupId: group.id,
    });

    return {
      message: EPublicMessages.MenuCreatedSuccessfully,
    };
  }

  async findAll(findMenusParamDto: FindMenusParamDto) {
    const { supplierId } = findMenusParamDto;

    const menus = await this.menuGroupRepository.find({
      where: { supplierId },
      relations: {
        items: true,
      },
    });

    return {
      menus,
    };
  }

  async findOne(findMenuParamDto: FindMenuParamDto) {
    const { id: supplierId } = this.req.user!;
    const { id } = findMenuParamDto;

    const menu = await this.menuRepository.findOne({
      where: { id, supplierId },
      relations: {
        menuGroup: true,
        feedbacks: {
          user: true,
        },
      },
      select: {
        menuGroup: {
          title: true,
        },
        feedbacks: {
          comment: true,
          createdAt: true,
          user: {
            first_name: true,
            last_name: true,
          },
          score: true,
        },
      },
    });
    if (!menu) throw new NotFoundException(ENotFoundMessages.MenuNotFound);

    return {
      menu,
    };
  }

  async checkExistenceById(id: string) {
    const { id: supplierId } = this.req.user!;

    const menu = await this.menuRepository.findOneBy({ id, supplierId });
    if (!menu) throw new NotFoundException(ENotFoundMessages.MenuNotFound);

    return menu;
  }
}
