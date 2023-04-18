import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsController } from './reviews.controller';
import {PrismaModule} from '../prisma/prisma.module';
import {TrainingsModule} from '../trainings/trainings.module';
import {ReviewsService} from './reviews.service';
import {ReviewRepository} from './review-repository';

describe('ReviewsController', () => {
  let controller: ReviewsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, TrainingsModule],
      controllers: [ReviewsController],
      providers: [ReviewsService, ReviewRepository],
    }).compile();

    controller = module.get<ReviewsController>(ReviewsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
