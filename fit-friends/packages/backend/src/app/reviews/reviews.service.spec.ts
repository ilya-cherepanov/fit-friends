import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsService } from './reviews.service';
import {ReviewRepository} from './review-repository';
import {PrismaModule} from '../prisma/prisma.module';
import {TrainingsModule} from '../trainings/trainings.module';
import {DeepMockProxy, mockDeep} from 'jest-mock-extended';
import {TrainingRepository} from '../trainings/training.repository';
import {faker} from '@faker-js/faker/locale/ru';
import {
  Level,
  ReviewText,
  TrainingDescription,
  TrainingTimeIntervals, TrainingTitle,
  TrainingType, UserRole,
  UserSex, Location
} from '@fit-friends/core';
import {NotFoundException} from '@nestjs/common';
import {Sportsman, User} from '@prisma/client';
import {BaseUserEntity} from '../users/user.entity';


describe('ReviewsService', () => {
  let reviewsService: ReviewsService;
  let reviewRepository: DeepMockProxy<ReviewRepository>;
  let trainingRepository: DeepMockProxy<TrainingRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, TrainingsModule],
      providers: [ReviewsService, ReviewRepository],
    })
      .overrideProvider(ReviewRepository)
      .useValue(mockDeep<ReviewRepository>())
      .overrideProvider(TrainingRepository)
      .useValue(mockDeep<TrainingRepository>())
      .compile();

    reviewsService = module.get<ReviewsService>(ReviewsService);
    reviewRepository = module.get(ReviewRepository);
    trainingRepository = module.get(TrainingRepository);
  });

  it('should be defined', () => {
    expect(reviewsService).toBeDefined();
  });

  const authorId = 1;
  const trainingId = 1;

  const training = {
    id: trainingId,
    rating: 4.5,
    sex: UserSex.Female,
    type: TrainingType.Yoga,
    coachId: 2,
    price: 1000,
    level: Level.Amateur,
    calories: 200,
    description: faker.random.alphaNumeric(TrainingDescription.MinLength + 1),
    duration: TrainingTimeIntervals.OneHundredToOneHundredTwenty,
    isSpecialOffer: true,
    image: 'training.jpg',
    isNew: false,
    title: faker.random.alphaNumeric(TrainingTitle.MinLength + 1),
    video: 'video.mp4',
    coach: null,
  };

  const dto = {
    trainingId: 1,
    text: faker.random.alphaNumeric(ReviewText.MinLength + 1),
    rating: 4,
  };

  const review = {
    id: 1,
    text: dto.text,
    trainingId: dto.trainingId,
    authorId,
    rating: dto.rating,
    createdAt: new Date(),
  };

  const user: User = {
    id: authorId,
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

  describe('create', () => {
    it('should throw NotFoundException if training not found', async () => {
      trainingRepository.getById.mockResolvedValue(null)

      await expect(reviewsService.create(authorId, {...dto})).rejects.toThrowError(NotFoundException);
    });

    it('should return review data', async () => {
      trainingRepository.getById.mockResolvedValue({
        ...training,
      });

      reviewRepository.create.mockImplementation(async (authorId, data) => ({
        ...review,
        authorId,
        rating: data.rating,
        text: data.text,
        trainingId: data.trainingId,
        author: {
          ...user,
          sportsman: {
            ...sportsman
          },
        },
      }));

      const authorEntity = BaseUserEntity.createFromPrisma({
        ...user,
        sportsman: {
          ...sportsman,
        }
      });

      await expect(reviewsService.create(authorId, dto)).resolves.toStrictEqual({
        ...review,
        author: authorEntity,
      });
    });
  });

  describe('getMany', () => {
    const page = 0;

    it('should throw NotFoundException if training not found', async () => {
      trainingRepository.getById.mockResolvedValue(null)

      await expect(reviewsService.getMany(trainingId, page)).rejects.toThrowError(NotFoundException);
    });

    it('should return list of reviews', async () => {
      trainingRepository.getById.mockResolvedValue({
        ...training,
      });

      const reviews = Array.from({length: 3}, (value, key) => ({
        ...review,
        id: key + 1,
        author: {
          ...user,
          sportsman: {
            ...sportsman,
          },
        },
      }));

      reviewRepository.getMany.mockResolvedValue({
        reviews: reviews.map((review) => ({...review})),
        count: reviews.length,
      });

      await expect(reviewsService.getMany(trainingId, page)).resolves.toStrictEqual({
        currentPage: page,
        totalPages: 1,
        items: reviews.map((review) => ({
          ...review,
          author: BaseUserEntity.createFromPrisma(review.author),
        })),
      });
    });
  });
});
