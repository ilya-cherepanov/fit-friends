import { Injectable } from '@nestjs/common';
import {GymRepository} from './gym.repository';
import {MAX_COLLECTION_LENGTH} from '@fit-friends/core';


@Injectable()
export class GymsService {
  constructor(private readonly gymRepository: GymRepository) {}

  async setFavorite(userId: number, gymId: number, state: boolean) {
    if (state) {
      return this.gymRepository.createFavorite(userId, gymId);
    }

    return this.gymRepository.deleteFavorite(userId, gymId);
  }

  async getFavorites(userId: number, page: number) {
    const skip = page * MAX_COLLECTION_LENGTH;

    const {gyms, count} = await this.gymRepository.getFavorites(skip, MAX_COLLECTION_LENGTH, userId);

    return {
      currentPage: page,
      totalPages: Math.ceil(count / MAX_COLLECTION_LENGTH),
      items: gyms,
    };
  }
}
