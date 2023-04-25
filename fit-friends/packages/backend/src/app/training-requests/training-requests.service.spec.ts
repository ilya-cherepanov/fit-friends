import {Test, TestingModule} from '@nestjs/testing';
import {TrainingRequestsService} from './training-requests.service';
import {PrismaModule} from '../prisma/prisma.module';
import {TrainingRequestRepository} from './training-request.repository';
import {UsersModule} from '../users/users.module';
import {NotificationsModule} from '../notifications/notifications.module';
import {DeepMockProxy, mockDeep} from 'jest-mock-extended';
import {
  Level,
  TrainingRequestStatus,
  TrainingTimeIntervals,
  TrainingType,
  UserRole,
  UserSex,
  Location
} from '@fit-friends/core';
import {BadRequestException, ConflictException, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import {UserRepository} from '../users/user.repository';
import {NotificationsService} from '../notifications/notifications.service';

describe('TrainingRequestsService', () => {
  let trainingRequestsService: TrainingRequestsService;
  let trainingRequestRepository: DeepMockProxy<TrainingRequestRepository>;
  let userRepository: DeepMockProxy<UserRepository>;
  let notificationsService: DeepMockProxy<NotificationsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PrismaModule,
        UsersModule,
        NotificationsModule,
      ],
      providers: [TrainingRequestsService, TrainingRequestRepository],
    })
      .overrideProvider(TrainingRequestRepository)
      .useValue(mockDeep<TrainingRequestRepository>())
      .overrideProvider(UserRepository)
      .useValue(mockDeep<UserRepository>())
      .overrideProvider(NotificationsService)
      .useValue(mockDeep<NotificationsService>())
      .compile();

    trainingRequestsService = module.get<TrainingRequestsService>(TrainingRequestsService);
    trainingRequestRepository = module.get(TrainingRequestRepository);
    userRepository = module.get(UserRepository);
    notificationsService = module.get(NotificationsService);
  });

  it('should be defined', () => {
    expect(trainingRequestsService).toBeDefined();
  });

  const initiatorJwt = {
    sub: 1,
    role: UserRole.Sportsman,
  };

  const targetJwt = {
    sub: 2,
    role: UserRole.Sportsman,
  };

  const user = {
    id: 1,
    role: UserRole.Sportsman,
    sex: UserSex.Male,
    level: Level.Amateur,
    email: 'sportsman@mail.com',
    password: 'password1234',
    location: Location.Zvezdnaya,
    trainingTypes: [TrainingType.Pilates, TrainingType.Yoga],
    avatar: 'avatar.jpg',
    name: 'Valeria',
    birthDate: new Date(),
    createdAt: new Date(),
    refreshToken: null,
  };

  const sportsman = {
    id: 1,
    trainingDuration: TrainingTimeIntervals.OneHundredToOneHundredTwenty,
    caloriesPerDay: 1000,
    caloriesToLose: 2000,
    readyToTraining: true,
  };

  const targetUser = {
    ...user,
    id: targetJwt.sub,
    sportsman: {
      ...sportsman,
      id: targetJwt.sub,
    },
    coach: null,
  };

  const trainingRequest = {
    id: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    initiatorId: initiatorJwt.sub,
    targetUserId: targetJwt.sub,
    status: TrainingRequestStatus.UnderConsideration,
  };

  describe('create', () => {
    it('should throw BadRequestException if initiator id equals target id', async () => {
      await expect(trainingRequestsService.create(initiatorJwt, initiatorJwt.sub))
        .rejects.toThrowError(BadRequestException);
    })

    it('should throw NotFoundException if target target user not exists', async () => {
      userRepository.getById.mockResolvedValue(null);

      await expect(trainingRequestsService.create(initiatorJwt, targetJwt.sub))
        .rejects.toThrowError(NotFoundException)
    });

    it('should throw BadRequestException if target user not ready for training', async () => {
      userRepository.getById.mockResolvedValue({
        ...targetUser,
        sportsman: {
          ...sportsman,
          readyToTraining: false,
        },
      });

      await expect(trainingRequestsService.create(initiatorJwt, targetJwt.sub))
        .rejects.toThrowError(BadRequestException);
    });

    it('should throw ConflictException if training not exists', async () => {
      userRepository.getById.mockResolvedValue({...targetUser});

      trainingRequestRepository.getById.mockResolvedValue({...trainingRequest});

      await expect(trainingRequestsService.create(initiatorJwt, targetJwt.sub))
        .rejects.toThrowError(ConflictException);
    });

    it('should return new training request data', async () => {
      userRepository.getById.mockResolvedValueOnce({...targetUser});
      trainingRequestRepository.getById.mockResolvedValue(null);
      trainingRequestRepository.create.mockResolvedValue({...trainingRequest});
      userRepository.getById.mockResolvedValueOnce({
        ...targetUser,
        id: initiatorJwt.sub,
        sportsman: {
          ...sportsman,
          id: initiatorJwt.sub,
        },
      });

      await expect(trainingRequestsService.create(initiatorJwt, targetJwt.sub))
        .resolves.toStrictEqual({...trainingRequest});
      expect(notificationsService.create).toBeCalledWith(
        targetJwt.sub,
        `Пользователь ${user.name} отправил вам запрос на тренировку`
      );
    });
  });

  describe('accept', () => {
    it('should throw NotFoundException if training request not exits', async () => {
      trainingRequestRepository.getById.mockResolvedValue(null);

      await expect(trainingRequestsService.accept(targetJwt, initiatorJwt.sub))
        .rejects.toThrowError(NotFoundException);
    });

    it('should throw ConflictException if training request has wrong status', async () => {
      trainingRequestRepository.getById.mockResolvedValue({
        ...trainingRequest,
        status: TrainingRequestStatus.Rejected,
      });

      await expect(trainingRequestsService.accept(targetJwt, initiatorJwt.sub))
        .rejects.toThrowError(ConflictException);
    });

    it('should throw InternalServerErrorException if failed to change request status', async () => {
      trainingRequestRepository.getById.mockResolvedValue({
        ...trainingRequest,
      });

      trainingRequestRepository.accept.mockResolvedValue(false);

      await expect(trainingRequestsService.accept(targetJwt, initiatorJwt.sub))
        .rejects.toThrowError(InternalServerErrorException);
    });

    it('should return true if target user successfully accepted request', async () => {
      trainingRequestRepository.getById.mockResolvedValue({
        ...trainingRequest,
      });

      trainingRequestRepository.accept.mockResolvedValue(true);

      userRepository.getById.mockResolvedValue({
        ...user,
        id: targetJwt.sub,
        sportsman: {
          ...sportsman,
          id: targetJwt.sub,
        },
        coach: null,
      });

      await expect(trainingRequestsService.accept(targetJwt, initiatorJwt.sub))
        .resolves.toBeTruthy();
      expect(notificationsService.create).toBeCalledWith(
        initiatorJwt.sub,
        `Пользователь ${user.name} принял ваше приглашение на тренировку`
      );
    });
  });

  describe('reject', () => {
    it('should throw NotFoundException if training request not exits', async () => {
      trainingRequestRepository.getById.mockResolvedValue(null);

      await expect(trainingRequestsService.reject(targetJwt, initiatorJwt.sub))
        .rejects.toThrowError(NotFoundException);
    });

    it('should throw ConflictException if training request has wrong status', async () => {
      trainingRequestRepository.getById.mockResolvedValue({
        ...trainingRequest,
        status: TrainingRequestStatus.Rejected,
      });

      await expect(trainingRequestsService.reject(targetJwt, initiatorJwt.sub))
        .rejects.toThrowError(ConflictException);
    });

    it('should throw InternalServerErrorException if failed to change request status', async () => {
      trainingRequestRepository.getById.mockResolvedValue({
        ...trainingRequest,
      });

      trainingRequestRepository.reject.mockResolvedValue(false);

      await expect(trainingRequestsService.reject(targetJwt, initiatorJwt.sub))
        .rejects.toThrowError(InternalServerErrorException);
    });

    it('should return true if target user successfully rejected request', async () => {
      trainingRequestRepository.getById.mockResolvedValue({
        ...trainingRequest,
      });

      trainingRequestRepository.reject.mockResolvedValue(true);

      userRepository.getById.mockResolvedValue({
        ...user,
        id: targetJwt.sub,
        sportsman: {
          ...sportsman,
          id: targetJwt.sub,
        },
        coach: null,
      });

      await expect(trainingRequestsService.reject(targetJwt, initiatorJwt.sub))
        .resolves.toBeTruthy();
      expect(notificationsService.create).toBeCalledWith(
        initiatorJwt.sub,
        `Пользователь ${user.name} отклонил ваше приглашение на тренировку`
      );
    });
  });

  describe('delete', () => {
    it('should throw NotFoundException if training request not exits', async () => {
      trainingRequestRepository.getById.mockResolvedValue(null);

      await expect(trainingRequestsService.clear(initiatorJwt.sub, targetJwt.sub))
        .rejects.toThrowError(NotFoundException);
    });

    it('should return true if training request successfully deleted', async () => {
      trainingRequestRepository.getById.mockResolvedValue({
        ...trainingRequest,
      });

      trainingRequestRepository.clearRequest.mockResolvedValue(true);

      await expect(trainingRequestsService.clear(initiatorJwt.sub, targetJwt.sub))
        .resolves.toBeTruthy();
    });
  });
});
