import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';

import {
  ENotFoundMessages,
  EPublicMessages,
} from 'src/common/enums/message.enum';

import { MenuGroupEntity } from '../entities/menu-group.entity';
import { CreateMenuGroupDto, UpdateMenuGroupDto } from '../dto/menu-group.dto';

@Injectable({ scope: Scope.REQUEST })
export class MenuGroupService {
  constructor(
    @InjectRepository(MenuGroupEntity)
    private menuGroupRepository: Repository<MenuGroupEntity>,

    @Inject(REQUEST) private req: Request,
  ) {}

  async create(createMenuGroupDto: CreateMenuGroupDto) {
    const { id: supplierId } = this.req.user!;
    const { title } = createMenuGroupDto;

    const type = this.menuGroupRepository.create({
      title,
      supplierId,
    });
    await this.menuGroupRepository.save(type);

    return {
      message: EPublicMessages.MenuGroupCreatedSuccessfully,
    };
  }

  async findAll() {
    const { id: supplierId } = this.req.user!;

    const menuGroups = await this.menuGroupRepository.find({
      where: { supplierId },
    });

    return {
      menuGroups,
    };
  }

  async findOneById(id: string) {
    const { id: supplierId } = this.req.user!;

    const menuGroup = await this.menuGroupRepository.findOneBy({
      id,
      supplierId,
    });
    if (!menuGroup) {
      throw new NotFoundException(ENotFoundMessages.MenuGroupNotFound);
    }

    return menuGroup;
  }

  async update(id: string, updateMenuGroupDto: UpdateMenuGroupDto) {
    const { title } = updateMenuGroupDto;

    const menuGroup = await this.findOneById(id);
    if (title) menuGroup.title = title;
    await this.menuGroupRepository.save(menuGroup);

    return {
      message: EPublicMessages.MenuGroupUpdatedSuccessfully,
    };
  }

  async delete(id: string) {
    await this.findOneById(id);

    await this.menuGroupRepository.delete({ id });

    return {
      message: EPublicMessages.MenuGroupDeletedSuccessfully,
    };
  }
}
