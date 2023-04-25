import { Test, TestingModule } from '@nestjs/testing';
import { FriendsService } from './friends.service';
import {FriendRepository} from './friend.repository';
import {PrismaModule} from '../prisma/prisma.module';
import {NotificationsModule} from '../notifications/notifications.module';
import {DeepMockProxy, mockDeep} from 'jest-mock-extended';
import {NotificationsService} from '../notifications/notifications.service';
import {BadRequestException, ConflictException, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import {UserRepository} from '../users/user.repository';
import {UsersModule} from '../users/users.module';
import {Coach, Sportsman, User} from '@prisma/client';
import {Level, TrainingType, UserRole, UserSex, Location, FriendStatus, TrainingTimeIntervals} from '@fit-friends/core';
import {BaseUserEntity} from '../users/user.entity';


describe('FriendsService', () => {
  let friendsService: FriendsService;
  let friendRepository: DeepMockProxy<FriendRepository>;
  let notificationService: DeepMockProxy<NotificationsService>;
  let userRepository: DeepMockProxy<UserRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PrismaModule,
        NotificationsModule,
        UsersModule
      ],
      providers: [FriendsService, FriendRepository],
    })
      .overrideProvider(FriendRepository)
      .useValue(mockDeep<FriendRepository>())
      .overrideProvider(NotificationsService)
      .useValue(mockDeep<NotificationsService>())
      .overrideProvider(UserRepository)
      .useValue(mockDeep<UserRepository>())
      .compile();

    friendsService = module.get<FriendsService>(FriendsService);
    friendRepository = module.get(FriendRepository);
    notificationService = module.get(NotificationsService);
    userRepository = module.get(UserRepository);
  });

  it('should be defined', () => {
    expect(friendsService).toBeDefined();
  });

  const userId = 10;
  const user: User = {
    id: userId,
    role: UserRole.Sportsman,
    sex: UserSex.Female,
    level: Level.Amateur,
    email: 'sportsman@mail.com',
    password: 'password',
    location: Location.Zvezdnaya,
    trainingTypes: [TrainingType.Pilates, TrainingType.Yoga],
    avatar: 'avatar.jpg',
    name: 'Valeria',
    birthDate: new Date(),
    createdAt: new Date(),
    refreshToken: null,
  };

  const sportsman: Sportsman = {
    id: 1,
    trainingDuration: TrainingTimeIntervals.OneHundredToOneHundredTwenty,
    caloriesPerDay: 1000,
    caloriesToLose: 2000,
    readyToTraining: true,
  };

  const coach: Coach = {
    id: 1,
    certificate: 'certificate.png',
    achievements: 'Achievements',
    hasPersonalTrainings: true,
  };

  const friendId = 20;

  describe('create', () => {
    it('should throw BadRequestException if userId is equal friendId', async () => {
      await expect(friendsService.create(userId, userId)).rejects.toThrowError(BadRequestException);
    });

    it('should throw NotFoundException if user with given id does not exists', async () => {
      userRepository.getById.mockResolvedValue(null);

      await expect(friendsService.create(userId, friendId)).rejects.toThrowError(NotFoundException)
    });

    it('should throw ConflictException if users are already friends', async () => {
      userRepository.getById.mockResolvedValue({
        ...user,
        id: friendId,
        coach: null,
        sportsman: null,
      });

      friendRepository.getById.mockResolvedValue({
        ...user,
        coach: null,
        sportsman: null,
      });

      await expect(friendsService.create(userId, friendId)).rejects.toThrowError(ConflictException);
    });

    it('should return friend data', async () => {
      userRepository.getById.mockResolvedValue({
        ...user,
        id: friendId,
        coach: null,
        sportsman: null,
      });

      friendRepository.getById.mockResolvedValue(null);

      const friend = {
        userId,
        friendId,
        status: FriendStatus.Accepted,
      };
      friendRepository.create.mockResolvedValue({
        ...friend
      });

      await expect(friendsService.create(userId, friendId)).resolves.toStrictEqual({...friend});
    });
  });

  describe('getMany', () => {
    it('should return user entities', async () => {
      const users = [
        {
          ...user,
          id: 1,
          sportsman: {
            ...sportsman,
            id: 1,
          },
          coach: null,
        },
        {
          ...user,
          id: 2,
          sportsman: {
            ...sportsman,
            id: 2,
          },
          coach: null,
        },
        {
          ...user,
          id: 3,
          sportsman: null,
          coach: {
            ...coach,
            id: 3,
          },
        },
      ];

      friendRepository.getMany.mockResolvedValue({
        friends: users,
        totalCount: 3,
      });

      const userEntities = users.map((user) => BaseUserEntity.createFromPrisma(user));

      await expect(friendsService.getMany(userId, {page: 0})).resolves.toStrictEqual({
        currentPage: 0,
        totalPages: 1,
        users: userEntities,
      });
    });
  });

  describe('delete', () => {
    it('should throw BadRequestException if userId is equal friendId', async () => {
      await expect(friendsService.delete(userId, userId)).rejects.toThrowError(BadRequestException);
    });

    it('should throw NotFoundException if friend does not exists', async () => {
      friendRepository.getById.mockResolvedValue(null);

      await expect(friendsService.delete(userId, friendId)).rejects.toThrowError(NotFoundException);
    });

    it('should throw InternalServerErrorException if failed to delete a friend', async () => {
      friendRepository.getById.mockResolvedValue({
        ...user,
        coach: null,
        sportsman: null,
      });
      friendRepository.delete.mockResolvedValue({count: 0});

      await expect(friendsService.delete(userId, friendId)).rejects.toThrowError(InternalServerErrorException);
    });

    it('should run without errors', async () => {
      friendRepository.getById.mockResolvedValueOnce({
        ...user,
        coach: null,
        sportsman: null,
      });
      friendRepository.delete.mockResolvedValue({count: 1});

      userRepository.getById.mockResolvedValueOnce({
        ...user,
        coach: null,
        sportsman: null,
      });

      await expect(friendsService.delete(userId, friendId)).resolves;
    });
  });
});
