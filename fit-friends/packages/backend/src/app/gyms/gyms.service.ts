import {Injectable, NotFoundException} from '@nestjs/common';
import {GymRepository} from './gym.repository';
import {MAX_COLLECTION_LENGTH} from '@fit-friends/core';
import {GetGymsQuery} from './query/get-gyms.query';


@Injectable()
export class GymsService {
  constructor(private readonly gymRepository: GymRepository) {}

  async getOne(gymId: number) {
    const gym = await this.gymRepository.getById(gymId);
    if (!gym) {
      throw new NotFoundException();
    }

    return gym;
  }

  async getMany(query: GetGymsQuery) {
    const skip = query.page * MAX_COLLECTION_LENGTH;

    const {gyms, count} = await this.gymRepository.getMany(skip, MAX_COLLECTION_LENGTH, query);

    return {
      currentPage: query.page,
      totalPages: Math.ceil(count / MAX_COLLECTION_LENGTH),
      items: gyms,
    };
  }

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
