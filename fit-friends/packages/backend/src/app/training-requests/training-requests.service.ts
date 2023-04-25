import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import {TrainingRequestRepository} from './training-request.repository';
import {JWTPayload} from '@fit-friends/shared-types';
import {TrainingRequestStatus} from '@fit-friends/core';
import {NotificationsService} from '../notifications/notifications.service';
import {UserRepository} from '../users/user.repository';
import {
  FAILED_CHANGE_TRAINING_REQUEST,
  INVALID_TRAINING_REQUEST_STATUS,
  NO_SELF_TRAINING_REQUEST,
  NO_TRAINING_REQUEST,
  TRAINING_REQUEST_ALREADY_EXISTS,
  USER_NOT_FOUND,
  USER_NOT_READY_FOR_TRAINING
} from '../../constants';


@Injectable()
export class TrainingRequestsService {
  constructor(
    private readonly trainingRequestRepository: TrainingRequestRepository,
    private readonly notificationsService: NotificationsService,
    private readonly userRepository: UserRepository,
  ) {}

  async create(user: JWTPayload, targetId: number) {
    if (user.sub === targetId) {
      throw new BadRequestException(NO_SELF_TRAINING_REQUEST);
    }

    const targetUser = await this.userRepository.getById(targetId);
    if (!targetUser) {
      throw new NotFoundException(USER_NOT_FOUND);
    }

    if (targetUser.coach && !targetUser.coach.hasPersonalTrainings
      || targetUser.sportsman && !targetUser.sportsman.readyToTraining) {
      throw new BadRequestException(USER_NOT_READY_FOR_TRAINING);
    }

    const trainingRequest = await this.trainingRequestRepository.getById(user.sub, targetId);
    if (trainingRequest) {
      throw new ConflictException(TRAINING_REQUEST_ALREADY_EXISTS);
    }

    const newTrainingRequest = await this.trainingRequestRepository.create(user.sub, targetId);

    const initiator = await this.userRepository.getById(user.sub);
    await this.notificationsService.create(
      targetId,
      `Пользователь ${initiator.name} отправил вам запрос на тренировку`
    );

    return newTrainingRequest;
  }

  async accept(user: JWTPayload, initiatorId: number) {
    const trainingRequest = await this.trainingRequestRepository.getById(initiatorId, user.sub);
    if (!trainingRequest) {
      throw new NotFoundException(NO_TRAINING_REQUEST);
    }
    if (trainingRequest.status !== TrainingRequestStatus.UnderConsideration) {
      throw new ConflictException(INVALID_TRAINING_REQUEST_STATUS);
    }

    const isSuccess = await this.trainingRequestRepository.accept(initiatorId, user.sub);
    if (!isSuccess) {
      throw new InternalServerErrorException(FAILED_CHANGE_TRAINING_REQUEST);
    }

    const target = await this.userRepository.getById(user.sub);
    await this.notificationsService.create(
      initiatorId,
      `Пользователь ${target.name} принял ваше приглашение на тренировку`
    );

    return isSuccess;
  }

  async reject(user: JWTPayload, initiatorId: number) {
    const trainingRequest = await this.trainingRequestRepository.getById(initiatorId, user.sub);
    if (!trainingRequest) {
      throw new NotFoundException(NO_TRAINING_REQUEST);
    }
    if (trainingRequest.status !== TrainingRequestStatus.UnderConsideration) {
      throw new ConflictException(INVALID_TRAINING_REQUEST_STATUS);
    }

    const isSuccess = await this.trainingRequestRepository.reject(initiatorId, user.sub);
    if (!isSuccess) {
      throw new InternalServerErrorException(FAILED_CHANGE_TRAINING_REQUEST);
    }

    const target = await this.userRepository.getById(user.sub);
    await this.notificationsService.create(
      initiatorId,
      `Пользователь ${target.name} отклонил ваше приглашение на тренировку`
    );

    return isSuccess;
  }

  async clear(initiatorId: number, targetId: number) {
    const trainingRequest = await this.trainingRequestRepository.getById(initiatorId, targetId);
    if (!trainingRequest) {
      throw new NotFoundException(NO_TRAINING_REQUEST);
    }

    return this.trainingRequestRepository.clearRequest(initiatorId, targetId);
  }
}
