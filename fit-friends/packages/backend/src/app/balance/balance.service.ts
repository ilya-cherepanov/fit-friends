import {Injectable, NotFoundException} from '@nestjs/common';
import {BalanceRepository} from './balance.repository';
import {BalanceEntity} from './balance-entity';
import {BalanceChangeType, MAX_COLLECTION_LENGTH, OrderType} from '@fit-friends/core';
import {GetBalanceQuery} from './query/get-balance.query';
import {ChangeBalanceDTO} from './dto/change-balance.dto';
import {BALANCE_ITEM_NOT_FOUND} from '../../constants';


@Injectable()
export class BalanceService {
  constructor(private readonly balanceRepository: BalanceRepository) {}

  async getMany(userId: number, query: GetBalanceQuery) {
    const skip = query.page * MAX_COLLECTION_LENGTH;

    const {balanceItems, count} =
      await this.balanceRepository.getMany(userId, skip, MAX_COLLECTION_LENGTH, query.types);

    return {
      currentPage: query.page,
      totalPages: Math.ceil(count / MAX_COLLECTION_LENGTH),
      items: balanceItems,
    };
  }

  async change(userId: number, dto: ChangeBalanceDTO) {
    const balance = await this.balanceRepository.findOne({
      userId,
      type: dto.type,
      gymOrTrainingId: dto.id,
    });

    if (!balance) {
      throw new NotFoundException(BALANCE_ITEM_NOT_FOUND);
    }

    const balanceEntity = new BalanceEntity({
      ...balance,
      type: balance.type as OrderType,
    });

    balanceEntity[dto.changeType === BalanceChangeType.Decrement ? 'decrement' : 'increment']();

    return this.balanceRepository.update(balanceEntity);
  }

  async upsert(balanceEntity: BalanceEntity) {
    const balance = await this.balanceRepository.findOne({
      userId: balanceEntity.userId,
      type: balanceEntity.type,
      gymOrTrainingId: balanceEntity.type === OrderType.Training
        ? balanceEntity.trainingId
        : balanceEntity.gymId,
    });

    if (!balance) {
      return this.balanceRepository.create(balanceEntity);
    }

    const balanceEntityClone = Object.assign({}, balanceEntity);
    Object.setPrototypeOf(balanceEntityClone, BalanceEntity.prototype);
    balanceEntityClone.id = balance.id;
    balanceEntityClone.increment(balance.remains);
    return this.balanceRepository.update(balanceEntityClone);
  }

  async check(trainingId: number, sportsmanId: number) {
    return {
      status: await this.balanceRepository.check(trainingId, sportsmanId),
    };
  }
}
