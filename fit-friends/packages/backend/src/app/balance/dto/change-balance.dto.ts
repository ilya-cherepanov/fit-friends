import {BalanceChangeType, OrderType} from '@fit-friends/core';
import {IsEnum, IsInt, Min} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';


export class ChangeBalanceDTO {
  @ApiProperty({
    description: 'Тип записи баланса',
    enum: OrderType,
    example: OrderType.Training
  })
  @IsEnum(OrderType)
  type: OrderType;

  @ApiProperty({
    description: 'Идентификатор тренировки или зала к которому привязан баланс',
    example: 125,
  })
  @Min(0)
  @IsInt()
  id: number;

  @ApiProperty({
    description: 'Тип изменения баланса',
    enum: BalanceChangeType,
    example: BalanceChangeType.Increment,
  })
  @IsEnum(BalanceChangeType)
  changeType: BalanceChangeType;
}
