import {OrderResponse} from '@fit-friends/shared-types';
import {OrderPaymentMethod, OrderTrainingCount, OrderType} from '@fit-friends/core';
import {ApiProperty} from '@nestjs/swagger';


export class OrderRDO implements OrderResponse {
  @ApiProperty({
    description: 'ID покупки',
    example: 41,
  })
  id: number;

  @ApiProperty({
    description: 'Способ оплаты',
    enum: OrderPaymentMethod,
    example: OrderPaymentMethod.Visa,
  })
  paymentMethod: OrderPaymentMethod;

  @ApiProperty({
    description: 'Цена за единицу',
    example: 1000,
  })
  price: number;

  @ApiProperty({
    description: 'Количество',
    minimum: OrderTrainingCount.Min,
    maximum: OrderTrainingCount.Max,
    example: 12,
  })
  quantity: number;

  @ApiProperty({
    description: 'Сумма покупки',
    example: 12000,
  })
  sum: number;

  @ApiProperty({
    description: 'Тип услуги(тренировка или абонимент)',
    enum: OrderType,
    example: OrderType.Training,
  })
  type: OrderType;

  @ApiProperty({
    description: 'Дата покупки',
    example: '2023-03-10T15:18:29.847Z',
  })
  createdAt: string;
}
