import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsService } from './reviews.service';
import {ReviewRepository} from './review-repository';
import {PrismaModule} from '../prisma/prisma.module';
import {TrainingsModule} from '../trainings/trainings.module';

describe('ReviewsService', () => {
  let service: ReviewsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, TrainingsModule],
      providers: [ReviewsService, ReviewRepository],
    }).compile();

    service = module.get<ReviewsService>(ReviewsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
