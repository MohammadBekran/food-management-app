import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import type { Request } from 'express';
import { Repository } from 'typeorm';

import {
  ENotFoundMessages,
  EPublicMessages,
} from 'src/common/enums/message.enum';

import { UserAddressEntity } from '../entities/user-address.entity';
import { CreateUserAddressDto } from '../dto/user-address.dto';

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

  async checkExistenceById(id: string) {
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
}
