import {Injectable, NotFoundException} from '@nestjs/common';
import {ReviewRepository} from './review-repository';
import {TrainingRepository} from '../trainings/training.repository';
import {CreateReviewDTO} from './dto/create-review.dto';
import {TRAINING_NOT_FOUND} from '../../constants';
import {BaseUserEntity} from '../users/user.entity';
import {MAX_COLLECTION_LENGTH} from '@fit-friends/core';


@Injectable()
export class ReviewsService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly trainingRepository: TrainingRepository,
  ) {}

  async create(authorId: number, dto: CreateReviewDTO) {
    const training = await this.trainingRepository.getById(dto.trainingId);
    if (!training) {
      throw new NotFoundException(TRAINING_NOT_FOUND);
    }

    const review = await this.reviewRepository.create(authorId, dto);

    return {
      ...review,
      author: BaseUserEntity.createFromPrisma(review.author),
    };
  }

  async getMany(trainingId: number, page: number) {
    const training = await this.trainingRepository.getById(trainingId);
    if (!training) {
      throw new NotFoundException(TRAINING_NOT_FOUND);
    }

    const skip = page * MAX_COLLECTION_LENGTH;
    const {reviews, count} = await this.reviewRepository.getMany(trainingId, skip, MAX_COLLECTION_LENGTH);

    return {
      currentPage: page,
      totalPages: Math.ceil(count / MAX_COLLECTION_LENGTH),
      items: reviews.map((review) => ({
        ...review,
        author: BaseUserEntity.createFromPrisma(review.author),
      })),
    };
  }
}
