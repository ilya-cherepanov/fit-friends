import { Module } from '@nestjs/common';
import { TrainingRequestsService } from './training-requests.service';
import { TrainingRequestsController } from './training-requests.controller';
import {TrainingRequestRepository} from './training-request.repository';

@Module({
  providers: [TrainingRequestsService, TrainingRequestRepository],
  controllers: [TrainingRequestsController],
})
export class TrainingRequestsModule {}
