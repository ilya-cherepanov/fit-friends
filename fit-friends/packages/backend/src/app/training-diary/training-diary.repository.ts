import {Injectable} from '@nestjs/common';
import {TrainingTimeIntervals} from '@fit-friends/core';
import {PrismaService} from '../prisma/prisma.service';


@Injectable()
export class TrainingDiaryRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(sportsmanId: number, data: { trainingId: number, calories: number, duration: TrainingTimeIntervals }) {
    return this.prismaService.completedTraining.create({
      data: {
        ...data,
        userId: sportsmanId,
      },
    });
  }

  async getMany(skip: number, take: number, afterDate: Date, beforeDate: Date, sportsmanId: number) {
    const where = {
      userId: sportsmanId,
      createdAt: {
        gte: afterDate,
        lte: beforeDate,
      },
    };

    const [completedTrainings, totalCount] = await this.prismaService.$transaction([
      this.prismaService.completedTraining.findMany({
        where,
        orderBy: {
          createdAt: 'asc',
        },
        skip,
        take,
      }),
      this.prismaService.completedTraining.count({
        where,
      }),
    ]);

    return {
      completedTrainings,
      totalCount,
    };
  }
}
