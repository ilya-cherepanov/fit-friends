import {Expose} from 'class-transformer';
import {EatingType} from '@fit-friends/core';
import {ApiProperty} from '@nestjs/swagger';
import {EatingResponse} from '@fit-friends/shared-types';


export class EatingRDO implements EatingResponse {
  @ApiProperty({
    description: 'Идентификатор приема пищи',
    example: 10,
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: 'Время приема пищи',
    enum: EatingType,
    example: EatingType.Dinner,
  })
  @Expose()
  type: EatingType

  @ApiProperty({
    description: 'Калорийность приема пищи',
    example: 400,
  })
  @Expose()
  calories: number;

  @ApiProperty({
    description: 'Дата приема пищи',
    example: '2023-04-16T16:05:58.770Z',
  })
  @Expose()
  createdAt: string;
}
