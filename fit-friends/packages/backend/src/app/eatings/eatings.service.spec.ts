import { Test, TestingModule } from '@nestjs/testing';
import { EatingsService } from './eatings.service';
import {EatingRepository} from './eating.repository';
import {PrismaModule} from '../prisma/prisma.module';
import {DeepMockProxy, mockDeep} from 'jest-mock-extended';
import {EatingType} from '@fit-friends/core';

describe('EatingsService', () => {
  let eatingsService: EatingsService;
  let eatingRepository: DeepMockProxy<EatingRepository>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [EatingsService, EatingRepository],
    })
      .overrideProvider(EatingRepository)
      .useValue(mockDeep<EatingRepository>())
      .compile();

    eatingsService = module.get<EatingsService>(EatingsService);
    eatingRepository = module.get(EatingRepository);
  });

  it('should be defined', () => {
    expect(eatingsService).toBeDefined();
  });

  const date = new Date();
  const userId = 1;
  const eatings = [
    {
      id: 1,
      userId,
      type: EatingType.Breakfast,
      calories: 300,
      createdAt: date,
    },
    {
      id: 2,
      userId,
      type: EatingType.Lunch,
      calories: 300,
      createdAt: date,
    },
    {
      id: 3,
      userId,
      type: EatingType.Dinner,
      calories: 300,
      createdAt: date,
    },
    {
      id: 4,
      userId,
      type: EatingType.Snack,
      calories: 300,
      createdAt: date,
    },
  ];

  describe('getMany', () => {
    it('should return eating list', async () => {
      eatingRepository.getMany.mockResolvedValue({
        eatings: [...eatings],
        count: 4,
      });

      await expect(eatingsService.getMany(userId, {before: date, after: date}, 0)).resolves.toStrictEqual({
        currentPage: 0,
        totalPages: 1,
        items: [...eatings],
      });
    })
  });

  describe('save', () => {
    it('should return eating item', async () => {
      eatingRepository.upsert.mockImplementation((sportsmanId, data) => Promise.resolve(
        data.map((dataItem, index) => ({
          id: index + 1,
          userId: sportsmanId,
          type: dataItem.type,
          createdAt: dataItem.createdAt,
          calories: dataItem.calories,
        }))
      ));

      const dto = eatings.map((eating) => ({
        type: eating.type,
        calories: eating.calories,
        createdAt: eating.createdAt,
      }));

      await expect(eatingsService.save(userId, {items: dto})).resolves.toStrictEqual([
        ...eatings
      ]);
    });
  });
});
