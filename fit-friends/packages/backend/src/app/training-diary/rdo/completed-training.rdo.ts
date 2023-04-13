import {Expose} from 'class-transformer';
import {TrainingTimeIntervals} from '@fit-friends/core';
import {ApiProperty} from '@nestjs/swagger';

export class CompletedTrainingRDO {
  @ApiProperty({
    description: 'Идетрификатор законченной тренировки',
    example: 123,
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: 'Дата выполнения тренировки',
    example: '2023-04-09T21:12:09.862Z',
  })
  @Expose()
  createdAt: string;

  @ApiProperty({
    description: 'Потрачено калорий на тренировке',
    example: 1100,
  })
  @Expose()
  calories: number;

  @ApiProperty({
    description: 'Длительность тренировки',
    enum: TrainingTimeIntervals,
    example: TrainingTimeIntervals.OneHundredToOneHundredTwenty,
  })
  @Expose()
  duration: TrainingTimeIntervals;

  @ApiProperty({
    description: 'Идентификатор тренировки',
    example: 24,
  })
  @Expose()
  trainingId: number;
}
