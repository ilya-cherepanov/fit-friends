import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsController } from './notifications.controller';
import {NotificationsService} from './notifications.service';
import {NotificationRepository} from './notification.repository';
import {PrismaModule} from '../prisma/prisma.module';

describe('NotificationsController', () => {
  let controller: NotificationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [NotificationsService, NotificationRepository],
      controllers: [NotificationsController],
    }).compile();

    controller = module.get<NotificationsController>(NotificationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
