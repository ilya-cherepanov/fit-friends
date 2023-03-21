import {BadRequestException, Injectable, InternalServerErrorException} from '@nestjs/common';
import {TrainingRepository} from './training.repository';
import {UserRepository} from '../users/user.repository';
import {CreateTrainingDTO} from './dto/create-training.dto';
import {BaseUserEntity, CoachEntity} from '../users/user.entity';
import {COACH_NOT_HAS_SPECIALIZATION} from '../../constants';
import {TrainingEntity} from './training.entity';
import {getRandomTrainingImage} from '../../utils/image';

@Injectable()
export class TrainingsService {
  constructor(
    private readonly trainingRepository: TrainingRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async create(dto: CreateTrainingDTO, coachId: number, video: string) {
    const coach = await this.userRepository.getById(coachId);
    const coachEntity = BaseUserEntity.createFromPrisma(coach);
    if (!(coachEntity instanceof CoachEntity)) {
      throw new InternalServerErrorException();
    }
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
}
