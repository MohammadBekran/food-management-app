import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';

import { PaginationDto } from 'src/common/dto/pagination.dto';
import {
  EConflictMessages,
  ENotBadRequestMessages,
  ENotFoundMessages,
  EPublicMessages,
} from 'src/common/enums/message.enum';
import {
  paginationData,
  paginationGenerator,
} from 'src/common/utils/pagination.util';

import { CreateDiscountDto, UpdateDiscountDto } from './dto/discount.dto';
import { DiscountEntity } from './entity/discount.entity';

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

  async update(discountCode: string, updateDiscountDto: UpdateDiscountDto) {
    const { code, amount, percent, limit, expires_in } = updateDiscountDto;

    await this.findOne(discountCode);

    const updateDiscountData: DeepPartial<UpdateDiscountDto> = {};
    if (code) {
      await this.checkExistenceByCode(code);
      updateDiscountData.code = code;
    }

    if ((amount && percent) || (!amount && !percent)) {
      throw new BadRequestException(
        ENotBadRequestMessages.EnterOneOfTheAmountOrPercentFields,
      );
    }
    if (amount && !isNaN(parseFloat(amount.toString()))) {
      updateDiscountData.amount = amount;
    } else if (percent && !isNaN(parseFloat(percent.toString()))) {
      updateDiscountData.percent = percent;
    }
    if (expires_in && !isNaN(parseInt(expires_in.toString()))) {
      const time = 1000 * 60 * 60 * 24 * parseInt(expires_in.toString());

      updateDiscountData.expires_in = new Date(new Date().getTime() + time);
    }
    if (limit && !isNaN(parseInt(limit.toString()))) {
      updateDiscountData.limit = limit;
    }

    await this.discountRepository.update(
      { code: discountCode },
      updateDiscountData,
    );

    return {
      message: EPublicMessages.DiscountUpdatedSuccessfully,
    };
  }

  async delete(code: string) {
    await this.findOne(code);

    await this.discountRepository.delete({ code });

    return {
      message: EPublicMessages.DiscountDeletedSuccessfully,
    };
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit, skip } = paginationData(
      paginationDto.page,
      paginationDto.limit,
    );

    const [discounts, count] = await this.discountRepository.findAndCount({
      where: {},
      skip,
      take: limit,
    });

    return {
      pagination: paginationGenerator(count, page, limit),
      discounts,
    };
  }

  async findOne(code: string) {
    const discount = await this.discountRepository.findOneBy({ code });
    if (!discount)
      throw new NotFoundException(ENotFoundMessages.DiscountNotFound);

    return discount;
  }

  async checkExistenceByCode(code: string) {
    const discount = await this.discountRepository.findOneBy({ code });
    if (discount)
      throw new ConflictException(EConflictMessages.DiscountAlreadyExists);

    return discount;
  }
}
