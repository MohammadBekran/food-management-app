import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import type { Request } from 'express';
import { DeepPartial, Repository } from 'typeorm';

import {
  EBadRequestMessages,
  ENotFoundMessages,
  EPublicMessages,
} from 'src/common/enums/message.enum';
import { OrderService } from 'src/modules/order/order.service';

import { GetUserOrdersDto, UpdateProfileDto } from '../dto/user.dto';
import { UserEntity } from '../entities/user.entity';

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(
    @Inject(REQUEST) private req: Request,

    private orderService: OrderService,

    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async getUserProfile() {
    const { id: userId } = this.req.user!;

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(ENotFoundMessages.UserNotFound);
    }

    return {
      user,
    };
  }

  async getUserOrders(getUserOrdersDto: GetUserOrdersDto) {
    const orders = await this.orderService.findUserOrders(getUserOrdersDto);

    return { orders };
  }

  async getUserOrder(id: string) {
    const order = await this.orderService.getUserOrder(id);

    return { order };
  }

  async updateProfile(updateProfileDto: UpdateProfileDto) {
    const { id: userId } = this.req.user!;
    const { first_name, last_name, phone, email } = updateProfileDto;

    const updateUserData: DeepPartial<UpdateProfileDto> = {};

    if (first_name) updateUserData.first_name = first_name;
    if (last_name) updateUserData.last_name = last_name;
    if (phone) updateUserData.phone = phone;
    if (email) updateUserData.email = email;

    if (!first_name && !last_name && !phone && !email) {
      throw new BadRequestException(EBadRequestMessages.NoDataToUpdateProfile);
    }

    await this.userRepository.update({ id: userId }, updateUserData);

    return {
      message: EPublicMessages.ProfileUpdatedSuccessfully,
    };
  }
}
