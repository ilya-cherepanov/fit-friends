import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import {ReviewRepository} from './review-repository';
import {TrainingsModule} from '../trainings/trainings.module';


@Module({
  imports: [TrainingsModule],
  controllers: [ReviewsController],
  providers: [ReviewsService, ReviewRepository],
})
export class ReviewsModule {}
