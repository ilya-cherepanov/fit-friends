import {Injectable} from '@nestjs/common';
import {TrainingEntity} from './training.entity';
import {PrismaService} from '../prisma/prisma.service';
import {Prisma, Training} from '@prisma/client';
import {TrainingOrderBy, TrainingTimeIntervals, TrainingType} from '@fit-friends/core';

interface TrainingFilters {
  minPrice?: number;
  maxPrice?: number;
  minCalories?: number;
  maxCalories?: number;
  minRating?: number;
  maxRating?: number;
  types?: TrainingType[];
  duration?: TrainingTimeIntervals;
  coachId?: number;
}

@Injectable()
export class TrainingRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getById(id: number) {
    const training = await this.prismaService.training.findFirst({
      where: {id},
      include: {
        coach: true,
      },
    });

    if (!training) {
      return null;
    }

    return training;
  }

  async getMany(take: number, skip: number, filters: TrainingFilters, orderBy?: TrainingOrderBy) {
    const query: Prisma.TrainingFindManyArgs = {
      where: {
        price: {
          gte: filters.minPrice,
          lte: filters.maxPrice,
        },
        calories: {
          gte: filters.minCalories,
          lte: filters.maxCalories,
        },
        rating: {
          gte: filters.minRating,
          lte: filters.maxRating,
        },
        duration: filters.duration ? filters.duration : undefined,
        type: filters.types ? {in: filters.types} : undefined,
        coachId: filters.coachId ? filters.coachId : undefined,
      },
      skip,
      take,
    };

    switch (orderBy) {
      case TrainingOrderBy.Expensive:
        query.orderBy = {
          price: 'asc',
        };
        break;
      case TrainingOrderBy.Free:
        query.where.price = 0;
        break;
      case TrainingOrderBy.Cheap:
      default:
        query.orderBy = {
          price: 'asc',
        };
        break;
    }

    return this.prismaService.training.findMany(query);
  }

  async count(filters: TrainingFilters) {
    return this.prismaService.training.count({
      where: {
        price: {
          gte: filters.minPrice,
          lte: filters.maxPrice,
        },
        calories: {
          gte: filters.minCalories,
          lte: filters.maxCalories,
        },
        rating: {
          gte: filters.minRating,
          lte: filters.maxRating,
        },
        duration: filters.duration ? filters.duration : undefined,
        type: filters.types ? {in: filters.types} : undefined,
        coachId: filters.coachId ? filters.coachId : undefined,
      },
    });
  }

  async create(newTraining: TrainingEntity, coachId: number): Promise<Training> {
    return this.prismaService.training.create({
      data: {
        ...newTraining,
        coachId,
      }
    });
  }

  async update(updatedTraining: TrainingEntity): Promise<Training> {
    return this.prismaService.training.update({
      where: {id: updatedTraining.id},
      data: {
        ...updatedTraining,
        id: undefined,
      },
    })
  }

  async resetNew() {
    return this.prismaService.training.updateMany({
      where: {isNew: true},
      data: {isNew: false},
    });
  }

  async recalculateAvgRating(trainingId: number) {
    const {_avg: {rating: avgRating}} = await this.prismaService.review.aggregate({
      where: {
        trainingId,
      },
      _avg: {
        rating: true,
      },
    });

    return this.prismaService.training.update({
      where: {id: trainingId},
      data: {
        rating: avgRating,
      },
    });
  }
}
