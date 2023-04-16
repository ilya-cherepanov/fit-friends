import {CreateEatingDTO} from './dto/create-eating.dto';
import {Injectable} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';

@Injectable()
export class EatingRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getMany(skip: number, take: number, afterDate: Date, beforeDate: Date, sportsmanId: number) {
    const [eatings, count] = await this.prismaService.$transaction([
      this.prismaService.eating.findMany({
        where: {
          createdAt: {
            gte: afterDate,
            lte: beforeDate,
          },
          userId: sportsmanId,
        },
        orderBy: {
          createdAt: 'asc',
        },
        take,
        skip,
      }),
      this.prismaService.eating.count({
        where: {
          createdAt: {
            gte: afterDate,
            lte: beforeDate,
          },
          userId: sportsmanId,
        }
      }),
    ]);

    return {
      eatings,
      count,
    };
  }

  async upsert(sportsmanId: number, eatings: CreateEatingDTO[]) {
    return this.prismaService.$transaction(
      eatings.map((eating) => this.prismaService.eating.upsert({
        where: {
          createdAt_type_userId: {
            createdAt: eating.createdAt,
            type: eating.type,
            userId: sportsmanId,
          },
        },
        create: {
          ...eating,
          userId: sportsmanId,
        },
        update: {
          ...eating,
        },
      }))
    );
  }
}
