import {SortingOrder} from '@fit-friends/core';
import {IsEnum, IsInt, IsOptional} from 'class-validator';
import {Transform} from 'class-transformer';
import {ApiProperty} from '@nestjs/swagger';

export class GetManyOrdersQuery {
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
    description: 'Сортировать по сумме заказа',
    enum: SortingOrder,
    example: SortingOrder.Descending,
    required: false,
  })
  @IsEnum(SortingOrder)
  @IsOptional()
  sortBySum?: SortingOrder;

  @ApiProperty({
    description: 'Сортировать по количеству покупок',
    enum: SortingOrder,
    example: SortingOrder.Descending,
    required: false,
  })
  @IsEnum(SortingOrder)
  @IsOptional()
  sortByQuantity?: SortingOrder;
}
