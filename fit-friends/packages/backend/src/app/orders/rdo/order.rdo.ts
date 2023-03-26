import {OrderResponse} from '@fit-friends/shared-types';
import {OrderPaymentMethod, OrderTrainingCount, OrderType} from '@fit-friends/core';
import {ApiProperty} from '@nestjs/swagger';
import {Expose} from 'class-transformer';


export class OrderRDO implements OrderResponse {
  @ApiProperty({
    description: 'ID покупки',
    example: 41,
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: 'Способ оплаты',
    enum: OrderPaymentMethod,
    example: OrderPaymentMethod.Visa,
  })
  @Expose()
  paymentMethod: OrderPaymentMethod;

  @ApiProperty({
    description: 'Цена за единицу',
    example: 1000,
  })
  @Expose()
  price: number;

  @ApiProperty({
    description: 'Количество',
    minimum: OrderTrainingCount.Min,
    maximum: OrderTrainingCount.Max,
    example: 12,
  })
  @Expose()
  quantity: number;

  @ApiProperty({
    description: 'Сумма покупки',
    example: 12000,
  })
  @Expose()
  sum: number;

  @ApiProperty({
    description: 'Тип услуги(тренировка или абонимент)',
    enum: OrderType,
    example: OrderType.Training,
  })
  @Expose()
  type: OrderType;

  @ApiProperty({
    description: 'Дата покупки',
    example: '2023-03-10T15:18:29.847Z',
  })
  @Expose()
  createdAt: string;
}
