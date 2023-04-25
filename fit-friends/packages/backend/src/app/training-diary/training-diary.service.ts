import {ForbiddenException, Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import {TrainingDiaryRepository} from './training-diary.repository';
import {TrainingRepository} from '../trainings/training.repository';
import {BALANCE_CANNOT_BE_NEGATIVE, TRAINING_NOT_FOUND, USERS_BALANCE_IS_ZERO} from '../../constants';
import {BalanceChangeType, MAX_COLLECTION_LENGTH, OrderType, TrainingTimeIntervals} from '@fit-friends/core';
import {GetCompletedTrainingsDTO} from './dto/get-completed-trainings.dto';
import {CompletedTrainingsQuery} from './query/completed-trainings.query';
import {BalanceService} from '../balance/balance.service';


@Injectable()
export class TrainingDiaryService {
  constructor(
    private readonly trainingDiaryRepository: TrainingDiaryRepository,
    private readonly trainingRepository: TrainingRepository,
    private readonly balanceService: BalanceService,
  ) {}

  async create(sportsmanId: number, trainingId: number) {
    const training = await this.trainingRepository.getById(trainingId);
    if (!training) {
      throw new NotFoundException(TRAINING_NOT_FOUND);
    }

    try {
      await this.balanceService.change(sportsmanId, {
        id: trainingId,
        type: OrderType.Training,
        changeType: BalanceChangeType.Decrement,
      });
    } catch (err) {
      if (err instanceof InternalServerErrorException
        && err.message === BALANCE_CANNOT_BE_NEGATIVE) {
        throw new ForbiddenException(USERS_BALANCE_IS_ZERO);
      }

      throw err;
    }

    return this.trainingDiaryRepository.create(sportsmanId, {
      trainingId: trainingId,
      duration: training.duration as TrainingTimeIntervals,
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
      totalPages: Math.ceil(totalCount / MAX_COLLECTION_LENGTH),
      items: completedTrainings,
    };
  }
}
