import {Injectable} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import {UserRole} from '@fit-friends/core';
import {Prisma} from '@prisma/client';
import {UserFilters} from '../../types/user-filters';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getById(id: number) {
    const user = await this.prismaService.user.findFirst({
      where: {id},
      include: {
        sportsman: true,
        coach: true,
      },
    });

    if (!user) {
      return null;
    }

    return user;
  }

  async getAll(take: number, skip: number, filters: UserFilters, orderBy: UserRole) {
    const query: Prisma.UserFindManyArgs = {
      where: {
        location: filters.locations ? {in: filters.locations} : undefined,
        trainingTypes: filters.trainingTypes ? {hasSome: filters.trainingTypes} : undefined,
        level: filters.level,
      },
      include: {
        sportsman: true,
        coach: true,
      },
      orderBy: {},
      skip,
      take,
    };

    if (orderBy === UserRole.Coach) {
      query.orderBy = {
        role: 'asc',
      };
    } else if (orderBy === UserRole.Sportsman) {
      query.orderBy = {
        role: 'desc',
      };
    } else {
      query.orderBy = {
        createdAt: 'desc',
      };
    }

    return this.prismaService.user.findMany(query);
  }

  async getByEmail(email: string) {
    const user = await this.prismaService.user.findFirst({
      where: {email},
      include: {
        sportsman: true,
        coach: true,
      },
    });

    if (!user) {
      return null;
    }

    return user;
  }

  async saveRefreshToken(userId: number, refreshToken: string | null) {
    return this.prismaService.user.update({
      where: {id: userId},
      data: {
        refreshToken,
      }
    });
  }

  async count(filters: UserFilters) {
    return this.prismaService.user.count({
      where: {
        location: filters.locations ? {in: filters.locations} : undefined,
        trainingTypes: filters.trainingTypes ? {hasSome: filters.trainingTypes} : undefined,
        level: filters.level,
      },
    });
  }
}
