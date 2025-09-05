import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import type { Request } from 'express';
import { DeepPartial, Repository } from 'typeorm';

import {
  ENotFoundMessages,
  EPublicMessages,
} from 'src/common/enums/message.enum';

import { UserAddressEntity } from '../entities/user-address.entity';
import {
  CreateUserAddressDto,
  UpdateUserAddressDto,
} from '../dto/user-address.dto';

@Injectable({ scope: Scope.REQUEST })
export class UserAddressService {
  constructor(
    @Inject(REQUEST) private req: Request,

    @InjectRepository(UserAddressEntity)
    private userAddressRepository: Repository<UserAddressEntity>,
  ) {}

  async find() {
    const { id: userId } = this.req.user!;

    const addresses = await this.userAddressRepository.find({
      where: { userId },
    });

    return { addresses };
  }

  async findOne(id: string) {
    const { id: userId } = this.req.user!;

    const address = await this.userAddressRepository.findOneBy({
      userId,
      id,
    });
    if (!address) {
      throw new NotFoundException(ENotFoundMessages.AddressNotFound);
    }

    return address;
  }

  async create(createUserAddressDto: CreateUserAddressDto) {
    const { id: userId } = this.req.user!;
    const { title, province, city, address, postal_code } =
      createUserAddressDto;

    await this.userAddressRepository.insert({
      userId,
      title,
      province,
      city,
      address,
      postal_code,
    });

    return {
      message: EPublicMessages.AddressCreatedSuccessfully,
    };
  }

  async update(id: string, updateUserAddressDto: UpdateUserAddressDto) {
    const { id: userId } = this.req.user!;
    const { title, province, city, address, postal_code } =
      updateUserAddressDto;

    await this.findOne(id);

    const updateUserAddressData: DeepPartial<UpdateUserAddressDto> = {};

    if (title) updateUserAddressData.title = title;
    if (province) updateUserAddressData.province = province;
    if (city) updateUserAddressData.city = city;
    if (address) updateUserAddressData.address = address;
    if (postal_code) updateUserAddressData.postal_code = postal_code;

    await this.userAddressRepository.update(
      { userId, id },
      updateUserAddressData,
    );

    return {
      message: EPublicMessages.AddressUpdatedSuccessfully,
    };
  }

  async remove(id: string) {
    const { id: userId } = this.req.user!;

    await this.findOne(id);

    await this.userAddressRepository.delete({ userId, id });

    return {
      message: EPublicMessages.AddressDeletedSuccessfully,
    };
  }
}
