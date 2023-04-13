import {CreateEatingDTO} from './dto/create-eating.dto';
import {Injectable} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';

@Injectable()
export class EatingRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getMany(afterDate: Date, beforeDate: Date, sportsmanId: number) {
    return this.prismaService.eating.findMany({
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
    });
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
