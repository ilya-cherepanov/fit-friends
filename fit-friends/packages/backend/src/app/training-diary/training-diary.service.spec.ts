import { Test, TestingModule } from '@nestjs/testing';
import { TrainingDiaryService } from './training-diary.service';
import {TrainingDiaryRepository} from './training-diary.repository';
import {TrainingsModule} from '../trainings/trainings.module';
import {PrismaModule} from '../prisma/prisma.module';
import {DeepMockProxy, mockDeep} from 'jest-mock-extended';
import {
  Level,
  TrainingDescription,
  TrainingTimeIntervals,
  TrainingTitle,
  TrainingType,
  UserSex,
  Location, OrderType,
} from '@fit-friends/core';
import {BalanceModule} from '../balance/balance.module';
import {TrainingRepository} from '../trainings/training.repository';
import {ForbiddenException, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import {faker} from '@faker-js/faker/locale/ru';
import {BalanceService} from '../balance/balance.service';
import {BALANCE_CANNOT_BE_NEGATIVE} from '../../constants';


describe('TrainingDiaryService', () => {
  let trainingDiaryService: TrainingDiaryService;
  let trainingDiaryRepository: DeepMockProxy<TrainingDiaryRepository>;
  let trainingRepository: DeepMockProxy<TrainingRepository>;
  let balanceService: DeepMockProxy<BalanceService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TrainingsModule, PrismaModule, BalanceModule],
      providers: [TrainingDiaryService, TrainingDiaryRepository],
    })
      .overrideProvider(TrainingDiaryRepository)
      .useValue(mockDeep<TrainingDiaryRepository>())
      .overrideProvider(TrainingRepository)
      .useValue(mockDeep<TrainingRepository>())
      .overrideProvider(BalanceService)
      .useValue(mockDeep<BalanceService>())
      .compile();

    trainingDiaryService = module.get<TrainingDiaryService>(TrainingDiaryService);
    trainingDiaryRepository = module.get(TrainingDiaryRepository);
    trainingRepository = module.get(TrainingRepository);
    balanceService = module.get(BalanceService);
  });

  it('should be defined', () => {
    expect(trainingDiaryService).toBeDefined();
  });


  const sportsmanId = 1;
  const trainingId = 1;
  const completedTraining = {
    id: 1,
    createdAt: new Date(),
    calories: 1174,
    duration: TrainingTimeIntervals.EightyToOneHundred,
  };

  const training = {
    id: trainingId,
    rating: 4.5,
    sex: UserSex.Female,
    type: TrainingType.Yoga,
    coachId: 1,
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

  describe('getMany', () => {
    const completedTrainings = [
      {
        ...completedTraining,
        id: 1,
        trainingId,
        userId: sportsmanId,
      },
      {
        ...completedTraining,
        id: 2,
        trainingId,
        userId: sportsmanId,
      },
      {
        ...completedTraining,
        id: 3,
        trainingId,
        userId: sportsmanId,
      },
    ];

    const page = 0;

    const dto = {
      after: new Date(),
      before: new Date(),
    };

    it('should return completed trainings list', async () => {
      trainingDiaryRepository.getMany.mockResolvedValue({
        completedTrainings: completedTrainings.map((completedTraining) => ({...completedTraining})),
        totalCount: completedTrainings.length,
      });

      await expect(trainingDiaryService.getMany(sportsmanId, {...dto}, {page}))
        .resolves.toStrictEqual({
          currentPage: page,
          totalPages: 1,
          items: completedTrainings.map((completedTraining) => ({...completedTraining})),
        });
    });
  });

  describe('create', () => {
    it('should throw NotFoundException if training not found', async () => {
      trainingRepository.getById.mockResolvedValue(null);

      await expect(trainingDiaryService.create(sportsmanId, trainingId))
        .rejects.toThrowError(NotFoundException);
    });

    it('should throw ForbiddenException if the balance has become negative', async () => {
      trainingRepository.getById.mockResolvedValue({...training});
      const exception = new InternalServerErrorException(BALANCE_CANNOT_BE_NEGATIVE);
      balanceService.change.mockRejectedValue(exception);

      await expect(trainingDiaryService.create(sportsmanId, trainingId))
        .rejects.toThrowError(ForbiddenException);
    });

    it('should return new completed training data', async () => {
      trainingRepository.getById.mockResolvedValue({...training});

      const balanceItem = {
        id: 1,
        trainingId: training.id,
        userId: sportsmanId,
        gymId: null,
        remains: 10,
        type: OrderType.Training,
        gym: null,
        training: null,
      };
      balanceService.change.mockResolvedValue({...balanceItem});

      const completedTrainingItem = {
        id: 1,
        trainingId: training.id,
        userId: sportsmanId,
        duration: training.duration,
        calories: training.calories,
        createdAt: new Date(),
      };
      trainingDiaryRepository.create.mockResolvedValue({...completedTrainingItem});

      await expect(trainingDiaryService.create(sportsmanId, trainingId))
        .resolves.toStrictEqual({...completedTrainingItem});
    });
  });
});
