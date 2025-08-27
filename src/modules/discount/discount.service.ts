import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';

import {
  EConflictMessages,
  ENotBadRequestMessages,
  EPublicMessages,
} from 'src/common/enums/message.enum';
import { DiscountEntity } from './entity/discount.entity';

import { CreateDiscountDto } from './dto/discount.dto';

@Injectable()
export class DiscountService {
  constructor(
    @InjectRepository(DiscountEntity)
    private discountRepository: Repository<DiscountEntity>,
  ) {}

  async create(createDiscountDto: CreateDiscountDto) {
    const { code, amount, percent, limit, expires_in } = createDiscountDto;

    await this.checkExistenceByCode(code);

    const createDiscountData: DeepPartial<DiscountEntity> = { code };
    if ((amount && percent) || (!amount && !percent)) {
      throw new BadRequestException(
        ENotBadRequestMessages.EnterOneOfTheAmountOrPercentFields,
      );
    }
    if (amount && !isNaN(parseFloat(amount.toString()))) {
      createDiscountData.amount = amount;
    } else if (percent && !isNaN(parseFloat(percent.toString()))) {
      createDiscountData.percent = percent;
    }
    if (expires_in && !isNaN(parseInt(expires_in.toString()))) {
      const time = 1000 * 60 * 60 * 24 * parseInt(expires_in.toString());

      createDiscountData.expires_in = new Date(new Date().getTime() + time);
    }
    if (limit && !isNaN(parseInt(limit.toString()))) {
      createDiscountData.limit = limit;
    }

    await this.discountRepository.insert(createDiscountData);

    return {
      message: EPublicMessages.DiscountCreatedSuccessfully,
    };
  }

  async update() {}

  async delete() {}

  async findAll() {}

  async checkExistenceByCode(code: string) {
    const discount = await this.discountRepository.findOneBy({ code });
    if (discount)
      throw new ConflictException(EConflictMessages.DiscountAlreadyExists);

    return discount;
  }
}
