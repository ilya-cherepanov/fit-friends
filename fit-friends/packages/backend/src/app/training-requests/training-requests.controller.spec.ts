import { Test, TestingModule } from '@nestjs/testing';
import { TrainingRequestsController } from './training-requests.controller';
import {PrismaModule} from '../prisma/prisma.module';
import {TrainingRequestsService} from './training-requests.service';
import {TrainingRequestRepository} from './training-request.repository';
import {UsersModule} from '../users/users.module';
import {NotificationsModule} from '../notifications/notifications.module';


describe('TrainingRequestsController', () => {
  let controller: TrainingRequestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PrismaModule,
        UsersModule,
        NotificationsModule,
      ],
      providers: [TrainingRequestsService, TrainingRequestRepository],
      controllers: [TrainingRequestsController],
    }).compile();

    controller = module.get<TrainingRequestsController>(
      TrainingRequestsController
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
