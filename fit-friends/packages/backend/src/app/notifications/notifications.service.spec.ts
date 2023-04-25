import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import {NotificationRepository} from './notification.repository';
import {PrismaModule} from '../prisma/prisma.module';
import {DeepMockProxy, mockDeep} from 'jest-mock-extended';
import {NotificationText} from '@fit-friends/core';
import {faker} from '@faker-js/faker/locale/ru';
import {InternalServerErrorException} from '@nestjs/common';
import {count} from 'rxjs';


describe('NotificationsService', () => {
  let notificationsService: NotificationsService;
  let notificationRepository: DeepMockProxy<NotificationRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [NotificationsService, NotificationRepository],
    })
      .overrideProvider(NotificationRepository)
      .useValue(mockDeep<NotificationRepository>())
      .compile();

    notificationsService = module.get<NotificationsService>(NotificationsService);
    notificationRepository = module.get(NotificationRepository);
  });

  it('should be defined', () => {
    expect(notificationsService).toBeDefined();
  });

  const userId = 1;

  const notifications = [
    {
      id: 1,
      userId,
      text: faker.random.alphaNumeric(NotificationText.MinLength + 1),
      createdAt: new Date(),
    },
    {
      id: 2,
      userId,
      text: faker.random.alphaNumeric(NotificationText.MinLength + 1),
      createdAt: new Date(),
    },
    {
      id: 3,
      userId,
      text: faker.random.alphaNumeric(NotificationText.MinLength + 1),
      createdAt: new Date(),
    },
  ];

  describe('create', () => {
    it('should throw InternalServerErrorException if notification message too short', async () => {
      const text = faker.random.alphaNumeric(NotificationText.MinLength - 1);

      await expect(notificationsService.create(userId, text)).rejects.toThrowError(InternalServerErrorException);
    });

    it('should throw InternalServerErrorException if notification message too long', async () => {
      const text = faker.random.alphaNumeric(NotificationText.MaxLength + 1);

      await expect(notificationsService.create(userId, text)).rejects.toThrowError(InternalServerErrorException);
    });

    it('should return notification data', async () => {
      notificationRepository.create.mockImplementation(async (data) => ({
        ...notifications[0],
        text: data.text,
        userId: data.userId,
      }));

      const text = faker.random.alphaNumeric(NotificationText.MinLength + 1);

      await expect(notificationsService.create(userId, text)).resolves.toStrictEqual({
        ...notifications[0],
        text,
        userId,
      });
    });
  });

  describe('getMany', () => {
    it('should return notification list', async () => {
      notificationRepository.getMany.mockResolvedValue({
        notifications: notifications.map((notification) => ({...notification})),
        count: notifications.length,
      });

      const page = 0;

      await expect(notificationsService.getMany(userId, page)).resolves.toStrictEqual({
        currentPage: page,
        totalPages: 1,
        items: notifications.map((notification) => ({...notification})),
      });
    });
  });

  describe('delete', () => {
    it('should call notificationRepository.delete', async () => {
      const notificationId = 1;

      await notificationsService.delete(notificationId, userId);

      expect(notificationRepository.delete).toBeCalledWith(notificationId, userId);
    });
  });
});
