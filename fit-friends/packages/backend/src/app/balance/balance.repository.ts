import {Injectable} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import {BalanceEntity} from './balance-entity';
import {OrderType} from '@fit-friends/core';


@Injectable()
export class BalanceRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getMany(
    userId: number,
    skip: number,
    take: number,
    types = [OrderType.Subscription, OrderType.Training],
  ) {
    const [balanceItems, count] = await this.prismaService.$transaction([
      this.prismaService.balance.findMany({
        where: {
          userId,
          type: {
            in: types,
          },
        },
        include: {
          gym: true,
          training: true,
        },
        take,
        skip,
      }),
      this.prismaService.balance.count({
        where: {
          userId,
          type: {
            in: types,
          },
        },
      }),
    ]);

    return {
      balanceItems,
      count,
    };
  }

  async findOne(options: {userId: number, type: OrderType, gymOrTrainingId: number}) {
    return this.prismaService.balance.findFirst({
      where: {
        userId: options.userId,
        trainingId: options.type === OrderType.Training ? options.gymOrTrainingId : undefined,
        gymId: options.type === OrderType.Subscription ? options.gymOrTrainingId : undefined,
      }
    });
  }

  async create(balanceEntity: BalanceEntity) {
    return this.prismaService.balance.create({
      data: {
        userId: balanceEntity.userId,
        remains: balanceEntity.remains,
        type: balanceEntity.type,
        gymId: balanceEntity.type === OrderType.Training ? balanceEntity.gymId : undefined,
        trainingId: balanceEntity.type === OrderType.Training ? balanceEntity.trainingId : undefined,
      },
      include: {
        gym: true,
        training: true,
      },
    });
  }

  async update(balanceEntity: BalanceEntity) {
    return this.prismaService.balance.update({
      where: {id: balanceEntity.id},
      data: {
        remains: balanceEntity.remains,
      },
      include: {
        gym: true,
        training: true,
      },
    });
  }
}
