import {OrdersService} from './orders.service';
import {OrderRepository} from './order.repository';
import {PrismaModule} from '../prisma/prisma.module';
import {TrainingsModule} from '../trainings/trainings.module';
import {BalanceModule} from '../balance/balance.module';
import {Test, TestingModule} from '@nestjs/testing';
import {TrainingRepository} from '../trainings/training.repository';
import {DeepMockProxy, mockDeep} from 'jest-mock-extended';
import {BalanceService} from '../balance/balance.service';
import {NotImplementedException} from '@nestjs/common';
import {
  Level,
  OrderPaymentMethod,
  OrderType,
  TrainingDescription,
  TrainingTimeIntervals, TrainingTitle,
  TrainingType,
  UserSex
} from '@fit-friends/core';
import {faker} from '@faker-js/faker/locale/ru';
import {random} from 'lodash';


describe('OrdersService', () => {
  let ordersService: OrdersService;
  let trainingRepository: DeepMockProxy<TrainingRepository>;
  let balanceService: DeepMockProxy<BalanceService>;
  let orderRepository: DeepMockProxy<OrderRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PrismaModule,
        TrainingsModule,
        BalanceModule,
      ],
      providers: [OrdersService, OrderRepository],
    })
      .overrideProvider(TrainingRepository)
      .useValue(mockDeep<TrainingRepository>())
      .overrideProvider(BalanceService)
      .useValue(mockDeep<BalanceService>())
      .overrideProvider(OrderRepository)
      .useValue(mockDeep<OrderRepository>())
      .compile();

    ordersService = module.get(OrdersService);
    trainingRepository = module.get(TrainingRepository);
    balanceService = module.get(BalanceService);
    orderRepository = module.get(OrderRepository);
  });

  it('should be defined', () => {
    expect(ordersService).toBeDefined();
  });

  const sportsmanId = 1;
  const coachId = 2;

  const dto = {
    id: 1,
    type: OrderType.Training,
    quantity: 10,
    paymentMethod: OrderPaymentMethod.Visa
  };

  const training = {
    id: dto.id,
    rating: 4.5,
    sex: UserSex.Female,
    type: TrainingType.Yoga,
    coachId,
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

  const trainingOrder = {
    id: 1,
    type: training.type,
    gymId: null,
    trainingId: training.id,
    price: dto.quantity * training.price,
    sum: dto.quantity * training.price,
    quantity: dto.quantity,
    userId: sportsmanId,
    paymentMethod: dto.paymentMethod,
    createdAt: new Date(),
  };

  const balanceItem = {
    id: 1,
    userId: sportsmanId,
    gymId: null,
    trainingId: training.id,
    type: trainingOrder.type,
    remains: trainingOrder.quantity,
    training: null,
    gym: null,
  };

  describe('create', () => {
    it('should throw NotImplementedException if order type is not training', async () => {
      await expect(ordersService.create({...dto, type: OrderType.Subscription}, sportsmanId))
        .rejects.toThrowError(NotImplementedException);
    });

    it('should return order data', async () => {
      trainingRepository.getById.mockResolvedValue({...training});
      orderRepository.create.mockResolvedValue({...trainingOrder});
      balanceService.upsert.mockResolvedValue({...balanceItem});

      await expect(ordersService.create({...dto}, sportsmanId))
        .resolves.toStrictEqual({...trainingOrder});
      expect(balanceService.upsert).toBeCalled();
    });
  });

  describe('getMany', () => {
    it('should return order list data', async () => {
      const trainings = [
        {
          ...training,
          id: 1,
          sum: random(100, 10000),
          quantity: random(10, 20),
        },
        {
          ...training,
          id: 2,
          sum: random(100, 10000),
          quantity: random(10, 20),
        },
        {
          ...training,
          id: 3,
          sum: random(100, 10000),
          quantity: random(10, 20),
        }
      ];

      const page = 0;

      orderRepository.getMany.mockResolvedValue(trainings.map((training) => ({...training})));
      orderRepository.count.mockResolvedValue(trainings.length);

      await expect(ordersService.getMany(sportsmanId, {page})).resolves.toStrictEqual({
        totalPages: 1,
        currentPage: page,
        items: trainings.map((training) => ({...training})),
      });
    });
  });
});
