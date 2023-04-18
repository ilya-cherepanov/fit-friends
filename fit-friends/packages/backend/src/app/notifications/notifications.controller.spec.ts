import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsController } from './notifications.controller';
import {NotificationsService} from './notifications.service';
import {NotificationRepository} from './notification.repository';

describe('NotificationsController', () => {
  let controller: NotificationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationsService, NotificationRepository],
      controllers: [NotificationsController],
    }).compile();

    controller = module.get<NotificationsController>(NotificationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
