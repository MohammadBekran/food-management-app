import {
  Inject,
  Injectable,
  InternalServerErrorException,
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
  EPublicMessages,
} from 'src/common/enums/message.enum';

import { MenuEntity } from '../entities/menu.entity';
import { CreateMenuDto } from '../dto/menu.dto';
import { MenuGroupService } from './menu-group.service';

@Injectable({ scope: Scope.REQUEST })
export class MenuService {
  constructor(
    @Inject(REQUEST) private req: Request,

    @InjectRepository(MenuEntity)
    private menuRepository: Repository<MenuEntity>,

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
}
