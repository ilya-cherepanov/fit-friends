import { Injectable } from '@nestjs/common';
import {EatingRepository} from './eating.repository';
import {GetEatingsDTO} from './dto/get-eatings.dto';
import {MAX_COLLECTION_LENGTH} from '@fit-friends/core';
import {CreateEatingListDTO} from './dto/create-eating-list.dto';


@Injectable()
export class EatingsService {
  constructor(private readonly eatingRepository: EatingRepository) {}

  async getMany(sportsmanId: number, dto: GetEatingsDTO, page: number) {
    const skip = page * MAX_COLLECTION_LENGTH;

    const {eatings, count} = await this.eatingRepository.getMany(
      skip,
      MAX_COLLECTION_LENGTH,
      dto.after,
      dto.before,
      sportsmanId
    );

    return {
      currentPage: page,
      totalPages: Math.ceil(count / MAX_COLLECTION_LENGTH),
      items: eatings,
    };
  }

  async save(sportsmanId: number, dto: CreateEatingListDTO) {
    return this.eatingRepository.upsert(sportsmanId, dto.items);
  }
}
