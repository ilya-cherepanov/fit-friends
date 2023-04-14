import {Injectable} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import {Prisma} from '@prisma/client';
import {TrainingRequestStatus} from '@fit-friends/core';
import {when} from 'joi';


@Injectable()
export class TrainingRequestRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getById(initiatorId: number, targetId: number) {
    return this.prismaService.trainingRequest.findFirst({
      where: {
        initiatorId,
        targetUserId: targetId,
      },
    });
  }

  async create(initiatorId: number, targetId: number) {
    return this.prismaService.trainingRequest.create({
      data: {
        initiatorId,
        targetUserId: targetId,
        status: TrainingRequestStatus.UnderConsideration,
      },
    });
  }

  async accept(initiatorId: number, targetId: number) {
    const {count} = await this.prismaService.trainingRequest.updateMany({
      where: {
        initiatorId,
        targetUserId: targetId,
      },
      data: {
        status: TrainingRequestStatus.Accepted,
      },
    });

    return count > 0;
  }

  async reject(initiatorId: number, targetId: number) {
    const {count} = await this.prismaService.trainingRequest.updateMany({
      where: {
        initiatorId,
        targetUserId: targetId,
      },
      data: {
        status: TrainingRequestStatus.Rejected,
      },
    })

    return count > 0;
  }

  async clearRequest(initiatorId: number, targetId: number) {
    const {count} = await this.prismaService.trainingRequest.deleteMany({
      where: {
        initiatorId,
        targetUserId: targetId,
      },
    });

    return count > 0;
  }
}
