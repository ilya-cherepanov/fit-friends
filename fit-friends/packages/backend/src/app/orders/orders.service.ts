import {Injectable, NotImplementedException} from '@nestjs/common';
import {OrderRepository} from './order.repository';
import {CreateOrderDTO} from './dto/create-order.dto';
import {MAX_COLLECTION_LENGTH, OrderType} from '@fit-friends/core';
import {TrainingRepository} from '../trainings/training.repository';
import {GetManyOrdersQuery} from './query/get-many-orders.query';


@Injectable()
export class OrdersService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly trainingRepository: TrainingRepository,
  ) {}

  async create(dto: CreateOrderDTO, sportsmanId: number) {
    if (dto.type === OrderType.Training) {
      return this.createTrainingOrder(dto, sportsmanId);
    }

    throw new NotImplementedException();
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

  private async createTrainingOrder(dto: CreateOrderDTO, sportsmanId: number) {
    const training = await this.trainingRepository.getById(dto.id);

    return this.orderRepository.create({
      type: dto.type,
      price: training.price,
      quantity: dto.quantity,
      sum: training.price * dto.quantity,
      paymentMethod: dto.paymentMethod,
      userId: sportsmanId,
      trainingId: dto.id,
      gymId: null,
    });
  }
}
