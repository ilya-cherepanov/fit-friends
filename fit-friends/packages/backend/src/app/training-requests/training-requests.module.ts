import { Module } from '@nestjs/common';
import { TrainingRequestsService } from './training-requests.service';
import { TrainingRequestsController } from './training-requests.controller';
import {TrainingRequestRepository} from './training-request.repository';
import {UsersModule} from '../users/users.module';
import {NotificationsModule} from '../notifications/notifications.module';


@Module({
  imports: [UsersModule, NotificationsModule],
  providers: [TrainingRequestsService, TrainingRequestRepository],
  controllers: [TrainingRequestsController],
})
export class TrainingRequestsModule {}
