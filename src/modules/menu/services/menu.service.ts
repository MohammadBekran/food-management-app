import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import type { Request } from 'express';
import { Repository } from 'typeorm';

import { EFileFolderNames } from 'src/common/enums/file-folder-name.enum';
import {
  EInternalServerErrorException,
  ENotFoundMessages,
  EPublicMessages,
} from 'src/common/enums/message.enum';
import { S3Service } from 'src/modules/s3/s3.service';

import {
  ActionMenuDto,
  CreateMenuDto,
  FindMenusParamDto,
  UpdateMenuDto,
} from '../dto/menu.dto';
import { MenuGroupEntity } from '../entities/menu-group.entity';
import { MenuEntity } from '../entities/menu.entity';
import { MenuGroupService } from './menu-group.service';

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

  async update(
    actionMenuDto: ActionMenuDto,
    updateMenuDto: UpdateMenuDto,
    image: Express.Multer.File,
  ) {
    const { id: supplierId } = this.req.user!;
    const { id } = actionMenuDto;
    const { name, price, discount, description, score, groupId } =
      updateMenuDto;

    let updateMenuData: MenuEntity | null = {} as MenuEntity;

    if (image) {
      const uploadedImage = await this.s3Service.uploadFile(
        image,
        EFileFolderNames.MenuImages,
      );

      if (uploadedImage) {
        updateMenuData.image = uploadedImage.Location;
        updateMenuData.imageKey = uploadedImage.Key;
      }
    }

    if (groupId) {
      const group = await this.menuGroupRepository.findOneBy({
        id: groupId,
        supplierId,
      });

      if (group) updateMenuData.menuGroupId = groupId;
    }
    if (name) updateMenuData.name = name;
    if (price) updateMenuData.price = price;
    if (discount) updateMenuData.discount = discount;
    if (description) updateMenuData.description = description;
    if (score) updateMenuData.score = score;

    await this.menuRepository.update({ id }, updateMenuData);

    return {
      message: EPublicMessages.MenuUpdatedSuccessfully,
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

  async findOne(actionMenuDto: ActionMenuDto) {
    const { id: supplierId } = this.req.user!;
    const { id } = actionMenuDto;

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
    if (!menu) {
      throw new NotFoundException(ENotFoundMessages.MenuNotFound);
    }

    return {
      menu,
    };
  }

  async getOne(id: string) {
    const menu = await this.menuRepository.findOneBy({ id });
    if (!menu) throw new NotFoundException(ENotFoundMessages.MenuNotFound);

    return menu;
  }

  async delete(actionMenuDto: ActionMenuDto) {
    const { id } = actionMenuDto;

    await this.checkExistenceById(id);
    await this.menuRepository.delete({ id });

    return {
      message: EPublicMessages.MenuDeletedSuccessfully,
    };
  }

  async checkExistenceById(id: string) {
    const { id: supplierId } = this.req.user!;

    const menu = await this.menuRepository.findOneBy({ id, supplierId });
    if (!menu) throw new NotFoundException(ENotFoundMessages.MenuNotFound);

    return menu;
  }
}
