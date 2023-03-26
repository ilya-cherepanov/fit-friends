import {MIN_PRICE, TrainingCalories, TrainingDescription, TrainingTitle} from '@fit-friends/core';
import {ApiProperty} from '@nestjs/swagger';
import {Expose} from 'class-transformer';
import {TrainingShortResponse} from '@fit-friends/shared-types';

export class TrainingShortRDO implements TrainingShortResponse {
  @ApiProperty({
    description: 'Идентификатор тренировки',
    example: 143,
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: 'Название тренировки',
    minLength: TrainingTitle.MinLength,
    maxLength: TrainingTitle.MaxLength,
    example: 'Crossfit',
  })
  @Expose()
  title: string;

  @ApiProperty({
    description: 'Количество калорий',
    example: 2000,
    maximum: TrainingCalories.Max,
    minimum: TrainingCalories.Min,
  })
  @Expose()
  calories: number;

  @ApiProperty({
    description: 'Описание тренировки',
    example: 'Сложный комплекс упражнений для профессиональных атлетов на отработку показателей в классическом стиле.',
    minLength: TrainingDescription.MinLength,
    maxLength: TrainingDescription.MaxLength,
  })
  @Expose()
  description: string;

  @ApiProperty({
    description: 'Цена тренировки',
    example: 1200,
    minimum: MIN_PRICE,
  })
  @Expose()
  price: number;

  @ApiProperty({
    description: 'Фоновое изображение',
    example: 'dd98c55d-0101-460c-a962-fd955c1a194c.jpg',
  })
  @Expose()
  image: string;

  @ApiProperty({
    description: 'Рейтинг тренировки',
    example: 3.5,
  })
  @Expose()
  rating: number;
}
