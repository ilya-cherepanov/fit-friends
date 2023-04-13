import { Module } from '@nestjs/common';
import { EatingsController } from './eatings.controller';
import { EatingsService } from './eatings.service';
import {PrismaModule} from '../prisma/prisma.module';
import {EatingRepository} from './eating.repository';


@Module({
  imports: [PrismaModule],
  controllers: [EatingsController],
  providers: [EatingsService, EatingRepository],
})
export class EatingsModule {}
