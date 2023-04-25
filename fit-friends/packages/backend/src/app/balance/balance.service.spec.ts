import {Test, TestingModule} from '@nestjs/testing';
import {BalanceService} from './balance.service';
import {BalanceRepository} from './balance.repository';
import {PrismaModule} from '../prisma/prisma.module';
import {DeepMockProxy, mockDeep} from 'jest-mock-extended';
import {BalanceChangeType, OrderType} from '@fit-friends/core';
import {GetBalanceQuery} from './query/get-balance.query';
import {NotFoundException} from '@nestjs/common';
import {BalanceEntity} from './balance-entity';

describe('BalanceService', () => {
  let balanceService: BalanceService;
  let balanceRepository: DeepMockProxy<BalanceRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PrismaModule,
      ],
      providers: [BalanceService, BalanceRepository],
    })
      .overrideProvider(BalanceRepository)
      .useValue(mockDeep<BalanceRepository>())
      .compile();

    balanceService = module.get<BalanceService>(BalanceService);
    balanceRepository = module.get(BalanceRepository);
  });

  it('should be defined', () => {
    expect(balanceService).toBeDefined();
  });

  describe('getMany', () => {
    const userId = 1;
    const query: GetBalanceQuery = {
      page: 0,
      types: [OrderType.Training],
    };

    const items = [
      {
        id: 1,
        type: OrderType.Training,
        userId: 1,
        remains: 3,
        trainingId: 10,
        gymId: null,
        gym: undefined,
        training: undefined,
      },
      {
        id: 2,
        type: OrderType.Training,
        userId: 1,
        remains: 3,
        trainingId: 20,
        gymId: null,
        gym: undefined,
        training: undefined,
      },
      {
        id: 3,
        type: OrderType.Subscription,
        userId: 1,
        remains: 3,
        trainingId: null,
        gymId: 10,
        gym: undefined,
        training: undefined,
      },
    ];

    it('should return balance', async () => {
      balanceRepository.getMany.mockResolvedValue({
        balanceItems: [
          items[0],
          items[1],
        ],
        count: 2,
      });

      await expect(balanceService.getMany(userId, query)).resolves.toStrictEqual({
        currentPage: query.page,
        totalPages: 1,
        items: [
          items[0],
          items[1],
        ],
      });
    });
  });

  describe('change', () => {
    const userId = 1;

    const changeDTO = {
      type: OrderType.Training,
      id: 1,
      changeType: BalanceChangeType.Increment,
    };

    it('should return updated balance data', async () => {
      const balanceData = {
        id: 1,
        type: OrderType.Training,
        userId: 1,
        remains: 3,
        trainingId: 10,
        gymId: null,
      };
      balanceRepository.findOne.mockResolvedValue({...balanceData});
      balanceRepository.update.mockImplementation((data) => Promise.resolve({
        id: data.id,
        type: data.type,
        gymId: null,
        remains: data.remains,
        trainingId: data.trainingId,
        userId: data.userId,
        gym: undefined,
        training: undefined,
      }));

      await expect(balanceService.change(userId, {...changeDTO})).resolves.toStrictEqual({
        ...balanceData,
        gym: undefined,
        training: undefined,
        remains: 4,
      });
    });

    it('should throw NotFoundException if balance item not exists', async () => {
      balanceRepository.findOne.mockResolvedValue(null);

      await expect(balanceService.change(userId, {...changeDTO})).rejects.toThrowError(NotFoundException);
    });
  });

  describe('upsert', () => {
    const balanceData = {
      id: 1,
      type: OrderType.Training,
      userId: 1,
      remains: 3,
      trainingId: 10,
      gymId: null,
      gym: null,
      training: null,
    };

    it('should return new balance item if it not exists', async () => {
      balanceRepository.findOne.mockResolvedValue(null);

      const balanceEntity = new BalanceEntity({...balanceData});
      balanceRepository.create.mockResolvedValue({...balanceData});

      await expect(balanceService.upsert(balanceEntity))
        .resolves.toStrictEqual({...balanceData});
    });

    it('should return updated balance item it it exists', async () => {
      balanceRepository.findOne.mockResolvedValue({...balanceData});

      const increment = 5;
      const balanceEntity = new BalanceEntity({
        ...balanceData,
        remains: increment,
      });

      balanceRepository.update.mockImplementation(async (data) => ({
        id: data.id,
        type: data.type,
        gymId: null,
        userId: data.userId,
        trainingId: data.trainingId,
        remains: data.remains,
        training: null,
        gym: null,
      }));

      await expect(balanceService.upsert(balanceEntity)).resolves.toStrictEqual({
        ...balanceData,
        remains: balanceData.remains + increment,
      });
    });
  });
});
