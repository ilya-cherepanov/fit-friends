import {Injectable} from '@nestjs/common';
import {TrainingEntity} from './training.entity';
import {PrismaService} from '../prisma/prisma.service';
import {Training} from '@prisma/client';


@Injectable()
export class TrainingRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(newTraining: TrainingEntity, coachId: number): Promise<Training> {
    return this.prismaService.training.create({
      data: {
        ...newTraining,
        coachId,
      }
    });
  }
}
