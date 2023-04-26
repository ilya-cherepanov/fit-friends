import {TrainingsService} from './trainings.service';
import {DeepMockProxy, mockDeep} from 'jest-mock-extended';
import {TrainingRepository} from './training.repository';
import {UserRepository} from '../users/user.repository';
import {Test} from '@nestjs/testing';
import {PrismaModule} from '../prisma/prisma.module';
import {UsersModule} from '../users/users.module';
import {BadRequestException, ForbiddenException, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import {
  Level,
  Location,
  TrainingDescription,
  TrainingTimeIntervals,
  TrainingTitle,
  TrainingType,
  UserRole,
  UserSex
} from '@fit-friends/core';
import {Coach, Sportsman, User} from '@prisma/client';
import {faker} from '@faker-js/faker/locale/ru';
import {BaseUserEntity} from '../users/user.entity';
import {getRandomTrainingImage} from '../../utils/image';

jest.mock('../../utils/image');

describe('TrainingService', () => {
  let trainingsService: TrainingsService;
  let trainingRepository: DeepMockProxy<TrainingRepository>;
  let userRepository: DeepMockProxy<UserRepository>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [PrismaModule, UsersModule],
      providers: [TrainingsService, TrainingRepository],
    })
      .overrideProvider(TrainingRepository)
      .useValue(mockDeep<TrainingRepository>())
      .overrideProvider(UserRepository)
      .useValue(mockDeep<UserRepository>())
      .compile();

    trainingsService = module.get(TrainingsService);
    trainingRepository = module.get(TrainingRepository);
    userRepository = module.get(UserRepository);
  });

  it('should be defined', () => {
    expect(trainingsService).toBeDefined();
  });

  const coachId = 1;

  const user: User = {
    id: coachId,
    role: UserRole.Coach,
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
    id: coachId,
    certificate: 'certificate.png',
    achievements: 'Achievements',
    hasPersonalTrainings: true,
  };

  const trainingId = 1;

  const training = {
    id: trainingId,
    rating: 4.5,
    sex: UserSex.Female,
    type: TrainingType.Yoga,
    coachId: coachId,
    price: 1000,
    level: Level.Amateur,
    calories: 200,
    description: faker.random.alphaNumeric(TrainingDescription.MinLength + 1),
    duration: TrainingTimeIntervals.OneHundredToOneHundredTwenty,
    isSpecialOffer: false,
    image: 'training.jpg',
    isNew: false,
    title: faker.random.alphaNumeric(TrainingTitle.MinLength + 1),
    video: 'video.mp4',
    coach: null,
  };

  describe('get', () => {

    it('should throw NotFoundException if training not found', async () => {
      trainingRepository.getById.mockResolvedValue(null);

      await expect(trainingsService.get(trainingId)).rejects.toThrowError(NotFoundException);
    });

    it('should throw InternalServerErrorException if user not coach not found', async () => {
      trainingRepository.getById.mockResolvedValue({...training});
      userRepository.getById.mockResolvedValue({
        ...user,
        role: UserRole.Sportsman,
        coach: null,
        sportsman: {
          ...sportsman,
        },
      });

      await expect(trainingsService.get(trainingId)).rejects.toThrowError(InternalServerErrorException);
    });

    it('should return training data', async () => {
      trainingRepository.getById.mockResolvedValue({...training});
      userRepository.getById.mockResolvedValue({
        ...user,
        coach: {
          ...coach,
        },
        sportsman: null,
      });

      const coachEntity = BaseUserEntity.createFromPrisma({
        ...user,
        sportsman: null,
        coach: {
          ...coach,
        },
      });

      await expect(trainingsService.get(trainingId)).resolves.toStrictEqual({
        ...training,
        coach: coachEntity,
      });
    });
  });

  describe('getMany', () => {
    const trainings = [
      {
        ...training,
        id: 1,
      },
      {
        ...training,
        id: 2,
      },
      {
        ...training,
        id: 3,
      },
    ];

    it('should return training list', async () => {
      trainingRepository.getMany.mockResolvedValue(trainings.map((training) => ({...training})));
      trainingRepository.count.mockResolvedValue(trainings.length);

      const page = 0;

      await expect(trainingsService.getMany({page})).resolves.toStrictEqual({
        currentPage: page,
        totalPages: 1,
        items: trainings.map((training) => ({...training})),
      });
    });
  });

  describe('create', () => {
    const video = training.video;

    const dto = {
      sex: training.sex as UserSex,
      type: training.type as TrainingType,
      description: training.description,
      calories: training.calories,
      title: training.title,
      price: training.price,
      video,
      duration: training.duration as TrainingTimeIntervals,
    };

    it('should throw InternalServerErrorException if user not coach not found', async () => {
      userRepository.getById.mockResolvedValue({
        ...user,
        role: UserRole.Sportsman,
        coach: null,
        sportsman: {
          ...sportsman,
        },
      });

      await expect(trainingsService.create({...dto}, coachId, video))
        .rejects.toThrowError(InternalServerErrorException);
    });

    it('should throw BadRequestException if coach not has a specialization', async () => {
      userRepository.getById.mockResolvedValue({
        ...user,
        coach: {
          ...coach,
        },
        sportsman: null,
      });

      await expect(trainingsService.create({...dto, type: TrainingType.Box}, coachId, video))
        .rejects.toThrowError(BadRequestException);
    });

    it('should return new training data', async () => {
      const trainingImage = 'training-image.jpg';
      jest.mocked(getRandomTrainingImage).mockResolvedValue(trainingImage);

      userRepository.getById.mockResolvedValue({
        ...user,
        coach: {
          ...coach,
        },
        sportsman: null,
      });

      const coachEntity = BaseUserEntity.createFromPrisma({
        ...user,
        sportsman: null,
        coach: {
          ...coach,
        },
      });

      trainingRepository.create.mockImplementation(async (data, coachId) => ({
        id: trainingId,
        level: data.level,
        isSpecialOffer: data.isSpecialOffer,
        video: data.video,
        image: data.image,
        coachId,
        sex: data.sex,
        rating: data.rating,
        title: data.title,
        price: data.price,
        type: data.type,
        duration: data.duration,
        isNew: true,
        description: data.description,
        calories: data.calories,
      }));

      await expect(trainingsService.create({...dto}, coachId, video))
        .resolves.toStrictEqual({
          ...training,
          isNew: true,
          coachId,
          rating: undefined,
          image: trainingImage,
          coach: coachEntity,
        });
    });
  });

  describe('update', () => {
    const dto = {
      title: 'new title',
      description: 'new description',
    };

    it('should throw InternalServerErrorException if user not coach not found', async () => {
      userRepository.getById.mockResolvedValue({
        ...user,
        role: UserRole.Sportsman,
        coach: null,
        sportsman: {
          ...sportsman,
        },
      });

      await expect(trainingsService.update(trainingId, {...dto}, coachId, null))
        .rejects.toThrowError(InternalServerErrorException);
    });

    it('should throw BadRequestException if coach not has a specialization', async () => {
      userRepository.getById.mockResolvedValue({
        ...user,
        coach: {
          ...coach,
        },
        sportsman: null,
      });

      trainingRepository.getById.mockResolvedValue({
        ...training,
      });

      await expect(trainingsService.update(trainingId, {...dto, type: TrainingType.Box}, coachId, null))
        .rejects.toThrowError(BadRequestException);
    });

    it('should throw NotFoundException if training not found', async () => {
      userRepository.getById.mockResolvedValue({
        ...user,
        coach: {
          ...coach,
        },
        sportsman: null,
      });

      trainingRepository.getById.mockResolvedValue(null);

      await expect(trainingsService.update(trainingId, {...dto}, coachId, null))
        .rejects.toThrowError(NotFoundException);
    });

    it('should throw ForbiddenException if coach is not owner of training', async () => {
      userRepository.getById.mockResolvedValue({
        ...user,
        coach: {
          ...coach,
        },
        sportsman: null,
      });

      trainingRepository.getById.mockResolvedValue({
        ...training,
        coachId: coachId + 1,
      });

      await expect(trainingsService.update(trainingId, {...dto}, coachId, null))
        .rejects.toThrowError(ForbiddenException);
    });

    it('should return updated training data', async () => {
      userRepository.getById.mockResolvedValue({
        ...user,
        coach: {
          ...coach,
        },
        sportsman: null,
      });

      const coachEntity = BaseUserEntity.createFromPrisma({
        ...user,
        sportsman: null,
        coach: {
          ...coach,
        },
      });

      trainingRepository.getById.mockResolvedValue({
        ...training,
      });

      trainingRepository.update.mockImplementation(async (data) => ({
        ...training,
        title: data.title,
        description: data.description,
      }));

      await expect(trainingsService.update(trainingId, {...dto}, coachId, null))
        .resolves.toStrictEqual({
          ...training,
          ...dto,
          coach: coachEntity,
        });
    });
  });
});
