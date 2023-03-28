import {ConflictException, Injectable} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import {CoachEntity} from '../users/user.entity';
import {Prisma} from '@prisma/client';
import {PRISMA_VIOLATION_OF_UNIQUENESS_CODE, USER_WITH_EMAIL_ALREADY_EXISTS} from '../../constants';

@Injectable()
export class CoachRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getById(coachId: number) {
    const coach = await this.prismaService.user.findFirst({
      where: {id: coachId},
      include: {
        coach: true,
      },
    });

    if (!coach) {
      return null;
    }

    return coach;
  }

  async create(newCoach: CoachEntity) {
    try {
      return await this.prismaService.user.create({
        data: {
          name: newCoach.name,
          email: newCoach.email,
          password: newCoach.password,
          avatar: newCoach.avatar,
          sex: newCoach.sex,
          birthDate: newCoach.birthDate,
          location: newCoach.location,
          level: newCoach.level,
          trainingTypes: newCoach.trainingTypes,
          role: newCoach.role,
          coach: {
            create: {
              certificate: newCoach.certificate,
              hasPersonalTrainings: newCoach.hasPersonalTrainings,
              achievements: newCoach.achievements,
            },
          },
        },
        include: {
          coach: true,
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

  async update(updatedCoach: CoachEntity) {
    try {
      return await this.prismaService.user.update({
        where: {id: updatedCoach.id},
        data: {
          name: updatedCoach.name,
          email: updatedCoach.email,
          password: updatedCoach.password,
          avatar: updatedCoach.avatar,
          sex: updatedCoach.sex,
          birthDate: updatedCoach.birthDate,
          location: updatedCoach.location,
          level: updatedCoach.level,
          trainingTypes: updatedCoach.trainingTypes,
          role: updatedCoach.role,
          coach: {
            update: {
              certificate: updatedCoach.certificate,
              hasPersonalTrainings: updatedCoach.hasPersonalTrainings,
              achievements: updatedCoach.achievements,
            },
          },
        },
        include: {
          coach: true,
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
