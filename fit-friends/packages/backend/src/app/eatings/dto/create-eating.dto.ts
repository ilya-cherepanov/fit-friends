import {IsDate, IsEnum, IsInt, Min} from 'class-validator';
import {EatingType} from '@fit-friends/core';
import {ApiProperty} from '@nestjs/swagger';


export class CreateEatingDTO {
  @ApiProperty({
    description: 'Калорийность приема пищи',
    example: 400,
  })
  @Min(0)
  @IsInt()
  calories: number;

  @ApiProperty({
    description: 'Дата приема пищи',
    example: '2023-04-16T16:05:58.770Z',
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'Время приема пищи',
    enum: EatingType,
    example: EatingType.Dinner,
  })
  @IsEnum(EatingType)
  type: EatingType;
}
