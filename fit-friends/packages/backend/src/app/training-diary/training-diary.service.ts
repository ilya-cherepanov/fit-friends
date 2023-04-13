import {Injectable, NotFoundException} from '@nestjs/common';
import {TrainingDiaryRepository} from './training-diary.repository';
import {TrainingRepository} from '../trainings/training.repository';
import {TRAINING_NOT_FOUND} from '../../constants';
import {MAX_COLLECTION_LENGTH, TrainingTimeIntervals} from '@fit-friends/core';
import {GetCompletedTrainingsDTO} from './dto/get-completed-trainings.dto';
import {CompletedTrainingsQuery} from './query/completed-trainings.query';


@Injectable()
export class TrainingDiaryService {
  constructor(
    private readonly trainingDiaryRepository: TrainingDiaryRepository,
    private readonly trainingRepository: TrainingRepository,
  ) {}

  async create(sportsmanId: number, trainingId: number) {
    const training = await this.trainingRepository.getById(trainingId);
    if (!training) {
      throw new NotFoundException(TRAINING_NOT_FOUND);
    }

    return this.trainingDiaryRepository.create(sportsmanId, {
      trainingId: trainingId,
      duration: TrainingTimeIntervals[training.duration],
      calories: training.calories,
    });
  }

  async getMany(
    sportsmanId: number,
    dto: GetCompletedTrainingsDTO,
    query: CompletedTrainingsQuery,
  ) {
    const skip = query.page * MAX_COLLECTION_LENGTH;

    const {completedTrainings, totalCount} = await this.trainingDiaryRepository.getMany(
      skip,
      MAX_COLLECTION_LENGTH,
      dto.after,
      dto.before,
      sportsmanId,
    );

    return {
      currentPage: query.page,
      totalPages: totalCount,
      items: completedTrainings,
    };
  }
}
