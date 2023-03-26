import {Injectable} from '@nestjs/common';
import {Order} from '../../types/order';
import {PrismaService} from '../prisma/prisma.service';
import {keyBy} from 'lodash';
import {OrdersSort} from '../../types/orders-sort';
import {Prisma} from '@prisma/client';
import {g} from 'vitest/dist/index-5aad25c1';


@Injectable()
export class OrderRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(newOrder: Order) {
    return this.prismaService.order.create({
      data: {
        ...newOrder,
      },
    });
  }

  async getMany(take: number, skip: number, coachId: number, sorting: OrdersSort) {
    const groupedOrders = await this.prismaService.order.groupBy({
      where: {
        training: {
          coachId,
        },
      },
      by: ['trainingId'],
      _sum: {
        sum: true,
        quantity: true,
      },
      orderBy: this.getSortingParams(sorting) as object,
      take: take,
      skip: skip,
    });

    const trainings = keyBy(await this.prismaService.training.findMany({
      where: {
        id: {
          in: groupedOrders.map((groupedOrder) => groupedOrder.trainingId),
        },
      },
    }), 'id');

    return groupedOrders.map((groupedOrder) => ({
      ...trainings[groupedOrder.trainingId],
      sum: groupedOrder._sum.sum,
      quantity: groupedOrder._sum.quantity,
    }));
  }

  async count(coachId: number) {
    return (await this.prismaService.order.groupBy({
      where: {
        training: {
          coachId
        },
      },
      by: ['trainingId'],
    })).length;
  }

  private getSortingParams(sorting: OrdersSort) {
    if (sorting.orderByQuantity) {
      return {
        _sum: {
          quantity: sorting.orderByQuantity,
        },
      };
    } else if (sorting.orderBySum) {
      return {
        _sum: {
          sum: sorting.orderBySum,
        },
      };
    } else {
      return {
        _sum: {
          sum: 'desc',
        },
      };
    }
  }
}
