import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Repository } from 'typeorm';
import type { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';

import { ENotFoundMessages } from 'src/common/enums/message.enum';

import { UserEntity } from '../entities/user.entity';

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(
    @Inject(REQUEST) private req: Request,

    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async getProfile() {
    const { id: userId } = this.req.user!;

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(ENotFoundMessages.UserNotFound);
    }

    return {
      user,
    };
  }
}
