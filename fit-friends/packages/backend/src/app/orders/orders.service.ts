import {Injectable, NotImplementedException} from '@nestjs/common';
import {OrderRepository} from './order.repository';
import {CreateOrderDTO} from './dto/create-order.dto';
import {MAX_COLLECTION_LENGTH, OrderType} from '@fit-friends/core';
import {TrainingRepository} from '../trainings/training.repository';
import {GetManyOrdersQuery} from './query/get-many-orders.query';
import {BalanceService} from '../balance/balance.service';
import {BalanceEntity} from '../balance/balance-entity';
import {GymRepository} from '../gyms/gym.repository';


@Injectable()
export class OrdersService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly trainingRepository: TrainingRepository,
    private readonly gymRepository: GymRepository,
    private readonly balanceService: BalanceService,
  ) {}

  async create(dto: CreateOrderDTO, sportsmanId: number) {
    if (dto.type === OrderType.Training) {
      return this.createTrainingOrder(dto, sportsmanId);
    }

    return this.createGymOrder(dto, sportsmanId);
  }

  async getMany(userId: number, query: GetManyOrdersQuery) {
    const skip = query.page * MAX_COLLECTION_LENGTH;

    const trainings = await this.orderRepository.getMany(MAX_COLLECTION_LENGTH, skip, userId, {
      orderBySum: query.sortBySum,
      orderByQuantity: query.sortByQuantity,
    });

    const count = await this.orderRepository.count(userId);

    return {
      totalPages: Math.ceil(count / MAX_COLLECTION_LENGTH),
      currentPage: query.page,
      items: trainings,
    };
  }

  private async createGymOrder(dto: CreateOrderDTO, sportsmanId: number) {
    const gym = await this.gymRepository.getById(dto.id);

    const order = await this.orderRepository.create({
      type: dto.type,
      price: gym.price,
      quantity: dto.quantity,
      sum: gym.price * dto.quantity,
      paymentMethod: dto.paymentMethod,
      userId: sportsmanId,
      trainingId: null,
      gymId: gym.id,
    });

    const balanceEntity = new BalanceEntity({
      type: OrderType.Subscription,
      userId: sportsmanId,
      gymId: dto.id,
      remains: dto.quantity,
    });

    await this.balanceService.upsert(balanceEntity);

    return order;
  }

  private async createTrainingOrder(dto: CreateOrderDTO, sportsmanId: number) {
    const training = await this.trainingRepository.getById(dto.id);

    const order = await this.orderRepository.create({
      type: dto.type,
      price: training.price,
      quantity: dto.quantity,
      sum: training.price * dto.quantity,
      paymentMethod: dto.paymentMethod,
      userId: sportsmanId,
      trainingId: dto.id,
      gymId: null,
    });

    const balanceEntity = new BalanceEntity({
      type: OrderType.Training,
      userId: sportsmanId,
      trainingId: dto.id,
      remains: dto.quantity,
    });

    await this.balanceService.upsert(balanceEntity);

    return order;
  }
}
