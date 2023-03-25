import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import {TrainingRepository} from './training.repository';
import {UserRepository} from '../users/user.repository';
import {CreateTrainingDTO} from './dto/create-training.dto';
import {BaseUserEntity, CoachEntity} from '../users/user.entity';
import {COACH_NOT_HAS_SPECIALIZATION, COACH_NOT_OWNER, TRAINING_NOT_FOUND} from '../../constants';
import {TrainingEntity} from './training.entity';
import {getRandomTrainingImage} from '../../utils/image';
import {UpdateTrainingDTO} from './dto/update-traininig.dto';
import {TrainingListQuery} from './query/training-list.query';
import {MAX_COLLECTION_LENGTH} from '@fit-friends/core';

@Injectable()
export class TrainingsService {
  constructor(
    private readonly trainingRepository: TrainingRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async get(trainingId: number) {
    const training = await this.trainingRepository.getById(trainingId);
    if (!training) {
      throw new NotFoundException(TRAINING_NOT_FOUND);
    }

    const coachEntity = this.getCoachEntity(training.coachId);

    return {
      ...training,
      coach: coachEntity,
    };
  }

  async getMany(query: TrainingListQuery, coachId?: number) {
    const skip = MAX_COLLECTION_LENGTH * query.page;

    const trainings = await this.trainingRepository.getMany(MAX_COLLECTION_LENGTH, skip, {
      ...query,
      coachId,
    }, query.orderBy);

    const count = await this.trainingRepository.count({
      ...query,
      coachId,
    });

    return {
      currentPage: query.page,
      totalPages: Math.ceil(count / MAX_COLLECTION_LENGTH),
      items: trainings,
    };
  }

  async create(dto: CreateTrainingDTO, coachId: number, video: string) {
    const coachEntity = await this.getCoachEntity(coachId);
    if (!coachEntity.trainingTypes.includes(dto.type)) {
      throw new BadRequestException(COACH_NOT_HAS_SPECIALIZATION);
    }

    const trainingEntity = new TrainingEntity({
      ...dto,
      video,
      image: await getRandomTrainingImage(),
      level: coachEntity.level,
      isSpecialOffer: false,
    });

    return {
      ...await this.trainingRepository.create(trainingEntity, coachId),
      coach: coachEntity,
    };
  }

  async update(trainingId: number, dto: UpdateTrainingDTO, coachId: number, video: string | null) {
    const coachEntity = await this.getCoachEntity(coachId);
    const training = await this.trainingRepository.getById(trainingId);

    if (dto.type && !coachEntity.trainingTypes.includes(dto.type)) {
      throw new BadRequestException(COACH_NOT_HAS_SPECIALIZATION);
    }
    if (!training) {
      throw new NotFoundException(TRAINING_NOT_FOUND);
    }
    if (training.coach.id !== coachId) {
      throw new ForbiddenException(COACH_NOT_OWNER);
    }

    const trainingEntity = TrainingEntity.createFromPrisma({
      ...training,
    });

    trainingEntity.update({
      ...dto,
      video,
    });

    return {
      ...await this.trainingRepository.update(trainingEntity),
      coach: coachEntity,
    };
  }

  private async getCoachEntity(coachId: number) {
    const coach = await this.userRepository.getById(coachId);
    const coachEntity = BaseUserEntity.createFromPrisma(coach);
    if (!(coachEntity instanceof CoachEntity)) {
      throw new InternalServerErrorException();
    }

    return coachEntity;
  }
}
