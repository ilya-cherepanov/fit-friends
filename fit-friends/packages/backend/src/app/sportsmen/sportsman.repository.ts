import {ConflictException, Injectable} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import {SportsmanEntity} from '../users/user.entity';
import {Prisma} from '@prisma/client';
import {PRISMA_VIOLATION_OF_UNIQUENESS_CODE, USER_WITH_EMAIL_ALREADY_EXISTS} from '../../constants';

@Injectable()
export class SportsmanRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getById(sportsmanId: number) {
    const sportsman = await this.prismaService.user.findFirst({
      where: {id: sportsmanId},
      include: {
        sportsman: true,
      },
    });

    if (!sportsman) {
      return null;
    }

    return sportsman;
  }

  async create(newSportsman: SportsmanEntity) {
    try {
      return await this.prismaService.user.create({
        data: {
          name: newSportsman.name,
          email: newSportsman.email,
          password: newSportsman.password,
          avatar: newSportsman.avatar,
          sex: newSportsman.sex,
          birthDate: newSportsman.birthDate,
          location: newSportsman.location,
          level: newSportsman.level,
          trainingTypes: newSportsman.trainingTypes,
          role: newSportsman.role,
          sportsman: {
            create: {
              caloriesPerDay: newSportsman.caloriesPerDay,
              caloriesToLose: newSportsman.caloriesToLose,
              readyToTraining: newSportsman.readyToTraining,
              trainingDuration: newSportsman.trainingDuration,
              description: newSportsman.description,
            },
          },
        },
        include: {
          sportsman: true,
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError
        && err.code === PRISMA_VIOLATION_OF_UNIQUENESS_CODE) {
        throw new ConflictException(USER_WITH_EMAIL_ALREADY_EXISTS);
      }

      throw err;
    }
  }

  async update(sportsmanEntity: SportsmanEntity) {
    try {
      return await this.prismaService.user.update({
        where: {id: sportsmanEntity.id},
        data: {
          name: sportsmanEntity.name,
          email: sportsmanEntity.email,
          password: sportsmanEntity.password,
          avatar: sportsmanEntity.avatar,
          sex: sportsmanEntity.sex,
          birthDate: sportsmanEntity.birthDate,
          location: sportsmanEntity.location,
          level: sportsmanEntity.level,
          trainingTypes: sportsmanEntity.trainingTypes,
          role: sportsmanEntity.role,
          sportsman: {
            update: {
              caloriesPerDay: sportsmanEntity.caloriesPerDay,
              caloriesToLose: sportsmanEntity.caloriesToLose,
              readyToTraining: sportsmanEntity.readyToTraining,
              trainingDuration: sportsmanEntity.trainingDuration,
              description: sportsmanEntity.description,
            },
          },
        },
        include: {
          sportsman: true,
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError
        && err.code === PRISMA_VIOLATION_OF_UNIQUENESS_CODE) {
        throw new ConflictException(USER_WITH_EMAIL_ALREADY_EXISTS);
      }

      throw err;
    }
  }
}
