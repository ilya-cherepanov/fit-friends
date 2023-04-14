import {BadRequestException, ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import {TrainingRequestRepository} from './training-request.repository';
import {JWTPayload} from '@fit-friends/shared-types';
import {TrainingRequestStatus} from '@fit-friends/core';


@Injectable()
export class TrainingRequestsService {
  constructor(private readonly trainingRequestRepository: TrainingRequestRepository) {}

  async create(user: JWTPayload, targetId: number) {
    if (user.sub === targetId) {
      throw new BadRequestException();
    }

    const trainingRequest = await this.trainingRequestRepository.getById(user.sub, targetId);
    if (trainingRequest) {
      throw new ConflictException();
    }

    return this.trainingRequestRepository.create(user.sub, targetId);
  }

  async accept(user: JWTPayload, initiatorId: number) {
    const trainingRequest = await this.trainingRequestRepository.getById(initiatorId, user.sub);
    if (!trainingRequest) {
      throw new NotFoundException();
    }
    if (trainingRequest.status !== TrainingRequestStatus.UnderConsideration) {
      throw new ConflictException();
    }

    return this.trainingRequestRepository.accept(initiatorId, user.sub);
  }

  async reject(user: JWTPayload, initiatorId: number) {
    const trainingRequest = await this.trainingRequestRepository.getById(initiatorId, user.sub);
    if (!trainingRequest) {
      throw new BadRequestException();
    }
    if (trainingRequest.status !== TrainingRequestStatus.UnderConsideration) {
      throw new ConflictException();
    }

    return this.trainingRequestRepository.reject(initiatorId, user.sub);
  }

  async clear(initiatorId: number, targetId: number) {
    const trainingRequest = await this.trainingRequestRepository.getById(initiatorId, targetId);
    if (!trainingRequest) {
      throw new BadRequestException();
    }

    return this.trainingRequestRepository.clearRequest(initiatorId, targetId);
  }
}
