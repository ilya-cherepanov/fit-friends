import { Module } from '@nestjs/common';
import { EatingsController } from './eatings.controller';
import { EatingsService } from './eatings.service';
import {EatingRepository} from './eating.repository';


@Module({
  controllers: [EatingsController],
  providers: [EatingsService, EatingRepository],
})
export class EatingsModule {}
