import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import type { Request } from 'express';
import { Repository } from 'typeorm';

import { ENotFoundMessages } from 'src/common/enums/message.enum';

import { UserAddressEntity } from '../entities/user-address.entity';

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
