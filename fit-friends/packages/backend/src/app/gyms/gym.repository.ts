import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import {Prisma} from '@prisma/client';
import {PRISMA_NOT_FOUND_CODE, PRISMA_VIOLATION_OF_UNIQUENESS_CODE} from '../../constants';
import {GymFilters} from '../../types/gym-filters';


@Injectable()
export class GymRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getById(gymId: number) {
    return this.prismaService.gym.findFirst({
      where: {id: gymId},
    });
  }

  async getMany(skip: number, take: number, filters: GymFilters) {
    const [gyms, count] = await this.prismaService.$transaction([
      this.prismaService.gym.findMany({
        where: {
          isVerified: filters.isVerified ?? undefined,
          location: filters.locations ? {
            in: filters.locations
          } : undefined,
          parameters: filters.parameters ? {
            hasEvery: filters.parameters
          } : undefined,
          price: {
            gte: filters.minPrice,
            lte: filters.maxPrice,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take,
      }),
      this.prismaService.gym.count(),
    ]);

    return {gyms, count};
  }

  async createFavorite(userId: number, gymId: number) {
    try {
      return await this.prismaService.favoriteGym.create({
        data: {
          userId,
          gymId,
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError
        && err.code === PRISMA_VIOLATION_OF_UNIQUENESS_CODE) {
        throw new ConflictException();
      } else {
        throw err;
      }
    }
  }

  async deleteFavorite(userId: number, gymId: number) {
    try {
      return await this.prismaService.favoriteGym.delete({
        where: {
          userId_gymId: {
            userId,
            gymId,
          },
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError
        && err.code === PRISMA_NOT_FOUND_CODE) {
        throw new NotFoundException();
      } else {
        throw err;
      }
    }
  }

  async getFavorites(skip: number, take: number, userId: number) {
    const [gyms, count] = await this.prismaService.$transaction([
      this.prismaService.gym.findMany({
        where: {
          favoriteGyms: {
            some: {
              userId,
            },
          },
        },
        skip,
        take,
      }),
      this.prismaService.favoriteGym.count({
        where: {
          userId,
        },
      }),
    ]);

    return {
      gyms,
      count,
    };
  }
}
