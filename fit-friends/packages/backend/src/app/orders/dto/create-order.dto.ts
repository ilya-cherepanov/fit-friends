import {OrderData} from '@fit-friends/shared-types';
import {OrderPaymentMethod, OrderTrainingCount, OrderType} from '@fit-friends/core';
import {IsEnum, IsInt, Max, Min} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';


export class CreateOrderDTO implements OrderData {
  @ApiProperty({
    description: 'Способ оплаты',
    enum: OrderPaymentMethod,
    example: OrderPaymentMethod.Visa,
  })
  @IsEnum(OrderPaymentMethod)
  paymentMethod: OrderPaymentMethod;

  @ApiProperty({
    description: 'Количество',
    minimum: OrderTrainingCount.Min,
    maximum: OrderTrainingCount.Max,
    example: 12,
  })
  @Max(OrderTrainingCount.Max)
  @Min(OrderTrainingCount.Min)
  @IsInt()
  quantity: number;

  @ApiProperty({
    description: 'Тип услуги(тренировка или абонимент)',
    enum: OrderType,
    example: OrderType.Training,
  })
  @IsEnum(OrderType)
  type: OrderType;

  @ApiProperty({
    description: 'Идентификатор зала или тренировки',
    minimum: 0,
    example: 151,
  })
  @Min(0)
  @IsInt()
  id: number;
}
