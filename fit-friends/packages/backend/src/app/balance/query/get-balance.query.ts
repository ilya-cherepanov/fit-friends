import {OrderType} from '@fit-friends/core';
import {IsEnum, IsInt, IsOptional} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';
import {Transform} from 'class-transformer';

export class GetBalanceQuery {
  @ApiProperty({
    description: 'Номер текущей страницы',
    example: 1,
    required: false,
    default: 0,
  })
  @IsInt()
  @IsOptional()
  @Transform(({value}) => parseInt(value))
  page = 0;

  @ApiProperty({
    description: 'Тип',
    enum: OrderType,
    example: [OrderType.Training],
    isArray: true,
    required: false,
  })
  @IsEnum(OrderType)
  @IsOptional()
  types = [OrderType.Subscription, OrderType.Training];
}
